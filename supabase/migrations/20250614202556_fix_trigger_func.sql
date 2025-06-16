-- Drop existing trigger and function if they exist
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user;

-- Create function to insert only the user's id (safe way)
create function public.handle_new_user()
returns trigger
language plpgsql
as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$;

-- Create trigger to run the function after user signs up
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
