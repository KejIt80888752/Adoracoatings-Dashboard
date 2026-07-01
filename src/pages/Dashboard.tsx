import { TrendingUp, Package, Users, IndianRupee, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

const revenueData = [
  { m: 'Aug', revenue: 231228, profit: 109307 },
  { m: 'Sep', revenue: 605358, profit: 88174  },
  { m: 'Oct', revenue: 554005, profit: 156310 },
  { m: 'Nov', revenue: 905714, profit: 279887 },
]

const topProjects = [
  { name: 'SHUBHARAM COMPLEX',     value: 854583, profit: 256013 },
  { name: 'LAMY STORE',            value: 284960, profit: 95216  },
  { name: 'G P SPORTS & INFRA',    value: 238714, profit: 17010  },
  { name: 'STREAMLINE FITNESS',    value: 197017, profit: 39639  },
  { name: 'ARYAN INTERIORS - TN',  value: 98016,  profit: 57593  },
]

const recentProjects = [
  { name: 'POWER PLUS ENTERPRISES', date: '07-Nov-23', status: 'Settled',  },
  { name: 'YUKI PAN ASIAN',         date: '03-Nov-23', status: 'Pending',  },
  { name: 'PNG HEALTHCARE',         date: '03-Nov-23', status: 'Settled',  },
  { name: 'PURVA SKYWOOD',          date: '30-Oct-23', status: 'Settled',  },
  { name: 'SQUIRE HWFS',            date: '19-Oct-23', status: 'Settled',  },
]

const alerts = [
  { msg: 'YUKI PAN ASIAN — balance pending ₹7,422',    warn: true  },
  { msg: 'ARYAN INTERIORS balance ₹117 pending',       warn: true  },
  { msg: '17 projects completed this financial year',  warn: false },
  { msg: 'Gross profit margin: 28.5%',                 warn: false },
]

const STATS = [
  { label: 'Total Revenue',   val: '₹20.74L', sub: '17 projects',    icon: IndianRupee, color: 'text-brand'       },
  { label: 'Gross Profit',    val: '₹5.92L',  sub: '28.5% margin',   icon: TrendingUp,  color: 'text-green-500'  },
  { label: 'Total Collected', val: '₹21.50L', sub: 'Incl. advances', icon: Package,     color: 'text-blue-500'   },
  { label: 'Active Projects', val: '17',       sub: 'FY 2023–24',     icon: Users,       color: 'text-purple-500' },
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
            <div><p className="section-title text-base">Monthly Revenue & Profit</p><p className="section-sub">FY 2023–24</p></div>
            <span className="badge-gold">FY 2023-24</span>
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
          <p className="section-sub mb-4">Total FY 2023–24</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={[
              { name: 'Material', v: 971128 },
              { name: 'Labour',   v: 166960 },
              { name: 'GST Paid', v: 173414 },
              { name: 'Misc',     v: 28732  },
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
