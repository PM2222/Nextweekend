/*
  # Add Stripe Integration

  1. New Columns
    - Add Stripe-related columns to profiles table:
      - `stripe_customer_id` - Stores Stripe customer ID
      - `subscription_id` - Stores Stripe subscription ID
      - `subscription_status` - Current subscription status
      - `subscription_tier` - Selected subscription plan
      - `subscription_period_end` - When subscription period ends
      - `subscription_cancel_at` - When subscription will be cancelled
      
  2. Security
    - Add RLS policies for subscription data
*/

-- Add new columns for Stripe integration
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_period_end timestamptz,
ADD COLUMN IF NOT EXISTS subscription_cancel_at timestamptz;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_period ON profiles(subscription_period_end);

-- Add RLS policies for subscription data
CREATE POLICY "Users can read own subscription data"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Add constraint to ensure valid subscription tiers
ALTER TABLE profiles
ADD CONSTRAINT valid_subscription_tier 
CHECK (subscription_tier IS NULL OR subscription_tier IN ('basic', 'pro', 'annual'));