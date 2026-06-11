import { useState } from 'react'
import { Search, Package, Download } from 'lucide-react'

type Product = { id: number; name: string; hsn: string; category: string; price: number; unit: string; gst: number }

const PRODUCTS: Product[] = [
  // Wall Finishes
  { id:1,  name:'Metallic Wall Finish — Premium',        hsn:'32081090', category:'Wall Finishes',    price:185,  unit:'Sqft', gst:18 },
  { id:2,  name:'Metallic Wall Finish — Classic',        hsn:'32081090', category:'Wall Finishes',    price:145,  unit:'Sqft', gst:18 },
  { id:3,  name:'Moroccan Wall Finish',                  hsn:'32081090', category:'Wall Finishes',    price:220,  unit:'Sqft', gst:18 },
  { id:4,  name:'Greek Lime Plaster',                    hsn:'32089090', category:'Wall Finishes',    price:195,  unit:'Sqft', gst:18 },
  { id:5,  name:'Venetian Plaster Finish',               hsn:'32089090', category:'Wall Finishes',    price:250,  unit:'Sqft', gst:18 },
  { id:6,  name:'Silk Plaster Coating',                  hsn:'32089090', category:'Wall Finishes',    price:175,  unit:'Sqft', gst:18 },
  { id:7,  name:'Custom Acoustics Texture Coating',      hsn:'32081090', category:'Wall Finishes',    price:165,  unit:'Sqft', gst:18 },
  { id:8,  name:'Microcement Wall Finish',               hsn:'32089090', category:'Wall Finishes',    price:210,  unit:'Sqft', gst:18 },
  // Metallic Textures
  { id:9,  name:'Metallic Texture — Gold (per litre)',   hsn:'32081090', category:'Metallic Textures',price:850,  unit:'Ltr',  gst:18 },
  { id:10, name:'Metallic Texture — Silver (per litre)', hsn:'32081090', category:'Metallic Textures',price:820,  unit:'Ltr',  gst:18 },
  { id:11, name:'Metallic Texture — Copper (per litre)', hsn:'32081090', category:'Metallic Textures',price:800,  unit:'Ltr',  gst:18 },
  { id:12, name:'Metallic Texture — Bronze (per litre)', hsn:'32081090', category:'Metallic Textures',price:810,  unit:'Ltr',  gst:18 },
  { id:13, name:'Metallic Texture — Pearl (per litre)',  hsn:'32081090', category:'Metallic Textures',price:890,  unit:'Ltr',  gst:18 },
  // Floor Finishes
  { id:14, name:'Microcement Floor Finish',              hsn:'32089090', category:'Floor Finishes',   price:280,  unit:'Sqft', gst:18 },
  { id:15, name:'Epoxy Floor Coating',                   hsn:'32082090', category:'Floor Finishes',   price:145,  unit:'Sqft', gst:18 },
  { id:16, name:'Decorative Concrete Finish',            hsn:'32089090', category:'Floor Finishes',   price:195,  unit:'Sqft', gst:18 },
  { id:17, name:'Designer Flooring — Premium',           hsn:'32089090', category:'Floor Finishes',   price:320,  unit:'Sqft', gst:18 },
  { id:18, name:'Polished Concrete Floor',               hsn:'32089090', category:'Floor Finishes',   price:240,  unit:'Sqft', gst:18 },
  // Exterior Finishes
  { id:19, name:'Exterior Texture Coating',              hsn:'32100090', category:'Exterior Finishes',price:95,   unit:'Sqft', gst:18 },
  { id:20, name:'Weather Shield Coating',                hsn:'32100090', category:'Exterior Finishes',price:85,   unit:'Sqft', gst:18 },
  { id:21, name:'Sand Texture Finish',                   hsn:'32100090', category:'Exterior Finishes',price:75,   unit:'Sqft', gst:18 },
  { id:22, name:'Stone Texture Coating',                 hsn:'32100090', category:'Exterior Finishes',price:110,  unit:'Sqft', gst:18 },
  { id:23, name:'Acrylic Exterior Finish',               hsn:'32100090', category:'Exterior Finishes',price:65,   unit:'Sqft', gst:18 },
  // Primers & Base Coats
  { id:24, name:'Adora Base Coat — Interior',            hsn:'32081090', category:'Primers & Sealers',price:380,  unit:'Ltr',  gst:18 },
  { id:25, name:'Adora Base Coat — Exterior',            hsn:'32100090', category:'Primers & Sealers',price:350,  unit:'Ltr',  gst:18 },
  { id:26, name:'Wall Sealer — Premium',                 hsn:'32082090', category:'Primers & Sealers',price:420,  unit:'Ltr',  gst:18 },
  { id:27, name:'Anti-Fungal Primer',                    hsn:'32082090', category:'Primers & Sealers',price:460,  unit:'Ltr',  gst:18 },
  { id:28, name:'Protective Top Coat — Gloss',           hsn:'32081090', category:'Primers & Sealers',price:680,  unit:'Ltr',  gst:18 },
  { id:29, name:'Protective Top Coat — Matte',           hsn:'32081090', category:'Primers & Sealers',price:660,  unit:'Ltr',  gst:18 },
  // Specialty Finishes
  { id:30, name:'Bespoke Designer Finish — Custom',      hsn:'32089090', category:'Specialty',        price:350,  unit:'Sqft', gst:18 },
  { id:31, name:'Aged Plaster Finish',                   hsn:'32089090', category:'Specialty',        price:230,  unit:'Sqft', gst:18 },
  { id:32, name:'Lace Texture Finish',                   hsn:'32089090', category:'Specialty',        price:200,  unit:'Sqft', gst:18 },
  { id:33, name:'Travertine Wall Finish',                hsn:'32089090', category:'Specialty',        price:270,  unit:'Sqft', gst:18 },
  { id:34, name:'Suede Effect Coating',                  hsn:'32089090', category:'Specialty',        price:190,  unit:'Sqft', gst:18 },
]

const CATEGORIES = ['All', 'Wall Finishes', 'Metallic Textures', 'Floor Finishes', 'Exterior Finishes', 'Primers & Sealers', 'Specialty']

const catBadge: Record<string, string> = {
  'Wall Finishes':     'badge-blue',
  'Metallic Textures': 'badge-gold',
  'Floor Finishes':    'badge-green',
  'Exterior Finishes': 'badge-yellow',
  'Primers & Sealers': 'badge-gray',
  'Specialty':         'badge-red',
}

export default function Products() {
  const [search, setSearch] = useState('')
  const [cat, setCat]       = useState('All')

  const filtered = PRODUCTS.filter(p =>
    (cat === 'All' || p.category === cat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.hsn.includes(search))
  )

  return (
    <div className="space-y-4">

      {/* Category Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {CATEGORIES.slice(1).map(c => {
          const count = PRODUCTS.filter(p => p.category === c).length
          return (
            <button key={c} onClick={() => setCat(cat === c ? 'All' : c)}
              className={`card-sm text-left transition-all hover:border-brand/40 ${cat === c ? 'border-brand bg-brand/5' : ''}`}>
              <p className="text-xs text-gray-400 font-medium truncate">{c}</p>
              <p className={`text-lg font-bold mt-0.5 ${cat === c ? 'text-brand' : 'text-gray-700'}`}>{count}</p>
              <p className="text-[10px] text-gray-400">products</p>
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
              placeholder="Search products or HSN code…"
              className="input-dark pl-9 w-full" />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all border ${
                  cat === c ? 'bg-brand text-white border-brand' : 'border-gray-200 text-gray-500 hover:border-brand/40 hover:text-brand'
                }`}>{c}</button>
            ))}
          </div>
          <button className="btn-gold flex items-center gap-1.5 text-xs shrink-0">
            <Download size={13} /> Export
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">{filtered.length} of {PRODUCTS.length} products</p>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead>
              <tr>
                <th className="w-10">#</th>
                <th>Product Name</th>
                <th>Category</th>
                <th>HSN Code</th>
                <th className="text-right">Rate</th>
                <th>Unit</th>
                <th className="text-center">GST %</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  No products found
                </td></tr>
              )}
              {filtered.map((p, i) => (
                <tr key={p.id}>
                  <td className="text-gray-400 font-mono text-xs">{String(i+1).padStart(2,'0')}</td>
                  <td className="font-medium text-gray-700">{p.name}</td>
                  <td><span className={catBadge[p.category] ?? 'badge-gray'}>{p.category}</span></td>
                  <td className="font-mono text-xs text-gray-500">{p.hsn}</td>
                  <td className="text-right font-semibold text-brand">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="text-gray-500">{p.unit}</td>
                  <td className="text-center text-gray-500">{p.gst}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
