import { useState } from 'react'
import { Search, CheckCircle2, Clock, Download } from 'lucide-react'

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

const PROJECTS = [
  { sl:1,  name:'SKYLINE CITY TOWER BLOCK',  date:'07-Sep-23', inv:'AFS/INV/2324/063', base:10180,   gst:1832,   total:12012,   rcvd:12012,   profit:4635,  pending:0.40,   status:'Settled'     },
  { sl:2,  name:'LAMY STORE',               date:'22-Oct-23', inv:'AFS/PI/2324/30',   base:241492,  gst:43468,  total:284960,  rcvd:285000,  profit:95216, pending:-39.44, status:'Settled'     },
  { sl:3,  name:'G P SPORTS & INFRA',       date:'11-Sep-23', inv:'AFS/INV/2324/069', base:202300,  gst:36414,  total:238714,  rcvd:238038,  profit:17010, pending:676,    status:'Pending'     },
  { sl:4,  name:'STREAMLINE FITNESS',       date:'05-Sep-23', inv:'AFS/INV/2324/062', base:166964,  gst:30053,  total:197017,  rcvd:197018,  profit:39639, pending:-0.48,  status:'Settled'     },
  { sl:5,  name:'SHUBHARAM COMPLEX',        date:'13-Nov-23', inv:'AFS/INV/2324/093', base:724223,  gst:130360, total:854583,  rcvd:943273,  profit:256013,pending:-88689, status:'Settled'     },
  { sl:6,  name:'MALNAD ARCADE',            date:'04-Aug-23', inv:'AFS/INV/2324/052', base:26300,   gst:4734,   total:31034,   rcvd:31034,   profit:6050,  pending:0,      status:'Settled'     },
  { sl:7,  name:'ARUN EDUFUN',              date:'21-Aug-23', inv:'AFS/QTN/2324/057', base:23340,   gst:4201,   total:27541,   rcvd:23000,   profit:10265, pending:340,    status:'Pending'     },
  { sl:8,  name:'ANANT CARS AUTO PVT LTD', date:'17-Aug-23', inv:'AFS/INV/2324/054', base:59299,   gst:10673,  total:69972,   rcvd:69943,   profit:27189, pending:29.82,  status:'Pending'     },
  { sl:9,  name:'ARYAN INTERIORS',          date:'31-Aug-23', inv:'AFS/INV/2324/058', base:19950,   gst:3591,   total:23541,   rcvd:23424,   profit:8210,  pending:117,    status:'Pending'     },
  { sl:10, name:'ARYAN INTERIORS - TN',     date:'31-Aug-23', inv:'AFS/INV/2324/057', base:83065,   gst:14951,  total:98016,   rcvd:97970,   profit:57593, pending:46.70,  status:'Pending'     },
  { sl:11, name:'GODREJ GOLD COUNTY',       date:'11-Sep-23', inv:'AFS/INV/2324/065', base:18100,   gst:3258,   total:21358,   rcvd:21177,   profit:3243,  pending:181,    status:'Pending'     },
  { sl:12, name:'SRIKAKULAM APARTMENT',     date:'12-Oct-23', inv:'AFS/PI/2324/27',   base:75181,   gst:13532,  total:88713,   rcvd:88731,   profit:30751, pending:-17.42, status:'Settled'     },
  { sl:13, name:'SQUIRE HWFS',              date:'19-Oct-23', inv:'AFS/INV/2324/084', base:12980,   gst:2336,   total:15316,   rcvd:15316,   profit:6670,  pending:0.40,   status:'Settled'     },
  { sl:14, name:'PURVA SKYWOOD',            date:'30-Oct-23', inv:'AFS/PI/2324/31',   base:55100,   gst:9918,   total:65018,   rcvd:65018,   profit:8500,  pending:0,      status:'Settled'     },
  { sl:15, name:'PNG HEALTHCARE',           date:'03-Nov-23', inv:'AFS/INV/2324/089', base:10010,   gst:1801,   total:11811,   rcvd:11811,   profit:3980,  pending:0,      status:'Settled'     },
  { sl:16, name:'YUKI PAN ASIAN',           date:'03-Nov-23', inv:'AFS/INV/2324/086', base:16300,   gst:2934,   total:19234,   rcvd:11811,   profit:9300,  pending:7422,   status:'In Progress' },
  { sl:17, name:'POWER PLUS ENTERPRISES',   date:'07-Nov-23', inv:'AFS/INV/2324/092', base:13100,   gst:2358,   total:15458,   rcvd:15458,   profit:7800,  pending:0,      status:'Settled'     },
]

const statusBadge: Record<string, string> = { Settled: 'badge-green', Pending: 'badge-yellow', 'In Progress': 'badge-blue' }
const TABS = ['All', 'Settled', 'Pending', 'In Progress']

export default function Orders() {
  const [search, setSearch] = useState('')
  const [tab, setTab]       = useState('All')

  const filtered = PROJECTS.filter(p =>
    (tab === 'All' || p.status === tab) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.inv.toLowerCase().includes(search.toLowerCase()))
  )

  const settled = PROJECTS.filter(p => p.status === 'Settled').length
  const totalRev = PROJECTS.reduce((s, p) => s + p.total, 0)
  const totalPro = PROJECTS.reduce((s, p) => s + p.profit, 0)

  return (
    <div className="space-y-4">

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="card-sm"><p className="text-xs text-gray-400 mb-0.5">Total Projects</p><p className="text-xl font-bold text-gray-800">17</p></div>
        <div className="card-sm"><p className="text-xs text-gray-400 mb-0.5">Settled</p><p className="text-xl font-bold text-green-500">{settled}</p></div>
        <div className="card-sm"><p className="text-xs text-gray-400 mb-0.5">Total Revenue</p><p className="text-lg font-bold text-brand">{fmt(totalRev)}</p></div>
        <div className="card-sm"><p className="text-xs text-gray-400 mb-0.5">Gross Profit</p><p className="text-lg font-bold text-gray-800">{fmt(totalPro)}</p></div>
      </div>

      {/* Toolbar */}
      <div className="card p-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search project or invoice…" className="input-dark pl-9 w-full" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all border ${tab === t ? 'bg-brand text-white border-brand' : 'border-gray-200 text-gray-500 hover:border-brand/40 hover:text-brand'}`}>{t}</button>
          ))}
        </div>
        <button onClick={() => { const rows = PROJECTS.map(p => [p.sl,p.name,p.inv,p.date,p.base,p.gst,p.total,p.rcvd,p.profit,p.status].join(",")).join("\n"); const csv = "Sl,Project,Invoice,Date,Base,GST,Total,Received,Profit,Status\n" + rows; const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"})); a.download = "orders.csv"; a.click(); }} className="btn-gold flex items-center gap-1.5 text-xs shrink-0"><Download size={13} /> Export</button>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="tbl w-full">
            <thead>
              <tr>
                <th>#</th><th>Project Name</th><th>Invoice #</th><th>Date</th>
                <th className="text-right">Base Value</th><th className="text-right">GST</th>
                <th className="text-right">Total</th><th className="text-right">Received</th>
                <th className="text-right text-red-500">Pending Amount</th><th className="text-right">Profit</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.sl}>
                  <td className="text-gray-400 font-mono text-xs">{String(p.sl).padStart(2,'0')}</td>
                  <td className="font-medium text-gray-700 max-w-[180px] truncate">{p.name}</td>
                  <td className="font-mono text-xs text-gray-500">{p.inv}</td>
                  <td className="text-gray-500 text-xs">{p.date}</td>
                  <td className="text-right text-gray-600">{fmt(p.base)}</td>
                  <td className="text-right text-gray-500 text-xs">{fmt(p.gst)}</td>
                  <td className="text-right font-semibold text-brand">{fmt(p.total)}</td>
                  <td className="text-right text-gray-600">{fmt(p.rcvd)}</td>
                  <td className="text-right font-semibold text-red-500">{p.pending > 0 ? fmt(p.pending) : <span className="text-green-500 text-xs">—</span>}</td>
                  <td className="text-right font-semibold text-green-600">{fmt(p.profit)}</td>
                  <td>
                    <span className={statusBadge[p.status] ?? 'badge-gray'}>
                      {p.status === 'Settled' ? <CheckCircle2 size={10} className="inline mr-1" /> : <Clock size={10} className="inline mr-1" />}
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 font-semibold">
                <td colSpan={4} className="px-4 py-3 text-sm text-gray-600">Total ({filtered.length} projects)</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">{fmt(filtered.reduce((s,p)=>s+p.base,0))}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-500">{fmt(filtered.reduce((s,p)=>s+p.gst,0))}</td>
                <td className="px-4 py-3 text-right text-sm text-brand">{fmt(filtered.reduce((s,p)=>s+p.total,0))}</td>
                <td className="px-4 py-3 text-right text-sm text-gray-700">{fmt(filtered.reduce((s,p)=>s+p.rcvd,0))}</td>
                <td className="px-4 py-3 text-right text-sm text-green-600">{fmt(filtered.reduce((s,p)=>s+p.profit,0))}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
