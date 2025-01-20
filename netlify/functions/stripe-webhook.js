const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

// Initialize Stripe and Supabase
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' });
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service-role key instead of anon key
);

exports.handler = async (event) => {
  const signature = event.headers['stripe-signature'];

  try {
    // Verify the Stripe event
    const stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    // Handle subscription creation event
    if (stripeEvent.type === 'customer.subscription.created') {
      const subscription = stripeEvent.data.object;
      const customerId = subscription.customer;

      // Retrieve customer details from Stripe
      const customer = await stripe.customers.retrieve(customerId);
      const email = customer.email;

      // Update Supabase: Match email and update subscription details
      const { error } = await supabase
        .from('profiles')
        .update({
          stripe_customer_id: customerId,
          subscription_id: subscription.id,
          subscription_status: subscription.status,
          subscription_tier: subscription.items.data[0].price.lookup_key,
          subscription_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', email);

      if (error) {
        console.error('Supabase update failed:', error);
        return { 
          statusCode: 500, 
          body: JSON.stringify({ error: 'Failed to update subscription status in Supabase' })
        };
      }

      return { 
        statusCode: 200, 
        body: JSON.stringify({ message: 'Subscription status updated successfully' })
      };
    }

    return { 
      statusCode: 200, 
      body: JSON.stringify({ message: 'Webhook received successfully' })
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return { 
      statusCode: 400, 
      body: JSON.stringify({ error: error.message })
    };
  }
};