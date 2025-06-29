"use client";

import type { Task } from "@/lib/db-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import showToast from "@/components/showToast";
import { updateTaskAction, deleteTaskAction } from "../../actions/tasks";

type TaskType = Task;

export function TaskModal({
  task,
  onClose,
  onUpdate,
  open,
}: {
  task: Task;
  open: boolean;
  onClose: () => void;
  onUpdate: (task: Task) => void;
}) {
  const [title, setTitle] = useState(task.title);
  const [status, setStatus] = useState(task.status || "pending");
  const [dueDate, setDueDate] = useState<Date | null>(
    task.due_date ? new Date(task.due_date) : null
  );
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    const updated = await updateTaskAction(task.id, {
      title,
      status,
      due_date: dueDate?.toISOString() ?? null,
    });

    if (updated) {
      onUpdate(updated);
      showToast.success("Task updated");
    } else {
      showToast.error("Update failed");
    }

    setLoading(false);
    onClose();
  };

  useEffect(()=>{
    setTitle(task.title)
    setDueDate(task.due_date  ? new Date(task.due_date) : null)
    setStatus(task.status || "pending")
  },[task])

  const handleDelete = async () => {
    setLoading(true);
    await deleteTaskAction(task.id);
    showToast.success("Task deleted");
    onUpdate({ ...task, deleted: true } as Task); // pseudo deleted
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Due Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  required
                  mode="single"
                  selected={dueDate ?? undefined}
                  onSelect={setDueDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-between pt-4">
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete
            </Button>
            <Button onClick={handleUpdate} disabled={loading}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
