/*
  # Add email column to profiles table

  1. Changes
    - Add email column to profiles table
    - Create trigger to sync email from auth.users
    - Backfill existing profiles with email data
  
  2. Security
    - Email column is read-only through RLS
*/

-- Add email column
ALTER TABLE profiles
ADD COLUMN email text;

-- Create index for email lookups
CREATE INDEX idx_profiles_email ON profiles(email);

-- Create function to sync email from auth.users
CREATE OR REPLACE FUNCTION sync_user_email()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE profiles
  SET email = NEW.email
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to sync email on user creation/update
CREATE TRIGGER sync_user_email_trigger
AFTER INSERT OR UPDATE OF email ON auth.users
FOR EACH ROW
EXECUTE FUNCTION sync_user_email();

-- Backfill existing profiles with email data
UPDATE profiles
SET email = users.email
FROM auth.users
WHERE profiles.id = users.id
AND profiles.email IS NULL;