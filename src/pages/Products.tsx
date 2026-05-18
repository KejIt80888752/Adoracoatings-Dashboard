import { useState } from 'react'
import { Search, Plus, Filter, Edit2, Trash2, Package, AlertTriangle, Download } from 'lucide-react'

const ITEMS = [
  { id:1,  name:'Metallic Silver Finish',    cat:'Metallic Wall Finishes',    sku:'MWF-001', stock:280, unit:'Kg',    price:1200, min:30, status:'In Stock'     },
  { id:2,  name:'Metallic Copper Finish',    cat:'Metallic Wall Finishes',    sku:'MWF-002', stock:195, unit:'Kg',    price:1350, min:30, status:'In Stock'     },
  { id:3,  name:'Metallic Gold Finish',      cat:'Metallic Wall Finishes',    sku:'MWF-003', stock:9,   unit:'Kg',    price:1500, min:20, status:'Low Stock'    },
  { id:4,  name:'Moroccan Classic',          cat:'Moroccan Wall Finishes',    sku:'MCN-001', stock:320, unit:'Kg',    price:980,  min:40, status:'In Stock'     },
  { id:5,  name:'Moroccan Desert Sand',      cat:'Moroccan Wall Finishes',    sku:'MCN-002', stock:215, unit:'Kg',    price:1050, min:40, status:'In Stock'     },
  { id:6,  name:'Greek Lime Plaster',        cat:'Greek Lime Plaster',        sku:'GLP-001', stock:0,   unit:'Kg',    price:760,  min:25, status:'Out of Stock' },
  { id:7,  name:'Designer Marble Flooring',  cat:'Designer Flooring',         sku:'DF-001',  stock:148, unit:'Sq.m',  price:2200, min:20, status:'In Stock'     },
  { id:8,  name:'Micro Cement Flooring',     cat:'Designer Flooring',         sku:'DF-002',  stock:92,  unit:'Sq.m',  price:1800, min:15, status:'In Stock'     },
  { id:9,  name:'Venetian Plaster',          cat:'Decorative Wall Finishes',  sku:'DWF-001', stock:260, unit:'Kg',    price:890,  min:30, status:'In Stock'     },
  { id:10, name:'Rustic Stone Effect',       cat:'Decorative Wall Finishes',  sku:'DWF-002', stock:18,  unit:'Kg',    price:720,  min:25, status:'Low Stock'    },
  { id:11, name:'Exterior Smooth Coat',      cat:'Exterior Finishes',         sku:'EF-001',  stock:410, unit:'Litre', price:420,  min:50, status:'In Stock'     },
  { id:12, name:'Exterior Texture Coat',     cat:'Exterior Finishes',         sku:'EF-002',  stock:280, unit:'Litre', price:480,  min:50, status:'In Stock'     },
  { id:13, name:'Floor Hardener',            cat:'Floor Finishes',            sku:'FF-001',  stock:75,  unit:'Kg',    price:640,  min:20, status:'In Stock'     },
  { id:14, name:'Anti-Skid Floor Coat',      cat:'Floor Finishes',            sku:'FF-002',  stock:0,   unit:'Kg',    price:590,  min:15, status:'Out of Stock' },
]

const CATS = ['All', 'Metallic Wall Finishes', 'Moroccan Wall Finishes', 'Greek Lime Plaster', 'Designer Flooring', 'Decorative Wall Finishes', 'Exterior Finishes', 'Floor Finishes']

const sColor = (s: string) => s === 'In Stock' ? 'badge-green' : s === 'Low Stock' ? 'badge-yellow' : 'badge-red'

export default function Products() {
  const [search, setSearch] = useState('')
  const [cat, setCat]       = useState('All')
  const [modal, setModal]   = useState(false)

  const list = ITEMS.filter(p =>
    (cat === 'All' || p.cat === cat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase()))
  )

  const totals = {
    total: ITEMS.length,
    inStock: ITEMS.filter(p => p.status === 'In Stock').length,
    low:     ITEMS.filter(p => p.status === 'Low Stock').length,
    out:     ITEMS.filter(p => p.status === 'Out of Stock').length,
  }

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label:'Total SKUs',    val: totals.total,   accent:'border-brand-gold' },
          { label:'In Stock',      val: totals.inStock, accent:'border-blue-500'   },
          { label:'Low Stock',     val: totals.low,     accent:'border-yellow-500' },
          { label:'Out of Stock',  val: totals.out,     accent:'border-red-500'    },
        ].map(c => (
          <div key={c.label} className={`card border-l-4 ${c.accent}`}>
            <p className="text-2xl font-bold text-white">{c.val}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="card">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2 items-center">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products or SKU..." className="input-dark pl-9 w-64" />
            </div>
            <div className="ml-auto flex gap-2">
              <button className="btn-outline-gold flex items-center gap-1.5"><Download size={13} />Export</button>
              <button onClick={() => setModal(true)} className="btn-gold flex items-center gap-1.5"><Plus size={13} />Add Product</button>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Filter size={13} className="text-gray-600" />
            {CATS.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${cat === c ? 'bg-brand-gold text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full tbl">
            <thead>
              <tr>
                {['#','Product','SKU','Category','Stock','Unit','Price (₹)','Status','Actions'].map(h => <th key={h}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {list.map((p, i) => (
                <tr key={p.id}>
                  <td className="text-gray-600 text-xs">{i+1}</td>
                  <td className="font-medium text-gray-100">
                    <div className="flex items-center gap-2">
                      {p.status === 'Low Stock'    && <AlertTriangle size={12} className="text-yellow-500 shrink-0" />}
                      {p.status === 'Out of Stock' && <Package size={12} className="text-red-400 shrink-0" />}
                      {p.name}
                    </div>
                  </td>
                  <td><span className="font-mono text-xs text-gray-500">{p.sku}</span></td>
                  <td className="text-gray-400 text-xs">{p.cat}</td>
                  <td className="font-semibold text-white">{p.stock}</td>
                  <td className="text-gray-500">{p.unit}</td>
                  <td className="text-brand-gold font-medium">₹{p.price.toLocaleString()}</td>
                  <td><span className={sColor(p.status)}>{p.status}</span></td>
                  <td>
                    <div className="flex gap-1">
                      <button className="p-1.5 text-gray-600 hover:text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors"><Edit2 size={13} /></button>
                      <button className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!list.length && (
            <div className="text-center py-12 text-gray-600">
              <Package size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-brand-card border border-brand-border rounded-2xl w-full max-w-md p-6">
            <h2 className="font-display text-xl font-semibold text-white mb-5">Add New Product</h2>
            <div className="space-y-4">
              {['Product Name','SKU','Category','Stock Qty','Unit','Price (₹)'].map(f => (
                <div key={f}>
                  <label className="block text-xs text-gray-500 mb-1.5 uppercase tracking-wider">{f}</label>
                  <input className="input-dark" placeholder={`Enter ${f.toLowerCase()}`} />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModal(false)} className="flex-1 btn-outline-gold">Cancel</button>
              <button className="flex-1 btn-gold">Add Product</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
