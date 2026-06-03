import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')
const BASE_URL = 'https://prizmvision.com'

function markdownToHtml(md) {
  return md
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr/>')
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    .replace(/^[-*] (.+)$/gm, '<li>$1</li>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^(?!<[hulo]|<\/|<hr|\s*$)(.+)$/gm, '<p>$1</p>')
}

const POSTS = [
  {
    slug: 'optometry-patient-outreach-campaigns',
    title: '5 Patient Outreach Campaigns Every Independent Optometry Practice Should Be Running',
    description: 'Most optometry practices run one benefit reminder in November. Here are the five campaigns that drive optical revenue year-round — with exact messaging examples for VSP and EyeMed patients.',
    dateISO: '2026-05-26',
    dateDisplay: 'May 26, 2026',
    content: `
## Why One Benefit Reminder a Year Is Leaving Money on the Table

If your optometry practice sends one patient outreach message per year — the November "your benefits are expiring" blast — you're recovering maybe 10–20% of the optical revenue sitting in your patient list.

The other 80% walks out the door every January 1 when unused VSP and EyeMed benefits reset to zero.

The practices that consistently outperform on optical revenue don't have better patients, better location, or lower prices. They run systematic patient outreach campaigns throughout the year — not just in Q4. And the campaigns that work don't say "you might have benefits available." They say: "Sarah, you have $175 in unused EyeMed frame benefits. Here's how to use them."

This guide covers the five campaigns that drive optical revenue for independent practices, when to run them, and exactly what to say.

---

## Campaign 1: End-of-Year Benefits Expiring (October–November)

**Who it's for:** Any patient with VSP, EyeMed, Davis Vision, or Spectera benefits who hasn't used their frame or contact lens allowance for the year.

**When to run it:** October 1 through November 30. Starting in October gives patients time to act before holiday schedules get crowded. Waiting until December means you're competing with every other practice that remembered at the last minute.

**Why it works:** This is the highest-urgency campaign of the year. Patients paid premiums all year for coverage they're about to lose. A message that includes the exact dollar amount and the exact deadline converts significantly better than a generic reminder.

**What to say:**

Generic (low conversion): Don't forget — your vision benefits may expire soon. Call us to schedule.

Personalized (high conversion): Hi Sarah — you have $175 in unused EyeMed frame benefits that expire December 31. It's enough to cover new frames with nothing out of pocket. Want us to hold a time for you?

**What you need:** A current patient list with insurance information, plus actual eligibility data so you know which patients have remaining benefits and how much.

---

## Campaign 2: New Benefit Year (January–February)

**Who it's for:** Patients whose insurance just reset on January 1. This includes the majority of VSP patients and many EyeMed patients.

**When to run it:** January 2–February 28. This is the most underused window in optometry. While every other practice is silent, you can be the first voice patients hear after their benefits renew.

**Why it works:** Patients who didn't use their benefits last year often have some vague guilt or intention to "do it this year." A timely message in early January catches them when that intention is fresh.

**What to say:** Hi James — your VSP benefits renewed on January 1, which means you have a fresh $150 frame allowance and covered annual exam. Happy to get you scheduled anytime this month.

---

## Campaign 3: Contact Lens Annual Benefit Reminder (May–June and August–September)

**Who it's for:** Patients who are contact lens wearers with a CL benefit from their vision plan. VSP typically covers $150–$160 in contact lens materials per year; EyeMed covers $150–$200 depending on the plan.

**When to run it:** Twice a year — once in late spring and once in late summer, timed roughly 12 months after a patient's last contact lens order.

**What to say:** Hi Marcus — it's been about a year since your last contact lens order, and your VSP benefit covers $160 toward your next supply. That's enough for a full year of lenses with very little out of pocket. Want me to pull your prescription and get an order started?

---

## Campaign 4: Back-to-School Families (July–August)

**Who it's for:** Patients who have children on their vision plan — specifically families whose kids are due for an annual exam before the school year starts.

**When to run it:** July 1–August 15.

**What to say:** Hi Jennifer — VSP covers your child's annual eye exam before school starts, plus $150 toward new glasses if their prescription changed. August is filling up — want to grab a time in the next few weeks?

---

## Campaign 5: Mid-Year Benefits Check-In (April–May)

**Who it's for:** Patients whose plans reset mid-year (July 1) rather than January 1. This includes some EyeMed plans, Davis Vision plans, and Spectera.

**What to say:** Hi Rachel — your Davis Vision benefits reset on July 1, which means your current $200 frame allowance expires in about 60 days. A lot of our patients prefer coming in the spring before things get busy. Want to get scheduled?

---

## The Revenue Math

Assume a practice with 2,000 active patients:

- End-of-year campaign: 800 patients with unused frame benefits × 10% book × $375 average = $30,000
- New year campaign: 200 early-year bookers × $375 = $7,500
- CL benefit reminder (twice): 400 CL patients × 8% response × $200 average = $6,400
- Back-to-school: 150 family bookings × $350 = $5,250
- Mid-year check-in: 100 bookings × $375 = $3,750

Conservative total: $52,900 in additional annual optical revenue from patients already in the practice's system.

Against a practice management tool at $449/month ($5,388/year), that's roughly a 10:1 return.
    `,
  },
  {
    slug: 'vision-benefits-expiring-patients',
    title: 'How to Reach Patients With Vision Benefits Expiring Before December 31',
    description: "Most practices lose $15–50K in optical revenue every year to unused VSP and EyeMed benefits. Here's how to reach those patients before December 31.",
    dateISO: '2026-05-23',
    dateDisplay: 'May 23, 2026',
    content: `
## Why Patients Let Vision Benefits Expire Every December 31

Every January 1, millions of dollars in unused vision benefits reset to zero. Patients who paid premiums all year for VSP or EyeMed coverage simply never came in — not because they didn't need glasses or contacts, but because nobody reminded them with enough urgency or specificity to act.

The average unused frame allowance at expiration is $150–$200 per patient. Multiply that across a patient list of 2,000 and you're looking at hundreds of thousands of dollars in potential optical revenue that evaporates every year.

---

## How Much Unused VSP and EyeMed Revenue Is Sitting in Your Patient List

Most practice managers don't know the exact number — and that's part of the problem. Without running eligibility checks on your patient list, you're guessing.

Here's what the math looks like for a typical independent practice:

- 2,000 active patients
- ~40% have VSP or EyeMed coverage with a remaining frame or contact lens allowance
- Average unused benefit: $165 per patient
- 800 patients × $165 = $132,000 in recoverable optical revenue

That's sitting in your patient database right now. Not revenue you have to generate from new patients — revenue from people who already chose your practice, already have insurance that covers them, and just need a reason to come in before December 31.

---

## The Difference Between a Generic Recall Message and a Benefit-Specific Campaign

A generic recall message says: Hi Sarah, it's been a while since your last visit. We'd love to see you soon!

A benefit-specific campaign says: Hi Sarah, you have $150 in unused VSP frame benefits that expire December 31. Come choose new frames before you lose them.

One message asks the patient to find a reason to come in. The other gives them the reason.

The response rate difference is significant. Generic benefit reminders typically see 2–5% appointment conversion. Campaigns that include the patient's exact benefit amount and expiration date consistently see 8–15% conversion.

---

## How to Identify Which Patients Have Frame or Contact Lens Allowances Left

1. Export your patient list from your EHR — RevolutionEHR, Eyefinity, Crystal PM, and most other practice management systems can export a CSV of patients with their insurance information.

2. Run batch eligibility verification — rather than checking one patient at a time, run the entire list through an eligibility API. This pulls the exact frame allowance, contact lens benefit, and expiration date for each patient in minutes.

3. Segment by benefit amount and urgency — patients with $200+ in unused benefits get a different message than patients with $50 remaining.

4. Send personalized campaigns by segment — each patient receives a message with their specific dollar amount and their specific deadline.

---

## What a Year-Round Vision Benefit Recovery Strategy Looks Like

January–February: New benefit year campaign. Message: Your 2026 VSP benefits are ready to use.

April–May: Mid-year check-in for plans that reset July 1. Message: Your benefits reset in 60 days — here's what you have available.

June–July: Contact lens reorder campaign. Message: Your annual contact lens benefit covers your next order.

August–September: Back-to-school families. Message: VSP covers your child's annual exam — schedule before September.

October–November: End-of-year benefits push. Message: Your $175 in frame benefits expires December 31 — 61 days left.

Each of these campaigns works because it connects the patient's specific benefit to a specific reason to act now. The practices that run all five consistently recover 3–5x more optical revenue from existing patients than practices that run one Q4 blast.

---

## Getting Started

The first step is knowing what's in your patient list. Export your patients from your EHR, run eligibility verification on the list, and look at the total dollar figure of unused benefits sitting in your practice.

For most practices, that number is larger than expected — and it's the clearest argument for building a systematic outreach process before the next December 31 wipes it out again.
    `,
  },
]

function buildHtml(template, post) {
  const url = `${BASE_URL}/blog/${post.slug}`
  const safeDesc = post.description.replace(/"/g, '&quot;').replace(/'/g, '&#39;')
  const safeTitle = post.title.replace(/"/g, '&quot;')

  const schema = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.dateISO,
    dateModified: post.dateISO,
    author: { '@type': 'Person', name: 'Stockton Lundell', jobTitle: 'Founder, Prizm' },
    publisher: { '@type': 'Organization', name: 'Prizm', url: BASE_URL },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  })

  const headTags = `
  <title>${post.title} — Prizm Blog</title>
  <meta name="description" content="${safeDesc}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${safeTitle} — Prizm Blog" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:site_name" content="Prizm" />
  <script type="application/ld+json">${schema}</script>`

  const noscriptContent = `
  <noscript>
    <article style="max-width:800px;margin:0 auto;padding:2rem;font-family:sans-serif;color:#1a1a2e">
      <a href="/blog" style="color:#0066ff;text-decoration:none">← All posts</a>
      <h1 style="font-size:2rem;font-weight:900;margin:1.5rem 0 1rem">${post.title}</h1>
      <p style="font-size:1.125rem;color:#6b7280;margin-bottom:1.5rem">${post.description}</p>
      <p style="font-size:0.875rem;color:#9ca3af;margin-bottom:2rem">By Stockton Lundell · ${post.dateDisplay}</p>
      <div style="line-height:1.75;color:#374151">${markdownToHtml(post.content)}</div>
    </article>
  </noscript>`

  let html = template
  html = html.replace(/<title>[^<]*<\/title>/, '')
  html = html.replace(/<meta name="description"[^>]*\/?>/, '')
  html = html.replace(/<meta property="og:[^"]*"[^>]*\/?>/g, '')
  html = html.replace('</head>', `${headTags}\n</head>`)
  html = html.replace('<body>', `<body>\n${noscriptContent}`)
  return html
}

const templatePath = path.join(distDir, 'index.html')
if (!fs.existsSync(templatePath)) {
  console.error('Error: dist/index.html not found. Run vite build first.')
  process.exit(1)
}

const template = fs.readFileSync(templatePath, 'utf-8')

for (const post of POSTS) {
  const outDir = path.join(distDir, 'blog', post.slug)
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(path.join(outDir, 'index.html'), buildHtml(template, post))
  console.log(`✓ Pre-rendered /blog/${post.slug}`)
}

console.log('Blog pre-rendering complete.')
