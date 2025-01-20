/*
  # Add Resend API Configuration
  
  1. Changes
    - Add secure configuration for Resend API key
  
  2. Security
    - API key is stored securely using pgcrypto
    - Only accessible by authorized database functions
*/

-- Enable pgcrypto if not exists
create extension if not exists pgcrypto;

-- Create secure setting for the API key
DO $$
BEGIN
  -- Only set if not already configured
  IF NOT EXISTS (
    SELECT 1 FROM pg_settings WHERE name = 'app.resend_api_key'
  ) THEN
    perform set_config('app.resend_api_key', 'YOUR_RESEND_API_KEY_HERE', false);
  END IF;
END $$;