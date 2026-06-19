export type ProductHeadcount = {
  staff: number;
  contractors: number;
};

export type CostCentreFamily = {
  costCentre: string;
  totalPersonnel: number;
  totalContractors: number;
  products: Record<string, ProductHeadcount>;
};

// Extracted from the "Overhead" sheet (static config, not a yearly upload):
// rows 22-26 (Mainframe cost centre totals) and rows 85-89 (per-product split
// of that cost centre's headcount, "Shared Services Over Head Rates to Products").
export const MAINFRAME_FAMILY: CostCentreFamily = {
  costCentre: '661011',
  totalPersonnel: 12.8,
  totalContractors: 9.0,
  products: {
    DB2: { staff: 0.5, contractors: 2.0 },
    EGL: { staff: 1.0, contractors: 0.5 },
    BASE: { staff: 10.35, contractors: 8.5 },
    STORAGE: { staff: 0.8, contractors: 0 },
    MFMQ: { staff: 0, contractors: 0 },
  },
};
