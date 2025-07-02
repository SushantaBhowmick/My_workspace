import { TaskType } from "@/types/types";
import { create } from "zustand";

type TaskStore = {
  tasks: TaskType[];
  setTasks: (tasks: TaskType[]) => void;
  updateTask: (id: string, changes: Partial<TaskType>) => void;
  deleteTask: (id: string) => void;
  addTask: (task: TaskType) => void;
};

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  updateTask: (id, changes) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, changes } : task
      ),
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== id),
    })),
  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),
}));
