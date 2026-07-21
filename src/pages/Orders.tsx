import { useState } from 'react'
import { Search, CheckCircle2, Clock, Download } from 'lucide-react'

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

const PROJECTS: { sl: number; name: string; date: string; inv: string; base: number; gst: number; total: number; rcvd: number; profit: number; pending: number; status: string }[] = []

const statusBadge: Record<string, string> = { Settled: 'badge-green', Pending: 'badge-yellow', 'In Progress': 'badge-blue' }
const TABS = ['All', 'Settled', 'Pending', 'In Progress']

export default function Orders() {
  const [search, setSearch] = useState('')
  const [tab, setTab]       = useState('All')

  const filtered = PROJECTS.filter(p =>
    (tab === 'All' || p.status === tab) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.inv.toLowerCase().includes(search.toLowerCase()))
  )

  const settled = PROJECTS.filter(p => p.status === 'Settled').length
  const totalRev = PROJECTS.reduce((s, p) => s + p.total, 0)
  const totalPro = PROJECTS.reduce((s, p) => s + p.profit, 0)

  return (
    <div className="space-y-4">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card-sm"><p className="text-xs text-gray-400 mb-0.5">Total Projects</p><p className="text-xl font-bold text-gray-800">{PROJECTS.length}</p></div>
        <div className="card-sm"><p className="text-xs text-gray-400 mb-0.5">Settled</p><p className="text-xl font-bold text-green-500">{settled}</p></div>
        <div className="card-sm"><p className="text-xs text-gray-400 mb-0.5">Total Revenue</p><p className="text-lg font-bold text-brand">{fmt(totalRev)}</p></div>
        <div className="card-sm"><p className="text-xs text-gray-400 mb-0.5">Gross Profit</p><p className="text-lg font-bold text-gray-800">{fmt(totalPro)}</p></div>
      </div>

      {/* Toolbar */}
      <div className="card p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search project or invoice…" className="input-dark pl-9 w-full" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all border ${tab === t ? 'bg-brand text-white border-brand' : 'border-gray-200 text-gray-500 hover:border-brand/40 hover:text-brand'}`}>{t}</button>
          ))}
        </div>
        <button onClick={() => { const rows = PROJECTS.map(p => [p.sl,p.name,p.inv,p.date,p.base,p.gst,p.total,p.rcvd,p.profit,p.status].join(",")).join("\n"); const csv = "Sl,Project,Invoice,Date,Base,GST,Total,Received,Profit,Status\n" + rows; const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download = "orders.csv"; a.click(); }} className="btn-gold flex items-center gap-1.5 text-xs shrink-0"><Download size={13} /> Export</button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead>
              <tr>
                <th>#</th><th>Project Name</th><th>Invoice #</th><th>Date</th>
                <th className="text-right">Base Value</th><th className="text-right">GST</th>
                <th className="text-right">Total</th><th className="text-right">Received</th>
                <th className="text-right text-red-500">Pending Amount</th><th className="text-right">Profit</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={11} className="text-center py-10 text-gray-400">No orders yet</td></tr>
              )}
              {filtered.map(p => (
                <tr key={p.sl}>
                  <td className="text-gray-400 font-mono text-xs">{String(p.sl).padStart(2,'0')}</td>
                  <td className="font-medium text-gray-700 max-w-[180px] truncate">{p.name}</td>
                  <td className="font-mono text-xs text-gray-500">{p.inv}</td>
                  <td className="text-gray-500 text-xs">{p.date}</td>
                  <td className="text-right text-gray-600">{fmt(p.base)}</td>
                  <td className="text-right text-gray-500 text-xs">{fmt(p.gst)}</td>
                  <td className="text-right font-semibold text-brand">{fmt(p.total)}</td>
                  <td className="text-right text-gray-600">{fmt(p.rcvd)}</td>
                  <td className="text-right font-semibold text-red-500">{p.pending > 0 ? fmt(p.pending) : <span className="text-green-500 text-xs">—</span>}</td>
                  <td className="text-right font-semibold text-green-600">{fmt(p.profit)}</td>
                  <td>
                    <span className={statusBadge[p.status] ?? 'badge-gray'}>
                      {p.status === 'Settled' ? <CheckCircle2 size={10} className="inline mr-1" /> : <Clock size={10} className="inline mr-1" />}
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td colSpan={4} className="px-4 py-3 text-sm text-gray-600">Total ({filtered.length} projects)</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">{fmt(filtered.reduce((s,p)=>s+p.base,0))}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">{fmt(filtered.reduce((s,p)=>s+p.gst,0))}</td>
                <td className="px-4 py-3 text-right text-sm text-brand">{fmt(filtered.reduce((s,p)=>s+p.total,0))}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">{fmt(filtered.reduce((s,p)=>s+p.rcvd,0))}</td>
                <td className="px-4 py-3 text-right text-sm text-green-600">{fmt(filtered.reduce((s,p)=>s+p.profit,0))}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
