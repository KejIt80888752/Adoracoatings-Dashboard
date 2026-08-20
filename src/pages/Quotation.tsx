import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Trash2, CheckCheck, FileText, List, FileSignature, Pencil, Mail, MessageCircle } from 'lucide-react'
import { fetchSheet, addRow, deleteRow } from '../lib/api'

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

// Google Sheets round-trips a plain date string as a full ISO datetime
// ("2026-08-13T00:00:00.000Z"), which looked like a stray 00:00:00 timestamp
// everywhere a saved Date was displayed. Strip it down to just the date.
const fmtDate = (d: string) => {
  if (!d) return '—'
  const iso = d.match(/^(\d{4})-(\d{2})-(\d{2})T/)
  if (iso) return `${iso[3]}/${iso[2]}/${iso[1]}`
  return d
}

// Builds a wa.me deep link with a pre-filled message. Indian 10-digit numbers
// get the country code prefixed automatically; anything already prefixed or
// non-Indian is passed through as-is (just stripped of non-digit characters).
const waLink = (phone: string, text: string) => {
  const digits = (phone || '').replace(/\D/g, '')
  const withCountryCode = digits.length === 10 ? `91${digits}` : digits
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(text)}`
}

type Item = {
  id: number; particulars: string; texture: string; length: number; height: number; nos: number; coefficient: number; rate: number
  // Typed directly instead of derived from Length x Height x Nos x Co-efficient
  // (or from Area x Rate) -- lets a quotation be built from just a known Area
  // or a known Amount, with no division anywhere so there's no zero-denominator case.
  areaOverride?: number; amountOverride?: number
}
type QuoteRow = { 'Quote No': string; Date: string; 'Client Name': string; 'Client Address': string; 'Client Phone': string; 'Client Email': string; 'Handled By': string; 'Enquired By': string; 'Finish Type': string; Items: string; Total: string; GST: string; 'Grand Total': string; Status: string; Notes: string }

const FINISH_TYPES = ['ACRALIYC', 'MICROLITE'] as const
type FinishType = typeof FINISH_TYPES[number]

// ── MICROLITE-specific terms (from QUOTATION FORMAT FOR MICROLITE.xlsx) ───────
const MICROLITE_PREPARATION_INTRO = 'Once this proposal is accepted, our team manager will schedule a site visit to inspect the location, provide design suggestions, measure the space, and, if required, provide your staff with the appropriate training for the initial surface preparation. On the day of the visit, the client, the architect, and any contractors (if any) should be present.'

const MICROLITE_SITE_TERMS = [
  'The walls should be properly completed, including electrical, painting, and all other agencies’ work.',
  'It is recommended to have a smooth tile base with paper joint, duly laid with proper slope in the required direction.',
]

const MICROLITE_CLIENT_TERMS = [
  'Provision for space to unload materials at the location.',
  'Provision for water and electricity.',
  'Provision for proper light.',
  'The client must take up disposal of waste and debris.',
  'Arrangement for floor protection must be provided (if required).',
]

const MICROLITE_SHADE_TERMS = [
  'There could be minor differences in shade across batches of the material. Nonetheless, we ensure that a single production batch for a certain order has an even shade at the time of production.',
  'Likewise, there may be minute differences in tone and texture between our reference image or material samples and the finished product.',
  'Due to the handmade nature of the work, variations in texture and shade are expected. This should be regarded as an aspect of the material’s inherent beauty.',
]

const MICROLITE_PROTECTION_TERMS = [
  'When used outside, shielding from surface runoff is necessary.',
  'Plaster’s sharp edges are prone to chipping, particularly in areas used for circulation. Steps need to be taken in design to prevent this problem.',
  'The final surface finish cannot be touched up in case of any damages. It is therefore advised to apply the flooring after completing all other tasks.',
]

const MICROLITE_WORKFLOW_TERMS = [
  'Any complaints, issues, or suggestions for improvements should be directed via the project manager.',
  'Disruption to our workflow due to other ongoing activities on the site will result in finishing issues, and might lead to pausing the job and a delay in completion.',
  'Before the teams depart the site, premises should be inspected for cleanliness, etc. and concerns should be reported to the site manager.',
  'Work in different areas will be carried out simultaneously in a single phase.',
]

const MICROLITE_COMMERCIAL_TERMS = [
  'The final billing will be determined by the actual area covered.',
  'Upon project completion, the remaining balance must be paid within 3 days. No retention is allowed, and a 2% Monthly interest will be charged on late payments.',
  'The validity of the quote is for 40 days.',
  'The price includes both materials and labor.',
  'Surfaces less than 1 foot in width will be considered as 1 foot.',
  'Idle Charges: Any delay due to lack of working clearance from the client will result in man-day losses. Consequently, idle charges will be Rs 1500/- per person per day, in addition to the quoted price, and will be charged to your account.',
  'All rates are Ex-Bangalore.',
  'Customized samples will be charged additionally. Sampling directly on the wall/surface, whether interior or exterior, is not possible because the product needs to be chiselled out for final application. If unsatisfactory, surface preparation will need to be redone by the client.',
]

// ── Standard terms, pulled from Adora Coatings' quotation formats ─────────────
const BANK_DETAILS = 'Name: Adora Coatings\nBank: Union Bank\nAccount Number: 070525090000001\nIFSC Code: UBIN0907057\nBranch: Whitefield\nGST NO: 29AHDPA4964B1ZN'
const COMPANY_ADDRESS = 'Adora Coatings\n175/1, Pavilion Rd\nJaya Nagar 1st Block\nByrasandra, Jayanagar\nBengaluru, Karnataka 560011'
const PAYMENT_TERMS = '70% along with work order towards material cost\n20% towards running bill basis.\nBalance 10% on completion of work.'

const COMMERCIAL_TERMS = [
  'The terms and conditions in this document take precedence over any other documents, such as your Purchase Order or Work Order.',
  'The estimate is based on the provided measurements. The final billing will be determined by the actual area covered.',
  'Work in different areas will be carried out simultaneously in a single phase.',
  'Processing the advance payment implies your agreement to the terms and conditions outlined in this document. Once processed, the advance is non-refundable under any circumstances.',
  'Upon project completion, the remaining balance must be paid within 3 days. No retention is allowed, and a 2% Monthly interest will be charged on late payments.',
  'The price includes both materials and labor.',
  'Surfaces less than 1 foot in width will be considered as 1 foot.',
  'Idle Charges: Any delay due to lack of working clearance from the client will result in man-day losses. Consequently, idle charges will be Rs 1500/- per person per day, in addition to the quoted price, and will be charged to your account.',
]

const EXECUTION_TERMS = [
  'The site should be free of all the work from other vendors like plumbing, carpentry, electricals, other paint/texture agencies. Jobs like polishing marble, wood floor installation, painting ceilings need to be completed before the commencement of our texture as all these have a very detrimental effect on our product.',
  'The site should be free from all the debris/loose dust.',
  'Uninterrupted power supply, ample light to be provided at the application area. Clean water to be provided at the application area.',
  'The finish is proposed on the smooth surface, any groove, moulding, beading, design element, etc. shall be charged extra according to the complexity of the job.',
  'Rework or touch up will be charged additionally.',
  'The finish finalised is hand crafted, the final finish at site may vary slightly from the sample finish.',
  'Any finish applied on wood, MDF, plywood, etc. panels has a high risk of joint cracking. You will have to either make grooves or apply reinforcement tapes and fill the joints with high quality adhesives. In any case we do not warrant the cracks. Any re-work arising due to cracks will be charged accordingly.',
  'Clearance of debris from the site will be handled completely by the client.',
  'Client shall provide a secured area at the site to store our material and equipment.',
  'We, Adora Coatings, shall be allowed to take pictures / videos of the project for our records. In case you need the credentials to be confidential, indicate the same so that it shall not be.',
  'Final billing shall be based on the actual quantities applied at site. The proposal does not form any contract or binding for the final amount. The final billing shall be based on measurable BOQs including variation of quantities either minor or major in nature.',
]

const IMPORTANT_TERMS = [
  'Manually created colour shades vary around 25% from the chosen colour due to factors like compression and distribution of pigments. It is considered normal and should not be treated as an application defect.',
  'Our products are applied by hand so uniform application like paint is not possible, nor would we try to mimic paint. Variation in texture is natural and should not be treated as an application defect.',
  'Lime Plaster is a thick material, hence it is not possible to apply it inside grooves and small areas. The client will have to get it painted after our work is completed. We can do regular acrylic painting inside the grooves for a running-feet charge. Rate will be the same as the sq.ft. rate of the finish selected. Groove colour may not match and will slightly differ.',
  'We would not take any accountability for any marks or damages caused to the applied or painted wall by any other reason or individual beyond our scope.',
  'Existing surface undulations, if any, may appear even after the finish is applied.',
  'The work will commence after the Terms and Conditions have been approved and signed by the Authorised Signatory.',
]

const MEASUREMENT_TERMS = [
  'Joint Measurements: 100% joint measurements to be completed during the course of the work.',
  'Third Party Measurements: A professional agency will do the measurement in the presence of Adora Coatings & the Client. The Client will pay 100% agency charges.',
  'Any Other Method: If there is any other method, the Client shall provide details before the commencement of the work. Additional charges will be applicable.',
]

// Derives the next quote number from existing records instead of an in-memory
// counter, so suggested numbers don't collide with earlier saved quotations
// after a page reload (the counter would otherwise reset to 1 every time).
const nextQuoteNo = (existing: QuoteRow[]) => {
  const max = existing.reduce((m, q) => {
    const n = Number((q['Quote No'] || '').match(/ACQ-(\d+)/)?.[1])
    return Number.isFinite(n) && n > m ? n : m
  }, 0)
  return `ACQ-${String(max + 1).padStart(3,'0')}/26-27`
}
const today = new Date().toLocaleDateString('en-IN')

function newItem(id: number): Item {
  return { id, particulars: '', texture: '', length: 0, height: 0, nos: 1, coefficient: 1, rate: 0 }
}

const area = (it: Item) => it.areaOverride != null ? it.areaOverride : Math.round(it.length * it.height * it.nos * it.coefficient * 100) / 100
const amount = (it: Item) => it.amountOverride != null ? it.amountOverride : Math.round(area(it) * it.rate * 100) / 100

export default function Quotation() {
  const [tab, setTab]       = useState<'list' | 'create'>('list')
  const [search, setSearch] = useState('')
  const [quotes, setQuotes] = useState<(QuoteRow & { rowIndex: number })[]>([])
  const [loading, setLoading] = useState(false)
  const [toast, setToast]   = useState('')
  const [deletingRow, setDeletingRow] = useState<number | null>(null)
  const [workOrderQuote, setWorkOrderQuote] = useState<(QuoteRow & { rowIndex: number }) | null>(null)
  const [editingQuote, setEditingQuote] = useState<(QuoteRow & { rowIndex: number }) | null>(null)

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

  // Client Phone/Email saved on the record are just a convenience -- if
  // missing, ask for one on the spot rather than blocking the share.
  const emailQuote = (q: QuoteRow & { rowIndex: number }) => {
    const to = q['Client Email'] || window.prompt('Client email address to send to:') || ''
    if (!to) return
    const subject = `Quotation ${q['Quote No']} from Adora Coatings`
    const body = `Dear ${q['Client Name']},\n\nPlease find your quotation details below.\n\nQuotation No: ${q['Quote No']}\nDate: ${fmtDate(q.Date)}\nGrand Total: ${fmt(Number(q['Grand Total']) || 0)}\n\nThank you,\nAdora Coatings`
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const whatsappQuote = (q: QuoteRow & { rowIndex: number }) => {
    const phone = q['Client Phone'] || window.prompt('Client phone number to WhatsApp:') || ''
    if (!phone) return
    const text = `Dear ${q['Client Name']}, please find your quotation from Adora Coatings.\n\nQuotation No: ${q['Quote No']}\nDate: ${fmtDate(q.Date)}\nGrand Total: ${fmt(Number(q['Grand Total']) || 0)}\n\nThank you,\nAdora Coatings`
    window.open(waLink(phone, text), '_blank')
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
          <button onClick={() => { setEditingQuote(null); setTab('create') }}
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
                <button onClick={() => { setEditingQuote(null); setTab('create') }} className="btn-gold flex items-center gap-1.5 text-sm"><Plus size={13}/> New Quotation</button>
              </div>
            </div>
            <div className="overflow-auto max-h-[65vh]">
              <table className="tbl tbl-stable">
                <colgroup>
                  <col style={{width:130}} /><col style={{width:220}} /><col style={{width:100}} />
                  <col style={{width:100}} /><col style={{width:100}} /><col style={{width:110}} /><col style={{width:100}} />
                  <col style={{width:52}} /><col style={{width:52}} /><col style={{width:52}} /><col style={{width:52}} /><col style={{width:52}} />
                </colgroup>
                <thead>
                  <tr>
                    <th>Quotation #</th><th>Client</th><th>Date</th>
                    <th>Total</th><th>GST (18%)</th><th>Grand Total</th><th>Status</th>
                    <th className="tbl-icon-col whitespace-normal leading-tight">Work Order</th><th className="tbl-icon-col whitespace-normal leading-tight">Email</th><th className="tbl-icon-col whitespace-normal leading-tight">WhatsApp</th><th className="tbl-icon-col whitespace-normal leading-tight">Edit</th><th className="tbl-icon-col whitespace-normal leading-tight">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={12} className="text-center py-10 text-gray-400">Loading…</td></tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr><td colSpan={12} className="text-center py-10 text-gray-400">{search ? 'No quotations match your search.' : 'No quotations yet.'}</td></tr>
                  )}
                  {filtered.map(q => (
                    <tr key={q.rowIndex}>
                      <td className="text-xs text-gray-500 font-mono">{q['Quote No']}</td>
                      <td className="font-medium">{q['Client Name']}</td>
                      <td className="text-gray-500">{fmtDate(q.Date)}</td>
                      <td>{fmt(Number(q.Total) || 0)}</td>
                      <td className="text-gray-500">{fmt(Number(q.GST) || 0)}</td>
                      <td className="font-semibold text-brand">{fmt(Number(q['Grand Total']) || 0)}</td>
                      <td><span className={q.Status === 'Completed' ? 'badge-green' : q.Status === 'Pending' ? 'badge-red' : 'badge-yellow'}>{q.Status || 'In Progress'}</span></td>
                      <td>
                        <button onClick={() => setWorkOrderQuote(q)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-brand-50 text-brand" title="View / Print Work Order">
                          <FileSignature size={13}/>
                        </button>
                      </td>
                      <td>
                        <button onClick={() => emailQuote(q)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-brand-50 text-brand" title={q['Client Email'] ? `Email ${q['Client Email']}` : 'No email saved for this client'}>
                          <Mail size={13}/>
                        </button>
                      </td>
                      <td>
                        <button onClick={() => whatsappQuote(q)}
                          className="p-1.5 rounded-lg transition-colors hover:bg-green-50 text-green-600" title={q['Client Phone'] ? `WhatsApp ${q['Client Phone']}` : 'No phone number saved for this client'}>
                          <MessageCircle size={13}/>
                        </button>
                      </td>
                      <td>
                        <button onClick={() => { setEditingQuote(q); setTab('create') }}
                          className="p-1.5 rounded-lg transition-colors hover:bg-brand-50 text-brand" title="Edit quotation">
                          <Pencil size={13}/>
                        </button>
                      </td>
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

      {tab === 'create' && (
        <CreateQuotation
          existingQuotes={quotes}
          editing={editingQuote}
          onSaved={() => { setTab('list'); setEditingQuote(null); loadQuotes() }}
          showToast={showToast}
        />
      )}

      {workOrderQuote && (
        <WorkOrderModal
          quote={workOrderQuote}
          onClose={() => setWorkOrderQuote(null)}
          onEdit={() => { setEditingQuote(workOrderQuote); setWorkOrderQuote(null); setTab('create') }}
        />
      )}

      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-brand text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCheck size={15}/>{toast}
        </div>
      )}
    </div>
  )
}

function WorkOrderModal({ quote: q, onClose, onEdit }: { quote: QuoteRow & { rowIndex: number }; onClose: () => void; onEdit: () => void }) {
  let items: (Item & { area?: number; amount?: number })[] = []
  try { items = JSON.parse(q.Items || '[]') } catch { items = [] }
  const isMicrolite = q['Finish Type'] === 'MICROLITE'

  const Section = ({ title, terms }: { title: string; terms: string[] }) => (
    <div className="border border-gray-400 mb-4">
      <h3 className="text-xs font-bold text-brand bg-gray-50 px-2 py-1.5 border-b border-gray-400">{title}</h3>
      <ol className="divide-y divide-gray-400 text-xs text-gray-700">
        {terms.map((t, i) => <li key={i} className="px-2 py-1.5"><b>{i + 1}.</b> {t}</li>)}
      </ol>
    </div>
  )

  return createPortal(
    <div className="print-modal-overlay fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto print:bg-white print:p-0 print:block">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl my-8 print:shadow-none print:rounded-none print:my-0 print:max-w-none" id="work-order-print-area">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 print:hidden">
          <h2 className="font-semibold text-gray-800">Work Order — {q['Quote No']}</h2>
          <div className="flex gap-2">
            <button onClick={onEdit} className="btn-outline-gold text-sm flex items-center gap-1.5"><Pencil size={13}/> Edit</button>
            <button
              onClick={() => {
                const to = q['Client Email'] || window.prompt('Client email address to send to:') || ''
                if (!to) return
                const subject = `Quotation ${q['Quote No']} from Adora Coatings`
                const body = `Dear ${q['Client Name']},\n\nPlease find your quotation details below.\n\nQuotation No: ${q['Quote No']}\nDate: ${fmtDate(q.Date)}\nGrand Total: ${fmt(Number(q['Grand Total']) || 0)}\n\nThank you,\nAdora Coatings`
                window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
              }}
              title={q['Client Email'] ? `Email ${q['Client Email']}` : 'No email saved — you will be asked for one'}
              className="btn-outline-gold text-sm flex items-center gap-1.5"
            ><Mail size={13}/> Email</button>
            <button
              onClick={() => {
                const phone = q['Client Phone'] || window.prompt('Client phone number to WhatsApp:') || ''
                if (!phone) return
                const text = `Dear ${q['Client Name']}, please find your quotation from Adora Coatings.\n\nQuotation No: ${q['Quote No']}\nDate: ${fmtDate(q.Date)}\nGrand Total: ${fmt(Number(q['Grand Total']) || 0)}\n\nThank you,\nAdora Coatings`
                window.open(waLink(phone, text), '_blank')
              }}
              title={q['Client Phone'] ? `WhatsApp ${q['Client Phone']}` : 'No phone number saved — you will be asked for one'}
              className="btn-outline-gold text-sm flex items-center gap-1.5"
            ><MessageCircle size={13}/> WhatsApp</button>
            <button onClick={() => window.print()} className="btn-gold text-sm">Print</button>
            <button onClick={onClose} className="btn-outline-gold text-sm">Close</button>
          </div>
        </div>

        <div className="p-8 text-sm text-gray-800">
          <img src={`${import.meta.env.BASE_URL}adora-logo.png`} alt="Adora Coatings" className="h-16 mb-2" />
          <p className="text-xs text-gray-500 mb-4">GST NO: 29AHDPA4964B1ZN &nbsp;|&nbsp; 175/1, Pavilion Rd, Jaya Nagar 1st Block, Bengaluru 560011</p>

          {/* Boxed grid, matching the bordered layout of the source Excel sheet.
              Built entirely from <table> elements (not flex/grid) because Chrome's
              print engine treats flex/grid boxes as unbreakable — one that doesn't
              fit the remaining page gets pushed whole to the next page, leaving a
              large blank gap. Tables fragment across pages cleanly instead. */}
          <table className="w-full text-xs border-collapse mb-6">
            <tbody>
              <tr>
                <td className="border border-gray-400 p-2 align-top w-1/2">
                  <p><b>Quotation No:</b> {q['Quote No']}</p>
                  <p><b>Date:</b> {fmtDate(q.Date)}</p>
                  <p><b>Handled By:</b> {q['Handled By'] || '—'}</p>
                  <p><b>Enquired By / Reference:</b> {q['Enquired By'] || '—'}</p>
                </td>
                <td className="border border-gray-400 p-2 align-top w-1/2">
                  <p><b>Client Name:</b> {q['Client Name']}</p>
                  <p><b>Address:</b> {q['Client Address'] || '—'}</p>
                  <p><b>Phone:</b> {q['Client Phone'] || '—'}</p>
                  <p><b>Email:</b> {q['Client Email'] || '—'}</p>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="p-0">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-50">
                        {['SL','Particulars','Texture','Length','Height','Nos','Co-eff','Area (SFT)','Rate','Amount'].map(h => (
                          <th key={h} className="border-x border-gray-400 px-2 py-1.5 text-left">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((it, i) => (
                        <tr key={i}>
                          <td className="border-x border-gray-400 px-2 py-1.5">{i + 1}</td>
                          <td className="border-x border-gray-400 px-2 py-1.5">{it.particulars}</td>
                          <td className="border-x border-gray-400 px-2 py-1.5">{it.texture}</td>
                          <td className="border-x border-gray-400 px-2 py-1.5 text-right">{it.length || 0}</td>
                          <td className="border-x border-gray-400 px-2 py-1.5 text-right">{it.height || 0}</td>
                          <td className="border-x border-gray-400 px-2 py-1.5 text-right">{it.nos || 0}</td>
                          <td className="border-x border-gray-400 px-2 py-1.5 text-right">{it.coefficient || 0}</td>
                          <td className="border-x border-gray-400 px-2 py-1.5 text-right">{(it.area ?? area(it)).toLocaleString('en-IN')}</td>
                          <td className="border-x border-gray-400 px-2 py-1.5 text-right">{(it.rate || 0).toLocaleString('en-IN')}</td>
                          <td className="border-x border-gray-400 px-2 py-1.5 text-right">{fmt(it.amount ?? amount(it))}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="border-x border-b border-gray-400 p-0">
                  <table className="w-full text-xs border-collapse">
                    <tbody>
                      <tr><td className="px-2 py-1 text-right" colSpan={2}>Total &nbsp; {fmt(Number(q.Total) || 0)}</td></tr>
                      <tr><td className="px-2 py-1 text-right" colSpan={2}>GST Additional @ 18% &nbsp; {fmt(Number(q.GST) || 0)}</td></tr>
                      <tr><td className="px-2 py-1 text-right font-bold text-brand border-t border-gray-400" colSpan={2}>Grand Total &nbsp; {fmt(Number(q['Grand Total']) || 0)}</td></tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td colSpan={2} className="border-x border-b border-gray-400 p-2 bg-yellow-50">
                  <b>PLEASE NOTE:</b>
                  <ol className="mt-1 space-y-0.5">
                    <li>1. The validity of this quotation is 4 days.</li>
                    <li>2. Rates will vary as per the colour shade — exact rates shall be quoted once the colours are decided.</li>
                  </ol>
                </td>
              </tr>
              {q.Notes && (
                <tr>
                  <td colSpan={2} className="border-x border-b border-gray-400 p-2 whitespace-pre-line">
                    <b>NOTES / REMARKS:</b> {q.Notes}
                  </td>
                </tr>
              )}
              <tr>
                <td colSpan={2} className="border-x border-b border-gray-400 p-0">
                  <table className="w-full text-xs border-collapse">
                    <tbody>
                      <tr className="whitespace-pre-line">
                        <td className="p-2 align-top w-1/3"><b>BANK DETAILS:</b><br/>{BANK_DETAILS}</td>
                        <td className="p-2 align-top w-1/3 border-x border-gray-400"><b>ADDRESS:</b><br/>{COMPANY_ADDRESS}</td>
                        <td className="p-2 align-top w-1/3"><b>PAYMENT TERMS:</b><br/>{PAYMENT_TERMS}</td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          {isMicrolite ? (
            <>
              <h3 className="text-xs font-bold text-brand bg-gray-50 border border-gray-400 px-2 py-1.5 mb-4">Terms & Condition</h3>
              <div className="border border-gray-400 mb-4 p-2 text-xs text-gray-700">{MICROLITE_PREPARATION_INTRO}</div>
              <h3 className="text-xs font-bold text-brand bg-gray-50 border border-gray-400 px-2 py-1.5 mb-4">Preparation</h3>
              <Section title="1. Site Condition & Preparation" terms={MICROLITE_SITE_TERMS} />
              <Section title="2. Client Responsibilities" terms={MICROLITE_CLIENT_TERMS} />
              <h3 className="text-xs font-bold text-brand bg-gray-50 border border-gray-400 px-2 py-1.5 mb-4">A few things to know before you take the leap…</h3>
              <Section title="1. Material Shades & Nuances" terms={MICROLITE_SHADE_TERMS} />
              <Section title="2. Protection & Precaution" terms={MICROLITE_PROTECTION_TERMS} />
              <Section title="3. Workflow" terms={MICROLITE_WORKFLOW_TERMS} />
              <Section title="4. Commercials" terms={MICROLITE_COMMERCIAL_TERMS} />
            </>
          ) : (
            <>
              <Section title="Commercial Terms" terms={COMMERCIAL_TERMS} />
              <Section title="Execution & Logistic Terms & Conditions" terms={EXECUTION_TERMS} />
              <Section title="Important Terms & Conditions" terms={IMPORTANT_TERMS} />
              <Section title="Measurements — Terms & Condition" terms={MEASUREMENT_TERMS} />
            </>
          )}

          <div className="border border-gray-400 mb-6">
            <h3 className="text-xs font-bold text-brand bg-gray-50 px-2 py-1.5 border-b border-gray-400">Work Order</h3>
            <div className="text-xs p-3 space-y-2">
              <p><b>From:</b> Adora Coatings, 171/1 Pavilion Road, Jayanagar 1st Block, Bangalore-560011</p>
              <p><b>Dear {q['Client Name']},</b></p>
              {isMicrolite ? (
                <>
                  <p>We hereby appoint your company for MICROLITE Services as detailed below:</p>
                  <p><b>Project Name:</b> {q['Client Name']}<br/><b>Project Address:</b> {q['Client Address'] || '—'}</p>
                  <p><b>Services:</b> Ref Item Details table above &nbsp; <b>Fees:</b> {fmt(Number(q['Grand Total']) || 0)} (inclusive of GST), as per Quotation No. {q['Quote No']} dated {fmtDate(q.Date)}.</p>
                  <p>This letter of appointment together with the conditions of contract as stated above, shall govern the agreement.</p>
                </>
              ) : (
                <p>We hereby appoint Adora Coatings for the services detailed in the item table above, as per Quotation No. {q['Quote No']} dated {fmtDate(q.Date)}, for a total value of {fmt(Number(q['Grand Total']) || 0)} (inclusive of GST).</p>
              )}
              <p>Thanking you,<br/>Yours sincerely,</p>
            </div>
            <table className="w-full text-xs border-collapse border-t border-gray-400">
              <tbody>
                <tr>
                  <td className="border-r border-gray-400 p-3 text-center w-1/2">Signature: ADORA COATINGS<br/><br/>Date: _______________</td>
                  <td className="p-3 text-center w-1/2">Signature: CLIENT / CUSTOMER<br/><br/>Date: _______________</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('print-root')!
  )
}

function CreateQuotation({ existingQuotes, editing, onSaved, showToast }: { existingQuotes: QuoteRow[]; editing: (QuoteRow & { rowIndex: number }) | null; onSaved: () => void; showToast: (m: string) => void }) {
  const editingItems: Item[] = editing ? (() => { try { return JSON.parse(editing.Items || '[]') } catch { return [newItem(1)] } })() : [newItem(1)]

  const [quoteNo, setQuoteNo] = useState(() => editing ? editing['Quote No'] : nextQuoteNo(existingQuotes))
  const [date, setDate]     = useState(editing ? fmtDate(editing.Date) : today)
  const [clientName, setClientName] = useState(editing ? editing['Client Name'] : '')
  const [clientAddr, setClientAddr] = useState(editing ? editing['Client Address'] : 'Bangalore')
  const [clientPhone, setClientPhone] = useState(editing ? editing['Client Phone'] : '')
  const [clientEmail, setClientEmail] = useState(editing ? editing['Client Email'] : '')
  const [notes, setNotes] = useState(editing ? editing.Notes || '' : '')
  const [handledBy, setHandledBy]   = useState(editing ? editing['Handled By'] : '')
  const [enquiredBy, setEnquiredBy] = useState(editing ? editing['Enquired By'] : '')
  const [finishType, setFinishType] = useState<FinishType>((editing?.['Finish Type'] as FinishType) || 'ACRALIYC')
  const [items, setItems]   = useState<Item[]>(editingItems.length ? editingItems : [newItem(1)])
  const [nextId, setNextId] = useState(() => Math.max(0, ...editingItems.map(i => i.id)) + 1)
  const [saving, setSaving] = useState(false)

  const addRowItem = () => { setItems(p => [...p, newItem(nextId)]); setNextId(n => n + 1) }
  const removeItem = (id: number) => setItems(p => p.filter(i => i.id !== id))
  const updateItem = (id: number, field: keyof Item, value: string | number) => {
    setItems(p => p.map(it => {
      if (it.id !== id) return it
      // Typing Area directly overrides the geometric calc; typing Amount
      // directly overrides everything. Editing any of the dimension fields
      // (or Rate) drops the override for whichever value it would otherwise
      // feed, so the field goes back to being calculated.
      if (field === 'areaOverride')   return { ...it, areaOverride: value as number, amountOverride: undefined }
      if (field === 'amountOverride') return { ...it, amountOverride: value as number }
      if (field === 'rate')           return { ...it, rate: value as number, amountOverride: undefined }
      if (['length','height','nos','coefficient'].includes(field as string)) {
        return { ...it, [field]: value, areaOverride: undefined, amountOverride: undefined }
      }
      return { ...it, [field]: value }
    }))
  }

  const total      = items.reduce((s, i) => s + amount(i), 0)
  const gst        = Math.round(total * 18) / 100
  const grandTotal = total + gst

  const handleSave = async () => {
    if (!clientName) return
    setSaving(true)
    // No update-in-place API — editing deletes the old row then adds the new one.
    if (editing) {
      const delResult = await deleteRow('Quotations', editing.rowIndex)
      if (delResult?.status !== 'ok') {
        setSaving(false)
        showToast(`✗ Failed to update: ${delResult?.error || 'unknown error'}`)
        return
      }
    }
    const result = await addRow('Quotations', {
      'Quote No': quoteNo,
      Date: date,
      'Client Name': clientName,
      'Client Address': clientAddr,
      'Client Phone': clientPhone,
      'Client Email': clientEmail,
      'Handled By': handledBy,
      'Enquired By': enquiredBy,
      'Finish Type': finishType,
      Items: JSON.stringify(items.map(i => ({ ...i, area: area(i), amount: amount(i) }))),
      Total: total.toFixed(2),
      GST: gst.toFixed(2),
      'Grand Total': grandTotal.toFixed(2),
      Status: editing?.Status || 'In Progress',
      Notes: notes,
    })
    setSaving(false)
    if (result?.status === 'ok') { showToast(`✓ ${quoteNo} ${editing ? 'updated' : 'saved'} for ${clientName}`); onSaved() }
    else showToast(`✗ Failed to save: ${result?.error || 'unknown error'}`)
  }

  return (
    <div className="space-y-4">
      {editing && (
        <div className="bg-brand/5 border border-brand/20 rounded-lg px-3 py-2 text-xs text-brand font-medium">
          Editing quotation {editing['Quote No']} — changes will update this record.
        </div>
      )}
      <div className="card space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Quotation No</label>
            <input value={quoteNo} onChange={e => setQuoteNo(e.target.value)} className="input-dark font-mono" />
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
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Finish Type</label>
          <div className="flex gap-2">
            {FINISH_TYPES.map(t => (
              <button key={t} type="button" onClick={() => setFinishType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${finishType === t ? 'bg-brand text-white border-brand' : 'border-gray-200 text-gray-500'}`}>
                {t}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Controls which Terms & Conditions and Work Order wording print on this quotation.</p>
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
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Additional Notes / Remarks</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Anything specific to this quotation — prints on the Work Order below Please Note" className="input-dark w-full" />
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <p className="font-semibold text-gray-700 text-sm">Item Details</p>
          <p className="text-xs text-gray-400">Area = Length × Height × Nos × Co-efficient, but Area and Amount can also be typed directly</p>
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
                  <td className="px-2 py-2 w-24">
                    <input type="number" min={0} value={area(item)} onChange={e => updateItem(item.id,'areaOverride',+e.target.value)}
                      title="Only know the total area? Type it directly here instead of Length/Height/Nos/Co-efficient."
                      className={`w-24 border rounded-lg px-2 py-1.5 text-xs text-right focus:outline-none focus:border-brand ${item.areaOverride != null ? 'border-brand/50 bg-brand/5' : 'border-gray-200'}`} />
                  </td>
                  <td className="px-2 py-2 w-24">
                    <input type="number" min={0} value={item.rate} onChange={e => updateItem(item.id,'rate',+e.target.value)}
                      className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-xs text-right focus:outline-none focus:border-brand" />
                  </td>
                  <td className="px-2 py-2 w-28">
                    <input type="number" min={0} value={amount(item)} onChange={e => updateItem(item.id,'amountOverride',+e.target.value)}
                      title="Only know the final amount? Type it directly here instead of Rate."
                      className={`w-28 border rounded-lg px-2 py-1.5 text-xs text-right font-semibold focus:outline-none focus:border-brand ${item.amountOverride != null ? 'border-brand/50 bg-brand/5 text-brand' : 'border-gray-200 text-brand'}`} />
                  </td>
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
        <button onClick={() => { setItems([newItem(1)]); setNextId(2); setClientName(''); setClientPhone(''); setClientEmail(''); setNotes(''); setHandledBy(''); setEnquiredBy(''); setFinishType('ACRALIYC') }}
          className="btn-ghost text-sm">Clear</button>
        <button disabled={!clientName || saving} onClick={handleSave} className="btn-gold flex items-center gap-1.5 text-sm disabled:opacity-50">
          {saving ? 'Saving...' : editing ? 'Update Quotation' : 'Save Quotation → Sheet'}
        </button>
      </div>
    </div>
  )
}
