"use client";
import React, { useRef, useState, useTransition } from "react";
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
import { TaskType } from "@/types/types";
import { useTaskStore } from "@/store/useTaskStore";
import showToast from "@/components/showToast";
import { deleteTask, updateTask } from "@/app/actions/tasks";

type Props = {
  task: TaskType;
  onRefetch: () => void;
};

const TaskRow = ({ task,onRefetch }: Props) => {
  const [editingTask, setEditingTask] = useState(task);
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
   const { updateTask:updateTaskStore, deleteTask:deleteTaskStore ,addTask} = useTaskStore();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)


  const handleChange = (field: keyof TaskType, value: any) => {
    console.log(field)
    setEditingTask((prev) => ({ ...prev, [field]: value }));

    if(timeoutRef.current){
      console.log(timeoutRef)
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
    startTransition(async() => {
      try {
        await updateTask(task.id,{[field]:value})
        showToast.success("Task Updated");
      } catch (error) {
          showToast.error("Failed to update");
        // updateTaskStore(task.id, { [field]: task[field] }); // rollback
      }
      console.log("Update:", { ...editingTask, [field]: value });
    });
    }, 500);
  };

  const handleDelete = () => {
    // TODO: Call delete RPC/API
     deleteTaskStore(task.id); 
     startTransition(async()=>{
     try {
       await deleteTask(task.id);
      showToast.success("Task deleted");
      onRefetch()
     } catch (error) {
      showToast.error("Delete failed")
      addTask(task)
     }
     })
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
          value={editingTask.status||"pending"}
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
            value={editingTask.priority||"Normal"}
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
