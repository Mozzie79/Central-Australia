import type { PriceBookLineItem } from '@dcs/shared';
import {
  APPLICATION_SERVICES_HOURS_202627,
  APPLICATION_SERVICES_RATE_202627,
  CPU_RATE_202627,
  DB2_RATE_202627,
  DISK_FIXED_FILE_REVENUE_LINE_ITEMS,
  DISK_VARIABLE_REVENUE_LINE_ITEMS,
  EGL_RATE_202627,
  REDHAT_OS_REVENUE_LINE_ITEMS,
  VIRTUAL_SERVER_PERIODS_PER_YEAR,
  VMWARE_REVENUE_LINE_ITEMS,
  WINDOWS_OS_REVENUE_LINE_ITEMS,
} from '../../config/index.js';
import { computeBaseVolume, computeDb2Volume, computeEglVolume } from './productRevenue.js';
import { computeLineItemRevenue } from './revenue.js';

function lineItemEntries(
  product: string,
  items: { rate: number; quantity: number; label: string }[],
  rateOverrides: Map<string, number>,
): PriceBookLineItem[] {
  return items.map((item, index) => {
    const id = `${product}:${index}`;
    return { id, product, label: item.label, rate: rateOverrides.get(id) ?? item.rate, quantity: item.quantity };
  });
}

// Builds the full, current Price Book - quantities always reflect the latest
// uploaded usage data; rates fall back to the workbook's stored defaults unless
// overridden via PUT /api/price-book/:id.
export function buildPriceBook(usageByAgency: Record<string, number>, rateOverrides: Map<string, number>): PriceBookLineItem[] {
  const singleRateEntry = (product: string, rate: number, quantity: number, label: string): PriceBookLineItem => {
    const id = `${product}:0`;
    return { id, product, label, rate: rateOverrides.get(id) ?? rate, quantity };
  };

  return [
    singleRateEntry('BASE', CPU_RATE_202627, computeBaseVolume(usageByAgency), 'CPU rate ($/sec)'),
    singleRateEntry('DB2', DB2_RATE_202627, computeDb2Volume(), 'Cost per DB2 database'),
    singleRateEntry('EGL', EGL_RATE_202627, computeEglVolume(), 'Cost per EGL application'),
    singleRateEntry(
      'Application Services',
      APPLICATION_SERVICES_RATE_202627,
      APPLICATION_SERVICES_HOURS_202627,
      'Hourly rate',
    ),
    ...lineItemEntries('VMWare', VMWARE_REVENUE_LINE_ITEMS, rateOverrides),
    ...lineItemEntries('Windows OS', WINDOWS_OS_REVENUE_LINE_ITEMS, rateOverrides),
    ...lineItemEntries('RedHat OS', REDHAT_OS_REVENUE_LINE_ITEMS, rateOverrides),
    ...lineItemEntries('Disk Fixed File', DISK_FIXED_FILE_REVENUE_LINE_ITEMS, rateOverrides),
    ...lineItemEntries('Disk Variable', DISK_VARIABLE_REVENUE_LINE_ITEMS, rateOverrides),
  ];
}

const ANNUAL_RATE_PRODUCTS = new Set(['BASE', 'DB2', 'EGL', 'Application Services']);

// Sums a product's current Price Book line items into a revenue figure - the
// rate-edit-aware counterpart to productRevenue.ts's computeProductRevenue,
// which always uses the workbook's default (fixture-verified) rates.
export function computeRevenueFromPriceBook(product: string, priceBook: PriceBookLineItem[]): number | null {
  const items = priceBook.filter((item) => item.product === product);
  if (items.length === 0) return null;

  const periodsPerYear = ANNUAL_RATE_PRODUCTS.has(product) ? 1 : VIRTUAL_SERVER_PERIODS_PER_YEAR;
  return computeLineItemRevenue(items, periodsPerYear);
}
