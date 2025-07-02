"use server";

import { createSupabaseServerClient } from "@/lib/supabase/supabaseServer";
import { TablesInsert, TablesUpdate } from "@/types/supabase.types";
import { TaskType } from "@/types/types";
import { revalidatePath } from "next/cache";

// Create a task
export async function createTask(data: TaskType) {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("tasks").insert([data]);

  if (error) throw new Error(error.message);

  revalidatePath("/tasks");
}

// Update a task
export async function updateTask(id:string,updates:Partial<TaskType>) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("tasks")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return null;

  return data;
}

// Delete a task
export async function deleteTask(id: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("tasks")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) return null;

  return data;
}
