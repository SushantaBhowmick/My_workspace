-- Drop the old trigger and function
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user;

-- Recreate with SECURITY DEFINER
create function public.handle_new_user()
returns trigger
language plpgsql
security definer -- ✅ THIS LINE IS CRUCIAL
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- Create trigger again
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
