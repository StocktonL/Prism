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
    <div className="min-h-screen bg-white">
      <nav className="border-b border-slate-100 px-6 py-4">
        <Link to="/" className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" /> Back to Prizm
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-black text-slate-900 mb-2">Prizm Blog</h1>
        <p className="text-slate-500 mb-12">Optical revenue strategies for independent optometry practices.</p>

        <div className="space-y-8">
          {POSTS.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="block group">
              <article className="border border-slate-100 rounded-2xl p-6 hover:border-teal-200 hover:shadow-sm transition-all">
                <h2 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-500 mb-4">{post.description}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><User className="h-3 w-3" /> Stockton Lundell</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime}</span>
                  <span>{post.date}</span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
