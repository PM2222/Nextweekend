/*
  # Add Email Notification System
  
  1. Changes
    - Create a secure function to handle email notifications using Resend API
    - Add trigger for new user signups to send welcome emails
  
  2. Security
    - Function runs with security definer
    - Uses secure settings for API key storage
*/

-- Create a secure function to handle email notifications
create or replace function public.handle_new_user_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  user_name text;
begin
  -- Safely extract the user's name
  user_name := NEW.raw_user_meta_data->>'full_name';
  
  -- Send email via Resend API
  perform
    net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || current_setting('app.resend_api_key'),
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'from', 'NextWeekend <welcome@nextweekend.app>',
        'to', NEW.email,
        'subject', 'Welcome to NextWeekend!',
        'html', '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">' ||
                '<h1 style="color: #262A10;">Welcome to NextWeekend!</h1>' ||
                '<p>Hi ' || coalesce(user_name, 'there') || ',</p>' ||
                '<p>Thank you for joining NextWeekend! We''re excited to help you plan amazing weekends.</p>' ||
                '<p>Get started by exploring our features and creating your first weekend plan.</p>' ||
                '<p>Best regards,<br>The NextWeekend Team</p>' ||
                '</div>'
      )
    );
  return NEW;
end;
$$;

-- Create trigger for new user signups
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user_email();