import React from 'react'
import TaskRow from './TaskRow';
import { ScrollArea } from '@/components/ui/scroll-area';

export type Task = {
   id: string;
  title: string;
  status: string | null;
  priority: string | null;
  due_date: string | null;
  tag: string | null;
  description?: string | null;
  assigned_to?: string | null;
  assigned_by?: string | null;
  user_id?: string | null;
  create_at?: string | null;
  updated_at?: string | null;
  };
  
  type Props = {
    tasks: Task[];
  };

const TaskTable = ({tasks}:Props) => {
  return (
    <ScrollArea className="rounded-md border">
    <table className="min-w-full divide-y divide-muted text-sm text-left">
      <thead className="bg-muted/50">
        <tr>
          <th className="px-4 py-2">Title</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Priority</th>
          <th className="px-4 py-2">Due Date</th>
          <th className="px-4 py-2">Tag</th>
          <th className="px-4 py-2 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-muted">
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </tbody>
    </table>
  </ScrollArea>
  )
}

export default TaskTable
