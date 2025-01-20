/*
  # Add user cleanup functionality

  1. Changes
    - Add function to properly delete users
    - Add RPC endpoint for user deletion
  
  2. Security
    - Function is security definer
    - Only allows deletion of non-admin users
*/

-- Function to properly delete a user and all associated data
create or replace function delete_user_by_email(user_email text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  target_user_id uuid;
begin
  -- Get the user ID
  select id into target_user_id
  from auth.users
  where email = user_email
  and not is_super_admin;

  if target_user_id is null then
    return false;
  end if;

  -- Delete from auth.users (will cascade to profiles due to FK)
  delete from auth.users
  where id = target_user_id;

  return true;
exception when others then
  raise warning 'Error deleting user: %', SQLERRM;
  return false;
end;
$$;