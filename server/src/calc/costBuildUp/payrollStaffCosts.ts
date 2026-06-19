import type { EmployeeExpenseRow } from '@dcs/shared';
import type { CostCentreFamily } from '../../config/overheadHeadcount.js';

// Employee Expense is supplied pre-aggregated to cost-centre level (no per-employee
// detail), so a product's share of a shared cost centre's payroll is allocated by
// its share of that cost centre's total personnel headcount (per the Overhead config).
export function computePayrollStaffCosts(
  employeeExpense: EmployeeExpenseRow[],
  family: CostCentreFamily,
  product: string,
): number {
  const headcount = family.products[product];
  if (!headcount) return 0;

  const costCentreTotal = employeeExpense
    .filter((e) => e.costCentre === family.costCentre)
    .reduce((sum, e) => sum + e.total, 0);

  return costCentreTotal * (headcount.staff / family.totalPersonnel);
}
