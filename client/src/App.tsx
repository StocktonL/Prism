import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './lib/auth'
import { supabase } from './lib/supabase'
import AppLayout from './layouts/AppLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Founding from './pages/Founding'
import Dashboard from './pages/Dashboard'
import Eligibility from './pages/Eligibility'
import Patients from './pages/Patients'
import Campaigns from './pages/Campaigns'
import Upload from './pages/Upload'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import ForgotPassword from './pages/ForgotPassword'
import Checklist from './pages/Checklist'
import Sitemap from './pages/Sitemap'
import MFAVerify from './pages/MFAVerify'
import MFASetup from './pages/MFASetup'

function Spinner() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="h-6 w-6 rounded-full border-2 border-teal-500 border-t-transparent animate-spin" />
    </div>
  )
}

// Requires full aal2 session (password + MFA). Redirects to setup/verify if not met.
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  const [mfaStatus, setMfaStatus] = useState<'checking' | 'ok' | 'needs-verify' | 'needs-setup'>('checking')

  useEffect(() => {
    if (loading || !session) { setMfaStatus('ok'); return }
    supabase.auth.mfa.getAuthenticatorAssuranceLevel().then(({ data }) => {
      if (!data) { setMfaStatus('ok'); return }
      if (data.nextLevel === 'aal2' && data.currentLevel !== 'aal2') {
        setMfaStatus('needs-verify')
      } else if (data.nextLevel === 'aal1') {
        setMfaStatus('needs-setup')
      } else {
        setMfaStatus('ok')
      }
    })
  }, [session, loading])

  if (loading || (session && mfaStatus === 'checking')) return <Spinner />
  if (!session) return <Navigate to="/login" replace />
  if (mfaStatus === 'needs-verify') return <Navigate to="/mfa-verify" replace />
  if (mfaStatus === 'needs-setup') return <Navigate to="/mfa-setup" replace />
  return <>{children}</>
}

// Requires any session (aal1 is fine). Used for MFA setup/verify pages.
function SessionRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <Spinner />
  if (!session) return <Navigate to="/login" replace />
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
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/checklist" element={<Checklist />} />
      <Route path="/sitemap-page" element={<Sitemap />} />

      {/* MFA flow — requires aal1 session, not aal2 */}
      <Route path="/mfa-verify" element={<SessionRoute><MFAVerify /></SessionRoute>} />
      <Route path="/mfa-setup" element={<SessionRoute><MFASetup /></SessionRoute>} />

      {/* Protected app — requires aal2 (password + MFA) */}
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
      </Route>

      {/* Legacy redirects */}
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/eligibility" element={<Navigate to="/app/eligibility" replace />} />
      <Route path="/patients" element={<Navigate to="/app/patients" replace />} />
      <Route path="/campaigns" element={<Navigate to="/app/campaigns" replace />} />
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
