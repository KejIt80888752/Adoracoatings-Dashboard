import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, Loader2, MapPin, Phone, Mail } from 'lucide-react'

const DEMO_CREDS = [
  { label: 'Admin',   email: 'admin@adoracoatings.com',   pw: 'admin123' },
  { label: 'Manager', email: 'manager@adoracoatings.com', pw: 'manager123' },
  { label: 'Sales',   email: 'sales@adoracoatings.com',   pw: 'sales123' },
]

const STATS = [
  { v: '28+',   l: 'Years of\nExpertise'  },
  { v: '2400+', l: 'Projects\nCompleted'  },
  { v: '120+',  l: 'Premium\nProducts'    },
  { v: 'PAN',   l: 'India\nPresence'      },
]

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
    else setError('Invalid credentials. Use a demo account below.')
  }

  const fillCred = (e: string, p: string) => { setEmail(e); setPw(p); setError('') }

  return (
    <div className="min-h-screen flex">

      {/* Left — dark brand panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between p-10" style={{ background: 'linear-gradient(160deg, #0d2b2b 0%, #1a4f4f 50%, #0d2b2b 100%)' }}>

        {/* Logo */}
        <div>
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
          <div className="hidden mt-1">
            <p className="font-display font-bold text-white text-2xl tracking-tight">AdoraCoatings</p>
            <p className="text-white/50 text-sm">redefining spaces</p>
          </div>
          <p className="text-white/40 text-xs mt-2 tracking-widest uppercase">Business Dashboard</p>
        </div>

        {/* Headline */}
        <div className="space-y-4">
          <h1 className="font-display text-3xl font-bold text-white leading-snug">
            Premium Wall Finishes &<br />Designer Coatings
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-xs">
            Transforming spaces with luxury metallic finishes, Moroccan plasters, and bespoke interior solutions since 1996.
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            {STATS.map(s => (
              <div key={s.v} className="rounded-xl p-4 border border-white/10" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <p className="font-display text-2xl font-bold text-[#5ecece]">{s.v}</p>
                <p className="text-white/50 text-xs mt-0.5 whitespace-pre-line leading-tight">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="space-y-2 pt-2">
            <div className="flex items-start gap-2 text-white/50 text-xs">
              <MapPin size={12} className="mt-0.5 shrink-0 text-[#5ecece]" />
              <span>No. 4, Pallikaranai, Chennai – 600 100, Tamil Nadu, India</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <Phone size={12} className="shrink-0 text-[#5ecece]" />
              <span>+91 98400 00000</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <Mail size={12} className="shrink-0 text-[#5ecece]" />
              <span>info@adoracoatings.com</span>
            </div>
          </div>
        </div>

        {/* Footer — The Raise */}
        <div className="flex flex-col items-start gap-1">
          <p className="text-[9px] text-white/25 uppercase tracking-widest font-medium">Powered by</p>
          <img
            src={`${import.meta.env.BASE_URL}the-raise-logo.png`}
            alt="The Raise"
            className="h-6 object-contain opacity-50 hover:opacity-80 transition-opacity"
          />
          <p className="text-[9px] text-white/30 font-medium tracking-wide">KEJ IT Solutions</p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="lg:hidden mb-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm font-display">AC</span>
            </div>
            <div>
              <p className="font-display font-bold text-gray-800 text-base">AdoraCoatings</p>
              <p className="text-[10px] text-gray-400">Business Dashboard</p>
            </div>
          </div>

          <h2 className="font-display text-2xl font-bold text-gray-800 mb-1">Sign In</h2>
          <p className="text-gray-400 text-sm mb-6">Access your business dashboard</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@adoracoatings.com" className="input-dark" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wider">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} required value={pw} onChange={e => setPw(e.target.value)}
                  placeholder="Enter your password" className="input-dark pr-10" />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors">
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2">{error}</div>
            )}
            <button type="submit" disabled={loading}
              className="w-full btn-gold flex items-center justify-center gap-2 py-3 text-sm font-semibold">
              {loading ? <><Loader2 size={16} className="animate-spin" />Signing in...</> : 'Sign In →'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Demo Accounts — click to fill</p>
            <div className="space-y-2">
              {DEMO_CREDS.map(c => (
                <button key={c.label} type="button"
                  onClick={() => fillCred(c.email, c.pw)}
                  className="w-full text-left rounded-lg border border-gray-200 bg-white hover:border-brand hover:bg-[#f0fafa] px-3 py-2.5 transition-all group">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700 group-hover:text-brand">{c.label}</span>
                    <span className="text-[10px] text-gray-300 group-hover:text-brand/50">click to fill</span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{c.email}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col items-center gap-1 lg:hidden">
            <p className="text-[9px] text-gray-400 uppercase tracking-widest font-medium">Powered by</p>
            <img
              src={`${import.meta.env.BASE_URL}the-raise-logo.png`}
              alt="The Raise"
              className="h-5 object-contain opacity-60"
            />
            <p className="text-[9px] text-gray-400 font-medium tracking-wide">KEJ IT Solutions</p>
          </div>
        </div>
      </div>
    </div>
  )
}
