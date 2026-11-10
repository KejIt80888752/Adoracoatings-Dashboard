import { useMemo, useState } from 'react'
import { Search, Trash2, Download } from 'lucide-react'

export type DispatchLogEntry = {
  Product: string; Location: string; Qty: number | string; Notes?: string; Date?: string; rowIndex: number
}

const fmtDate = (d?: string) => {
  if (!d) return '—'
  const iso = d.match(/^(\d{4})-(\d{2})-(\d{2})T/)
  return iso ? `${iso[3]}/${iso[2]}/${iso[1]}` : d
}

// Dispatch rows carry their project/client inside the free-text Notes column:
// "Project: X | Client: Y | any extra note".
const parseNotes = (notes = '') => {
  const project = notes.match(/Project:\s*([^|]*)/)?.[1].trim() || ''
  const client = notes.match(/Client:\s*([^|]*)/)?.[1].trim() || ''
  const extra = notes.split('|').map(x => x.trim()).filter(x => x && !/^(Project|Client):/.test(x)).join(' | ')
  return { project, client, extra }
}

export const isDispatch = (e: { Location?: string }) => e.Location === 'Dispatch' || e.Location === 'Dispatch-SeaAir'

type Row = { entry: DispatchLogEntry; project: string; client: string; extra: string; qty: number; from: string }

export default function DispatchRegister({ entries, onDelete, deletingRow }: {
  entries: DispatchLogEntry[]; onDelete: (e: DispatchLogEntry) => void; deletingRow: number | null
}) {
  const [search, setSearch] = useState('')

  const rows: Row[] = useMemo(() => entries.filter(isDispatch).map(entry => {
    const { project, client, extra } = parseNotes(entry.Notes)
    return { entry, project, client, extra, qty: Number(entry.Qty) || 0, from: entry.Location === 'Dispatch-SeaAir' ? 'Sea Air' : 'Godown' }
  }).sort((a, b) => a.entry.rowIndex - b.entry.rowIndex), [entries])

  const q = search.trim().toLowerCase()
  const filtered = rows.filter(r => !q || r.project.toLowerCase().includes(q) || r.client.toLowerCase().includes(q) || r.entry.Product.toLowerCase().includes(q))

  const groups = useMemo(() => {
    const map = new Map<string, { project: string; rows: Row[] }>()
    for (const r of filtered) {
      const key = (r.project || '(No project)').toLowerCase()
      if (!map.has(key)) map.set(key, { project: r.project || '(No project)', rows: [] })
      map.get(key)!.rows.push(r)
    }
    return [...map.values()].sort((a, b) => a.project.localeCompare(b.project))
  }, [filtered])

  const exportCsv = () => {
    const lines = ['Project,Client,S.No,Material,Qty,From,Date,Notes']
    for (const g of groups) g.rows.forEach((r, i) =>
      lines.push([g.project, r.client, i + 1, r.entry.Product, r.qty, r.from, fmtDate(r.entry.Date), r.extra].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')))
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/csv' }))
    a.download = 'dispatch-register.csv'
    a.click()
  }

  return (
    <div className="p-4 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-4)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by client name, project or material…" className="input-dark pl-9 w-full" />
        </div>
        <div className="text-xs shrink-0" style={{ color: 'var(--text-3)' }}>
          {groups.length} project{groups.length === 1 ? '' : 's'} · {filtered.length} item{filtered.length === 1 ? '' : 's'}
        </div>
        <button onClick={exportCsv} disabled={!filtered.length}
          className="text-xs px-3 py-1.5 rounded-lg font-medium border flex items-center gap-1.5 shrink-0 disabled:opacity-50"
          style={{ color: 'var(--text-3)', borderColor: 'var(--border-2)' }}>
          <Download size={12} /> Export CSV
        </button>
      </div>

      {groups.length === 0 && (
        <p className="text-center py-10 text-sm" style={{ color: 'var(--text-4)' }}>
          {rows.length === 0 ? 'No dispatches recorded yet. Use the Dispatch tab to record one.' : 'No dispatch matches your search.'}
        </p>
      )}

      {groups.map(g => {
        const clients = [...new Set(g.rows.map(r => r.client).filter(Boolean))]
        const totalQty = g.rows.reduce((s, r) => s + r.qty, 0)
        return (
          <div key={g.project} className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border-2)' }}>
            <div className="px-4 py-2.5 flex items-center justify-between flex-wrap gap-2" style={{ background: 'var(--bg-card2)' }}>
              <div>
                <p className="font-semibold text-sm" style={{ color: 'var(--text-1)' }}>{g.project}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>{clients.length ? `Client: ${clients.join(', ')}` : 'Client not recorded'}</p>
              </div>
              <p className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>{g.rows.length} item{g.rows.length === 1 ? '' : 's'} · {totalQty} units</p>
            </div>
            <div className="overflow-x-auto">
              <table className="tbl tbl-stable">
                <colgroup>
                  <col style={{ width: 56 }} /><col style={{ width: 260 }} /><col style={{ width: 70 }} /><col style={{ width: 90 }} />
                  <col style={{ width: 110 }} /><col style={{ width: 220 }} /><col style={{ width: 52 }} />
                </colgroup>
                <thead>
                  <tr>
                    <th className="text-center">S.No</th><th>Material</th><th className="text-center">Qty</th><th>From</th><th>Date</th><th>Notes</th>
                    <th className="text-center tbl-icon-col whitespace-normal leading-tight">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {g.rows.map((r, i) => (
                    <tr key={r.entry.rowIndex}>
                      <td className="text-center text-xs" style={{ color: 'var(--text-4)' }}>{i + 1}</td>
                      <td className="font-medium" style={{ color: 'var(--text-1)' }}>{r.entry.Product}</td>
                      <td className="text-center font-semibold text-red-500">{r.qty}</td>
                      <td className="text-xs" style={{ color: 'var(--text-3)' }}>{r.from}</td>
                      <td className="text-xs" style={{ color: 'var(--text-4)' }}>{fmtDate(r.entry.Date)}</td>
                      <td className="text-xs" style={{ color: 'var(--text-4)' }}>{r.extra || '—'}</td>
                      <td className="text-center">
                        <button onClick={() => onDelete(r.entry)} disabled={deletingRow === r.entry.rowIndex}
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-50 text-red-500 disabled:opacity-40" title="Delete this dispatch entry">
                          <Trash2 size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}
