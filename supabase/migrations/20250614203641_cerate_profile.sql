-- Create profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  username text unique,
  avatar_url text,
  website text,
  created_at timestamptz default timezone('utc', now())
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- RLS policy: allow user to select their own profile
create policy "Allow select own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- RLS policy: allow user to update their own profile
create policy "Allow update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- Trigger function to create profile
create function public.handle_new_user()
returns trigger
language plpgsql
as $$
begin
  insert into public.profiles (id) values (new.id);
  return new;
end;
$$;

-- Trigger on auth.users
create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();
