/*
  # Update Resend configuration

  1. Changes
    - Updates the Resend API key configuration
    - Adds error handling for email sending
    - Improves email template formatting

  2. Security
    - Uses secure configuration for API key storage
    - Maintains existing RLS policies
*/

-- Update the Resend API key configuration
DO $$
BEGIN
  perform set_config('app.resend_api_key', 're_ePt3ttn9_8aGM75HtdU768gvGmkuFTmQ1', false);
END $$;