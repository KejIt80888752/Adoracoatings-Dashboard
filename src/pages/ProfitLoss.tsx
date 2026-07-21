import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const PROJECTS: { sl: number; name: string; base: number; matExp: number; labExp: number; miscExp: number; gstPaid: number; profit: number }[] = []

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
        <p className="section-sub">Financial performance summary — FY 2026-27</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
          <div className="text-xl font-bold text-brand">{fmt(PROJECTS.reduce((s,p)=>s+p.base,0))}</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Total Expenses</div>
          <div className="text-xl font-bold text-red-500">{fmt(PROJECTS.reduce((s,p)=>s+p.matExp+p.labExp+p.miscExp,0))}</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Gross Profit</div>
          <div className="text-xl font-bold text-green-600">{fmt(PROJECTS.reduce((s,p)=>s+p.profit,0))}</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Profit Margin</div>
          <div className="text-xl font-bold text-brand">
            {(() => { const rev = PROJECTS.reduce((s,p)=>s+p.base,0); const prof = PROJECTS.reduce((s,p)=>s+p.profit,0); return rev > 0 ? ((prof/rev)*100).toFixed(1) : '0' })()}%
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-700 mb-4">Revenue vs Expenses vs Profit — Top 8 Projects</h2>
        {top8.length === 0 ? (
          <p className="text-center text-gray-400 py-20">No data yet</p>
        ) : (
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
        )}
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
            {PROJECTS.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No data yet</td></tr>
            )}
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
