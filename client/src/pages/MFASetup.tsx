import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { ShieldCheck, Loader2, KeyRound } from 'lucide-react'

export default function MFASetup() {
  const navigate = useNavigate()
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')
  const [factorId, setFactorId] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [enrolling, setEnrolling] = useState(true)
  const [error, setError] = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Prizm' }).then(({ data, error }) => {
      if (error || !data) {
        setError('Could not set up two-factor authentication. Please refresh and try again.')
        setEnrolling(false)
        return
      }
      setQrCode(data.totp.qr_code)
      setSecret(data.totp.secret)
      setFactorId(data.id)
      setEnrolling(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) return
    setError('')
    setLoading(true)

    try {
      const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({ factorId })
      if (challengeErr) throw challengeErr

      const { error: verifyErr } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challenge.id,
        code,
      })
      if (verifyErr) throw verifyErr

      navigate('/app/dashboard', { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid code. Please try again.'
      setError(msg.includes('Invalid') || msg.includes('expired') ? 'Invalid code — scan the QR code again and try a fresh code.' : msg)
      setCode('')
      inputRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 shadow-lg shadow-teal-900/50 mb-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L12 19L2 19Z" /><path d="M12 2L22 19L12 19Z" fillOpacity="0.55" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">Prizm</span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/15 border border-teal-500/30">
              <ShieldCheck className="h-6 w-6 text-teal-400" />
            </div>
          </div>

          <h1 className="text-xl font-black text-white mb-1 text-center">Set up two-factor authentication</h1>
          <p className="text-sm text-slate-400 mb-6 text-center">
            HIPAA requires MFA for all accounts. Scan the QR code with your authenticator app, then enter the code below.
          </p>

          {enrolling ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 text-teal-400 animate-spin" />
            </div>
          ) : error && !qrCode ? (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 mb-4">
              <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
          ) : (
            <>
              {/* QR Code */}
              <div className="flex justify-center mb-4">
                <div className="rounded-xl bg-white p-3 shadow-lg">
                  <img
                    src={`data:image/svg+xml;utf8,${encodeURIComponent(qrCode)}`}
                    alt="MFA QR code"
                    className="h-40 w-40"
                  />
                </div>
              </div>

              {/* Recommended apps */}
              <p className="text-xs text-slate-500 text-center mb-3">
                Use Google Authenticator, Authy, or 1Password to scan
              </p>

              {/* Manual secret toggle */}
              <div className="mb-5 text-center">
                <button
                  type="button"
                  onClick={() => setShowSecret(v => !v)}
                  className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <KeyRound className="h-3 w-3" />
                  {showSecret ? 'Hide' : 'Can\'t scan? Enter manually'}
                </button>
                {showSecret && (
                  <div className="mt-2 rounded-lg bg-slate-800 px-3 py-2">
                    <p className="font-mono text-xs text-teal-400 break-all">{secret}</p>
                  </div>
                )}
              </div>

              {/* Verification input */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                    Enter the 6-digit code from your app
                  </label>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={e => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError('') }}
                    placeholder="000000"
                    maxLength={6}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-4 text-2xl font-mono text-center text-white placeholder-slate-600 tracking-[0.4em] focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                    <p className="text-sm text-red-400 text-center">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-500 py-3.5 text-sm font-bold text-white hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? 'Activating…' : 'Activate two-factor authentication'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Need help?{' '}
          <a href="mailto:stockton@prizmvision.com" className="text-teal-400 hover:text-teal-300">Contact support</a>
        </p>

      </div>
    </div>
  )
}
