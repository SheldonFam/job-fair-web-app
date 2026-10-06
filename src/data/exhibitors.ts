export type Industry = 'tech' | 'finance' | 'engineering' | 'healthcare' | 'startups'

export const industries: Industry[] = ['tech', 'finance', 'engineering', 'healthcare', 'startups']

export type Exhibitor = {
  id: string
  name: string
  initials: string
  industry: Industry
  booth: string
  hall: string
  roles: string[]
  openRoleCount: number
  description: string
}

export const exhibitors: Exhibitor[] = [
  {
    id: 'nexora',
    name: 'Nexora Tech',
    initials: 'NX',
    industry: 'tech',
    booth: 'A06',
    hall: 'A',
    roles: ['Frontend Developer (Vue)', 'QA Engineer', 'UI/UX Designer', 'Graduate Trainee'],
    openRoleCount: 8,
    description:
      'Product studio building e-commerce and payment platforms for Southeast Asian retailers. Walk-in interviews on all three days.',
  },
  {
    id: 'awan',
    name: 'Awan Cloud Systems',
    initials: 'AC',
    industry: 'tech',
    booth: 'A03',
    hall: 'A',
    roles: ['DevOps Engineer', 'Cloud Support Associate', 'Solutions Architect'],
    openRoleCount: 7,
    description:
      'Malaysian cloud provider running data centres in Cyberjaya and Johor. Hiring for 24/7 operations and enterprise solutions.',
  },
  {
    id: 'pixelpeak',
    name: 'Pixelpeak Studio',
    initials: 'PP',
    industry: 'tech',
    booth: 'A07',
    hall: 'A',
    roles: ['Unity Developer', '2D Game Artist', 'Game Tester'],
    openRoleCount: 4,
    description: 'Indie game studio in Bangsar South making mobile games played in 40 countries.',
  },
  {
    id: 'datajaya',
    name: 'DataJaya Analytics',
    initials: 'DJ',
    industry: 'tech',
    booth: 'A09',
    hall: 'A',
    roles: ['Data Analyst', 'Machine Learning Engineer', 'BI Developer'],
    openRoleCount: 6,
    description: 'Analytics consultancy helping banks and telcos turn data into decisions.',
  },
  {
    id: 'bayu',
    name: 'Bayu Capital',
    initials: 'BC',
    industry: 'finance',
    booth: 'B04',
    hall: 'B',
    roles: ['Graduate Analyst', 'Risk Officer', 'Relationship Manager'],
    openRoleCount: 6,
    description: 'Investment and wealth management firm headquartered in KL Sentral.',
  },
  {
    id: 'lestari',
    name: 'Lestari Insurance',
    initials: 'LI',
    industry: 'finance',
    booth: 'B02',
    hall: 'B',
    roles: ['Claims Executive', 'Actuarial Trainee', 'Customer Service Lead'],
    openRoleCount: 5,
    description:
      'General insurer with 30 branches nationwide, hiring across claims and actuarial teams.',
  },
  {
    id: 'petrolink',
    name: 'Petrolink Engineering',
    initials: 'PE',
    industry: 'engineering',
    booth: 'B12',
    hall: 'B',
    roles: ['Mechanical Engineer', 'Site Supervisor', 'HSE Officer'],
    openRoleCount: 10,
    description:
      'Oil, gas and energy-transition engineering contractor with projects in Sarawak and Terengganu.',
  },
  {
    id: 'sinar',
    name: 'Sinar Robotics',
    initials: 'SR',
    industry: 'engineering',
    booth: 'B08',
    hall: 'B',
    roles: ['Automation Engineer', 'PLC Technician', 'Mechatronics Intern'],
    openRoleCount: 6,
    description: 'Factory automation specialist serving semiconductor plants in Penang and Kulim.',
  },
  {
    id: 'medicare',
    name: 'MediCare Plus',
    initials: 'M+',
    industry: 'healthcare',
    booth: 'C03',
    hall: 'C',
    roles: ['Staff Nurse', 'Pharmacist', 'Patient Service Executive'],
    openRoleCount: 12,
    description: 'Private hospital group with five hospitals across the Klang Valley.',
  },
  {
    id: 'klinikku',
    name: 'KlinikKu Health',
    initials: 'KK',
    industry: 'healthcare',
    booth: 'C01',
    hall: 'C',
    roles: ['Medical Officer', 'Clinic Assistant'],
    openRoleCount: 9,
    description: 'Neighbourhood clinic chain with 60 outlets and a telehealth app.',
  },
  {
    id: 'kopi',
    name: 'Kopi Labs',
    initials: 'KL',
    industry: 'startups',
    booth: 'C06',
    hall: 'C',
    roles: ['Full-stack Developer', 'Growth Marketer'],
    openRoleCount: 4,
    description: 'Seed-stage startup building ordering software for Malaysian kopitiams and cafés.',
  },
  {
    id: 'harimau',
    name: 'Harimau Fintech',
    initials: 'HF',
    industry: 'startups',
    booth: 'C08',
    hall: 'C',
    roles: ['Backend Engineer (Go)', 'Product Manager', 'Compliance Analyst'],
    openRoleCount: 3,
    description: 'Series A fintech offering buy-now-pay-later for small merchants.',
  },
]
