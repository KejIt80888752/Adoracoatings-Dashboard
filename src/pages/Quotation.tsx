import { useState } from 'react'

const PROJECTS = [
  { sl:1,  name:'SKYLINE CITY TOWER',       date:'07-Sep-23', inv:'AFS/INV/2324/063', base:10180,    gst:1832.40,   total:12012.40,  pending:0.40   },
  { sl:2,  name:'LAMY STORE',               date:'22-Oct-23', inv:'AFS/PI/2324/30',   base:241492,   gst:43468.56,  total:284960.56, pending:-39.44 },
  { sl:3,  name:'G P SPORTS & INFRA',       date:'11-Sep-23', inv:'AFS/INV/2324/069', base:202300,   gst:36414,     total:238714,    pending:676    },
  { sl:4,  name:'STREAMLINE FITNESS',       date:'05-Sep-23', inv:'AFS/INV/2324/062', base:166964,   gst:30053.52,  total:197017.52, pending:-0.48  },
  { sl:5,  name:'SHUBHARAM COMPLEX',        date:'13-Nov-23', inv:'AFS/INV/2324/093', base:724223.5, gst:130360.23, total:854583.73, pending:-88689 },
  { sl:6,  name:'MALNAD ARCADE',            date:'04-Aug-23', inv:'AFS/INV/2324/052', base:26300,    gst:4734,      total:31034,     pending:0      },
  { sl:7,  name:'ARUN EDUFUN',              date:'21-Aug-23', inv:'AFS/QTN/2324/057', base:23340,    gst:4201.20,   total:27541.20,  pending:340    },
  { sl:8,  name:'ANANT CARS AUTO PVT LTD', date:'17-Aug-23', inv:'AFS/INV/2324/054', base:59299,    gst:10673.82,  total:69972.82,  pending:29.82  },
  { sl:9,  name:'ARYAN INTERIORS',          date:'31-Aug-23', inv:'AFS/INV/2324/058', base:19950,    gst:3591,      total:23541,     pending:117    },
  { sl:10, name:'ARYAN INTERIORS - TN',     date:'31-Aug-23', inv:'AFS/INV/2324/057', base:83065,    gst:14951.70,  total:98016.70,  pending:46.70  },
  { sl:11, name:'GODREJ GOLD COUNTY',       date:'11-Sep-23', inv:'AFS/INV/2324/065', base:18100,    gst:3258,      total:21358,     pending:181    },
  { sl:12, name:'SRIKAKULAM APARTMENT',     date:'12-Oct-23', inv:'AFS/PI/2324/27',   base:75181,    gst:13532.58,  total:88713.58,  pending:-17.42 },
  { sl:13, name:'SQUIRE HWFS',              date:'19-Oct-23', inv:'AFS/INV/2324/084', base:12980,    gst:2336.40,   total:15316.40,  pending:0.40   },
  { sl:14, name:'PURVA SKYWOOD',            date:'30-Oct-23', inv:'AFS/PI/2324/31',   base:55100,    gst:9918,      total:65018,     pending:0      },
  { sl:15, name:'PNG HEALTHCARE',           date:'03-Nov-23', inv:'AFS/INV/2324/089', base:10010,    gst:1801.80,   total:11811.80,  pending:0      },
  { sl:16, name:'YUKI PAN ASIAN',           date:'03-Nov-23', inv:'AFS/INV/2324/086', base:16300,    gst:2934,      total:19234,     pending:0      },
  { sl:17, name:'POWER PLUS ENTERPRISES',   date:'07-Nov-23', inv:'AFS/INV/2324/092', base:13100,    gst:2358,      total:15458,     pending:0      },
]

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

function getStatus(pending: number): { label: string; badge: string } {
  if (Math.abs(pending) < 1) return { label: 'Completed',   badge: 'badge-green'  }
  if (pending > 500)         return { label: 'Pending',     badge: 'badge-red'    }
  return                            { label: 'In Progress', badge: 'badge-yellow' }
}

export default function Quotation() {
  const [search, setSearch] = useState('')
  const filtered = PROJECTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.inv.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="section-title">Quotations</h1>
        <p className="section-sub">All project quotations for FY 2023-24</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-brand">17</div>
          <div className="text-xs text-gray-500 mt-1">Total Quotations</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-brand">₹20.74L</div>
          <div className="text-xs text-gray-500 mt-1">Total Value</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-green-600">12</div>
          <div className="text-xs text-gray-500 mt-1">Completed</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-yellow-600">5</div>
          <div className="text-xs text-gray-500 mt-1">Pending / In Progress</div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-700">Quotation List</h2>
          <input
            type="text"
            placeholder="Search project or quotation #…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-teal-300"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Sl</th><th>Project Name</th><th>Quotation #</th><th>Date</th>
                <th>Base Value</th><th>GST (18%)</th><th>Total Value</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const { label, badge } = getStatus(p.pending)
                return (
                  <tr key={p.sl}>
                    <td className="text-center text-gray-500">{p.sl}</td>
                    <td className="font-medium">{p.name}</td>
                    <td className="text-xs text-gray-500 font-mono">{p.inv}</td>
                    <td className="text-gray-500">{p.date}</td>
                    <td>{fmt(p.base)}</td>
                    <td className="text-gray-500">{fmt(p.gst)}</td>
                    <td className="font-semibold text-brand">{fmt(p.total)}</td>
                    <td><span className={badge}>{label}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-8">No quotations match your search.</p>
        )}
      </div>
    </div>
  )
}
