'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';

type FilterForm = {
  search?: string;
  status?: string;
  priority?: string;
  tag?: string;
  assignedTo?: string;
  from?: Date;
  to?: Date;
};

type TaskFilterBarProps = {
  form: UseFormReturn<FilterForm>;
};

const TaskFilterBar = ({ form }: TaskFilterBarProps) => {
  const { register, setValue, handleSubmit, watch, reset } = form;
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const from = watch('from');
  const to = watch('to');

  const onSubmit = (data: FilterForm) => {
    console.log('Date filter applied:', data.from, data.to);
    // The page is already watching values — so no extra logic needed
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    >
      <Input placeholder="Search title..." {...register('search')} />

      <Select onValueChange={(value) => setValue('status', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="in_progress">In Progress</SelectItem>
          <SelectItem value="completed">Completed</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(value) => setValue('priority', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>

      <Input placeholder="Tag" {...register('tag')} />

      {/* From Date Picker */}
      <Popover open={openFrom} onOpenChange={setOpenFrom}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {from ? format(from, 'PPP') : <span>From date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={from}
            onSelect={(date) => {
              setValue('from', date);
              setOpenFrom(false);
            }}
          />
        </PopoverContent>
      </Popover>

      {/* To Date Picker */}
      <Popover open={openTo} onOpenChange={setOpenTo}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {to ? format(to, 'PPP') : <span>To date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            selected={to}
            onSelect={(date) => {
              setValue('to', date);
              setOpenTo(false);
            }}
          />
        </PopoverContent>
      </Popover>

      <div className="flex gap-2 col-span-full sm:col-span-2 lg:col-span-4 justify-end">
        <Button type="submit">Apply Date Range</Button>
        <Button type="button" variant="ghost" onClick={() => reset()}>
          Clear
        </Button>
      </div>
    </form>
  );
};

export default TaskFilterBar;
