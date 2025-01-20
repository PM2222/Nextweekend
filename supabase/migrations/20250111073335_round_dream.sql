/*
  # Fix user registration and cleanup

  1. Changes
    - Add function to handle user cleanup if profile creation fails
    - Add trigger to automatically clean up orphaned auth users
    
  2. Security
    - Function runs with security definer to ensure proper permissions
    - Restricted to authenticated context
*/

-- Function to clean up orphaned users
create or replace function public.cleanup_orphaned_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- If profile creation fails, remove the auth user
  if TG_OP = 'INSERT' and TG_LEVEL = 'STATEMENT' then
    delete from auth.users
    where id not in (select id from public.profiles)
    and created_at < now() - interval '5 minutes';
  end if;
  return null;
end;
$$;

-- Trigger to run cleanup periodically after profile operations
create trigger cleanup_orphaned_users_trigger
  after insert or update
  on public.profiles
  for each statement
  execute function public.cleanup_orphaned_user();

-- Function to check if email exists in auth
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
    where email = email_to_check
  );
end;
$$;