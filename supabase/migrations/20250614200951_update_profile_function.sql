
alter table public.profiles
alter column username drop not null;

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user;

create function public.handle_new_user()
returns trigger
language plpgsql
as $$
begin
    insert into public.profiles(id,username,full_name)
    values(
        new.id,
        null,
        null
    );
    return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute procedure public.handle_new_user();