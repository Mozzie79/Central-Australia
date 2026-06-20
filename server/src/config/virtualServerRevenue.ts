import type { RevenueLineItem } from '@dcs/shared';

// "MR Virtual Server" sheet, VMWare block (rows 27-32 quantities, 37-41 prices, monthly):
// 12 x (142x6 + 2549x10 + 1911x15 + 460x10 + 9981x15 + 9594x20) = 4814424.0, exactly
// matching the sheet's own stored "Calculated Revenue" for 2026-27.
export const VMWARE_REVENUE_LINE_ITEMS: RevenueLineItem[] = [
  { rate: 6, quantity: 142 }, // CPU Basic
  { rate: 10, quantity: 2549 }, // CPU Standard
  { rate: 15, quantity: 1911 }, // CPU Performance
  { rate: 10, quantity: 460 }, // GB RAM Basic
  { rate: 15, quantity: 9981 }, // GB RAM Standard
  { rate: 20, quantity: 9594 }, // GB RAM Performance
];

// "MR Virtual Server" sheet, Windows OS block (rows 144-150 quantities, 153-159 prices,
// monthly) - summed and x12 reproduces the sheet's stored 2026-27 Forecast revenue of
// 2157000.0 exactly. The "24x7 Basic : Server, Physical" (MROSBasicP) tier's price-table
// cell shows 50, but the stored monthly revenue for that line (350, with quantity 1) only
// reconciles at an effective rate of 350 - used here as a deliberate, sourced correction
// of a workbook data quirk, not a guess.
export const WINDOWS_OS_REVENUE_LINE_ITEMS: RevenueLineItem[] = [
  { rate: 50, quantity: 38 }, // OS Administration Basic : Server, Virtual
  { rate: 150, quantity: 630 }, // OS Administration 10x5 : Server, Virtual
  { rate: 250, quantity: 290 }, // OS Administration 24x7 : Server, Virtual
  { rate: 0, quantity: 0 }, // OS unmanaged by DCS
  { rate: 700, quantity: 6 }, // OS Administration 10x5 : Server, Physical
  { rate: 900, quantity: 7 }, // OS Administration 24x7 : Server, Physical
  { rate: 350, quantity: 1 }, // OS Administration 24x7 Basic : Server, Physical (effective rate, see note above)
];

// "MR Virtual Server" sheet, RedHat OS block (rows 265-268 quantities, 271-274 prices,
// monthly) - summed and x12 reproduces the sheet's stored 2026-27 Forecast revenue of
// 330000.0 exactly.
export const REDHAT_OS_REVENUE_LINE_ITEMS: RevenueLineItem[] = [
  { rate: 50, quantity: 5 }, // OS Administration Basic : Server, Virtual
  { rate: 150, quantity: 115 }, // OS Administration 10x5 : Server, Virtual
  { rate: 150, quantity: 0 }, // OS Administration 10x5 : Server, Virtual (MROS10U)
  { rate: 250, quantity: 40 }, // OS Administration 24x7 : Server, Virtual
];

// "MR Virtual Server" sheet, Disk Fixed File block (rows 364-368 storage GB quantities,
// 393-397 storage prices; rows 380-383 backup-retention GB quantities, 398-401 retention
// prices; all monthly) - summed and x12 reproduces the sheet's stored 2026-27 Forecast
// revenue of 3305813.52 exactly.
export const DISK_FIXED_FILE_REVENUE_LINE_ITEMS: RevenueLineItem[] = [
  { rate: 0.07, quantity: 412800 }, // Standard Tier
  { rate: 0.13, quantity: 194626 }, // Standard Tier with DR
  { rate: 0.13, quantity: 255897 }, // Performance Tier
  { rate: 0.18, quantity: 274135 }, // Performance Tier with DR
  { rate: 0.2, quantity: 12329 }, // Storage - Disk Variable (embedded sub-line)
  { rate: 0.01, quantity: 266489 }, // 7 day retention backup
  { rate: 0.06, quantity: 409578 }, // 28 day retention backup
  { rate: 0.15, quantity: 5360 }, // 183 day retention backup
  { rate: 0.3, quantity: 360556 }, // 365 day retention backup
];

// "MR Virtual Server" sheet, Disk Variable block (rows 497/500) - 2026-27 quantity is
// confirmed 0 (a real data value, not missing data); price (DCS55, 0.5/GB) is kept so the
// line item reflects the sheet's own stored rate even though it yields $0 revenue.
export const DISK_VARIABLE_REVENUE_LINE_ITEMS: RevenueLineItem[] = [{ rate: 0.5, quantity: 0 }];

export const VIRTUAL_SERVER_PERIODS_PER_YEAR = 12;
