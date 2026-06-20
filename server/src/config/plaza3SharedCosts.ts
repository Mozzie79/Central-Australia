// "Plaza 3 Shared Costs" is a static per-product dollar table. Like
// UNDER_PINNING_SERVICES, these values are NOT independently cross-validated
// against a second source sheet - the label appears 26+ times scattered
// across nearly every non-Mainframe cost build-up sheet with irregular,
// sometimes-negative per-sheet values that don't reconcile against any
// headcount-ratio or building-pool hypothesis tested across multiple prior
// investigation sessions. These values are copied directly from DCS
// Summary's wide cross-tab (row 32), which is the only place a complete,
// internally-consistent set of per-product values exists.
export const PLAZA3_SHARED_COSTS: Record<string, number> = {
  'Application Services': 100082.60722642217,
  MFMQ: 0,
  DB2: 22440.046463323357,
  EGL: 13464.027877994013,
  BASE: 169197.95033345814,
  STORAGE: 7180.814868263474,
  Operations: 0,
  'Server Hosting BDC': 0,
  'Server Hosting GDC': 0,
  mySQL: 1077.1222302395208,
  'Azure Services': 0,
  'Application Hosting': 12386.905647754495,
  'Oracle Database Hosting': 12386.905647754495,
  'SQL Database Hosting': 20196.04181699102,
  'Windows OS': 42905.36883787426,
  'RedHat OS': 4577.769478517966,
  'Website Hosting Services': 5565.131522904194,
  'Squiz Matrix': 0,
  Sharepoint: 6732.013938997009,
  VMWare: 94427.71551766468,
  'Domino / Lotus Notes': 16695.394568712578,
  'App Management': 4488.00929266467,
  'Disk Variable': 0,
  'Disk Fixed File': 11938.104718488024,
  'SAN Storage ABS-HSS': 1795.2037170658684,
  'SAN Storage': 52060.907794910185,
  'Backup Storage': 0,
};
