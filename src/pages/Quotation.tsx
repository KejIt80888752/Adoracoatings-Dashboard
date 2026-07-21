import { useState } from 'react'

const PROJECTS: { sl: number; name: string; date: string; inv: string; base: number; gst: number; total: number; pending: number }[] = []

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

function getStatus(pending: number): { label: string; badge: string } {
  if (Math.abs(pending) < 1) return { label: 'Completed',   badge: 'badge-green'  }
  if (pending > 500)         return { label: 'Pending',     badge: 'badge-red'    }
  return                            { label: 'In Progress', badge: 'badge-yellow' }
}

export default function Quotation() {
  const [search, setSearch] = useState('')
  const filtered = PROJECTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.inv.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="section-title">Quotations</h1>
        <p className="section-sub">All project quotations for FY 2026-27</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-brand">{PROJECTS.length}</div>
          <div className="text-xs text-gray-500 mt-1">Total Quotations</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-brand">{fmt(PROJECTS.reduce((s,p)=>s+p.total,0))}</div>
          <div className="text-xs text-gray-500 mt-1">Total Value</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-green-600">{PROJECTS.filter(p=>getStatus(p.pending).label==='Completed').length}</div>
          <div className="text-xs text-gray-500 mt-1">Completed</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-yellow-600">{PROJECTS.filter(p=>getStatus(p.pending).label!=='Completed').length}</div>
          <div className="text-xs text-gray-500 mt-1">Pending / In Progress</div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">Quotation List</h2>
          <input
            type="text"
            placeholder="Search project or quotation #…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Sl</th><th>Project Name</th><th>Quotation #</th><th>Date</th>
                <th>Base Value</th><th>GST (18%)</th><th>Total Value</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const { label, badge } = getStatus(p.pending)
                return (
                  <tr key={p.sl}>
                    <td className="text-center text-gray-500">{p.sl}</td>
                    <td className="font-medium">{p.name}</td>
                    <td className="text-xs text-gray-500 font-mono">{p.inv}</td>
                    <td className="text-gray-500">{p.date}</td>
                    <td>{fmt(p.base)}</td>
                    <td className="text-gray-500">{fmt(p.gst)}</td>
                    <td className="font-semibold text-brand">{fmt(p.total)}</td>
                    <td><span className={badge}>{label}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-8">{search ? 'No quotations match your search.' : 'No quotations yet.'}</p>
        )}
      </div>
    </div>
  )
}
