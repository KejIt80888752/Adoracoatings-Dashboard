import { useState } from 'react'
import { Search, Plus, Eye, Truck, CheckCircle2, Clock, XCircle } from 'lucide-react'

const ORDERS = [
  { id:'ORD-001', customer:'Rajan Constructions',  date:'18 May 2026', items:5, amount:182500, status:'Delivered',   payment:'Paid'    },
  { id:'ORD-002', customer:'Metro Infra Ltd',       date:'17 May 2026', items:3, amount:94000,  status:'In Transit',  payment:'Paid'    },
  { id:'ORD-003', customer:'Sri Builders',          date:'17 May 2026', items:8, amount:240000, status:'Processing',  payment:'Partial' },
  { id:'ORD-004', customer:'Lakshmi Interiors',    date:'16 May 2026', items:2, amount:67800,  status:'Pending',     payment:'Unpaid'  },
  { id:'ORD-005', customer:'Kumar Real Estate',    date:'15 May 2026', items:6, amount:118200, status:'Delivered',   payment:'Paid'    },
  { id:'ORD-006', customer:'Pooja Spaces',          date:'14 May 2026', items:4, amount:61500,  status:'Cancelled',   payment:'Refund'  },
  { id:'ORD-007', customer:'ITC Hotels',            date:'13 May 2026', items:10,amount:385000, status:'Delivered',   payment:'Paid'    },
  { id:'ORD-008', customer:'Prestige Group',        date:'12 May 2026', items:7, amount:224000, status:'In Transit',  payment:'Paid'    },
]

const sIcon: Record<string,JSX.Element> = {
  Delivered:    <CheckCircle2 size={13} className="text-green-400"/>,
  'In Transit': <Truck size={13} className="text-blue-400"/>,
  Processing:   <Clock size={13} className="text-yellow-400"/>,
  Pending:      <Clock size={13} className="text-gray-500"/>,
  Cancelled:    <XCircle size={13} className="text-red-400"/>,
}
const sBadge: Record<string,string> = {
  Delivered:'badge-green', 'In Transit':'badge-blue', Processing:'badge-yellow', Pending:'badge-gray', Cancelled:'badge-red'
}
const pBadge: Record<string,string> = { Paid:'badge-green', Partial:'badge-yellow', Unpaid:'badge-red', Refund:'badge-blue' }

export default function Orders() {
  const [search, setSearch] = useState('')
  const [sf, setSf] = useState('All')

  const list = ORDERS.filter(o =>
    (sf==='All'||o.status===sf) &&
    (o.id.toLowerCase().includes(search.toLowerCase())||o.customer.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { l:'Total Orders',  v:ORDERS.length,                                                              a:'border-brand-gold' },
          { l:'Delivered',     v:ORDERS.filter(o=>o.status==='Delivered').length,                            a:'border-green-500'  },
          { l:'In Progress',   v:ORDERS.filter(o=>['In Transit','Processing'].includes(o.status)).length,    a:'border-yellow-500' },
          { l:'Pending',       v:ORDERS.filter(o=>o.status==='Pending').length,                              a:'border-red-500'    },
        ].map(c=>(
          <div key={c.l} className={`card border-l-4 ${c.a}`}>
            <p className="text-2xl font-bold text-white">{c.v}</p>
            <p className="text-xs text-gray-500 mt-0.5">{c.l}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search order or customer..." className="input-dark pl-9 w-64"/>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All','Delivered','In Transit','Processing','Pending','Cancelled'].map(s=>(
              <button key={s} onClick={()=>setSf(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${sf===s?'bg-brand-gold text-black':'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{s}</button>
            ))}
          </div>
          <button className="ml-auto btn-gold flex items-center gap-1.5"><Plus size={13}/>New Order</button>
        </div>
      </div>

      <div className="card !p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full tbl">
            <thead><tr>{['Order ID','Customer','Date','Items','Amount','Status','Payment','Actions'].map(h=><th key={h}>{h}</th>)}</tr></thead>
            <tbody>
              {list.map(o=>(
                <tr key={o.id}>
                  <td><span className="font-mono text-xs font-semibold text-brand-gold">{o.id}</span></td>
                  <td className="font-medium text-gray-100 whitespace-nowrap">{o.customer}</td>
                  <td className="text-gray-500 text-xs whitespace-nowrap">{o.date}</td>
                  <td className="text-gray-400">{o.items}</td>
                  <td className="font-semibold text-brand-gold">₹{o.amount.toLocaleString()}</td>
                  <td><span className={`${sBadge[o.status]} flex items-center gap-1 w-fit`}>{sIcon[o.status]}{o.status}</span></td>
                  <td><span className={pBadge[o.payment]}>{o.payment}</span></td>
                  <td>
                    <button className="p-1.5 text-gray-600 hover:text-brand-gold hover:bg-brand-gold/10 rounded-lg transition-colors"><Eye size={13}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
