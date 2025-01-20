/*
  # Add Stripe subscription fields

  1. New Columns
    - Add subscription period tracking:
      - `subscription_period_end` - When subscription period ends
      - `subscription_cancel_at` - When subscription will be cancelled
      
  2. Indexes
    - Add index for subscription period queries
    
  3. Constraints
    - Add constraint for valid subscription tiers
*/

-- Add new columns for Stripe integration
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS subscription_period_end timestamptz,
ADD COLUMN IF NOT EXISTS subscription_cancel_at timestamptz;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_period ON profiles(subscription_period_end);

-- Add constraint to ensure valid subscription tiers
DO $$ 
BEGIN
  -- Only add constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'valid_subscription_tier'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT valid_subscription_tier 
    CHECK (subscription_tier IS NULL OR subscription_tier IN ('basic', 'pro', 'annual'));
  END IF;
END $$;