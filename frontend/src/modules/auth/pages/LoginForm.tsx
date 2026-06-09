import logo from '../../../../public/logo.jpeg'
import { useState } from 'react'
import type { SyntheticEvent } from 'react'
import { useAuth } from '../../../context/AuthContext'
import apiClient from '../../../services/apiClient'
import toast from 'react-hot-toast'


function LoginForm() {
  const { login } = useAuth() // <- use context instead of useNavigate
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: SyntheticEvent) => { // SyntheticEvent - works on all versions
    e.preventDefault()
    setLoading(true)
    try {
      const response = await apiClient.post('/auth/login', { email, password })

      if (response.status === 200 && response.data.token) {
        toast.success('Login successful!')
        login(response.data.token, response.data.user) //context handle redirect + state
      }
    }
    catch (err: any) {
      const msg = err?.response?.data?.message || 'Invalid email or password'
      toast.error(msg)
    }
    finally {
      setLoading(false)
    }

  }

  return (
    <div className="min-h-screen overflow-hidden flex bg-[linear-gradient(145deg,#0D2B6E,#123882,#1A4DA0,#2ABFBF)]">
      <div className='w-1/2 flex flex-col items-center justify-center px-16'>
        <img
          src={logo}
          width={180}
          height={70}
          loading='eager'
          decoding='async'
          className="w-[180px] h-[60px] object-contain select-none"
        />
        <p className='text-white text-[36px] leading -[45px] font-["Plus_Jakarta_Sans"]'> Powerful Tenant

          Administration</p>
        <p className='text-white/70 font-["Plus_Jakarta_Sans] text-[18px] font-normal leading-[45px]"]'> Manage users, workflows, approvals, and system <br />
          health from one unified platform built for scale.</p>
      </div>
      <div className='w-1/2 flex items-center justify-center px-16 shrink-0'>
        <div className='rounded-2xl bg-white w-[548px] h-[420px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] px-10 py-10'>
          <h2 className='text-black text-[24px]  font-["Plus_Jakarta_Sans"] font-bold leading-[32px] ' >Welcome Back</h2>
          <p className='text-slate-500 font-["Plus_Jakarta_Sans"] mb-4 text-[14px] font-normal leading-[20px]'> Sign in to your admin account</p>


          <label
            htmlFor="email"
            className='
        text-black
        font-["Plus_Jakarta_Sans"]
        text-[14px]
        font-medium
        leading-[20px]
        my-1
        
      '
          >
            Email Address
          </label>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
        w-full
        rounded-xl
        border
        border-gray-300
        px-4
        py-3
        my-2
        outline-none
        focus:border-blue-600
        placeholder:text-[rgba(15,23,42,0.50)]
         placeholder:text-[14px]
    placeholder:font-normal
    placeholder:font-['Plus_Jakarta_Sans']
      "
          />

          {/* Password */}


          <label
            htmlFor="email"
            className='
        text-black
        font-["Plus_Jakarta_Sans"]
        text-[14px]
        font-normal
        leading-[20px]
        my-1
      '
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
        w-full
        rounded-xl
        border
        border-gray-300
        px-4
        py-3
        my-2
        outline-none
        focus:border-blue-600
        placeholder:text-[rgba(15,23,42,0.50)]
         placeholder:text-[14px]
    placeholder:font-normal
    placeholder:font-['Plus_Jakarta_Sans']
      "
          />


          <div className="flex justify-end my-3">
            <a
              href="/forgot-password"
              className="
        text-blue-600
        text-sm
        font-medium
        hover:underline
        transition-colors
      "
            >
              Forgot Password?
            </a>
          </div>



          <button
            type='button'
            className="w-full bg-blue-600 text-white p-3 rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  )
}
export default LoginForm