import { Link } from 'react-router-dom'
import { ArrowLeft, Clock, User } from 'lucide-react'

export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  readTime: string
  content: string
}

export const POSTS: BlogPost[] = [
  {
    slug: 'optometry-patient-outreach-campaigns',
    title: '5 Patient Outreach Campaigns Every Independent Optometry Practice Should Be Running',
    description: 'Most optometry practices run one benefit reminder in November. Here are the five campaigns that drive optical revenue year-round — with exact messaging examples for VSP and EyeMed patients.',
    date: 'May 26, 2026',
    readTime: '8 min read',
    content: `
## Why One Benefit Reminder a Year Is Leaving Money on the Table

If your optometry practice sends one patient outreach message per year — the November "your benefits are expiring" blast — you're recovering maybe 10–20% of the optical revenue sitting in your patient list.

The other 80% walks out the door every January 1 when unused VSP and EyeMed benefits reset to zero.

The practices that consistently outperform on optical revenue don't have better patients, better location, or lower prices. They run systematic patient outreach campaigns throughout the year — not just in Q4. And the campaigns that work don't say "you might have benefits available." They say: "Sarah, you have \$175 in unused EyeMed frame benefits. Here's how to use them."

This guide covers the five campaigns that drive optical revenue for independent practices, when to run them, and exactly what to say.

---

## Campaign 1: End-of-Year Benefits Expiring (October–November)

**Who it's for:** Any patient with VSP, EyeMed, Davis Vision, or Spectera benefits who hasn't used their frame or contact lens allowance for the year.

**When to run it:** October 1 through November 30. Starting in October gives patients time to act before holiday schedules get crowded. Waiting until December means you're competing with every other practice that remembered at the last minute.

**Why it works:** This is the highest-urgency campaign of the year. Patients paid premiums all year for coverage they're about to lose. A message that includes the exact dollar amount and the exact deadline converts significantly better than a generic reminder.

**What to say:**

Generic (low conversion): *"Don't forget — your vision benefits may expire soon. Call us to schedule."*

Personalized (high conversion): *"Hi Sarah — you have \$175 in unused EyeMed frame benefits that expire December 31. It's enough to cover new frames with nothing out of pocket. Want us to hold a time for you?"*

The difference between these two messages is the difference between a patient thinking "I should probably do that sometime" and a patient picking up the phone.

**What you need:** A current patient list with insurance information, plus actual eligibility data — not guesses — so you know which patients have remaining benefits and how much. Running eligibility checks manually for 2,000+ patients isn't realistic, which is why this campaign often doesn't happen until it's too late.

---

## Campaign 2: New Benefit Year (January–February)

**Who it's for:** Patients whose insurance just reset on January 1. This includes the majority of VSP patients and many EyeMed patients.

**When to run it:** January 2–February 28. This is the most underused window in optometry. While every other practice is silent, you can be the first voice patients hear after their benefits renew.

**Why it works:** Patients who didn't use their benefits last year often have some vague guilt or intention to "do it this year." A timely message in early January catches them when that intention is fresh. There's no deadline urgency, but there is novelty — the new benefit year is a genuine reason to reach out.

**What to say:**

*"Hi James — your VSP benefits renewed on January 1, which means you have a fresh \$150 frame allowance and covered annual exam. Happy to get you scheduled anytime this month."*

This message is informational, not pushy. It gives the patient something useful: the exact amount of coverage they have available. Patients who didn't know their benefits reset will often book immediately.

**What you need:** The same eligibility data that drives your Q4 campaign, refreshed for the new benefit year. If you ran eligibility checks in Q4, run them again in January — plan data changes.

---

## Campaign 3: Contact Lens Annual Benefit Reminder (May–June and August–September)

**Who it's for:** Patients who are contact lens wearers with a CL benefit from their vision plan. VSP typically covers \$150–\$160 in contact lens materials per year; EyeMed covers \$150–\$200 depending on the plan.

**When to run it:** Twice a year — once in late spring (May–June) and once in late summer (August–September), timed roughly 12 months after a patient's last contact lens order.

**Why it works:** Contact lens patients have a predictable reorder cadence. A patient who ordered in June of last year is likely running low by May or June of this year. Pairing that timing with their remaining CL benefit creates a compelling reason to come in rather than reorder from an online retailer.

**What to say:**

*"Hi Marcus — it's been about a year since your last contact lens order, and your VSP benefit covers \$160 toward your next supply. That's enough for a full year of lenses with very little out of pocket. Want me to pull your prescription and get an order started?"*

**What you need:** Contact lens wearer flags in your patient data (most EHRs track this), plus last order dates and current CL benefit from eligibility verification.

---

## Campaign 4: Back-to-School Families (July–August)

**Who it's for:** Patients who have children on their vision plan — specifically families whose kids are due for an annual exam before the school year starts.

**When to run it:** July 1–August 15. School starts in late August or September in most markets. Families are scheduling during July and early August.

**Why it works:** Back-to-school is one of the highest-traffic periods for pediatric optometry. Parents are already thinking about school supplies, physicals, and checkups. A message that connects the annual exam to their insurance coverage — and includes the specific dollar amount — converts the "I should do that" into a scheduled appointment.

**What to say:**

*"Hi Jennifer — VSP covers your child's annual eye exam before school starts, plus \$150 toward new glasses if their prescription changed. August is filling up — want to grab a time in the next few weeks?"*

**What you need:** Family-level patient data. If your patient records include dependents or if parents and children are both in your practice, you can segment this campaign accurately. If not, a general back-to-school message to all patients with children's coverage can still perform well.

---

## Campaign 5: Mid-Year Benefits Check-In (April–May)

**Who it's for:** Patients whose plans reset mid-year (July 1) rather than January 1. This includes some EyeMed plans, Davis Vision plans, and Spectera. It also works as a general "you have benefits you haven't used" message for patients who are sitting on unused allowances halfway through the year.

**When to run it:** April–May, about 60 days before a mid-year reset.

**Why it works:** Most practices have no idea which patients have mid-year resets. Running this campaign means you're reaching patients that your competitors are completely ignoring — because competitors only think about benefits in Q4. For these patients, you're the only practice that ever told them their benefits were about to reset.

**What to say:**

*"Hi Rachel — your Davis Vision benefits reset on July 1, which means your current \$200 frame allowance expires in about 60 days. A lot of our patients prefer coming in the spring before things get busy. Want to get scheduled?"*

---

## The Operational Reality: Why Most Practices Only Run One Campaign

Reading this, most practice managers are thinking: "This makes sense, but there's no way we can run five separate campaigns per year on top of everything else we're doing."

That's the right instinct. The manual version of this — pulling insurance data, running eligibility checks, segmenting by benefit amount, writing personalized messages, sending and tracking — is a weeks-long project that competes with every other priority in the practice.

The practices that run all five campaigns aren't doing it manually. They've built a system:

1. **Patient data is exported from the EHR once** (RevolutionEHR, Eyefinity, Crystal PM, or any other system can export a CSV)
2. **Eligibility is verified in batch** — not one patient at a time, but the entire list at once using an eligibility API
3. **Campaigns are segmented automatically** based on benefit amounts, expiration dates, CL wearer status, and last visit date
4. **Messages are personalized per patient** with their actual dollar amounts — not templated blasts
5. **Outreach is sent via SMS and email** on a schedule, not in a manual push every few months

The result is a practice that looks proactive and attentive to patients — because it is — without the staff hours that manual outreach would require.

---

## What the Revenue Math Looks Like

Assume a practice with 2,000 active patients:

- **End-of-year campaign:** 800 patients with unused frame benefits × 10% book appointments × \$375 average optical sale = **\$30,000 in recovered revenue**
- **New year campaign:** 200 early-year bookers × \$375 = **\$7,500**
- **CL benefit reminder (twice):** 400 CL patients × 8% response × \$200 average CL order = **\$6,400**
- **Back-to-school:** 150 family bookings × \$350 average = **\$5,250**
- **Mid-year check-in:** 100 bookings × \$375 = **\$3,750**

Conservative total across five campaigns: **\$52,900 in additional annual optical revenue** from patients already in the practice's system.

Against a practice management tool at \$449/month (\$5,388/year), that's roughly a 10:1 return — and that's using conservative booking rates. Practices with strong patient relationships and accurate eligibility data typically see higher response rates than those numbers.

---

## Getting Started

The fastest path to running these campaigns is knowing what's in your patient list. Export your patients from your EHR, check what insurance coverage they have, and look at the total dollar figure of unused benefits across the practice.

For most independent practices, that number is between \$80,000 and \$200,000 — and it resets to zero every January 1 unless someone reaches out.

If you want a tool built specifically for this workflow — one that verifies benefits in batch, segments your patient list automatically, and sends personalized campaigns year-round — [Prizm](https://prizmvision.com/founding) was built for independent optometry practices to do exactly that.
    `,
  },
  {
    slug: 'vision-benefits-expiring-patients',
    title: 'How to Reach Patients With Vision Benefits Expiring Before December 31',
    description: 'Most practices lose $15–50K in optical revenue every year to unused VSP and EyeMed benefits. Here\'s how to reach those patients before December 31.',
    date: 'May 23, 2026',
    readTime: '6 min read',
    content: `
## Why Patients Let Vision Benefits Expire Every December 31

Every January 1, millions of dollars in unused vision benefits reset to zero. Patients who paid premiums all year for VSP or EyeMed coverage simply never came in — not because they didn't need glasses or contacts, but because nobody reminded them with enough urgency or specificity to act.

The average unused frame allowance at expiration is $150–$200 per patient. Multiply that across a patient list of 2,000 and you're looking at hundreds of thousands of dollars in potential optical revenue that evaporates every year. For the independent practice, that's not an abstraction — that's new equipment, staff raises, or margin.

The problem isn't that patients don't want to use their benefits. The problem is that most practices either don't remind them at all, or send one generic message in November that gets ignored.

---

## How Much Unused VSP and EyeMed Revenue Is Sitting in Your Patient List

Most practice managers don't know the exact number — and that's part of the problem. Without running eligibility checks on your patient list, you're guessing.

Here's what the math looks like for a typical independent practice:

- **2,000 active patients**
- **~40% have VSP or EyeMed coverage** with a remaining frame or contact lens allowance
- **Average unused benefit: $165 per patient**
- **800 patients × $165 = $132,000 in recoverable optical revenue**

That's sitting in your patient database right now. Not revenue you have to generate from new patients — revenue from people who already chose your practice, already have insurance that covers them, and just need a reason to come in before December 31.

The difference between practices that recover this revenue and practices that don't comes down to one thing: personalization.

---

## The Difference Between a Generic Recall Message and a Benefit-Specific Campaign

A generic recall message says: *"Hi Sarah, it's been a while since your last visit. We'd love to see you soon!"*

A benefit-specific campaign says: *"Hi Sarah, you have \$150 in unused VSP frame benefits that expire December 31. Come choose new frames before you lose them."*

One message asks the patient to find a reason to come in. The other gives them the reason.

The response rate difference is significant. Generic benefit reminders typically see 2–5% appointment conversion. Campaigns that include the patient's exact benefit amount and expiration date consistently see 8–15% conversion — because the message contains information the patient didn't know and can't ignore.

The key is that the message has to be accurate. Telling a patient they have \$150 in benefits when their plan actually covers \$200 — or worse, when their benefits have already reset — destroys trust. The personalization only works when it's backed by real eligibility verification.

---

## How to Identify Which Patients Have Frame or Contact Lens Allowances Left

This is where most practices get stuck. Running eligibility checks manually — logging into VSP's portal, EyeMed's portal, Davis Vision's portal, one patient at a time — is exactly the kind of work that doesn't happen when the front desk is busy.

The practices that do this well have a system:

1. **Export your patient list from your EHR** — RevolutionEHR, Eyefinity, Crystal PM, and most other practice management systems can export a CSV of patients with their insurance information.

2. **Run batch eligibility verification** — rather than checking one patient at a time, run the entire list through an eligibility API like Stedi or pVerify. This pulls the exact frame allowance, contact lens benefit, and expiration date for each patient in minutes instead of hours.

3. **Segment by benefit amount and urgency** — patients with \$200+ in unused benefits get a different message than patients with \$50 remaining. Patients whose benefits expire in 30 days get a different message than patients with 90 days left.

4. **Send personalized campaigns by segment** — each patient receives a message with their specific dollar amount and their specific deadline, not a generic "you might have benefits" blast.

This is not a manual process at scale. For a practice with 2,000 patients, running eligibility checks individually would take weeks. The practices recovering the most optical revenue from unused benefits have automated the verification and the outreach.

---

## What a Year-Round Vision Benefit Recovery Strategy Looks Like for Independent Practices

Q4 is not the only opportunity. Practices that treat benefit recovery as a year-round strategy — not a November scramble — consistently outperform those that don't.

Here's what a full-year calendar looks like:

**January–February:** New benefit year campaign. Patients whose benefits just reset are primed to act. Message: "Your 2026 VSP benefits are ready to use."

**April–May:** Mid-year check-in for plans that reset July 1 (some EyeMed and Davis Vision plans). Message: "Your benefits reset in 60 days — here's what you have available."

**June–July:** Contact lens reorder campaign. CL patients who ordered last summer are due. Message: "Your annual contact lens benefit covers your next order."

**August–September:** Back-to-school families. Patients with children who need updated prescriptions before the school year. Message: "VSP covers your child's annual exam — schedule before September."

**October–November:** End-of-year benefits push. The highest-urgency window. Message: "Your \$175 in frame benefits expires December 31 — 61 days left."

Each of these campaigns works because it connects the patient's specific benefit to a specific reason to act now. The practices that run all five consistently recover 3–5x more optical revenue from existing patients than practices that run one Q4 blast.

---

## Getting Started

The first step is knowing what's in your patient list. Export your patients from your EHR, run eligibility verification on the list, and look at the total dollar figure of unused benefits sitting in your practice.

For most practices, that number is larger than expected — and it's the clearest argument for building a systematic outreach process before the next December 31 wipes it out again.

If you're looking for a tool built specifically for this workflow, [Prizm](https://prizmvision.com/founding) was built for independent optometry practices to do exactly this — verify benefits, generate personalized campaigns, and recover optical revenue from patients who already chose your practice.
    `
  }
]

export default function Blog() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <nav className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/90 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-teal-400 to-cyan-600 shadow-lg shadow-teal-900/50">
            <span className="text-xs font-black text-white">P</span>
          </div>
          <span className="text-base font-bold tracking-tight text-white">Prizm</span>
        </Link>
        <Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-black text-white mb-2">Prizm Blog</h1>
        <p className="text-slate-400 mb-12">Optical revenue strategies for independent optometry practices.</p>

        <div className="space-y-5">
          {POSTS.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="block group">
              <article className="border border-white/8 rounded-2xl p-6 bg-white/3 hover:border-teal-500/40 hover:bg-white/5 transition-all">
                <h2 className="text-base font-bold text-white group-hover:text-teal-400 transition-colors mb-2 leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-400 mb-4 leading-relaxed">{post.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> Stockton Lundell</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                  <span>{post.date}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <footer className="border-t border-white/5 px-6 py-8 text-center">
        <p className="text-xs text-slate-600">© 2026 Prizm · <a href="mailto:stockton@prizmvision.com" className="hover:text-slate-400 transition-colors">stockton@prizmvision.com</a></p>
      </footer>
    </div>
  )
}
