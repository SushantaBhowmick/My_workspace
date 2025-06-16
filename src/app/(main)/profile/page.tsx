'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/supabaseClient'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import showToast from '@/components/showToast'
import { useGlobalLoader } from '@/store/useGlobalLoader'

export default function ProfilePage() {
  const supabase = createClient()
  const { showLoader, hideLoader } = useGlobalLoader()

  const [profile, setProfile] = useState<{ full_name: string; email: string; joined: string } | null>(null)
  const [name, setName] = useState("")

useEffect(() => {
  const getProfile = async () => {
    showLoader()

    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser()

    if (userError || !user) {
      showToast.error("Unable to fetch user info")
      hideLoader()
      return
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, created_at")
      .eq("id", user.id)
      .single()

    if (error) {
      showToast.error("Failed to fetch profile")
    } else {
      setProfile({
        full_name: data.full_name,
        email: user.email || '', // ← coming from auth.users
        joined: new Date(data.created_at).toLocaleDateString(),
      })
      setName(data.full_name)
    }

    hideLoader()
  }

  getProfile()
}, [supabase])

  const handleUpdate = async () => {
    if (!profile) return

    showLoader()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: name })
      .eq("id", user?.id)

    if (error) {
      showToast.error("Update failed")
    } else {
      showToast.success("Name updated")
      setProfile({ ...profile, full_name: name })
    }

    hideLoader()
  }

  if (!profile) return null

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-6">
      <h2 className="text-2xl font-bold">Your Profile</h2>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input disabled value={profile?.email} />
      </div>

      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input placeholder='Enter your good name' value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Joined At</Label>
        <Input disabled value={profile?.joined} />
      </div>

      <Button onClick={handleUpdate}>Update</Button>
    </div>
  )
}
