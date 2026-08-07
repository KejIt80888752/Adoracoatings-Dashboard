import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCheck, FileText, List } from 'lucide-react'
import { fetchSheet, addRow, deleteRow } from '../lib/api'

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

type Item = { id: number; particulars: string; texture: string; length: number; height: number; nos: number; coefficient: number; rate: number }
type QuoteRow = { 'Quote No': string; Date: string; 'Client Name': string; 'Client Address': string; 'Handled By': string; 'Enquired By': string; Items: string; Total: string; GST: string; 'Grand Total': string; Status: string }

let nextQuoteNum = 1
const getQuoteNo = () => `ACQ-${String(nextQuoteNum++).padStart(3,'0')}/26-27`
const today = new Date().toLocaleDateString('en-IN')

function newItem(id: number): Item {
  return { id, particulars: '', texture: '', length: 0, height: 0, nos: 1, coefficient: 1, rate: 0 }
}

const area = (it: Item) => Math.round(it.length * it.height * it.nos * it.coefficient * 100) / 100
const amount = (it: Item) => Math.round(area(it) * it.rate * 100) / 100

export default function Quotation() {
  const [tab, setTab]       = useState<'list' | 'create'>('list')
  const [search, setSearch] = useState('')
  const [quotes, setQuotes] = useState<(QuoteRow & { rowIndex: number })[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast]   = useState('')
  const [deletingRow, setDeletingRow] = useState<number | null>(null)

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  const loadQuotes = () => {
    setLoading(true)
    fetchSheet<QuoteRow>('Quotations').then(rows => {
      setQuotes(rows.map((r, i) => ({ ...r, rowIndex: i + 2 })))
    }).finally(() => setLoading(false))
  }

  useEffect(() => { loadQuotes() }, [])

  const handleDelete = async (q: QuoteRow & { rowIndex: number }) => {
    if (!confirm(`Delete quotation ${q['Quote No']}? This can't be undone.`)) return
    setDeletingRow(q.rowIndex)
    const result = await deleteRow('Quotations', q.rowIndex)
    setDeletingRow(null)
    if (result?.status === 'ok') { showToast(`✓ ${q['Quote No']} deleted`); loadQuotes() }
    else showToast(`✗ Failed to delete: ${result?.error || 'unknown error'}`)
  }

  const filtered = quotes.filter(q =>
    (q['Client Name'] || '').toLowerCase().includes(search.toLowerCase()) ||
    (q['Quote No'] || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalValue = quotes.reduce((s, q) => s + (Number(q['Grand Total']) || 0), 0)
  const completed   = quotes.filter(q => q.Status === 'Completed').length
  const pending      = quotes.length - completed

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="section-title">Quotations</h1>
          <p className="section-sub">All project quotations for FY 2026-27</p>
        </div>
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
          <button onClick={() => setTab('list')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${tab==='list' ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <List size={14}/> Quotation List
          </button>
          <button onClick={() => setTab('create')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${tab==='create' ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            <FileText size={14}/> New Quotation
          </button>
        </div>
      </div>

      {tab === 'list' && (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="card-sm text-center">
              <div className="text-2xl font-bold text-brand">{quotes.length}</div>
              <div className="text-xs text-gray-500 mt-1">Total Quotations</div>
            </div>
            <div className="card-sm text-center">
              <div className="text-2xl font-bold text-brand">{fmt(totalValue)}</div>
              <div className="text-xs text-gray-500 mt-1">Total Value</div>
            </div>
            <div className="card-sm text-center">
              <div className="text-2xl font-bold text-green-600">{completed}</div>
              <div className="text-xs text-gray-500 mt-1">Completed</div>
            </div>
            <div className="card-sm text-center">
              <div className="text-2xl font-bold text-yellow-600">{pending}</div>
              <div className="text-xs text-gray-500 mt-1">Pending / In Progress</div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="font-semibold text-gray-700">Quotation List</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search client or quotation #…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
                <button onClick={() => setTab('create')} className="btn-gold flex items-center gap-1.5 text-sm"><Plus size={13}/> New Quotation</button>
              </div>
            </div>
            <div className="overflow-auto max-h-[65vh]">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Quotation #</th><th>Client</th><th>Date</th>
                    <th>Total</th><th>GST (18%)</th><th>Grand Total</th><th>Status</th><th>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={8} className="text-center py-10 text-gray-400">Loading…</td></tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr><td colSpan={8} className="text-center py-10 text-gray-400">{search ? 'No quotations match your search.' : 'No quotations yet.'}</td></tr>
                  )}
                  {filtered.map(q => (
                    <tr key={q.rowIndex}>
                      <td className="text-xs text-gray-500 font-mono">{q['Quote No']}</td>
                      <td className="font-medium">{q['Client Name']}</td>
                      <td className="text-gray-500">{q.Date}</td>
                      <td>{fmt(Number(q.Total) || 0)}</td>
                      <td className="text-gray-500">{fmt(Number(q.GST) || 0)}</td>
                      <td className="font-semibold text-brand">{fmt(Number(q['Grand Total']) || 0)}</td>
                      <td><span className={q.Status === 'Completed' ? 'badge-green' : q.Status === 'Pending' ? 'badge-red' : 'badge-yellow'}>{q.Status || 'In Progress'}</span></td>
                      <td>
                        <button onClick={() => handleDelete(q)} disabled={deletingRow === q.rowIndex}
                          className="p-1.5 rounded-lg transition-colors hover:bg-red-50 text-red-500 disabled:opacity-40" title="Delete quotation">
                          <Trash2 size={13}/>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'create' && <CreateQuotation onSaved={() => { setTab('list'); loadQuotes() }} showToast={showToast} />}

      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-brand text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCheck size={15}/>{toast}
        </div>
      )}
    </div>
  )
}

function CreateQuotation({ onSaved, showToast }: { onSaved: () => void; showToast: (m: string) => void }) {
  const [quoteNo]           = useState(getQuoteNo)
  const [date, setDate]     = useState(today)
  const [clientName, setClientName] = useState('')
  const [clientAddr, setClientAddr] = useState('Bangalore')
  const [handledBy, setHandledBy]   = useState('')
  const [enquiredBy, setEnquiredBy] = useState('')
  const [items, setItems]   = useState<Item[]>([newItem(1)])
  const [nextId, setNextId] = useState(2)
  const [saving, setSaving] = useState(false)

  const addRowItem = () => { setItems(p => [...p, newItem(nextId)]); setNextId(n => n + 1) }
  const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id))
  const updateItem = (id: number, field: keyof Item, value: string | number) => {
    setItems(p => p.map(it => it.id !== id ? it : { ...it, [field]: value }))
  }

  const total      = items.reduce((s, i) => s + amount(i), 0)
  const gst        = Math.round(total * 18) / 100
  const grandTotal = total + gst

  const handleSave = async () => {
    if (!clientName) return
    setSaving(true)
    const result = await addRow('Quotations', {
      'Quote No': quoteNo,
      Date: date,
      'Client Name': clientName,
      'Client Address': clientAddr,
      'Handled By': handledBy,
      'Enquired By': enquiredBy,
      Items: JSON.stringify(items.map(i => ({ ...i, area: area(i), amount: amount(i) }))),
      Total: total.toFixed(2),
      GST: gst.toFixed(2),
      'Grand Total': grandTotal.toFixed(2),
      Status: 'In Progress',
    })
    setSaving(false)
    if (result?.status === 'ok') { showToast(`✓ ${quoteNo} saved for ${clientName}`); onSaved() }
    else showToast(`✗ Failed to save: ${result?.error || 'unknown error'}`)
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Quotation No</label>
            <div className="input-dark bg-gray-50 text-gray-500 text-sm font-mono">{quoteNo}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
            <input value={date} onChange={e => setDate(e.target.value)} className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Handled By</label>
            <input value={handledBy} onChange={e => setHandledBy(e.target.value)} placeholder="Staff name" className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Enquired By / Reference</label>
            <input value={enquiredBy} onChange={e => setEnquiredBy(e.target.value)} placeholder="Ar: / Ref" className="input-dark" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Client Name <span className="text-red-500">*</span></label>
            <input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Mr: / Company name" className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Address</label>
            <input value={clientAddr} onChange={e => setClientAddr(e.target.value)} className="input-dark" />
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <p className="font-semibold text-gray-700 text-sm">Item Details</p>
          <p className="text-xs text-gray-400">Area (SFT) = Length × Height × Nos × Co-efficient</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Particulars','Texture','Length','Height','Nos','Co-efficient','Area (SFT)','Rate','Amount',''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-3 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-2 py-2 min-w-[160px]">
                    <input value={item.particulars} onChange={e => updateItem(item.id,'particulars',e.target.value)}
                      placeholder="e.g. Mania Pearla" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 min-w-[120px]">
                    <input value={item.texture} onChange={e => updateItem(item.id,'texture',e.target.value)}
                      placeholder="Texture" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 w-20">
                    <input type="number" min={0} value={item.length} onChange={e => updateItem(item.id,'length',+e.target.value)}
                      className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-right focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 w-20">
                    <input type="number" min={0} value={item.height} onChange={e => updateItem(item.id,'height',+e.target.value)}
                      className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-right focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 w-16">
                    <input type="number" min={1} value={item.nos} onChange={e => updateItem(item.id,'nos',+e.target.value)}
                      className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 w-20">
                    <input type="number" min={0} step={0.1} value={item.coefficient} onChange={e => updateItem(item.id,'coefficient',+e.target.value)}
                      className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-right focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600 font-medium whitespace-nowrap">{area(item).toLocaleString('en-IN')}</td>
                  <td className="px-2 py-2 w-24">
                    <input type="number" min={0} value={item.rate} onChange={e => updateItem(item.id,'rate',+e.target.value)}
                      className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-right focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-brand whitespace-nowrap">{fmt(amount(item))}</td>
                  <td className="px-2 py-2">
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 transition-colors p-1">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <button onClick={addRowItem} className="flex items-center gap-1.5 text-brand text-xs font-semibold hover:bg-brand/5 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={13} /> Add Item
          </button>
        </div>
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm text-gray-600"><span>Total</span><span className="font-medium">{fmt(total)}</span></div>
              <div className="flex justify-between text-sm text-gray-600"><span>GST Additional @ 18%</span><span>{fmt(gst)}</span></div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                <span>Grand Total</span><span className="text-brand text-lg">{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <button onClick={() => { setItems([newItem(1)]); setNextId(2); setClientName(''); setHandledBy(''); setEnquiredBy('') }}
          className="btn-ghost text-sm">Clear</button>
        <button disabled={!clientName || saving} onClick={handleSave} className="btn-gold flex items-center gap-1.5 text-sm disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Quotation → Sheet'}
        </button>
      </div>
    </div>
  )
}
