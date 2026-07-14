import { useEffect } from 'react'
import SiteNav from '../components/SiteNav'

export default function PrivacyPolicy() {
  useEffect(() => {
    document.title = 'Privacy Policy — Prizm'
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteNav />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-xs text-slate-500 mb-12">Last updated: May 2026</p>

        <div className="space-y-8 text-sm text-slate-600 leading-relaxed">

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">Overview</h2>
            <p>
              Prizm ("we," "us," or "our") is a HIPAA-compliant software platform built exclusively
              for independent optometry practices. We take the privacy and security of patient health
              information seriously. This Privacy Policy describes how we collect, use, and protect
              information in connection with our services.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">HIPAA Compliance</h2>
            <p className="mb-3">
              Prizm is designed and operated in accordance with the Health Insurance Portability and
              Accountability Act (HIPAA). We function as a Business Associate to the optometry
              practices we serve, and we require a signed Business Associate Agreement (BAA) before
              any protected health information (PHI) enters our system.
            </p>
            <p>
              All PHI processed through Prizm is handled in accordance with HIPAA's Privacy Rule and
              Security Rule. We maintain technical, administrative, and physical safeguards appropriate
              to the sensitivity of health information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">Data Encryption</h2>
            <p>
              All patient data stored in Prizm is encrypted at rest using AES-256 encryption. All
              data transmitted between your browser, our servers, and third-party integrations is
              encrypted in transit using TLS 1.2 or higher. We do not transmit PHI over unencrypted
              connections under any circumstances.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">How We Use Patient Data</h2>
            <p className="mb-3">
              Patient information uploaded to Prizm is used solely to facilitate benefit verification
              and outreach campaigns on behalf of the optometry practice that owns the patient
              relationship. Specifically, we use patient data to:
            </p>
            <ul className="list-disc ml-6 space-y-1">
              <li>Verify vision benefit eligibility with insurance carriers via our eligibility API partners</li>
              <li>Generate personalized campaign messages tailored to each patient's benefit status</li>
              <li>Send SMS and email campaigns through HIPAA-eligible communication channels</li>
              <li>Track message delivery and patient response on behalf of the practice</li>
            </ul>
            <p className="mt-3">
              We do not sell patient data, share it with third parties for marketing purposes, or use
              it for any purpose outside of providing services to the practice that uploaded it. Each
              practice's patient data is logically isolated — Practice A cannot access Practice B's data.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">Data Retention</h2>
            <p>
              Patient data is retained for as long as a practice maintains an active subscription with
              Prizm, plus any period required by applicable law. Upon cancellation, practices may
              request deletion of their data. We will complete deletion within 30 days of a confirmed
              written request.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">Your Rights</h2>
            <p>
              Patients whose information has been uploaded to Prizm by an optometry practice may
              contact that practice directly regarding their rights under HIPAA, including the right
              to access, amend, or restrict use of their PHI. Prizm will cooperate with practices in
              fulfilling these requests.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-slate-900 mb-3">Contact Us</h2>
            <p>
              For questions about this Privacy Policy or how your information is handled, please contact
              us at{' '}
              <a
                href="mailto:stockton@prizmvision.com"
                className="text-teal-700 hover:text-teal-800 underline underline-offset-2 transition-colors"
              >
                stockton@prizmvision.com
              </a>
              . We respond to all privacy inquiries within 2 business days.
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
