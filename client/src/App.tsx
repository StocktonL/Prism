import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import Eligibility from './pages/Eligibility'
import Patients from './pages/Patients'
import Campaigns from './pages/Campaigns'
import Claims from './pages/Claims'
import Founding from './pages/Founding'

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPublishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable')
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isDemoMode = localStorage.getItem('prizm_demo') === 'true'
  if (isDemoMode) return <>{children}</>
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <BrowserRouter>
        <Routes>
          {/* Public landing page */}
          <Route path="/" element={<Landing />} />
          <Route path="/founding" element={<Founding />} />

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
            <Route path="campaigns" element={<Campaigns />} />
            <Route path="claims" element={<Claims />} />
          </Route>

          {/* Legacy routes — redirect to /app equivalents */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/eligibility" element={<Navigate to="/app/eligibility" replace />} />
          <Route path="/patients" element={<Navigate to="/app/patients" replace />} />
          <Route path="/campaigns" element={<Navigate to="/app/campaigns" replace />} />
          <Route path="/claims" element={<Navigate to="/app/claims" replace />} />
        </Routes>
      </BrowserRouter>
    </ClerkProvider>
  )
}
