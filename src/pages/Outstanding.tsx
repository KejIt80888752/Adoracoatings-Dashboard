import { useState } from 'react'

const PROJECTS = [
  { sl:1,  name:'SKYLINE CITY TOWER',       inv:'AFS/INV/2324/063', total:12012.40,  rcvd:12012,    pending:0.40   },
  { sl:2,  name:'LAMY STORE',               inv:'AFS/PI/2324/30',   total:284960.56, rcvd:285000,   pending:-39.44 },
  { sl:3,  name:'G P SPORTS & INFRA',       inv:'AFS/INV/2324/069', total:238714,    rcvd:238038,   pending:676    },
  { sl:4,  name:'STREAMLINE FITNESS',       inv:'AFS/INV/2324/062', total:197017.52, rcvd:197018,   pending:-0.48  },
  { sl:5,  name:'SHUBHARAM COMPLEX',        inv:'AFS/INV/2324/093', total:854583.73, rcvd:943273,   pending:-88689 },
  { sl:6,  name:'MALNAD ARCADE',            inv:'AFS/INV/2324/052', total:31034,     rcvd:31034,    pending:0      },
  { sl:7,  name:'ARUN EDUFUN',              inv:'AFS/QTN/2324/057', total:27541.20,  rcvd:23000,    pending:340    },
  { sl:8,  name:'ANANT CARS AUTO PVT LTD', inv:'AFS/INV/2324/054', total:69972.82,  rcvd:69943,    pending:29.82  },
  { sl:9,  name:'ARYAN INTERIORS',          inv:'AFS/INV/2324/058', total:23541,     rcvd:23424,    pending:117    },
  { sl:10, name:'ARYAN INTERIORS - TN',     inv:'AFS/INV/2324/057', total:98016.70,  rcvd:97970,    pending:46.70  },
  { sl:11, name:'GODREJ GOLD COUNTY',       inv:'AFS/INV/2324/065', total:21358,     rcvd:21177,    pending:181    },
  { sl:12, name:'SRIKAKULAM APARTMENT',     inv:'AFS/PI/2324/27',   total:88713.58,  rcvd:88731,    pending:-17.42 },
  { sl:13, name:'SQUIRE HWFS',              inv:'AFS/INV/2324/084', total:15316.40,  rcvd:15316,    pending:0.40   },
  { sl:14, name:'PURVA SKYWOOD',            inv:'AFS/PI/2324/31',   total:65018,     rcvd:65018,    pending:0      },
  { sl:15, name:'PNG HEALTHCARE',           inv:'AFS/INV/2324/089', total:11811.80,  rcvd:11811.8,  pending:0      },
  { sl:16, name:'YUKI PAN ASIAN',           inv:'AFS/INV/2324/086', total:19234,     rcvd:11811.8,  pending:0      },
  { sl:17, name:'POWER PLUS ENTERPRISES',   inv:'AFS/INV/2324/092', total:15458,     rcvd:15458,    pending:0      },
]

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

type Tab = 'all' | 'pending' | 'settled'

function getStatus(pending: number): { label: string; badge: string } {
  if (Math.abs(pending) < 1) return { label: 'Settled',  badge: 'badge-green'  }
  if (pending > 100)         return { label: 'Pending',  badge: 'badge-red'    }
  if (pending < -100)        return { label: 'Overpaid', badge: 'badge-blue'   }
  return                            { label: 'Minor Adj',badge: 'badge-yellow' }
}

export default function Outstanding() {
  const [tab, setTab] = useState<Tab>('all')

  const filtered = PROJECTS.filter(p => {
    if (tab === 'pending')  return Math.abs(p.pending) >= 1
    if (tab === 'settled')  return Math.abs(p.pending) < 1
    return true
  })

  const settledCount = PROJECTS.filter(p => Math.abs(p.pending) < 1).length
  const pendingCount = PROJECTS.length - settledCount

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="section-title">Outstanding Payments</h1>
        <p className="section-sub">Payment settlement status — FY 2023-24</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-brand">17</div>
          <div className="text-xs text-gray-500 mt-1">Total Projects</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-green-600">{settledCount}</div>
          <div className="text-xs text-gray-500 mt-1">Fully Settled</div>
        </div>
        <div className="card-sm text-center">
          <div className="text-2xl font-bold text-red-500">{pendingCount}</div>
          <div className="text-xs text-gray-500 mt-1">Pending Clearance</div>
        </div>
      </div>

      <div className="card">
        <div className="flex gap-2 mb-4">
          {(['all', 'pending', 'settled'] as Tab[]).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? 'bg-brand text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="tbl">
            <thead>
              <tr>
                <th>Sl</th><th>Project</th><th>Invoice #</th>
                <th>Total Value</th><th>Received</th><th>Pending</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const { label, badge } = getStatus(p.pending)
                return (
                  <tr key={p.sl}>
                    <td className="text-center text-gray-400">{p.sl}</td>
                    <td className="font-medium">{p.name}</td>
                    <td className="text-xs font-mono text-gray-500">{p.inv}</td>
                    <td>{fmt(p.total)}</td>
                    <td className="text-green-700">{fmt(p.rcvd)}</td>
                    <td className={
                      Math.abs(p.pending) < 1 ? 'text-green-600 font-semibold' :
                      p.pending > 100 ? 'text-red-600 font-semibold' :
                      p.pending < -100 ? 'text-blue-600 font-semibold' :
                      'text-yellow-600 font-semibold'
                    }>{fmt(p.pending)}</td>
                    <td><span className={badge}>{label}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-8">No records for this filter.</p>
        )}
      </div>
    </div>
  )
}
