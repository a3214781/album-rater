'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function addAlbum(formData: FormData) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    console.log('Auth error:', userError)
    redirect('/login')
  }

  console.log('User ID:', user.id)

  const { data, error } = await supabase.from('albums').insert({
    user_id: user.id,
    artist: formData.get('artist') as string,
    album: formData.get('album') as string,
    score: parseFloat(formData.get('score') as string),
    favourite_tracks: formData.get('favourite_tracks') as string,
    notes: formData.get('notes') as string,
    cover_url: formData.get('cover_url') as string,
    release_year: formData.get('release_year') ? parseInt(formData.get('release_year') as string) : null,
  })

  console.log('Insert data:', data)
  console.log('Insert error:', error)

  redirect('/library')
}