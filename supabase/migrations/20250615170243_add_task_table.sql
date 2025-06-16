

create table tasks(
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id),
    title text not null,
    status text default 'pending',
    due_date date,
    create_at timestamp default now()
);