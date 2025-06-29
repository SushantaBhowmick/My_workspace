'use client'
import TaskFilterBar from '@/app/components/tasks/TaskFilterBar';
import TaskModal from '@/app/components/tasks/TaskModal';
import TaskTable from '@/app/components/tasks/TaskTable';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react'
// import {Session} from '@supabase/supabase-js'

const page = () => {
  const [open, setOpen] = useState(false);
  // const [session,setSession] = useState<Session | null>(null)


  // const filters = {
  //   user_id: userId,
  //   status: watch("status"),
  //   priority: watch("priority"),
  //   tag: watch("tag"),
  //   search: watch("search"),
  //   from: watch("from"),
  //   to: watch("to"),
  //   limit: 10,
  //   offset: 0,
  // };

  return (
    <section className="p-6 space-y-6">
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">My Tasks</h1>
      <Button onClick={() => setOpen(true)}>Add Task</Button>
    </div>

    <TaskFilterBar />
    <TaskTable tasks={[]} />

    <TaskModal open={open} onOpenChange={setOpen} />
  </section>
  )
}

export default page
