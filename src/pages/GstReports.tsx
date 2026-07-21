import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const PROJECTS: { sl: number; name: string; date: string; inv: string; base: number; gstCol: number; gstPaid: number }[] = []

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN')

const monthlyAcc: Record<string, { Collected: number; Paid: number }> = {}
PROJECTS.forEach(p => {
  const month = p.date.split('-').slice(1).join('-')
  if (!monthlyAcc[month]) monthlyAcc[month] = { Collected: 0, Paid: 0 }
  monthlyAcc[month].Collected += p.gstCol
  monthlyAcc[month].Paid      += p.gstPaid
})
const monthlyData = Object.entries(monthlyAcc).map(([month, v]) => ({
  month,
  Collected: Math.round(v.Collected),
  Paid:      Math.round(v.Paid),
}))

const tooltipStyle = { backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 12 }

export default function GstReports() {
  const totalCol  = PROJECTS.reduce((s, p) => s + p.gstCol,  0)
  const totalPaid = PROJECTS.reduce((s, p) => s + p.gstPaid, 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="section-title">GST Reports</h1>
        <p className="section-sub">GST collected &amp; paid summary — FY 2026-27</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">GST Collected (Output)</div>
          <div className="text-2xl font-bold text-brand">{fmt(totalCol)}</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">GST Paid (Input)</div>
          <div className="text-2xl font-bold text-red-500">{fmt(totalPaid)}</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Net GST Liability</div>
          <div className="text-2xl font-bold text-brand">{fmt(totalCol - totalPaid)}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-700 mb-4">Monthly GST — Collected vs Paid</h2>
        {monthlyData.length === 0 ? (
          <p className="text-center text-gray-400 py-16">No GST data yet</p>
        ) : (
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
        )}
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
            {PROJECTS.length === 0 && (
              <tr><td colSpan={8} className="text-center py-10 text-gray-400">No GST data yet</td></tr>
            )}
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
