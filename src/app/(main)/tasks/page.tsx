"use client";
import TaskFilterBar from "@/app/components/tasks/TaskFilterBar";
import TaskModal from "@/app/components/tasks/TaskModal";
import TaskTable from "@/app/components/tasks/TaskTable";
import { Button } from "@/components/ui/button";
import { useFilterTasks } from "@/hooks/useFilterTasks";
import { useTaskStore } from "@/store/useTaskStore";
import { useUesrStore } from "@/store/useUserStore";
import React, { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
// import {Session} from '@supabase/supabase-js'

const page = () => {
  const [open, setOpen] = useState(false);
  const { profile } = useUesrStore();
  const form = useForm();
  const values = useWatch({ control: form.control });

  const filters = useMemo(
    () => ({
      user_id: profile?.id ?? "",
      search: values.search ?? null,
      status: values.status ?? null,
      priority: values.priority ?? null,
      tag: values.tag ?? null,
      from: values.from ?? null,
      to: values.to ?? null,
      limit: 10,
      offset: 0,
      order_by: values.order_by ?? null,
      order_dir: values.order_dir ?? null,
    }),
    [values, profile?.id]
  );

  const { loading, refetch } = useFilterTasks(filters);
  const { tasks } = useTaskStore();
  // console.log(tasks);
  // const tasks=[]

  return (
    <section className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">My Tasks</h1>
        <Button onClick={() => setOpen(true)}>Add Task</Button>
      </div>

      <TaskFilterBar form={form}/>
      <TaskTable tasks={tasks} onRefetch={refetch} />

      <TaskModal open={open} onOpenChange={setOpen} />
    </section>
  );
};

export default page;
