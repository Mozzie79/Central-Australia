import type { RevenueLineItem } from '@dcs/shared';

export function computeLineItemRevenue(lineItems: RevenueLineItem[], periodsPerYear = 1): number {
  const perPeriod = lineItems.reduce((sum, item) => sum + item.rate * item.quantity, 0);
  return perPeriod * periodsPerYear;
}

export function computeProfit(revenue: number, totalExpense: number): number {
  return revenue - totalExpense;
}
