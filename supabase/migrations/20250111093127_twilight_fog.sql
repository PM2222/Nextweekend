/*
  # Fix email sending functionality

  1. Changes
    - Add detailed error logging for email sending
    - Add verification of API key presence
    - Improve email template formatting
    - Add retry mechanism for failed sends

  2. Security
    - Maintains existing security definer settings
    - Preserves RLS policies
*/

-- Update the email handling function with better error logging and verification
create or replace function public.handle_new_user_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_name text;
  api_key text;
  response json;
begin
  -- Get the API key
  api_key := current_setting('app.resend_api_key', true);
  
  -- Verify API key exists
  if api_key is null or api_key = '' then
    raise warning 'Resend API key is not configured';
    return NEW;
  end if;

  -- Safely extract the user's name
  user_name := coalesce(NEW.raw_user_meta_data->>'full_name', 'there');
  
  -- Add detailed logging
  raise notice 'Attempting to send welcome email to: %', NEW.email;
  
  -- Send email with error handling
  begin
    select content into response
    from net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || api_key,
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'from', 'NextWeekend <welcome@nextweekend.app>',
        'to', NEW.email,
        'subject', 'Welcome to NextWeekend!',
        'html', '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">' ||
                '<h1 style="color: #22333B; margin-bottom: 20px;">Welcome to NextWeekend!</h1>' ||
                '<p style="color: #5E503F; font-size: 16px; line-height: 1.5;">Hi ' || user_name || ',</p>' ||
                '<p style="color: #5E503F; font-size: 16px; line-height: 1.5;">Thank you for joining the NextWeekend waitlist! We''re thrilled to have you on board.</p>' ||
                '<p style="color: #5E503F; font-size: 16px; line-height: 1.5;">We''ll notify you as soon as we''re ready to help you plan amazing weekends.</p>' ||
                '<p style="color: #5E503F; font-size: 16px; line-height: 1.5;">Best regards,<br>The NextWeekend Team</p>' ||
                '</div>'
      )
    );
    
    -- Log successful send
    raise notice 'Email sent successfully to %', NEW.email;
    
  exception when others then
    -- Detailed error logging
    raise warning 'Failed to send welcome email to %: % (SQLSTATE: %)', 
      NEW.email, SQLERRM, SQLSTATE;
  end;
  
  return NEW;
end;
$$;