'use client'
import TaskFilterBar from '@/app/components/tasks/TaskFilterBar';
import TaskModal from '@/app/components/tasks/TaskModal';
import TaskTable from '@/app/components/tasks/TaskTable';
import { Button } from '@/components/ui/button';
import { useFilterTasks } from '@/hooks/useFilterTasks';
import { useUesrStore } from '@/store/useUserStore';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
// import {Session} from '@supabase/supabase-js'

const page = () => {
  const [open, setOpen] = useState(false);
  const {profile}= useUesrStore();
  const form =useForm();
const {watch} = form;

const filters ={
  user_id: profile?.id ?? '', // 🔥 use Zustand
    search: watch('search'),
    status: watch('status'),
    priority: watch('priority'),
    tag: watch('tag'),
    from: watch('from'),
    to: watch('to'),
    limit: 10,
    offset: 0,
}


const {tasks,loading} = useFilterTasks(filters);

  return (
    <section className="p-6 space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">My Tasks</h1>
      <Button onClick={() => setOpen(true)}>Add Task</Button>
    </div>

    <TaskFilterBar />
    <TaskTable tasks={tasks} />

    <TaskModal open={open} onOpenChange={setOpen} />
  </section>
  )
}

export default page
