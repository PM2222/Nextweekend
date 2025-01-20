import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export async function createSubscription(priceId: string): Promise<void> {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Failed to initialize Stripe');
    }

    // Create checkout session
    const response = await fetch('/.netlify/functions/create-checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ priceId }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create checkout session');
    }

    if (!data.url) {
      throw new Error('Invalid checkout session response');
    }

    // Redirect to Stripe Checkout
    window.location.href = data.url;

  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error instanceof Error ? error : new Error('Failed to create checkout session');
  }
}

// These price IDs should match your Stripe dashboard
export const SUBSCRIPTION_PRICES = {
  basic: 'price_1QhlU1GHxkoB2DhKxeC4PI7F',    // $9.99/month
  pro: 'price_1Qhm9AGHxkoB2DhKyS9zFkeL',      // $19.99/month
  annual: 'price_1Qhm9AGHxkoB2DhKMrXakpbl'    // $199.99/year
};