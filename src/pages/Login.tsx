import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'

export default function Login() {
  const { login } = useAuth()
  const navigate   = useNavigate()
  const [email, setEmail]   = useState('')
  const [pw, setPw]         = useState('')
  const [show, setShow]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 700))
    const ok = login(email, pw)
    setLoading(false)
    if (ok) navigate('/')
    else setError('Invalid credentials. Please check your email and password.')
  }

  return (
    <div className="min-h-screen bg-brand-dark flex">

      {/* Left panel — brand */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-brand-sidebar border-r border-brand-border relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-brand-gold/5" />
        <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-brand-gold/5" />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-brand-gold flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-black">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4a3 3 0 110 6 3 3 0 010-6zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/>
            </svg>
          </div>
          <div>
            <p className="font-display font-bold text-white text-lg leading-tight">AdoraCoatings</p>
            <p className="text-xs text-gray-500">Business Portal</p>
          </div>
        </div>

        {/* Hero text */}
        <div className="relative z-10">
          <h1 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Transform Spaces<br />
            <span className="text-brand-gold">with Elegance</span>
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            Over 28 years of expertise in decorative interior & exterior wall finishes, metallic coatings, and designer flooring.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[
              { label: 'Years', value: '28+' },
              { label: 'Projects', value: '2400+' },
              { label: 'Products', value: '120+' },
            ].map(s => (
              <div key={s.label} className="border border-brand-border rounded-xl p-4 text-center">
                <p className="font-display text-2xl font-bold text-brand-gold">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-gray-600 relative z-10">© {new Date().getFullYear()} AdoraCoatings. All rights reserved.</p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-brand-gold flex items-center justify-center">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-black">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4a3 3 0 110 6 3 3 0 010-6zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
            <span className="font-display font-bold text-white text-lg">AdoraCoatings</span>
          </div>

          <h2 className="font-display text-3xl font-bold text-white mb-2">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">Sign in to your business dashboard</p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@adoracoatings.com"
                className="input-dark"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  required
                  value={pw}
                  onChange={e => setPw(e.target.value)}
                  placeholder="Enter your password"
                  className="input-dark pr-10"
                />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-brand-gold transition-colors">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-3 py-2.5">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded accent-yellow-500" />
                Remember me
              </label>
              <a href="#" className="text-brand-gold hover:text-brand-gold-light">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading}
              className="w-full btn-gold flex items-center justify-center gap-2 py-3 text-sm font-semibold">
              {loading ? <><Loader2 size={16} className="animate-spin" />Signing in...</> : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-2 text-xs text-gray-600">
            <ShieldCheck size={13} className="text-brand-gold/60" />
            Protected with 256-bit SSL encryption
          </div>
        </div>
      </div>
    </div>
  )
}
