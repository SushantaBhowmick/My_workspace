"use client";
import React, { useState, useTransition } from "react";
import { Task } from "./TaskTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, Trash2Icon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";

type Props = {
  task: Task;
};

const TaskRow = ({ task }: Props) => {
  const [editingTask, setEditingTask] = useState(task);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleChange = (field: keyof Task, value: any) => {
    setEditingTask((prev) => ({ ...prev, [field]: value }));

    startTransition(() => {
      // TODO: Call your update RPC/API
      console.log("Update:", { ...editingTask, [field]: value });
    });
  };

  const handleDelete = () => {
    // TODO: Call delete RPC/API
    console.log("Delete:", task.id);
  };

  return (
    <tr className="hover:bg-muted/30">
      <td className="px-4 py-2">
        <Input
          className="min-w-[150px]"
          value={editingTask.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </td>

      {/* Status */}
      <td className="px-4 py-2">
        <Select
          value={editingTask.status}
          onValueChange={(value) => handleChange("status", value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </td>
        {/* Priority */}
        <td className="px-4 py-2">
          <Select
            value={editingTask.priority}
            onValueChange={(value) => handleChange("priority", value)}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </td>

        {/* Due Date */}
        <td className="px-4 py-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-[130px] justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {editingTask.due_date ? (
                  format(new Date(editingTask.due_date), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  editingTask.due_date
                    ? new Date(editingTask.due_date)
                    : undefined
                }
                onSelect={(date) => {
                  setOpen(false);
                  handleChange("due_date", date?.toISOString() ?? null);
                }}
              />
            </PopoverContent>
          </Popover>
        </td>

        {/* Tag */}
        <td className="px-4 py-2">
          <Input
            className="w-[100px]"
            value={editingTask.tag ?? ""}
            onChange={(e) => handleChange("tag", e.target.value)}
          />
        </td>

        {/* Delete Action */}
        <td className="px-4 py-2 text-right">
          <Button variant="ghost" size="icon" onClick={handleDelete}>
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2Icon className="w-4 h-4 text-destructive" />
            )}
          </Button>
        </td>
    </tr>
  );
};

export default TaskRow;
