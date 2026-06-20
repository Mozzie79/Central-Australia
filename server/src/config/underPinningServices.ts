// "Under Pinning Services" is a static per-product dollar table. Unlike every
// sibling table in this directory, these values are NOT independently
// cross-validated against a second source sheet - the CMS and UPS sheet's own
// per-product/pool-code line items (rows 55-77) have a real, varied spread
// per product (e.g. "Virtual Machines" totals $85,166.40) whose grand total
// matches DCS Summary's total, but whose per-product split does not match
// DCS Summary's per-product columns at all. DCS Summary instead attributes
// each cost-centre family's entire pool to one nominal product (e.g. all of
// Mainframe's pool to BASE, none to DB2/EGL/Storage/MQ) - a manual override
// baked into DCS Summary itself, not a derivable formula. These values are
// copied directly from DCS Summary's wide cross-tab (row 38).
export const UNDER_PINNING_SERVICES: Record<string, number> = {
  'Application Services': 82716.96,
  MFMQ: 0,
  DB2: 0,
  EGL: 0,
  BASE: 1426392.9600000002,
  STORAGE: 0,
  Operations: 0,
  'Server Hosting BDC': 0,
  'Server Hosting GDC': 0,
  mySQL: 0,
  'Azure Services': 0,
  'Application Hosting': 0,
  'Oracle Database Hosting': 0,
  'SQL Database Hosting': 0,
  'Windows OS': 0,
  'RedHat OS': 0,
  'Website Hosting Services': 0,
  'Squiz Matrix': 0,
  Sharepoint: 0,
  VMWare: 762484.08,
  'Domino / Lotus Notes': 0,
  'App Management': 0,
  'Disk Variable': 0,
  'Disk Fixed File': 3037012.799999998,
  'SAN Storage ABS-HSS': 0,
  'SAN Storage': 804544.08,
  'Backup Storage': 0,
};
