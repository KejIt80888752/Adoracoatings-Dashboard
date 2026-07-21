import { useState, useEffect, useCallback } from 'react'
import { Search, Warehouse, Package2, AlertCircle, Plus, X, CheckCheck, ArrowRight, RotateCcw, Truck, RefreshCw, Trash2 } from 'lucide-react'
import { addRow, fetchSheet, deleteRow } from '../lib/api'

type StockLogRow = { Product: string; Location: string; Qty: number | string; Notes?: string; 'Updated By'?: string; Date?: string }
type StockLogEntry = StockLogRow & { rowIndex: number }

type StockItem = {
  sl: number; name: string; unit: string; packSize: string
  godownQty: number; godownKg: number
  seaAirQty: number; seaAirKg: number
  dispatch: number; productReturn: number
}

const INITIAL_STOCK: StockItem[] = [
  { sl:1,  name:'STONEART',                   unit:'Kg',  packSize:'5 Kg',    godownQty:4,  godownKg:20,   seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:2,  name:'STONEART',                   unit:'Kg',  packSize:'20 Kg',   godownQty:1,  godownKg:20,   seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:3,  name:'KALAHARI',                   unit:'Ltr', packSize:'1 Ltr',   godownQty:8,  godownKg:8,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:4,  name:'OXYAGED',                    unit:'Ltr', packSize:'1 Ltr',   godownQty:0,  godownKg:0,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:5,  name:'OXYAGED FONDO',              unit:'Ltr', packSize:'1 Ltr',   godownQty:3,  godownKg:3,    seaAirQty:0,  seaAirKg:0,    dispatch:2, productReturn:0 },
  { sl:6,  name:'CERACAP CHIC',               unit:'Ltr', packSize:'1 Ltr',   godownQty:2,  godownKg:2,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:7,  name:'CERACAP CHIC NATURAL',       unit:'Ltr', packSize:'1 Ltr',   godownQty:6,  godownKg:6,    seaAirQty:0,  seaAirKg:0,    dispatch:1, productReturn:0 },
  { sl:8,  name:'CERACAP SILVER',             unit:'Ltr', packSize:'1 Ltr',   godownQty:6,  godownKg:6,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:9,  name:'CERACAP GOLD',               unit:'Ltr', packSize:'1 Ltr',   godownQty:5,  godownKg:5,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:10, name:'CALYPSO CHIC',               unit:'Ltr', packSize:'1 Ltr',   godownQty:0,  godownKg:0,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:11, name:'DAMASK',                     unit:'Ltr', packSize:'1 Ltr',   godownQty:6,  godownKg:6,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:12, name:'KIMERA',                     unit:'Ltr', packSize:'1 Ltr',   godownQty:0,  godownKg:0,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:13, name:'GEM',                        unit:'Ltr', packSize:'1 Ltr',   godownQty:2,  godownKg:2,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:14, name:'PEARL',                      unit:'Ltr', packSize:'1 Ltr',   godownQty:2,  godownKg:2,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:15, name:'LAND',                       unit:'Ltr', packSize:'1 Ltr',   godownQty:2,  godownKg:2,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:16, name:'DECOR PROTECTIVE',           unit:'Ltr', packSize:'1 Ltr',   godownQty:1,  godownKg:1,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:17, name:'CHARME VELVET',              unit:'Ltr', packSize:'1 Ltr',   godownQty:5,  godownKg:5,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:18, name:'ESSENTIA (SILVER)',          unit:'Ltr', packSize:'1 Ltr',   godownQty:6,  godownKg:6,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:19, name:'CERACAP CHIC NEUTRAL',       unit:'Ltr', packSize:'1 Ltr',   godownQty:0,  godownKg:0,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:20, name:'MAHARAJA (NEUTRO)',          unit:'Ltr', packSize:'1 Ltr',   godownQty:7,  godownKg:7,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:21, name:'MAHARAJA (ARGENTO)',         unit:'Ltr', packSize:'1 Ltr',   godownQty:8,  godownKg:8,    seaAirQty:6,  seaAirKg:6,    dispatch:0, productReturn:0 },
  { sl:22, name:'MAHARAJA (ORO)',             unit:'Ltr', packSize:'1 Ltr',   godownQty:8,  godownKg:8,    seaAirQty:6,  seaAirKg:6,    dispatch:0, productReturn:0 },
  { sl:23, name:'MAHARAJA (BLU)',             unit:'Ltr', packSize:'1 Ltr',   godownQty:5,  godownKg:5,    seaAirQty:4,  seaAirKg:4,    dispatch:0, productReturn:0 },
  { sl:24, name:'MAHARAJA (VERDE)',           unit:'Ltr', packSize:'1 Ltr',   godownQty:13, godownKg:13,   seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:25, name:'CERACAP (GOLD)',             unit:'Ltr', packSize:'1 Ltr',   godownQty:0,  godownKg:0,    seaAirQty:6,  seaAirKg:6,    dispatch:0, productReturn:0 },
  { sl:26, name:'CERACAP (SILVER)',           unit:'Ltr', packSize:'1 Ltr',   godownQty:0,  godownKg:0,    seaAirQty:6,  seaAirKg:6,    dispatch:0, productReturn:0 },
  { sl:27, name:'OXYAGED (ACTIVATOR)',        unit:'Ltr', packSize:'1 Ltr',   godownQty:2,  godownKg:2,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:28, name:'OXYAGED (FINITURA)',         unit:'Ltr', packSize:'1 Ltr',   godownQty:3,  godownKg:3,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:29, name:'OXYAGED (FONDO)',            unit:'Ltr', packSize:'1 Ltr',   godownQty:3,  godownKg:3,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:30, name:'MANIA (PERLA)',              unit:'Ltr', packSize:'1 Ltr',   godownQty:28, godownKg:28,   seaAirQty:0,  seaAirKg:0,    dispatch:5, productReturn:0 },
  { sl:31, name:'ATTIVATORE OXYAGED',         unit:'Ltr', packSize:'1 Ltr',   godownQty:2,  godownKg:2,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:32, name:'VENETIAN',                   unit:'Kg',  packSize:'20 Kg',   godownQty:2,  godownKg:40,   seaAirQty:1,  seaAirKg:20,   dispatch:0, productReturn:0 },
  { sl:33, name:'PUNTINATO',                  unit:'Kg',  packSize:'20 Kg',   godownQty:11, godownKg:220,  seaAirQty:0,  seaAirKg:0,    dispatch:3, productReturn:0 },
  { sl:34, name:'ATTIVATORE OXIDCAP',         unit:'ML',  packSize:'500 ML',  godownQty:4,  godownKg:2,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:35, name:'MINERAL SILVER',             unit:'Ltr', packSize:'4 Ltr',   godownQty:2,  godownKg:8,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:36, name:'MINERAL BRONZE',             unit:'Ltr', packSize:'1 Ltr',   godownQty:5,  godownKg:5,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:37, name:'OXIDCAP FONDO',              unit:'Ltr', packSize:'1 Ltr',   godownQty:2,  godownKg:2,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:38, name:'OXIDCAP FINITURE',           unit:'Ltr', packSize:'1 Ltr',   godownQty:3,  godownKg:3,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:39, name:'MANIA ZECCHINO GOLD',        unit:'Ltr', packSize:'1 Ltr',   godownQty:15, godownKg:15,   seaAirQty:0,  seaAirKg:0,    dispatch:2, productReturn:0 },
  { sl:40, name:'MICROLITE 500',              unit:'Kg',  packSize:'20 Kg',   godownQty:5,  godownKg:100,  seaAirQty:16, seaAirKg:320,  dispatch:0, productReturn:0 },
  { sl:41, name:'MICROLITE 100',              unit:'Kg',  packSize:'20 Kg',   godownQty:5,  godownKg:100,  seaAirQty:2,  seaAirKg:40,   dispatch:0, productReturn:0 },
  { sl:42, name:'MICROLITE 300',              unit:'Kg',  packSize:'1 Kg',    godownQty:4,  godownKg:4,    seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:43, name:'TECH COAT PRO OPACA',        unit:'Ltr', packSize:'4 Ltr',   godownQty:0,  godownKg:0,    seaAirQty:34, seaAirKg:34,   dispatch:0, productReturn:0 },
  { sl:44, name:'SILOMUR',                    unit:'Ltr', packSize:'5 Ltr',   godownQty:6,  godownKg:30,   seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:45, name:'SILVELATURA',                unit:'Ltr', packSize:'14 Ltr',  godownQty:3,  godownKg:42,   seaAirQty:6,  seaAirKg:84,   dispatch:0, productReturn:0 },
  { sl:46, name:'SILOXCAP',                   unit:'Kg',  packSize:'20 Kg',   godownQty:2,  godownKg:40,   seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:47, name:'MARMORINO',                  unit:'Kg',  packSize:'20 Kg',   godownQty:4,  godownKg:80,   seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:48, name:'GRASSELLO',                  unit:'Kg',  packSize:'20 Kg',   godownQty:1,  godownKg:20,   seaAirQty:17, seaAirKg:340,  dispatch:0, productReturn:0 },
  { sl:49, name:'CONCRETE CAP',               unit:'Kg',  packSize:'20 Kg',   godownQty:1,  godownKg:20,   seaAirQty:3,  seaAirKg:60,   dispatch:0, productReturn:0 },
  { sl:50, name:'MARMO VENEZIANO',            unit:'Kg',  packSize:'20 Kg',   godownQty:1,  godownKg:20,   seaAirQty:0,  seaAirKg:0,    dispatch:0, productReturn:0 },
  { sl:51, name:'TRAVERTINO',                 unit:'Kg',  packSize:'20 Kg',   godownQty:1,  godownKg:20,   seaAirQty:31, seaAirKg:620,  dispatch:0, productReturn:0 },
  { sl:52, name:'INDURITORE',                 unit:'ML',  packSize:'500 ML',  godownQty:0,  godownKg:0,    seaAirQty:8,  seaAirKg:4,    dispatch:0, productReturn:0 },
]

type Tab = 'stock' | 'addProduct' | 'dispatch' | 'return'

export default function Inventory() {
  const [stock, setStock]       = useState<StockItem[]>(INITIAL_STOCK)
  const [search, setSearch]     = useState('')
  const [filter, setFilter]     = useState<'all'|'godown'|'seaair'|'low'>('all')
  const [tab, setTab]           = useState<Tab>('stock')
  const [addModal, setAddModal] = useState(false)
  const [transferModal, setTransferModal] = useState<StockItem | null>(null)
  const [toast, setToast]       = useState('')
  const [saving, setSaving]     = useState(false)
  const [syncing, setSyncing]   = useState(false)
  const [lastSynced, setLastSynced] = useState('')
  const [logEntries, setLogEntries] = useState<StockLogEntry[]>([])
  const [deletingRow, setDeletingRow] = useState<number | null>(null)

  // Add stock form
  const [form, setForm]         = useState({ product:'', location:'Godown', qty:'', notes:'' })
  // New product form
  const [newProd, setNewProd]   = useState({ name:'', unit:'Ltr', packSize:'1 Ltr', category:'Wall Finishes' })
  // Dispatch form
  const [dispForm, setDispForm] = useState({ product:'', qty:'', project:'', date: new Date().toLocaleDateString('en-IN'), notes:'' })
  // Return form
  const [retForm, setRetForm]   = useState({ product:'', qty:'', reason:'', date: new Date().toLocaleDateString('en-IN'), notes:'' })
  // Transfer form
  const [transQty, setTransQty] = useState('')
  const [transDir, setTransDir] = useState<'godown-to-sea'|'sea-to-godown'>('godown-to-sea')

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3500) }

  // Pull stock movement history from the Google Sheet and replay it on top of
  // the physical-audit baseline (INITIAL_STOCK), so a page reload doesn't lose
  // any Add Stock / Dispatch / Return / Transfer actions logged since the audit.
  const syncFromSheet = useCallback(async (silent = false) => {
    setSyncing(true)
    const rows = await fetchSheet<StockLogRow>('Stock')
    if (rows.length > 0) {
      setStock(() => {
        const next = INITIAL_STOCK.map(s => ({ ...s }))
        for (const row of rows) {
          const item = next.find(s => s.name === row.Product)
          if (!item) continue
          const qty = Number(row.Qty) || 0
          if (row.Location === 'Godown')                    { item.godownQty += qty; item.godownKg += qty }
          else if (row.Location === 'Sea Air Logistics')     { item.seaAirQty += qty; item.seaAirKg += qty }
          else if (row.Location === 'Dispatch')              { item.dispatch += qty }
          else if (row.Location?.startsWith('Return'))       { item.productReturn += qty; item.godownQty += qty; item.godownKg += qty }
        }
        return next
      })
      // Row 1 in the sheet is the header, so data row i (0-based) sits at sheet row i+2.
      setLogEntries(rows.map((row, i) => ({ ...row, rowIndex: i + 2 })).reverse())
    } else {
      setLogEntries([])
    }
    setSyncing(false)
    setLastSynced(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }))
    if (!silent) showToast(rows.length > 0 ? `✓ Synced ${rows.length} entries from Google Sheet` : 'No Sheet data found — showing local stock')
  }, [])

  const handleDeleteEntry = async (entry: StockLogEntry) => {
    if (!confirm(`Delete this stock entry — "${entry.Product}" (${entry.Location}, ${entry.Qty})? This can't be undone.`)) return
    setDeletingRow(entry.rowIndex)
    const result = await deleteRow('Stock', entry.rowIndex)
    setDeletingRow(null)
    if (result?.status === 'ok') {
      showToast(`✓ Entry deleted`)
      syncFromSheet(true)
    } else {
      showToast(`✗ Failed to delete: ${result?.error || 'unknown error'}`)
    }
  }

  useEffect(() => { syncFromSheet(true) }, [syncFromSheet])

  const totalGodown = stock.reduce((a,s) => a + s.godownKg, 0)
  const totalSea    = stock.reduce((a,s) => a + s.seaAirKg, 0)
  const outOfStock  = stock.filter(s => s.godownKg + s.seaAirKg === 0).length
  const lowStock    = stock.filter(s => { const t = s.godownKg + s.seaAirKg; return t > 0 && t <= 5 }).length

  const filtered = stock.filter(s => {
    const m = s.name.toLowerCase().includes(search.toLowerCase())
    if (filter === 'godown')  return m && s.godownQty > 0
    if (filter === 'seaair')  return m && s.seaAirQty > 0
    if (filter === 'low')     return m && (s.godownKg + s.seaAirKg) <= 5
    return m
  })

  const handleAddStock = async () => {
    if (!form.product || !form.qty) return
    setSaving(true)
    const qty = Number(form.qty)
    setStock(prev => prev.map(s => {
      if (s.name !== form.product) return s
      if (form.location === 'Godown') return { ...s, godownQty: s.godownQty + qty, godownKg: s.godownKg + qty }
      return { ...s, seaAirQty: s.seaAirQty + qty, seaAirKg: s.seaAirKg + qty }
    }))
    await addRow('Stock', { Product: form.product, Location: form.location, Qty: form.qty, Notes: form.notes, 'Updated By': 'Dashboard', Date: new Date().toLocaleDateString('en-IN') })
    setSaving(false)
    showToast(`✓ ${form.product} — ${qty} units added to ${form.location}`)
    setAddModal(false)
    setForm({ product:'', location:'Godown', qty:'', notes:'' })
  }

  const handleTransfer = () => {
    if (!transferModal || !transQty) return
    const qty = Number(transQty)
    setStock(prev => prev.map(s => {
      if (s.sl !== transferModal.sl) return s
      if (transDir === 'godown-to-sea') return { ...s, godownQty: s.godownQty - qty, godownKg: s.godownKg - qty, seaAirQty: s.seaAirQty + qty, seaAirKg: s.seaAirKg + qty }
      return { ...s, seaAirQty: s.seaAirQty - qty, seaAirKg: s.seaAirKg - qty, godownQty: s.godownQty + qty, godownKg: s.godownKg + qty }
    }))
    showToast(`✓ ${qty} units transferred — ${transDir === 'godown-to-sea' ? 'Godown → Sea Air' : 'Sea Air → Godown'}`)
    setTransferModal(null); setTransQty('')
  }

  const handleDispatch = async () => {
    if (!dispForm.product || !dispForm.qty) return
    setSaving(true)
    const qty = Number(dispForm.qty)
    setStock(prev => prev.map(s => s.name === dispForm.product ? { ...s, dispatch: s.dispatch + qty } : s))
    await addRow('Stock', { Product: dispForm.product, Location: 'Dispatch', Qty: dispForm.qty, Notes: `Project: ${dispForm.project} | ${dispForm.notes}`, 'Updated By': 'Dashboard', Date: dispForm.date })
    setSaving(false)
    showToast(`✓ ${dispForm.product} — ${qty} units dispatched`)
    setDispForm({ product:'', qty:'', project:'', date: new Date().toLocaleDateString('en-IN'), notes:'' })
  }

  const handleReturn = async () => {
    if (!retForm.product || !retForm.qty) return
    setSaving(true)
    const qty = Number(retForm.qty)
    setStock(prev => prev.map(s => s.name === retForm.product ? { ...s, productReturn: s.productReturn + qty, godownQty: s.godownQty + qty, godownKg: s.godownKg + qty } : s))
    await addRow('Stock', { Product: retForm.product, Location: 'Return→Godown', Qty: retForm.qty, Notes: `Reason: ${retForm.reason} | ${retForm.notes}`, 'Updated By': 'Dashboard', Date: retForm.date })
    setSaving(false)
    showToast(`✓ ${retForm.product} — ${qty} units returned to Godown`)
    setRetForm({ product:'', qty:'', reason:'', date: new Date().toLocaleDateString('en-IN'), notes:'' })
  }

  const STATUS = (s: StockItem) => {
    const t = s.godownKg + s.seaAirKg
    if (t === 0) return { label:'Out of Stock', cls:'badge-red' }
    if (t <= 5)  return { label:'Low Stock',    cls:'badge-yellow' }
    return               { label:'In Stock',    cls:'badge-green' }
  }

  return (
    <div className="space-y-4">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-[9999] bg-brand text-white text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCheck size={15}/>{toast}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total Products', val: stock.length,  icon: Warehouse,  border:'border-brand'   },
          { label:'Godown Stock',   val:`${totalGodown.toFixed(0)} kg/L`, icon: Package2, border:'border-blue-500'  },
          { label:'Sea Air Stock',  val:`${totalSea.toFixed(0)} kg/L`,    icon: Package2, border:'border-purple-500'},
          { label:'Out of Stock',   val: outOfStock,    icon: AlertCircle,border:'border-red-500'  },
        ].map(k => (
          <div key={k.label} className={`card border-l-4 ${k.border}`}>
            <div className="flex items-center gap-3">
              <k.icon size={18} className={k.border.replace('border-','text-')} />
              <div><p className="text-xl font-bold" style={{color:'var(--text-1)'}}>{k.val}</p><p className="text-xs" style={{color:'var(--text-4)'}}>{k.label}</p></div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="card !p-0 overflow-hidden">
        <div className="flex border-b overflow-x-auto" style={{borderColor:'var(--border-2)'}}>
          {([
            { id:'stock',      label:'Stock Overview',  icon: Warehouse  },
            { id:'addProduct', label:'Add Product',     icon: Plus       },
            { id:'dispatch',   label:'Dispatch',        icon: Truck      },
            { id:'return',     label:'Product Return',  icon: RotateCcw  },
          ] as const).map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors shrink-0 ${
                tab === t.id ? 'border-brand text-brand' : 'border-transparent'
              }`} style={{color: tab === t.id ? '#4a7c1f' : 'var(--text-3)'}}>
              <t.icon size={14}/>{t.label}
            </button>
          ))}
        </div>

        {/* ── STOCK OVERVIEW ── */}
        {tab === 'stock' && (
          <div className="p-4 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:'var(--text-4)'}} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search product…" className="input-dark pl-9 w-full" />
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {([['all','All'],['godown','Godown'],['seaair','Sea Air'],['low',`Low (${lowStock})`]] as const).map(([id,label]) => (
                  <button key={id} onClick={() => setFilter(id)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium border transition-all ${filter===id?'bg-brand text-white border-brand':'border-gray-200 hover:border-brand/40'}`}
                    style={{color: filter===id ? 'white' : 'var(--text-3)', borderColor: filter===id ? '#4a7c1f' : 'var(--border-2)'}}>
                    {label}
                  </button>
                ))}
              </div>
              <button onClick={() => syncFromSheet()} disabled={syncing}
                className="text-xs px-3 py-1.5 rounded-lg font-medium border flex items-center gap-1.5 shrink-0 disabled:opacity-50"
                style={{color:'var(--text-3)', borderColor:'var(--border-2)'}} title="Re-fetch stock movements from Google Sheet">
                <RefreshCw size={12} className={syncing ? 'animate-spin' : ''}/>
                {syncing ? 'Syncing…' : lastSynced ? `Synced ${lastSynced}` : 'Sync'}
              </button>
              <button onClick={() => setAddModal(true)} className="btn-gold flex items-center gap-1.5 text-xs shrink-0">
                <Plus size={13}/> Add Stock
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border" style={{borderColor:'var(--border-2)'}}>
              <table className="tbl w-full">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Name</th>
                    <th>Pack Size</th>
                    <th className="text-center" style={{background:'rgba(139,92,246,0.06)'}}>Sea Air Qty</th>
                    <th className="text-center" style={{background:'rgba(139,92,246,0.06)'}}>Sea Air Kg/L</th>
                    <th className="text-center" style={{background:'rgba(59,130,246,0.06)'}}>Godown Qty</th>
                    <th className="text-center" style={{background:'rgba(59,130,246,0.06)'}}>Godown Kg/L</th>
                    <th className="text-center" style={{background:'rgba(239,68,68,0.06)'}}>Dispatch</th>
                    <th className="text-center" style={{background:'rgba(16,185,129,0.06)'}}>Product Return</th>
                    <th className="text-center font-bold">Total Kg/L</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Transfer</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => {
                    const total = s.godownKg + s.seaAirKg
                    const st = STATUS(s)
                    return (
                      <tr key={s.sl}>
                        <td className="text-center text-xs" style={{color:'var(--text-4)'}}>{String(s.sl).padStart(2,'0')}</td>
                        <td><span className="font-medium" style={{color:'var(--text-1)'}}>{s.name}</span></td>
                        <td className="text-xs font-mono" style={{color:'var(--text-3)'}}>{s.packSize}</td>
                        <td className="text-center font-semibold text-purple-600">{s.seaAirQty || '—'}</td>
                        <td className="text-center text-purple-500 text-sm">{s.seaAirKg || '—'}</td>
                        <td className="text-center font-semibold text-blue-600">{s.godownQty || '—'}</td>
                        <td className="text-center text-blue-500 text-sm">{s.godownKg || '—'}</td>
                        <td className="text-center">{s.dispatch > 0 ? <span className="text-red-500 font-semibold">{s.dispatch}</span> : <span style={{color:'var(--text-4)'}}>—</span>}</td>
                        <td className="text-center">{s.productReturn > 0 ? <span className="text-green-500 font-semibold">{s.productReturn}</span> : <span style={{color:'var(--text-4)'}}>—</span>}</td>
                        <td className="text-center font-bold text-brand">{total || '0'}</td>
                        <td className="text-center"><span className={`badge ${st.cls}`}>{st.label}</span></td>
                        <td className="text-center">
                          <button onClick={() => { setTransferModal(s); setTransDir('godown-to-sea') }}
                            className="p-1.5 rounded-lg transition-colors hover:bg-brand-50 text-brand" title="Transfer between locations">
                            <ArrowRight size={13}/>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Recent Stock Entries — movement log, with delete for mistakes */}
            <div>
              <p className="text-sm font-semibold mb-2" style={{color:'var(--text-1)'}}>Recent Stock Entries</p>
              <div className="overflow-x-auto rounded-xl border" style={{borderColor:'var(--border-2)'}}>
                <table className="tbl w-full">
                  <thead>
                    <tr>
                      <th>Product</th><th>Location</th><th className="text-center">Qty</th>
                      <th>Notes</th><th>Date</th><th className="text-center">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logEntries.length === 0 && (
                      <tr><td colSpan={6} className="text-center py-6" style={{color:'var(--text-4)'}}>No stock entries yet</td></tr>
                    )}
                    {logEntries.slice(0, 20).map(entry => (
                      <tr key={entry.rowIndex}>
                        <td className="font-medium" style={{color:'var(--text-1)'}}>{entry.Product}</td>
                        <td className="text-xs" style={{color:'var(--text-3)'}}>{entry.Location}</td>
                        <td className="text-center">{entry.Qty}</td>
                        <td className="text-xs" style={{color:'var(--text-4)'}}>{entry.Notes || '—'}</td>
                        <td className="text-xs" style={{color:'var(--text-4)'}}>{entry.Date}</td>
                        <td className="text-center">
                          <button onClick={() => handleDeleteEntry(entry)} disabled={deletingRow === entry.rowIndex}
                            className="p-1.5 rounded-lg transition-colors hover:bg-red-50 text-red-500 disabled:opacity-40" title="Delete this entry">
                            <Trash2 size={13}/>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── ADD PRODUCT ── */}
        {tab === 'addProduct' && (
          <div className="p-6 max-w-lg space-y-4">
            <div><p className="text-sm font-semibold mb-1" style={{color:'var(--text-1)'}}>Add New Product to Catalog</p>
              <p className="text-xs" style={{color:'var(--text-4)'}}>New product will be added to the Products page and Stock list</p></div>
            <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Product Name *</label>
              <input className="input-dark" placeholder="e.g. MANIA (AZZURRO)" value={newProd.name} onChange={e=>setNewProd(p=>({...p,name:e.target.value}))}/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Unit</label>
                <select className="input-dark" value={newProd.unit} onChange={e=>setNewProd(p=>({...p,unit:e.target.value}))}>
                  <option>Ltr</option><option>Kg</option><option>ML</option><option>LTR</option>
                </select></div>
              <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Pack Size</label>
                <input className="input-dark" placeholder="e.g. 1 Ltr" value={newProd.packSize} onChange={e=>setNewProd(p=>({...p,packSize:e.target.value}))}/></div>
            </div>
            <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Category</label>
              <select className="input-dark" value={newProd.category} onChange={e=>setNewProd(p=>({...p,category:e.target.value}))}>
                {['Wall Finishes','Plasters & Stucco','Concrete & Microcement','Protective Coats','Oxidised Effects','Colour Pigments','Additives'].map(c=><option key={c}>{c}</option>)}
              </select></div>
            <button disabled={!newProd.name}
              onClick={() => {
                if (!newProd.name) return
                setStock(prev => [...prev, { sl: prev.length+1, name: newProd.name, unit: newProd.unit, packSize: newProd.packSize, godownQty:0, godownKg:0, seaAirQty:0, seaAirKg:0, dispatch:0, productReturn:0 }])
                showToast(`✓ "${newProd.name}" added to catalog!`)
                setNewProd({ name:'', unit:'Ltr', packSize:'1 Ltr', category:'Wall Finishes' })
              }}
              className="btn-gold w-full py-2.5 disabled:opacity-50">
              <Plus size={14} className="inline mr-1.5"/>Add Product to Catalog
            </button>
          </div>
        )}

        {/* ── DISPATCH ── */}
        {tab === 'dispatch' && (
          <div className="p-6 max-w-lg space-y-4">
            <div><p className="text-sm font-semibold mb-1" style={{color:'var(--text-1)'}}>Dispatch Product to Site</p>
              <p className="text-xs" style={{color:'var(--text-4)'}}>Record product dispatched from Godown to project site</p></div>
            <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Product *</label>
              <select className="input-dark" value={dispForm.product} onChange={e=>setDispForm(f=>({...f,product:e.target.value}))}>
                <option value="">— Select Product —</option>
                {stock.filter(s=>s.godownQty>0).map(s=><option key={s.sl} value={s.name}>{s.name} (Godown: {s.godownQty} units)</option>)}
              </select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Quantity *</label>
                <input type="number" min="1" className="input-dark" placeholder="No. of units"
                  value={dispForm.qty} onChange={e=>setDispForm(f=>({...f,qty:e.target.value}))}/></div>
              <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Dispatch Date</label>
                <input type="text" className="input-dark" value={dispForm.date} onChange={e=>setDispForm(f=>({...f,date:e.target.value}))}/></div>
            </div>
            <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Project / Site</label>
              <input className="input-dark" placeholder="e.g. SRIKURUNJI INFRASTRUCTURE" value={dispForm.project} onChange={e=>setDispForm(f=>({...f,project:e.target.value}))}/></div>
            <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Notes</label>
              <input className="input-dark" placeholder="Optional" value={dispForm.notes} onChange={e=>setDispForm(f=>({...f,notes:e.target.value}))}/></div>
            <button disabled={!dispForm.product || !dispForm.qty || saving} onClick={handleDispatch}
              className="btn-gold w-full py-2.5 disabled:opacity-50 flex items-center justify-center gap-2">
              <Truck size={14}/>{saving ? 'Saving...' : 'Record Dispatch → Sheet'}
            </button>
          </div>
        )}

        {/* ── PRODUCT RETURN ── */}
        {tab === 'return' && (
          <div className="p-6 max-w-lg space-y-4">
            <div><p className="text-sm font-semibold mb-1" style={{color:'var(--text-1)'}}>Product Return to Godown</p>
              <p className="text-xs" style={{color:'var(--text-4)'}}>Record products returned from site back to Godown</p></div>
            <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Product *</label>
              <select className="input-dark" value={retForm.product} onChange={e=>setRetForm(f=>({...f,product:e.target.value}))}>
                <option value="">— Select Product —</option>
                {stock.map(s=><option key={s.sl} value={s.name}>{s.name}</option>)}
              </select></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Quantity *</label>
                <input type="number" min="1" className="input-dark" placeholder="No. of units"
                  value={retForm.qty} onChange={e=>setRetForm(f=>({...f,qty:e.target.value}))}/></div>
              <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Return Date</label>
                <input type="text" className="input-dark" value={retForm.date} onChange={e=>setRetForm(f=>({...f,date:e.target.value}))}/></div>
            </div>
            <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Reason</label>
              <select className="input-dark" value={retForm.reason} onChange={e=>setRetForm(f=>({...f,reason:e.target.value}))}>
                <option value="">Select reason</option>
                <option>Project Cancelled</option><option>Excess Material</option><option>Wrong Product</option><option>Quality Issue</option><option>Other</option>
              </select></div>
            <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Notes</label>
              <input className="input-dark" placeholder="Optional" value={retForm.notes} onChange={e=>setRetForm(f=>({...f,notes:e.target.value}))}/></div>
            <button disabled={!retForm.product || !retForm.qty || saving} onClick={handleReturn}
              className="btn-gold w-full py-2.5 disabled:opacity-50 flex items-center justify-center gap-2">
              <RotateCcw size={14}/>{saving ? 'Saving...' : 'Record Return → Sheet'}
            </button>
          </div>
        )}
      </div>

      {/* Add Stock Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setAddModal(false)}>
          <div className="rounded-2xl w-full max-w-md shadow-2xl" style={{background:'var(--bg-card)'}} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4" style={{borderBottom:'1px solid var(--border-2)'}}>
              <h2 className="font-semibold" style={{color:'var(--text-1)'}}>Add Stock Entry</h2>
              <button onClick={() => setAddModal(false)} style={{color:'var(--text-4)'}}><X size={18}/></button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Product *</label>
                <select className="input-dark" value={form.product} onChange={e=>setForm(f=>({...f,product:e.target.value}))}>
                  <option value="">— Select —</option>
                  {stock.map(s=><option key={s.sl} value={s.name}>{s.name} ({s.packSize})</option>)}
                </select></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Location</label>
                  <select className="input-dark" value={form.location} onChange={e=>setForm(f=>({...f,location:e.target.value}))}>
                    <option>Godown</option><option>Sea Air Logistics</option>
                  </select></div>
                <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Quantity *</label>
                  <input type="number" min="1" className="input-dark" placeholder="e.g. 5"
                    value={form.qty} onChange={e=>setForm(f=>({...f,qty:e.target.value}))}/></div>
              </div>
              <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Notes</label>
                <input className="input-dark" placeholder="Optional" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))}/></div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setAddModal(false)} className="flex-1 btn-outline-gold text-sm">Cancel</button>
              <button onClick={handleAddStock} disabled={!form.product || !form.qty || saving}
                className="flex-1 btn-gold text-sm disabled:opacity-50">
                {saving ? 'Saving...' : '+ Add Stock'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transfer Modal */}
      {transferModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setTransferModal(null)}>
          <div className="rounded-2xl w-full max-w-sm shadow-2xl" style={{background:'var(--bg-card)'}} onClick={e=>e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4" style={{borderBottom:'1px solid var(--border-2)'}}>
              <h2 className="font-semibold text-sm" style={{color:'var(--text-1)'}}>Transfer Stock</h2>
              <button onClick={() => setTransferModal(null)} style={{color:'var(--text-4)'}}><X size={16}/></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="p-3 rounded-xl text-sm font-medium" style={{background:'var(--bg-card2)', color:'var(--text-1)'}}>
                {transferModal.name} — {transferModal.packSize}
              </div>
              <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Direction</label>
                <div className="grid grid-cols-2 gap-2">
                  {([['godown-to-sea', 'Godown → Sea Air'],['sea-to-godown','Sea Air → Godown']] as const).map(([v,l]) => (
                    <button key={v} onClick={() => setTransDir(v)}
                      className={`text-xs py-2 px-3 rounded-lg border font-medium transition-all ${transDir===v?'bg-brand text-white border-brand':'border-gray-200'}`}
                      style={{color: transDir===v?'white':'var(--text-2)', borderColor: transDir===v?'#4a7c1f':'var(--border-2)'}}>
                      {l}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] mt-2" style={{color:'var(--text-4)'}}>
                  Available: {transDir==='godown-to-sea' ? `${transferModal.godownQty} units in Godown` : `${transferModal.seaAirQty} units in Sea Air`}
                </p>
              </div>
              <div><label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{color:'var(--text-3)'}}>Quantity</label>
                <input type="number" min="1" className="input-dark" placeholder="Units to transfer"
                  value={transQty} onChange={e=>setTransQty(e.target.value)}/></div>
            </div>
            <div className="px-5 pb-5 flex gap-2">
              <button onClick={() => setTransferModal(null)} className="flex-1 btn-outline-gold text-sm">Cancel</button>
              <button onClick={handleTransfer} disabled={!transQty}
                className="flex-1 btn-gold text-sm disabled:opacity-50 flex items-center justify-center gap-1.5">
                <ArrowRight size={13}/>Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
