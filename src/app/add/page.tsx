'use client'

import { useState } from 'react'
import { addAlbum } from './actions'

interface Track {
  id: string
  title: string
  position: number
}

interface AlbumResult {
  id: string
  title: string
  artist: string
  year: string
  coverUrl: string | null
  tracks: Track[]
}

export default function AddPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<AlbumResult[]>([])
  const [selected, setSelected] = useState<AlbumResult | null>(null)
  const [favourites, setFavourites] = useState<string[]>([])
  const [score, setScore] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

async function search(val?: string) {
  const q = val ?? query
  if (!q.trim()) return setResults([])
  setLoading(true)
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
  const data = await res.json()
  setResults(data)
  setLoading(false)
}

  function toggleFavourite(title: string) {
    setFavourites(prev =>
      prev.includes(title) ? prev.filter(t => t !== title) : [...prev, title]
    )
  }

  async function handleSubmit() {
    if (!selected || !score) return
    const res = await fetch('/api/add-album', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        artist: selected.artist,
        album: selected.title,
        score: parseFloat(score),
        favourite_tracks: favourites.join(', '),
        notes,
        cover_url: selected.coverUrl ?? '',
        release_year: selected.year ? parseInt(selected.year) : null,
      }),
    })
    if (res.ok) window.location.href = '/library'
  }

  return (
    <main className="max-w-md mx-auto px-4 py-12">
      <div className="flex items-center gap-3 mb-8">
        <a href="/library" className="text-zinc-400 text-sm hover:text-black">← Back</a>
        <h1 className="text-2xl font-medium">Add album</h1>
      </div>

      {!selected ? (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for an album..."
              value={query}
              onChange={e => {
                setQuery(e.target.value)
                clearTimeout((window as any)._searchTimer)
                ;(window as any)._searchTimer = setTimeout(() => search(e.target.value), 400)
                }}
              onKeyDown={e => e.key === 'Enter' && search()}
              className="flex-1 border border-zinc-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <div className="flex flex-col gap-3">
            {results.map(album => (
              <div
                key={album.id}
                onClick={() => { setSelected(album); setFavourites([]) }}
                className="flex items-center gap-3 border border-zinc-200 rounded-lg px-4 py-3 cursor-pointer hover:border-zinc-400"
              >
                {album.coverUrl ? (
                  <img src={album.coverUrl} alt={album.title} className="w-12 h-12 rounded object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs">?</div>
                )}
                <div>
                  <p className="font-medium text-sm">{album.title}</p>
                  <p className="text-zinc-500 text-xs">{album.artist} · {album.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            {selected.coverUrl ? (
              <img src={selected.coverUrl} alt={selected.title} className="w-16 h-16 rounded object-cover" />
            ) : (
              <div className="w-16 h-16 rounded bg-zinc-100" />
            )}
            <div>
              <p className="font-medium">{selected.title}</p>
              <p className="text-zinc-500 text-sm">{selected.artist} · {selected.year}</p>
            </div>
          </div>

          <button
            onClick={() => setSelected(null)}
            className="text-xs text-zinc-400 hover:text-black text-left"
          >
            ← Change album
          </button>

          {selected.tracks.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-zinc-500 mb-1">Favourite tracks</p>
              {selected.tracks.map(track => (
                <div
                  key={track.id}
                  onClick={() => toggleFavourite(track.title)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm border ${
                    favourites.includes(track.title)
                      ? 'border-black bg-black text-white'
                      : 'border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  <span className="text-xs w-4 text-center opacity-50">{track.position}</span>
                  {track.title}
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500">Score (0–10)</label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.1"
              placeholder="8.5"
              value={score}
              onChange={e => setScore(e.target.value)}
              className="border border-zinc-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-zinc-500"
            />
          </div>

          <textarea
            placeholder="Notes (optional)"
            rows={3}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="border border-zinc-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-zinc-500 resize-none"
          />

          <button
            onClick={handleSubmit}
            className="bg-black text-white rounded-lg px-4 py-2 text-sm"
          >
            Save
          </button>
        </div>
      )}
    </main>
  )
}