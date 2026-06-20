import Papa from 'papaparse';
import { z } from 'zod';
import type { AsDataRow } from '@dcs/shared';

const rawRowSchema = z.object({
  Contractor: z.string(),
  Client: z.string(),
  Project: z.string(),
  'Hours Worked': z.coerce.number(),
});

export function parseAsDataCsv(csv: string): AsDataRow[] {
  const { data } = Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: true });

  return data.map((raw) => {
    const row = rawRowSchema.parse(raw);
    return {
      contractor: row.Contractor,
      client: row.Client,
      project: row.Project,
      hoursWorked: row['Hours Worked'],
    };
  });
}
