import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const PROJECTS = [
  { sl:1,  name:'SKYLINE CITY TOWER',       base:10180,    matExp:5545,   labExp:0,     miscExp:0,    gstPaid:998.10,   profit:4635   },
  { sl:2,  name:'LAMY STORE',               base:241492,   matExp:135276, labExp:8000,  miscExp:3000, gstPaid:24349.68, profit:95216  },
  { sl:3,  name:'G P SPORTS & INFRA',       base:202300,   matExp:125140, labExp:50150, miscExp:10000,gstPaid:21852,    profit:17010  },
  { sl:4,  name:'STREAMLINE FITNESS',       base:166964,   matExp:106065, labExp:15000, miscExp:6260, gstPaid:18821.70, profit:39639  },
  { sl:5,  name:'SHUBHARAM COMPLEX',        base:724223.5, matExp:418210, labExp:50000, miscExp:0,    gstPaid:74832.37, profit:256013 },
  { sl:6,  name:'MALNAD ARCADE',            base:26300,    matExp:19250,  labExp:0,     miscExp:1000, gstPaid:3465,     profit:6050   },
  { sl:7,  name:'ARUN EDUFUN',              base:23340,    matExp:9365,   labExp:3710,  miscExp:0,    gstPaid:1685.70,  profit:10265  },
  { sl:8,  name:'ANANT CARS AUTO PVT LTD', base:59299,    matExp:26610,  labExp:2000,  miscExp:3500, gstPaid:4789.80,  profit:27189  },
  { sl:9,  name:'ARYAN INTERIORS',          base:19950,    matExp:6740,   labExp:5000,  miscExp:0,    gstPaid:1213.20,  profit:8210   },
  { sl:10, name:'ARYAN INTERIORS - TN',     base:83065,    matExp:5200,   labExp:18000, miscExp:2272, gstPaid:936,      profit:57593  },
  { sl:11, name:'GODREJ GOLD COUNTY',       base:18100,    matExp:14856,  labExp:0,     miscExp:0,    gstPaid:2674.22,  profit:3243   },
  { sl:12, name:'SRIKAKULAM APARTMENT',     base:75181,    matExp:35930,  labExp:8500,  miscExp:0,    gstPaid:6467.40,  profit:30751  },
  { sl:13, name:'SQUIRE HWFS',              base:12980,    matExp:6110,   labExp:0,     miscExp:200,  gstPaid:1099.80,  profit:6670   },
  { sl:14, name:'PURVA SKYWOOD',            base:55100,    matExp:39600,  labExp:6600,  miscExp:400,  gstPaid:7128,     profit:8500   },
  { sl:15, name:'PNG HEALTHCARE',           base:10010,    matExp:5730,   labExp:0,     miscExp:300,  gstPaid:1031.40,  profit:3980   },
  { sl:16, name:'YUKI PAN ASIAN',           base:16300,    matExp:6500,   labExp:0,     miscExp:500,  gstPaid:1170,     profit:9300   },
  { sl:17, name:'POWER PLUS ENTERPRISES',   base:13100,    matExp:5000,   labExp:0,     miscExp:300,  gstPaid:900,      profit:7800   },
]

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

const top8 = [...PROJECTS]
  .sort((a, b) => b.base - a.base)
  .slice(0, 8)
  .map(p => ({
    name:     p.name.length > 16 ? p.name.slice(0, 16) + '…' : p.name,
    Revenue:  Math.round(p.base),
    Expenses: Math.round(p.matExp + p.labExp + p.miscExp),
    Profit:   Math.round(p.profit),
  }))

const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }

export default function ProfitLoss() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="section-title">Profit &amp; Loss</h1>
        <p className="section-sub">Financial performance summary — FY 2023-24</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
          <div className="text-xl font-bold text-brand">₹20,74,304</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Total Expenses</div>
          <div className="text-xl font-bold text-red-500">₹11,40,232</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Gross Profit</div>
          <div className="text-xl font-bold text-green-600">₹5,92,064</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Profit Margin</div>
          <div className="text-xl font-bold text-brand">28.5%</div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-700 mb-4">Revenue vs Expenses vs Profit — Top 8 Projects</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={top8} margin={{ top: 4, right: 8, left: 8, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmt(v)]} />
            <Legend />
            <Bar dataKey="Revenue"  fill="#4a7c1f" radius={[4,4,0,0]} />
            <Bar dataKey="Expenses" fill="#f87171" radius={[4,4,0,0]} />
            <Bar dataKey="Profit"   fill="#34d399" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="font-semibold text-gray-700 mb-4">Project-wise P&amp;L</h2>
        <table className="tbl">
          <thead>
            <tr>
              <th>Sl</th><th>Project</th><th>Revenue</th><th>Expenses (M+L+Misc)</th>
              <th>GST Paid</th><th>Gross Profit</th><th>Margin %</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map(p => {
              const expenses = p.matExp + p.labExp + p.miscExp
              const margin   = p.base > 0 ? ((p.profit / p.base) * 100).toFixed(1) : '0'
              return (
                <tr key={p.sl}>
                  <td className="text-center text-gray-400">{p.sl}</td>
                  <td className="font-medium">{p.name}</td>
                  <td className="text-brand font-semibold">{fmt(p.base)}</td>
                  <td className="text-red-500">{fmt(expenses)}</td>
                  <td className="text-gray-500">{fmt(p.gstPaid)}</td>
                  <td className="text-green-600 font-semibold">{fmt(p.profit)}</td>
                  <td>
                    <span className={parseFloat(margin) >= 20 ? 'badge-green' : parseFloat(margin) >= 10 ? 'badge-yellow' : 'badge-red'}>
                      {margin}%
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
