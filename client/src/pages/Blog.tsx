import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, User } from 'lucide-react'
import SiteNav from '../components/SiteNav'

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
  },
  {
    slug: 'optometry-patient-recall-software',
    title: 'Optometry Patient Recall Software: What It Is, What It Misses, and What Actually Works',
    description: 'Most optometry patient recall software sends generic reminders. Here\'s why benefit-specific campaigns outperform recall — and how independent practices use both.',
    date: 'June 8, 2026',
    readTime: '6 min read',
    content: `
## What Is Optometry Patient Recall Software?

Optometry patient recall software sends automated reminders to patients who are due for their annual eye exam. Tools like Weave and Solutionreach connect to your practice management system and send messages like: "Hi Sarah, it's been 12 months since your last visit. Time to schedule your annual exam."

That's useful. Every practice needs a recall system. Patients who don't come in annually are patients you're losing to competitors — or to neglect.

But recall software has a specific and limited job: getting patients back in the door for exams.

What it doesn't do is tell Sarah that she has \$175 in unused EyeMed frame benefits expiring December 31. It doesn't know which of your patients are sitting on a contact lens allowance they haven't used. It can't send a message that says: "You paid for this coverage all year. Here's how to use it before it disappears."

That gap — between a generic recall reminder and a benefit-specific campaign — is where most independent practices leave between \$15,000 and \$50,000 on the table every year.

---

## What Recall Software Does Well

Recall software is built for one job: reduce lapsed patient rate. If a patient hasn't come in for 12 or 18 months, recall tools identify them and send an automated nudge.

The best recall tools do this with:

- **Appointment reminders** before scheduled visits (reducing no-shows)
- **Reactivation messages** for patients who are overdue for an exam
- **Two-way messaging** so patients can reply and confirm
- **EHR integration** so patient data stays in sync automatically

For general patient communication — appointment confirmations, birthday messages, satisfaction surveys — recall tools like Weave are excellent. They save staff time and keep your schedule full.

Prizm is not a recall tool. Prizm is built to do the thing recall tools can't do: identify which of your patients have real money in unused vision benefits, and send them a personalized message with that exact dollar amount. These two tools are complementary. Most practices that use Prizm keep using their recall software for general communication.

---

## What Recall Software Misses

Here's the fundamental limitation: recall software works from appointment history. It doesn't know anything about your patients' insurance benefits.

It knows that Marcus hasn't been in for 14 months. It doesn't know that Marcus has \$160 in unused VSP contact lens benefits expiring December 31 — which means if Marcus comes in today, the visit costs him almost nothing.

That's the difference between:

**Recall message:** *"Hi Marcus, it's been over a year since your last visit. We'd love to see you."*

**Benefit campaign message:** *"Hi Marcus, your VSP plan still has \$160 in contact lens benefits for 2026. That covers your annual supply with very little out of pocket. Want to get scheduled before the year ends?"*

The first message asks Marcus to find a reason to come in. The second gives him the reason — in dollars. That specificity is what drives appointment bookings.

---

## The Numbers Behind Benefit-Specific Campaigns

Generic recall reminders typically convert at 2–5% — meaning 2 to 5 patients book an appointment for every 100 messages sent.

Campaigns that include a patient's exact benefit amount and expiration date consistently see 8–15% conversion. That's a 2–3x improvement, driven entirely by the specificity of the message.

Here's the math for a practice with 2,000 active patients:

- About **800 patients** have unused frame or contact lens benefits at any given time
- At a 10% booking rate, that's **80 additional optical appointments**
- At an average optical sale of \$375, that's **\$30,000 in recovered revenue** from one Q4 campaign

Most practices do not run this campaign at all — not because they don't want to, but because they don't have a way to know which patients have unused benefits and how much they have left. Logging into VSP's provider portal and checking patients one at a time isn't realistic for a busy front desk.

---

## The Two Things That Make Benefit Campaigns Work

**1. Real eligibility verification**

You can't send accurate benefit amounts without checking what patients actually have available. This means running eligibility checks against the insurance networks — not estimating, not relying on what was in the EHR from last year.

For VSP patients: the frame allowance is typically \$130–\$150. For EyeMed patients: typically \$150–\$200. Contact lens benefits run \$130–\$200 depending on the plan. But the exact amounts vary by plan tier and change year to year. The only way to get accurate numbers is to check.

**2. Insurance-aware segmentation**

Not every patient needs the same message. A patient with \$200 in unused frame benefits gets a different message than a patient with \$50 remaining. A contact lens wearer gets a different message than a frames-only patient. A patient whose benefits expire December 31 gets a different message than one with a July reset.

Good benefit campaign software segments your patient list by insurance carrier, benefit amount, and expiration date — and sends each patient a message tailored to their specific situation.

---

## How the Two Tools Work Together

Think of recall software and benefit campaign software as serving different moments in the patient journey:

**Recall software** handles the baseline: keeping patients on a regular exam schedule, reducing no-shows, general practice communication. It runs year-round and touches every patient.

**Benefit campaign software** handles the revenue layer: identifying which patients have unused benefits, building personalized campaigns around specific dollar amounts, and recovering optical revenue from patients who are already in your system.

A practice running both tools doesn't send generic recall messages to patients who have benefit money on the table. Instead:

- Standard recall goes to patients with no active benefit opportunity
- Benefit campaigns go to patients with unused frame or CL allowances
- The message each patient gets is relevant to their actual situation

The result is better patient experience (relevant messages instead of generic blasts) and significantly more optical revenue.

---

## What to Look for in Each Tool

**In a recall tool:**
- Reliable EHR integration (so patient data stays current)
- Customizable message timing (some patients need more frequent reminders)
- Two-way messaging so patients can reply and confirm
- Solid delivery rates and opt-out handling

**In a benefit campaign tool:**
- Real-time insurance eligibility verification (not static benefit estimates)
- Exact dollar amounts in every patient message
- Batch processing — the tool should check thousands of patients at once, not one at a time
- HIPAA compliance with a signed Business Associate Agreement
- Multiple campaign types: end-of-year benefits, mid-year reminders, contact lens reorder, back-to-school

---

## Getting Started

If you're already using Weave or a similar recall tool, you don't need to replace it. The gap isn't in your recall process — it's in the layer above recall, where benefit intelligence drives revenue campaigns.

The fastest way to see what's possible: export your patient list from your EHR, run eligibility verification across the full list, and look at the total unused benefit dollars sitting in your practice. For most independent practices with 1,500–3,000 active patients, that number is between \$80,000 and \$200,000.

That's revenue from patients who already chose your practice. They just need a message that tells them — in specific dollar terms — what they have to spend before it disappears.

[See how Prizm works](https://prizmvision.com/founding) — vision benefit campaign software built for independent optometry practices.
    `,
  },
  {
    slug: 'eyemed-campaign-automation',
    title: 'How to Automate EyeMed Patient Outreach for Independent Optometry Practices',
    description: 'Independent optometry practices leave thousands in EyeMed frame and contact lens benefits unused every year. Here\'s how to automate outreach that actually converts.',
    date: 'June 8, 2026',
    readTime: '6 min read',
    content: `
## Why EyeMed Patients Are a High-Value Outreach Segment

EyeMed is the second-largest vision insurance plan in the United States, covering approximately 25–30% of patients at a typical independent optometry practice. If your practice has 2,000 active patients, roughly 500–600 of them have EyeMed coverage.

Here's what makes EyeMed patients worth targeting specifically:

EyeMed frame allowances are generous. Most EyeMed plans provide \$200 in frame benefits — higher than VSP's typical \$130–\$150 allowance. Contact lens benefits generally run \$150–\$200 per year. When an EyeMed patient has both frame and CL benefits unused, they're sitting on \$350–\$400 in covered optical spending.

Benefits expire December 31 for most EyeMed plans. A patient who paid premiums all year and doesn't use those benefits loses them. That's real money walking out the door — and a real reason for the practice to reach out before year-end.

The problem is that most practices don't have an automated way to identify which EyeMed patients have remaining benefits and reach out to them with the right message. The EyeMed provider portal exists for benefit verification — but it's manual, one patient at a time, and gives you no outreach capability.

---

## What Manual EyeMed Outreach Looks Like

Most practices that do EyeMed outreach at all do something like this:

1. A staff member logs into the EyeMed provider portal
2. They pull a list of patients who haven't used benefits this year
3. They cross-reference it with the practice's patient records
4. They spend hours calling or emailing patients individually
5. They do this once, in November, when it's almost too late

The result is a small percentage of EyeMed patients actually getting reached, reached too late to act before schedules fill up, and no systematic follow-up.

This approach also misses a critical piece: it doesn't include the patient's specific benefit amount in the message. "You have EyeMed benefits remaining" is easy to ignore. "You have \$200 in unused EyeMed frame benefits" is not.

---

## What Automated EyeMed Outreach Looks Like

With automated benefit campaign software, the EyeMed outreach workflow looks like this:

**Step 1: Export your patient list from your EHR.** RevolutionEHR, Eyefinity, Crystal PM, and every major practice management system can export a CSV with patient name, date of birth, insurance carrier, and member ID.

**Step 2: Run batch eligibility verification.** The software checks each EyeMed patient's current benefit status — frame allowance remaining, contact lens benefit, expiration date — across the full list in minutes. No manual portal lookups.

**Step 3: Segment by benefit amount and patient type.** Patients with \$200 in unused frame benefits get a different message than patients with \$50 remaining. Contact lens wearers with a CL benefit get a separate campaign. The software handles this automatically based on eligibility data.

**Step 4: Generate personalized messages per patient.** Every message includes the patient's first name, their exact EyeMed benefit amount, and a clear call to action. The message isn't a template blast — it's personal to each patient's actual coverage.

**Step 5: Send via SMS and email.** SMS is the highest-converting channel for benefit campaigns. Most patients read text messages within minutes. Email goes to patients without a mobile number on file, or for campaigns where email is more appropriate.

**Step 6: Track results.** The campaign dashboard shows message delivery, response rates, and appointments booked so you can see what each EyeMed campaign actually generated.

---

## Sample EyeMed Campaign Messages

**End-of-year frame benefit reminder (SMS):**

*"Hi Jennifer, your EyeMed plan still has \$200 in frame benefits expiring December 31. That's enough to cover new frames with very little out of pocket. Mountain View Eye Care has openings in November — want us to hold a time for you? Reply YES or call us at [phone]."*

**Mid-year benefit check (for plans with July 1 reset):**

*"Hi David, your EyeMed benefits expire June 30. You have \$200 in frame coverage you haven't used yet. If you'd like to come in before the reset, we have availability this month. — Mountain View Eye Care"*

**Contact lens benefit reminder:**

*"Hi Rachel, your EyeMed plan includes \$150 toward contact lenses this year and you haven't used it. It's more than enough for a year's supply. Want us to pull your prescription and get an order started? Reply YES or call [phone]."*

Each message is under 160 characters (one SMS segment), warm in tone, and leads with the specific dollar amount. That specificity is what separates messages that convert from messages that get ignored.

---

## When to Send EyeMed Campaigns

EyeMed outreach timing depends on the plan type. Most EyeMed plans run on a calendar year (January 1 to December 31), but a meaningful number reset at other times — check patient benefit data for specifics.

**For calendar-year EyeMed plans:**

- **October–November:** Primary end-of-year push. Start in October, not November. By November, patient schedules are filling up with holidays and your competition has already reached their EyeMed patients.
- **January–February:** New benefit year campaign. Patients whose benefits just reset are primed to act. The message is "your new \$200 frame benefit is ready to use" rather than "benefits expiring."
- **May–June:** Mid-year contact lens reminder. CL patients who ordered last June are likely running low. Pair the timing with their remaining CL benefit for a compelling reason to order.

**For mid-year EyeMed plans:**

- **April–May:** Run a campaign 60 days before the July 1 reset. Most practices completely ignore mid-year resets — which means you're reaching patients your competitors aren't.

---

## The Revenue Math for a Single EyeMed Campaign

Practice profile: 2,000 active patients, 25% on EyeMed = 500 EyeMed patients.

Realistic assumptions for a well-executed October benefit reminder:
- 300 EyeMed patients with unused frame benefits (60% of EyeMed panel)
- 12% book an appointment after receiving the personalized message
- 36 additional optical appointments
- Average optical sale: \$380

**Result: \$13,680 in recovered optical revenue from one EyeMed campaign.**

At \$449/month for campaign software, that's a 30:1 return from a single campaign. Most practices run four to six campaigns per year.

---

## A Checklist for Practice Managers

Before running your first automated EyeMed campaign:

- [ ] Export patient list from EHR (include name, DOB, insurance carrier, member ID)
- [ ] Confirm which patients are on EyeMed vs. VSP vs. other carriers
- [ ] Run batch eligibility verification to get actual benefit amounts
- [ ] Segment by frame benefit, CL benefit, and expiration date
- [ ] Draft message copy with patient's exact dollar amount
- [ ] Confirm timing (aim for 60–90 days before benefit expiration)
- [ ] Verify HIPAA compliance for any software handling patient data
- [ ] Review and approve all messages before sending

---

## Getting Started

The first step is knowing how many of your EyeMed patients have unused benefits — and exactly how much. That requires running eligibility verification across your EyeMed patient panel, not manual portal lookups.

Once you have that data, the campaign almost writes itself: personalized messages with real dollar amounts, sent to the patients who have the most to gain from coming in before their benefits expire.

[See how Prizm automates EyeMed outreach](https://prizmvision.com/founding) — built specifically for independent optometry practices.
    `,
  },
  {
    slug: 'vsp-patient-outreach',
    title: 'VSP Patient Outreach: How Independent Practices Recover Unused Frame and Contact Benefits',
    description: 'VSP covers 35-40% of vision patients, but most practices never reach out about unused benefits. Here\'s a proven outreach system for independent optometry.',
    date: 'June 8, 2026',
    readTime: '7 min read',
    content: `
## VSP Is Your Single Most Valuable Outreach Segment

VSP (Vision Service Plan) is the largest vision insurance plan in the United States, covering approximately 35–40% of the patient population at a typical independent optometry practice. If your practice has 2,000 active patients, 700 to 800 of them are on VSP.

VSP frame allowances typically run \$130–\$150. Contact lens benefits are usually \$130–\$160 per year. Benefits for most VSP plans expire December 31 — though some plans have July 1 resets.

Here's the math: 700 VSP patients × 40% with unused benefits × \$140 average benefit remaining = **\$39,200 in unused optical coverage sitting in your patient list right now.** That number resets to zero every January 1.

The question isn't whether to reach out to VSP patients. The question is whether you have a system to do it accurately and at scale before the deadline.

---

## The VSP Portal Reality

VSP has a provider portal. Every practice in VSP's network has access to it. But here's what the portal is built for: verifying individual patient eligibility before an appointment. It's a one-patient-at-a-time verification tool.

What VSP's portal does not do:
- Show you a list of all your VSP patients with remaining benefits
- Generate outreach messages to patients
- Segment your patient list by benefit amount or expiration date
- Send personalized SMS or email campaigns

This is the gap. The verification infrastructure exists. The outreach infrastructure doesn't. Most practices end up doing one of three things:

**Option A:** A staff member pulls VSP data manually, spends hours cross-referencing patient records, and sends a generic blast in November. The blast says "your benefits may be expiring" with no dollar amounts. Conversion is low.

**Option B:** The practice sends a general recall message through their communication tool — no benefit data, no dollar amounts. Most patients ignore it.

**Option C:** Nothing. The practice doesn't run a VSP outreach campaign at all because the manual process is too time-consuming.

None of these options recover the revenue sitting in that \$39,200 figure.

---

## Three Campaign Types That Work for VSP Patients

### Campaign 1: End-of-Year Frame Benefit (October–November)

This is the highest-urgency, highest-converting campaign of the year. VSP benefits expire December 31 for the majority of plans. A patient who paid premiums all year is losing real money if they don't come in before year-end.

**What makes it work:** The message includes the patient's exact VSP frame allowance. Not "you might have benefits." Not "benefits are expiring soon." The exact dollar amount they stand to lose.

**Sample message:**

*"Hi Tom, your VSP plan still has \$150 in frame benefits expiring December 31. That's enough for a new pair of glasses with very little out of pocket. Clear Lake Vision has openings in October and November — want us to hold a time? Reply YES or call [phone]."*

**Timing:** Start in October, not November. November is when every other practice panics. October campaigns reach patients before holiday schedules fill up and before your VSP patients have already been contacted by a competitor.

---

### Campaign 2: Mid-Year Check-In (April–May for July 1 plans)

A meaningful portion of VSP plans reset on July 1 rather than January 1. These are often employer-sponsored plans where the benefits year follows the fiscal year, not the calendar year.

Most practices have no idea which of their VSP patients are on July 1 plans. The only way to know is to check eligibility data — and when you do, you find a segment your competitors are completely ignoring.

**Sample message:**

*"Hi Maria, your VSP benefits reset on July 1, which means your \$150 frame allowance expires in about 60 days. Clear Lake Vision has availability in May and June — come in before the deadline and use what you've already paid for. Call [phone] or reply to schedule."*

**Timing:** April–May, roughly 60–90 days before the July 1 reset.

---

### Campaign 3: Contact Lens Annual Benefit Reminder

VSP covers \$130–\$160 in contact lens materials per year for most plans. Contact lens patients who ordered their annual supply last year are approaching their reorder window — and their VSP CL benefit is likely still available.

This campaign pairs two motivators: the natural supply reorder cycle (patients are running low) and the insurance benefit that covers most of the cost (patients don't need to pay much out of pocket).

**Sample message:**

*"Hi Dana, it's been about a year since your last contact lens order, and your VSP benefit covers \$130 toward your next supply. That's almost a full year of lenses covered. Want us to pull your prescription and get an order started? Reply YES or call [phone]."*

**Timing:** Run this twice per year — once in May–June, once in August–September — timed to patients whose last CL order was approximately 12 months ago.

---

## The Revenue Math for VSP Outreach

**Practice profile:** 2,000 active patients, 35% on VSP = 700 VSP patients.

**Campaign 1 — End-of-year frame benefit:**
- 280 VSP patients with unused frame benefits (40% of VSP panel)
- 15% book an appointment after receiving a personalized message with exact dollar amount
- 42 additional optical visits
- Average optical sale: \$350
- **Revenue recovered: \$14,700**

**Campaign 2 — Mid-year July 1 plans (estimated 20% of VSP panel on July plans):**
- 140 VSP patients on July plans, 60% with unused benefits = 84 patients
- 12% booking rate = 10 additional visits × \$350 = **\$3,500**

**Campaign 3 — CL benefit reminder (twice per year):**
- 200 VSP CL patients × 10% response × \$200 average CL order = **\$4,000 per campaign × 2 = \$8,000**

**Conservative VSP outreach total: \$26,200 per year** from patients who are already in your practice and already have insurance that covers them.

At \$449/month (\$5,388/year) for a campaign tool, the ROI is approximately 5:1 from VSP campaigns alone — before counting EyeMed, Davis Vision, or any other plan.

---

## How to Run a VSP Outreach Campaign (Step by Step)

**Step 1: Export your patient list**

Pull a CSV from your EHR (RevolutionEHR, Eyefinity, Crystal PM, My Vision Express — every major system has an export). You need: patient name, date of birth, phone, email, insurance carrier, and member ID.

**Step 2: Filter for VSP patients**

Identify patients with VSP, Vision Service Plan, or VSP Inc. as their insurance carrier. Be aware of name variations in your data — practices often have the same carrier entered multiple ways.

**Step 3: Run batch eligibility verification**

Check current benefit status for each VSP patient against the insurance network. This pulls the exact frame allowance remaining, contact lens benefit, and expiration date for each patient. This step is what makes the message personal — and what makes it convert.

**Step 4: Segment by opportunity**

- Patients with \$100+ in unused frame benefits → end-of-year frame campaign
- VSP contact lens wearers with CL benefit remaining → CL reorder campaign
- Patients on July 1 plan reset → mid-year campaign

**Step 5: Review messages before sending**

Good benefit campaign software generates a personalized message for each patient. Review a sample before anything sends. The message should include the patient's first name, their exact VSP benefit amount, and a clear call to action.

**Step 6: Send and track**

Send via SMS to patients with mobile numbers on file. Track delivery, responses, and appointments booked so you can see the actual revenue impact.

---

## Common VSP Outreach Mistakes

**Sending without benefit amounts.** "Your VSP benefits may be expiring" is not a VSP outreach campaign. Every message needs to include the patient's specific dollar amount. Without it, you're sending a generic recall message.

**Waiting until December.** VSP patients who haven't been in all year get busier in December, not less busy. October campaigns reach patients when they still have time to act.

**Ignoring mid-year resets.** Roughly 20% of VSP patients may be on July 1 plans. These patients are invisible to practices that only run Q4 campaigns.

**Not following up.** Most patients don't book on the first message. A follow-up two to three weeks later — to patients who didn't respond — consistently improves booking rates without annoying patients who already scheduled.

---

## Getting Started

The starting point is knowing what VSP benefits your patients actually have available. Not what you think they have based on last year's data, but current eligibility data pulled from the insurance network.

Once you have that data, the campaign is straightforward: personalized messages to the right patients, with the right dollar amount, at the right time.

[See how Prizm handles VSP patient outreach](https://prizmvision.com/founding) — benefit verification, personalized campaigns, and optical revenue recovery for independent optometry practices.
    `,
  },
  {
    slug: 'abb-verify-alternative',
    title: 'ABB Verify Alternative: What Independent Optometry Practices Should Know Before Renewing',
    description: 'ABB Verify dominates benefit verification for optometry, but verification is only half the revenue equation. Here\'s what independent practices comparing their options should consider.',
    date: 'July 6, 2026',
    readTime: '7 min read',
    content: `
## Why Practices Start Looking for an ABB Verify Alternative

ABB Verify has been around since 2020 and has built a solid reputation for benefit verification in independent optometry. If your practice is using it, you already know what it does: it verifies patient insurance eligibility and sends benefit reminder messages before benefits expire.

That's genuinely useful. But the practices that start searching for alternatives tend to share a few common frustrations:

- **"It only does benefit reminders."** ABB Verify's Engage product sends end-of-year benefit notifications. That's one campaign type. Most practices have patients with mid-year plan resets, contact lens benefits, back-to-school families, and trunk shows that need targeted outreach — none of which ABB Verify was built to handle.
- **"The data isn't always accurate."** Benefit verification depends on clean data pipelines with insurance networks. Independent practices report inconsistencies in ABB Verify's benefit amounts, particularly for EyeMed and Davis Vision plans.
- **"It's expensive for what it does."** ABB Verify is distributed through ABB Optical Group's contact lens rep network, which means pricing varies by relationship and negotiation. Practices often don't know they're paying more than comparable tools.
- **"We're locked into ABB's ecosystem."** ABB Optical Group sells contact lenses. ABB Verify is part of a broader relationship that can feel difficult to exit without affecting your lens supply.

This guide is for practice managers who are evaluating their options — either at renewal time or mid-year when they're planning Q4 campaigns.

---

## What ABB Verify Actually Does

ABB Verify has two main components:

**Validate** — real-time benefit verification that checks a patient's VSP, EyeMed, or other vision plan eligibility before or at the time of a visit. This integrates with popular EHR systems and reduces front-desk time spent on manual portal lookups.

**Engage** — automated patient outreach that sends benefit reminder messages (email and text) to patients with unused benefits. The primary use case is Q4 benefit expiration reminders. ABB Verify reports that approximately 5% of contacted patients schedule an appointment after receiving an Engage message.

This is the complete product. If you need eligibility verification at the point of service plus an annual benefit reminder campaign, ABB Verify handles both reasonably well.

---

## The Gap ABB Verify Doesn't Fill

The limitation is scope. ABB Verify was built around one insight: patients with unused benefits need a reminder. That insight is correct, but the campaigns it generates are limited to:

1. End-of-year benefit expiration reminders
2. Post-verification follow-ups

What it doesn't do:

**No mid-year campaigns.** A meaningful portion of patients — especially those on EyeMed plans and employer-sponsored VSP plans — have benefits that reset on July 1, not January 1. These patients' deadlines are in June, not December. ABB Verify doesn't run mid-year expiration campaigns.

**No contact lens benefit tracking.** VSP and EyeMed both provide contact lens allowances separately from frame allowances. A patient who hasn't used their \$150 CL benefit is a different outreach target than one who hasn't used their frame allowance. ABB Verify doesn't segment or campaign on CL benefits specifically.

**No carrier-specific segmentation.** Not all your patients have the same benefit amounts. A VSP patient with \$130 in unused frames deserves a different message than an EyeMed patient with \$200. ABB Verify sends benefit reminders, but practices report limited ability to customize messaging by carrier or benefit amount.

**No trunk show or event campaigns.** A trunk show from Maui Jim or Oakley is the highest-revenue event in an independent practice's calendar. The practices that max out trunk show revenue are the ones that identify which patients own that brand already, have available benefits, and are due for new frames — and contact them specifically. ABB Verify doesn't do this.

**No year-round campaign calendar.** January new-year reminders. April mid-year check-ins. June contact lens reorders. August back-to-school families. October-November Q4 push. The practices recovering the most optical revenue from existing patients run 5-6 campaign types across the calendar year. ABB Verify is built for one.

---

## The Verify-Only vs. Campaign-First Distinction

This is the core difference to understand when evaluating alternatives.

**Verify-only tools** (ABB Verify's primary positioning) treat insurance checking as the product. Campaigns are a feature layered on top of verification.

**Campaign-first tools** treat the revenue campaign as the product. Verification is the underlying infrastructure that makes campaigns accurate.

That distinction changes what the software looks like:

| Capability | Verify-Only | Campaign-First |
|---|---|---|
| Point-of-service eligibility check | ✓ | ✓ |
| End-of-year benefit reminders | ✓ | ✓ |
| Mid-year benefit campaigns | ✗ | ✓ |
| Contact lens benefit campaigns | ✗ | ✓ |
| Trunk show / event campaigns | ✗ | ✓ |
| Back-to-school family campaigns | ✗ | ✓ |
| Per-patient dollar amounts in every message | Sometimes | Always |
| Carrier-specific message segmentation | Limited | Full |
| Year-round campaign calendar | ✗ | ✓ |

If you're running a single Q4 benefit reminder and that's your complete outreach strategy, ABB Verify covers what you need.

If you're trying to recover optical revenue from existing patients systematically — year-round, across multiple campaign types, with accurate dollar amounts in every message — you need a campaign-first tool.

---

## What the Revenue Difference Looks Like

Let's use a real-world example.

**Practice profile:** 2,000 active patients. 35% VSP (~700 patients), 25% EyeMed (~500 patients). Contact lens wearers: 30% of panel.

**ABB Verify approach (Q4 only, end-of-year reminders):**
- ~800 patients contacted with benefit reminders
- ABB Verify's reported 5% conversion = 40 appointments
- Average optical sale: \$375
- Revenue recovered: **\$15,000**

**Campaign-first approach (5-6 campaigns per year):**

*Q4 end-of-year (October–November):* 800 patients, 10% conversion = 80 appointments × \$375 = \$30,000

*January new benefit year:* 300 patients, 8% conversion = 24 × \$375 = \$9,000

*Mid-year EyeMed and July-reset VSP (April–May):* 180 patients, 10% = 18 × \$375 = \$6,750

*Contact lens reorder (twice per year):* 240 CL patients × 8% × \$200 CL average × 2 = \$7,680

*Back-to-school families (July–August):* 150 patients, 10% = 15 × \$350 = \$5,250

*Total recovered: **\$58,680** — nearly 4× the single-campaign approach.*

The Q4 conversion rate in this example is also higher (10% vs. 5%) because personalized messages with exact dollar amounts consistently outperform generic benefit reminders. When a patient receives a message that says "you have \$175 in unused EyeMed frame benefits" instead of "you have vision benefits available," they act on it more often.

---

## Questions to Ask Before You Renew

If you're evaluating ABB Verify at renewal time, these are the questions worth asking:

**1. How many campaign types does the software support?**
If the answer is "end-of-year benefit reminders," that's one campaign type. Ask specifically about mid-year resets, CL campaigns, and event-based campaigns.

**2. Does the software include the patient's exact benefit amount in every message?**
"You have benefits available" is not a benefit reminder. If the software can't tell you whether each patient message contains a specific dollar amount, the conversion rates will reflect that.

**3. Is there a per-message charge on top of the monthly fee?**
Some tools charge per SMS sent. At scale, this adds up. Flat-rate models are more predictable.

**4. Is the software connected to ABB Optical Group's contact lens distribution business?**
This isn't necessarily disqualifying, but it's worth understanding the relationship. Some practices feel pressure to maintain the ABB Verify relationship because their lens rep manages it.

**5. What does the support model look like?**
ABB Verify is distributed through field reps, not a software support team. If something breaks or you need help building a campaign, who do you call?

---

## What Prizm Does Differently

Prizm is built specifically for independent optometry practices that want a full year-round campaign calendar — not a single annual reminder.

You upload your patient list from your EHR once. Prizm verifies eligibility for every patient across VSP, EyeMed, Davis Vision, and Spectera, then identifies which patients have unused frame benefits, contact lens benefits, or mid-year plan resets. Every campaign message includes the patient's exact dollar amount.

The campaign library covers 15+ campaign types: end-of-year benefits, new benefit year, mid-year resets, CL reorder, back-to-school families, trunk show invitations, second-pair promotions, and more. You select the campaign, review the patient segment and messages, and send — or schedule it to go automatically.

Pricing is flat at \$449/month. No per-message charges, no per-verification fees, no upsells.

The founding customer rate — for the first 10 independent practices — is \$199/month, locked in for life.

[See the founding customer offer at Prizm](https://prizmvision.com/founding)

---

## The Short Version

ABB Verify is a solid verification tool with a benefit reminder layer on top. If your entire outreach strategy is one Q4 email blast, it does the job.

If you're trying to run a systematic campaign program that recovers optical revenue from existing patients throughout the year — with exact dollar amounts, multiple campaign types, and year-round scheduling — you'll outgrow ABB Verify quickly.

The best time to evaluate alternatives is before Q4 planning season starts, when you still have time to run a summer campaign and build toward October. That window is right now.
    `,
  },
  {
    slug: 'vision-benefit-reminder-software-guide',
    title: 'Vision Benefit Reminder Software: The Complete Guide for Optometry Practices',
    description: 'Everything independent optometry practices need to know about vision benefit reminder software — what it is, how it works, what results to expect, and how to choose the right tool.',
    date: 'June 4, 2026',
    readTime: '9 min read',
    content: `
## What Is Vision Benefit Reminder Software?

Vision benefit reminder software automatically identifies which of your patients have unused VSP, EyeMed, or other vision insurance benefits — and sends them a personalized reminder before those benefits expire.

Unlike generic patient recall tools, vision benefit reminder software works with real insurance data. Instead of sending a message that says "you might have benefits available," it sends a message that says: "Sarah, you have \$175 in unused frame benefits with EyeMed expiring December 31."

That specificity is the difference between a message patients ignore and one they act on.

---

## Why Independent Optometry Practices Need It

Every year, approximately **\$2.4 billion in vision benefits go unused** across the United States. For an average independent optometry practice with 2,000 active patients, that represents \$15,000 to \$50,000 in optical revenue that walked out the door — not because patients didn't want new glasses, but because no one reminded them they had money to spend.

Here's why most practices struggle with this:

**Manual outreach doesn't scale.** Pulling VSP and EyeMed reports, cross-referencing patient lists, and calling or emailing individually takes dozens of staff hours. Most practices do it once a year — or not at all.

**Generic reminders don't convert.** "Your benefits may be expiring soon" is easy to ignore. A message with your patient's actual dollar amount and expiration date is not.

**Q4-only campaigns miss most of the opportunity.** Optical revenue doesn't have to be seasonal. Mid-year benefit reminders, contact lens reorder reminders, and back-to-school campaigns can drive appointments throughout the year — not just in November.

Vision benefit reminder software solves all three problems.

---

## How Vision Benefit Reminder Software Works

The best vision benefit reminder tools follow a three-step process:

### Step 1: Insurance Eligibility Verification

The software connects to insurance networks to verify each patient's actual benefit status — frame allowance remaining, contact lens allowance, exam copay, and the exact expiration date. This happens automatically when you import your patient list.

This is the critical step most practices skip. Without real eligibility data, you're guessing which patients have benefits left. With it, you're sending every patient a message with their exact remaining dollar amount — which is what drives appointments.

### Step 2: Personalized Message Generation

Using verified benefit data, the software generates a personalized message for each patient. Every message includes the patient's first name, their insurance carrier, their exact remaining benefit amount, their expiration date, and a clear call to action.

The best systems use AI to make each message feel personal — not like a form letter that every patient in your list received.

### Step 3: Automated Delivery by SMS and Email

Messages go out by SMS and email, scheduled to reach patients at the right time. SMS is the preferred channel for benefit reminders — open rates for text messages average 95–98%, compared to 20–30% for email.

Compliance matters here: legitimate vision benefit reminder software handles TCPA opt-out requirements automatically and maintains HIPAA compliance for all patient data.

---

## What to Look for in a Vision Benefit Reminder Tool

Not all vision benefit reminder software is equal. Here's what separates the tools that drive results from the ones that don't:

**Real eligibility data, not estimates.** Some tools let you import your own benefit data from EHR exports. Better tools verify benefits directly against insurance networks in real time. Real-time verification is more accurate and saves your staff hours every month.

**Exact dollar amounts in every message.** This is non-negotiable. "You have \$150 in unused benefits" outperforms "you may have unused benefits" by a significant margin. If the software can't put a specific dollar amount in each message, it's not vision benefit reminder software — it's a recall tool.

**Year-round campaign types.** End-of-year benefit reminders are the obvious starting point, but the highest-performing practices run 5–10 campaign types throughout the year: mid-year benefit reminders, contact lens reorder campaigns, trunk show invitations, second-pair promotions, and back-to-school campaigns. Look for a tool that supports all of them.

**HIPAA compliance built in.** Patient benefit data is protected health information. Any software you use to store and transmit it must meet HIPAA requirements — that means a signed Business Associate Agreement (BAA), encrypted storage and transmission, and proper access controls. Verify this before using any tool with real patient data.

**SMS-first delivery.** Email is cheap. SMS converts. A good vision benefit reminder platform sends via SMS and uses email for patients without a mobile number on file.

---

## What Results Should You Expect?

Results vary by practice size, patient list quality, and how many campaigns you run. Industry benchmarks for targeted vision benefit reminders:

- **SMS open rate:** 95–98%
- **Response rate:** 10–15% of delivered messages
- **Appointment booking rate:** 8–12% of messaged patients
- **Average optical transaction:** \$300–500

For a practice with 2,000 active patients and 600 patients with unused frame benefits, a well-executed benefit reminder campaign typically drives **15–40 additional optical appointments** — worth \$6,000 to \$20,000 in revenue from a single campaign.

Run four to six campaigns per year and the math adds up quickly. Most practices recover the cost of the software in the first campaign they send.

---

## Common Mistakes Practices Make with Benefit Reminders

Even practices that send benefit reminders leave money on the table by making these mistakes:

**Waiting until November.** By the time you send your Q4 reminder, patients have crowded schedules and your competition has already reached them. Starting in October — or running mid-year reminders in June — gives you a real advantage.

**Sending without benefit amounts.** "You have benefits available" is not a vision benefit reminder. It's a vague nudge. Every message should include the exact dollar amount or it won't convert at the rate you're hoping for.

**Messaging patients who already used their benefits.** Sending a benefit reminder to a patient who already bought frames this year damages your credibility. Good vision benefit reminder software filters these patients out automatically using current eligibility data.

**One message per year.** Most patients don't act on the first message they receive. A follow-up reminder two to three weeks later consistently improves booking rates without annoying patients who already responded.

---

## How Prizm Works

Prizm is vision benefit reminder software built specifically for independent optometry practices.

Upload your patient list as a CSV from your existing EHR system — RevolutionEHR, Eyefinity, Crystal PM, or any other. Prizm verifies insurance eligibility for each patient, identifies who has unused VSP, EyeMed, Davis Vision, or Spectera benefits, and generates a personalized SMS and email campaign with each patient's exact benefit amounts.

You review and approve the campaign before anything sends. Results track back to your dashboard so you can see which campaigns drove appointments and how much optical revenue they generated.

Prizm runs on a flat monthly fee with no per-message charges, no setup fees, and no long-term contracts for standard accounts. Independent practices typically recover the full cost of the software in the first campaign they send.

[See the founding customer offer](https://prizmvision.com/founding) — the first 10 practices to sign up get lifetime access at \$199/month instead of \$449/month.
    `
  }
]

export default function Blog() {
  useEffect(() => {
    document.title = 'Vision Benefit Reminder Software & Optical Marketing | Prizm Blog'
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Learn how vision benefit reminder software helps independent optometry practices recover $15–50K in optical revenue annually. Practical guides for VSP and EyeMed patient outreach.'
      )
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteNav />

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display text-3xl sm:text-4xl font-semibold text-slate-900 tracking-tight mb-2">Vision Benefit Reminders &amp; Optical Marketing</h1>
        <p className="text-slate-600 mb-12">How independent optometry practices recover $15–50K in optical revenue using automated vision benefit reminders.</p>

        <div className="space-y-5">
          {POSTS.map(post => (
            <Link key={post.slug} to={`/blog/${post.slug}`} className="block group">
              <article className="border border-slate-200 rounded-2xl p-6 bg-white shadow-[0_2px_16px_rgba(15,118,110,0.05)] hover:border-teal-300 transition-colors">
                <h2 className="font-display text-lg font-semibold text-slate-900 group-hover:text-teal-700 transition-colors mb-2 leading-snug">
                  {post.title}
                </h2>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">{post.description}</p>
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

      <footer className="border-t border-slate-200 px-6 py-8 text-center">
        <p className="text-xs text-slate-500">© 2026 Prizm · <a href="mailto:stockton@prizmvision.com" className="hover:text-slate-700 transition-colors">stockton@prizmvision.com</a></p>
      </footer>
    </div>
  )
}
