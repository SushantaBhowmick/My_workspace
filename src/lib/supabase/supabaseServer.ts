// lib/supabase/server.ts
"use server"
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { type SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/types/supabase.types'
import { unstable_cache as noStore } from 'next/cache'

export const createSupabaseServerClient = async (): Promise<SupabaseClient<Database>> => {
  // noStore();
  const cookieStore = await cookies();

  return  createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
       getAll(){
        return cookieStore.getAll();
       },
       setAll(cookiesToSet){
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )

        } catch (error) {
          console.log(error,"supabse-error")
        }
       }
      },
    }
  )

}
