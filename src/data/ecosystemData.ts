import { BusinessProfile, BusinessComplaint, HeritageSiteReport, EnforcementAction } from '../types/entity';

export const INITIAL_BUSINESS_PROFILE: BusinessProfile = {
  id: 'biz-taj-crafts-01',
  name: 'Marble Craft Guild & Emporium',
  category: 'Handicraft',
  city: 'Agra',
  location: 'Taj Ganj, Western Gate Road',
  ownerName: 'Sunil Mathur',
  gstOrLicense: 'UP09AABM1289P1Z3 (UP Tourism Approved)',
  qualityScore: 94,
  qualityTier: 'Gold',
  averageRating: 4.8,
  totalReviews: 412,
  ratingBreakdown: {
    pricing: 4.9,
    hygiene: 4.7,
    hospitality: 4.9,
    speed: 4.6,
  },
  footfallStats: {
    todayVisitors: 284,
    weeklyVisitors: 1940,
    monthlyVisitors: 8420,
    peakHours: '10:30 AM - 1:00 PM & 4:30 PM - 7:00 PM',
    busiestDay: 'Saturday',
  }
};

export const INITIAL_BUSINESS_COMPLAINTS: BusinessComplaint[] = [
  {
    id: 'CMP-2026-081',
    touristName: 'Elena Rostova',
    touristNationality: 'Germany',
    date: 'Today, 11:20 AM',
    category: 'Overcharging',
    title: 'Discrepancy on polished coaster set price tag vs register',
    description: 'The display rack indicated ₹650 for set of 4 marble inlay coasters, but counter staff quoted ₹900 before discount.',
    severity: 'medium',
    status: 'Pending',
    impactOnRank: 'Rank risk: -8 spots in Tourist App search if unaddressed within 24h',
  },
  {
    id: 'CMP-2026-077',
    touristName: 'Marcus Vance',
    touristNationality: 'UK',
    date: 'Yesterday, 4:15 PM',
    category: 'Service Quality',
    title: 'Commission tout accompanied party to store entrance',
    description: 'An unofficial auto driver escorted us claiming this is the official govt shop. Staff should clarify tout affiliations.',
    severity: 'high',
    status: 'Action Committed',
    impactOnRank: 'Remediation underway: "Zero-Commission Partner" board installed',
    actionTaken: 'Store owner posted visible CCTV notice: No commissions to auto drivers.',
  },
  {
    id: 'CMP-2026-065',
    touristName: 'Pooja Iyer',
    touristNationality: 'India (Bangalore)',
    date: '3 days ago',
    category: 'Hygiene',
    title: 'Water dispenser paper cups were depleted during peak rush',
    description: 'During hot afternoon rush, RO water dispenser was unavailable for visiting family.',
    severity: 'low',
    status: 'Resolved',
    impactOnRank: 'Rank restored. Verified Tourist badge maintained.',
    actionTaken: 'Dual commercial RO dispenser with eco-friendly copper cups installed.',
  }
];

export const HOURLY_FOOTFALL_DATA = [
  { time: '08:00', visitors: 18, peak: false },
  { time: '09:00', visitors: 42, peak: false },
  { time: '10:00', visitors: 96, peak: true },
  { time: '11:00', visitors: 145, peak: true },
  { time: '12:00', visitors: 160, peak: true },
  { time: '13:00', visitors: 85, peak: false },
  { time: '14:00', visitors: 70, peak: false },
  { time: '15:00', visitors: 95, peak: false },
  { time: '16:00', visitors: 130, peak: true },
  { time: '17:00', visitors: 175, peak: true },
  { time: '18:00', visitors: 150, peak: true },
  { time: '19:00', visitors: 65, peak: false },
  { time: '20:00', visitors: 30, peak: false },
];

export const AUTHORITY_HERITAGE_REPORTS: HeritageSiteReport[] = [
  {
    id: 'ASI-AGR-401',
    siteName: 'Taj Mahal - Western Gate Promenade',
    city: 'Agra',
    category: 'Crowding',
    severity: 'critical',
    timestamp: '18 mins ago',
    reportedBy: 'ASI Turnstile Sensor & Tourist App Reports (14 users)',
    description: 'Gate density exceeded 88% capacity. Security bottleneck near security screening conveyor belt 2.',
    status: 'Under Inspection',
    actionTaken: 'Tourism Police Sector 4 opened auxiliary bag scanner 3. Crowd flowing normally.',
    coordinates: { lat: 27.1751, lng: 78.0421 }
  },
  {
    id: 'ASI-DEL-319',
    siteName: 'Red Fort - Lahori Gate Entrance',
    city: 'Delhi',
    category: 'Safety',
    severity: 'medium',
    timestamp: '1 hour ago',
    reportedBy: 'Tourist App Scam Report #4410',
    description: '3 unauthorized touts dressed in fake ASI safari suits attempting to divert tourists to private handicraft malls.',
    status: 'Open',
    coordinates: { lat: 28.6562, lng: 77.2410 }
  },
  {
    id: 'ASI-JAI-288',
    siteName: 'Amer Fort - Elephant Pathway Ramp',
    city: 'Jaipur',
    category: 'Maintenance',
    severity: 'medium',
    timestamp: '3 hours ago',
    reportedBy: 'Guide Association Report #88',
    description: 'Paving stone looseness on the pedestrian descent curve near Suraj Pol.',
    status: 'Under Inspection',
    actionTaken: 'PWD heritage masonry team dispatched for evening repair.',
    coordinates: { lat: 26.9855, lng: 75.8513 }
  },
  {
    id: 'ASI-VNS-194',
    siteName: 'Dashashwamedh Ghat - Aarti Platform 4',
    city: 'Varanasi',
    category: 'Sanitation',
    severity: 'low',
    timestamp: '5 hours ago',
    reportedBy: 'Clean Ghat Volunteer Unit & Tourist App',
    description: 'Flower garland residue accumulated after morning Mangala Aarti.',
    status: 'Resolved',
    actionTaken: 'Municipal motorized river cleaning boat cleared platform steps at 10:30 AM.',
    coordinates: { lat: 25.3076, lng: 83.0107 }
  }
];

export const AUTHORITY_ENFORCEMENT_ACTIONS: EnforcementAction[] = [
  {
    id: 'ENF-2026-092',
    businessName: 'Royal Rajasthan Gem Palace (Shop #14)',
    category: 'Jewelry / Gems',
    violation: 'Synthetic glass sold as genuine star ruby; tourist overcharged ₹28,000 without certificate',
    actionType: 'Suspension / Delisting',
    amountOrPenalty: '14-Day App Delisting + ₹50,000 Consumer Court Notice',
    date: 'Today, 09:30 AM',
    status: 'Enforced',
    authorityOfficer: 'Insp. R. K. Shekhawat (Rajasthan Tourism Police)'
  },
  {
    id: 'ENF-2026-088',
    businessName: 'Yamuna View Prepaid Auto Stand #3',
    category: 'Transport',
    violation: 'Refusal of printed digital receipt & charging ₹400 for ₹120 standard prepaid route',
    actionType: 'Penalty Fine',
    amountOrPenalty: '₹5,000 Fine on Stand Union + 3-day driver suspension',
    date: 'Yesterday',
    status: 'Enforced',
    authorityOfficer: 'Agra Traffic Enforcement Unit'
  },
  {
    id: 'ENF-2026-079',
    businessName: 'Old City Spice Vault',
    category: 'Spices & Saffron',
    violation: 'Adulterated saffron sample reported by 4 tourists via Yatra One quality scanner',
    actionType: 'Rank Demotion',
    amountOrPenalty: 'Quality Score dropped to 41/100 (Unverified tier)',
    date: '3 days ago',
    status: 'Active',
    authorityOfficer: 'FSSAI Regional Inspection Wing'
  }
];

export const HOW_WE_STAND_OUT_DATA = [
  {
    feature: 'Fair-price intelligence',
    typical: 'Partial (Generic estimates only)',
    yatraOne: 'Strong (Real-time street benchmarks, crowdsourced scans & MRP validation)',
  },
  {
    feature: 'Real-time risk & scam detection',
    typical: 'Not Available',
    yatraOne: 'Strong (Active geotagged scam alerts, tout hotspots & one-touch police link)',
  },
  {
    feature: 'AI itinerary + accessibility-aware planning',
    typical: 'Partial (Standard route without accessibility)',
    yatraOne: 'Strong (Weather-adaptive re-routing, step-free access, Braille/wheelchair filters)',
  },
  {
    feature: 'Community reports & validation',
    typical: 'Partial (Basic 5-star comments)',
    yatraOne: 'Strong (Cryptographically tagged receipts, verified reviews & quality scores)',
  },
  {
    feature: 'Authority dashboard',
    typical: 'Not Available',
    yatraOne: 'Strong (Live footfall heatmaps, ASI heritage alerts & direct enforcement tracking)',
  },
  {
    feature: 'One integrated ecosystem',
    typical: 'Not Available (Fragmented silos)',
    yatraOne: 'Strong (Unifies Tourists, Businesses & Authorities in closed feedback loop)',
  },
];
