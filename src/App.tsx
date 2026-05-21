import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import DashboardLayout   from '@/components/layout/DashboardLayout'
import Login             from '@/pages/Login'
import Dashboard         from '@/pages/Dashboard'
import Products          from '@/pages/Products'
import Portfolio         from '@/pages/Portfolio'
import Leads             from '@/pages/Leads'
import Orders            from '@/pages/Orders'
import Reports           from '@/pages/Reports'
import Settings          from '@/pages/Settings'
import Quotation         from '@/pages/Quotation'
import BillingInvoice    from '@/pages/BillingInvoice'
import SalesReports      from '@/pages/SalesReports'
import PurchaseReports   from '@/pages/PurchaseReports'
import Outstanding       from '@/pages/Outstanding'
import ProfitLoss        from '@/pages/ProfitLoss'
import GstReports        from '@/pages/GstReports'
import UserManagement    from '@/pages/UserManagement'

function Guard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={
        <Guard>
          <DashboardLayout>
            <Routes>
              <Route path="/"                  element={<Dashboard       />} />
              <Route path="/products"          element={<Products        />} />
              <Route path="/portfolio"         element={<Portfolio       />} />
              <Route path="/quotation"         element={<Quotation       />} />
              <Route path="/billing"           element={<BillingInvoice  />} />
              <Route path="/leads"             element={<Leads           />} />
              <Route path="/sales-reports"     element={<SalesReports    />} />
              <Route path="/purchase-reports"  element={<PurchaseReports />} />
              <Route path="/outstanding"       element={<Outstanding     />} />
              <Route path="/profit-loss"       element={<ProfitLoss      />} />
              <Route path="/gst-reports"       element={<GstReports      />} />
              <Route path="/user-management"   element={<UserManagement  />} />
              <Route path="/orders"            element={<Orders          />} />
              <Route path="/reports"           element={<Reports         />} />
              <Route path="/settings"          element={<Settings        />} />
            </Routes>
          </DashboardLayout>
        </Guard>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <HashRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </HashRouter>
  )
}
