# PRISM — Master Company Brief
# Last Updated: May 2026
# Every agent reads this before responding

## What Prism Is
AI-powered campaign automation platform for independent
optometry practices. Helps practices recover unused vision
benefits (exact dollar amounts) and drive optical revenue
through targeted patient campaigns.

## The Core Pitch
"Year-round patient campaigns that drive optical revenue."
Primary message: "Come spend your unused vision benefits
on glasses or contacts."

## What Makes Us Different
1. EXACT dollar amounts in messages
   ("You have $150 in frame benefits expiring Dec 31")
2. Insurance Discovery (find insurance patients
   don't know they have — pVerify, vision-capable)
3. 15+ campaign types year-round
4. AI-personalized per patient not templated blasts
5. NOT a recall tool
6. NOT competing with Weave on generic communication

## Why Optometry Only
Only vertical where model works:
- Hardware (frames/contacts) FULLY covered by insurance
- High margins (40-60% on optical)
- Annual reset deadlines create urgency
- Patient gets free money not partial subsidy
- Dental does NOT work (patients pay out of pocket)
- Audiology does NOT work (same problem)

## The Buyer
Practice MANAGER or OWNER
NOT the OD doctor
NOT front desk staff
The person who looks at monthly revenue reports

## Pricing
$449/month flat. Single tier. Everything included.
Founding customers: $199/month for 6 months
(first 10 customers, annual commit required)
Price floor: never go below $299

## API Strategy

### Phase 1 — Stedi (Launch to 50 customers)
Tier 1: $500/month includes 3,333 checks
$0.15/check above 3,333
Service type: code 30 first, then AL for vision
Rep: Elianna
Follow-up: Friday May 22 at 2PM ET
Slack support channel available
Insurance Discovery: medical-only NOT vision yet

### Phase 2 — pVerify (50+ customers)
Switch trigger: exactly 50 customers
Plan 75000: $7,875/month
Plan 100000: $9,000/month
Plan 150000: $11,815/month
Plan 200000: $13,500/month flat
Insurance Discovery: vision-capable
Pricing confirmed from May 2026 demo

## Financial Model
1,500 verification checks per customer per month

Customers | MRR      | Gross Profit | Margin
10        | $3,990   | $1,200       | 30%
25        | $9,975   | $3,000       | 30%
50        | $19,950  | $8,750       | 44%
75        | $29,925  | $18,000      | 60%
100       | $39,900  | $25,500      | 64%
150       | $59,850  | $39,935      | 67%
200       | $79,800  | $55,500      | 70%

Salary formula: 40-50% of gross profit
$300K salary needs approximately 200 customers
$200K salary needs approximately 150 customers
Timeline to 200 customers: 24-30 months

## Margin Improvement Levers
1. Raise price to $449-499 (test after 10 customers)
2. Smart verification caching (cut checks 30-50%)
3. Add-ons: multi-location +$149, 
   white-glove +$299, analytics +$99
4. Annual prepay 10% discount
5. Claude API optimization (batch and cache)
6. Email-first over SMS where possible
7. Negotiate pVerify at 100+ customers

## Competitive Landscape

### Direct Competitors
ABB Verify (BIGGEST THREAT)
- Owned by ABB Optical Group ($340-500M revenue)
- In market since 2020, ~500-1,500 customers
- Sends benefit reminders with dollar amounts
- Integrated with major optometry EHRs
- Distributed through ABB contact lens reps
- They focus on VERIFICATION
- We focus on CAMPAIGNS
- Different product, different positioning

PracticePal.io ($39-99/month)
- Verification focused, limited campaigns

Doctora.io ($99-299/month)
- AI scribe plus verification
- Different buyer (doctor not manager)

WeVerify
- Human-powered service not real software
- Practices cancel for being too expensive

### NOT Competitors
Weave — generic patient communication
Solutionreach — generic communication
Brevium — patient reactivation, no insurance
NEVER position against these
We complement all of them

### Our Position
We own CAMPAIGN AUTOMATION layer
ABB Verify owns VERIFICATION
Weave owns GENERAL COMMUNICATION
Nobody owns the intersection — that is Prism

## Market
~25,000 independent in-network optometry practices
~$2.4B in unused vision benefits annually
Average frame allowance: $130-200 per patient
Average optical sale: $300-500
Practice profit per optical visit: $150-300
Realistic Year 5 penetration: 1-2% (250-500 customers)

## Go-To-Market

### Year 1: Founder-Led Sales
Target: 25-40 customers
Channels:
- Cold outbound via Apollo.io ($99/month)
- Facebook groups (ODs on Facebook, Independent Strong,
  Optometric Office Managers)
- Trade publications (Review of Optometry,
  Optometric Management, Optometry Times)
- Podcasts (20/20 Money, Power Hour, Defocus Media)
- Conferences (Vision Expo East/West, SECO, AOA)
Sales cycle: 2-8 weeks
Conversion rate: 15-25% demo to close

### Year 2: Partnerships
Buying groups: PECAA, Vision Source, IDOC,
Healthy Eyes Advantage
Frame reps: Marchon, Safilo, Luxottica field reps
Industry consultants: Cleinman, Williams Group

### Year 3+: Payor Relationships
At 50 customers: Approach EyeMed partnership
At 100 customers: Approach VSP partnership
At 100 customers: Negotiate direct API access

### Where Optometrists Actually Are
Facebook groups (PRIMARY)
Trade publications (PRIMARY)
Podcasts (PRIMARY)
Conferences (HIGH VALUE, seasonal)
NOT LinkedIn at scale

## Technology

### Tech Stack
Framework: Next.js 14 + TypeScript
Database: Supabase HIPAA tier (PostgreSQL)
Styling: Tailwind CSS + shadcn/ui
Auth: Supabase Auth (MFA required)
SMS: Twilio HIPAA-eligible tier
Email: Postmark
AI: Anthropic Claude API
Payments: Stripe
Hosting: Vercel
Eligibility: Stedi (launch) → pVerify (50+ customers)
Version control: GitHub

### EHR Integration Roadmap
Phase 1 (launch): CSV upload for ALL EHRs
Phase 2 (Month 3-6): RevolutionEHR FHIR API
  Developer portal: revolutionehrdev.dynamicfhir.com
  Partnership: partner-support@revolutionehr.com
  ~35% market share
Phase 3 (Month 6-12): Eyefinity/OfficeMate
  VSP-owned, ~25% market share
Phase 4 (Year 2): Crystal PM, Compulink
  CSV only until volume justifies direct integration

### HIPAA Requirements
Row-level security on ALL tables with PHI
Audit log on every PHI read and write
Encryption at rest and in transit
MFA required for all users no exceptions
BAA signed with every vendor before PHI touches system
No PHI in logs, URLs, or error messages ever

### MVP Scope
1. Practice account creation and auth
2. CSV patient upload with column mapping
3. Stedi eligibility verification
4. Patient list with benefit dollar amounts
5. 5 campaign templates
6. Claude API message generation
7. Message approval workflow
8. Twilio SMS + Postmark email sending
9. Basic delivery tracking dashboard
10. Stripe subscription billing

NOT in MVP:
RevolutionEHR integration (Phase 2)
Insurance Discovery (Phase 2)
Advanced analytics (Phase 2)
Multi-location (Phase 2)
Mobile app (never unless proven need)

## Vendor Status

### Active Vendors
Stedi: In discussions, pricing confirmed
pVerify: Pricing confirmed, switch at 50 customers

### Need to Contact
RevolutionEHR: partner-support@revolutionehr.com
Eyefinity: partnersupport@eyefinity.com

### Do NOT Contact
ABB Verify (competitor)
Weave (current employer)
Solutionreach (competitor)
Brevium (competitor)

## Founder Context

### Stockton Lundell (CEO)
5 years at Weave selling B2B SaaS to optometry
Zero coding experience, building with Claude Code
Located in Highland, UT
Co-building Cadi (golf platform) with brother Carson
Goal: Replace $250K Weave salary
Bootstrap strategy, no investors yet

### Employment Situation
Still employed at Weave
Non-compete: 12 months post-departure
Non-solicitation: Cannot use Weave customer lists
Needs Utah employment lawyer ASAP ($300-500)
Do NOT solicit Weave customers
Do NOT take Weave customer data

### Legal Setup Needed
- [ ] Utah LLC
- [ ] EIN
- [ ] Mercury bank account
- [ ] Healthcare attorney
- [ ] Cyber/E&O insurance
- [ ] BAAs with all vendors
- [ ] Privacy Policy + Terms of Service

### Capital
$20-35K available for initial build
Bootstrap first
No investors yet

## Key Decisions Made
Price: $449/month (never go below $299)
API: Stedi launch, pVerify at 50 customers
EHR: CSV first, RevolutionEHR API Phase 2
Scope: Campaign automation + verification
NOT going multi-vertical (dental doesn't work)
NOT competing with Weave (complementary)
Target: Income replacement not venture scale
Exit potential: $10-20M acquisition in 5-7 years
  (Brevium, Weave, RevolutionEHR as likely buyers)
