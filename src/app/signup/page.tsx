import { signup } from './actions'

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-medium">Create account</h1>
        <form className="flex flex-col gap-3" action={signup}>
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
          <input
            name="username"
            type="text"
            placeholder="Username"
            required
            className="border border-zinc-300 rounded-lg px-4 py-2 text-sm outline-none focus:border-zinc-500"
          />
          <button
            type="submit"
            className="bg-black text-white rounded-lg px-4 py-2 text-sm"
          >
            Sign up
          </button>
        </form>
        <p className="text-sm text-zinc-500">
          Already have an account?{' '}
          <a href="/login" className="text-black underline">Log in</a>
        </p>
      </div>
    </main>
  )
}