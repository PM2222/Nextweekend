const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

// Initialize Stripe and Supabase
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' });
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
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

      // Update Supabase: Match email and update subscription status
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_status: 'active' })
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
      statusCode: 400, 
      body: JSON.stringify({ error: 'Unhandled event type' })
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return { 
      statusCode: 400, 
      body: JSON.stringify({ error: 'Webhook verification failed' })
    };
  }
}