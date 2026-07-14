import { useEffect } from 'react'
import SiteNav from '../components/SiteNav'

export default function TermsOfService() {
  useEffect(() => {
    document.title = 'Terms of Service — Prizm'
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteNav />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-2">Terms of Service</h1>
        <p className="text-xs text-slate-500 mb-12">Last updated: May 2026</p>

        <div className="space-y-8 text-sm text-slate-600 leading-relaxed">

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">Agreement to Terms</h2>
            <p>
              By signing up for or using Prizm ("Service"), you ("Practice" or "Customer") agree to
              these Terms of Service. Prizm is operated by Prizm Health, LLC. These Terms govern your
              access to and use of the Prizm platform for vision benefit campaign automation.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">Subscription and Billing</h2>
            <p className="mb-3">
              Prizm is offered as a monthly subscription service. The standard subscription rate is
              $449 per month. Founding customers who signed up under the founding offer are billed at
              the rate specified in their agreement for the duration of their commitment period.
            </p>
            <p className="mb-3">
              Billing begins when your practice account is activated and your first campaign is ready
              to send — not at the time of signup. Monthly fees are billed in advance via the payment
              method on file. Failed payments will result in a 7-day grace period before service is
              suspended.
            </p>
            <p>
              Annual commitment customers agree to a 12-month minimum term. Month-to-month customers
              may cancel at any time with 30 days' written notice. No partial-month refunds are
              issued except at our sole discretion.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">HIPAA Compliance Obligations</h2>
            <p className="mb-3">
              A signed Business Associate Agreement (BAA) is required before any protected health
              information (PHI) may be uploaded to or processed by Prizm. You agree not to upload
              any patient data until a BAA is fully executed between your practice and Prizm.
            </p>
            <p>
              You represent that your practice is a HIPAA-covered entity and that you have the
              authority to enter into a BAA. You are responsible for ensuring that patient outreach
              conducted through Prizm complies with applicable HIPAA regulations, including obtaining
              any required patient consents for communications.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">Data Handling</h2>
            <p className="mb-3">
              Prizm processes patient data solely on your behalf and in accordance with your
              instructions and the executed BAA. We do not sell, rent, or share your patient data
              with third parties except as necessary to provide the Service (e.g., eligibility API
              providers, SMS delivery, email delivery) and only under HIPAA-compliant agreements.
            </p>
            <p>
              You retain ownership of all patient data uploaded to Prizm. Upon termination of your
              subscription, you may request a data export within 30 days. After that period, we will
              securely delete your data in accordance with HIPAA requirements.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">Acceptable Use</h2>
            <p className="mb-3">
              You agree to use Prizm only for lawful patient outreach on behalf of your optometry
              practice. You may not use the Service to send unsolicited messages, circumvent opt-out
              requests, or violate TCPA or CAN-SPAM regulations. You are responsible for maintaining
              accurate patient contact information and honoring all patient opt-out requests immediately.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">Limitation of Liability</h2>
            <p>
              Prizm is provided "as is." To the fullest extent permitted by law, Prizm's total
              liability to you for any claim arising out of or related to these Terms or the Service
              shall not exceed the total fees paid by you in the three months preceding the claim.
              We are not liable for indirect, incidental, consequential, or punitive damages of any
              kind, including lost revenue or lost patient relationships.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">Changes to Terms</h2>
            <p>
              We may update these Terms from time to time. Material changes will be communicated by
              email at least 30 days before they take effect. Continued use of the Service after
              changes take effect constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">Contact</h2>
            <p>
              Questions about these Terms should be directed to{' '}
              <a
                href="mailto:stockton@prizmvision.com"
                className="text-teal-700 hover:text-teal-800 underline underline-offset-2 transition-colors"
              >
                stockton@prizmvision.com
              </a>
              .
            </p>
          </section>

        </div>
      </div>

      <footer className="border-t border-slate-200 px-6 py-8 text-center">
        <p className="text-xs text-slate-500">© 2026 Prizm · <a href="mailto:stockton@prizmvision.com" className="hover:text-slate-700 transition-colors">stockton@prizmvision.com</a></p>
      </footer>
    </div>
  )
}
