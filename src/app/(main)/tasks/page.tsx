'use client'

import { useEffect, useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import showToast from '@/components/showToast'
import { createClient } from '@/lib/supabase/supabaseClient'
import { Task } from '@/lib/db-types'
import { createTaskAction, deleteTaskAction, updateTaskAction } from '@/actions/tasks'
import Skeleton from 'react-loading-skeleton'

export default function TasksPage() {
  const supabase = createClient()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()
      if (userError || !user) return showToast.error('User not found')

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('create_at', { ascending: false })

      if (error) showToast.error('Failed to fetch tasks')
      else setTasks(data)
      setLoading(false)
    }

    fetchTasks()
  }, [supabase])

  const handleCreate = async () => {
    if (!title.trim()) return showToast.warning('Please enter a task title')

    startTransition(async () => {
      const newTask = await createTaskAction(title)
      if (newTask) {
        setTasks((prev) => [newTask, ...prev])
        setTitle('')
        showToast.success('Task added')
      }
    })
  }

  const handleUpdate = async (id: string, updates: Partial<Task>) => {
    startTransition(async () => {
      const updated = await updateTaskAction(id, updates)
      if (updated) {
        setTasks((prev) => prev.map((task) => (task.id === id ? updated : task)))
        showToast.success('Task updated')
      }
    })
  }

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const deleted = await deleteTaskAction(id)
      if (deleted) {
        setTasks((prev) => prev.filter((task) => task.id !== id))
        showToast.success('Task deleted')
      }
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Tasks</h2>

      <div className="flex gap-2 mb-6">
        <Input
          placeholder="Enter a new task..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Button onClick={handleCreate} disabled={isPending}>
          <Plus className="w-4 h-4 mr-1" /> Add
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      ) : tasks.length ? (
        <div className="space-y-4">
          {tasks.map((task) => (
            <Card key={task.id} className="p-4 flex justify-between items-center">
              <CardContent className="p-0">
                <Input
                  className="border-none font-medium"
                  value={task.title}
                  onChange={(e) => handleUpdate(task.id, { title: e.target.value })}
                />
              </CardContent>
              <Button
                variant="outline"
                onClick={() => handleDelete(task.id)}
                disabled={isPending}
              >
                Delete
              </Button>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center">No tasks found</p>
      )}
    </div>
  )
}
