import Papa from 'papaparse';
import { z } from 'zod';
import type { DasdUsageRow } from '@dcs/shared';

const rawRowSchema = z.object({
  Agency: z.string(),
  'Grand Total': z.coerce.number(),
});

export function parseDasdUsageCsv(csv: string): DasdUsageRow[] {
  const { data } = Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: true });

  return data.map((raw) => {
    const row = rawRowSchema.parse(raw);
    return {
      agency: row.Agency,
      grandTotalGb: row['Grand Total'],
    };
  });
}
