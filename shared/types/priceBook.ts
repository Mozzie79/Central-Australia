// A single price/quantity pairing within a product's revenue calculation - e.g. one
// VMWare CPU tier, or one Disk Fixed File storage class. Annual revenue for a line
// item is rate * quantity (* periodsPerYear, for line items priced per month).
export type RevenueLineItem = {
  rate: number;
  quantity: number;
};
