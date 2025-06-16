'use server'

import { createServerSupabaseClient } from '@/lib/supabase/supabaseServer'
import { TablesInsert, TablesUpdate } from '@/types/supabase.types'
import { revalidatePath } from 'next/cache'

// Create a task
export async function createTaskAction(title: string) {
  const supabase = createServerSupabaseClient()

  const {
    data: { user },
    error: userError,
  } = await (await supabase).auth.getUser()

  if (userError || !user) return null

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      title,
      user_id: user.id,
    } satisfies TablesInsert<'tasks'>)
    .select()
    .single()

  if (error) return null

  return data
}

// Update a task
export async function updateTaskAction(
  id: string,
  updates: TablesUpdate<'tasks'>
) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return null

  return data
}

// Delete a task
export async function deleteTaskAction(id: string) {
  const supabase = createServerClient()

  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .select()
    .single()

  if (error) return null

  return data
}
