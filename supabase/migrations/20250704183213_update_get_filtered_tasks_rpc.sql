-- Drop the old version (optional but safe to avoid overload conflicts)
drop function if exists get_filtered_tasks;

-- Create the new version with sorting
create or replace function get_filtered_tasks(
  _user_id uuid,
  _status text default null,
  _priority text default null,
  _tag text default null,
  _search text default null,
  _assigned_to uuid default null,
  _start_date date default null,
  _end_date date default null,
  _offset int default 0,
  _limit int default 10,
  _order_by text default 'due_date',
  _order_dir text default 'desc'
)
returns setof tasks
language plpgsql
as $$
begin
  return query
  execute format(
    'select * from tasks
     where user_id = $1
     and ($2::text is null or title ilike ''%%'' || $2 || ''%%'')
     and ($3::text is null or status = $3)
     and ($4::text is null or priority = $4)
     and ($5::text is null or tag = $5)
     and ($6::uuid is null or assigned_to = $6)
     and ($7::date is null or due_date >= $7)
     and ($8::date is null or due_date <= $8)
     order by %I %s
     limit $9 offset $10',
     _order_by, _order_dir
  )
  using
    _user_id, _search, _status, _priority, _tag,
    _assigned_to, _start_date, _end_date, _limit, _offset;
end;
$$;
