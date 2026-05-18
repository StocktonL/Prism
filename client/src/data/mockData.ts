// Shared mock data used across Patients, Eligibility, and Claims pages

export interface Patient {
  id: number
  firstName: string
  lastName: string
  dob: string
  gender: 'Male' | 'Female' | 'Other'
  phone: string
  email: string
  address: string
  insurance: {
    carrier: string
    memberId: string
    groupNumber: string
    subscriberName: string
    subscriberDob: string
    relationship: 'Self' | 'Spouse' | 'Child' | 'Other'
  }
  secondaryInsurance?: {
    carrier: string
    memberId: string
    groupNumber: string
    subscriberName: string
    subscriberDob: string
    relationship: 'Self' | 'Spouse' | 'Child' | 'Other'
  }
  lastVerified: string
  status: 'active' | 'pending' | 'inactive'
  benefits: {
    exam: { covered: boolean; used: boolean; nextEligible?: string }
    frames: { allowance: number; used: number }
    lenses: { covered: boolean; used: boolean; nextEligible?: string }
    contacts: { allowance: number; used: number }
    benefitPeriodEnd: string
    examCopay: number
    materialsCopay: number
  }
  eligibilityHistory: {
    date: string
    status: 'active' | 'inactive' | 'pending'
    checkedBy: string
  }[]
  lastVisit: string
}

export const PATIENTS: Patient[] = [
  {
    id: 1,
    firstName: 'Sarah',
    lastName: 'Mitchell',
    dob: '1985-03-22',
    gender: 'Female',
    phone: '(555) 201-4832',
    email: 'sarah.mitchell@email.com',
    address: '4821 Oakwood Dr, Austin, TX 78745',
    insurance: {
      carrier: 'VSP',
      memberId: 'VSP00192837',
      groupNumber: 'GRP-10042',
      subscriberName: 'Sarah Mitchell',
      subscriberDob: '1985-03-22',
      relationship: 'Self',
    },
    lastVerified: '2026-05-16',
    status: 'active',
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 150, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 130, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 10,
      materialsCopay: 25,
    },
    eligibilityHistory: [
      { date: '2026-05-16', status: 'active', checkedBy: 'Front Desk' },
      { date: '2026-01-08', status: 'active', checkedBy: 'System' },
      { date: '2025-05-12', status: 'active', checkedBy: 'Front Desk' },
    ],
    lastVisit: '2026-04-10',
  },
  {
    id: 2,
    firstName: 'James',
    lastName: 'Thornton',
    dob: '1979-07-14',
    gender: 'Male',
    phone: '(555) 349-7701',
    email: 'jthornton@workmail.com',
    address: '1130 Elm Street, Austin, TX 78701',
    insurance: {
      carrier: 'EyeMed',
      memberId: 'EM88234001',
      groupNumber: 'GRP-55021',
      subscriberName: 'James Thornton',
      subscriberDob: '1979-07-14',
      relationship: 'Self',
    },
    lastVerified: '2026-05-14',
    status: 'active',
    benefits: {
      exam: { covered: true, used: true, nextEligible: '2027-01-10' },
      frames: { allowance: 200, used: 200 },
      lenses: { covered: true, used: true, nextEligible: '2027-01-10' },
      contacts: { allowance: 0, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 0,
      materialsCopay: 20,
    },
    eligibilityHistory: [
      { date: '2026-05-14', status: 'active', checkedBy: 'Front Desk' },
      { date: '2026-01-09', status: 'active', checkedBy: 'System' },
      { date: '2025-06-02', status: 'active', checkedBy: 'Front Desk' },
    ],
    lastVisit: '2026-01-10',
  },
  {
    id: 3,
    firstName: 'Linda',
    lastName: 'Kowalski',
    dob: '1962-11-30',
    gender: 'Female',
    phone: '(555) 482-0023',
    email: 'linda.kowalski@home.net',
    address: '892 Maple Lane, Round Rock, TX 78664',
    insurance: {
      carrier: 'Davis Vision',
      memberId: 'DV55910234',
      groupNumber: 'GRP-78830',
      subscriberName: 'Linda Kowalski',
      subscriberDob: '1962-11-30',
      relationship: 'Self',
    },
    lastVerified: '2026-05-10',
    status: 'inactive',
    benefits: {
      exam: { covered: false, used: false },
      frames: { allowance: 0, used: 0 },
      lenses: { covered: false, used: false },
      contacts: { allowance: 0, used: 0 },
      benefitPeriodEnd: '2025-12-31',
      examCopay: 0,
      materialsCopay: 0,
    },
    eligibilityHistory: [
      { date: '2026-05-10', status: 'inactive', checkedBy: 'System' },
      { date: '2025-12-15', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-06-20', status: 'active', checkedBy: 'System' },
    ],
    lastVisit: '2025-11-15',
  },
  {
    id: 4,
    firstName: 'Marcus',
    lastName: 'Rivera',
    dob: '1968-05-30',
    gender: 'Male',
    phone: '(555) 611-9954',
    email: 'marcus.rivera@business.com',
    address: '2244 Cedar Creek Blvd, Pflugerville, TX 78660',
    insurance: {
      carrier: 'Spectera',
      memberId: 'SP77123456',
      groupNumber: 'GRP-30019',
      subscriberName: 'Marcus Rivera',
      subscriberDob: '1968-05-30',
      relationship: 'Self',
    },
    lastVerified: '2025-11-20',
    status: 'pending',
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 175, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 150, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 15,
      materialsCopay: 25,
    },
    eligibilityHistory: [
      { date: '2025-11-20', status: 'pending', checkedBy: 'Front Desk' },
      { date: '2025-05-04', status: 'active', checkedBy: 'System' },
      { date: '2024-11-11', status: 'active', checkedBy: 'Front Desk' },
    ],
    lastVisit: '2025-11-20',
  },
  {
    id: 5,
    firstName: 'Diana',
    lastName: 'Patel',
    dob: '1995-01-04',
    gender: 'Female',
    phone: '(555) 703-2281',
    email: 'diana.patel@gmail.com',
    address: '510 Sunflower Dr, Cedar Park, TX 78613',
    insurance: {
      carrier: 'VSP',
      memberId: 'VSP00384920',
      groupNumber: 'GRP-10042',
      subscriberName: 'Diana Patel',
      subscriberDob: '1995-01-04',
      relationship: 'Self',
    },
    lastVerified: '2026-05-17',
    status: 'active',
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 150, used: 75 },
      lenses: { covered: true, used: true, nextEligible: '2027-04-22' },
      contacts: { allowance: 130, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 10,
      materialsCopay: 25,
    },
    eligibilityHistory: [
      { date: '2026-05-17', status: 'active', checkedBy: 'Front Desk' },
      { date: '2026-04-22', status: 'active', checkedBy: 'System' },
      { date: '2025-04-18', status: 'active', checkedBy: 'Front Desk' },
    ],
    lastVisit: '2026-04-22',
  },
  {
    id: 6,
    firstName: 'David',
    lastName: 'Okonkwo',
    dob: '1988-09-12',
    gender: 'Male',
    phone: '(555) 812-3367',
    email: 'david.okonkwo@outlook.com',
    address: '3390 Heritage Oak Rd, Buda, TX 78610',
    insurance: {
      carrier: 'UHC Vision',
      memberId: 'UHC9920041',
      groupNumber: 'GRP-88221',
      subscriberName: 'David Okonkwo',
      subscriberDob: '1988-09-12',
      relationship: 'Self',
    },
    lastVerified: '2026-04-30',
    status: 'active',
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 200, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 200, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 0,
      materialsCopay: 15,
    },
    eligibilityHistory: [
      { date: '2026-04-30', status: 'active', checkedBy: 'System' },
      { date: '2025-12-01', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-06-14', status: 'active', checkedBy: 'System' },
    ],
    lastVisit: '2026-03-18',
  },
  {
    id: 7,
    firstName: 'Amanda',
    lastName: 'Chen',
    dob: '2001-06-25',
    gender: 'Female',
    phone: '(555) 923-4410',
    email: 'amanda.chen@university.edu',
    address: '108 West 6th St Apt 4B, Austin, TX 78701',
    insurance: {
      carrier: 'EyeMed',
      memberId: 'EM77450022',
      groupNumber: 'GRP-55021',
      subscriberName: 'Robert Chen',
      subscriberDob: '1972-03-15',
      relationship: 'Child',
    },
    lastVerified: '2026-05-01',
    status: 'active',
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 200, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 150, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 0,
      materialsCopay: 20,
    },
    eligibilityHistory: [
      { date: '2026-05-01', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-11-08', status: 'active', checkedBy: 'System' },
      { date: '2025-05-09', status: 'active', checkedBy: 'Front Desk' },
    ],
    lastVisit: '2025-11-08',
  },
  {
    id: 8,
    firstName: 'Robert',
    lastName: 'Vasquez',
    dob: '1955-02-18',
    gender: 'Male',
    phone: '(555) 104-6682',
    email: 'rvasquez55@aol.com',
    address: '776 Wildwood Trail, Georgetown, TX 78628',
    insurance: {
      carrier: 'Humana',
      memberId: 'HUM4401987',
      groupNumber: 'GRP-22150',
      subscriberName: 'Robert Vasquez',
      subscriberDob: '1955-02-18',
      relationship: 'Self',
    },
    lastVerified: '2026-05-12',
    status: 'active',
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 125, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 0, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 20,
      materialsCopay: 30,
    },
    eligibilityHistory: [
      { date: '2026-05-12', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-10-22', status: 'active', checkedBy: 'System' },
      { date: '2025-04-16', status: 'active', checkedBy: 'Front Desk' },
    ],
    lastVisit: '2025-10-22',
  },
  {
    id: 9,
    firstName: 'Priya',
    lastName: 'Nair',
    dob: '1991-12-08',
    gender: 'Female',
    phone: '(555) 267-5531',
    email: 'priya.nair@techcorp.io',
    address: '2019 Innovation Blvd, Austin, TX 78758',
    insurance: {
      carrier: 'Anthem',
      memberId: 'ANT6630928',
      groupNumber: 'GRP-99401',
      subscriberName: 'Priya Nair',
      subscriberDob: '1991-12-08',
      relationship: 'Self',
    },
    lastVerified: '2026-05-15',
    status: 'active',
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 175, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 175, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 10,
      materialsCopay: 20,
    },
    eligibilityHistory: [
      { date: '2026-05-15', status: 'active', checkedBy: 'System' },
      { date: '2025-12-10', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-05-20', status: 'active', checkedBy: 'System' },
    ],
    lastVisit: '2025-12-10',
  },
  {
    id: 10,
    firstName: 'Marcus',
    lastName: 'Webb',
    dob: '1990-04-05',
    gender: 'Male',
    phone: '(555) 388-9914',
    email: 'mwebb@personalmail.com',
    address: '654 Riverbend Circle, Kyle, TX 78640',
    insurance: {
      carrier: 'Spectera',
      memberId: 'SP77001122',
      groupNumber: 'GRP-30019',
      subscriberName: 'Marcus Webb',
      subscriberDob: '1990-04-05',
      relationship: 'Self',
    },
    lastVerified: '2026-05-05',
    status: 'pending',
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 150, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 130, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 15,
      materialsCopay: 25,
    },
    eligibilityHistory: [
      { date: '2026-05-05', status: 'pending', checkedBy: 'System' },
      { date: '2025-11-30', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-05-22', status: 'active', checkedBy: 'System' },
    ],
    lastVisit: '2025-11-30',
  },
]

export function getPatientFullName(p: Patient) {
  return `${p.firstName} ${p.lastName}`
}
