import { TrendingUp, TrendingDown, Package, Users, ShoppingCart, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const revenue = [
  { m: 'Nov', v: 182000 }, { m: 'Dec', v: 215000 }, { m: 'Jan', v: 198000 },
  { m: 'Feb', v: 241000 }, { m: 'Mar', v: 279000 }, { m: 'Apr', v: 312000 }, { m: 'May', v: 298000 },
]
const orders = [
  { m: 'Nov', v: 34 }, { m: 'Dec', v: 41 }, { m: 'Jan', v: 38 },
  { m: 'Feb', v: 46 }, { m: 'Mar', v: 53 }, { m: 'Apr', v: 61 }, { m: 'May', v: 58 },
]
const topProducts = [
  { name: 'Metallic Wall Finishes',    revenue: 94000,  units: 320 },
  { name: 'Moroccan Wall Finishes',    revenue: 78000,  units: 265 },
  { name: 'Decorative Wall Finishes',  revenue: 62000,  units: 218 },
  { name: 'Exterior Finishes',         revenue: 51000,  units: 192 },
  { name: 'Designer Flooring',         revenue: 43000,  units: 148 },
]
const recentLeads = [
  { name: 'Rajan Constructions', via: 'WhatsApp', status: 'Hot' },
  { name: 'Metro Infra Ltd',     via: 'Email',    status: 'Warm' },
  { name: 'Lakshmi Interiors',   via: 'WhatsApp', status: 'New' },
  { name: 'Sri Builders',        via: 'Email',    status: 'Hot' },
]
const alerts = [
  { msg: 'Greek Lime Plaster stock low (9 units)',    warn: true },
  { msg: 'Metallic Finish reorder level reached',     warn: true },
  { msg: '6 new leads assigned today',                warn: false },
  { msg: 'Monthly target 91% achieved',               warn: false },
]
const STATS = [
  { label: 'Total Revenue',  val: '₹12,45,000', chg: '+18%', up: true,  icon: TrendingUp,   color: 'text-brand'  },
  { label: 'Active Products',val: '48 SKUs',     chg: '+4 new',up: true,  icon: Package,      color: 'text-blue-400'   },
  { label: 'Active Leads',   val: '236',         chg: '+24 wk', up: true,  icon: Users,        color: 'text-purple-400' },
  { label: 'Pending Orders', val: '58',          chg: '-3 today',up: false,icon: ShoppingCart, color: 'text-orange-400' },
]
const statusBadge: Record<string, string> = { Hot:'badge-red', Warm:'badge-yellow', New:'badge-blue' }
const viaBadge: Record<string, string>    = { WhatsApp:'badge-green', Email:'badge-blue' }

const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12, color: '#374151' }

export default function Dashboard() {
  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="card flex items-start gap-4">
            <div className={`p-2.5 rounded-xl bg-white/5 ${s.color}`}><s.icon size={18} /></div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-white mt-0.5">{s.val}</p>
              <p className={`text-xs mt-1 flex items-center gap-1 ${s.up ? 'text-green-400' : 'text-red-400'}`}>
                {s.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}{s.chg}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div><p className="section-title text-base">Revenue Overview</p><p className="section-sub">Last 7 months</p></div>
            <span className="badge-gold">Live</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={revenue}>
              <defs>
                <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#2a7b7b" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2a7b7b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']} />
              <Area type="monotone" dataKey="v" stroke="#2a7b7b" strokeWidth={2.5} fill="url(#goldGrad)" dot={{ r: 4, fill: '#2a7b7b', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p className="section-title text-base mb-1">Monthly Orders</p>
          <p className="section-sub mb-4">Units dispatched</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={orders} barSize={12}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="v" name="Orders" fill="#2a7b7b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top products */}
        <div className="card xl:col-span-2">
          <p className="section-title text-base mb-4">Top Products by Revenue</p>
          <div className="space-y-3.5">
            {topProducts.map((p, i) => {
              const pct = Math.round((p.revenue / topProducts[0].revenue) * 100)
              return (
                <div key={p.name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-600">
                      <span className="text-gray-600 mr-2 font-mono text-xs">{String(i+1).padStart(2,'0')}</span>
                      {p.name}
                    </span>
                    <span className="text-brand font-semibold">₹{p.revenue.toLocaleString()}</span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-[11px] text-gray-600 mt-0.5">{p.units} units sold</p>
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-4">
          {/* Alerts */}
          <div className="card">
            <p className="section-title text-sm mb-3">Alerts</p>
            <ul className="space-y-2.5">
              {alerts.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                  {a.warn
                    ? <AlertTriangle size={13} className="text-yellow-500 mt-0.5 shrink-0" />
                    : <CheckCircle2  size={13} className="text-green-400 mt-0.5 shrink-0" />}
                  {a.msg}
                </li>
              ))}
            </ul>
          </div>

          {/* Recent leads */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="section-title text-sm">Recent Leads</p>
              <a href="/leads" className="text-xs text-brand hover:text-brand-light flex items-center gap-0.5">
                View all <ArrowUpRight size={11} />
              </a>
            </div>
            <div className="space-y-3">
              {recentLeads.map(l => (
                <div key={l.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand text-xs font-bold shrink-0">
                    {l.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{l.name}</p>
                  </div>
                  <span className={viaBadge[l.via]}>{l.via}</span>
                  <span className={statusBadge[l.status]}>{l.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
