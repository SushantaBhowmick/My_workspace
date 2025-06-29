alter table tasks
add column priority text check (priority in ('low', 'medium', 'high')) default 'medium',
add column tag text,
add column assigned_to uuid references auth.users(id),
add column assigned_by uuid references auth.users(id),
add column description text,
add column updated_at timestamp default now();

create index idx_tasks_status on tasks(status);
create index idx_tasks_priority on tasks(priority);
create index idx_tasks_due_date on tasks(due_date);
create index idx_tasks_assigned_to on tasks(assigned_to);
create index idx_tasks_tag on tasks(tag);
