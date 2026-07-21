import { useState } from 'react'

const PROJECTS: { sl: number; name: string; inv: string; total: number; rcvd: number; pending: number }[] = []

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

type Tab = 'all' | 'pending' | 'settled'

function getStatus(pending: number): { label: string; badge: string } {
  if (Math.abs(pending) < 1) return { label: 'Settled',  badge: 'badge-green'  }
  if (pending > 100)         return { label: 'Pending',  badge: 'badge-red'    }
  if (pending < -100)        return { label: 'Overpaid', badge: 'badge-blue'   }
  return                            { label: 'Minor Adj',badge: 'badge-yellow' }
}

export default function Outstanding() {
  const [tab, setTab] = useState<Tab>('all')

  const filtered = PROJECTS.filter(p => {
    if (tab === 'pending')  return Math.abs(p.pending) >= 1
    if (tab === 'settled')  return Math.abs(p.pending) < 1
    return true
  })

  const settledCount = PROJECTS.filter(p => Math.abs(p.pending) < 1).length
  const pendingCount = PROJECTS.length - settledCount

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="section-title">Outstanding Payments</h1>
        <p className="section-sub">Payment settlement status — FY 2026-27</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-brand">{PROJECTS.length}</div>
          <div className="text-xs text-gray-500 mt-1">Total Projects</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-green-600">{settledCount}</div>
          <div className="text-xs text-gray-500 mt-1">Fully Settled</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-red-500">{pendingCount}</div>
          <div className="text-xs text-gray-500 mt-1">Pending Clearance</div>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-2 mb-4">
          {(['all', 'pending', 'settled'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Sl</th><th>Project</th><th>Invoice #</th>
                <th>Total Value</th><th>Received</th><th>Pending</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const { label, badge } = getStatus(p.pending)
                return (
                  <tr key={p.sl}>
                    <td className="text-center text-gray-400">{p.sl}</td>
                    <td className="font-medium">{p.name}</td>
                    <td className="text-xs font-mono text-gray-500">{p.inv}</td>
                    <td>{fmt(p.total)}</td>
                    <td className="text-green-700">{fmt(p.rcvd)}</td>
                    <td className={
                      Math.abs(p.pending) < 1 ? 'text-green-600 font-semibold' :
                      p.pending > 100 ? 'text-red-600 font-semibold' :
                      p.pending < -100 ? 'text-blue-600 font-semibold' :
                      'text-yellow-600 font-semibold'
                    }>{fmt(p.pending)}</td>
                    <td><span className={badge}>{label}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-8">No records for this filter.</p>
        )}
      </div>
    </div>
  )
}
