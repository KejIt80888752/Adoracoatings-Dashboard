import { Menu, Bell, Search } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface Props { onMenu: () => void; title: string }

export default function Topbar({ onMenu, title }: Props) {
  const { user } = useAuth()
  return (
    <header className="h-16 bg-brand-sidebar border-b border-brand-border flex items-center gap-4 px-4 lg:px-6 sticky top-0 z-10 shrink-0">
      <button onClick={onMenu} className="lg:hidden text-gray-500 hover:text-brand-gold p-1.5">
        <Menu size={20} />
      </button>

      <div className="hidden sm:block">
        <h1 className="font-display text-lg font-semibold text-white">{title}</h1>
      </div>

      <div className="flex-1 max-w-xs hidden md:block">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
          <input placeholder="Search..." className="w-full pl-9 pr-4 py-2 bg-brand-dark border border-brand-border rounded-lg text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-gold/50 transition-colors" />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-3">
        <button className="relative p-2 text-gray-600 hover:text-brand-gold transition-colors">
          <Bell size={17} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand-gold rounded-full" />
        </button>
        <div className="flex items-center gap-2 border-l border-brand-border pl-3">
          <div className="w-7 h-7 rounded-full bg-brand-gold flex items-center justify-center text-black text-xs font-bold uppercase">
            {user?.name?.[0] ?? 'A'}
          </div>
          <span className="text-xs text-gray-400 hidden sm:block capitalize">{user?.name}</span>
        </div>
      </div>
    </header>
  )
}
