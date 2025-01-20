/*
  # Update preferences structure

  1. Changes
    - Safely add any missing preferences-related columns and constraints
    - Handle existing data gracefully
    - Ensure RLS policies are properly configured

  2. Security
    - Maintain existing RLS policies
    - Ensure proper access control for preferences
*/

DO $$ 
BEGIN
  -- Only add constraint if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_constraint 
    WHERE conname = 'valid_preferences_structure'
  ) THEN
    ALTER TABLE profiles
    ADD CONSTRAINT valid_preferences_structure
    CHECK (
      preferences IS NULL OR (
        preferences ? 'location' AND
        preferences ? 'radius' AND
        preferences ? 'budget' AND
        preferences ? 'timePreference' AND
        preferences ? 'activityTypes' AND
        preferences ? 'specialConsiderations'
      )
    );
  END IF;

  -- Only create policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE policyname = 'Users can update own preferences'
  ) THEN
    CREATE POLICY "Users can update own preferences"
    ON profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);
  END IF;
END $$;