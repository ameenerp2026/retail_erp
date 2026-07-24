import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { useAuth } from '../../../context/AuthContext'
import apiClient from '../../../services/apiClient'
import toast from 'react-hot-toast'

function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    console.log(' email, password ', email, password )
    try {
      const response = await apiClient.post('/api/auth/login', { email, password })
      console.log('email, password',email, password)
      if (response.status === 200 && response.data.token) {
        toast.success('Login successful!')
        login(response.data.token, response.data.user)
        
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid email or password'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[linear-gradient(145deg,#0D2B6E,#123882,#1A4DA0,#2ABFBF)] lg:flex-row">
      {/* Brand panel */}
      <div className="flex flex-col items-center justify-center px-6 py-10 text-center sm:px-10 lg:w-1/2 lg:px-16 lg:py-0 lg:text-left lg:items-start">
        <img
          src="/logo.jpeg"
          width={180}
          height={70}
          loading="eager"
          decoding="async"
          alt="Streamys"
          className="mb-6 h-[52px] w-auto object-contain select-none sm:h-[60px]"
        />
        <p className="max-w-md text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl">
          Powerful Tenant Administration
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
          Manage users, workflows, approvals, and system health from one unified
          platform built for scale.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-start justify-center px-4 pb-10 sm:px-8 lg:w-1/2 lg:items-center lg:px-16 lg:pb-0">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-[420px] rounded-2xl bg-white px-5 py-7 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] sm:px-8 sm:py-9 lg:max-w-[480px]"
        >
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Welcome Back
          </h2>
          <p className="mt-1 mb-5 text-sm text-slate-500">
            Sign in to your admin account
          </p>

          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-800">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#043793] focus:ring-2 focus:ring-[#043793]/15"
          />

          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-800">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#043793] focus:ring-2 focus:ring-[#043793]/15"
          />

          <div className="mb-5 flex justify-end">
            <a
              href="/forgot-password"
              className="text-sm font-medium text-[#043793] transition-colors hover:underline"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-[#043793] p-3.5 text-sm font-semibold text-white transition hover:bg-[#032d75] disabled:cursor-not-allowed disabled:bg-slate-400"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginForm
