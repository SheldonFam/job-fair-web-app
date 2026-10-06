import type { Industry } from './exhibitors'

/* Where each booth sits on the floor plan drawing (src/assets/floor-plan.svg).
   The drawing is 1200 wide and 660 tall. x and y are the top left corner of the booth. */
export const floorPlanWidth = 1200
export const floorPlanHeight = 660

export type Booth = {
  code: string
  x: number
  y: number
  width: number
  height: number
  industry: Industry
}

export const booths: Booth[] = [
  { code: 'A01', x: 48, y: 215, width: 56, height: 50, industry: 'tech' },
  { code: 'A02', x: 112, y: 215, width: 56, height: 50, industry: 'tech' },
  { code: 'A03', x: 176, y: 215, width: 56, height: 50, industry: 'tech' },
  { code: 'A04', x: 240, y: 215, width: 56, height: 50, industry: 'tech' },
  { code: 'A05', x: 304, y: 215, width: 56, height: 50, industry: 'tech' },
  { code: 'A06', x: 48, y: 310, width: 120, height: 50, industry: 'tech' },
  { code: 'A07', x: 176, y: 310, width: 56, height: 50, industry: 'tech' },
  { code: 'A08', x: 240, y: 310, width: 120, height: 50, industry: 'tech' },
  { code: 'A09', x: 160, y: 400, width: 110, height: 90, industry: 'tech' },
  { code: 'B01', x: 425, y: 215, width: 50, height: 50, industry: 'finance' },
  { code: 'B02', x: 481, y: 215, width: 50, height: 50, industry: 'finance' },
  { code: 'B03', x: 537, y: 215, width: 50, height: 50, industry: 'finance' },
  { code: 'B04', x: 425, y: 310, width: 106, height: 50, industry: 'finance' },
  { code: 'B05', x: 537, y: 310, width: 50, height: 50, industry: 'finance' },
  { code: 'B06', x: 425, y: 405, width: 50, height: 50, industry: 'finance' },
  {
    code: 'B07',
    x: 610,
    y: 215,
    width: 50,
    height: 50,
    industry: 'engineering',
  },
  {
    code: 'B08',
    x: 666,
    y: 215,
    width: 50,
    height: 50,
    industry: 'engineering',
  },
  {
    code: 'B09',
    x: 722,
    y: 215,
    width: 50,
    height: 50,
    industry: 'engineering',
  },
  {
    code: 'B10',
    x: 610,
    y: 310,
    width: 50,
    height: 50,
    industry: 'engineering',
  },
  {
    code: 'B11',
    x: 666,
    y: 310,
    width: 106,
    height: 50,
    industry: 'engineering',
  },
  {
    code: 'B12',
    x: 640,
    y: 400,
    width: 110,
    height: 90,
    industry: 'engineering',
  },
  { code: 'C01', x: 825, y: 85, width: 56, height: 50, industry: 'healthcare' },
  { code: 'C02', x: 889, y: 85, width: 56, height: 50, industry: 'healthcare' },
  {
    code: 'C03',
    x: 825,
    y: 160,
    width: 120,
    height: 50,
    industry: 'healthcare',
  },
  {
    code: 'C04',
    x: 825,
    y: 235,
    width: 56,
    height: 50,
    industry: 'healthcare',
  },
  { code: 'C05', x: 830, y: 350, width: 48, height: 44, industry: 'startups' },
  { code: 'C06', x: 886, y: 350, width: 48, height: 44, industry: 'startups' },
  { code: 'C07', x: 942, y: 350, width: 48, height: 44, industry: 'startups' },
  { code: 'C08', x: 998, y: 350, width: 48, height: 44, industry: 'startups' },
  { code: 'C09', x: 1054, y: 350, width: 48, height: 44, industry: 'startups' },
  { code: 'C10', x: 1110, y: 350, width: 48, height: 44, industry: 'startups' },
]
