import { Download, TrendingUp, TrendingDown } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line } from 'recharts'

const monthly: { m: string; rev: number; exp: number }[] = []
const catData: { name: string; v: number }[] = []
const leads: { w: string; total: number; conv: number }[] = []
const COLORS   = ['#4a7c1f','#6ab52a','#b5db69','#daedb4','#2d5213']
const tt = { backgroundColor:"#fff", border:"1px solid #e5e7eb", borderRadius:8, fontSize:12, color:"#374151"}

const KPIS = [
  {l:'Gross Revenue',  v:'₹0', chg:'—', up:true },
  {l:'Net Profit',     v:'₹0', chg:'—', up:true },
  {l:'Lead Conversion',v:'0%', chg:'—', up:true },
  {l:'Avg Order Value',v:'₹0', chg:'—', up:true },
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
          <button onClick={() => {
            const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['Month,Revenue,Expense'],{type:'text/csv'})); a.download = 'adora-reports.csv'; a.click()
          }} className="btn-outline-gold flex items-center gap-1.5 text-xs"><Download size={13}/>Export</button>
        </div>
        {monthly.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthly} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
              <XAxis dataKey="m" tick={{fontSize:11,fill:'#6b7280'}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fontSize:11,fill:'#6b7280'}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
              <Tooltip contentStyle={tt} formatter={(v:number)=>`₹${v.toLocaleString()}`}/>
              <Legend wrapperStyle={{fontSize:12}}/>
              <Bar dataKey="rev" name="Revenue" fill="#4a7c1f" radius={[4,4,0,0]} barSize={18}/>
              <Bar dataKey="exp" name="Expense" fill="#daedb4" radius={[4,4,0,0]} barSize={18}/>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="card">
          <p className="section-title text-base mb-4">Sales by Product Category</p>
          {catData.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={catData} cx="50%" cy="50%" outerRadius={80} dataKey="v"
                  label={({name,v})=>`${name} ${v}%`} labelLine={false}>
                  {catData.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                </Pie>
                <Tooltip contentStyle={tt} formatter={(v:number)=>`${v}%`}/>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <p className="section-title text-base mb-4">Lead Conversion</p>
          {leads.length === 0 ? (
            <p className="text-center text-gray-400 py-16">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={leads}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>
                <XAxis dataKey="w" tick={{fontSize:11,fill:'#6b7280'}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fontSize:11,fill:'#6b7280'}} axisLine={false} tickLine={false}/>
                <Tooltip contentStyle={tt}/>
                <Legend wrapperStyle={{fontSize:12}}/>
                <Line type="monotone" dataKey="total" name="Total Leads" stroke="#b5db69" strokeWidth={2} dot={{r:4,fill:'#3d3520'}}/>
                <Line type="monotone" dataKey="conv"  name="Converted"  stroke="#4a7c1f" strokeWidth={2.5} dot={{r:4,fill:'#C9A96E'}}/>
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
