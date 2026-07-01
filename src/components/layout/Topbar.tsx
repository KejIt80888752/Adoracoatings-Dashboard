import { useState, useRef, useEffect } from 'react'
import { Menu, Bell, Search, Sun, Moon, Package, IndianRupee, Users, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useDarkMode } from '@/hooks/useDarkMode'

const NOTIFICATIONS = [
  { id:1, type:'stock',   icon: Package,     color:'text-orange-500', bg:'bg-orange-50',   title:'Low Stock Alert',         msg:'CERACAP CHIC only 2 Ltrs left in Godown',      time:'Just now',   unread:true  },
  { id:2, type:'payment', icon: IndianRupee, color:'text-red-500',    bg:'bg-red-50',      title:'Pending Payment',          msg:'YUKI PAN ASIAN — ₹7,422 still pending',         time:'2 hrs ago',  unread:true  },
  { id:3, type:'stock',   icon: Package,     color:'text-orange-500', bg:'bg-orange-50',   title:'Out of Stock',             msg:'CALYPSO CHIC — 0 units in both locations',      time:'Today',      unread:true  },
  { id:4, type:'payment', icon: IndianRupee, color:'text-yellow-600', bg:'bg-yellow-50',   title:'Pending Amount',           msg:'ARYAN INTERIORS — ₹117 balance pending',        time:'Yesterday',  unread:false },
  { id:5, type:'lead',    icon: Users,       color:'text-brand',      bg:'bg-brand-50',    title:'New Lead Synced',          msg:'ENSEMBLE — Meeting Fixed, follow up needed',     time:'2 days ago', unread:false },
]

interface Props { onMenu: () => void; title: string }

export default function Topbar({ onMenu, title }: Props) {
  const { user }              = useAuth()
  const { dark, toggle }      = useDarkMode()
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs]   = useState(NOTIFICATIONS)
  const ref = useRef<HTMLDivElement>(null)

  const unreadCount = notifs.filter(n => n.unread).length

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, unread: false })))
  const dismiss = (id: number) => setNotifs(n => n.filter(x => x.id !== id))

  return (
    <header className="h-14 flex items-center gap-3 px-4 lg:px-6 sticky top-0 z-10 shrink-0 transition-colors"
      style={{ backgroundColor: 'var(--bg-card)', borderBottom: '1px solid var(--border-2)', boxShadow: 'var(--shadow)' }}>

      {/* Hamburger */}
      <button onClick={onMenu} className="lg:hidden p-1.5 transition-colors" style={{ color: 'var(--text-3)' }}>
        <Menu size={20} />
      </button>

      {/* Title */}
      <h1 className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>{title}</h1>

      {/* Search */}
      <div className="flex-1 max-w-xs hidden md:block ml-3">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-4)' }} />
          <input placeholder="Search..." className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs focus:outline-none transition-all"
            style={{ background: 'var(--bg-card2)', border: '1px solid var(--border-2)', color: 'var(--text-2)' }} />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">

        {/* Dark / Light toggle */}
        <button onClick={toggle} title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-2 rounded-lg transition-all hover:scale-110"
          style={{ background: dark ? 'rgba(184,215,93,0.15)' : 'rgba(74,124,31,0.08)', color: dark ? '#b5db69' : '#4a7c1f' }}>
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notification Bell */}
        <div className="relative" ref={ref}>
          <button onClick={() => setNotifOpen(o => !o)}
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: notifOpen ? '#4a7c1f' : 'var(--text-3)', background: notifOpen ? '#f2f9e8' : 'transparent' }}>
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-[9px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-10 w-80 rounded-xl overflow-hidden z-50 shadow-2xl"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-2)' }}>

              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3"
                style={{ borderBottom: '1px solid var(--border-2)' }}>
                <div>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-1)' }}>Notifications</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-4)' }}>{unreadCount} unread</p>
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[11px] text-brand font-medium hover:underline">
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-72 overflow-y-auto divide-y" style={{ borderColor: 'var(--border)' }}>
                {notifs.length === 0 && (
                  <div className="py-8 text-center text-sm" style={{ color: 'var(--text-4)' }}>
                    <Bell size={24} className="mx-auto mb-2 opacity-30" />
                    No notifications
                  </div>
                )}
                {notifs.map(n => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 relative transition-colors"
                    style={{ background: n.unread ? (dark ? 'rgba(74,124,31,0.08)' : '#f8fdf3') : 'transparent' }}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${n.bg}`}>
                      <n.icon size={14} className={n.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold" style={{ color: 'var(--text-1)' }}>{n.title}</p>
                      <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-3)' }}>{n.msg}</p>
                      <p className="text-[10px] mt-1" style={{ color: 'var(--text-4)' }}>{n.time}</p>
                    </div>
                    {n.unread && <span className="w-2 h-2 rounded-full bg-brand shrink-0 mt-1.5" />}
                    <button onClick={() => dismiss(n.id)} className="absolute top-2 right-2 opacity-0 hover:opacity-100 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--text-4)' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 text-center" style={{ borderTop: '1px solid var(--border-2)' }}>
                <button className="text-xs text-brand font-medium hover:underline">View all alerts</button>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-2 pl-2" style={{ borderLeft: '1px solid var(--border-2)' }}>
          <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-xs font-bold uppercase shrink-0">
            {user?.name?.[0] ?? 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium capitalize" style={{ color: 'var(--text-1)' }}>{user?.name}</p>
            <p className="text-[10px] capitalize" style={{ color: 'var(--text-4)' }}>{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
