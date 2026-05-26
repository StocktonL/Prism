import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import AppLayout from './layouts/AppLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Founding from './pages/Founding'
import Dashboard from './pages/Dashboard'
import Eligibility from './pages/Eligibility'
import Patients from './pages/Patients'
import Campaigns from './pages/Campaigns'
import Claims from './pages/Claims'
import Upload from './pages/Upload'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import ForgotPassword from './pages/ForgotPassword'
import Checklist from './pages/Checklist'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const isDemoMode = localStorage.getItem('prizm_demo') === 'true'

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="h-6 w-6 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!session && !isDemoMode) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/founding" element={<Founding />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogPost />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/checklist" element={<Checklist />} />

      {/* Protected app */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="eligibility" element={<Eligibility />} />
        <Route path="patients" element={<Patients />} />
        <Route path="patients/upload" element={<Upload />} />
        <Route path="campaigns" element={<Campaigns />} />
        <Route path="claims" element={<Claims />} />
      </Route>

      {/* Legacy redirects */}
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/eligibility" element={<Navigate to="/app/eligibility" replace />} />
      <Route path="/patients" element={<Navigate to="/app/patients" replace />} />
      <Route path="/campaigns" element={<Navigate to="/app/campaigns" replace />} />
      <Route path="/claims" element={<Navigate to="/app/claims" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  )
}
