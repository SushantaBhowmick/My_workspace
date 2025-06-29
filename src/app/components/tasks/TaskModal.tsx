"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import React from 'react'
import TaskForm from './TaskForm';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const TaskModal = ({open,onOpenChange}:Props) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Create Task</DialogTitle>
      </DialogHeader>
    <TaskForm onSuccess={() => onOpenChange(false)} />
    </DialogContent>
    </Dialog>
  )
}

export default TaskModal
