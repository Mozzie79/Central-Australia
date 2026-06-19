import Papa from 'papaparse';
import { z } from 'zod';
import type { EmployeeExpenseRow } from '@dcs/shared';

const rawRowSchema = z.object({
  costCentre: z.string(),
  fte: z.coerce.number(),
  total: z.coerce.number(),
});

export function parseEmployeeExpenseCsv(csv: string): EmployeeExpenseRow[] {
  const { data } = Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: true });

  return data.map((raw) => {
    const row = rawRowSchema.parse(raw);
    return { costCentre: row.costCentre, fte: row.fte, total: row.total };
  });
}
