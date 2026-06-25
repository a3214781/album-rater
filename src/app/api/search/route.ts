import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')
  if (!q) return NextResponse.json([])

  const searchRes = await fetch(
    `https://musicbrainz.org/ws/2/release?query=${encodeURIComponent(q)}&limit=5&fmt=json`,
    { headers: { 'User-Agent': 'AlbumRater/1.0 (alessio.fantasia2007@gmail.com)' } }
  )
  const searchData = await searchRes.json()

  const results = await Promise.all(
    searchData.releases?.map(async (release: any) => {
      let coverUrl = null
      try {
        const coverRes = await fetch(
          `https://coverartarchive.org/release/${release.id}/front`,
          { redirect: 'follow' }
        )
        if (coverRes.ok) coverUrl = coverRes.url
      } catch {}

      const tracksRes = await fetch(
        `https://musicbrainz.org/ws/2/release/${release.id}?inc=recordings&fmt=json`,
        { headers: { 'User-Agent': 'AlbumRater/1.0 (your@email.com)' } }
      )
      const tracksData = await tracksRes.json()
      const tracks = tracksData.media?.[0]?.tracks?.map((t: any) => ({
        id: t.id,
        title: t.title,
        position: t.position,
      })) ?? []

      return {
        id: release.id,
        title: release.title,
        artist: release['artist-credit']?.[0]?.artist?.name ?? 'Unknown',
        year: release.date?.split('-')[0] ?? '',
        coverUrl,
        tracks,
      }
    }) ?? []
  )

  return NextResponse.json(results)
}