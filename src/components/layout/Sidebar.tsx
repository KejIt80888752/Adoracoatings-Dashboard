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
  { to: '/',                 icon: LayoutDashboard, label: 'Dashboard'            },
  { to: '/products',         icon: Package,         label: 'Products & Inventory' },
  { to: '/portfolio',        icon: Image,           label: 'Portfolio'            },
  { to: '/quotation',        icon: FileText,        label: 'Quotation'            },
  { to: '/billing',          icon: Receipt,         label: 'Billing / Invoice'    },
  { to: '/leads',            icon: Users,           label: 'Lead Generation'      },
  { to: '/sales-reports',    icon: TrendingUp,      label: 'Sales Reports'        },
  { to: '/purchase-reports', icon: ShoppingBag,     label: 'Purchase Reports'     },
  { to: '/outstanding',      icon: CreditCard,      label: 'Outstanding'          },
  { to: '/profit-loss',      icon: BarChart2,       label: 'Profit & Loss'        },
  { to: '/gst-reports',      icon: FileSpreadsheet, label: 'GST Reports'          },
  { to: '/user-management',  icon: UserCog,         label: 'User Management'      },
  { to: '/orders',           icon: ShoppingCart,    label: 'Orders'               },
  { to: '/settings',         icon: Settings,        label: 'Settings'             },
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

        {/* Logo — teal background so white logo is visible */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100 shrink-0 bg-brand">
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
            <p className="font-display font-bold text-white text-sm">AdoraCoatings</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/70 hover:text-white p-1">
            <X size={16} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) => cn('nav-link', isActive && 'active')}
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 pb-3 pt-2 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
              {user?.name?.[0] ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate capitalize">{user?.name}</p>
              <p className="text-[10px] text-gray-400 truncate capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="nav-link w-full text-red-400 hover:text-red-600 hover:bg-red-50">
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* The Raise */}
        <div className="px-4 py-3 border-t border-gray-100 shrink-0 flex flex-col items-center gap-1">
          <p className="text-[9px] text-gray-400 uppercase tracking-widest font-medium">Powered by</p>
          <img
            src={`${import.meta.env.BASE_URL}the-raise-logo.png`}
            alt="The Raise"
            className="h-5 object-contain opacity-80 hover:opacity-100 transition-opacity"
          />
          <p className="text-[9px] text-gray-400 font-medium tracking-wide">KEJ IT Solutions</p>
        </div>
      </aside>
    </>
  )
}
