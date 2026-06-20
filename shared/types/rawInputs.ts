export type FixedAssetRow = {
  assetNo: string;
  costCentre: string;
  costBasis: number;
  accumDepn: number;
  currDepn: number;
  acqDate: string;
  estLifeYears: number;
};

export type EmployeeExpenseRow = {
  positionNumber: string;
  costCentre: string;
  name: string;
  total: number;
};

export type ContractorActualRow = {
  name: string;
  costCtr: string;
  yearMonth: number;
  hours: number;
  dollar: number;
};

export type MainframeUsageRow = {
  agency: string;
  date: string;
  rType: string;
  typeTask: string;
  resource: string;
  application: string;
  tranName: string;
  cpuSecs: number;
};

export type DasdUsageRow = {
  agency: string;
  grandTotalGb: number;
};

export type AsDataRow = {
  contractor: string;
  client: string;
  project: string;
  hoursWorked: number;
};
