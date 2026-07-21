import { TrendingUp, Package, Users, IndianRupee, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

const revenueData: { m: string; revenue: number; profit: number }[] = []

const topProjects: { name: string; value: number; profit: number }[] = []

const recentProjects: { name: string; date: string; status: string }[] = []

const alerts: { msg: string; warn: boolean }[] = []

const STATS = [
  { label: 'Total Revenue',   val: '₹0', sub: '0 projects',    icon: IndianRupee, color: 'text-brand'       },
  { label: 'Gross Profit',    val: '₹0', sub: '—',             icon: TrendingUp,  color: 'text-green-500'  },
  { label: 'Total Collected', val: '₹0', sub: 'Incl. advances', icon: Package,     color: 'text-blue-500'   },
  { label: 'Active Projects', val: '0',  sub: 'FY 2026–27',     icon: Users,       color: 'text-purple-500' },
]

const statusBadge: Record<string, string> = { Settled: 'badge-green', Pending: 'badge-yellow', 'In Progress': 'badge-blue' }
const tipStyle = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12, color: '#374151' }

export default function Dashboard() {
  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="card flex items-start gap-4">
            <div className={`p-2.5 rounded-xl bg-gray-50 ${s.color}`}><s.icon size={18} /></div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-gray-800 mt-0.5">{s.val}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div><p className="section-title text-base">Monthly Revenue & Profit</p><p className="section-sub">FY 2026–27</p></div>
            <span className="badge-gold">FY 2026-27</span>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#4a7c1f" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#4a7c1f" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="profGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} />
              <Tooltip contentStyle={tipStyle} formatter={(v: number) => [fmt(v)]} />
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#4a7c1f" strokeWidth={2.5} fill="url(#revGrad)" dot={{ r: 3, fill: '#4a7c1f', strokeWidth: 0 }} />
              <Area type="monotone" dataKey="profit"  name="Profit"  stroke="#22c55e" strokeWidth={2}   fill="url(#profGrad)" dot={{ r: 3, fill: '#22c55e',  strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p className="section-title text-base mb-1">Expense Breakdown</p>
          <p className="section-sub mb-4">Total FY 2026–27</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={[
              { name: 'Material', v: 0 },
              { name: 'Labour',   v: 0 },
              { name: 'GST Paid', v: 0 },
              { name: 'Misc',     v: 0 },
            ]} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} />
              <Tooltip contentStyle={tipStyle} formatter={(v: number) => [fmt(v), 'Amount']} />
              <Bar dataKey="v" fill="#4a7c1f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Top projects */}
        <div className="card xl:col-span-2">
          <p className="section-title text-base mb-4">Top Projects by Revenue</p>
          <div className="space-y-3.5">
            {topProjects.length === 0 && <p className="text-sm text-gray-400 text-center py-6">No projects yet</p>}
            {topProjects.map((p, i) => {
              const pct = Math.round((p.value / topProjects[0].value) * 100)
              return (
                <div key={p.name}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-gray-600">
                      <span className="text-gray-400 mr-2 font-mono text-xs">{String(i+1).padStart(2,'0')}</span>
                      {p.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-green-500 font-medium">+{fmt(p.profit)}</span>
                      <span className="text-brand font-semibold text-sm">{fmt(p.value)}</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
                  </div>
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
              {alerts.length === 0 && <li className="text-xs text-gray-400 text-center py-2">No alerts</li>}
              {alerts.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-gray-500">
                  {a.warn
                    ? <AlertTriangle size={13} className="text-yellow-500 mt-0.5 shrink-0" />
                    : <CheckCircle2  size={13} className="text-green-400 mt-0.5 shrink-0" />}
                  {a.msg}
                </li>
              ))}
            </ul>
          </div>

          {/* Recent projects */}
          <div className="card">
            <div className="flex items-center justify-between mb-3">
              <p className="section-title text-sm">Recent Projects</p>
              <a href="#/orders" className="text-xs text-brand hover:text-brand-light flex items-center gap-0.5">
                View all <ArrowUpRight size={11} />
              </a>
            </div>
            <div className="space-y-2.5">
              {recentProjects.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No recent projects</p>}
              {recentProjects.map(p => (
                <div key={p.name} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand text-xs font-bold shrink-0">
                    {p.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-400">{p.date}</p>
                  </div>
                  <span className={statusBadge[p.status] ?? 'badge-gray'}>{p.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
