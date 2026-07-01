import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const PROJECTS = [
  { sl:1,  name:'SKYLINE CITY TOWER',       date:'07-Sep-23', inv:'AFS/INV/2324/063', base:10180,    gstCol:1832.40,   gstPaid:998.10   },
  { sl:2,  name:'LAMY STORE',               date:'22-Oct-23', inv:'AFS/PI/2324/30',   base:241492,   gstCol:43468.56,  gstPaid:24349.68 },
  { sl:3,  name:'G P SPORTS & INFRA',       date:'11-Sep-23', inv:'AFS/INV/2324/069', base:202300,   gstCol:36414,     gstPaid:21852    },
  { sl:4,  name:'STREAMLINE FITNESS',       date:'05-Sep-23', inv:'AFS/INV/2324/062', base:166964,   gstCol:30053.52,  gstPaid:18821.70 },
  { sl:5,  name:'SHUBHARAM COMPLEX',        date:'13-Nov-23', inv:'AFS/INV/2324/093', base:724223.5, gstCol:130360.23, gstPaid:74832.37 },
  { sl:6,  name:'MALNAD ARCADE',            date:'04-Aug-23', inv:'AFS/INV/2324/052', base:26300,    gstCol:4734,      gstPaid:3465     },
  { sl:7,  name:'ARUN EDUFUN',              date:'21-Aug-23', inv:'AFS/QTN/2324/057', base:23340,    gstCol:4201.20,   gstPaid:1685.70  },
  { sl:8,  name:'ANANT CARS AUTO PVT LTD', date:'17-Aug-23', inv:'AFS/INV/2324/054', base:59299,    gstCol:10673.82,  gstPaid:4789.80  },
  { sl:9,  name:'ARYAN INTERIORS',          date:'31-Aug-23', inv:'AFS/INV/2324/058', base:19950,    gstCol:3591,      gstPaid:1213.20  },
  { sl:10, name:'ARYAN INTERIORS - TN',     date:'31-Aug-23', inv:'AFS/INV/2324/057', base:83065,    gstCol:14951.70,  gstPaid:936      },
  { sl:11, name:'GODREJ GOLD COUNTY',       date:'11-Sep-23', inv:'AFS/INV/2324/065', base:18100,    gstCol:3258,      gstPaid:2674.22  },
  { sl:12, name:'SRIKAKULAM APARTMENT',     date:'12-Oct-23', inv:'AFS/PI/2324/27',   base:75181,    gstCol:13532.58,  gstPaid:6467.40  },
  { sl:13, name:'SQUIRE HWFS',              date:'19-Oct-23', inv:'AFS/INV/2324/084', base:12980,    gstCol:2336.40,   gstPaid:1099.80  },
  { sl:14, name:'PURVA SKYWOOD',            date:'30-Oct-23', inv:'AFS/PI/2324/31',   base:55100,    gstCol:9918,      gstPaid:7128     },
  { sl:15, name:'PNG HEALTHCARE',           date:'03-Nov-23', inv:'AFS/INV/2324/089', base:10010,    gstCol:1801.80,   gstPaid:1031.40  },
  { sl:16, name:'YUKI PAN ASIAN',           date:'03-Nov-23', inv:'AFS/INV/2324/086', base:16300,    gstCol:2934,      gstPaid:1170     },
  { sl:17, name:'POWER PLUS ENTERPRISES',   date:'07-Nov-23', inv:'AFS/INV/2324/092', base:13100,    gstCol:2358,      gstPaid:900      },
]

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

const monthlyAcc: Record<string, { Collected: number; Paid: number }> = {}
PROJECTS.forEach(p => {
  const month = p.date.split('-').slice(1).join('-')
  if (!monthlyAcc[month]) monthlyAcc[month] = { Collected: 0, Paid: 0 }
  monthlyAcc[month].Collected += p.gstCol
  monthlyAcc[month].Paid      += p.gstPaid
})
const MONTH_ORDER = ['Aug-23', 'Sep-23', 'Oct-23', 'Nov-23']
const monthlyData = MONTH_ORDER.map(m => ({
  month: m,
  Collected: Math.round(monthlyAcc[m]?.Collected || 0),
  Paid:      Math.round(monthlyAcc[m]?.Paid      || 0),
}))

const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }

export default function GstReports() {
  const totalCol  = PROJECTS.reduce((s, p) => s + p.gstCol,  0)
  const totalPaid = PROJECTS.reduce((s, p) => s + p.gstPaid, 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="section-title">GST Reports</h1>
        <p className="section-sub">GST collected &amp; paid summary — FY 2023-24</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">GST Collected (Output)</div>
          <div className="text-2xl font-bold text-brand">₹3,16,419</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">GST Paid (Input)</div>
          <div className="text-2xl font-bold text-red-500">₹1,73,414</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Net GST Liability</div>
          <div className="text-2xl font-bold text-brand">₹1,43,005</div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-700 mb-4">Monthly GST — Collected vs Paid</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={monthlyData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v / 1000).toFixed(0)}K`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmt(v)]} />
            <Bar dataKey="Collected" fill="#4a7c1f" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Paid"      fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="font-semibold text-gray-700 mb-4">Project-wise GST Detail</h2>
        <table className="tbl">
          <thead>
            <tr>
              <th>Sl</th><th>Project</th><th>Invoice #</th><th>Date</th>
              <th>Base Value</th><th>GST Collected</th><th>GST Paid</th><th>Net GST</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map(p => {
              const net = p.gstCol - p.gstPaid
              return (
                <tr key={p.sl}>
                  <td className="text-center text-gray-400">{p.sl}</td>
                  <td className="font-medium">{p.name}</td>
                  <td className="text-xs font-mono text-gray-500">{p.inv}</td>
                  <td className="text-gray-500">{p.date}</td>
                  <td>{fmt(p.base)}</td>
                  <td className="text-brand font-semibold">{fmt(p.gstCol)}</td>
                  <td className="text-red-500">{fmt(p.gstPaid)}</td>
                  <td className="text-green-600 font-semibold">{fmt(net)}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-bold">
              <td colSpan={4} className="text-right text-gray-600">Totals</td>
              <td>{fmt(PROJECTS.reduce((s, p) => s + p.base, 0))}</td>
              <td className="text-brand">{fmt(totalCol)}</td>
              <td className="text-red-500">{fmt(totalPaid)}</td>
              <td className="text-green-600">{fmt(totalCol - totalPaid)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
