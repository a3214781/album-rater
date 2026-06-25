'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signup(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const username = formData.get('username') as string

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error || !data.user) {
    redirect('/signup?error=Could not create account')
  }

  await supabase.from('profiles').insert({
    id: data.user.id,
    username,
  })

  redirect('/library')
}