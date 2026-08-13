import { useState, useEffect } from 'react'
import { Search, Package, Download, Plus, Trash2, CheckCheck, X, Pencil } from 'lucide-react'
import { fetchSheet, addRow, deleteRow } from '../lib/api'

type ProductRow = { Name: string; Category: string; 'Pack Size': string; Unit: string; Rate: string; GST: string }
type Product = ProductRow & { rowIndex: number }

const CATEGORIES = ['All', 'Wall Finishes', 'Plasters & Stucco', 'Concrete & Microcement', 'Protective Coats', 'Oxidised Effects', 'Colour Pigments', 'Additives']
const FORM_CATEGORIES = CATEGORIES.slice(1)
const UNITS = ['Kg', 'Ltr', 'Nos', 'Sqft', 'Set', 'Box', 'Roll']

const fmtGst = (v: string) => {
  if (!v) return '18%'
  const n = Number(v)
  if (Number.isNaN(n)) return v
  return `${n < 1 ? Math.round(n * 100) : Math.round(n)}%`
}

const catBadge: Record<string, string> = {
  'Wall Finishes':          'badge-gold',
  'Plasters & Stucco':      'badge-blue',
  'Concrete & Microcement': 'badge-gray',
  'Protective Coats':       'badge-green',
  'Oxidised Effects':       'badge-red',
  'Colour Pigments':        'badge-yellow',
  'Additives':              'badge-gray',
}

export default function Products() {
  const [search, setSearch] = useState('')
  const [cat, setCat]       = useState('All')
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading]   = useState(false)
  const [showAdd, setShowAdd]   = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deletingRow, setDeletingRow] = useState<number | null>(null)
  const [toast, setToast]   = useState('')

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000) }

  const load = () => {
    setLoading(true)
    fetchSheet<ProductRow>('Products').then(rows => {
      setProducts(rows.map((r, i) => ({ ...r, rowIndex: i + 2 })))
    }).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (p: Product) => {
    if (!confirm(`Delete "${p.Name}"? This can't be undone.`)) return
    setDeletingRow(p.rowIndex)
    const result = await deleteRow('Products', p.rowIndex)
    setDeletingRow(null)
    if (result?.status === 'ok') { showToast(`✓ "${p.Name}" deleted`); load() }
    else showToast(`✗ Failed to delete: ${result?.error || 'unknown error'}`)
  }

  const filtered = products.filter(p =>
    (cat === 'All' || p.Category === cat) &&
    (p.Name || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">

      {/* Category Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
        {FORM_CATEGORIES.map(c => {
          const count = products.filter(p => p.Category === c).length
          return (
            <button key={c} onClick={() => setCat(cat === c ? 'All' : c)}
              className={`card-sm text-left transition-all hover:border-brand/40 ${cat === c ? 'border-brand bg-brand/5' : ''}`}>
              <p className="text-[10px] text-gray-400 font-medium leading-tight">{c}</p>
              <p className={`text-lg font-bold mt-1 ${cat === c ? 'text-brand' : 'text-gray-700'}`}>{count}</p>
            </button>
          )
        })}
      </div>

      {/* Toolbar */}
      <div className="card p-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search product name…"
              className="input-dark pl-9 w-full" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-all border ${
                  cat === c ? 'bg-brand text-white border-brand' : 'border-gray-200 text-gray-500 hover:border-brand/40 hover:text-brand'
                }`}>{c}</button>
            ))}
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => setShowAdd(true)} className="btn-gold flex items-center gap-1.5 text-xs">
              <Plus size={13} /> Add Product
            </button>
            <button onClick={() => {
              const csv = 'Sl,Product,Category,Pack Size,Unit,Rate,GST\n' + filtered.map((p,i) => `${i+1},"${p.Name}","${p.Category}","${p['Pack Size']}","${p.Unit}","${p.Rate || ''}","${fmtGst(p.GST)}"`).join('\n')
              const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download = 'adora-products.csv'; a.click()
            }} className="btn-outline-gold flex items-center gap-1.5 text-xs">
              <Download size={13} /> Export
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">{filtered.length} of {products.length} products</p>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-auto max-h-[65vh]">
          <table className="tbl w-full">
            <thead>
              <tr>
                <th className="w-10">#</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>Pack Size</th>
                <th>Unit</th>
                <th className="text-right">Rate</th>
                <th className="text-center">GST</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400">Loading…</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center py-10 text-gray-400">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />No products found
                </td></tr>
              )}
              {!loading && filtered.map((p, i) => (
                <tr key={p.rowIndex}>
                  <td className="text-gray-400 font-mono text-xs text-center">{String(i+1).padStart(2,'0')}</td>
                  <td className="font-medium text-gray-800">{p.Name}</td>
                  <td><span className={catBadge[p.Category] ?? 'badge-gray'}>{p.Category}</span></td>
                  <td className="text-gray-500 text-xs font-mono">{p['Pack Size']}</td>
                  <td className="text-gray-500">{p.Unit}</td>
                  <td className="text-right">
                    {p.Rate ? (
                      <span className="font-medium text-gray-700">₹{Number(p.Rate).toLocaleString('en-IN')}</span>
                    ) : (
                      <span className="text-[11px] text-yellow-600 font-medium bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">Rate Pending</span>
                    )}
                  </td>
                  <td className="text-center text-gray-400 text-xs">{fmtGst(p.GST)}</td>
                  <td>
                    <button onClick={() => setEditProduct(p)}
                      className="p-1.5 rounded-lg transition-colors hover:bg-brand/10 text-brand" title="Edit product">
                      <Pencil size={13}/>
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(p)} disabled={deletingRow === p.rowIndex}
                      className="p-1.5 rounded-lg transition-colors hover:bg-red-50 text-red-500 disabled:opacity-40" title="Delete product">
                      <Trash2 size={13}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAdd && <AddProductModal onClose={() => setShowAdd(false)} onAdded={() => { setShowAdd(false); load() }} showToast={showToast} />}
      {editProduct && (
        <AddProductModal
          editing={editProduct}
          onClose={() => setEditProduct(null)}
          onAdded={() => { setEditProduct(null); load() }}
          showToast={showToast}
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

function AddProductModal({ editing, onClose, onAdded, showToast }: { editing?: Product; onClose: () => void; onAdded: () => void; showToast: (m: string) => void }) {
  const [name, setName]         = useState(editing?.Name ?? '')
  const [category, setCategory] = useState(editing?.Category ?? FORM_CATEGORIES[0])
  const [packSize, setPackSize] = useState(editing?.['Pack Size'] ?? '')
  const [unit, setUnit]         = useState(editing?.Unit ?? 'Kg')
  const [rate, setRate]         = useState(editing?.Rate ?? '')
  const [gst, setGst]           = useState(editing ? `${fmtGst(editing.GST)}` : '18%')
  const [saving, setSaving]     = useState(false)

  const handleSave = async () => {
    if (!name) return
    setSaving(true)
    // No update-in-place API — editing deletes the old row then adds the new one.
    if (editing) {
      const delResult = await deleteRow('Products', editing.rowIndex)
      if (delResult?.status !== 'ok') {
        setSaving(false)
        showToast(`✗ Failed to update: ${delResult?.error || 'unknown error'}`)
        return
      }
    }
    const result = await addRow('Products', {
      Name: name,
      Category: category,
      'Pack Size': packSize,
      Unit: unit,
      Rate: rate,
      GST: gst,
    })
    setSaving(false)
    if (result?.status === 'ok') { showToast(`✓ "${name}" ${editing ? 'updated' : 'added'}`); onAdded() }
    else showToast(`✗ Failed to save: ${result?.error || 'unknown error'}`)
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{editing ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18}/></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Product Name <span className="text-red-500">*</span></label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mania Pearla" className="input-dark" autoFocus />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input-dark">
              {FORM_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Pack Size</label>
              <input value={packSize} onChange={e => setPackSize(e.target.value)} placeholder="e.g. 20 Kg" className="input-dark" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Unit</label>
              <select value={unit} onChange={e => setUnit(e.target.value)} className="input-dark">
                {UNITS.map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Rate (₹)</label>
              <input type="number" min={0} value={rate} onChange={e => setRate(e.target.value)} placeholder="Leave blank if pending" className="input-dark" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">GST</label>
              <select value={gst} onChange={e => setGst(e.target.value)} className="input-dark">
                {['0%','5%','12%','18%','28%'].map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="btn-ghost text-sm">Cancel</button>
          <button disabled={!name || saving} onClick={handleSave} className="btn-gold text-sm disabled:opacity-50">
            {saving ? 'Saving...' : editing ? 'Save Changes' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  )
}
