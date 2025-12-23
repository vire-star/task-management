import { useLoginHook } from '@/hooks/userHooks'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'

const Login = () => {
  const { mutate, isPending } = useLoginHook()
  const { register, handleSubmit } = useForm()

  const loginFormHandler = (data) => {
    mutate(data)
  }

  return (
    <div className="h-screen w-full flex items-center justify-center bg-zinc-50">
      <form
        onSubmit={handleSubmit(loginFormHandler)}
        className="w-full max-w-sm flex flex-col gap-6 rounded-xl bg-white px-6 py-8 shadow-lg"
      >
        {/* Heading */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            Welcome back
          </h1>
          <p className="text-sm text-zinc-500">
            Please enter your details to login
          </p>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-800"
            {...register('email')}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-800"
            {...register('password')}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="mt-2 rounded-md bg-zinc-900 py-2.5 text-sm font-medium tracking-wide text-white transition hover:bg-zinc-800"
        >
          {isPending ? 'Logging in…' : 'Login'}
        </button>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-600">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-zinc-900 underline underline-offset-4 hover:text-zinc-700"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
