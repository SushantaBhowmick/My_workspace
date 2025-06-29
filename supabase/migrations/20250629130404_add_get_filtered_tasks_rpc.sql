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
    _limit int default 10
)
returns setof tasks
language sql
as $$
    select * from tasks
    where user_id = _user_id
      and (_search is null or title ilike '%' || _search || '%')
      and (_status is null or status = _status)
      and (_priority is null or priority = _priority)
      and (_tag is null or tag = _tag)
      and (_assigned_to is null or assigned_to = _assigned_to)
      and (_start_date is null or due_date >= _start_date)
      and (_end_date is null or due_date <= _end_date)
    order by due_date desc
    limit _limit
    offset _offset;
$$;
