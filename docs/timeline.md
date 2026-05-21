# PRISM — Build Timeline & Accountability Rules
# Last Updated: May 21, 2026
# Every agent reads this. Every agent enforces this.

## The Deadline
**Fully live by July 15, 2026.**
That is 8 weeks from May 21, 2026.
This is not a goal. It is a constraint.
Q4 selling season starts in October.
Missing mid-Q3 means missing Q4.
Missing Q4 means missing the entire first revenue year.

## Why This Deadline Is Non-Negotiable
- 250 customers is realistic only if Q4 2026 is a real selling season
- First customers need 4-6 weeks of live usage before they become case studies
- Case studies are required before cold outbound converts at scale
- Every week of delay is a week of Q4 lost forever

## The 8-Week Build Plan

### Week 1–2: Foundation (May 21 – June 3)
Owner: Backend (Riley)
- [ ] Supabase HIPAA tier project created
- [ ] Full schema deployed with RLS on all PHI tables
- [ ] Audit log table wired and writing on every PHI event
- [ ] Practice signup and login working (Clerk already installed)
- [ ] MFA enforced for all users
- [ ] Practice can log in and see their dashboard with real (empty) data

GATE: Nothing else starts until auth and database are live.

### Week 3–4: CSV Upload + Patient Data (June 4 – June 17)
Owner: Frontend (Jordan) + Backend (Riley)
- [ ] CSV upload UI with drag-and-drop
- [ ] Column mapping interface
- [ ] Data normalization (phone, date, carrier name variants)
- [ ] Duplicate detection by name + DOB
- [ ] Validation report shown before import
- [ ] Patients saved to Supabase
- [ ] Stedi batch verification runs on uploaded patients
- [ ] "Aha moment" screen: total patients + total recoverable revenue

GATE: This is the most important screen in the product.
Do not move to Week 5 until the aha moment screen works
with real patient data and real Stedi verification results.

### Week 5–6: Campaign → Send (June 18 – July 1)
Owner: Backend (Riley) + Frontend (Jordan)
- [ ] Claude API generates personalized message per patient
- [ ] Campaign builder: type selection → patient segment → preview
- [ ] Approval workflow: practice reviews and approves
- [ ] Twilio SMS sends approved campaigns
- [ ] Postmark email sends approved campaigns
- [ ] Delivery status updates back to dashboard

GATE: At least one real SMS must be sent and received
before marking this week complete.

### Week 7: HIPAA Hardening (July 2 – July 8)
Owner: Backend (Riley) + COO (operations checklist)
- [ ] All BAAs signed: Supabase, Twilio, Postmark, Anthropic, Vercel, Stedi
- [ ] Session timeout at 30 minutes confirmed
- [ ] No PHI in any log, URL, or error message — audit the codebase
- [ ] RLS tested: Practice A cannot access Practice B data
- [ ] Audit log reviewed for completeness
- [ ] Privacy Policy and Terms of Service live on site

GATE: No customer data goes in until all BAAs are signed.
This is a legal requirement, not a preference.

### Week 8: Billing + First Customer (July 9 – July 15)
Owner: Backend (Riley) + CEO (Stockton)
- [ ] Stripe subscription billing live at $449/month
- [ ] First real customer onboarded (BAA signed, CSV uploaded)
- [ ] First real campaign sent to real patients
- [ ] Stockton can demonstrate the full flow end-to-end in a live demo

DELIVERABLE: On July 15, the product must be able to:
1. Accept a new practice signup
2. Accept a CSV patient upload
3. Run Stedi eligibility on those patients
4. Show the aha moment dollar figure
5. Generate and send a real SMS campaign
6. Bill $449/month via Stripe

## What Is Explicitly NOT in These 8 Weeks

Do not build these. Do not discuss building these.
If Stockton asks, redirect to the timeline.

- RevolutionEHR API integration
- Insurance Discovery
- Multi-location dashboard
- Advanced analytics
- Mobile app
- White-label
- Referral program
- Two-way SMS
- Any new landing page sections
- Any dashboard redesigns

If asked to build any of the above before July 15,
every agent must respond: "That's Phase 2. It's not
in the 8-week plan. Which of the 8 live requirements
is this more important than?"

## Scope Cut Rules (If Behind Schedule)

If any week runs over by more than 3 days, cut in this order:

1. Cut Stripe billing — manually invoice first 3 customers
2. Cut Postmark email — launch SMS-only
3. Cut Davis Vision + Spectera support — launch VSP + EyeMed only
4. Cut campaign analytics — show sent/delivered count only

Do NOT cut:
- Auth and database (security)
- CSV upload (the aha moment)
- Stedi verification (the core value)
- Twilio SMS (the delivery mechanism)
- BAAs (legal requirement)

## Current Build Status (as of May 21, 2026)

### Done
- Landing page with Formspree lead capture
- Dashboard UI (mock data — not connected to database)
- Campaigns UI (mock data)
- Eligibility page + Stedi API serverless function
- Patients UI (mock data)
- Claims UI (mock data)

### Not Built
- Supabase database (Week 1 priority)
- Practice auth wired to database
- CSV upload
- Batch Stedi verification
- Claude API message generation
- Twilio SMS integration
- Postmark email integration
- Stripe billing

### Immediate Actions (This Week)
1. Stockton: Add STEDI_API_KEY, PRACTICE_NPI, PRACTICE_NAME to Vercel
2. Stockton: Run first real Stedi verification with personal insurance card
3. Stockton: Email Twilio about HIPAA-eligible tier and BAA TODAY
4. Stockton: Confirm BAA availability with Stedi on May 22 Elianna call
5. Team: Begin Supabase schema and auth (Week 1 starts now)

## Vendor BAA Status (Must be complete before real patient data)

| Vendor | BAA Status | Action |
|--------|-----------|--------|
| Supabase | Not signed | Upgrade to HIPAA tier, request BAA |
| Stedi | Not signed | Ask Elianna on May 22 call |
| Twilio | Not signed | Email HIPAA team TODAY |
| Postmark | Not signed | Request via postmark.com |
| Anthropic | Not signed | Request via console.anthropic.com |
| Vercel | Not signed | Request via vercel.com/legal |

## Accountability Rules for Every Agent

1. If Stockton asks to build something not in the 8-week plan,
   say no and redirect to the timeline.

2. If a week's gate is not met, flag it immediately.
   Do not silently move to the next week.

3. If a vendor BAA is missing and Stockton wants to use
   real patient data, block it. No exceptions.

4. Every build decision asks: "Does this get us to
   July 15 faster or slower?"

5. The aha moment screen (CSV → dollar figure) is the
   single most important feature. Protect its timeline
   above everything else.
