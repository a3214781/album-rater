import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LibraryPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single()

  const { data: albums } = await supabase
    .from('albums')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium">{profile?.username}</h1>
          <p className="text-zinc-500 text-sm">{albums?.length ?? 0} albums rated</p>
        </div>
        <a href="/add" className="bg-black text-white rounded-lg px-4 py-2 text-sm">
          + Add album
        </a>
      </div>

      {albums?.length === 0 && (
        <p className="text-zinc-400 text-sm">No albums yet — add your first one.</p>
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {albums?.map((album) => (
            <div
            key={album.id}
            className="border border-zinc-200 rounded-lg overflow-hidden"
            >
            {album.cover_url ? (
                <img src={album.cover_url} alt={album.album} className="w-full aspect-square object-cover" />
            ) : (
                <div className="w-full aspect-square bg-zinc-100" />
            )}
            <div className="px-3 py-2">
                <p className="font-medium text-sm truncate">{album.album}</p>
                <p className="text-zinc-500 text-xs truncate">{album.artist}</p>
                <p className="text-sm font-medium mt-1">{album.score}/10</p>
            </div>
            </div>
        ))}
        </div>
    </main>
  )
}