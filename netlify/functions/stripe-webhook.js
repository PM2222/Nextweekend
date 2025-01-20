const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

// Environment variable validation with detailed logging
const validateEnv = () => {
  const required = {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
  };

  const missing = Object.entries(required)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    console.error('Environment validation failed. Missing variables:', missing);
    throw new Error(`Required environment variables missing: ${missing.join(', ')}`);
  }

  return true;
};

// Initialize services with better error handling
const initializeServices = () => {
  try {
    validateEnv();

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    });

    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    return { stripe, supabase };
  } catch (error) {
    console.error('Service initialization failed:', error);
    throw error;
  }
};

exports.handler = async (event) => {
  console.log('Webhook received');
  
  try {
    // Initialize services
    const { stripe, supabase } = initializeServices();

    // Verify Stripe signature
    const signature = event.headers['stripe-signature'];
    if (!signature) {
      console.error('No Stripe signature found in headers');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No Stripe signature found' })
      };
    }

    // Construct and verify the event
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('Processing webhook event:', stripeEvent.type);

    // Handle subscription events
    if (stripeEvent.type === 'customer.subscription.created' ||
        stripeEvent.type === 'customer.subscription.updated') {
      const subscription = stripeEvent.data.object;
      const customerId = subscription.customer;

      // Get customer details
      const customer = await stripe.customers.retrieve(customerId);
      if (!customer.email) {
        throw new Error('Customer email not found');
      }

      console.log('Updating subscription for customer:', customer.email);

      // Update profile in Supabase
      const { data, error } = await supabase
        .from('profiles')
        .update({
          stripe_customer_id: customerId,
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          subscription_tier: subscription.items.data[0].price.lookup_key,
          subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', customer.email)
        .select();

      if (error) {
        console.error('Failed to update Supabase:', error);
        throw error;
      }

      console.log('Successfully updated subscription for:', customer.email);

      return {
        statusCode: 200,
        body: JSON.stringify({
          received: true,
          type: stripeEvent.type,
          email: customer.email
        })
      };
    }

    // Handle other event types
    return {
      statusCode: 200,
      body: JSON.stringify({
        received: true,
        type: stripeEvent.type
      })
    };

  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: error.message,
        env: {
          hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
          hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
          hasSupabaseUrl: !!process.env.VITE_SUPABASE_URL,
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      })
    };
  }
};