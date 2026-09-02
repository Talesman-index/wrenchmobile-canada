import { ServiceDefinition } from '@/types/database';

export interface EnhancedServiceDefinition extends ServiceDefinition {
  shortLabel: string;
}

export const CANADIAN_CITIES = [
  { name: 'Montréal', province: 'QC', lat: 45.5017, lng: -73.5673, taxRate: 0.14975, taxName: 'TPS + TVQ (14,975 %)' },
  { name: 'Toronto', province: 'ON', lat: 43.6532, lng: -79.3832, taxRate: 0.13, taxName: 'TVH (13 %)' },
  { name: 'Québec', province: 'QC', lat: 46.8139, lng: -71.2080, taxRate: 0.14975, taxName: 'TPS + TVQ (14,975 %)' },
  { name: 'Ottawa', province: 'ON', lat: 45.4215, lng: -75.6972, taxRate: 0.13, taxName: 'TVH (13 %)' },
  { name: 'Vancouver', province: 'BC', lat: 49.2827, lng: -123.1207, taxRate: 0.12, taxName: 'TPS + TVP (12 %)' },
  { name: 'Calgary', province: 'AB', lat: 51.0447, lng: -114.0719, taxRate: 0.05, taxName: 'TPS (5 %)' },
  { name: 'Gatineau', province: 'QC', lat: 45.4765, lng: -75.7013, taxRate: 0.14975, taxName: 'TPS + TVQ (14,975 %)' },
];

export const SERVICE_DEFINITIONS: EnhancedServiceDefinition[] = [
  {
    type: 'battery_jump',
    label: 'Survoltage de batterie',
    shortLabel: 'Survoltage',
    shortDesc: 'Recharge d’urgence et test de charge sous le capot',
    iconName: 'Zap',
    basePriceCAD: 79,
    estimatedDuration: '20-30 min',
  },
  {
    type: 'battery_replacement',
    label: 'Remplacement de batterie',
    shortLabel: 'Batterie neuve',
    shortDesc: 'Livraison et installation de batterie neuve garantie',
    iconName: 'BatteryCharging',
    basePriceCAD: 189,
    estimatedDuration: '30-45 min',
  },
  {
    type: 'flat_tire',
    label: 'Pneu & Crevaison',
    shortLabel: 'Crevaison',
    shortDesc: 'Installation roue de secours ou réparation sur place',
    iconName: 'Disc',
    basePriceCAD: 89,
    estimatedDuration: '30 min',
  },
  {
    type: 'brake_service',
    label: 'Freinage & Plaquettes',
    shortLabel: 'Freins',
    shortDesc: 'Inspection et remplacement plaquettes/disques',
    iconName: 'ShieldAlert',
    basePriceCAD: 175,
    estimatedDuration: '60-90 min',
  },
  {
    type: 'oil_change',
    label: 'Vidange d’huile',
    shortLabel: 'Vidange d’huile',
    shortDesc: 'Huile synthétique premium et filtre neuf chez vous',
    iconName: 'Droplets',
    basePriceCAD: 119,
    estimatedDuration: '45 min',
  },
  {
    type: 'diagnostic_scan',
    label: 'Diagnostic OBD-II',
    shortLabel: 'Diagnostic OBD',
    shortDesc: 'Lecture voyant moteur et bilan électronique',
    iconName: 'Cpu',
    basePriceCAD: 95,
    estimatedDuration: '45 min',
  },
  {
    type: 'no_start',
    label: 'Panne démarrage',
    shortLabel: 'Ne démarre pas',
    shortDesc: 'Triage démarreur, allumage et injection sur place',
    iconName: 'AlertTriangle',
    basePriceCAD: 105,
    estimatedDuration: '45-60 min',
  },
  {
    type: 'alternator_starter',
    label: 'Démarreur & Alternateur',
    shortLabel: 'Démarreur',
    shortDesc: 'Test électrique, réparation et câblage',
    iconName: 'Wrench',
    basePriceCAD: 210,
    estimatedDuration: '1-2 h',
  },
  {
    type: 'other',
    label: 'Réparation sur mesure',
    shortLabel: 'Autre réparation',
    shortDesc: 'Courroies, fluides ou réparation spécifique',
    iconName: 'Settings',
    basePriceCAD: 99,
    estimatedDuration: 'Sur devis',
  },
];

export const POPULAR_VEHICLE_MAKES = [
  'Ford',
  'Toyota',
  'Honda',
  'Chevrolet',
  'Hyundai',
  'Nissan',
  'Subaru',
  'Mazda',
  'Volkswagen',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Jeep',
  'GMC',
  'Ram',
  'Tesla',
  'Kia',
  'Lexus',
  'Acura',
  'Volvo',
];

export const PLATFORM_FEE_PERCENTAGE = 0.12;
