const PROJECTS = [
  { sl:1,  name:'SKYLINE CITY TOWER',       matExp:5545,   labExp:0,     miscExp:0,    gstPaid:998.10  },
  { sl:2,  name:'LAMY STORE',               matExp:135276, labExp:8000,  miscExp:3000, gstPaid:24349.68},
  { sl:3,  name:'G P SPORTS & INFRA',       matExp:125140, labExp:50150, miscExp:10000,gstPaid:21852   },
  { sl:4,  name:'STREAMLINE FITNESS',       matExp:106065, labExp:15000, miscExp:6260, gstPaid:18821.70},
  { sl:5,  name:'SHUBHARAM COMPLEX',        matExp:418210, labExp:50000, miscExp:0,    gstPaid:74832.37},
  { sl:6,  name:'MALNAD ARCADE',            matExp:19250,  labExp:0,     miscExp:1000, gstPaid:3465    },
  { sl:7,  name:'ARUN EDUFUN',              matExp:9365,   labExp:3710,  miscExp:0,    gstPaid:1685.70 },
  { sl:8,  name:'ANANT CARS AUTO PVT LTD', matExp:26610,  labExp:2000,  miscExp:3500, gstPaid:4789.80 },
  { sl:9,  name:'ARYAN INTERIORS',          matExp:6740,   labExp:5000,  miscExp:0,    gstPaid:1213.20 },
  { sl:10, name:'ARYAN INTERIORS - TN',     matExp:5200,   labExp:18000, miscExp:2272, gstPaid:936     },
  { sl:11, name:'GODREJ GOLD COUNTY',       matExp:14856,  labExp:0,     miscExp:0,    gstPaid:2674.22 },
  { sl:12, name:'SRIKAKULAM APARTMENT',     matExp:35930,  labExp:8500,  miscExp:0,    gstPaid:6467.40 },
  { sl:13, name:'SQUIRE HWFS',              matExp:6110,   labExp:0,     miscExp:200,  gstPaid:1099.80 },
  { sl:14, name:'PURVA SKYWOOD',            matExp:39600,  labExp:6600,  miscExp:400,  gstPaid:7128    },
  { sl:15, name:'PNG HEALTHCARE',           matExp:5730,   labExp:0,     miscExp:300,  gstPaid:1031.40 },
  { sl:16, name:'YUKI PAN ASIAN',           matExp:6500,   labExp:0,     miscExp:500,  gstPaid:1170    },
  { sl:17, name:'POWER PLUS ENTERPRISES',   matExp:5000,   labExp:0,     miscExp:300,  gstPaid:900     },
]

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

const top5ByMaterial = [...PROJECTS]
  .sort((a, b) => b.matExp - a.matExp)
  .slice(0, 5)

const maxMat = top5ByMaterial[0]?.matExp || 1

export default function PurchaseReports() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="section-title">Purchase Reports</h1>
        <p className="section-sub">Expense breakdown per project — FY 2023-24</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Total Material Expense</div>
          <div className="text-2xl font-bold text-brand">₹9,71,128</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Total Labour Expense</div>
          <div className="text-2xl font-bold text-brand">₹1,66,960</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Total Misc Expense</div>
          <div className="text-2xl font-bold text-gray-600">₹28,732</div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-700 mb-4">Top 5 Projects by Material Expense</h2>
        <div className="space-y-3">
          {top5ByMaterial.map(p => (
            <div key={p.sl}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700 truncate max-w-[60%]">{p.name}</span>
                <span className="text-brand font-semibold">{fmt(p.matExp)}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${(p.matExp / maxMat) * 100}%`, backgroundColor: '#4a7c1f' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card overflow-x-auto">
        <h2 className="font-semibold text-gray-700 mb-4">All Projects — Expense Detail</h2>
        <table className="tbl">
          <thead>
            <tr>
              <th>Sl</th><th>Project Name</th><th>Material</th><th>Labour</th>
              <th>Misc</th><th>GST Paid</th><th>Total Expenses</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map(p => {
              const total = p.matExp + p.labExp + p.miscExp + p.gstPaid
              return (
                <tr key={p.sl}>
                  <td className="text-center text-gray-400">{p.sl}</td>
                  <td className="font-medium">{p.name}</td>
                  <td>{fmt(p.matExp)}</td>
                  <td>{p.labExp ? fmt(p.labExp) : <span className="text-gray-300">—</span>}</td>
                  <td>{p.miscExp ? fmt(p.miscExp) : <span className="text-gray-300">—</span>}</td>
                  <td className="text-gray-500">{fmt(p.gstPaid)}</td>
                  <td className="font-semibold text-brand">{fmt(total)}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-bold">
              <td colSpan={2} className="text-right text-gray-600">Totals</td>
              <td>{fmt(PROJECTS.reduce((s,p)=>s+p.matExp,0))}</td>
              <td>{fmt(PROJECTS.reduce((s,p)=>s+p.labExp,0))}</td>
              <td>{fmt(PROJECTS.reduce((s,p)=>s+p.miscExp,0))}</td>
              <td>{fmt(PROJECTS.reduce((s,p)=>s+p.gstPaid,0))}</td>
              <td className="text-brand">{fmt(PROJECTS.reduce((s,p)=>s+p.matExp+p.labExp+p.miscExp+p.gstPaid,0))}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
