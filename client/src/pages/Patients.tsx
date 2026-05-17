import { useState } from 'react'
import { Search, UserPlus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Patient {
  id: number
  name: string
  dob: string
  phone: string
  lastVisit: string
  insurance: string
  eligibilityStatus: 'verified' | 'pending' | 'not-verified'
}

const PATIENTS: Patient[] = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    dob: '1985-03-22',
    phone: '(555) 201-4832',
    lastVisit: '2026-04-10',
    insurance: 'VSP Vision',
    eligibilityStatus: 'verified',
  },
  {
    id: 2,
    name: 'James Thornton',
    dob: '1972-11-08',
    phone: '(555) 349-7701',
    lastVisit: '2026-03-28',
    insurance: 'EyeMed',
    eligibilityStatus: 'verified',
  },
  {
    id: 3,
    name: 'Linda Kowalski',
    dob: '1990-07-15',
    phone: '(555) 482-0023',
    lastVisit: '2026-02-14',
    insurance: 'Davis Vision',
    eligibilityStatus: 'pending',
  },
  {
    id: 4,
    name: 'Marcus Rivera',
    dob: '1968-05-30',
    phone: '(555) 611-9954',
    lastVisit: '2025-11-20',
    insurance: 'Spectera',
    eligibilityStatus: 'not-verified',
  },
  {
    id: 5,
    name: 'Diana Patel',
    dob: '1995-01-04',
    phone: '(555) 703-2281',
    lastVisit: '2026-04-22',
    insurance: 'VSP Vision',
    eligibilityStatus: 'verified',
  },
]

const statusLabel: Record<Patient['eligibilityStatus'], string> = {
  verified: 'Verified',
  pending: 'Pending',
  'not-verified': 'Not Verified',
}

const statusVariant: Record<
  Patient['eligibilityStatus'],
  'success' | 'secondary' | 'destructive'
> = {
  verified: 'success',
  pending: 'secondary',
  'not-verified': 'destructive',
}

export default function Patients() {
  const [query, setQuery] = useState('')

  const filtered = PATIENTS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.insurance.toLowerCase().includes(query.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Patients</h2>
          <p className="text-muted-foreground">Manage your patient roster and eligibility status.</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Patient
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patient List</CardTitle>
          <CardDescription>{filtered.length} patients found</CardDescription>
          {/* Search */}
          <div className="relative mt-2 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search patients or insurance..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-md border border-input bg-background py-2 pl-9 pr-4 text-sm shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Last Visit</TableHead>
                <TableHead>Insurance</TableHead>
                <TableHead>Eligibility</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((patient) => (
                <TableRow key={patient.id} className="cursor-pointer">
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.dob}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                  <TableCell>{patient.lastVisit}</TableCell>
                  <TableCell>{patient.insurance}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant[patient.eligibilityStatus]}>
                      {statusLabel[patient.eligibilityStatus]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                    No patients match your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
