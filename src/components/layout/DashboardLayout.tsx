import { useState, ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const TITLES: Record<string, string> = {
  '/':                  'Dashboard',
  '/products':          'Products & Inventory',
  '/portfolio':         'Portfolio',
  '/quotation':         'Quotation',
  '/billing':           'Billing / Invoice',
  '/leads':             'Lead Generation',
  '/sales-reports':     'Sales Reports',
  '/purchase-reports':  'Purchase Reports',
  '/outstanding':       'Outstanding',
  '/profit-loss':       'Profit & Loss',
  '/gst-reports':       'GST Reports',
  '/user-management':   'User Management',
  '/clients':           'B2B & B2C Clients',
  '/inventory':         'Stock & Inventory',
  '/orders':            'Orders',
  '/reports':           'Reports',
  '/settings':          'Settings',
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: 'var(--bg-main)' }}>
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenu={() => setOpen(true)} title={TITLES[loc.pathname] ?? 'AdoraCoatings'} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
