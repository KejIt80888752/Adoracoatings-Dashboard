import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react'

export default function Login() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [email, setEmail]   = useState('')
  const [pw, setPw]         = useState('')
  const [show, setShow]     = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    const ok = login(email, pw)
    setLoading(false)
    if (ok) navigate('/')
    else setError('Invalid credentials. Password must be at least 6 characters.')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 bg-brand relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative z-10">
          <img
            src="https://www.adoracoatings.com/assets/images/AA0030/dynamic/companylogos/ar9x2/Adora-Coatings-Logo-White.png"
            alt="AdoraCoatings"
            className="h-14 object-contain"
            onError={e => {
              e.currentTarget.style.display = 'none'
              const fb = e.currentTarget.nextElementSibling as HTMLElement
              if (fb) fb.classList.remove('hidden')
            }}
          />
          <div className="hidden">
            <p className="font-display font-bold text-white text-2xl">AdoraCoatings</p>
            <p className="text-white/70 text-sm">redefining spaces</p>
          </div>
        </div>

        {/* Text */}
        <div className="relative z-10">
          <h1 className="font-display text-4xl font-bold text-white leading-tight mb-4">
            Transform Spaces<br />with Elegance
          </h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-xs">
            Over 28 years of expertise in premium interior & exterior wall finishes, metallic coatings, and designer flooring.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-10">
            {[{l:'Years',v:'28+'},{l:'Projects',v:'2400+'},{l:'Products',v:'120+'}].map(s=>(
              <div key={s.l} className="border border-white/20 rounded-xl p-4 text-center bg-white/10">
                <p className="font-display text-2xl font-bold text-gray-800">{s.v}</p>
                <p className="text-xs text-white/60 mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-white/40 relative z-10">© {new Date().getFullYear()} AdoraCoatings. All rights reserved.</p>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden mb-8">
            <img
              src="https://www.adoracoatings.com/assets/images/AA0030/dynamic/companylogos/ar9x2/Adora-Coatings-Logo-White.png"
              alt="AdoraCoatings"
              className="h-10 object-contain brightness-0"
              onError={e => { e.currentTarget.style.display='none' }}
            />
          </div>

          <h2 className="font-display text-3xl font-bold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-gray-400 text-sm mb-8">Sign in to your business dashboard</p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                placeholder="you@adoracoatings.com" className="input-dark" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={show?'text':'password'} required value={pw} onChange={e=>setPw(e.target.value)}
                  placeholder="Enter your password" className="input-dark pr-10" />
                <button type="button" onClick={()=>setShow(s=>!s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors">
                  {show?<EyeOff size={16}/>:<Eye size={16}/>}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2.5">{error}</div>
            )}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded accent-brand" /> Remember me
              </label>
              <a href="#" className="text-brand hover:text-brand-dark">Forgot password?</a>
            </div>
            <button type="submit" disabled={loading}
              className="w-full btn-gold flex items-center justify-center gap-2 py-3 text-sm font-semibold">
              {loading?<><Loader2 size={16} className="animate-spin"/>Signing in...</>:'Sign In to Dashboard'}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
            <ShieldCheck size={13} className="text-brand/60" />
            Protected with 256-bit SSL encryption
          </div>
        </div>
      </div>
    </div>
  )
}
