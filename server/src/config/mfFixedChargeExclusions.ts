// "MF Fixed 26-27" sheet: these 3 agencies have real mainframe CPU usage in the
// `data` sheet / Pivot Agency 25-26, but are billed outside this charge-back model
// (their MF Fixed rows show $0 CPU/charge regardless of actual usage) - confirmed
// by direct inspection, accounts exactly for the gap between Pivot Agency 25-26's
// Grand Total (34,515,104.01) and MF Fixed's "2026-27 Total Forecast CPU Seconds"
// (34,014,002.16).
export const CPU_CHARGE_EXCLUDED_AGENCIES: string[] = [
  'BATCHELOR INSTITUTE OF INDIGENOUS TERTIARY EDUCATION',
  'DCDD WEB DESIGN AND SUPPORT',
  'JACANA ENERGY TRIM',
];
