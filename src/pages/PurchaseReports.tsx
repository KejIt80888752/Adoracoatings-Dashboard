import { ShoppingBag } from 'lucide-react'
export default function PurchaseReports() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center">
        <ShoppingBag size={28} className="text-brand" />
      </div>
      <h2 className="text-lg font-semibold text-gray-700">Purchase Reports</h2>
      <p className="text-sm text-gray-400">Track purchases and procurement</p>
      <span className="px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-medium">Coming Soon</span>
    </div>
  )
}
