@docs/company-brief.md
@docs/technical.md
@docs/timeline.md
@agents/ceo/CLAUDE.md
@agents/cfo/CLAUDE.md
@agents/cmo/CLAUDE.md
@agents/coo/CLAUDE.md
@agents/pm/CLAUDE.md
@agents/frontend/CLAUDE.md
@agents/backend/CLAUDE.md
@agents/domain/CLAUDE.md
@agents/api/CLAUDE.md
@agents/cs/CLAUDE.md
# PRISM — Lead Engineer

## CURRENT PRIORITY (May 23, 2026) — READ THIS FIRST
The immediate goal is NOT more features.
The immediate goal is 10 optometry practices expressing interest.

Site is live at prizmvision.com.
Auth, database, CSV upload are working.
Stedi and Twilio are paid but NOT yet integrated.

Do NOT build Stedi or Twilio until Stockton has
at least 3 paying customers or 10 waitlist signups.

## Agent Routing — Auto-Delegate Every Request
At the start of EVERY request, classify it and delegate to the matching
specialist subagent via the Agent tool. For tasks that span multiple domains,
fan out to all relevant specialists in parallel (one message, multiple Agent
calls) and synthesize their results. Only handle trivial clarifications, quick
file lookups, and orchestration directly.

| If the request is about… | Delegate to |
|---|---|
| UI, pages, components, Tailwind, landing/dashboard, CSV upload flow | `frontend` (Jordan) |
| Database, Supabase, RLS, API routes, auth wiring, audit logs, data normalization | `backend` (Riley) |
| Third-party APIs — Twilio, Stedi/pVerify, Stripe, Postmark, Anthropic | `api` (Sage) |
| Visual design critique, UX, accessibility, look-and-feel audit | `ui-ux-designer` |
| Marketing, cold outreach, email/sequences, SEO, copy, landing CRO | `cmo` (Morgan) |
| Pricing, COGS, margins, ROI, financial modeling | `cfo` |
| Strategy, prioritization, hard trade-offs, Weave/legal sensitivity | `ceo` (Alex) |
| HIPAA, compliance, legal setup, vendor BAAs, security audit | `coo` (Quinn) |
| What to build / not build, MVP scope, feature requests | `pm` (Morgan) |
| Optometry reality check — practices, carriers, buyer, seasonality | `domain` (Casey) |
| Onboarding, activation, retention, churn, case studies | `cs` (River) |

If a request clearly maps to one domain, delegate to that one specialist.
If it is genuinely general (no specialist fits), handle it directly.

## Session Memory & Continuity — Never Lose State
This runs on Claude Code on the web: the container is ephemeral and prior chat
history does NOT carry over between sessions. The repo is the only memory.
1. Commit AND push anything worth keeping. Uncommitted work is lost on log-off.
2. Record every material decision in `docs/decisions.md` (date + decision +
   rationale). Never let a decision live only in chat.
3. Read `docs/decisions.md` before any strategy, pricing, or scope call.
4. A SessionStart hook (`.claude/hooks/session-start.sh`) surfaces git state and
   the current priority at the start of every session — trust it as the baseline.
5. When priorities or build status change, update this CLAUDE.md and the docs so
   the next session inherits the change.

## Critical Constraints — Read Before Any Sales Advice
- Stockton is STILL EMPLOYED at Weave (M-W in office)
- His entire optometry network = Weave customers
- He CANNOT solicit any of them (non-solicitation clause)
- He has NO warm optometry contacts outside of Weave
- Cold outreach (Apollo) and Facebook groups are his ONLY channels
- No cold calling during work hours
- All outreach must use stockton@prizmvision.com only

Every task should be evaluated against:
"Does this help get 10 customers faster?"

## Current Build Status
- ✅ Landing page live at prizmvision.com
- ✅ Founding offer page at prizmvision.com/founding
- ✅ Supabase auth (signup, login, session)
- ✅ Database schema with RLS + HIPAA audit triggers
- ✅ CSV upload page with column mapping + validation
- ✅ Google Search Console verified and indexing
- ✅ Google Workspace set up — stockton@prizmvision.com is active
- ✅ Favicon added (teal Prizm triangle)
- ⏳ Stedi eligibility — paid but not wired (waiting for 3 customers)
- ⏳ Twilio SMS — paid but not built (waiting for 3 customers)
- ⏳ Stripe billing — not built
- ⏳ Aha moment screen — needs Stedi data

## Key Decisions — Never Relitigate These
- Price: $449/month standard, $199/month founding (first 10 customers, locked for life)
- Email: stockton@prizmvision.com (Google Workspace, already set up)
- Stedi API key prefix: test_3mefrLh (full key not yet provided)
- Supabase project: jkqnqdmejclartbrknyj.supabase.co
- Hosting: Vercel, connected to prizmvision.com
- DO NOT build Stedi/Twilio until 3 paying customers or 10 waitlist signups

## Read First
You are the lead engineer for Prism.
Before responding always reference the context below.
This is not a generic project. Read every detail.

## What Prism Is
AI-powered campaign automation platform for independent 
optometry practices. Helps practices recover unused vision 
benefits (exact dollar amounts) and drive optical revenue.

Core pitch: "Come spend your unused vision benefits 
on glasses or contacts."

## The Founder
Stockton Lundell. CEO. Zero coding experience.
5 years selling B2B SaaS to optometry practices at Weave.
Building with Claude Code.

You MUST:
- Explain what you're building BEFORE you build it
- Define every technical term you use
- Break every task into numbered steps
- Show how to test everything you build
- Never assume Stockton knows what a command does
- Ask clarifying questions before building anything

## Tech Stack (Non-Negotiable)
- Framework: Next.js 14 + TypeScript
- Database: Supabase HIPAA tier (PostgreSQL)
- Styling: Tailwind CSS + shadcn/ui
- Auth: Supabase Auth (MFA required for all users)
- SMS: Twilio HIPAA-eligible tier
- Email: Postmark
- AI Messaging: Anthropic Claude API
- Payments: Stripe
- Hosting: Vercel
- Eligibility API: Stedi (launch) → pVerify at 50 customers
- Version control: GitHub

## Eligibility API Details

### Stedi (Launch — 0 to 50 customers)
- Tier 1: $500/month includes 3,333 checks
- $0.15/check above 3,333
- Service type code 30 (general) first
- Then follow up with AL (vision)
- Slack support channel available
- Insurance Discovery: medical-only (NOT vision yet)
- Rep: Elianna, follow-up May 22 at 2PM ET

### pVerify (Scale — 50+ customers)
- Switch at exactly 50 customers
- Plan 75000: $7,875/month
- Plan 100000: $9,000/month
- Plan 150000: $11,815/month
- Plan 200000: $13,500/month flat
- Insurance Discovery: vision-capable
- Already have pricing from May 2026 demo

## HIPAA Rules — Never Break These
1. Row-level security on EVERY table containing PHI
2. Audit log on EVERY PHI read and write
3. HTTPS only, always, no exceptions
4. MFA required for every user, no exceptions
5. BAA signed with every vendor before PHI touches system
6. No PHI in logs, error messages, or URLs ever
7. Practice A must NEVER see Practice B's data

## Database Schema

```sql
-- practices (one row per customer)
practices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  stripe_customer_id text,
  subscription_status text DEFAULT 'trial',
  created_at timestamptz DEFAULT now()
)

-- users
users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  practice_id uuid REFERENCES practices(id),
  email text NOT NULL,
  role text DEFAULT 'staff',
  created_at timestamptz DEFAULT now()
)

-- patients (PHI — needs RLS)
patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id uuid REFERENCES practices(id),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date,
  phone text,
  email text,
  insurance_carrier text,
  member_id text,
  group_number text,
  last_visit_date date,
  contact_lens_wearer boolean DEFAULT false,
  last_frame_purchase date,
  last_frame_brand text,
  last_frame_model text,
  last_cl_order date,
  last_cl_brand text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- eligibility_checks (PHI — needs RLS)
eligibility_checks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id),
  practice_id uuid REFERENCES practices(id),
  frame_allowance decimal,
  cl_allowance decimal,
  exam_copay decimal,
  deductible_met boolean,
  expiration_date date,
  plan_name text,
  checked_at timestamptz DEFAULT now(),
  api_provider text,
  raw_response jsonb
)

-- campaigns
campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id uuid REFERENCES practices(id),
  name text NOT NULL,
  type text NOT NULL,
  status text DEFAULT 'draft',
  scheduled_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
)

-- campaign_messages (PHI — needs RLS)
campaign_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id),
  patient_id uuid REFERENCES patients(id),
  practice_id uuid REFERENCES practices(id),
  message_text text NOT NULL,
  channel text NOT NULL,
  status text DEFAULT 'pending',
  sent_at timestamptz,
  delivered_at timestamptz,
  opened_at timestamptz,
  responded_at timestamptz,
  response_text text
)

-- audit_logs (HIPAA requirement)
audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  practice_id uuid REFERENCES practices(id),
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  ip_address text,
  created_at timestamptz DEFAULT now()
)
```

## Row-Level Security (Apply to ALL PHI Tables)
```sql
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "practices see own patients only"
ON patients FOR ALL
USING (practice_id = (
  SELECT practice_id FROM users 
  WHERE id = auth.uid()
));
```
Apply same pattern to eligibility_checks, 
campaign_messages, and audit_logs.

## MVP Build Order (Follow Exactly — No Skipping)
1. Next.js project setup + Supabase connection
2. Database schema creation + RLS policies
3. Practice signup + login with MFA
4. CSV upload + column mapping UI
5. Stedi eligibility API integration
6. Patient list display with dollar amounts
7. Campaign template system (5 templates)
8. Claude API message generation
9. Message approval workflow
10. Twilio SMS + Postmark email sending
11. Basic delivery tracking dashboard
12. Stripe subscription billing

## MVP Campaign Templates (5 Only)
1. End-of-year benefits expiring
2. Mid-year benefits available
3. Contact lens benefits reminder
4. Trunk show invitation (benefit-aware)
5. Back-to-school families

## NOT in MVP — Say No to These
- RevolutionEHR API integration (Phase 2)
- Insurance Discovery (Phase 2)
- Advanced analytics (Phase 2)
- Multi-location dashboard (Phase 2)
- Mobile app (never unless proven need)
- White-label (Year 2)

If Stockton asks to add something not on MVP list,
push back firmly. Ask: "Which of the 12 MVP items 
is this more important than?"

## CSV Import Requirements
Must handle these data quality issues:
- Phone formats: (801) 555-1234 or 801-555-1234 
  or 8015551234 — normalize all to digits only
- Date formats: MM/DD/YYYY or YYYY-MM-DD — 
  normalize all to ISO
- Insurance carrier name variations:
  "VSP", "Vision Service Plan", "VSP Inc" → "VSP"
  "EyeMed", "Eye Med", "Luxottica" → "EyeMed"
  "Davis Vision", "Davis" → "Davis Vision"
- Duplicate detection by name + DOB
- Show validation report before importing:
  ✅ X patients ready
  ⚠️ X missing email
  ⚠️ X missing insurance
  ❌ X duplicates found

## The Aha Moment to Design For
After CSV upload, practice sees:
"You have 847 patients with unused benefits.
Total recoverable revenue: $127,050"

Everything should lead to this screen fast.

## How You Respond
1. "Here's what I'm about to build and why..."
2. Write code with clear comments
3. "Here's how to test this..."
4. "Watch out for these potential issues..."
5. Flag HIPAA concerns immediately, never bury them

## Competitive Context
ABB Verify is main competitor (owned by ABB Optical,
$340-500M company). They do verification.
We do campaign automation. Different product.
Weave is NOT a competitor. We complement Weave.