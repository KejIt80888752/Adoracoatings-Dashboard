import { useState } from 'react'
import { Plus, Trash2, Printer, Mail, Save, FileText, List } from 'lucide-react'

type Item = { id: number; code: string; description: string; hsn: string; qty: number; unit: string; rate: number; disc: number; gstPct: number }
type Tab = 'invoice' | 'challan' | 'list'

const UNITS = ['Nos', 'Mtr', 'Kg', 'Ltr', 'Set', 'Pair', 'Box', 'Roll']
const GST_RATES = [0, 5, 12, 18, 28]
const STATES = ['Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi', 'Telangana', 'Kerala', 'Andhra Pradesh', 'Gujarat']

// Rate card pending from client — filled in once real product rates are confirmed.
const PRODUCT_CODES: Record<string, { description: string; hsn: string; rate: number; gstPct: number }> = {}

let nextInvNum = 1
const getInvNo = () => `AFS/INV/${String(nextInvNum++).padStart(4,'0')}/2026-27`
const today = new Date().toISOString().split('T')[0]

function newItem(id: number): Item {
  return { id, code: '', description: '', hsn: '', qty: 1, unit: 'Nos', rate: 0, disc: 0, gstPct: 18 }
}

// ── Invoice Form ─────────────────────────────────────────────────────────────
function InvoiceForm() {
  const [invNo]            = useState(getInvNo)
  const [invDate, setInvDate] = useState(today)
  const [state, setState]  = useState('Tamil Nadu')
  const [party, setParty]  = useState('')
  const [gstin, setGstin]  = useState('')
  const [addr, setAddr]    = useState('')
  const [items, setItems]  = useState<Item[]>([newItem(1)])
  const [nextId, setNextId]= useState(2)
  const [saved, setSaved]  = useState(false)

  const addItem = () => { setItems(p => [...p, newItem(nextId)]); setNextId(n => n + 1) }
  const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id))

  const updateItem = (id: number, field: keyof Item, value: string | number) => {
    setItems(p => p.map(item => {
      if (item.id !== id) return item
      const updated = { ...item, [field]: value }
      if (field === 'code') {
        const prod = PRODUCT_CODES[String(value).toUpperCase()]
        if (prod) return { ...updated, description: prod.description, hsn: prod.hsn, rate: prod.rate, gstPct: prod.gstPct }
      }
      return updated
    }))
  }

  const taxable   = (it: Item) => { const base = it.qty * it.rate * (1 - it.disc / 100); return Math.round(base * 100) / 100 }
  const gstAmt    = (it: Item) => Math.round(taxable(it) * it.gstPct) / 100
  const rowTotal  = (it: Item) => taxable(it) + gstAmt(it)
  const totalTax  = items.reduce((s, i) => s + taxable(i), 0)
  const totalGst  = items.reduce((s, i) => s + gstAmt(i), 0)
  const grandTotal= totalTax + totalGst
  const interState= state !== 'Tamil Nadu'

  return (
    <div className="space-y-4">

      {/* Invoice header */}
      <div className="card space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Invoice No</label>
            <div className="input-dark bg-gray-50 text-gray-500 text-sm font-mono">{invNo}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Invoice Date</label>
            <input type="date" value={invDate} onChange={e => setInvDate(e.target.value)} className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Place of Supply</label>
            <select value={state} onChange={e => setState(e.target.value)} className="input-dark">
              {STATES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">GST Type</label>
            <div className={`input-dark bg-gray-50 text-sm font-semibold ${interState ? 'text-orange-600' : 'text-brand'}`}>
              {interState ? 'IGST (Inter-State)' : 'CGST + SGST (Intra-State)'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Party Name <span className="text-red-500">*</span></label>
            <input value={party} onChange={e => setParty(e.target.value)}
              placeholder="Customer / Company name" className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">GSTIN</label>
            <input value={gstin} onChange={e => setGstin(e.target.value.toUpperCase())}
              placeholder="29XXXXXXXXXX1ZX" maxLength={15} className="input-dark font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Billing Address</label>
            <input value={addr} onChange={e => setAddr(e.target.value)}
              placeholder="Full address with city & pin" className="input-dark" />
          </div>
        </div>
      </div>

      {/* Item details */}
      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <p className="font-semibold text-gray-700 text-sm">Item Details</p>
          <p className="text-xs text-gray-400">Enter item details manually</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Code','Description','HSN','Qty','Unit','Rate (₹)','Disc%','GST%','Taxable','GST Amt','Total',''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-3 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-2 py-2 w-20">
                    <input value={item.code} onChange={e => updateItem(item.id,'code',e.target.value.toUpperCase())}
                      placeholder="AC001" className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 min-w-[180px]">
                    <input value={item.description} onChange={e => updateItem(item.id,'description',e.target.value)}
                      placeholder="Item description" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 w-24">
                    <input value={item.hsn} onChange={e => updateItem(item.id,'hsn',e.target.value)}
                      placeholder="HSN" className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 w-16">
                    <input type="number" min={1} value={item.qty} onChange={e => updateItem(item.id,'qty',+e.target.value)}
                      className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 w-20">
                    <select value={item.unit} onChange={e => updateItem(item.id,'unit',e.target.value)}
                      className="w-20 border border-gray-200 rounded-lg px-1.5 py-1.5 text-xs focus:outline-none focus:border-brand">
                      {UNITS.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2 w-24">
                    <input type="number" min={0} value={item.rate} onChange={e => updateItem(item.id,'rate',+e.target.value)}
                      className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-right focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 w-16">
                    <input type="number" min={0} max={100} value={item.disc} onChange={e => updateItem(item.id,'disc',+e.target.value)}
                      className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 w-20">
                    <select value={item.gstPct} onChange={e => updateItem(item.id,'gstPct',+e.target.value)}
                      className="w-20 border border-gray-200 rounded-lg px-1.5 py-1.5 text-xs focus:outline-none focus:border-brand">
                      {GST_RATES.map(r => <option key={r} value={r}>{r}%</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-right text-gray-600 font-medium whitespace-nowrap">₹{taxable(item).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2 text-right text-gray-500 whitespace-nowrap">₹{gstAmt(item).toLocaleString('en-IN')}</td>
                  <td className="px-3 py-2 text-right font-semibold text-brand whitespace-nowrap">₹{rowTotal(item).toLocaleString('en-IN')}</td>
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
          <button onClick={addItem} className="flex items-center gap-1.5 text-brand text-xs font-semibold hover:bg-brand/5 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={13} /> Add Item
          </button>
        </div>

        {/* Totals */}
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Taxable Amount</span>
                <span className="font-medium">₹{totalTax.toLocaleString('en-IN')}</span>
              </div>
              {interState ? (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>IGST</span>
                  <span>₹{totalGst.toLocaleString('en-IN')}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>CGST</span>
                    <span>₹{(totalGst/2).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>SGST</span>
                    <span>₹{(totalGst/2).toLocaleString('en-IN')}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                <span>Grand Total</span>
                <span className="text-brand text-lg">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center justify-between py-2">
        <button onClick={() => { setItems([newItem(1)]); setNextId(2); setParty(''); setGstin(''); setAddr(''); setSaved(false) }}
          className="btn-ghost text-sm">Clear</button>
        <div className="flex items-center gap-2">
          <button className="btn-outline-gold flex items-center gap-1.5 text-sm">
            <Printer size={14} /> Preview & Print
          </button>
          <button onClick={() => setSaved(true)}
            className="btn-gold flex items-center gap-1.5 text-sm">
            <Save size={14} /> {saved ? 'Saved ✓' : 'Save Invoice'}
          </button>
          <button className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-semibold transition-colors">
            <Mail size={14} /> Save & Email
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Challan Form ──────────────────────────────────────────────────────────────
function ChallanForm() {
  const [challanNo]        = useState('AFS/CH/0001/2026-27')
  const [challanDate, setChallanDate] = useState(today)
  const [party, setParty]  = useState('')
  const [vehicle, setVehicle] = useState('')
  const [items, setItems]  = useState<Item[]>([newItem(1)])
  const [nextId, setNextId]= useState(2)

  const addItem = () => { setItems(p => [...p, newItem(nextId)]); setNextId(n => n + 1) }
  const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id))
  const updateItem = (id: number, field: keyof Item, value: string | number) => {
    setItems(p => p.map(it => it.id !== id ? it : { ...it, [field]: value }))
  }
  const totalQty = items.reduce((s, i) => s + i.qty, 0)

  return (
    <div className="space-y-4">
      <div className="card space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Challan No</label>
            <div className="input-dark bg-gray-50 text-gray-500 text-sm font-mono">{challanNo}</div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Challan Date</label>
            <input type="date" value={challanDate} onChange={e => setChallanDate(e.target.value)} className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Party Name <span className="text-red-500">*</span></label>
            <input value={party} onChange={e => setParty(e.target.value)} placeholder="Customer / Site name" className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Vehicle No</label>
            <input value={vehicle} onChange={e => setVehicle(e.target.value.toUpperCase())} placeholder="TN 01 AB 1234" className="input-dark font-mono" />
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
          <p className="font-semibold text-gray-700 text-sm">Goods Dispatched</p>
          <p className="text-xs text-gray-400">Delivery Challan</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['#','Product Code','Description','HSN','Qty','Unit','Rate (₹)','Amount',''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-3 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-3 py-2 text-gray-400 text-xs">{idx+1}</td>
                  <td className="px-2 py-2 w-24">
                    <input value={item.code} onChange={e => updateItem(item.id,'code',e.target.value.toUpperCase())}
                      placeholder="AC001" className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 min-w-[200px]">
                    <input value={item.description} onChange={e => updateItem(item.id,'description',e.target.value)}
                      placeholder="Item description" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 w-24">
                    <input value={item.hsn} onChange={e => updateItem(item.id,'hsn',e.target.value)}
                      placeholder="HSN" className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 w-16">
                    <input type="number" min={1} value={item.qty} onChange={e => updateItem(item.id,'qty',+e.target.value)}
                      className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 w-20">
                    <select value={item.unit} onChange={e => updateItem(item.id,'unit',e.target.value)}
                      className="w-20 border border-gray-200 rounded-lg px-1.5 py-1.5 text-xs focus:outline-none focus:border-brand">
                      {UNITS.map(u => <option key={u}>{u}</option>)}
                    </select>
                  </td>
                  <td className="px-2 py-2 w-24">
                    <input type="number" min={0} value={item.rate} onChange={e => updateItem(item.id,'rate',+e.target.value)}
                      className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-right focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-3 py-2 text-right font-semibold text-brand whitespace-nowrap">
                    ₹{(item.qty * item.rate).toLocaleString('en-IN')}
                  </td>
                  <td className="px-2 py-2">
                    {items.length > 1 && (
                      <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-400 p-1 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <button onClick={addItem} className="flex items-center gap-1.5 text-brand text-xs font-semibold hover:bg-brand/5 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={13} /> Add Item
          </button>
          <div className="text-sm text-gray-500">
            Total Qty: <span className="font-semibold text-gray-700">{totalQty}</span> &nbsp;|&nbsp;
            Total Amount: <span className="font-semibold text-brand">₹{items.reduce((s,i)=>s+i.qty*i.rate,0).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <button onClick={() => { setItems([newItem(1)]); setNextId(2); setParty(''); setVehicle('') }}
          className="btn-ghost text-sm">Clear</button>
        <div className="flex gap-2">
          <button className="btn-outline-gold flex items-center gap-1.5 text-sm"><Printer size={14} /> Print Challan</button>
          <button className="btn-gold flex items-center gap-1.5 text-sm"><Save size={14} /> Save Challan</button>
        </div>
      </div>
    </div>
  )
}

// ── Invoice List ──────────────────────────────────────────────────────────────
const SAVED: { inv: string; party: string; date: string; total: number; status: string }[] = []

function InvoiceList({ onNew }: { onNew: () => void }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div><p className="text-sm text-gray-500">Showing {SAVED.length} invoices</p></div>
        <button onClick={onNew} className="btn-gold flex items-center gap-1.5 text-sm"><Plus size={13} /> New Tax Invoice</button>
      </div>
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead><tr><th>Invoice #</th><th>Party</th><th>Date</th><th className="text-right">Amount</th><th>Status</th></tr></thead>
            <tbody>
              {SAVED.length === 0 && (
                <tr><td colSpan={5} className="text-center py-10 text-gray-400">No invoices saved yet</td></tr>
              )}
              {SAVED.map(r => (
                <tr key={r.inv}>
                  <td className="font-mono text-xs text-brand">{r.inv}</td>
                  <td className="font-medium text-gray-700">{r.party}</td>
                  <td className="text-gray-500 text-xs">{r.date}</td>
                  <td className="text-right font-semibold text-gray-700">₹{r.total.toLocaleString('en-IN')}</td>
                  <td><span className={r.status === 'Paid' ? 'badge-green' : 'badge-yellow'}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BillingInvoice() {
  const [tab, setTab] = useState<Tab>('invoice')

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'invoice', label: 'Invoice',          icon: <FileText size={14} /> },
    { key: 'challan', label: 'Challan',          icon: <FileText size={14} /> },
    { key: 'list',    label: 'Tax Invoice List', icon: <List     size={14} /> },
  ]

  return (
    <div className="space-y-4">

      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Billing — {tab === 'invoice' ? 'Tax Invoice' : tab === 'challan' ? 'Delivery Challan' : 'Invoice List'}
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">GST Tax Invoice — Tally style</p>
        </div>
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                tab === t.key ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
          {tab !== 'list' && (
            <button onClick={() => setTab('list')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-brand text-white hover:bg-brand-dark transition-all">
              <Plus size={13} /> New Tax Invoice
            </button>
          )}
        </div>
      </div>

      {tab === 'invoice' && <InvoiceForm />}
      {tab === 'challan' && <ChallanForm />}
      {tab === 'list'    && <InvoiceList onNew={() => setTab('invoice')} />}
    </div>
  )
}
