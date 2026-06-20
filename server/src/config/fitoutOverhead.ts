// "Fitout Overhead" is a static per-product dollar table, not a formula to
// derive - every cost build-up sheet already stores its own per-product value
// for this row (e.g. MF BASE row 17, Operations row 110), and these reproduce
// the DCS Summary wide cross-tab (row 35) exactly for every product checked.
export const FITOUT_OVERHEAD: Record<string, number> = {
  'Application Services': 28544.49846592494,
  MFMQ: 0,
  DB2: 14272.24923296247,
  EGL: 14272.24923296247,
  BASE: 92769.62001425606,
  STORAGE: 7136.124616481235,
  Operations: 21408.373849443702,
  'Server Hosting BDC': 0,
  'Server Hosting GDC': 3568.0623082406173,
  mySQL: 0,
  'Azure Services': 0,
  'Application Hosting': 3568.0623082406173,
  'Oracle Database Hosting': 7136.124616481235,
  'SQL Database Hosting': 14272.24923296247,
  'Windows OS': 32112.560774165555,
  'RedHat OS': 17840.311541203086,
  'Website Hosting Services': 3568.0623082406173,
  'Squiz Matrix': 0,
  Sharepoint: 3568.0623082406173,
  VMWare: 42816.747698887404,
  'Domino / Lotus Notes': 17840.311541203086,
  'App Management': 3568.0623082406173,
  'Disk Variable': 0,
  'Disk Fixed File': 10704.186924721851,
  'SAN Storage ABS-HSS': 0,
  'SAN Storage': 17840.311541203086,
  'Backup Storage': 0,
};
