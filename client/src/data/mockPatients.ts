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
  benefits: {
    exam: { covered: boolean; used: boolean; usedDate?: string }
    frames: { allowance: number; used: number }
    lenses: { covered: boolean; used: boolean; usedDate?: string }
    contacts: { allowance: number; used: number }
    benefitPeriodEnd: string
    examCopay: number
    materialsCopay: number
  }
  eligibilityHistory: Array<{ date: string; status: 'active' | 'inactive' | 'pending'; checkedBy: string }>
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
      { date: '2026-05-16', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2026-01-10', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-06-22', status: 'active', checkedBy: 'Front Desk' },
    ],
  },
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
    benefits: {
      exam: { covered: true, used: true, usedDate: '2026-01-10' },
      frames: { allowance: 200, used: 200 },
      lenses: { covered: true, used: true, usedDate: '2026-01-10' },
      contacts: { allowance: 0, used: 0 },
      benefitPeriodEnd: '2027-01-09',
      examCopay: 0,
      materialsCopay: 0,
    },
    eligibilityHistory: [
      { date: '2026-05-16', status: 'active', checkedBy: 'Front Desk' },
      { date: '2026-01-10', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2025-01-08', status: 'active', checkedBy: 'Front Desk' },
    ],
  },
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
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 175, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 150, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 15,
      materialsCopay: 30,
    },
    eligibilityHistory: [
      { date: '2026-05-14', status: 'pending', checkedBy: 'Front Desk' },
      { date: '2025-11-30', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-05-20', status: 'active', checkedBy: 'Dr. Reynolds' },
    ],
  },
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
    benefits: {
      exam: { covered: true, used: false },
      frames: { allowance: 120, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 0, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 20,
      materialsCopay: 20,
    },
    eligibilityHistory: [
      { date: '2025-11-20', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-03-14', status: 'active', checkedBy: 'Front Desk' },
      { date: '2024-11-18', status: 'active', checkedBy: 'Dr. Reynolds' },
    ],
  },
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
    benefits: {
      exam: { covered: true, used: true, usedDate: '2026-04-22' },
      frames: { allowance: 150, used: 90 },
      lenses: { covered: true, used: true, usedDate: '2026-04-22' },
      contacts: { allowance: 130, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 10,
      materialsCopay: 25,
    },
    eligibilityHistory: [
      { date: '2026-05-18', status: 'active', checkedBy: 'Front Desk' },
      { date: '2026-04-22', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2025-09-10', status: 'active', checkedBy: 'Front Desk' },
    ],
  },
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
    lastVerified: '2026-05-12',
    status: 'active',
    lastVisit: '2026-05-12',
    benefits: {
      exam: { covered: true, used: true, usedDate: '2026-05-12' },
      frames: { allowance: 200, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 0, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 0,
      materialsCopay: 15,
    },
    eligibilityHistory: [
      { date: '2026-05-12', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2025-05-08', status: 'active', checkedBy: 'Front Desk' },
      { date: '2024-05-14', status: 'active', checkedBy: 'Front Desk' },
    ],
  },
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
    lastVerified: '2026-04-30',
    status: 'active',
    lastVisit: '2026-04-30',
    benefits: {
      exam: { covered: true, used: true, usedDate: '2026-04-30' },
      frames: { allowance: 150, used: 150 },
      lenses: { covered: true, used: true, usedDate: '2026-04-30' },
      contacts: { allowance: 130, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 15,
      materialsCopay: 25,
    },
    eligibilityHistory: [
      { date: '2026-04-30', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2025-10-15', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-04-28', status: 'active', checkedBy: 'Front Desk' },
    ],
  },
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
    lastVerified: '2026-03-01',
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
    },
    eligibilityHistory: [
      { date: '2026-03-01', status: 'inactive', checkedBy: 'Front Desk' },
      { date: '2025-09-14', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2025-03-10', status: 'active', checkedBy: 'Front Desk' },
    ],
  },
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
      subscriberName: 'Priya Nair',
      subscriberDob: '1988-06-25',
      relationship: 'Self',
    },
    lastVerified: '2026-05-10',
    status: 'active',
    lastVisit: '2026-05-10',
    benefits: {
      exam: { covered: true, used: true, usedDate: '2026-05-10' },
      frames: { allowance: 200, used: 0 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 200, used: 200 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 0,
      materialsCopay: 0,
    },
    eligibilityHistory: [
      { date: '2026-05-10', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2025-11-22', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-05-14', status: 'active', checkedBy: 'Front Desk' },
    ],
  },
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
    lastVerified: '2026-05-05',
    status: 'active',
    lastVisit: '2026-05-05',
    benefits: {
      exam: { covered: true, used: true, usedDate: '2026-05-05' },
      frames: { allowance: 175, used: 80 },
      lenses: { covered: true, used: false },
      contacts: { allowance: 150, used: 0 },
      benefitPeriodEnd: '2026-12-31',
      examCopay: 15,
      materialsCopay: 30,
    },
    eligibilityHistory: [
      { date: '2026-05-05', status: 'active', checkedBy: 'Dr. Reynolds' },
      { date: '2025-06-18', status: 'active', checkedBy: 'Front Desk' },
      { date: '2025-01-10', status: 'active', checkedBy: 'Front Desk' },
    ],
  },
]

export function getPatientFullName(p: Patient) {
  return `${p.firstName} ${p.lastName}`
}
