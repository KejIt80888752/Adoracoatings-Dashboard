import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, Loader2, MapPin, Phone } from 'lucide-react'

const DEMO_CREDS = [
  { label: 'Admin',   email: 'admin@adoracoatings.com',   pw: 'admin123' },
  { label: 'Manager', email: 'manager@adoracoatings.com', pw: 'manager123' },
  { label: 'Sales',   email: 'sales@adoracoatings.com',   pw: 'sales123' },
]

const STATS = [
  { v: '28+',   l: 'Years'    },
  { v: '2400+', l: 'Projects' },
  { v: '120+',  l: 'Products' },
  { v: 'PAN',   l: 'India'    },
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
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#eef2f5' }}>

      {/* Centered card */}
      <div className="flex w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl">

        {/* Left — dark panel */}
        <div className="w-[42%] flex flex-col justify-between p-8 shrink-0"
          style={{ background: 'linear-gradient(160deg, #0f2b3d 0%, #1a4050 60%, #0f2b3d 100%)' }}>

          {/* Logo */}
          <div>
            <img
              src="https://www.adoracoatings.com/assets/images/AA0030/dynamic/companylogos/ar9x2/Adora-Coatings-Logo-White.png"
              alt="AdoraCoatings"
              className="h-12 object-contain object-left"
              onError={e => {
                e.currentTarget.style.display = 'none'
                const fb = e.currentTarget.nextElementSibling as HTMLElement
                if (fb) fb.classList.remove('hidden')
              }}
            />
            <div className="hidden">
              <p className="font-display font-bold text-white text-xl">AdoraCoatings</p>
            </div>
            <p className="text-white/40 text-[11px] mt-1.5 tracking-widest uppercase font-medium">Business Dashboard</p>
          </div>

          {/* Headline + description */}
          <div className="space-y-3">
            <h2 className="font-display text-xl font-bold text-white leading-snug">
              Premium Wall Finishes<br />& Designer Coatings
            </h2>
            <p className="text-white/50 text-xs leading-relaxed">
              Transforming spaces with luxury metallic finishes, Moroccan plasters, and bespoke interior solutions since 1996.
            </p>
          </div>

          {/* Stats 2x2 */}
          <div className="grid grid-cols-2 gap-2">
            {STATS.map(s => (
              <div key={s.v} className="rounded-xl p-3 border border-white/10" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <p className="font-display text-lg font-bold text-[#5ecece]">{s.v}</p>
                <p className="text-white/45 text-[11px] mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <div className="flex items-start gap-1.5 text-white/40 text-[11px]">
              <MapPin size={11} className="mt-0.5 shrink-0 text-[#5ecece]" />
              <span>Pallikaranai, Chennai – 600 100, Tamil Nadu</span>
            </div>
            <div className="flex items-center gap-1.5 text-white/40 text-[11px]">
              <Phone size={11} className="shrink-0 text-[#5ecece]" />
              <span>+91 98400 00000</span>
            </div>
          </div>

          {/* The Raise */}
          <div className="flex flex-col gap-0.5">
            <img
              src={`${import.meta.env.BASE_URL}the-raise-logo.png`}
              alt="The Raise"
              className="h-5 object-contain object-left opacity-40 hover:opacity-70 transition-opacity"
            />
            <p className="text-[9px] text-white/25 font-medium tracking-widest uppercase">Powered by KEJ IT Solutions</p>
          </div>
        </div>

        {/* Right — form */}
        <div className="flex-1 bg-white p-8 flex flex-col justify-center">

          <h2 className="font-display text-2xl font-bold text-gray-800 mb-1">Sign In</h2>
          <p className="text-gray-400 text-sm mb-6">Access your business dashboard</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@adoracoatings.com" className="input-dark" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} required value={pw} onChange={e => setPw(e.target.value)}
                  placeholder="••••••••" className="input-dark pr-10" />
                <button type="button" onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand transition-colors">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2">{error}</div>
            )}
            <button type="submit" disabled={loading}
              className="w-full btn-gold flex items-center justify-center gap-2 py-2.5 text-sm font-semibold">
              {loading ? <><Loader2 size={15} className="animate-spin" />Signing in...</> : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-5">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">Demo Credentials — click to fill</p>
            <div className="space-y-1.5">
              {DEMO_CREDS.map(c => (
                <button key={c.label} type="button"
                  onClick={() => fillCred(c.email, c.pw)}
                  className="w-full flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 hover:border-brand hover:bg-[#f0fafa] px-3 py-2 transition-all group">
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-brand">{c.label}</span>
                  <span className="text-[11px] text-gray-400 group-hover:text-brand/60">{c.email}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
