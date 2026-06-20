import type { EmployeeExpenseRow } from '@dcs/shared';
import type { EmployeeAllocation } from '../../config/employeeProductMap.js';

// Employee Expense is supplied per employee-row (one row per position/cost-centre split).
// Each row's product split is an explicit, often-fractional static allocation (the
// "Employee Expense" sheet's own allocation columns), joined by (positionNumber, costCentre)
// rather than name, since a position split across cost centres produces two rows sharing a
// position number, and some employees' names repeat across rows without disambiguation.
export function computePayrollStaffCosts(
  employeeExpense: EmployeeExpenseRow[],
  employeeAllocations: EmployeeAllocation[],
  product: string,
): number {
  const allocationByKey = new Map<string, EmployeeAllocation>();
  for (const allocation of employeeAllocations) {
    allocationByKey.set(`${allocation.positionNumber}|${allocation.costCentre}`, allocation);
  }

  return employeeExpense.reduce((sum, row) => {
    const allocation = allocationByKey.get(`${row.positionNumber}|${row.costCentre}`);
    const fraction = allocation?.allocations[product] ?? 0;
    return sum + row.total * fraction;
  }, 0);
}
