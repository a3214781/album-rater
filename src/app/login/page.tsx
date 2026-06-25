import { login } from './actions'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Log in</h1>
        <form className="flex flex-col gap-3" action={login}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="border border-zinc-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-zinc-500"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="border border-zinc-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-zinc-500"
          />
          <button
            type="submit"
            className="bg-black text-white rounded-lg px-4 py-2 text-sm"
          >
            Log in
          </button>
        </form>
        <p className="text-sm text-zinc-500">
          Don't have an account?{' '}
          <a href="/signup" className="text-black underline">Sign up</a>
        </p>
      </div>
    </main>
  )
}