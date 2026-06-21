// A single price/quantity pairing within a product's revenue calculation - e.g. one
// VMWare CPU tier, or one Disk Fixed File storage class. Annual revenue for a line
// item is rate * quantity (* periodsPerYear, for line items priced per month).
export type RevenueLineItem = {
  rate: number;
  quantity: number;
  label: string;
};

// One editable row in the Price Book UI - a RevenueLineItem plus the identifiers
// needed to display and update it. `id` is a stable "<product>:<index>" key.
export type PriceBookLineItem = {
  id: string;
  product: string;
  label: string;
  rate: number;
  quantity: number;
};
