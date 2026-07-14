# PRISM — Technical Reference

## Database Schema
```sql
practices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  stripe_customer_id text,
  subscription_status text DEFAULT 'trial',
  created_at timestamptz DEFAULT now()
)

users (
  id uuid PRIMARY KEY REFERENCES auth.users,
  practice_id uuid REFERENCES practices(id),
  email text NOT NULL,
  role text DEFAULT 'staff',
  created_at timestamptz DEFAULT now()
)

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
  last_cl_order date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

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

## Row Level Security Pattern
```sql
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "practices see own data only"
ON patients FOR ALL
USING (practice_id = (
  SELECT practice_id FROM users
  WHERE id = auth.uid()
));
```
Apply to: patients, eligibility_checks,
campaign_messages, audit_logs

## API Routes
POST /api/auth/signup
POST /api/auth/login
POST /api/practices/create
GET  /api/practices/me
POST /api/patients/upload-csv
GET  /api/patients/list
GET  /api/patients/with-benefits
POST /api/eligibility/check-batch
GET  /api/eligibility/results/:practiceId
POST /api/campaigns/create
GET  /api/campaigns/list
POST /api/campaigns/generate-messages
POST /api/campaigns/approve
POST /api/campaigns/send
GET  /api/dashboard/stats
POST /api/billing/create-subscription
POST /api/billing/webhook

## Environment Variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STEDI_API_KEY=
PVERIFY_CLIENT_ID=
PVERIFY_CLIENT_SECRET=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=
POSTMARK_SERVER_TOKEN=
ANTHROPIC_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

## CSV Normalization Rules
Phone: strip all non-digits → "8015551234"
Dates: convert all formats → "YYYY-MM-DD"
Email: lowercase always
Carriers:
  "VSP" | "Vision Service Plan" → "VSP"
  "EyeMed" | "Eye Med" | "Luxottica" → "EyeMed"
  "Davis Vision" | "Davis" → "Davis Vision"
  "Spectera" | "UHC Vision" → "Spectera"

## Stedi Integration
Service type code 30 first, then AL for vision
Tier 1: $500/month + $0.15/check over 3,333
Switch to pVerify at exactly 50 customers

## HIPAA Rules
Never put PHI in logs
Never put PHI in URLs
Always validate practice_id on every request
Always audit log every PHI access
MFA required no exceptions