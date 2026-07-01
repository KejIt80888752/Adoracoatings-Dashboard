import { useState } from 'react'
import { Search, Package, Download, AlertTriangle } from 'lucide-react'

type Product = { id: number; name: string; unit: string; packSize: string; category: string }

const PRODUCTS: Product[] = [
  // ── Wall Finishes — Ceracap Series ──────────────────────────────
  { id:1,  name:'CERACAP CHIC',               unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:2,  name:'CERACAP CHIC NATURAL',        unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:3,  name:'CERACAP CHIC NEUTRAL',        unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:4,  name:'CERACAP GOLD',                unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:5,  name:'CERACAP SILVER',              unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:6,  name:'CERACAP (GOLD)',              unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:7,  name:'CERACAP (SILVER)',            unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  // ── Wall Finishes — Mania Series ────────────────────────────────
  { id:8,  name:'MANIA (PERLA)',               unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:9,  name:'MANIA (PERLA)',               unit:'Ltr', packSize:'2.5 Ltr',  category:'Wall Finishes'      },
  { id:10, name:'MANIA GOLD',                  unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:11, name:'MANIA GOLD',                  unit:'Ltr', packSize:'2.5 Ltr',  category:'Wall Finishes'      },
  { id:12, name:'MANIA WHITE',                 unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:13, name:'MANIA WHITE',                 unit:'Ltr', packSize:'2.5 Ltr',  category:'Wall Finishes'      },
  // ── Wall Finishes — Maharaja Series ─────────────────────────────
  { id:14, name:'MAHARAJA (ARGENTO)',          unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:15, name:'MAHARAJA (BLU)',              unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:16, name:'MAHARAJA (NEUTRO)',           unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:17, name:'MAHARAJA (ORO)',              unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:18, name:'MAHARAJA (VERDE)',            unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  // ── Wall Finishes — Mineral Series ──────────────────────────────
  { id:19, name:'MINERAL BRONZE',             unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:20, name:'MINERAL BRONZE',             unit:'Ltr', packSize:'2.5 Ltr',  category:'Wall Finishes'      },
  { id:21, name:'MINERAL SILVER',             unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:22, name:'MINERAL SILVER',             unit:'Ltr', packSize:'2.5 Ltr',  category:'Wall Finishes'      },
  // ── Wall Finishes — Other ────────────────────────────────────────
  { id:23, name:'CALYPSO CHIC',               unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:24, name:'CALIPSO CHIC ZECCHINO GOLD', unit:'Ltr', packSize:'0.75 Ltr', category:'Wall Finishes'      },
  { id:25, name:'CHARME VELVET',              unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:26, name:'CHARME VELVET',              unit:'Ltr', packSize:'2.5 Ltr',  category:'Wall Finishes'      },
  { id:27, name:'DAMASK',                      unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:28, name:'DAMASK',                      unit:'Ltr', packSize:'2.5 Ltr',  category:'Wall Finishes'      },
  { id:29, name:'ESSENTIA (SILVER)',           unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:30, name:'ESSENTIA (SILVER)',           unit:'Ltr', packSize:'2.5 Ltr',  category:'Wall Finishes'      },
  { id:31, name:'GEM',                         unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:32, name:'GEM',                         unit:'Ltr', packSize:'2.5 Ltr',  category:'Wall Finishes'      },
  { id:33, name:'KALAHARI',                    unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:34, name:'KIMERA',                      unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:35, name:'KIMERA',                      unit:'Ltr', packSize:'2.5 Ltr',  category:'Wall Finishes'      },
  { id:36, name:'LAND',                        unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:37, name:'LAND',                        unit:'Ltr', packSize:'2.5 Ltr',  category:'Wall Finishes'      },
  { id:38, name:'PEARL',                       unit:'Ltr', packSize:'1 Ltr',    category:'Wall Finishes'      },
  { id:39, name:'PEARL',                       unit:'Ltr', packSize:'2.5 Ltr',  category:'Wall Finishes'      },
  { id:40, name:'POWERCAP ZECCHINO GOLD',      unit:'ML',  packSize:'750 ML',   category:'Wall Finishes'      },
  // ── Plasters & Stucco ───────────────────────────────────────────
  { id:41, name:'GRASSELLO',                   unit:'Kg',  packSize:'20 Kg',    category:'Plasters & Stucco'  },
  { id:42, name:'MARMORINO',                   unit:'Kg',  packSize:'20 Kg',    category:'Plasters & Stucco'  },
  { id:43, name:'MARMO VENEZIANO',             unit:'Kg',  packSize:'20 Kg',    category:'Plasters & Stucco'  },
  { id:44, name:'VENETIAN',                    unit:'Kg',  packSize:'20 Kg',    category:'Plasters & Stucco'  },
  { id:45, name:'DECOR STUCCO',               unit:'Kg',  packSize:'20 Kg',    category:'Plasters & Stucco'  },
  { id:46, name:'TRAVERTINO',                  unit:'Kg',  packSize:'20 Kg',    category:'Plasters & Stucco'  },
  { id:47, name:'PUNTINATO',                   unit:'Kg',  packSize:'20 Kg',    category:'Plasters & Stucco'  },
  // ── Concrete & Micro Cement ─────────────────────────────────────
  { id:48, name:'MICROLITE 100',               unit:'Kg',  packSize:'20 Kg',    category:'Concrete & Microcement' },
  { id:49, name:'MICROLITE 300',               unit:'Kg',  packSize:'20 Kg',    category:'Concrete & Microcement' },
  { id:50, name:'MICROLITE 500',               unit:'Kg',  packSize:'20 Kg',    category:'Concrete & Microcement' },
  { id:51, name:'CONCRETE CAP',                unit:'Kg',  packSize:'25 Kg',    category:'Concrete & Microcement' },
  { id:52, name:'STONEART',                    unit:'Kg',  packSize:'5 Kg',     category:'Concrete & Microcement' },
  { id:53, name:'STONEART',                    unit:'Kg',  packSize:'20 Kg',    category:'Concrete & Microcement' },
  // ── Protective & Top Coats ──────────────────────────────────────
  { id:54, name:'DECOR PROTECTIVE',           unit:'Ltr', packSize:'1 Ltr',    category:'Protective Coats'   },
  { id:55, name:'TECH COAT PRO LUCIDA',       unit:'Ltr', packSize:'4 Ltr',    category:'Protective Coats'   },
  { id:56, name:'TECH COAT PRO OPACA',        unit:'Ltr', packSize:'4 Ltr',    category:'Protective Coats'   },
  { id:57, name:'SILVELATURA',                unit:'Ltr', packSize:'14 Ltr',   category:'Protective Coats'   },
  { id:58, name:'SILOMUR',                    unit:'Ltr', packSize:'5 Ltr',    category:'Protective Coats'   },
  { id:59, name:'SILOXCAP',                   unit:'Kg',  packSize:'20 Kg',    category:'Protective Coats'   },
  // ── Oxidised Effects ────────────────────────────────────────────
  { id:60, name:'OXYAGED',                    unit:'Ltr', packSize:'1 Ltr',    category:'Oxidised Effects'   },
  { id:61, name:'OXYAGED (ACTIVATOR)',         unit:'Ltr', packSize:'1 Ltr',    category:'Oxidised Effects'   },
  { id:62, name:'OXYAGED (FINITURA)',          unit:'Ltr', packSize:'1 Ltr',    category:'Oxidised Effects'   },
  { id:63, name:'OXYAGED (FONDO)',             unit:'Ltr', packSize:'1 Ltr',    category:'Oxidised Effects'   },
  { id:64, name:'OXIDCAP FONDO',              unit:'Ltr', packSize:'1 Ltr',    category:'Oxidised Effects'   },
  { id:65, name:'OXIDCAP FINITURE',           unit:'Ltr', packSize:'1 Ltr',    category:'Oxidised Effects'   },
  { id:66, name:'ATTIVATORE OXYAGED',         unit:'Ltr', packSize:'1 Ltr',    category:'Oxidised Effects'   },
  { id:67, name:'ATTIVATORE OXIDCAP',         unit:'ML',  packSize:'500 ML',   category:'Oxidised Effects'   },
  // ── Colour Pigments ─────────────────────────────────────────────
  { id:68, name:'COLOURS NO 1',               unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:69, name:'COLOURS NO 2',               unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:70, name:'COLOURS NO 3',               unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:71, name:'COLOURS NO 4',               unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:72, name:'COLOURS NO 5',               unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:73, name:'COLOURS NO 6',               unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:74, name:'COLOURS NO 7',               unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:75, name:'COLOURS NO 8',               unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:76, name:'COLOURS NO 9',               unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:77, name:'COLOURS NO 10',              unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:78, name:'COLOURS NO 11',              unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:79, name:'COLOURS NO 12',              unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:80, name:'COLOURS NO 13',              unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:81, name:'COLOURS NO 14',              unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:82, name:'COLOURS NO 15',              unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  { id:83, name:'COLOURS NO 16',              unit:'Ltr', packSize:'1 Ltr',    category:'Colour Pigments'    },
  // ── Additives ───────────────────────────────────────────────────
  { id:84, name:'INDURITORE',                 unit:'ML',  packSize:'500 ML',   category:'Additives'          },
]

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

      {/* Pending Banner */}
      <div className="flex items-start gap-3 p-4 rounded-xl border border-yellow-200 bg-yellow-50">
        <AlertTriangle size={17} className="text-yellow-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-yellow-800">Rate Card Pending</p>
          <p className="text-xs text-yellow-700 mt-0.5">
            All 84 real products added from client's product list. Awaiting rates from Ashutosh sir — will be updated once received.
          </p>
        </div>
      </div>

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
        <div className="overflow-x-auto">
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
