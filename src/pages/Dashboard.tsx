import { useEffect, useState } from 'react'
import { TrendingUp, Package, Users, IndianRupee, AlertTriangle, CheckCircle2, ArrowUpRight } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { fetchSheet } from '../lib/api'
import { useLanguage } from '../hooks/useLanguage'

const fmt = (n: number) => '₹' + Math.round(n).toLocaleString('en-IN')

// Sheet dates round-trip as either a plain "DD/MM/YYYY" string (typed via the
// forms) or a full ISO datetime (Google Sheets' auto-conversion) -- handle both.
function parseDate(d: string): Date | null {
  if (!d) return null
  const iso = d.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3])
  const dmy = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (dmy) return new Date(+dmy[3], +dmy[2] - 1, +dmy[1])
  return null
}

function fmtDate(d: string): string {
  const parsed = parseDate(d)
  if (!parsed) return d || '—'
  return `${String(parsed.getDate()).padStart(2,'0')}/${String(parsed.getMonth()+1).padStart(2,'0')}/${parsed.getFullYear()}`
}

type InvoiceRow = {
  'Doc Type': string; 'Invoice No': string; Date: string; Party: string
  'Sub Total': string; CGST: string; SGST: string; IGST: string; 'Grand Total': string
  'Advance Paid': string; 'Total Due': string; Status: string
}
type QuoteRow = { 'Quote No': string; Date: string; 'Client Name': string; Status: string; 'Grand Total': string }

const statusBadge: Record<string, string> = { Settled: 'badge-green', Paid: 'badge-green', Pending: 'badge-yellow', 'In Progress': 'badge-blue' }
const tipStyle = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12, color: '#374151' }
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function Dashboard() {
  const { t } = useLanguage()
  const [invoices, setInvoices] = useState<InvoiceRow[]>([])
  const [quotes, setQuotes] = useState<QuoteRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetchSheet<InvoiceRow>('Invoices'),
      fetchSheet<QuoteRow>('Quotations'),
    ]).then(([inv, q]) => { setInvoices(inv); setQuotes(q) }).finally(() => setLoading(false))
  }, [])

  const taxInvoices = invoices.filter(r => r['Doc Type'] === 'Tax Invoice')

  const totalRevenue = taxInvoices.reduce((s, r) => s + (Number(r['Grand Total']) || 0), 0)
  const gstPaid      = taxInvoices.reduce((s, r) => s + (Number(r.CGST) || 0) + (Number(r.SGST) || 0) + (Number(r.IGST) || 0), 0)
  const grossProfit  = totalRevenue - gstPaid
  const totalCollected = taxInvoices.reduce((s, r) => {
    if (r.Status === 'Paid') return s + (Number(r['Grand Total']) || 0)
    return s + (Number(r['Advance Paid']) || 0)
  }, 0)
  const activeProjects = quotes.filter(q => q.Status !== 'Completed').length

  const STATS = [
    { label: t('dash.totalRevenue'),   val: fmt(totalRevenue),   sub: `${taxInvoices.length} ${t(taxInvoices.length===1 ? 'dash.invoice' : 'dash.invoices')}`, icon: IndianRupee, color: 'text-brand'       },
    { label: t('dash.grossProfit'),    val: fmt(grossProfit),    sub: t('dash.revenueLessGst'),                                              icon: TrendingUp,  color: 'text-green-500'  },
    { label: t('dash.totalCollected'), val: fmt(totalCollected), sub: t('dash.inclAdvances'),                                                icon: Package,     color: 'text-blue-500'   },
    { label: t('dash.activeProjects'), val: String(activeProjects), sub: 'FY 2026–27',                                                        icon: Users,       color: 'text-purple-500' },
  ]

  // Monthly Revenue & Profit -- group Tax Invoices by calendar month.
  const monthly = new Map<string, { m: string; revenue: number; profit: number; sortKey: number }>()
  for (const r of taxInvoices) {
    const d = parseDate(r.Date)
    if (!d) continue
    const key = `${d.getFullYear()}-${d.getMonth()}`
    const grand = Number(r['Grand Total']) || 0
    const gst = (Number(r.CGST) || 0) + (Number(r.SGST) || 0) + (Number(r.IGST) || 0)
    const entry = monthly.get(key) || { m: MONTHS[d.getMonth()], revenue: 0, profit: 0, sortKey: d.getFullYear() * 12 + d.getMonth() }
    entry.revenue += grand
    entry.profit  += grand - gst
    monthly.set(key, entry)
  }
  const revenueData = Array.from(monthly.values()).sort((a, b) => a.sortKey - b.sortKey)

  const expenseData = [
    { name: 'Material', v: 0 },
    { name: 'Labour',   v: 0 },
    { name: 'GST Paid', v: gstPaid },
    { name: 'Misc',     v: 0 },
  ]

  const topProjects = [...taxInvoices]
    .sort((a, b) => (Number(b['Grand Total']) || 0) - (Number(a['Grand Total']) || 0))
    .slice(0, 5)
    .map(r => ({
      name: r.Party || r['Invoice No'],
      value: Number(r['Grand Total']) || 0,
      profit: (Number(r['Grand Total']) || 0) - ((Number(r.CGST) || 0) + (Number(r.SGST) || 0) + (Number(r.IGST) || 0)),
    }))

  const recentProjects = [...taxInvoices]
    .map(r => ({ name: r.Party || r['Invoice No'], date: fmtDate(r.Date), status: r.Status || 'Pending', sortKey: parseDate(r.Date)?.getTime() || 0 }))
    .sort((a, b) => b.sortKey - a.sortKey)
    .slice(0, 5)

  const overdue = taxInvoices.filter(r => (Number(r['Total Due']) || 0) > 0)
  const alerts = overdue.slice(0, 4).map(r => ({
    msg: `${r.Party || r['Invoice No']} ${t('dash.hasDueOn', { amt: fmt(Number(r['Total Due']) || 0), inv: r['Invoice No'] })}`,
    warn: true,
  }))
  if (alerts.length === 0 && taxInvoices.length > 0) alerts.push({ msg: t('dash.allCollected'), warn: false })

  return (
    <div className="space-y-5">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {STATS.map(s => (
          <div key={s.label} className="card flex items-start gap-4">
            <div className={`p-2.5 rounded-xl bg-gray-50 ${s.color}`}><s.icon size={18} /></div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{s.label}</p>
              <p className="text-xl font-bold text-gray-800 mt-0.5">{loading ? '…' : s.val}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div><p className="section-title text-base">{t('dash.monthlyRevenueProfit')}</p><p className="section-sub">FY 2026–27</p></div>
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
          <p className="section-title text-base mb-1">{t('dash.expenseBreakdown')}</p>
          <p className="section-sub mb-4">{t('dash.totalFY')}</p>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={expenseData} barSize={24}>
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
          <p className="section-title text-base mb-4">{t('dash.topProjectsByRevenue')}</p>
          <div className="space-y-3.5">
            {!loading && topProjects.length === 0 && <p className="text-sm text-gray-400 text-center py-6">{t('dash.noProjectsYet')}</p>}
            {topProjects.map((p, i) => {
              const pct = Math.round((p.value / topProjects[0].value) * 100)
              return (
                <div key={p.name + i}>
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
            <p className="section-title text-sm mb-3">{t('dash.alerts')}</p>
            <ul className="space-y-2.5">
              {!loading && alerts.length === 0 && <li className="text-xs text-gray-400 text-center py-2">{t('dash.noAlerts')}</li>}
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
              <p className="section-title text-sm">{t('dash.recentProjects')}</p>
              <a href="#/billing" className="text-xs text-brand hover:text-brand-light flex items-center gap-0.5">
                {t('dash.viewAll')} <ArrowUpRight size={11} />
              </a>
            </div>
            <div className="space-y-2.5">
              {!loading && recentProjects.length === 0 && <p className="text-xs text-gray-400 text-center py-2">{t('dash.noRecentProjects')}</p>}
              {recentProjects.map((p, i) => (
                <div key={p.name + i} className="flex items-center gap-2">
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
