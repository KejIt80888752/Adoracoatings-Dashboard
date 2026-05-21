import { useState } from 'react'
import { Search, Package, Download } from 'lucide-react'

type Product = { id: number; name: string; hsn: string; category: string; price: number; unit: string }

const PRODUCTS: Product[] = [
  // CCTV
  { id:1,  name:'Hikvision IP 2MP Bullet Camera',        hsn:'85258020', category:'CCTV',              price:1650,  unit:'Nos' },
  { id:2,  name:'2MP Dome Camera',                       hsn:'85258020', category:'CCTV',              price:2300,  unit:'Nos' },
  { id:3,  name:'16 Channel NVR',                        hsn:'85219090', category:'CCTV',              price:5400,  unit:'Nos' },
  { id:4,  name:'CP Plus 16CH NVR UNR-4K2162-V2',        hsn:'85219090', category:'CCTV',              price:6150,  unit:'Nos' },
  { id:5,  name:'CP Plus 24PORT POE Switch',             hsn:'85176290', category:'CCTV',              price:6500,  unit:'Nos' },
  { id:6,  name:'4TB Hard Disc (WD)',                    hsn:'84717020', category:'CCTV',              price:6100,  unit:'Nos' },
  { id:7,  name:'CP Plus 8CH NVR UNR-108F1',             hsn:'85219090', category:'CCTV',              price:3250,  unit:'Nos' },
  { id:8,  name:'HIKvision 4port POE Switch',            hsn:'85176290', category:'CCTV',              price:2000,  unit:'Nos' },
  // Fire Extinguishers
  { id:9,  name:'1 KG ABC Fire Extinguisher',            hsn:'84241000', category:'Fire Extinguisher', price:480,   unit:'Nos' },
  { id:10, name:'2 KG ABC Fire Extinguisher',            hsn:'84241000', category:'Fire Extinguisher', price:550,   unit:'Nos' },
  { id:11, name:'4 KG ABC Fire Extinguisher',            hsn:'84241000', category:'Fire Extinguisher', price:750,   unit:'Nos' },
  { id:12, name:'6 KG ABC Fire Extinguisher',            hsn:'84241000', category:'Fire Extinguisher', price:850,   unit:'Nos' },
  { id:13, name:'9 KG ABC Fire Extinguisher',            hsn:'84241000', category:'Fire Extinguisher', price:1250,  unit:'Nos' },
  { id:14, name:'4.5 KG CO2 Fire Extinguisher',         hsn:'84241000', category:'Fire Extinguisher', price:3750,  unit:'Nos' },
  { id:15, name:'2 KG CO2 Fire Extinguisher',           hsn:'84241000', category:'Fire Extinguisher', price:2200,  unit:'Nos' },
  { id:16, name:'7 KG Clean Agent Extinguisher',        hsn:'84241000', category:'Fire Extinguisher', price:8200,  unit:'Nos' },
  // Sprinklers
  { id:17, name:'Concealed Pendant Sprinkler (68°C)',    hsn:'84248990', category:'Sprinklers',        price:940,   unit:'Nos' },
  { id:18, name:'Upright Sprinkler TYCO',               hsn:'84248990', category:'Sprinklers',        price:210,   unit:'Nos' },
  { id:19, name:'Adjustable Rossette Plate',            hsn:'84249000', category:'Sprinklers',        price:40,    unit:'Nos' },
  { id:20, name:'Rossette Cup',                         hsn:'83024190', category:'Sprinklers',        price:35,    unit:'Nos' },
  { id:21, name:'Monsher Flexible Dropper 1000MM',      hsn:'83071000', category:'Sprinklers',        price:560,   unit:'Nos' },
  { id:22, name:'Flexible Hose Unbraided 150MM',        hsn:'83071000', category:'Sprinklers',        price:650,   unit:'Nos' },
  // Alarm Systems
  { id:23, name:'Electronic Hooter',                    hsn:'8531',     category:'Alarm Systems',     price:650,   unit:'Nos' },
  { id:24, name:'12V 7AH Battery EXIDE',                hsn:'85072000', category:'Alarm Systems',     price:900,   unit:'Nos' },
  { id:25, name:'12V 7.5AH Battery',                    hsn:'85072000', category:'Alarm Systems',     price:990,   unit:'Nos' },
  { id:26, name:'RE-716 MR Manual Call Point',          hsn:'85319000', category:'Alarm Systems',     price:350,   unit:'Nos' },
  { id:27, name:'Hooter Cum Strobe',                    hsn:'85311020', category:'Alarm Systems',     price:650,   unit:'Nos' },
  { id:28, name:'MCP PLASTIC',                          hsn:'85139000', category:'Alarm Systems',     price:300,   unit:'Nos' },
  { id:29, name:'2 Zone Fire Alarm Panel',              hsn:'85312000', category:'Alarm Systems',     price:4200,  unit:'Nos' },
  // Fittings
  { id:30, name:'Double Door Hose Box (600X750X250)',   hsn:'7308',     category:'Fittings',          price:3300,  unit:'Nos' },
  { id:31, name:'65MM Butterfly Valve UL/FM Tyco',      hsn:'84818090', category:'Fittings',          price:16050, unit:'Nos' },
  { id:32, name:'50MM Butterfly Valve UL/FM Tyco',      hsn:'84818090', category:'Fittings',          price:16000, unit:'Nos' },
  { id:33, name:'Fire Blanket (2M x 2M)',               hsn:'70199000', category:'Fittings',          price:1450,  unit:'Nos' },
  { id:34, name:'GI U Bolt 65MM',                       hsn:'73181500', category:'Fittings',          price:28,    unit:'Nos' },
  { id:35, name:'Berger Signal Red Paint',              hsn:'32089090', category:'Fittings',          price:275,   unit:'Ltr' },
  // Signages
  { id:36, name:'Fire Exit LED Board',                  hsn:'94056090', category:'Signages',          price:2200,  unit:'Nos' },
  { id:37, name:'Fire Extinguisher Signage Triangle',   hsn:'83100000', category:'Signages',          price:125,   unit:'Nos' },
  { id:38, name:'Fire Order Board A2 Size',             hsn:'83100000', category:'Signages',          price:500,   unit:'Nos' },
  { id:39, name:'Exit Signage 12"x4" Photoluminescent', hsn:'83100000', category:'Signages',          price:180,   unit:'Nos' },
  { id:40, name:'First Aid Box With Content (Metallic)',hsn:'30065000', category:'Signages',          price:1600,  unit:'Nos' },
  // Pumps & Panel
  { id:41, name:'Kirloskar KDI 538+ 5HP Pumpset',      hsn:'84137000', category:'Pumps & Panel',     price:23729, unit:'Nos' },
  { id:42, name:'Kirloskar KDI 335++ 3HP Pumpset',     hsn:'84137000', category:'Pumps & Panel',     price:18644, unit:'Nos' },
]

const CATEGORIES = ['All', 'CCTV', 'Fire Extinguisher', 'Sprinklers', 'Alarm Systems', 'Fittings', 'Signages', 'Pumps & Panel']
const catBadge: Record<string, string> = {
  'CCTV': 'badge-blue', 'Fire Extinguisher': 'badge-red', 'Sprinklers': 'badge-blue',
  'Alarm Systems': 'badge-yellow', 'Fittings': 'badge-gray', 'Signages': 'badge-green', 'Pumps & Panel': 'badge-gold',
}

export default function Products() {
  const [search, setSearch]   = useState('')
  const [cat, setCat]         = useState('All')

  const filtered = PRODUCTS.filter(p =>
    (cat === 'All' || p.category === cat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.hsn.includes(search))
  )

  return (
    <div className="space-y-4">

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
                <th className="text-right">Purchase Price</th>
                <th>Unit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-gray-400">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  No products found
                </td></tr>
              )}
              {filtered.map((p, i) => (
                <tr key={p.id}>
                  <td className="text-gray-400 font-mono text-xs">{String(i+1).padStart(2,'0')}</td>
                  <td className="font-medium text-gray-700">{p.name}</td>
                  <td><span className={catBadge[p.category] ?? 'badge-gray'}>{p.category}</span></td>
                  <td className="font-mono text-xs text-gray-500">{p.hsn || '—'}</td>
                  <td className="text-right font-semibold text-brand">₹{p.price.toLocaleString('en-IN')}</td>
                  <td className="text-gray-500">{p.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
