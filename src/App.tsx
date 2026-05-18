import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/hooks/useAuth'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Login     from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Products  from '@/pages/Products'
import Portfolio from '@/pages/Portfolio'
import Leads     from '@/pages/Leads'
import Orders    from '@/pages/Orders'
import Reports   from '@/pages/Reports'
import Settings  from '@/pages/Settings'

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
              <Route path="/"          element={<Dashboard />} />
              <Route path="/products"  element={<Products  />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/leads"     element={<Leads     />} />
              <Route path="/orders"    element={<Orders    />} />
              <Route path="/reports"   element={<Reports   />} />
              <Route path="/settings"  element={<Settings  />} />
            </Routes>
          </DashboardLayout>
        </Guard>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}
