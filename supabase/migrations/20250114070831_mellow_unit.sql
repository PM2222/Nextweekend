/*
  # Add preferences column to profiles table

  1. Changes
    - Add JSONB preferences column to profiles table to store user preferences
    - Add validation check for required preferences fields
    - Update RLS policy to allow users to update their preferences

  2. Security
    - Maintain existing RLS policies
    - Add specific policy for preferences updates
*/

-- Add preferences column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS preferences JSONB;

-- Add validation check for preferences structure
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

-- Update RLS policy for preferences
CREATE POLICY "Users can update own preferences"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);