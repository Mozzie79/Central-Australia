import Papa from 'papaparse';
import { z } from 'zod';
import type { EmployeeExpenseRow } from '@dcs/shared';

const rawRowSchema = z.object({
  positionNumber: z.string(),
  costCentre: z.string(),
  name: z.string(),
  total: z.coerce.number(),
});

export function parseEmployeeExpenseCsv(csv: string): EmployeeExpenseRow[] {
  const { data } = Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: true });

  return data.map((raw) => {
    const row = rawRowSchema.parse(raw);
    return { positionNumber: row.positionNumber, costCentre: row.costCentre, name: row.name, total: row.total };
  });
}
