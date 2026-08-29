import { useState, useEffect } from 'react'
import { Kanban, Pencil, Check, X, RefreshCw } from 'lucide-react'
import { fetchSheet, addRow, deleteRow } from '../lib/api'

type QuoteRow = {
  'Quote No': string; Date: string; 'Client Name': string; 'Client Address': string
  'Handled By': string; 'Enquired By': string; 'Finish Type': string
  Items: string; Total: string; GST: string; 'Grand Total': string; Status: string; Notes: string
}
type Quote = QuoteRow & { rowIndex: number }

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

const fmtDate = (d: string) => {
  if (!d) return '—'
  const iso = d.match(/^(\d{4})-(\d{2})-(\d{2})T/)
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`
  return d
}

// Columns are just whatever Status values are actually in use, with a fixed,
// sensible display order -- so a new status typed on the Quotation page shows
// up here too instead of silently vanishing off the board.
const STAGE_ORDER = ['Pending', 'In Progress', 'Completed']
const STAGE_COLOR: Record<string, string> = {
  'Pending':     'border-yellow-400 bg-yellow-50/50',
  'In Progress': 'border-blue-400 bg-blue-50/50',
  'Completed':   'border-green-400 bg-green-50/50',
}

export default function Pipeline() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [editingHandler, setEditingHandler] = useState<number | null>(null)
  const [handlerDraft, setHandlerDraft] = useState('')
  const [busyRow, setBusyRow] = useState<number | null>(null)

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  const load = (silent = false) => {
    setLoading(true)
    fetchSheet<QuoteRow>('Quotations').then(rows => {
      setQuotes(rows.map((r, i) => ({ ...r, rowIndex: i + 2 })))
    }).finally(() => { setLoading(false); if (!silent) showToast('✓ Pipeline refreshed') })
  }

  useEffect(() => { load(true) }, [])

  // No update-in-place API -- moving a card or re-assigning a team member
  // deletes the old Quotation row and re-adds it with the changed field(s).
  const updateQuote = async (q: Quote, patch: Partial<QuoteRow>) => {
    setBusyRow(q.rowIndex)
    const delResult = await deleteRow('Quotations', q.rowIndex)
    if (delResult?.status !== 'ok') {
      setBusyRow(null)
      showToast(`✗ Failed to update: ${delResult?.error || 'unknown error'}`)
      return
    }
    const { rowIndex, ...rest } = q
    const result = await addRow('Quotations', { ...rest, ...patch })
    setBusyRow(null)
    if (result?.status === 'ok') { showToast(`✓ ${q['Quote No']} updated`); load(true) }
    else showToast(`✗ Failed to update: ${result?.error || 'unknown error'}`)
  }

  const stagesPresent = Array.from(new Set(quotes.map(q => q.Status || 'Pending')))
  const stages = [...STAGE_ORDER.filter(s => stagesPresent.includes(s)), ...stagesPresent.filter(s => !STAGE_ORDER.includes(s))]
  const columns = stages.length ? stages : STAGE_ORDER

  const totalValue = quotes.reduce((s, q) => s + (Number(q['Grand Total']) || 0), 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title flex items-center gap-2"><Kanban size={20} className="text-brand" /> Project Pipeline</h1>
          <p className="section-sub">Ongoing projects, their stage, and who's handling them</p>
        </div>
        <button onClick={() => load()} disabled={loading} className="btn-outline-gold text-sm flex items-center gap-1.5 disabled:opacity-50">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-brand">{quotes.length}</div>
          <div className="text-xs text-gray-500 mt-1">Total Projects</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-brand">{fmt(totalValue)}</div>
          <div className="text-xs text-gray-500 mt-1">Pipeline Value</div>
        </div>
        {columns.slice(0, 2).map(stage => (
          <div key={stage} className="card-sm text-center">
            <div className="text-2xl font-bold text-gray-700">{quotes.filter(q => (q.Status || 'Pending') === stage).length}</div>
            <div className="text-xs text-gray-500 mt-1">{stage}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
        {columns.map(stage => {
          const cards = quotes.filter(q => (q.Status || 'Pending') === stage)
          return (
            <div key={stage} className={`rounded-xl border-t-4 ${STAGE_COLOR[stage] || 'border-gray-300 bg-gray-50/50'} p-3 space-y-3 min-h-[200px]`}>
              <div className="flex items-center justify-between px-1">
                <h3 className="font-semibold text-sm text-gray-700">{stage}</h3>
                <span className="text-xs text-gray-400 font-mono">{cards.length}</span>
              </div>
              {loading && <p className="text-xs text-gray-400 text-center py-6">Loading…</p>}
              {!loading && cards.length === 0 && <p className="text-xs text-gray-400 text-center py-6">No projects here</p>}
              {cards.map(q => (
                <div key={q.rowIndex} className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-xs font-mono text-brand">{q['Quote No']}</p>
                    <span className="text-[10px] text-gray-400">{fmtDate(q.Date)}</span>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{q['Client Name']}</p>
                  <p className="text-xs text-gray-500">{q['Finish Type']} · {fmt(Number(q['Grand Total']) || 0)}</p>

                  {/* Team member / handler assignment -- editable inline */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-gray-50">
                    {editingHandler === q.rowIndex ? (
                      <>
                        <input autoFocus value={handlerDraft} onChange={e => setHandlerDraft(e.target.value)}
                          placeholder="Staff name" className="flex-1 border border-gray-200 rounded px-1.5 py-1 text-xs focus:outline-none focus:border-brand" />
                        <button onClick={() => { updateQuote(q, { 'Handled By': handlerDraft }); setEditingHandler(null) }}
                          className="text-green-500 hover:text-green-600 p-0.5"><Check size={13} /></button>
                        <button onClick={() => setEditingHandler(null)} className="text-gray-300 hover:text-red-400 p-0.5"><X size={13} /></button>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] text-gray-400 flex-1">
                          Team: <span className="text-gray-600 font-medium">{q['Handled By'] || '—'}</span>
                        </span>
                        <button onClick={() => { setEditingHandler(q.rowIndex); setHandlerDraft(q['Handled By'] || '') }}
                          className="text-gray-300 hover:text-brand p-0.5" title="Reassign team member"><Pencil size={11} /></button>
                      </>
                    )}
                  </div>

                  {/* Move to another stage */}
                  <select value={stage} disabled={busyRow === q.rowIndex}
                    onChange={e => updateQuote(q, { Status: e.target.value })}
                    className="w-full text-[11px] border border-gray-200 rounded px-1.5 py-1 focus:outline-none focus:border-brand disabled:opacity-50">
                    {columns.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )
        })}
      </div>

      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-brand text-white text-sm px-4 py-3 rounded-xl shadow-lg">
          {toast}
        </div>
      )}
    </div>
  )
}
