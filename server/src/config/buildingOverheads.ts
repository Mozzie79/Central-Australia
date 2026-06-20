// "Facilities" sheet: GDC Building Overheads = Millner Archives lease (lease-analysis
// forecast, 4.2% CPI-adjusted budget column) + GDC power ("Estimate for Costing");
// BDC Overhead = PL0011 BDC lease (same CPI-adjusted forecast) + BDC power
// ("Estimate for Costing"). Both confirmed exact-to-the-cent against the workbook's
// stored 2026-27 values.
export const GDC_BUILDING_OVERHEAD: Record<string, number> = {
  'Server Hosting GDC': 1193122.488,
};

export const BDC_OVERHEAD: Record<string, number> = {
  'Server Hosting BDC': 1047420.11088,
};
