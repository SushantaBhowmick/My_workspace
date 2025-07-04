"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/supabaseClient";
import { Task } from "@/lib/db-types";
import { useTaskStore } from "@/store/useTaskStore";
import { string } from "zod";

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
   order_by?: string;
  order_dir?: 'asc' | 'desc';
};

export function useFilterTasks(
  filters: FilterParams,
  debounceDelay: number = 500
) {
  const [debouncedFilters, setDebouncedFilters] = useState(filters);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const {setTasks:setGlobalTasks} = useTaskStore();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedFilters(filters);
    }, debounceDelay);
    return () => clearTimeout(timeout);
  }, [filters]);
  
  const fetchTasks = async () => {
    setLoading(true);
    const filters = {
      _user_id: debouncedFilters.user_id,
      _status: debouncedFilters.status ?? undefined,
      _priority: debouncedFilters.priority ?? undefined,
      _tag: debouncedFilters.tag ?? undefined,
      _search: debouncedFilters.search ?? undefined,
      _assigned_to: debouncedFilters.assigned_to ?? undefined,
      _start_date: debouncedFilters.from
        ? debouncedFilters.from.toISOString().split("T")[0]
        : undefined,

      _end_date: debouncedFilters.to
        ? debouncedFilters.to.toISOString().split("T")[0]
        : undefined,
      _limit: debouncedFilters.limit ?? 10,
      _offset: debouncedFilters.offset ?? 0,
      _order_by: debouncedFilters.order_by??'due_date',
      _order_dir: debouncedFilters.order_dir??'desc'

    }

    const { data, error } = await supabase.rpc("get_filtered_tasks", filters);

    if (error) {
      console.error(error);
      setError(error);
      setTasks([]);
    } else {
      setTasks(data || []);
      setGlobalTasks(data)
      setError(null);
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchTasks();
  }, [debouncedFilters]);

  return { tasks, loading, error, refetch:fetchTasks };
}
