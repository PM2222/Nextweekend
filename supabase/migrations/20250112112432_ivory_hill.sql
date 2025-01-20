/*
  # Stripe Security and Performance Enhancements

  1. New Indexes
    - Add composite index for subscription lookup
    - Add index for subscription tier queries
  
  2. Security
    - Add RLS policies for subscription data
    - Add validation triggers for subscription status changes
*/

-- Add composite index for faster subscription lookups
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_lookup 
ON profiles(subscription_status, subscription_tier);

-- Add index for subscription tier queries
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_tier 
ON profiles(subscription_tier);

-- Update RLS policies to include subscription data access
CREATE POLICY "Users can read own subscription data"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Add trigger to validate subscription status changes
CREATE OR REPLACE FUNCTION validate_subscription_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Only allow valid status transitions
  IF NEW.subscription_status NOT IN (
    'trialing', 'active', 'canceled', 'incomplete', 
    'incomplete_expired', 'past_due', 'unpaid'
  ) THEN
    RAISE EXCEPTION 'Invalid subscription status: %', NEW.subscription_status;
  END IF;

  -- Ensure subscription_id is present for active subscriptions
  IF NEW.subscription_status IN ('active', 'trialing') 
     AND NEW.subscription_id IS NULL THEN
    RAISE EXCEPTION 'Subscription ID required for active subscriptions';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_subscription_status_trigger
BEFORE UPDATE OF subscription_status ON profiles
FOR EACH ROW
EXECUTE FUNCTION validate_subscription_status();