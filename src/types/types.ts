export interface TaskType {
    id: string;
  title: string;
  status?: string | null;
  priority?: string | null;
  due_date?: string | null;
  tag?: string | null;
  description?: string | null;
  assigned_to?: string | null;
  assigned_by?: string | null;
  user_id: string | null; // 🔥 Fix here
  create_at?: string | null;
  updated_at?: string | null;
}
