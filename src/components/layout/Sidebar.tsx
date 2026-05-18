import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, Package, Image, Users,
  ShoppingCart, BarChart2, Settings, LogOut, X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard',       section: null         },
  { to: '/products',  icon: Package,         label: 'Products',        section: null         },
  { to: '/portfolio', icon: Image,           label: 'Portfolio',       section: null         },
  { to: '/leads',     icon: Users,           label: 'Lead Generation', section: 'Operations' },
  { to: '/orders',    icon: ShoppingCart,    label: 'Orders',          section: null         },
  { to: '/reports',   icon: BarChart2,       label: 'Reports',         section: null         },
  { to: '/settings',  icon: Settings,        label: 'Settings',        section: 'System'     },
]

interface Props { open: boolean; onClose: () => void }

export default function Sidebar({ open, onClose }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/30 z-20 lg:hidden" onClick={onClose} />}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-60 z-30 flex flex-col',
        'bg-white border-r border-gray-100 shadow-sm',
        'transition-transform duration-300',
        'lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full'
      )}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 shrink-0">
          <img
            src="https://www.adoracoatings.com/assets/images/AA0030/dynamic/companylogos/ar9x2/Adora-Coatings-Logo-White.png"
            alt="AdoraCoatings"
            className="h-10 object-contain"
            onError={e => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling!.classList.remove('hidden')
            }}
          />
          {/* Fallback if logo fails */}
          <div className="hidden items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm font-display">AC</span>
            </div>
            <div>
              <p className="font-display font-bold text-gray-800 text-sm leading-tight">AdoraCoatings</p>
              <p className="text-[10px] text-gray-400">redefining spaces</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600 p-1">
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
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 px-4 pt-4 pb-1.5 font-semibold">
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
        <div className="px-3 pb-4 pt-3 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
              {user?.name?.[0] ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate capitalize">{user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="nav-link w-full text-red-400 hover:text-red-600 hover:bg-red-50">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
