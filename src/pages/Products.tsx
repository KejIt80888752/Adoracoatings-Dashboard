import { useState } from 'react'
import { Search, Package, Download } from 'lucide-react'

type Product = { id: number; name: string; unit: string; packSize: string; category: string }

const PRODUCTS: Product[] = []

const CATEGORIES = ['All', 'Wall Finishes', 'Plasters & Stucco', 'Concrete & Microcement', 'Protective Coats', 'Oxidised Effects', 'Colour Pigments', 'Additives']

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

  const filtered = PRODUCTS.filter(p =>
    (cat === 'All' || p.category === cat) &&
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-4">

      {/* Category Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2">
        {CATEGORIES.slice(1).map(c => {
          const count = PRODUCTS.filter(p => p.category === c).length
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
          <button onClick={() => {
            const csv = 'Sl,Product,Category,Pack Size,Unit,GST\n' + filtered.map((p,i) => `${i+1},"${p.name}","${p.category}","${p.packSize}","${p.unit}","18%"`).join('\n')
            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv],{type:'text/csv'})); a.download = 'adora-products.csv'; a.click()
          }} className="btn-gold flex items-center gap-1.5 text-xs shrink-0">
            <Download size={13} /> Export
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">{filtered.length} of {PRODUCTS.length} products</p>
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
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />No products found
                </td></tr>
              )}
              {filtered.map((p, i) => (
                <tr key={p.id}>
                  <td className="text-gray-400 font-mono text-xs text-center">{String(i+1).padStart(2,'0')}</td>
                  <td className="font-medium text-gray-800">{p.name}</td>
                  <td><span className={catBadge[p.category] ?? 'badge-gray'}>{p.category}</span></td>
                  <td className="text-gray-500 text-xs font-mono">{p.packSize}</td>
                  <td className="text-gray-500">{p.unit}</td>
                  <td className="text-right">
                    <span className="text-[11px] text-yellow-600 font-medium bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-200">Rate Pending</span>
                  </td>
                  <td className="text-center text-gray-400 text-xs">18%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
