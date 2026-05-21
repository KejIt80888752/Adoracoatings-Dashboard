import { BarChart2 } from 'lucide-react'
export default function ProfitLoss() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center">
        <BarChart2 size={28} className="text-brand" />
      </div>
      <h2 className="text-lg font-semibold text-gray-700">Profit & Loss</h2>
      <p className="text-sm text-gray-400">P&L statements and financial overview</p>
      <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-medium">Coming Soon</span>
    </div>
  )
}
