export interface PatientInsurance {
  carrier: string
  memberId: string
  groupNumber: string
  subscriberName: string
  subscriberDob: string
  relationship: 'Self' | 'Spouse' | 'Child' | 'Other'
}

export interface Patient {
  id: number
  firstName: string
  lastName: string
  dob: string
  gender: 'Male' | 'Female' | 'Other'
  phone: string
  email: string
  address: string
  primaryInsurance: PatientInsurance
  secondaryInsurance?: PatientInsurance
  lastVerified: string
  status: 'active' | 'pending' | 'unverified'
  lastVisit: string
  // Rx frame purchase
  lastFramePurchaseDate?: string
  lastFrameBrand?: string
  lastFrameModel?: string
  // Sunglasses purchase (separate from Rx frames)
  lastSunglassesPurchaseDate?: string
  lastSunglassesBrand?: string
  lastSunglassesModel?: string
  // Contact lens history
  lastClOrderDate?: string
  lastClBrand?: string
  clSupplyDays?: 30 | 60 | 90 | 365
  benefits: {
    exam: { covered: boolean; used: boolean; usedDate?: string }
    frames: { allowance: number; used: number }
    lenses: { covered: boolean; used: boolean; usedDate?: string }
    contacts: { allowance: number; used: number }
    benefitPeriodEnd: string
    examCopay: number
    materialsCopay: number
    planYear: { start: string; end: string }
    frequency: { exam: string; materials: string }
    copays: { exam: number; materials: number; contactFitting: number }
    outOfNetwork: { exam: number; frames: number; lenses: number; contacts: number }
    requiresPriorAuth: boolean
  }
  eligibilityHistory: Array<{ date: string; status: 'active' | 'inactive' | 'pending'; checkedBy: string }>
}

// ─── Segmentation helpers ─────────────────────────────────────────────────────

export const LUXURY_BRANDS = [
  'Maui Jim', 'Silhouette', 'Lindberg', 'Tom Ford', 'Oliver Peoples',
  'Costa', 'Lafont', 'Mykita', 'Barton Perreira', 'Chanel', 'Dior',
  'Gucci', 'Prada', 'ic! berlin',
]

export function isLuxuryBuyer(p: Patient): boolean {
  return LUXURY_BRANDS.some(b =>
    (p.lastFrameBrand ?? '').toLowerCase().includes(b.toLowerCase()) ||
    (p.lastSunglassesBrand ?? '').toLowerCase().includes(b.toLowerCase())
  )
}

export function isSunglassesBuyer(p: Patient): boolean {
  return !!p.lastSunglassesBrand
}

const TODAY = new Date('2026-05-24')

export function clNextReorderDate(p: Patient): Date | null {
  if (!p.lastClOrderDate || !p.clSupplyDays) return null
  const d = new Date(p.lastClOrderDate)
  d.setDate(d.getDate() + p.clSupplyDays)
  return d
}

export function isCLReorderDue(p: Patient, withinDays = 60): boolean {
  const next = clNextReorderDate(p)
  if (!next) return false
  const diff = (next.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24)
  return diff <= withinDays
}

// Patient has >$75 in remaining frame allowance before benefit expiry
export function isSecondPairCandidate(p: Patient): boolean {
  const remaining = p.benefits.frames.allowance - p.benefits.frames.used
  const end = new Date(p.benefits.benefitPeriodEnd)
  return remaining > 75 && end > TODAY
}

// Spouse or child on someone else's policy
export function isFamilyDependent(p: Patient): boolean {
  return p.primaryInsurance.relationship !== 'Self'
}

// Self subscriber who has dependents in the patient list
export function hasFamilyDependents(p: Patient, all: Patient[]): boolean {
  if (p.primaryInsurance.relationship !== 'Self') return false
  const myName = getPatientFullName(p)
  return all.some(
    o =>
      o.id !== p.id &&
      o.primaryInsurance.subscriberName === myName &&
      o.primaryInsurance.carrier === p.primaryInsurance.carrier,
  )
}

export const PATIENTS: Patient[] = [
  // ─── 1 · Sarah Mitchell — VSP Self ───────────────────────────────────────
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Mitchell',
    dob: '1985-03-22',
    gender: 'Female',
    phone: '(555) 201-4832',
    email: 'sarah.mitchell@email.com',
    address: '142 Maple Drive, Springfield, IL 62701',
    primaryInsurance: {
      carrier: 'VSP',
      memberId: 'VSP00192837',
      groupNumber: 'G-44821',
      subscriberName: 'Sarah Mitchell',
      subscriberDob: '1985-03-22',
      relationship: 'Self',
    },
    lastVerified: '2026-05-16',
    status: 'active',
    lastVisit: '2026-04-10',
    lastFramePurchaseDate: '2024-03-15',
    lastFrameBrand: 'Maui Jim',
    lastFrameModel: 'Peahi',
    lastSunglassesBrand: 'Maui Jim',
    lastSunglassesModel: 'Breakwall',
    lastSunglassesPurchaseDate: '2023-06-15',
    lastClOrderDate: '2025-04-10',
    lastClBrand: 'Acuvue Oasys',
    clSupplyDays: 90,
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 150, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 130, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 10,
      materialsCopay: 25,
      planYear: { start: 'Jan 1, 2026', end: 'Dec 31, 2026' },
      frequency: { exam: 'Once every 12 months', materials: 'Once every 12 months' },
      copays: { exam: 10, materials: 25, contactFitting: 0 },
      outOfNetwork: { exam: 45, frames: 70, lenses: 50, contacts: 105 },
      requiresPriorAuth: false,
    },
    eligibilityHistory: [
      { date: '2026-05-16', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2026-01-10', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-06-22', status: 'active', checkedBy: 'Front Desk' },
    ],
  },

  // ─── 2 · James Thornton — EyeMed Self ────────────────────────────────────
  {
    id: 2,
    firstName: 'James',
    lastName: 'Thornton',
    dob: '1979-07-14',
    gender: 'Male',
    phone: '(555) 349-7701',
    email: 'j.thornton@gmail.com',
    address: '89 Oak Street, Chicago, IL 60601',
    primaryInsurance: {
      carrier: 'EyeMed',
      memberId: 'EM88234001',
      groupNumber: 'G-11034',
      subscriberName: 'James Thornton',
      subscriberDob: '1979-07-14',
      relationship: 'Self',
    },
    lastVerified: '2026-05-16',
    status: 'active',
    lastVisit: '2026-03-28',
    lastFramePurchaseDate: '2026-01-10',
    lastFrameBrand: 'Ray-Ban',
    lastFrameModel: 'Aviator Classic',
    benefits: {
      exam: { covered: true, used: true, usedDate: '2026-01-10' },
      frames: { allowance: 200, used: 200 },
      lenses: { covered: true, used: true, usedDate: '2026-01-10' },
      contacts: { allowance: 0, used: 0 },
      benefitPeriodEnd: '2027-01-09',
      examCopay: 0,
      materialsCopay: 0,
      planYear: { start: 'Jan 10, 2026', end: 'Jan 9, 2027' },
      frequency: { exam: 'Once every 12 months', materials: 'Once every 12 months' },
      copays: { exam: 0, materials: 0, contactFitting: 40 },
      outOfNetwork: { exam: 35, frames: 55, lenses: 40, contacts: 90 },
      requiresPriorAuth: false,
    },
    eligibilityHistory: [
      { date: '2026-05-16', status: 'active', checkedBy: 'Front Desk' },
      { date: '2026-01-10', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2025-01-08', status: 'active', checkedBy: 'Front Desk' },
    ],
  },

  // ─── 3 · Linda Kowalski — Davis Vision Self ───────────────────────────────
  {
    id: 3,
    firstName: 'Linda',
    lastName: 'Kowalski',
    dob: '1962-11-30',
    gender: 'Female',
    phone: '(555) 482-0023',
    email: 'lkowalski@yahoo.com',
    address: '310 Pine Avenue, Peoria, IL 61602',
    primaryInsurance: {
      carrier: 'Davis Vision',
      memberId: 'DV55910234',
      groupNumber: 'G-78003',
      subscriberName: 'Linda Kowalski',
      subscriberDob: '1962-11-30',
      relationship: 'Self',
    },
    lastVerified: '2026-05-14',
    status: 'pending',
    lastVisit: '2026-02-14',
    lastClOrderDate: '2026-04-14',
    lastClBrand: 'Proclear 1 Day',
    clSupplyDays: 30,
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 175, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 150, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 15,
      materialsCopay: 30,
      planYear: { start: 'Jan 1, 2026', end: 'Dec 31, 2026' },
      frequency: { exam: 'Once every 12 months', materials: 'Once every 24 months' },
      copays: { exam: 15, materials: 30, contactFitting: 0 },
      outOfNetwork: { exam: 40, frames: 60, lenses: 45, contacts: 100 },
      requiresPriorAuth: false,
    },
    eligibilityHistory: [
      { date: '2026-05-14', status: 'pending', checkedBy: 'Front Desk' },
      { date: '2025-11-30', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-05-20', status: 'active', checkedBy: 'Dr. Reynolds' },
    ],
  },

  // ─── 4 · Marcus Rivera — Spectera Self ───────────────────────────────────
  {
    id: 4,
    firstName: 'Marcus',
    lastName: 'Rivera',
    dob: '1968-05-30',
    gender: 'Male',
    phone: '(555) 611-9954',
    email: 'mrivera@work.com',
    address: '55 Elm Court, Rockford, IL 61101',
    primaryInsurance: {
      carrier: 'Spectera',
      memberId: 'SP77123456',
      groupNumber: 'G-20194',
      subscriberName: 'Marcus Rivera',
      subscriberDob: '1968-05-30',
      relationship: 'Self',
    },
    lastVerified: '2025-11-20',
    status: 'unverified',
    lastVisit: '2025-11-20',
    lastFramePurchaseDate: '2024-11-18',
    lastFrameBrand: 'Oakley',
    lastFrameModel: 'Holbrook',
    lastSunglassesBrand: 'Oakley',
    lastSunglassesModel: 'Radar EV',
    lastSunglassesPurchaseDate: '2023-08-05',
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 120, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 0, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 20,
      materialsCopay: 20,
      planYear: { start: 'Jan 1, 2026', end: 'Dec 31, 2026' },
      frequency: { exam: 'Once every 12 months', materials: 'Once every 12 months' },
      copays: { exam: 20, materials: 20, contactFitting: 25 },
      outOfNetwork: { exam: 30, frames: 50, lenses: 35, contacts: 80 },
      requiresPriorAuth: false,
    },
    eligibilityHistory: [
      { date: '2025-11-20', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-03-14', status: 'active', checkedBy: 'Front Desk' },
      { date: '2024-11-18', status: 'active', checkedBy: 'Dr. Reynolds' },
    ],
  },

  // ─── 5 · Diana Patel — VSP Child (subscriber: Raj Patel) ─────────────────
  {
    id: 5,
    firstName: 'Diana',
    lastName: 'Patel',
    dob: '1995-01-04',
    gender: 'Female',
    phone: '(555) 703-2281',
    email: 'diana.patel@gmail.com',
    address: '221 Birch Lane, Naperville, IL 60540',
    primaryInsurance: {
      carrier: 'VSP',
      memberId: 'VSP00834291',
      groupNumber: 'G-44821',
      subscriberName: 'Raj Patel',
      subscriberDob: '1965-08-19',
      relationship: 'Child',
    },
    lastVerified: '2026-05-18',
    status: 'active',
    lastVisit: '2026-04-22',
    lastFramePurchaseDate: '2026-04-22',
    lastFrameBrand: 'Kate Spade',
    lastClOrderDate: '2025-09-10',
    lastClBrand: 'Dailies Total 1',
    clSupplyDays: 90,
    benefits: {
      exam: { covered: true, used: true, usedDate: '2026-04-22' },
      frames: { allowance: 150, used: 90 },
      lenses: { covered: true, used: true, usedDate: '2026-04-22' },
      contacts: { allowance: 130, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 10,
      materialsCopay: 25,
      planYear: { start: 'Jan 1, 2026', end: 'Dec 31, 2026' },
      frequency: { exam: 'Once every 12 months', materials: 'Once every 12 months' },
      copays: { exam: 10, materials: 25, contactFitting: 0 },
      outOfNetwork: { exam: 45, frames: 70, lenses: 50, contacts: 105 },
      requiresPriorAuth: false,
    },
    eligibilityHistory: [
      { date: '2026-05-18', status: 'active', checkedBy: 'Front Desk' },
      { date: '2026-04-22', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2025-09-10', status: 'active', checkedBy: 'Front Desk' },
    ],
  },

  // ─── 6 · Robert Chen — UHC Vision Self ───────────────────────────────────
  {
    id: 6,
    firstName: 'Robert',
    lastName: 'Chen',
    dob: '1958-09-17',
    gender: 'Male',
    phone: '(555) 844-3390',
    email: 'robert.chen@comcast.net',
    address: '408 Walnut Street, Evanston, IL 60201',
    primaryInsurance: {
      carrier: 'UHC Vision',
      memberId: 'UHC44902817',
      groupNumber: 'G-55109',
      subscriberName: 'Robert Chen',
      subscriberDob: '1958-09-17',
      relationship: 'Self',
    },
    secondaryInsurance: {
      carrier: 'Medicare Advantage',
      memberId: 'MCA77234901',
      groupNumber: 'G-99001',
      subscriberName: 'Robert Chen',
      subscriberDob: '1958-09-17',
      relationship: 'Self',
    },
    lastVerified: '2026-05-12',
    status: 'active',
    lastVisit: '2026-05-12',
    lastFramePurchaseDate: '2024-05-14',
    lastFrameBrand: 'Silhouette',
    lastSunglassesBrand: 'Maui Jim',
    lastSunglassesModel: 'Lighthouse',
    lastSunglassesPurchaseDate: '2023-09-20',
    benefits: {
      exam: { covered: true, used: true, usedDate: '2026-05-12' },
      frames: { allowance: 200, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 0, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 0,
      materialsCopay: 15,
      planYear: { start: 'Jan 1, 2026', end: 'Dec 31, 2026' },
      frequency: { exam: 'Once every 12 months', materials: 'Once every 24 months' },
      copays: { exam: 0, materials: 15, contactFitting: 0 },
      outOfNetwork: { exam: 35, frames: 50, lenses: 40, contacts: 0 },
      requiresPriorAuth: false,
    },
    eligibilityHistory: [
      { date: '2026-05-12', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2025-05-08', status: 'active', checkedBy: 'Front Desk' },
      { date: '2024-05-14', status: 'active', checkedBy: 'Front Desk' },
    ],
  },

  // ─── 7 · Amara Osei — Humana Child (subscriber: Kwame Osei) ──────────────
  {
    id: 7,
    firstName: 'Amara',
    lastName: 'Osei',
    dob: '2001-04-12',
    gender: 'Female',
    phone: '(555) 920-5517',
    email: 'amara.osei@outlook.com',
    address: '73 Cedar Court, Aurora, IL 60505',
    primaryInsurance: {
      carrier: 'Humana',
      memberId: 'HUM99031822',
      groupNumber: 'G-66234',
      subscriberName: 'Kwame Osei',
      subscriberDob: '1970-02-28',
      relationship: 'Child',
    },
    lastVerified: '2026-04-01',
    status: 'active',
    lastVisit: '2026-04-30',
    lastFramePurchaseDate: '2026-04-30',
    lastFrameBrand: 'Nike',
    lastClOrderDate: '2026-04-30',
    lastClBrand: 'Biofinity',
    clSupplyDays: 60,
    benefits: {
      exam: { covered: true, used: true, usedDate: '2026-04-30' },
      frames: { allowance: 150, used: 150 },
      lenses: { covered: true, used: true, usedDate: '2026-04-30' },
      contacts: { allowance: 130, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 15,
      materialsCopay: 25,
      planYear: { start: 'Jan 1, 2026', end: 'Dec 31, 2026' },
      frequency: { exam: 'Once every 12 months', materials: 'Once every 12 months' },
      copays: { exam: 15, materials: 25, contactFitting: 20 },
      outOfNetwork: { exam: 40, frames: 65, lenses: 45, contacts: 100 },
      requiresPriorAuth: false,
    },
    eligibilityHistory: [
      { date: '2026-04-01', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2025-10-15', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-04-28', status: 'active', checkedBy: 'Front Desk' },
    ],
  },

  // ─── 8 · Thomas Garrett — Anthem Self ────────────────────────────────────
  {
    id: 8,
    firstName: 'Thomas',
    lastName: 'Garrett',
    dob: '1943-12-03',
    gender: 'Male',
    phone: '(555) 134-6628',
    email: 'tgarrett@aol.com',
    address: '916 Spruce Boulevard, Joliet, IL 60432',
    primaryInsurance: {
      carrier: 'Anthem',
      memberId: 'ANT66781204',
      groupNumber: 'G-88102',
      subscriberName: 'Thomas Garrett',
      subscriberDob: '1943-12-03',
      relationship: 'Self',
    },
    lastVerified: '2026-05-15',
    status: 'unverified',
    lastVisit: '2025-09-14',
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 100, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 0, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 20,
      materialsCopay: 20,
      planYear: { start: 'Jan 1, 2026', end: 'Dec 31, 2026' },
      frequency: { exam: 'Once every 12 months', materials: 'Once every 24 months' },
      copays: { exam: 20, materials: 20, contactFitting: 0 },
      outOfNetwork: { exam: 30, frames: 45, lenses: 35, contacts: 0 },
      requiresPriorAuth: true,
    },
    eligibilityHistory: [
      { date: '2026-05-15', status: 'inactive', checkedBy: 'Front Desk' },
      { date: '2025-09-14', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2025-03-10', status: 'active', checkedBy: 'Front Desk' },
    ],
  },

  // ─── 9 · Priya Nair — EyeMed Spouse (subscriber: Arjun Nair) ─────────────
  {
    id: 9,
    firstName: 'Priya',
    lastName: 'Nair',
    dob: '1988-06-25',
    gender: 'Female',
    phone: '(555) 267-8843',
    email: 'priya.nair@gmail.com',
    address: '34 Willow Way, Schaumburg, IL 60173',
    primaryInsurance: {
      carrier: 'EyeMed',
      memberId: 'EM20091447',
      groupNumber: 'G-11034',
      subscriberName: 'Arjun Nair',
      subscriberDob: '1985-03-11',
      relationship: 'Spouse',
    },
    lastVerified: '2026-05-10',
    status: 'active',
    lastVisit: '2026-05-10',
    lastClOrderDate: '2026-05-10',
    lastClBrand: 'Acuvue Oasys 1-Day',
    clSupplyDays: 30,
    benefits: {
      exam: { covered: true, used: true, usedDate: '2026-05-10' },
      frames: { allowance: 200, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 200, used: 200 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 0,
      materialsCopay: 0,
      planYear: { start: 'Jan 1, 2026', end: 'Dec 31, 2026' },
      frequency: { exam: 'Once every 12 months', materials: 'Once every 12 months' },
      copays: { exam: 0, materials: 0, contactFitting: 0 },
      outOfNetwork: { exam: 35, frames: 55, lenses: 40, contacts: 90 },
      requiresPriorAuth: false,
    },
    eligibilityHistory: [
      { date: '2026-05-10', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2025-11-22', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-05-14', status: 'active', checkedBy: 'Front Desk' },
    ],
  },

  // ─── 10 · David Okafor — Davis Vision Self ───────────────────────────────
  {
    id: 10,
    firstName: 'David',
    lastName: 'Okafor',
    dob: '1976-03-08',
    gender: 'Male',
    phone: '(555) 399-1120',
    email: 'david.okafor@hotmail.com',
    address: '187 Ash Street, Waukegan, IL 60085',
    primaryInsurance: {
      carrier: 'Davis Vision',
      memberId: 'DV88302491',
      groupNumber: 'G-78003',
      subscriberName: 'David Okafor',
      subscriberDob: '1976-03-08',
      relationship: 'Self',
    },
    secondaryInsurance: {
      carrier: 'Aetna Vision',
      memberId: 'AET34119020',
      groupNumber: 'G-55311',
      subscriberName: 'David Okafor',
      subscriberDob: '1976-03-08',
      relationship: 'Self',
    },
    lastVerified: '2026-05-17',
    status: 'active',
    lastVisit: '2026-05-05',
    lastFramePurchaseDate: '2025-06-18',
    lastFrameBrand: 'Costa',
    lastFrameModel: 'Brine',
    lastSunglassesBrand: 'Costa',
    lastSunglassesModel: 'Saltbreak',
    lastSunglassesPurchaseDate: '2025-03-10',
    lastClOrderDate: '2026-05-05',
    lastClBrand: 'Biofinity Toric',
    clSupplyDays: 90,
    benefits: {
      exam: { covered: true, used: true, usedDate: '2026-05-05' },
      frames: { allowance: 175, used: 80 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 150, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 15,
      materialsCopay: 30,
      planYear: { start: 'Mar 8, 2026', end: 'Mar 7, 2027' },
      frequency: { exam: 'Once every 12 months', materials: 'Once every 12 months' },
      copays: { exam: 15, materials: 30, contactFitting: 15 },
      outOfNetwork: { exam: 40, frames: 60, lenses: 45, contacts: 100 },
      requiresPriorAuth: false,
    },
    eligibilityHistory: [
      { date: '2026-05-17', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2025-06-18', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-01-10', status: 'active', checkedBy: 'Front Desk' },
    ],
  },

  // ─── 11 · Michael Torres — VSP Self (father, subscriber for family) ───────
  {
    id: 11,
    firstName: 'Michael',
    lastName: 'Torres',
    dob: '1981-04-17',
    gender: 'Male',
    phone: '(555) 512-3344',
    email: 'michael.torres@gmail.com',
    address: '890 Sycamore Lane, Naperville, IL 60563',
    primaryInsurance: {
      carrier: 'VSP',
      memberId: 'VSP00561482',
      groupNumber: 'G-44821',
      subscriberName: 'Michael Torres',
      subscriberDob: '1981-04-17',
      relationship: 'Self',
    },
    lastVerified: '2026-05-20',
    status: 'active',
    lastVisit: '2026-02-28',
    lastFramePurchaseDate: '2024-09-05',
    lastFrameBrand: 'Maui Jim',
    lastFrameModel: 'Stillwater',
    lastSunglassesBrand: 'Maui Jim',
    lastSunglassesModel: 'Ho\'okipa',
    lastSunglassesPurchaseDate: '2024-04-12',
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 150, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 0, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 10,
      materialsCopay: 25,
      planYear: { start: 'Jan 1, 2026', end: 'Dec 31, 2026' },
      frequency: { exam: 'Once every 12 months', materials: 'Once every 12 months' },
      copays: { exam: 10, materials: 25, contactFitting: 0 },
      outOfNetwork: { exam: 45, frames: 70, lenses: 50, contacts: 105 },
      requiresPriorAuth: false,
    },
    eligibilityHistory: [
      { date: '2026-05-20', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-09-05', status: 'active', checkedBy: 'Dr. Reynolds' },
    ],
  },

  // ─── 12 · Emma Torres — VSP Child (subscriber: Michael Torres) ───────────
  {
    id: 12,
    firstName: 'Emma',
    lastName: 'Torres',
    dob: '2011-08-03',
    gender: 'Female',
    phone: '(555) 512-3344',
    email: 'michael.torres@gmail.com',
    address: '890 Sycamore Lane, Naperville, IL 60563',
    primaryInsurance: {
      carrier: 'VSP',
      memberId: 'VSP00561483',
      groupNumber: 'G-44821',
      subscriberName: 'Michael Torres',
      subscriberDob: '1981-04-17',
      relationship: 'Child',
    },
    lastVerified: '2026-05-20',
    status: 'active',
    lastVisit: '2025-08-14',
    lastFramePurchaseDate: '2025-08-14',
    lastFrameBrand: 'Nike',
    lastFrameModel: 'Flex',
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 125, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 0, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 10,
      materialsCopay: 25,
      planYear: { start: 'Jan 1, 2026', end: 'Dec 31, 2026' },
      frequency: { exam: 'Once every 12 months', materials: 'Once every 12 months' },
      copays: { exam: 10, materials: 25, contactFitting: 0 },
      outOfNetwork: { exam: 45, frames: 70, lenses: 50, contacts: 105 },
      requiresPriorAuth: false,
    },
    eligibilityHistory: [
      { date: '2026-05-20', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-08-14', status: 'active', checkedBy: 'Dr. Reynolds' },
    ],
  },

  // ─── 13 · Jake Torres — VSP Child (subscriber: Michael Torres) ───────────
  {
    id: 13,
    firstName: 'Jake',
    lastName: 'Torres',
    dob: '2014-02-19',
    gender: 'Male',
    phone: '(555) 512-3344',
    email: 'michael.torres@gmail.com',
    address: '890 Sycamore Lane, Naperville, IL 60563',
    primaryInsurance: {
      carrier: 'VSP',
      memberId: 'VSP00561484',
      groupNumber: 'G-44821',
      subscriberName: 'Michael Torres',
      subscriberDob: '1981-04-17',
      relationship: 'Child',
    },
    lastVerified: '2026-05-20',
    status: 'active',
    lastVisit: '2025-07-22',
    lastFramePurchaseDate: '2025-07-22',
    lastFrameBrand: 'Nike',
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 125, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 0, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 10,
      materialsCopay: 25,
      planYear: { start: 'Jan 1, 2026', end: 'Dec 31, 2026' },
      frequency: { exam: 'Once every 12 months', materials: 'Once every 12 months' },
      copays: { exam: 10, materials: 25, contactFitting: 0 },
      outOfNetwork: { exam: 45, frames: 70, lenses: 50, contacts: 105 },
      requiresPriorAuth: false,
    },
    eligibilityHistory: [
      { date: '2026-05-20', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-07-22', status: 'active', checkedBy: 'Dr. Reynolds' },
    ],
  },
]

export function getPatientFullName(p: Patient) {
  return `${p.firstName} ${p.lastName}`
}
