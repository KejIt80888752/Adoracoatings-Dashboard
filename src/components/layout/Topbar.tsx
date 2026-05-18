import { Menu, Bell, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface Props { onMenu: () => void; title: string }

export default function Topbar({ onMenu, title }: Props) {
  const { user } = useAuth()
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center gap-4 px-4 lg:px-6 sticky top-0 z-10 shrink-0 shadow-sm">
      <button onClick={onMenu} className="lg:hidden text-gray-400 hover:text-brand p-1.5">
        <Menu size={20} />
      </button>

      <h1 className="text-base font-semibold text-gray-800">{title}</h1>

      <div className="flex-1 max-w-xs hidden md:block ml-4">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 placeholder-gray-400 focus:outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/10 transition-colors" />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="relative p-2 text-gray-400 hover:text-brand transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand rounded-full" />
        </button>
        <div className="flex items-center gap-2 border-l border-gray-100 pl-3">
          <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold uppercase">
            {user?.name?.[0] ?? 'A'}
          </div>
          <span className="text-xs text-gray-600 hidden sm:block capitalize">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}
