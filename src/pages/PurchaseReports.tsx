const PROJECTS: { sl: number; name: string; matExp: number; labExp: number; miscExp: number; gstPaid: number }[] = []

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
        <p className="section-sub">Expense breakdown per project — FY 2026-27</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Total Material Expense</div>
          <div className="text-2xl font-bold text-brand">{fmt(PROJECTS.reduce((s,p)=>s+p.matExp,0))}</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Total Labour Expense</div>
          <div className="text-2xl font-bold text-brand">{fmt(PROJECTS.reduce((s,p)=>s+p.labExp,0))}</div>
        </div>
        <div className="card-sm">
          <div className="text-xs text-gray-500 mb-1">Total Misc Expense</div>
          <div className="text-2xl font-bold text-gray-600">{fmt(PROJECTS.reduce((s,p)=>s+p.miscExp,0))}</div>
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-700 mb-4">Top 5 Projects by Material Expense</h2>
        <div className="space-y-3">
          {top5ByMaterial.length === 0 && <p className="text-center text-gray-400 py-6">No purchase data yet</p>}
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
            {PROJECTS.length === 0 && (
              <tr><td colSpan={7} className="text-center py-10 text-gray-400">No purchase data yet</td></tr>
            )}
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
