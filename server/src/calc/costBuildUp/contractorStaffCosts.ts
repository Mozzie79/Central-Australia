import type { ContractorActualRow } from '@dcs/shared';
import type { ContractorAllocation } from '../../config/contractorAllocations.js';

// Forward-looking fiscal years have no actuals yet, so the model budgets next
// year's contractor cost off the most recent 12 months of actual hours (matched
// by contractor name) at next year's escalated hourly rate, then splits that
// estimate across products using each contractor's static allocation fractions.
export function computeContractorStaffCosts(
  contractorActuals: ContractorActualRow[],
  allocations: ContractorAllocation[],
  product: string,
): number {
  const hoursByName = new Map<string, number>();
  for (const row of contractorActuals) {
    const key = row.name.trim().toUpperCase();
    hoursByName.set(key, (hoursByName.get(key) ?? 0) + row.hours);
  }

  let total = 0;
  for (const contractor of allocations) {
    const fraction = contractor.allocations[product];
    if (!fraction) continue;

    const actualHours = hoursByName.get(contractor.pramms.trim().toUpperCase()) ?? 0;
    const modelHourlyRate = contractor.hourlyRateExGst * (1 + contractor.escalationPct);
    const annualEstimate = modelHourlyRate * actualHours;
    total += annualEstimate * fraction;
  }
  return total;
}
