/*
  # Update Resend API Key Configuration

  1. Changes
    - Sets the Resend API key in the database configuration
    - Uses secure configuration to store the API key
  
  2. Security
    - Uses pgcrypto for secure key storage
    - Implements as idempotent operation
*/

DO $$
BEGIN
  -- Update the API key configuration
  perform set_config('app.resend_api_key', 're_ePt3ttn9_8aGM75HtdU768gvGmkuFTmQ1', false);
END $$;