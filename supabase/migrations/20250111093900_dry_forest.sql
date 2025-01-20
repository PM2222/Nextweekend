/*
  # Fix email sending functionality

  1. Changes
    - Add net extension for HTTP requests
    - Update email sending function to use proper HTTP client
    - Add better error handling and logging
*/

-- Enable the net extension if not already enabled
create extension if not exists "http" with schema extensions;

-- Update the email handling function
create or replace function public.handle_new_user_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_name text;
  api_key text;
  response_status int;
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
    select status into response_status
    from http((
      'POST',
      'https://api.resend.com/emails',
      ARRAY[
        ('Authorization', 'Bearer ' || api_key),
        ('Content-Type', 'application/json')
      ],
      'application/json',
      json_build_object(
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
      )::text
    ));
    
    -- Log response status
    raise notice 'Email send response status: %', response_status;
    
    -- Check if the email was sent successfully
    if response_status >= 200 and response_status < 300 then
      raise notice 'Email sent successfully to %', NEW.email;
    else
      raise warning 'Failed to send email. Status code: %', response_status;
    end if;
    
  exception when others then
    -- Detailed error logging
    raise warning 'Failed to send welcome email to %: % (SQLSTATE: %)', 
      NEW.email, SQLERRM, SQLSTATE;
  end;
  
  return NEW;
end;
$$;