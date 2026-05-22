import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { ShieldCheck, Eye, EyeOff, Loader2, CheckCircle2 } from 'lucide-react'

interface FormState {
  practiceName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

const STEPS = ['Account', 'Practice', 'Done'] as const

export default function Signup() {
  const navigate = useNavigate()
  const [step, setStep] = useState<0 | 1 | 2>(0)
  const [form, setForm] = useState<FormState>({
    practiceName: '', email: '', phone: '', password: '', confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof FormState, value: string) {
    setForm(f => ({ ...f, [field]: value }))
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (step === 0) {
      if (!form.email || !form.password) return setError('Email and password are required.')
      if (form.password.length < 8) return setError('Password must be at least 8 characters.')
      if (form.password !== form.confirmPassword) return setError('Passwords do not match.')
      setStep(1)
      return
    }

    if (step === 1) {
      if (!form.practiceName) return setError('Practice name is required.')
      setLoading(true)

      try {
        // signUp passes practice info as metadata — a database trigger
        // (handle_new_user) automatically creates the practice and user
        // rows server-side, so this works even with email confirmation on.
        const { error: authError } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            data: {
              practice_name: form.practiceName,
              practice_phone: form.phone || null,
            },
          },
        })
        if (authError) throw authError

        setStep(2)
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.'
        setError(msg)
      } finally {
        setLoading(false)
      }
    }
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-500/30">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">You're in.</h1>
          <p className="text-slate-400 mb-2">
            Check your email — we sent a confirmation link to <span className="text-white font-medium">{form.email}</span>.
          </p>
          <p className="text-sm text-slate-500 mb-8">
            Click the link to verify your email, then come back and sign in.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full rounded-xl bg-teal-500 py-3 text-sm font-bold text-white hover:bg-teal-400 transition-colors"
          >
            Go to sign in
          </button>
          <p className="mt-4 text-xs text-slate-600">
            Didn't get the email? Check spam, or{' '}
            <button onClick={() => setStep(0)} className="text-teal-500 hover:underline">start over</button>.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-600 shadow-lg shadow-teal-900/50 mb-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 19h20L12 2zm0 4l7 13H5L12 6z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">Prizm</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                i < step ? 'bg-teal-500 text-white' :
                i === step ? 'bg-teal-500 text-white' :
                'bg-white/10 text-slate-500'
              }`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium ${i === step ? 'text-white' : 'text-slate-500'}`}>{label}</span>
              {i < STEPS.length - 1 && <div className="h-px w-6 bg-white/10" />}
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h1 className="text-xl font-black text-white mb-1">
            {step === 0 ? 'Create your account' : 'Tell us about your practice'}
          </h1>
          <p className="text-sm text-slate-400 mb-6">
            {step === 0
              ? 'You\'ll use this to log in. We\'ll send a verification email.'
              : 'This is what patients will see when they receive messages from you.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {step === 0 && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="you@yourpractice.com"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={form.password}
                      onChange={e => set('password', e.target.value)}
                      placeholder="Min 8 characters"
                      required
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 pr-10 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Confirm password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={e => set('confirmPassword', e.target.value)}
                    placeholder="Repeat password"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
              </>
            )}

            {step === 1 && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Practice name</label>
                  <input
                    type="text"
                    value={form.practiceName}
                    onChange={e => set('practiceName', e.target.value)}
                    placeholder="Mountain View Eye Care"
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                  <p className="mt-1 text-xs text-slate-500">This appears in every patient message.</p>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Practice phone <span className="text-slate-500 font-normal">(optional)</span></label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="(801) 555-0123"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500 transition-colors"
                  />
                </div>
              </>
            )}

            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-500 py-3.5 text-sm font-bold text-white hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {step === 0 ? 'Continue' : loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <p className="text-xs text-slate-500">HIPAA-compliant · Encrypted · Secured</p>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium">Sign in</Link>
        </p>

      </div>
    </div>
  )
}
