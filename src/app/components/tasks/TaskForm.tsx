import showToast from '@/components/showToast';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';

type TaskInput = {
    title: string;
    status?: string;
    priority?: string;
    due_date?: Date;
    tag?: string;
    description?: string;
  };
  
  type Props = {
    onSuccess: () => void;
  };

const TaskForm = ({onSuccess}:Props) => {
    const {register,handleSubmit,setValue,watch,reset} = useForm<TaskInput>()
    const [openDate, setOpenDate] = useState(false);
   
  const due_date = watch("due_date");

  const onSubmit = async (data: TaskInput) => {
    const taskToSave = {
      ...data,
      due_date: data.due_date ? data.due_date.toISOString().split("T")[0] : null,
    };

    console.log("Creating task:", taskToSave);
    // TODO: Replace with supabase insert or mutation
    showToast.success("Task created");
    reset();
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
    <Input placeholder="Title" {...register("title", { required: true })} />

    <Textarea placeholder="Description" {...register("description")} />

    <div className="flex gap-4">
      <Select onValueChange={(val) => setValue("status", val)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => setValue("priority", val)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="flex gap-4">
      <Input placeholder="Tag"  {...register("tag")} />

      <Popover open={openDate} onOpenChange={setOpenDate}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-start text-left font-normal">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {due_date ? format(due_date, "PPP") : <span>Due Date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={due_date}
            onSelect={(date) => {
              setOpenDate(false);
              setValue("due_date", date);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>

    <Button type="submit" className="w-full">Create Task</Button>
  </form>
  )
}

export default TaskForm
