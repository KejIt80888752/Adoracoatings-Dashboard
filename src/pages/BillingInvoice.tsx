const PROJECTS = [
  { sl:1,  name:'SKYLINE CITY TOWER',       date:'07-Sep-23', inv:'AFS/INV/2324/063', base:10180,    gst:1832.40,   total:12012.40,  rcvd:12012,    pending:0.40   },
  { sl:2,  name:'LAMY STORE',               date:'22-Oct-23', inv:'AFS/PI/2324/30',   base:241492,   gst:43468.56,  total:284960.56, rcvd:285000,   pending:-39.44 },
  { sl:3,  name:'G P SPORTS & INFRA',       date:'11-Sep-23', inv:'AFS/INV/2324/069', base:202300,   gst:36414,     total:238714,    rcvd:238038,   pending:676    },
  { sl:4,  name:'STREAMLINE FITNESS',       date:'05-Sep-23', inv:'AFS/INV/2324/062', base:166964,   gst:30053.52,  total:197017.52, rcvd:197018,   pending:-0.48  },
  { sl:5,  name:'SHUBHARAM COMPLEX',        date:'13-Nov-23', inv:'AFS/INV/2324/093', base:724223.5, gst:130360.23, total:854583.73, rcvd:943273,   pending:-88689 },
  { sl:6,  name:'MALNAD ARCADE',            date:'04-Aug-23', inv:'AFS/INV/2324/052', base:26300,    gst:4734,      total:31034,     rcvd:31034,    pending:0      },
  { sl:7,  name:'ARUN EDUFUN',              date:'21-Aug-23', inv:'AFS/QTN/2324/057', base:23340,    gst:4201.20,   total:27541.20,  rcvd:23000,    pending:340    },
  { sl:8,  name:'ANANT CARS AUTO PVT LTD', date:'17-Aug-23', inv:'AFS/INV/2324/054', base:59299,    gst:10673.82,  total:69972.82,  rcvd:69943,    pending:29.82  },
  { sl:9,  name:'ARYAN INTERIORS',          date:'31-Aug-23', inv:'AFS/INV/2324/058', base:19950,    gst:3591,      total:23541,     rcvd:23424,    pending:117    },
  { sl:10, name:'ARYAN INTERIORS - TN',     date:'31-Aug-23', inv:'AFS/INV/2324/057', base:83065,    gst:14951.70,  total:98016.70,  rcvd:97970,    pending:46.70  },
  { sl:11, name:'GODREJ GOLD COUNTY',       date:'11-Sep-23', inv:'AFS/INV/2324/065', base:18100,    gst:3258,      total:21358,     rcvd:21177,    pending:181    },
  { sl:12, name:'SRIKAKULAM APARTMENT',     date:'12-Oct-23', inv:'AFS/PI/2324/27',   base:75181,    gst:13532.58,  total:88713.58,  rcvd:88731,    pending:-17.42 },
  { sl:13, name:'SQUIRE HWFS',              date:'19-Oct-23', inv:'AFS/INV/2324/084', base:12980,    gst:2336.40,   total:15316.40,  rcvd:15316,    pending:0.40   },
  { sl:14, name:'PURVA SKYWOOD',            date:'30-Oct-23', inv:'AFS/PI/2324/31',   base:55100,    gst:9918,      total:65018,     rcvd:65018,    pending:0      },
  { sl:15, name:'PNG HEALTHCARE',           date:'03-Nov-23', inv:'AFS/INV/2324/089', base:10010,    gst:1801.80,   total:11811.80,  rcvd:11811.8,  pending:0      },
  { sl:16, name:'YUKI PAN ASIAN',           date:'03-Nov-23', inv:'AFS/INV/2324/086', base:16300,    gst:2934,      total:19234,     rcvd:11811.8,  pending:0      },
  { sl:17, name:'POWER PLUS ENTERPRISES',   date:'07-Nov-23', inv:'AFS/INV/2324/092', base:13100,    gst:2358,      total:15458,     rcvd:15458,    pending:0      },
]

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

function balanceClass(bal: number): string {
  if (Math.abs(bal) < 1) return 'text-green-600 font-semibold'
  if (bal > 0 && bal < 500) return 'text-yellow-600 font-semibold'
  if (bal < -100) return 'text-red-600 font-semibold'
  return 'text-yellow-600 font-semibold'
}

export default function BillingInvoice() {
  const totalInvoiced  = PROJECTS.reduce((s, p) => s + p.total, 0)
  const totalCollected = PROJECTS.reduce((s, p) => s + p.rcvd,  0)
  const totalBalance   = PROJECTS.reduce((s, p) => s + p.pending, 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="section-title">Billing &amp; Invoices</h1>
        <p className="section-sub">Invoice register — FY 2023-24</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Total Invoiced</div>
          <div className="text-2xl font-bold text-brand">{fmt(totalInvoiced)}</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Total Collected</div>
          <div className="text-2xl font-bold text-green-600">{fmt(totalCollected)}</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Balance Outstanding</div>
          <div className={`text-2xl font-bold ${totalBalance > 0 ? 'text-red-500' : 'text-green-600'}`}>
            {fmt(Math.abs(totalBalance))}
            {totalBalance < 0 && <span className="text-xs font-normal text-gray-400 ml-1">(excess rcvd)</span>}
          </div>
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="font-semibold text-gray-700 mb-4">Invoice Details</h2>
        <table className="tbl">
          <thead>
            <tr>
              <th>Invoice #</th><th>Project</th><th>Date</th>
              <th>Base Value</th><th>GST</th><th>Invoice Total</th>
              <th>Amount Received</th><th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map(p => (
              <tr key={p.sl}>
                <td className="text-xs font-mono text-gray-500">{p.inv}</td>
                <td className="font-medium">{p.name}</td>
                <td className="text-gray-500">{p.date}</td>
                <td>{fmt(p.base)}</td>
                <td className="text-gray-500">{fmt(p.gst)}</td>
                <td className="font-semibold">{fmt(p.total)}</td>
                <td className="text-green-700">{fmt(p.rcvd)}</td>
                <td className={balanceClass(p.pending)}>{fmt(p.pending)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-bold">
              <td colSpan={3} className="text-right text-gray-600 pr-4">Totals</td>
              <td>{fmt(PROJECTS.reduce((s,p)=>s+p.base,0))}</td>
              <td>{fmt(PROJECTS.reduce((s,p)=>s+p.gst,0))}</td>
              <td className="text-brand">{fmt(totalInvoiced)}</td>
              <td className="text-green-700">{fmt(totalCollected)}</td>
              <td className={totalBalance >= 0 ? 'text-red-600' : 'text-green-600'}>{fmt(totalBalance)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
