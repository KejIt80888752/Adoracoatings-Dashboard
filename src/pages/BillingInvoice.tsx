import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Trash2, Save, FileText, FileSpreadsheet, List, Truck, CheckCheck, Mail } from 'lucide-react'
import { fetchSheet, addRow, deleteRow } from '../lib/api'

type Item = { id: number; particulars: string; qty: number; unit: string; rate: number }
type Tab = 'invoice' | 'proforma' | 'challan' | 'list'
type DocType = 'Tax Invoice' | 'Proforma Invoice'

const UNITS = ['Nos', 'Mtr', 'Kg', 'Ltr', 'Set', 'Pair', 'Box', 'Roll']
const STATES = ['Karnataka', 'Tamil Nadu', 'Maharashtra', 'Delhi', 'Telangana', 'Kerala', 'Andhra Pradesh', 'Gujarat']

const COMPANY_GST = '29AHDPA4964B1ZN'
const COMPANY_ADDRESS = '175/1, Pavilion Rd,\nJaya Nagar, 1st Block,\nBengaluru 560011'
const COMPANY_FOOTER = 'P: 98800 33353 | 98800 44000\nE: info@adoracoatings.com\nW: www.adoracoatings.com'
const BANK_DETAILS = 'Bank Name: Union Bank\nAccount Number: 070525090000001\nIFSC Code: UBIN0907057\nBranch: Whitefield'

// Suggested numbers are derived from existing saved records (fetched fresh on
// mount) rather than an in-memory counter, so they don't collide with earlier
// saved documents after a page reload.
const getInvNo = (type: DocType) => type === 'Tax Invoice' ? 'AFS/INV/001/2026-27' : 'AFS/PI/001/2026-27'
const nextInvNo = (type: DocType, existing: InvoiceRow[]) => {
  const prefix = type === 'Tax Invoice' ? 'AFS/INV/' : 'AFS/PI/'
  const max = existing.reduce((m, r) => {
    const no = r['Invoice No'] || ''
    if (!no.startsWith(prefix)) return m
    const n = Number(no.slice(prefix.length).match(/^\d+/)?.[0])
    return Number.isFinite(n) && n > m ? n : m
  }, 0)
  return `${prefix}${String(max + 1).padStart(3,'0')}/2026-27`
}
const getChallanNo = () => 'AC-001/26-27'
const nextChallanNo = (existing: ChallanRow[]) => {
  const max = existing.reduce((m, r) => {
    const n = Number((r['Challan No'] || '').match(/AC-(\d+)/)?.[1])
    return Number.isFinite(n) && n > m ? n : m
  }, 0)
  return `AC-${String(max + 1).padStart(3,'0')}/26-27`
}
const today = new Date().toLocaleDateString('en-IN')

function newItem(id: number): Item {
  return { id, particulars: '', qty: 1, unit: 'Nos', rate: 0 }
}

const amount = (it: Item) => Math.round(it.qty * it.rate * 100) / 100

function numberToWords(num: number): string {
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']
  const inWords = (n: number): string => {
    if (n < 20) return a[n]
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '')
    return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + inWords(n % 100) : '')
  }
  let n = Math.round(num)
  if (n === 0) return 'Zero Rupees Only'
  let result = ''
  const crore = Math.floor(n / 10000000); n %= 10000000
  const lakh = Math.floor(n / 100000); n %= 100000
  const thousand = Math.floor(n / 1000); n %= 1000
  if (crore) result += inWords(crore) + ' Crore '
  if (lakh) result += inWords(lakh) + ' Lakh '
  if (thousand) result += inWords(thousand) + ' Thousand '
  if (n) result += inWords(n)
  return result.trim() + ' Rupees Only'
}

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

type InvoiceRow = {
  'Doc Type': string; 'Invoice No': string; Date: string; State: string; Party: string; GSTIN: string
  'Billing Address': string; 'Delivery Address': string; 'Client Phone': string; 'Client Email': string; Items: string
  'Sub Total': string; CGST: string; SGST: string; IGST: string; 'Grand Total': string
  'Advance Paid': string; 'Total Due': string; Status: string
}
type ChallanRow = {
  'Challan No': string; Date: string; 'Client / Project Name': string; 'Delivery Address & Contact': string
  'Client Phone': string; 'Client Email': string
  Samples: string; 'Notes / Remarks': string; Status: string
}

// ═══════════════════════════════════════════════════════════════════════════
// TAX / PROFORMA INVOICE
// ═══════════════════════════════════════════════════════════════════════════
function InvoiceForm({ docType, onSaved, showToast }: { docType: DocType; onSaved: () => void; showToast: (m: string) => void }) {
  const [invNo, setInvNo]   = useState(() => getInvNo(docType))
  useEffect(() => { fetchSheet<InvoiceRow>('Invoices').then(rows => setInvNo(nextInvNo(docType, rows))) }, [docType])
  const [invDate, setInvDate] = useState(today)
  const [state, setState]   = useState('Karnataka')
  const [party, setParty]   = useState('')
  const [gstin, setGstin]   = useState('')
  const [billAddr, setBillAddr] = useState('')
  const [delAddr, setDelAddr]   = useState('')
  const [clientPhone, setClientPhone] = useState('')
  const [clientEmail, setClientEmail] = useState('')
  const [items, setItems]   = useState<Item[]>([newItem(1)])
  const [nextId, setNextId] = useState(2)
  const [advancePaid, setAdvancePaid] = useState(0)
  const [saving, setSaving] = useState(false)
  const [showPrint, setShowPrint] = useState(false)

  const addItem = () => { setItems(p => [...p, newItem(nextId)]); setNextId(n => n + 1) }
  const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id))
  const updateItem = (id: number, field: keyof Item, value: string | number) => {
    setItems(p => p.map(it => it.id !== id ? it : { ...it, [field]: value }))
  }

  const subTotal  = items.reduce((s, i) => s + amount(i), 0)
  const interState = state !== 'Karnataka'
  const totalGst  = Math.round(subTotal * 18) / 100
  const cgst      = interState ? 0 : totalGst / 2
  const sgst      = interState ? 0 : totalGst / 2
  const igst      = interState ? totalGst : 0
  const grandTotal = subTotal + totalGst
  const totalDue  = grandTotal - advancePaid

  const handleSave = async () => {
    if (!party) return
    setSaving(true)
    const result = await addRow('Invoices', {
      'Doc Type': docType,
      'Invoice No': invNo,
      Date: invDate,
      State: state,
      Party: party,
      GSTIN: gstin,
      'Billing Address': billAddr,
      'Delivery Address': delAddr,
      'Client Phone': clientPhone,
      'Client Email': clientEmail,
      Items: JSON.stringify(items.map(i => ({ ...i, amount: amount(i) }))),
      'Sub Total': subTotal.toFixed(2),
      CGST: cgst.toFixed(2),
      SGST: sgst.toFixed(2),
      IGST: igst.toFixed(2),
      'Grand Total': grandTotal.toFixed(2),
      'Advance Paid': advancePaid.toFixed(2),
      'Total Due': totalDue.toFixed(2),
      Status: docType === 'Tax Invoice' ? (totalDue <= 0 ? 'Paid' : 'Pending') : 'Draft',
    })
    setSaving(false)
    if (result?.status === 'ok') { showToast(`✓ ${invNo} saved for ${party}`); onSaved() }
    else showToast(`✗ Failed to save: ${result?.error || 'unknown error'}`)
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">{docType} No</label>
            <input value={invNo} onChange={e => setInvNo(e.target.value)} className="input-dark font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
            <input value={invDate} onChange={e => setInvDate(e.target.value)} className="input-dark" />
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
              {interState ? 'IGST' : 'CGST 9% + SGST 9%'}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Party Name <span className="text-red-500">*</span></label>
            <input value={party} onChange={e => setParty(e.target.value)} placeholder="Customer / Company name" className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">GST No</label>
            <input value={gstin} onChange={e => setGstin(e.target.value.toUpperCase())} placeholder="29XXXXXXXXXX1ZX" maxLength={15} className="input-dark font-mono" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Billing Address</label>
            <input value={billAddr} onChange={e => setBillAddr(e.target.value)} placeholder="Full address with city & pin" className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Delivery Address</label>
            <input value={delAddr} onChange={e => setDelAddr(e.target.value)} placeholder="Same as billing / site address" className="input-dark" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Client Phone</label>
            <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="10-digit mobile number" className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Client Email</label>
            <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@example.com" className="input-dark" />
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <p className="font-semibold text-gray-700 text-sm">Particulars</p>
        </div>
        <div className="overflow-auto max-h-[65vh]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Particulars','Qty','Unit','Rate (₹)','Amount',''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-3 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-2 py-2 min-w-[220px]">
                    <input value={item.particulars} onChange={e => updateItem(item.id,'particulars',e.target.value)}
                      placeholder="Item description" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand" />
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
          <button onClick={addItem} className="flex items-center gap-1.5 text-brand text-xs font-semibold hover:bg-brand/5 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={13} /> Add Item
          </button>
        </div>
        <div className="border-t border-gray-100 px-5 py-4">
          <div className="flex justify-end">
            <div className="w-72 space-y-2">
              <div className="flex justify-between text-sm text-gray-600"><span>Sub Total</span><span className="font-medium">{fmt(subTotal)}</span></div>
              {interState ? (
                <div className="flex justify-between text-sm text-gray-600"><span>IGST</span><span>{fmt(igst)}</span></div>
              ) : (
                <>
                  <div className="flex justify-between text-sm text-gray-600"><span>CGST : 9%</span><span>{fmt(cgst)}</span></div>
                  <div className="flex justify-between text-sm text-gray-600"><span>SGST : 9%</span><span>{fmt(sgst)}</span></div>
                </>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                <span>Grand Total</span><span className="text-brand text-lg">{fmt(grandTotal)}</span>
              </div>
              {docType === 'Tax Invoice' && (
                <>
                  <div className="flex justify-between items-center text-sm text-gray-600 pt-2">
                    <span>Advance Paid</span>
                    <input type="number" min={0} value={advancePaid} onChange={e => setAdvancePaid(+e.target.value)}
                      className="w-28 border border-gray-200 rounded-lg px-2 py-1 text-xs text-right focus:outline-none focus:border-brand" />
                  </div>
                  <div className="flex justify-between font-semibold text-sm text-red-500"><span>Total Due</span><span>{fmt(totalDue)}</span></div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <button onClick={() => { setItems([newItem(1)]); setNextId(2); setParty(''); setGstin(''); setBillAddr(''); setDelAddr(''); setAdvancePaid(0) }}
          className="btn-ghost text-sm">Clear</button>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowPrint(true)} className="btn-outline-gold text-sm">Preview & Print</button>
          <button disabled={!party || saving} onClick={handleSave} className="btn-gold flex items-center gap-1.5 text-sm disabled:opacity-50">
            <Save size={14} /> {saving ? 'Saving...' : `Save ${docType}`}
          </button>
        </div>
      </div>

      {showPrint && (
        <InvoicePrintModal
          data={{ docType, invNo, invDate, party, gstin, billAddr, delAddr, items, subTotal, cgst, sgst, igst, grandTotal, advancePaid, totalDue, interState }}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  )
}

function InvoicePrintModal({ data, onClose }: { data: any; onClose: () => void }) {
  const d = data
  return createPortal(
    <div className="print-modal-overlay fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto print:bg-white print:p-0 print:block">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl my-8 print:shadow-none print:rounded-none print:my-0 print:max-w-none" id="work-order-print-area">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 print:hidden">
          <h2 className="font-semibold text-gray-800">{d.docType} — {d.invNo}</h2>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn-gold text-sm">Print</button>
            <button onClick={onClose} className="btn-outline-gold text-sm">Close</button>
          </div>
        </div>
        <div className="p-8 text-sm text-gray-800">
          <img src={`${import.meta.env.BASE_URL}adora-logo.png`} alt="Adora Coatings" className="h-14 mb-2" />
          <h1 className="text-xl font-bold text-brand uppercase">{d.docType}</h1>
          <p className="text-xs text-gray-500 mb-4">GST NO: {COMPANY_GST}</p>

          <div className="grid grid-cols-3 gap-4 mb-4 text-xs">
            <div><b>BILLING ADDRESS:</b><br/>{d.party}<br/>{d.billAddr || '—'}<br/>GST NO: {d.gstin || '—'}</div>
            <div><b>DELIVERY ADDRESS:</b><br/>{d.delAddr || d.billAddr || '—'}</div>
            <div><b>DATE:</b> {d.invDate}<br/><b>{d.docType.toUpperCase()} NO:</b> {d.invNo}</div>
          </div>

          <table className="w-full text-xs mb-2 border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Particulars</th>
                <th className="border border-gray-200 px-2 py-1.5 text-right">Quantity</th>
                <th className="border border-gray-200 px-2 py-1.5 text-right">Rate</th>
                <th className="border border-gray-200 px-2 py-1.5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {d.items.map((it: Item) => (
                <tr key={it.id}>
                  <td className="border border-gray-200 px-2 py-1.5">{it.particulars}</td>
                  <td className="border border-gray-200 px-2 py-1.5 text-right">{it.qty} {it.unit}</td>
                  <td className="border border-gray-200 px-2 py-1.5 text-right">{it.rate.toLocaleString('en-IN')}</td>
                  <td className="border border-gray-200 px-2 py-1.5 text-right">{fmt(amount(it))}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="w-64 ml-auto space-y-1 text-xs mb-2">
            <div className="flex justify-between"><span>SUB TOTAL:</span><span>{fmt(d.subTotal)}</span></div>
            {d.interState ? (
              <div className="flex justify-between"><span>IGST:</span><span>{fmt(d.igst)}</span></div>
            ) : (
              <>
                <div className="flex justify-between"><span>CGST : 9%</span><span>{fmt(d.cgst)}</span></div>
                <div className="flex justify-between"><span>SGST : 9%</span><span>{fmt(d.sgst)}</span></div>
              </>
            )}
            <div className="flex justify-between font-bold text-brand text-sm border-t-2 border-brand pt-1"><span>GRAND TOTAL:</span><span>{fmt(d.grandTotal)}</span></div>
          </div>
          <p className="text-xs italic mb-4"><b>TOTAL VALUE IN WORDS:</b> {numberToWords(d.grandTotal)}</p>

          <div className="grid grid-cols-2 gap-4 text-xs mb-4 whitespace-pre-line">
            <div><b>BANK DETAILS:</b><br/>{BANK_DETAILS}<br/>GST NO: {COMPANY_GST}</div>
            <div><b>PAYMENT TERMS:</b><br/>70% along with work order towards material cost<br/>20% towards running bill basis.<br/>Balance 10% on completion of work.</div>
          </div>

          {d.docType === 'Tax Invoice' && (
            <div className="w-64 ml-auto space-y-1 text-xs mb-6">
              <div className="flex justify-between"><span>Advance Paid</span><span>{fmt(d.advancePaid)}</span></div>
              <div className="flex justify-between font-bold text-red-500"><span>TOTAL DUE:</span><span>{fmt(d.totalDue)}</span></div>
            </div>
          )}

          <div className="text-xs text-gray-600 whitespace-pre-line border-t border-gray-100 pt-4">
            {COMPANY_ADDRESS}
            {'\n\n'}
            {COMPANY_FOOTER}
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('print-root')!
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// DELIVERY CHALLAN (sample tracking)
// ═══════════════════════════════════════════════════════════════════════════
type Sample = { id: number; name: string; qty: string; receiptCondition: string; returnCondition: string; remarks: string }
function newSample(id: number): Sample {
  return { id, name: '', qty: '', receiptCondition: '', returnCondition: '', remarks: '' }
}

function ChallanForm({ onSaved, showToast }: { onSaved: () => void; showToast: (m: string) => void }) {
  const [challanNo, setChallanNo] = useState(getChallanNo)
  useEffect(() => { fetchSheet<ChallanRow>('Challans').then(rows => setChallanNo(nextChallanNo(rows))) }, [])
  const [challanDate, setChallanDate] = useState(today)
  const [clientProject, setClientProject] = useState('')
  const [deliveryAddr, setDeliveryAddr]   = useState('')
  const [clientPhone, setClientPhone]     = useState('')
  const [clientEmail, setClientEmail]     = useState('')
  const [deliveryMode, setDeliveryMode]   = useState('')
  const [pickupPlace, setPickupPlace]     = useState('')
  const [returnMode, setReturnMode]       = useState('')
  const [returnPlace, setReturnPlace]     = useState('')
  const [deliveryPerson, setDeliveryPerson] = useState('')
  const [pickupTime, setPickupTime]       = useState('')
  const [returnReceiver, setReturnReceiver] = useState('')
  const [returnTime, setReturnTime]       = useState('')
  const [contact1, setContact1]           = useState('')
  const [dest1, setDest1]                 = useState('')
  const [contact2, setContact2]           = useState('')
  const [dest2, setDest2]                 = useState('')
  const [samples, setSamples]             = useState<Sample[]>([newSample(1)])
  const [nextId, setNextId]               = useState(2)
  const [notes, setNotes]                 = useState('')
  const [saving, setSaving]               = useState(false)
  const [showPrint, setShowPrint]         = useState(false)

  const addSample = () => { setSamples(p => [...p, newSample(nextId)]); setNextId(n => n + 1) }
  const removeSample = (id: number) => setSamples(p => p.filter(s => s.id !== id))
  const updateSample = (id: number, field: keyof Sample, value: string) => {
    setSamples(p => p.map(s => s.id !== id ? s : { ...s, [field]: value }))
  }

  const handleSave = async () => {
    if (!clientProject) return
    setSaving(true)
    const result = await addRow('Challans', {
      'Challan No': challanNo,
      Date: challanDate,
      'Client / Project Name': clientProject,
      'Delivery Address & Contact': deliveryAddr,
      'Client Phone': clientPhone,
      'Client Email': clientEmail,
      Samples: JSON.stringify(samples),
      'Notes / Remarks': notes,
      Status: 'Out',
    })
    setSaving(false)
    if (result?.status === 'ok') { showToast(`✓ ${challanNo} saved`); onSaved() }
    else showToast(`✗ Failed to save: ${result?.error || 'unknown error'}`)
  }

  return (
    <div className="space-y-4">
      <div className="card space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Consignment No</label>
            <input value={challanNo} onChange={e => setChallanNo(e.target.value)} className="input-dark font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
            <input value={challanDate} onChange={e => setChallanDate(e.target.value)} className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Client / Project Name <span className="text-red-500">*</span></label>
            <input value={clientProject} onChange={e => setClientProject(e.target.value)} placeholder="Project / site name" className="input-dark" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Delivery Address & Contact Person</label>
          <input value={deliveryAddr} onChange={e => setDeliveryAddr(e.target.value)} placeholder="Address and contact person at site" className="input-dark" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Client Phone</label>
            <input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="10-digit mobile number" className="input-dark" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Client Email</label>
            <input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} placeholder="client@example.com" className="input-dark" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 pt-2">
          <div className="space-y-3">
            <p className="text-xs font-bold text-brand uppercase">Delivery</p>
            <div><label className="block text-xs text-gray-500 mb-1">Delivery Mode</label><input value={deliveryMode} onChange={e => setDeliveryMode(e.target.value)} className="input-dark" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Place of Pick Up</label><input value={pickupPlace} onChange={e => setPickupPlace(e.target.value)} className="input-dark" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Delivery Person</label><input value={deliveryPerson} onChange={e => setDeliveryPerson(e.target.value)} className="input-dark" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Time of Pickup</label><input value={pickupTime} onChange={e => setPickupTime(e.target.value)} className="input-dark" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Contact</label><input value={contact1} onChange={e => setContact1(e.target.value)} className="input-dark" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Final Destination</label><input value={dest1} onChange={e => setDest1(e.target.value)} className="input-dark" /></div>
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold text-brand uppercase">Return</p>
            <div><label className="block text-xs text-gray-500 mb-1">Return Mode</label><input value={returnMode} onChange={e => setReturnMode(e.target.value)} className="input-dark" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Firm - Place of Return</label><input value={returnPlace} onChange={e => setReturnPlace(e.target.value)} className="input-dark" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Return Receiver</label><input value={returnReceiver} onChange={e => setReturnReceiver(e.target.value)} className="input-dark" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Time of Return</label><input value={returnTime} onChange={e => setReturnTime(e.target.value)} className="input-dark" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Contact</label><input value={contact2} onChange={e => setContact2(e.target.value)} className="input-dark" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Final Destination</label><input value={dest2} onChange={e => setDest2(e.target.value)} className="input-dark" /></div>
          </div>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="font-semibold text-gray-700 text-sm">Samples</p>
        </div>
        <div className="overflow-auto max-h-[65vh]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Sample Name / Image','Quantity','Receipt Condition','Return Condition','Remarks',''].map(h => (
                  <th key={h} className="text-left text-xs font-semibold text-gray-500 px-3 py-2.5 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {samples.map(s => (
                <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="px-2 py-2 min-w-[160px]"><input value={s.name} onChange={e => updateSample(s.id,'name',e.target.value)} placeholder="Sample name" className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand" /></td>
                  <td className="px-2 py-2 w-24"><input value={s.qty} onChange={e => updateSample(s.id,'qty',e.target.value)} placeholder="e.g. 2" className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand" /></td>
                  <td className="px-2 py-2 min-w-[120px]"><input value={s.receiptCondition} onChange={e => updateSample(s.id,'receiptCondition',e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand" /></td>
                  <td className="px-2 py-2 min-w-[120px]"><input value={s.returnCondition} onChange={e => updateSample(s.id,'returnCondition',e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand" /></td>
                  <td className="px-2 py-2 min-w-[120px]"><input value={s.remarks} onChange={e => updateSample(s.id,'remarks',e.target.value)} className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-brand" /></td>
                  <td className="px-2 py-2">
                    {samples.length > 1 && (
                      <button onClick={() => removeSample(s.id)} className="text-gray-300 hover:text-red-400 transition-colors p-1"><Trash2 size={14} /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100">
          <button onClick={addSample} className="flex items-center gap-1.5 text-brand text-xs font-semibold hover:bg-brand/5 px-3 py-1.5 rounded-lg transition-colors">
            <Plus size={13} /> Add Sample
          </button>
        </div>
        <div className="px-5 py-4 border-t border-gray-100">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Notes / Remarks</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="input-dark w-full" />
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <button onClick={() => { setSamples([newSample(1)]); setNextId(2); setClientProject(''); setDeliveryAddr(''); setNotes('') }}
          className="btn-ghost text-sm">Clear</button>
        <div className="flex gap-2">
          <button onClick={() => setShowPrint(true)} className="btn-outline-gold text-sm">Preview & Print</button>
          <button disabled={!clientProject || saving} onClick={handleSave} className="btn-gold flex items-center gap-1.5 text-sm disabled:opacity-50">
            <Save size={14} /> {saving ? 'Saving...' : 'Save Challan'}
          </button>
        </div>
      </div>

      {showPrint && (
        <ChallanPrintModal
          data={{ challanNo, challanDate, clientProject, deliveryAddr, deliveryMode, pickupPlace, returnMode, returnPlace, deliveryPerson, pickupTime, returnReceiver, returnTime, contact1, dest1, contact2, dest2, samples, notes }}
          onClose={() => setShowPrint(false)}
        />
      )}
    </div>
  )
}

function ChallanPrintModal({ data: d, onClose }: { data: any; onClose: () => void }) {
  return createPortal(
    <div className="print-modal-overlay fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto print:bg-white print:p-0 print:block">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl my-8 print:shadow-none print:rounded-none print:my-0 print:max-w-none" id="work-order-print-area">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 print:hidden">
          <h2 className="font-semibold text-gray-800">Delivery Challan — {d.challanNo}</h2>
          <div className="flex gap-2">
            <button onClick={() => window.print()} className="btn-gold text-sm">Print</button>
            <button onClick={onClose} className="btn-outline-gold text-sm">Close</button>
          </div>
        </div>
        <div className="p-8 text-xs text-gray-800">
          <img src={`${import.meta.env.BASE_URL}adora-logo.png`} alt="Adora Coatings" className="h-12 mb-3" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-bold text-brand">CONSIGNOR:</p>
              <p>ADORA COATINGS<br/>175/1, Pavilion Road<br/>Jayanagar 1st Block, Byrasandra Jayanagar<br/>Bengaluru, Karnataka 560011<br/>Phone: 98800 33353</p>
            </div>
            <div>
              <p><b>CONSIGNMENT NO:</b> {d.challanNo}</p>
              <p><b>DATE:</b> {d.challanDate}</p>
              <p className="mt-2"><b>CLIENT / PROJECT NAME:</b> {d.clientProject}</p>
              <p><b>DELIVERY ADDRESS & CONTACT PERSON:</b> {d.deliveryAddr || '—'}</p>
            </div>
          </div>

          <p className="font-bold text-brand mb-2">CONSIGNEE:</p>

          <div className="grid grid-cols-2 gap-6 mb-4">
            <div className="space-y-1">
              <p className="font-semibold">DELIVERY</p>
              <p><b>Delivery Mode:</b> {d.deliveryMode || '—'}</p>
              <p><b>Place of Pick Up:</b> {d.pickupPlace || '—'}</p>
              <p><b>Delivery Person:</b> {d.deliveryPerson || '—'}</p>
              <p><b>Time of Pickup:</b> {d.pickupTime || '—'}</p>
              <p><b>Contact:</b> {d.contact1 || '—'}</p>
              <p><b>Final Destination:</b> {d.dest1 || '—'}</p>
            </div>
            <div className="space-y-1">
              <p className="font-semibold">RETURN</p>
              <p><b>Return Mode:</b> {d.returnMode || '—'}</p>
              <p><b>Firm - Place of Return:</b> {d.returnPlace || '—'}</p>
              <p><b>Return Receiver:</b> {d.returnReceiver || '—'}</p>
              <p><b>Time of Return:</b> {d.returnTime || '—'}</p>
              <p><b>Contact:</b> {d.contact2 || '—'}</p>
              <p><b>Final Destination:</b> {d.dest2 || '—'}</p>
            </div>
          </div>

          <table className="w-full mb-4 border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-1.5 text-left">Sample Name / Image</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Quantity</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Receipt Condition</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Return Condition</th>
                <th className="border border-gray-200 px-2 py-1.5 text-left">Remarks</th>
              </tr>
            </thead>
            <tbody>
              {d.samples.map((s: Sample) => (
                <tr key={s.id}>
                  <td className="border border-gray-200 px-2 py-1.5">{s.name}</td>
                  <td className="border border-gray-200 px-2 py-1.5">{s.qty}</td>
                  <td className="border border-gray-200 px-2 py-1.5">{s.receiptCondition}</td>
                  <td className="border border-gray-200 px-2 py-1.5">{s.returnCondition}</td>
                  <td className="border border-gray-200 px-2 py-1.5">{s.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {d.notes && <p className="mb-4"><b>NOTES / REMARKS:</b> {d.notes}</p>}

          <p className="font-bold text-brand mb-1">DECLARATION:</p>
          <p className="mb-8">This sample(s) is the property of Adora Coatings. Photography of the sample is not allowed. The samples are required to be duly returned in the same condition as received.</p>

          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="border-t border-gray-400 pt-2 pr-4 w-1/2">SIGNATURE: RECIPIENT<br/><br/>DATE: _______________</td>
                <td className="border-t border-gray-400 pt-2 w-1/2">SIGNATURE: ADORA COATINGS<br/><br/>DATE: _______________</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>,
    document.getElementById('print-root')!
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// LIST
// ═══════════════════════════════════════════════════════════════════════════
function InvoiceList({ onNew }: { onNew: () => void }) {
  const [invoices, setInvoices] = useState<(InvoiceRow & { rowIndex: number })[]>([])
  const [challans, setChallans] = useState<(ChallanRow & { rowIndex: number })[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState('')
  const [deletingRow, setDeletingRow] = useState<string | null>(null)

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  const load = () => {
    setLoading(true)
    Promise.all([
      fetchSheet<InvoiceRow>('Invoices').then(rows => setInvoices(rows.map((r, i) => ({ ...r, rowIndex: i + 2 })))),
      fetchSheet<ChallanRow>('Challans').then(rows => setChallans(rows.map((r, i) => ({ ...r, rowIndex: i + 2 })))),
    ]).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const delInvoice = async (r: InvoiceRow & { rowIndex: number }) => {
    if (!confirm(`Delete ${r['Invoice No']}? This can't be undone.`)) return
    setDeletingRow('inv-' + r.rowIndex)
    const result = await deleteRow('Invoices', r.rowIndex)
    setDeletingRow(null)
    if (result?.status === 'ok') { showToast(`✓ ${r['Invoice No']} deleted`); load() }
    else showToast(`✗ Failed: ${result?.error || 'unknown error'}`)
  }
  const delChallan = async (r: ChallanRow & { rowIndex: number }) => {
    if (!confirm(`Delete ${r['Challan No']}? This can't be undone.`)) return
    setDeletingRow('ch-' + r.rowIndex)
    const result = await deleteRow('Challans', r.rowIndex)
    setDeletingRow(null)
    if (result?.status === 'ok') { showToast(`✓ ${r['Challan No']} deleted`); load() }
    else showToast(`✗ Failed: ${result?.error || 'unknown error'}`)
  }

  const emailInvoice = (r: InvoiceRow) => {
    if (!r['Client Email']) { showToast('✗ No email saved for this client — add one when creating the invoice'); return }
    const subject = `${r['Doc Type']} ${r['Invoice No']} from Adora Coatings`
    const body = `Dear ${r.Party},\n\nPlease find your ${r['Doc Type']} details below.\n\n${r['Doc Type']} No: ${r['Invoice No']}\nDate: ${r.Date}\nGrand Total: ${fmt(Number(r['Grand Total']) || 0)}\n\nThank you,\nAdora Coatings`
    window.location.href = `mailto:${r['Client Email']}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }
  const emailChallan = (r: ChallanRow) => {
    if (!r['Client Email']) { showToast('✗ No email saved for this client — add one when creating the challan'); return }
    const subject = `Delivery Challan ${r['Challan No']} from Adora Coatings`
    const body = `Dear Sir/Madam,\n\nPlease find your delivery challan details below.\n\nChallan No: ${r['Challan No']}\nDate: ${r.Date}\nClient / Project: ${r['Client / Project Name']}\n\nThank you,\nAdora Coatings`
    window.location.href = `mailto:${r['Client Email']}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><p className="text-sm text-gray-500">Showing {invoices.length} invoices, {challans.length} challans</p></div>
        <button onClick={onNew} className="btn-gold flex items-center gap-1.5 text-sm"><Plus size={13} /> New Document</button>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 font-semibold text-sm text-gray-700">Invoices</div>
        <div className="overflow-auto max-h-[50vh]">
          <table className="tbl w-full">
            <thead><tr><th>Type</th><th>Invoice #</th><th>Party</th><th>Date</th><th className="text-right">Amount</th><th>Status</th><th>Email</th><th>Delete</th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan={8} className="text-center py-8 text-gray-400">Loading…</td></tr>}
              {!loading && invoices.length === 0 && <tr><td colSpan={8} className="text-center py-8 text-gray-400">No invoices saved yet</td></tr>}
              {invoices.map(r => (
                <tr key={r.rowIndex}>
                  <td className="text-xs">{r['Doc Type']}</td>
                  <td className="font-mono text-xs text-brand">{r['Invoice No']}</td>
                  <td className="font-medium text-gray-700">{r.Party}</td>
                  <td className="text-gray-500 text-xs">{r.Date}</td>
                  <td className="text-right font-semibold text-gray-700">{fmt(Number(r['Grand Total']) || 0)}</td>
                  <td><span className={r.Status === 'Paid' ? 'badge-green' : r.Status === 'Draft' ? 'badge-gray' : 'badge-yellow'}>{r.Status}</span></td>
                  <td>
                    <button onClick={() => emailInvoice(r)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-brand/10 text-brand" title={r['Client Email'] ? `Email ${r['Client Email']}` : 'No email saved for this client'}><Mail size={13}/></button>
                  </td>
                  <td>
                    <button onClick={() => delInvoice(r)} disabled={deletingRow === 'inv-' + r.rowIndex}
                      className="p-1.5 rounded-lg transition-colors hover:bg-red-50 text-red-500 disabled:opacity-40"><Trash2 size={13}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 font-semibold text-sm text-gray-700">Delivery Challans</div>
        <div className="overflow-auto max-h-[50vh]">
          <table className="tbl w-full">
            <thead><tr><th>Challan #</th><th>Client / Project</th><th>Date</th><th>Status</th><th>Email</th><th>Delete</th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan={6} className="text-center py-8 text-gray-400">Loading…</td></tr>}
              {!loading && challans.length === 0 && <tr><td colSpan={6} className="text-center py-8 text-gray-400">No challans saved yet</td></tr>}
              {challans.map(r => (
                <tr key={r.rowIndex}>
                  <td className="font-mono text-xs text-brand">{r['Challan No']}</td>
                  <td className="font-medium text-gray-700">{r['Client / Project Name']}</td>
                  <td className="text-gray-500 text-xs">{r.Date}</td>
                  <td><span className="badge-blue">{r.Status}</span></td>
                  <td>
                    <button onClick={() => emailChallan(r)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-brand/10 text-brand" title={r['Client Email'] ? `Email ${r['Client Email']}` : 'No email saved for this client'}><Mail size={13}/></button>
                  </td>
                  <td>
                    <button onClick={() => delChallan(r)} disabled={deletingRow === 'ch-' + r.rowIndex}
                      className="p-1.5 rounded-lg transition-colors hover:bg-red-50 text-red-500 disabled:opacity-40"><Trash2 size={13}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-brand text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCheck size={15}/>{toast}
        </div>
      )}
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════
export default function BillingInvoice() {
  const [tab, setTab] = useState<Tab>('invoice')
  const [toast, setToast] = useState('')
  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'invoice',  label: 'Tax Invoice',      icon: <FileText size={14} /> },
    { key: 'proforma', label: 'Proforma Invoice', icon: <FileSpreadsheet size={14} /> },
    { key: 'challan',  label: 'Challan',          icon: <Truck    size={14} /> },
    { key: 'list',     label: 'Document List',    icon: <List size={14} /> },
  ]

  const titles: Record<Tab, string> = {
    invoice: 'Tax Invoice', proforma: 'Proforma Invoice', challan: 'Delivery Challan', list: 'Document List',
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Billing — {titles[tab]}</h1>
          <p className="text-xs text-gray-400 mt-0.5">GST Tax Invoice, Proforma Invoice & Delivery Challan</p>
        </div>
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl flex-wrap">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                tab === t.key ? 'bg-white text-brand shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'invoice'  && <InvoiceForm docType="Tax Invoice" onSaved={() => { setTab('list') }} showToast={showToast} />}
      {tab === 'proforma' && <InvoiceForm docType="Proforma Invoice" onSaved={() => { setTab('list') }} showToast={showToast} />}
      {tab === 'challan'  && <ChallanForm onSaved={() => { setTab('list') }} showToast={showToast} />}
      {tab === 'list'     && <InvoiceList onNew={() => setTab('invoice')} />}

      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-brand text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCheck size={15}/>{toast}
        </div>
      )}
    </div>
  )
}
