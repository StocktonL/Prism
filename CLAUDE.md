# Prism — Project Overview

Prism is a SaaS dashboard built for optometry practices. It handles insurance verification, eligibility checks, benefits reminders, and patient SMS campaigns.

## What Prism Does
- **Insurance Eligibility** — verify patient vision benefits in real time
- **Benefits Reminders** — show hard dollar frame/lens allowances and alert patients via SMS when benefits are available or expiring
- **Campaign Management** — offices run campaigns (trunk shows, back to school, end of year) to drive patient visits
- **Claims** — future feature

## Tech Stack
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Node.js + TypeScript + Express
- **Database**: PostgreSQL
- **Auth**: Clerk (multi-tenant — each practice is a separate org)
- **SMS**: Twilio
- **Insurance APIs**: Change Healthcare / Availity (270/271 EDI eligibility)

## Project Structure
```
/client    → React frontend (port 5173)
/server    → Express backend (port 3001)
/agents    → C-Team persona CLAUDE.md files
```

## Key Principles
- This app handles PHI (patient health info) — always think HIPAA
- Each optometry practice is a tenant — never mix patient data across practices
- The owner has zero coding experience — explain everything clearly and simply
- Prefer simple, working solutions over clever ones

## The C-Team
Meet the team in /agents — each has their own CLAUDE.md with their role and expertise.
- **Alex** — Assistant CEO (`/agents/ceo/`)
- **Morgan** — Product Manager (`/agents/pm/`)
- **Jordan** — Frontend Developer (`/agents/frontend/`)
- **Riley** — Backend Developer (`/agents/backend/`)
- **Casey** — Domain Expert (`/agents/domain/`)
