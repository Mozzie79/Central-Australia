export type PlannedAssetAddition = {
  description: string;
  product: string;
  fy202526: number;
  fy202627: number;
};

// Budgeted future capital purchases for the forecast year, extracted from the "Depreciation"
// sheet's "Future Acquisition" rows (no ASSET NO. yet since they have not been bought).
// These are static planning assumptions baked into the model, not part of any yearly upload.
export const PLANNED_ASSET_ADDITIONS: PlannedAssetAddition[] = [
  { description: "Pure", product: "SAN STORAGE", fy202526: 0, fy202627: 500000.00000000006 },
  { description: "Server Hardware GDC", product: "VMWARE", fy202526: 33333.333333333336, fy202627: 199999.99999999997 },
  { description: "Storage Replication Server", product: "SAN STORAGE", fy202526: 33333.333333333336, fy202627: 21666.66666666666 },
  { description: "Splunk Cisco Appliances", product: "VMWARE", fy202526: 33333.333333333336, fy202627: 40000 },
  { description: "Generator Fuel Transfer pump", product: "SERVER HOSTING GDC", fy202526: 0, fy202627: 10938.234285714285 },
  { description: "Solar Panels", product: "SERVER HOSTING GDC", fy202526: 0, fy202627: 26971.34166666667 },
  { description: "RITTAL RACK 6F", product: "SERVER HOSTING GDC", fy202526: 0, fy202627: 711.475 },
  { description: "RITTAL RACK 6G", product: "SERVER HOSTING GDC", fy202526: 237.15833333333333, fy202627: 711.475 },
  { description: "RITTAL RACK 6H", product: "SERVER HOSTING GDC", fy202526: 237.15833333333333, fy202627: 711.475 },
  { description: "RITTAL RACK 6I", product: "SERVER HOSTING GDC", fy202526: 237.15833333333333, fy202627: 711.475 },
  { description: "RITTAL RACK 8D", product: "SERVER HOSTING GDC", fy202526: 237.15833333333333, fy202627: 711.475 },
  { description: "RITTAL RACK 8D", product: "SERVER HOSTING GDC", fy202526: 237.15833333333333, fy202627: 711.475 },
  { description: "Z17", product: "BASE", fy202526: 0, fy202627: 216990.83333333328 },
  { description: "Z16 Memory Upgrade", product: "BASE", fy202526: 0, fy202627: 41333.333333333336 },
  { description: "SAN Hyperlinks", product: "STORAGE", fy202526: 0, fy202627: 14882.590000000002 },
];
