import { useState, useEffect } from 'react'
import { Plus, Trash2, Pencil, CheckCheck, PhoneCall, AlertTriangle, X } from 'lucide-react'
import { fetchSheet, addRow, deleteRow } from '../lib/api'

type FollowUpRow = {
  'Contact Name': string; Type: string; 'Related Project': string
  Phone: string; Email: string; 'Last Contact': string; 'Next Follow-up': string
  Notes: string; Status: string
}
type FollowUp = FollowUpRow & { rowIndex: number }

const TYPES = ['Architect', 'Contractor', 'Client', 'Other']
const fmtDate = (d: string) => {
  if (!d) return '—'
  const iso = d.match(/^(\d{4})-(\d{2})-(\d{2})T/)
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`
  return d
}
const today = new Date().toLocaleDateString('en-IN')

// "DD/MM/YYYY" or ISO -> Date, for the overdue check below.
function parseDate(d: string): Date | null {
  if (!d) return null
  const iso = d.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return new Date(+iso[1], +iso[2] - 1, +iso[3])
  const dmy = d.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (dmy) return new Date(+dmy[3], +dmy[2] - 1, +dmy[1])
  return null
}

function emptyForm() {
  return { name: '', type: 'Architect', project: '', phone: '', email: '', lastContact: today, nextFollowUp: '', notes: '' }
}

export default function FollowUps() {
  const [rows, setRows] = useState<FollowUp[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<FollowUp | null>(null)
  const [form, setForm] = useState(emptyForm())
  const [saving, setSaving] = useState(false)
  const [deletingRow, setDeletingRow] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'overdue' | 'done'>('all')

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  const load = () => {
    setLoading(true)
    fetchSheet<FollowUpRow>('FollowUps').then(data => {
      setRows(data.map((r, i) => ({ ...r, rowIndex: i + 2 })))
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const isOverdue = (r: FollowUp) => {
    if (r.Status === 'Done') return false
    const d = parseDate(r['Next Follow-up'])
    return d ? d.getTime() < new Date().setHours(0, 0, 0, 0) : false
  }

  const openNew = () => { setEditing(null); setForm(emptyForm()); setShowForm(true) }
  const openEdit = (r: FollowUp) => {
    setEditing(r)
    setForm({
      name: r['Contact Name'], type: r.Type || 'Architect', project: r['Related Project'],
      phone: r.Phone, email: r.Email, lastContact: fmtDate(r['Last Contact']),
      nextFollowUp: fmtDate(r['Next Follow-up']) === '—' ? '' : fmtDate(r['Next Follow-up']),
      notes: r.Notes,
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.name) return
    setSaving(true)
    if (editing) {
      const delResult = await deleteRow('FollowUps', editing.rowIndex)
      if (delResult?.status !== 'ok') {
        setSaving(false)
        showToast(`✗ Failed to update: ${delResult?.error || 'unknown error'}`)
        return
      }
    }
    const result = await addRow('FollowUps', {
      'Contact Name': form.name, Type: form.type, 'Related Project': form.project,
      Phone: form.phone, Email: form.email, 'Last Contact': form.lastContact,
      'Next Follow-up': form.nextFollowUp, Notes: form.notes,
      Status: editing?.Status || 'Pending',
    })
    setSaving(false)
    if (result?.status === 'ok') {
      showToast(`✓ ${form.name} ${editing ? 'updated' : 'added'}`)
      setShowForm(false); setEditing(null); setForm(emptyForm())
      load()
    } else showToast(`✗ Failed to save: ${result?.error || 'unknown error'}`)
  }

  const markDone = async (r: FollowUp) => {
    setDeletingRow(r.rowIndex)
    const delResult = await deleteRow('FollowUps', r.rowIndex)
    if (delResult?.status === 'ok') {
      const { rowIndex, ...rest } = r
      await addRow('FollowUps', { ...rest, Status: 'Done' })
      showToast(`✓ Marked ${r['Contact Name']} as followed up`)
      load()
    } else showToast(`✗ Failed: ${delResult?.error || 'unknown error'}`)
    setDeletingRow(null)
  }

  const handleDelete = async (r: FollowUp) => {
    if (!confirm(`Delete follow-up for "${r['Contact Name']}"? This can't be undone.`)) return
    setDeletingRow(r.rowIndex)
    const result = await deleteRow('FollowUps', r.rowIndex)
    setDeletingRow(null)
    if (result?.status === 'ok') { showToast(`✓ Deleted`); load() }
    else showToast(`✗ Failed: ${result?.error || 'unknown error'}`)
  }

  const filtered = rows.filter(r => {
    if (filter === 'pending') return r.Status !== 'Done'
    if (filter === 'overdue') return isOverdue(r)
    if (filter === 'done') return r.Status === 'Done'
    return true
  }).sort((a, b) => {
    const da = parseDate(a['Next Follow-up'])?.getTime() ?? Infinity
    const db = parseDate(b['Next Follow-up'])?.getTime() ?? Infinity
    return da - db
  })

  const overdueCount = rows.filter(isOverdue).length
  const pendingCount = rows.filter(r => r.Status !== 'Done').length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title flex items-center gap-2"><PhoneCall size={20} className="text-brand" /> Post-Project Follow-Ups</h1>
          <p className="section-sub">Reminders to follow up with architects & contractors for future leads</p>
        </div>
        <button onClick={openNew} className="btn-gold flex items-center gap-1.5 text-sm"><Plus size={13} /> New Follow-Up</button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-brand">{rows.length}</div>
          <div className="text-xs text-gray-500 mt-1">Total Contacts</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          <div className="text-xs text-gray-500 mt-1">Pending</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-red-500">{overdueCount}</div>
          <div className="text-xs text-gray-500 mt-1">Overdue</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-green-600">{rows.filter(r => r.Status === 'Done').length}</div>
          <div className="text-xs text-gray-500 mt-1">Followed Up</div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
            {(['all', 'pending', 'overdue', 'done'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${filter === f ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-auto max-h-[60vh]">
          <table className="tbl tbl-stable">
            <colgroup>
              <col style={{ width: 160 }} /><col style={{ width: 100 }} /><col style={{ width: 160 }} />
              <col style={{ width: 130 }} /><col style={{ width: 110 }} /><col style={{ width: 110 }} />
              <col /><col style={{ width: 90 }} /><col style={{ width: 52 }} /><col style={{ width: 52 }} /><col style={{ width: 52 }} />
            </colgroup>
            <thead>
              <tr>
                <th>Contact Name</th><th>Type</th><th>Related Project</th>
                <th>Phone</th><th>Last Contact</th><th>Next Follow-up</th>
                <th>Notes</th><th>Status</th><th className="tbl-icon-col">Done</th><th className="tbl-icon-col">Edit</th><th className="tbl-icon-col">Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={11} className="text-center py-10 text-gray-400">Loading…</td></tr>}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={11} className="text-center py-10 text-gray-400">No follow-ups {filter !== 'all' ? `in "${filter}"` : 'yet'}.</td></tr>
              )}
              {filtered.map(r => (
                <tr key={r.rowIndex} className={isOverdue(r) ? 'bg-red-50/40' : ''}>
                  <td className="font-medium text-gray-700">{r['Contact Name']}</td>
                  <td className="text-xs"><span className="badge-gray">{r.Type}</span></td>
                  <td className="text-xs text-gray-500">{r['Related Project'] || '—'}</td>
                  <td className="text-xs text-gray-500">{r.Phone || '—'}</td>
                  <td className="text-xs text-gray-500">{fmtDate(r['Last Contact'])}</td>
                  <td className="text-xs">
                    <span className={isOverdue(r) ? 'text-red-500 font-semibold flex items-center gap-1' : 'text-gray-500'}>
                      {isOverdue(r) && <AlertTriangle size={11} />}{fmtDate(r['Next Follow-up'])}
                    </span>
                  </td>
                  <td className="text-xs text-gray-400 truncate max-w-[200px]" title={r.Notes}>{r.Notes || '—'}</td>
                  <td><span className={r.Status === 'Done' ? 'badge-green' : isOverdue(r) ? 'badge-red' : 'badge-yellow'}>{r.Status === 'Done' ? 'Done' : isOverdue(r) ? 'Overdue' : 'Pending'}</span></td>
                  <td>
                    {r.Status !== 'Done' && (
                      <button onClick={() => markDone(r)} disabled={deletingRow === r.rowIndex}
                        className="p-1.5 rounded-lg transition-colors hover:bg-green-50 text-green-600 disabled:opacity-40" title="Mark as followed up">
                        <CheckCheck size={13} />
                      </button>
                    )}
                  </td>
                  <td>
                    <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg transition-colors hover:bg-brand/10 text-brand" title="Edit">
                      <Pencil size={13} />
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(r)} disabled={deletingRow === r.rowIndex}
                      className="p-1.5 rounded-lg transition-colors hover:bg-red-50 text-red-500 disabled:opacity-40" title="Delete">
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">{editing ? 'Edit Follow-Up' : 'New Follow-Up'}</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="p-5 space-y-3 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Contact Name <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Architect / Contractor name" className="input-dark" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input-dark">
                    {TYPES.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Related Project</label>
                  <input value={form.project} onChange={e => setForm(f => ({ ...f, project: e.target.value }))} placeholder="Quote # / project name" className="input-dark" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Phone</label>
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="10-digit mobile" className="input-dark" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" className="input-dark" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Last Contact</label>
                  <input value={form.lastContact} onChange={e => setForm(f => ({ ...f, lastContact: e.target.value }))} placeholder="DD/MM/YYYY" className="input-dark" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Next Follow-up</label>
                  <input value={form.nextFollowUp} onChange={e => setForm(f => ({ ...f, nextFollowUp: e.target.value }))} placeholder="DD/MM/YYYY" className="input-dark" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Notes</label>
                <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3}
                  placeholder="What to follow up about, past conversation summary…" className="input-dark w-full" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
              <button onClick={() => setShowForm(false)} className="btn-ghost text-sm">Cancel</button>
              <button disabled={!form.name || saving} onClick={handleSave} className="btn-gold text-sm disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Update' : 'Save Follow-Up'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-brand text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCheck size={15} />{toast}
        </div>
      )}
    </div>
  )
}
