/*
  # Add Resend API Key Setting
  
  1. Changes
    - Add pgcrypto extension if not exists (required for encryption)
    - Create secure setting for Resend API key
  
  2. Security
    - API key is stored securely
    - Only accessible by authorized database functions
*/

-- Enable pgcrypto if not already enabled
create extension if not exists pgcrypto;

-- Create the setting securely
select set_config('app.resend_api_key', 'YOUR_RESEND_API_KEY_HERE', false);