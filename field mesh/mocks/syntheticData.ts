export const SYNTHETIC_DIGIPINS = [
  'DP-HACK-A1-001',
  'DP-HACK-A1-002',
  'DP-HACK-A1-003',
  'DP-HACK-B2-010',
  'DP-HACK-B2-011',
  'DP-HACK-C3-020',
] as const;

export type SyntheticDigiPin = typeof SYNTHETIC_DIGIPINS[number];

export type DisasterType = 'Flood' | 'Earthquake' | 'Cyclone' | 'Landslide' | 'Fire' | 'Building Collapse' | 'Other';
export type LocationStatus = 'Field' | 'Shelter' | 'Hospital' | 'Evacuated';

export interface DisasterSurvey {
  surveyId: string;
  digiPin: SyntheticDigiPin;
  gps?: { lat: number; lng: number };
  peopleAffected: number;
  injured: number;
  critical: number;
  dead: number;
  trapped: number;
  disasterType: DisasterType;
  areaCondition: string;
  locationStatus: LocationStatus;
  photoEvidence?: string;
  trustScore: number;
  trustStatus: 'GREEN' | 'ORANGE' | 'RED';
  timestamp: string;
  officerName?: string;
}

export interface AgricultureSurvey {
  surveyId: string;
  digiPin: SyntheticDigiPin;
  gps?: { lat: number; lng: number };
  crop: string;
  damageCause: string;
  damagePercent: number;
  trustScore: number;
  trustStatus: 'GREEN' | 'ORANGE' | 'RED';
  timestamp: string;
  officerName?: string;
}

export interface AidDistribution {
  aidId: string;
  digiPin: SyntheticDigiPin;
  aidType: string;
  quantity: number;
  verified: boolean;
  timestamp: string;
  officerName?: string;
}

export interface HospitalStatus {
  digiPin: SyntheticDigiPin;
  critical: number;
  stable: number;
  dead: number;
  bedsAvailable: number;
  lastUpdated: string;
}

export const DISASTER_SURVEYS: DisasterSurvey[] = [
  {
    surveyId: 'DS-001',
    digiPin: 'DP-HACK-A1-001',
    gps: { lat: 19.1120, lng: 73.0150 },
    peopleAffected: 18,
    injured: 6,
    critical: 2,
    dead: 0,
    trapped: 3,
    disasterType: 'Flood',
    areaCondition: 'Heavy flooding, roads blocked',
    locationStatus: 'Hospital',
    trustScore: 88,
    trustStatus: 'GREEN',
    timestamp: new Date().toISOString(),
  },
  {
    surveyId: 'DS-002',
    digiPin: 'DP-HACK-A1-002',
    gps: { lat: 19.1150, lng: 73.0180 },
    peopleAffected: 10,
    injured: 2,
    critical: 0,
    dead: 1,
    trapped: 0,
    disasterType: 'Flood',
    areaCondition: 'Waterlogged area',
    locationStatus: 'Shelter',
    trustScore: 74,
    trustStatus: 'ORANGE',
    timestamp: new Date().toISOString(),
  },
  {
    surveyId: 'DS-004',
    digiPin: 'DP-HACK-B2-010',
    gps: { lat: 19.1080, lng: 73.0120 },
    peopleAffected: 40,
    injured: 12,
    critical: 5,
    dead: 2,
    trapped: 8,
    disasterType: 'Flood',
    areaCondition: 'Severe flooding, building damage',
    locationStatus: 'Field',
    trustScore: 59,
    trustStatus: 'RED',
    timestamp: new Date().toISOString(),
  },
];

export const AGRICULTURE_SURVEYS: AgricultureSurvey[] = [
  {
    surveyId: 'AG-001',
    digiPin: 'DP-HACK-B2-011',
    gps: { lat: 19.1100, lng: 73.0160 },
    crop: 'Rice',
    damageCause: 'Flood',
    damagePercent: 70,
    trustScore: 85,
    trustStatus: 'GREEN',
    timestamp: new Date().toISOString(),
  },
  {
    surveyId: 'AG-002',
    digiPin: 'DP-HACK-C3-020',
    gps: { lat: 19.1130, lng: 73.0170 },
    crop: 'Wheat',
    damageCause: 'Pest',
    damagePercent: 35,
    trustScore: 68,
    trustStatus: 'ORANGE',
    timestamp: new Date().toISOString(),
  },
];

export const AID_DISTRIBUTIONS: AidDistribution[] = [
  {
    aidId: 'AID-001',
    digiPin: 'DP-HACK-A1-001',
    aidType: 'Food Pack',
    quantity: 50,
    verified: true,
    timestamp: new Date().toISOString(),
  },
  {
    aidId: 'AID-002',
    digiPin: 'DP-HACK-B2-010',
    aidType: 'Medical Kit',
    quantity: 20,
    verified: false,
    timestamp: new Date().toISOString(),
  },
  {
    aidId: 'AID-003',
    digiPin: 'DP-HACK-A1-002',
    aidType: 'Tents',
    quantity: 10,
    verified: true,
    timestamp: new Date().toISOString(),
  },
];

export const HOSPITAL_STATUS: HospitalStatus[] = [
  {
    digiPin: 'DP-HACK-A1-001',
    critical: 3,
    stable: 8,
    dead: 0,
    bedsAvailable: 2,
    lastUpdated: new Date().toISOString(),
  },
  {
    digiPin: 'DP-HACK-B2-010',
    critical: 6,
    stable: 14,
    dead: 2,
    bedsAvailable: 0,
    lastUpdated: new Date().toISOString(),
  },
];
