import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, Loader2, MapPin, Phone } from 'lucide-react'

const DEMO_CREDS = [
  { label: 'Admin',   email: 'ashutosh@adoracoatings.com', pw: 'admin123'   },
  { label: 'Manager', email: 'manager@adoracoatings.com',  pw: 'manager123' },
  { label: 'Sales',   email: 'sales@adoracoatings.com',    pw: 'sales123'   },
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

        {/* Left — Adora green panel */}
        <div className="w-[44%] flex flex-col justify-between py-10 px-9 shrink-0"
          style={{ background: 'linear-gradient(160deg, #2d5213 0%, #3d6b1a 55%, #2d5213 100%)' }}>

          {/* Logo on white card */}
          <div>
            <div className="bg-white rounded-xl px-4 py-3 inline-block mb-4 shadow-sm">
              <img
                src={`${import.meta.env.BASE_URL}adora-logo.png`}
                alt="Adora Coatings"
                className="h-10 w-auto object-contain object-left"
              />
            </div>
            <p className="text-white/50 text-[11px] tracking-widest uppercase font-semibold">Business Dashboard</p>
          </div>

          {/* Headline + description */}
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold text-white leading-snug">
              Premium Wall Finishes<br />& Designer Coatings
            </h2>
            <p className="text-white/55 text-xs leading-relaxed">
              Transforming spaces with luxury metallic finishes, Moroccan plasters, and bespoke interior solutions since 1996.
            </p>
          </div>

          {/* Stats 2x2 */}
          <div className="grid grid-cols-2 gap-3">
            {STATS.map(s => (
              <div key={s.v} className="rounded-xl px-4 py-3 border border-white/15" style={{ background: 'rgba(255,255,255,0.09)' }}>
                <p className="font-display text-xl font-bold text-[#b5db69]">{s.v}</p>
                <p className="text-white/50 text-[11px] mt-0.5">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-white/50 text-[11px]">
              <MapPin size={12} className="mt-0.5 shrink-0 text-[#b5db69]" />
              <span>175/1, Pavilion Rd, Jaya Nagar 1st Block,<br />Bengaluru – 560 011, Karnataka</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-[11px]">
              <Phone size={12} className="shrink-0 text-[#b5db69]" />
              <span>+91 98800 33353 | 98800 44000</span>
            </div>
          </div>

          {/* The Raise */}
          <div className="flex flex-col gap-1">
            <img
              src={`${import.meta.env.BASE_URL}the-raise-logo.png`}
              alt="The Raise"
              className="h-5 object-contain object-left opacity-40 hover:opacity-70 transition-opacity"
            />
            <p className="text-[9px] text-white/30 font-medium tracking-widest uppercase">Powered by KEJ IT Solutions</p>
          </div>
        </div>

        {/* Right — form */}
        <div className="flex-1 bg-white px-10 py-10 flex flex-col justify-center">

          <h2 className="font-display text-2xl font-bold text-gray-800 mb-1.5">Sign In</h2>
          <p className="text-gray-400 text-sm mb-8">Access your business dashboard</p>

          <form onSubmit={submit} className="space-y-5">
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
              className="w-full btn-gold flex items-center justify-center gap-2 py-3 text-sm font-semibold">
              {loading ? <><Loader2 size={15} className="animate-spin" />Signing in...</> : 'Sign In'}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-8">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-3">Demo Credentials — click to fill</p>
            <div className="space-y-2">
              {DEMO_CREDS.map(c => (
                <button key={c.label} type="button"
                  onClick={() => fillCred(c.email, c.pw)}
                  className="w-full flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 hover:border-brand hover:bg-[#f2f9e8] px-4 py-2.5 transition-all group">
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
