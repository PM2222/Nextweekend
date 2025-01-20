const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

// Check required environment variables
const requiredEnvVars = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'VITE_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Initialize Stripe and Supabase
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { 
  apiVersion: '2024-12-18.acacia' 
});

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

exports.handler = async (event) => {
  console.log('Webhook received');
  
  try {
    const signature = event.headers['stripe-signature'];
    
    if (!signature) {
      throw new Error('No Stripe signature found');
    }

    console.log('Verifying Stripe signature');
    
    // Verify the Stripe event
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log('Webhook event type:', stripeEvent.type);

    // Handle subscription creation event
    if (stripeEvent.type === 'customer.subscription.created') {
      const subscription = stripeEvent.data.object;
      const customerId = subscription.customer;

      console.log('Processing subscription for customer:', customerId);

      // Retrieve customer details from Stripe
      const customer = await stripe.customers.retrieve(customerId);
      const email = customer.email;

      console.log('Customer email:', email);

      // Update Supabase: Match email and update subscription details
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
        .eq('email', email)
        .select();

      if (error) {
        console.error('Supabase update failed:', error);
        return { 
          statusCode: 500, 
          body: JSON.stringify({ 
            error: 'Failed to update subscription status in Supabase',
            details: error.message 
          })
        };
      }

      console.log('Subscription updated successfully:', data);

      return { 
        statusCode: 200, 
        body: JSON.stringify({ 
          message: 'Subscription status updated successfully',
          data 
        })
      };
    }

    return { 
      statusCode: 200, 
      body: JSON.stringify({ 
        message: 'Webhook received successfully',
        type: stripeEvent.type 
      })
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return { 
      statusCode: 400, 
      body: JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      })
    };
  }
};