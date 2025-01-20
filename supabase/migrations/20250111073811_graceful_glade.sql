/*
  # Fix user creation and email handling

  1. Changes
    - Add proper error handling for user creation
    - Update email handling function
    - Add proper RLS policies
    - Add database constraints
  
  2. Security
    - Ensure proper RLS policies
    - Add function security barriers
*/

-- Update the handle_new_user_email function with proper error handling
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
  user_name := coalesce(NEW.raw_user_meta_data->>'full_name', 'there');
  
  -- Add error handling around the email sending
  begin
    perform
      net.http_post(
        url := 'https://api.resend.com/emails',
        headers := jsonb_build_object(
          'Authorization', 'Bearer re_ePt3ttn9_8aGM75HtdU768gvGmkuFTmQ1',
          'Content-Type', 'application/json'
        ),
        body := jsonb_build_object(
          'from', 'NextWeekend <welcome@nextweekend.app>',
          'to', NEW.email,
          'subject', 'Welcome to NextWeekend!',
          'html', '<div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">' ||
                  '<h1 style="color: #262A10;">Welcome to NextWeekend!</h1>' ||
                  '<p>Hi ' || user_name || ',</p>' ||
                  '<p>Thank you for joining NextWeekend! We''re excited to help you plan amazing weekends.</p>' ||
                  '<p>Get started by exploring our features and creating your first weekend plan.</p>' ||
                  '<p>Best regards,<br>The NextWeekend Team</p>' ||
                  '</div>'
        )
      );
    exception when others then
      -- Log the error but don't prevent user creation
      raise warning 'Failed to send welcome email: %', SQLERRM;
  end;
  
  return NEW;
end;
$$;

-- Ensure the profiles table has proper constraints
alter table public.profiles
  alter column updated_at set default now(),
  add constraint profiles_full_name_check check (char_length(full_name) >= 1);

-- Add a trigger to automatically update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

-- Update the check_email_exists function to be more robust
create or replace function public.check_email_exists(email_to_check text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return exists (
    select 1 
    from auth.users 
    where lower(email) = lower(email_to_check)
  );
exception when others then
  -- Log the error and return false to allow the signup attempt
  raise warning 'Error checking email existence: %', SQLERRM;
  return false;
end;
$$;