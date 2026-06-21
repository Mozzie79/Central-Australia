import {
  APPLICATION_SERVICES_HOURS_202627,
  APPLICATION_SERVICES_RATE_202627,
  CPU_CHARGE_EXCLUDED_AGENCIES,
  CPU_RATE_202627,
  DB2_DATABASE_COUNT,
  DB2_RATE_202627,
  DISK_FIXED_FILE_REVENUE_LINE_ITEMS,
  DISK_VARIABLE_REVENUE_LINE_ITEMS,
  EGL_APPLICATION_COUNT,
  EGL_RATE_202627,
  REDHAT_OS_REVENUE_LINE_ITEMS,
  VIRTUAL_SERVER_PERIODS_PER_YEAR,
  VMWARE_REVENUE_LINE_ITEMS,
  WINDOWS_OS_REVENUE_LINE_ITEMS,
} from '../../config/index.js';
import { computeLineItemRevenue } from './revenue.js';

// Shared volume lookups, factored out so the Price Book module (priceBookRevenue.ts)
// can build line items using the same volumes as this fixture-verified function,
// without duplicating the logic.
export function computeBaseVolume(usageByAgency: Record<string, number>): number {
  const excluded = new Set(CPU_CHARGE_EXCLUDED_AGENCIES);
  let totalCpu = 0;
  for (const [agency, cpu] of Object.entries(usageByAgency)) {
    if (!excluded.has(agency)) totalCpu += cpu;
  }
  return totalCpu;
}

export function computeDb2Volume(): number {
  return Object.values(DB2_DATABASE_COUNT).reduce((sum, count) => sum + count, 0);
}

export function computeEglVolume(): number {
  return Object.values(EGL_APPLICATION_COUNT).reduce((sum, count) => sum + count, 0);
}

// Revenue is only computed for products with a confirmed usage-volume + rate pairing
// (per the user's "compute only where data exists" decision) - every other product
// returns null, rendered in the UI as "N/A - no usage data".
export function computeProductRevenue(product: string, usageByAgency: Record<string, number>): number | null {
  switch (product) {
    case 'Application Services':
      return APPLICATION_SERVICES_HOURS_202627 * APPLICATION_SERVICES_RATE_202627;
    case 'BASE':
      return computeBaseVolume(usageByAgency) * CPU_RATE_202627;
    case 'DB2':
      return computeDb2Volume() * DB2_RATE_202627;
    case 'EGL':
      return computeEglVolume() * EGL_RATE_202627;
    case 'VMWare':
      return computeLineItemRevenue(VMWARE_REVENUE_LINE_ITEMS, VIRTUAL_SERVER_PERIODS_PER_YEAR);
    case 'Windows OS':
      return computeLineItemRevenue(WINDOWS_OS_REVENUE_LINE_ITEMS, VIRTUAL_SERVER_PERIODS_PER_YEAR);
    case 'RedHat OS':
      return computeLineItemRevenue(REDHAT_OS_REVENUE_LINE_ITEMS, VIRTUAL_SERVER_PERIODS_PER_YEAR);
    case 'Disk Fixed File':
      return computeLineItemRevenue(DISK_FIXED_FILE_REVENUE_LINE_ITEMS, VIRTUAL_SERVER_PERIODS_PER_YEAR);
    case 'Disk Variable':
      return computeLineItemRevenue(DISK_VARIABLE_REVENUE_LINE_ITEMS, VIRTUAL_SERVER_PERIODS_PER_YEAR);
    default:
      return null;
  }
}
