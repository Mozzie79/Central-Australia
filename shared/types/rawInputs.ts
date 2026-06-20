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
