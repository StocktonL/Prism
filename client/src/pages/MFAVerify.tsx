import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { ShieldCheck, Loader2 } from 'lucide-react'

export default function MFAVerify() {
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) return
    setError('')
    setLoading(true)

    try {
      const { data: factors } = await supabase.auth.mfa.listFactors()
      const totpFactor = factors?.totp?.[0]
      if (!totpFactor) throw new Error('No authenticator found. Please contact support.')

      const { data: challenge, error: challengeErr } = await supabase.auth.mfa.challenge({ factorId: totpFactor.id })
      if (challengeErr) throw challengeErr

      const { error: verifyErr } = await supabase.auth.mfa.verify({
        factorId: totpFactor.id,
        challengeId: challenge.id,
        code,
      })
      if (verifyErr) throw verifyErr

      navigate('/app/dashboard', { replace: true })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid code. Please try again.'
      setError(msg.includes('Invalid') || msg.includes('expired') ? 'Invalid code — check your authenticator app and try again.' : msg)
      setCode('')
      inputRef.current?.focus()
    } finally {
      setLoading(false)
    }
  }

  function handleCodeChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 6)
    setCode(digits)
    setError('')
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

          <h1 className="text-xl font-black text-white mb-1 text-center">Two-factor verification</h1>
          <p className="text-sm text-slate-400 mb-6 text-center">
            Open your authenticator app and enter the 6-digit code.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 text-center">
                Authentication code
              </label>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={e => handleCodeChange(e.target.value)}
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
              {loading ? 'Verifying…' : 'Verify'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Lost access to your authenticator?{' '}
          <a href="mailto:stockton@prizmvision.com" className="text-teal-400 hover:text-teal-300">Contact support</a>
        </p>

      </div>
    </div>
  )
}
