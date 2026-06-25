import Link from 'next/link'

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-medium">Album Rater</h1>
        <p className="text-zinc-500 text-sm max-w-xs">
          Track and rate every album you listen to. See what your friends are spinning.
        </p>
      </div>
      <div className="flex gap-3">
        <Link
          href="/signup"
          className="bg-black text-white rounded-lg px-5 py-2 text-sm"
        >
          Get started
        </Link>
        <Link
          href="/login"
          className="border border-zinc-300 rounded-lg px-5 py-2 text-sm"
        >
          Log in
        </Link>
      </div>
    </main>
  )
} 