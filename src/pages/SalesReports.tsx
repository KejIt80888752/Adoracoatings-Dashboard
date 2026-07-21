import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

const PROJECTS: { name: string; total: number }[] = []

const top10 = [...PROJECTS]
  .sort((a, b) => b.total - a.total)
  .slice(0, 10)
  .map(p => ({
    name: p.name.length > 16 ? p.name.slice(0, 16) + '…' : p.name,
    revenue: Math.round(p.total),
  }))

const expenseData: { name: string; value: number }[] = []

const PIE_COLORS = ['#4a7c1f', '#5a9e25', '#90d147', '#b5db69']

const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }

export default function SalesReports() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="section-title">Sales Reports</h1>
        <p className="section-sub">Revenue &amp; performance overview — FY 2026-27</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-brand">₹0</div>
          <div className="text-xs text-gray-400 mt-1">0 projects invoiced</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Total Collected</div>
          <div className="text-2xl font-bold text-green-600">₹0</div>
          <div className="text-xs text-gray-400 mt-1">Includes advance payments</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Gross Profit</div>
          <div className="text-2xl font-bold text-brand">₹0</div>
          <div className="text-xs text-gray-400 mt-1">—</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card">
          <h2 className="font-semibold text-gray-700 mb-4">Top 10 Projects by Revenue</h2>
          {top10.length === 0 ? (
            <p className="text-center text-gray-400 py-20">No sales data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={top10} margin={{ top: 4, right: 8, left: 8, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} angle={-35} textAnchor="end" interval={0} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} />
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmt(v), 'Revenue']} />
                <Bar dataKey="revenue" fill="#4a7c1f" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-700 mb-4">Expense Breakdown</h2>
          {expenseData.length === 0 ? (
            <p className="text-center text-gray-400 py-20">No expense data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%" cy="45%"
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {expenseData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => [fmt(v), 'Amount']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
