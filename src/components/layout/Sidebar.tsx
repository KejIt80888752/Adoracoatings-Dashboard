import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, Package, Image, Users,
  ShoppingCart, BarChart2, Settings, LogOut, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/* Nav mirrors website: Home→Dashboard | Products→Inventory | Portfolio | Contact→Leads
   Plus operational: Orders, Reports, Settings */
const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard',       section: null },
  { to: '/products',  icon: Package,         label: 'Products',        section: null },
  { to: '/portfolio', icon: Image,           label: 'Portfolio',       section: null },
  { to: '/leads',     icon: Users,           label: 'Lead Generation', section: 'Operations' },
  { to: '/orders',    icon: ShoppingCart,    label: 'Orders',          section: null },
  { to: '/reports',   icon: BarChart2,       label: 'Reports',         section: null },
  { to: '/settings',  icon: Settings,        label: 'Settings',        section: 'System' },
]

interface Props { open: boolean; onClose: () => void }

export default function Sidebar({ open, onClose }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={onClose} />}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-60 z-30 flex flex-col',
        'bg-brand-sidebar border-r border-brand-border',
        'transition-transform duration-300',
        'lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>

        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-brand-border shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center shrink-0">
              <svg viewBox="0 0 24 24" className="w-4.5 h-4.5 fill-black w-5 h-5">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4a3 3 0 110 6 3 3 0 010-6zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-tight">AdoraCoatings</p>
              <p className="text-[10px] text-gray-600">Business Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-600 hover:text-white p-1">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-0.5">
          {NAV.map(({ to, icon: Icon, label, section }, i) => {
            const prevSection = i > 0 ? NAV[i - 1].section : null
            const showDivider = section && section !== prevSection
            return (
              <div key={to}>
                {showDivider && (
                  <p className="text-[10px] uppercase tracking-widest text-gray-600 px-4 pt-4 pb-1.5 font-semibold">
                    {section}
                  </p>
                )}
                <NavLink
                  to={to}
                  end={to === '/'}
                  onClick={onClose}
                  className={({ isActive }) => cn('nav-link', isActive && 'active')}
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              </div>
            )
          })}
        </nav>

        {/* User */}
        <div className="px-3 pb-4 pt-3 border-t border-brand-border shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-brand-gold flex items-center justify-center text-black text-xs font-bold uppercase shrink-0">
              {user?.name?.[0] ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate capitalize">{user?.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="nav-link w-full text-red-500/70 hover:text-red-400 hover:bg-red-500/10">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
