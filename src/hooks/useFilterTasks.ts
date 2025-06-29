"use client"

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/supabaseClient";
import { Task } from "@/lib/db-types";

const supabase = createClient();

type FilterParams = {
  user_id: string;
  status?: string | null;
  priority?: string | null;
  tag?: string | null;
  search?: string | null;
  assigned_to?: string | null;
  from?: Date | null;
  to?: Date | null;
  limit?: number;
  offset?: number;
};

export function useFilterTasks(filters:FilterParams,debounceDelay:number = 500){
    const [debouncedFilters,setDebouncedFilters] = useState(filters)
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

   useEffect(()=>{
    const timeout = setTimeout(()=>{
        setDebouncedFilters(filters)
    },debounceDelay)
    return ()=>clearTimeout(timeout)
   },[filters]);

   useEffect(()=>{
    const fetchTasks = async ()=>{
        setLoading(true)
        const {data,error} = await supabase.rpc("get_filtered_tasks",{
            _user_id: debouncedFilters.user_id,
            _status: debouncedFilters.status ?? null,
            _priority: debouncedFilters.priority ?? null,
            _tag: debouncedFilters.tag ?? null,
            _search: debouncedFilters.search ?? null,
            _assigned_to: debouncedFilters.assigned_to ?? null,
            _start_date: debouncedFilters.from ?? null,
            _end_date: debouncedFilters.to ?? null,
            _limit: debouncedFilters.limit ?? 10,
            _offset: debouncedFilters.offset ?? 0,
        })

        if (error) {
            console.error(error);
            setError(error);
            setTasks([]);
          } else {
            setTasks(data || []);
            setError(null);
          }
          setLoading(false);
        };

    fetchTasks();
   },[debouncedFilters])

   return {tasks,loading,error}
}