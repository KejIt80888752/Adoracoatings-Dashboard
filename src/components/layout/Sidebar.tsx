import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  LayoutDashboard, Package, Image, Users,
  ShoppingCart, TrendingUp, Settings, LogOut, X,
  FileText, Receipt, ShoppingBag, CreditCard,
  BarChart2, FileSpreadsheet, UserCog,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { to: '/',                icon: LayoutDashboard, label: 'Dashboard'         },
  { to: '/products',        icon: Package,         label: 'Products & Inventory' },
  { to: '/portfolio',       icon: Image,           label: 'Portfolio'         },
  { to: '/quotation',       icon: FileText,        label: 'Quotation'         },
  { to: '/billing',         icon: Receipt,         label: 'Billing / Invoice' },
  { to: '/leads',           icon: Users,           label: 'Lead Generation'   },
  { to: '/sales-reports',   icon: TrendingUp,      label: 'Sales Reports'     },
  { to: '/purchase-reports',icon: ShoppingBag,     label: 'Purchase Reports'  },
  { to: '/outstanding',     icon: CreditCard,      label: 'Outstanding'       },
  { to: '/profit-loss',     icon: BarChart2,       label: 'Profit & Loss'     },
  { to: '/gst-reports',     icon: FileSpreadsheet, label: 'GST Reports'       },
  { to: '/user-management', icon: UserCog,         label: 'User Management'   },
  { to: '/orders',          icon: ShoppingCart,    label: 'Orders'            },
  { to: '/settings',        icon: Settings,        label: 'Settings'          },
]

interface Props { open: boolean; onClose: () => void }

export default function Sidebar({ open, onClose }: Props) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 z-20 lg:hidden" onClick={onClose} />}

      <aside className={cn(
        'fixed top-0 left-0 h-full w-60 z-30 flex flex-col',
        'transition-transform duration-300',
        'lg:translate-x-0 lg:static lg:z-auto',
        open ? 'translate-x-0' : '-translate-x-full'
      )} style={{ backgroundColor: '#1a2744' }}>

        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <img
            src="https://www.adoracoatings.com/assets/images/AA0030/dynamic/companylogos/ar9x2/Adora-Coatings-Logo-White.png"
            alt="AdoraCoatings"
            className="h-9 object-contain object-left"
            onError={e => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling!.classList.remove('hidden')
            }}
          />
          <div className="hidden">
            <p className="font-display font-bold text-white text-sm leading-tight">AdoraCoatings</p>
            <p className="text-[10px] text-white/40">redefining spaces</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/50 hover:text-white p-1">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'text-white font-semibold'
                  : 'text-white/55 hover:text-white hover:bg-white/8'
              )}
              style={({ isActive }) => isActive ? { backgroundColor: '#e07b39' } : {}}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User + logout */}
        <div className="px-2 pb-3 pt-2 shrink-0" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold uppercase shrink-0"
              style={{ backgroundColor: '#e07b39' }}>
              {user?.name?.[0] ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate capitalize">{user?.name}</p>
              <p className="text-[10px] text-white/40 truncate capitalize">{user?.role}</p>
            </div>
            <button onClick={handleLogout} className="text-white/40 hover:text-white transition-colors p-1">
              <LogOut size={14} />
            </button>
          </div>
        </div>

        {/* The Raise */}
        <div className="px-4 py-3 shrink-0 flex flex-col gap-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <img
            src={`${import.meta.env.BASE_URL}the-raise-logo.png`}
            alt="The Raise"
            className="h-5 object-contain object-left opacity-50 hover:opacity-80 transition-opacity"
          />
          <p className="text-[9px] text-white/25 font-medium tracking-widest uppercase">Powered by KEJ IT Solutions</p>
        </div>
      </aside>
    </>
  )
}
