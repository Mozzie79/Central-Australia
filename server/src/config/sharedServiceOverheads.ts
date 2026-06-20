// "Business Support" sheet row 22 (Total Shared Service Personnel Allocation,
// pool -$503,020.24): per-destination dollar values, labeled "Business Support HR
// Overhead" on the cost build-up sheets.
export const HR_OVERHEAD: Record<string, number> = {
  BASE: 115694.65632916722,
  DB2: 15090.60734728268,
  EGL: 10060.404898188453,
  STORAGE: 5030.202449094227,
  Operations: 85513.44163460186,
  'Server Hosting GDC': 10060.404898188453,
  'Server Hosting BDC': 0,
};

// "Business Support" sheet row 81 (GL 379111, GOODS & SERVICES COST ALLOC,
// pool -$1,846,658.00): per-destination dollar values.
export const BUSINESS_SUPPORT_OVERHEAD: Record<string, number> = {
  BASE: 424731.34,
  DB2: 55399.74,
  EGL: 36933.16,
  STORAGE: 18466.58,
  Operations: 313931.86000000004,
  'Server Hosting GDC': 36933.16,
  'Server Hosting BDC': 0,
};

// "Corporate" sheet rows 22 + 73 summed per destination (two "Total Shared
// Service Personnel Allocation" blocks, pools -$430,434.04 and -$2,500.00).
// Operations and Server Hosting GDC are hardcoded to $0 on the actual build-up
// sheets even though the source table has non-zero values for them; Server
// Hosting BDC is genuinely $0 in the source table too.
export const CORPORATE_STAFF_OVERHEAD: Record<string, number> = {
  BASE: 99574.82970505925,
  DB2: 12988.021265877293,
  EGL: 8658.680843918195,
  STORAGE: 4329.3404219590975,
  Operations: 0,
  'Server Hosting GDC': 0,
  'Server Hosting BDC': 0,
};
