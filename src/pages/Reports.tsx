import { Download, TrendingUp, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'

const monthly  = [
  {m:'Jan',rev:198000,exp:142000},{m:'Feb',rev:241000,exp:165000},{m:'Mar',rev:279000,exp:183000},
  {m:'Apr',rev:312000,exp:197000},{m:'May',rev:298000,exp:189000},
]
const catData  = [
  {name:'Metallic',v:38},{name:'Moroccan',v:22},{name:'Decorative',v:17},{name:'Exterior',v:15},{name:'Others',v:8}
]
const leads    = [{w:'W1',total:42,conv:8},{w:'W2',total:55,conv:12},{w:'W3',total:48,conv:9},{w:'W4',total:63,conv:15}]
const COLORS   = ['#2a7b7b','#3a9595','#a3e0e0','#d1f0f0','#1a5f5f']
const tt = { backgroundColor:"#fff", border:"1px solid #e5e7eb", borderRadius:8, fontSize:12, color:"#374151"}

const KPIS = [
  {l:'Gross Revenue',  v:'₹12,45,000',chg:'+18%',up:true },
  {l:'Net Profit',     v:'₹3,82,000', chg:'+11%',up:true },
  {l:'Lead Conversion',v:'14.2%',     chg:'+2.4%',up:true},
  {l:'Avg Order Value',v:'₹1,48,000', chg:'-3%',  up:false},
]

export default function Reports() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {KPIS.map(k=>(
          <div key={k.l} className="card">
            <p className="text-xs text-gray-500">{k.l}</p>
            <p className="text-2xl font-bold text-gray-800 mt-1">{k.v}</p>
            <p className={`text-xs mt-1 flex items-center gap-1 ${k.up?'text-green-400':'text-red-400'}`}>
              {k.up?<TrendingUp size={11}/>:<TrendingDown size={11}/>}{k.chg} vs last month
            </p>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div><p className="section-title text-base">Revenue vs Expense</p><p className="section-sub">Jan – May 2026</p></div>
          <button className="btn-outline-gold flex items-center gap-1.5 text-xs"><Download size={13}/>Export</button>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthly} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
            <XAxis dataKey="m" tick={{fontSize:11,fill:'#6b7280'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:'#6b7280'}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
            <Tooltip contentStyle={tt} formatter={(v:number)=>`₹${v.toLocaleString()}`}/>
            <Legend wrapperStyle={{fontSize:12}}/>
            <Bar dataKey="rev" name="Revenue" fill="#2a7b7b" radius={[4,4,0,0]} barSize={18}/>
            <Bar dataKey="exp" name="Expense" fill="#d1f0f0" radius={[4,4,0,0]} barSize={18}/>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card">
          <p className="section-title text-base mb-4">Sales by Product Category</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={catData} cx="50%" cy="50%" outerRadius={80} dataKey="v"
                label={({name,v})=>`${name} ${v}%`} labelLine={false}>
                {catData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
              </Pie>
              <Tooltip contentStyle={tt} formatter={(v:number)=>`${v}%`}/>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <p className="section-title text-base mb-4">Lead Conversion (May)</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={leads}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
              <XAxis dataKey="w" tick={{fontSize:11,fill:'#6b7280'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#6b7280'}} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={tt}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              <Line type="monotone" dataKey="total" name="Total Leads" stroke="#a3e0e0" strokeWidth={2} dot={{r:4,fill:'#3d3520'}}/>
              <Line type="monotone" dataKey="conv"  name="Converted"  stroke="#2a7b7b" strokeWidth={2.5} dot={{r:4,fill:'#C9A96E'}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
