import { ServiceDefinition } from '@/types/database';

export interface EnhancedServiceDefinition extends ServiceDefinition {
  shortLabel: string;
}

export const LONDON_AREAS = [
  { name: 'Westminster', region: 'Central London', province: 'London', lat: 51.4975, lng: -0.1357, taxRate: 0.20, taxName: 'VAT (20%)' },
  { name: 'Camden', region: 'North London', province: 'London', lat: 51.5428, lng: -0.1419, taxRate: 0.20, taxName: 'VAT (20%)' },
  { name: 'Kensington & Chelsea', region: 'West London', province: 'London', lat: 51.4988, lng: -0.1991, taxRate: 0.20, taxName: 'VAT (20%)' },
  { name: 'City of London', region: 'Central London', province: 'London', lat: 51.5123, lng: -0.0907, taxRate: 0.20, taxName: 'VAT (20%)' },
  { name: 'Islington', region: 'North London', province: 'London', lat: 51.5416, lng: -0.1022, taxRate: 0.20, taxName: 'VAT (20%)' },
  { name: 'Southwark', region: 'South London', province: 'London', lat: 51.5035, lng: -0.0804, taxRate: 0.20, taxName: 'VAT (20%)' },
  { name: 'Greenwich', region: 'East London', province: 'London', lat: 51.4826, lng: 0.0077, taxRate: 0.20, taxName: 'VAT (20%)' },
  { name: 'Richmond upon Thames', region: 'South West London', province: 'London', lat: 51.4479, lng: -0.3260, taxRate: 0.20, taxName: 'VAT (20%)' },
  { name: 'Hackney', region: 'East London', province: 'London', lat: 51.5450, lng: -0.0553, taxRate: 0.20, taxName: 'VAT (20%)' },
  { name: 'Wandsworth', region: 'South West London', province: 'London', lat: 51.4567, lng: -0.1910, taxRate: 0.20, taxName: 'VAT (20%)' },
];

// Backwards compatibility alias
export const CANADIAN_CITIES = LONDON_AREAS;

export const SERVICE_DEFINITIONS: EnhancedServiceDefinition[] = [
  {
    type: 'battery_jump',
    label: 'Battery Jump Start',
    shortLabel: 'Jump Start',
    shortDesc: 'Fast roadside or driveway battery boost & electrical health test',
    iconName: 'Zap',
    basePriceGBP: 59,
    basePriceCAD: 59,
    estimatedDuration: '20-30 min',
  },
  {
    type: 'battery_replacement',
    label: 'Battery Replacement',
    shortLabel: 'New Battery',
    shortDesc: 'Premium battery supplied, fitted, coded and old battery recycled',
    iconName: 'BatteryCharging',
    basePriceGBP: 145,
    basePriceCAD: 145,
    estimatedDuration: '30-45 min',
  },
  {
    type: 'flat_tire',
    label: 'Tyre & Puncture Repair',
    shortLabel: 'Puncture',
    shortDesc: 'Mobile puncture repair or spare wheel fitting at your location',
    iconName: 'Disc',
    basePriceGBP: 65,
    basePriceCAD: 65,
    estimatedDuration: '30 min',
  },
  {
    type: 'brake_service',
    label: 'Brake Pads & Discs',
    shortLabel: 'Brakes',
    shortDesc: 'Comprehensive brake inspection and pad/disc replacement',
    iconName: 'ShieldAlert',
    basePriceGBP: 139,
    basePriceCAD: 139,
    estimatedDuration: '60-90 min',
  },
  {
    type: 'oil_change',
    label: 'Full Oil & Filter Service',
    shortLabel: 'Oil Service',
    shortDesc: 'Premium synthetic oil, OEM filter & multi-point vehicle check',
    iconName: 'Droplets',
    basePriceGBP: 95,
    basePriceCAD: 95,
    estimatedDuration: '45 min',
  },
  {
    type: 'diagnostic_scan',
    label: 'OBD-II Diagnostic Scan',
    shortLabel: 'Diagnostics',
    shortDesc: 'Engine warning light check & full dealer-level fault scan',
    iconName: 'Cpu',
    basePriceGBP: 69,
    basePriceCAD: 69,
    estimatedDuration: '45 min',
  },
  {
    type: 'no_start',
    label: 'No-Start Breakdown',
    shortLabel: 'Non-Starter',
    shortDesc: 'Starter, fuel pump, ignition and immobiliser triage on site',
    iconName: 'AlertTriangle',
    basePriceGBP: 79,
    basePriceCAD: 79,
    estimatedDuration: '45-60 min',
  },
  {
    type: 'alternator_starter',
    label: 'Alternator & Starter Motor',
    shortLabel: 'Alternator',
    shortDesc: 'Charging system test, alternator or starter motor repair',
    iconName: 'Wrench',
    basePriceGBP: 175,
    basePriceCAD: 175,
    estimatedDuration: '1-2 h',
  },
  {
    type: 'other',
    label: 'Custom Mechanical Repair',
    shortLabel: 'Custom Repair',
    shortDesc: 'Belts, suspension, sensors, fluids or bespoke repairs',
    iconName: 'Settings',
    basePriceGBP: 75,
    basePriceCAD: 75,
    estimatedDuration: 'On Quote',
  },
];

export const POPULAR_VEHICLE_MAKES = [
  'Vauxhall',
  'Ford',
  'BMW',
  'Volkswagen',
  'Audi',
  'Mercedes-Benz',
  'Land Rover',
  'MINI',
  'Nissan',
  'Toyota',
  'Peugeot',
  'Renault',
  'Hyundai',
  'Kia',
  'Honda',
  'Volvo',
  'Jaguar',
  'Tesla',
  'SEAT',
  'Skoda',
];

export const PLATFORM_FEE_PERCENTAGE = 0.12;
