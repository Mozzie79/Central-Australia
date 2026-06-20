// "Cost Centre Specific Expenses" is a static per-product dollar table, not a
// formula to derive - the CMS and UPS sheet's own row 51 is a pre-computed
// per-product column-sum over its GL-Standard-Class-code line items, and
// these reproduce the DCS Summary wide cross-tab (row 37) exactly for every
// product checked.
export const CCS_EXPENSES: Record<string, number> = {
  'Application Services': 17000,
  MFMQ: 0,
  DB2: 0,
  EGL: 0,
  BASE: 23000,
  STORAGE: 0,
  Operations: 79000,
  'Server Hosting BDC': 22000,
  'Server Hosting GDC': 100500,
  mySQL: 0,
  'Azure Services': 0,
  'Application Hosting': 10000,
  'Oracle Database Hosting': 0,
  'SQL Database Hosting': 25400,
  'Windows OS': 900,
  'RedHat OS': 0,
  'Website Hosting Services': 0,
  'Squiz Matrix': 0,
  Sharepoint: 900,
  VMWare: 1900,
  'Domino / Lotus Notes': 0,
  'App Management': 0,
  'Disk Variable': 0,
  'Disk Fixed File': 0,
  'SAN Storage ABS-HSS': 0,
  'SAN Storage': 0,
  'Backup Storage': 0,
};
