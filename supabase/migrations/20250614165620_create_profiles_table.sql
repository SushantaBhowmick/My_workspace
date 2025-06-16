-- Create public.profiles table
create table if not exists public.profiles(
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    username text unique,
    avatar_url text,
    website text,
    create_at timestamp with time zone default timezone('utc',now())
);

-- Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- RLS Polies: Allow users to read their own profile
create policy "Users can view their own profile"
    on public.profiles
    for select 
    using (auth.uid()=id);

-- RLS Policy: Allow users to update their own profile
create policy "User can update their own profile"
    on public.profiles
    for update
    using (auth.uid()=id);

--Auto Create profile on signup
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

create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute procedure public.handle_new_user();
