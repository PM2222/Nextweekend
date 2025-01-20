/*
  # Add subscription fields to profiles table

  1. Changes
    - Add subscription related columns to profiles table:
      - stripe_customer_id: Stores the Stripe customer ID
      - subscription_id: Stores the Stripe subscription ID
      - subscription_status: Tracks the subscription status
      - subscription_tier: Stores the current subscription plan
*/

-- Add new columns for subscription management
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id text,
ADD COLUMN IF NOT EXISTS subscription_id text,
ADD COLUMN IF NOT EXISTS subscription_status text,
ADD COLUMN IF NOT EXISTS subscription_tier text;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);

-- Add constraint to ensure valid subscription status
ALTER TABLE profiles
ADD CONSTRAINT valid_subscription_status 
CHECK (subscription_status IS NULL OR 
       subscription_status IN ('trialing', 'active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'unpaid'));