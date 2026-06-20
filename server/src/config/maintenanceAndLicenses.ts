// "Maintenance and Licenses" is a static per-product dollar table, not a formula
// to derive - the `SW 2026-27` software invoice sheet already stores a per-row,
// per-product "Value $" allocation (Allocation % x Budgeted Cost, computed by the
// sheet itself); summing those columns reproduces every cost build-up sheet's
// "Maintenance and Licenses" row exactly, confirmed against the DCS Summary
// wide cross-tab (row 24) for every product.
export const MAINTENANCE_AND_LICENSES: Record<string, number> = {
  'Application Services': 0,
  MFMQ: 0,
  DB2: 441397.42000000004,
  EGL: 149398.15000000002,
  BASE: 3936326.8597500003,
  STORAGE: 241230.27024999997,
  Operations: 31970.350000000006,
  'Server Hosting BDC': 0,
  'Server Hosting GDC': 0,
  mySQL: 0,
  'Azure Services': 167998.55,
  'Application Hosting': 0,
  'Oracle Database Hosting': 48968.4,
  'SQL Database Hosting': 459818.9700000001,
  'Windows OS': 850096.3150000001,
  'RedHat OS': 326424.7925,
  'Website Hosting Services': 0,
  'Squiz Matrix': 0,
  Sharepoint: 198886.85749999998,
  VMWare: 1249231.48,
  'Domino / Lotus Notes': 0,
  'App Management': 0,
  'Disk Variable': 24934.157400000004,
  'Disk Fixed File': 99736.62960000001,
  'SAN Storage ABS-HSS': 199315.55000000005,
  'SAN Storage': 1322509.902,
  'Backup Storage': 0,
};
