import Papa from 'papaparse';
import { z } from 'zod';
import type { ContractorActualRow } from '@dcs/shared';

const rawRowSchema = z.object({
  NAME: z.string(),
  'COST CTR': z.string(),
  'YEAR MONTH': z.coerce.number(),
  HOURS: z.coerce.number(),
  DOLLAR: z.coerce.number(),
});

export function parseContractorActualCsv(csv: string): ContractorActualRow[] {
  const { data } = Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: true });

  return data.map((raw) => {
    const row = rawRowSchema.parse(raw);
    return {
      name: row.NAME,
      costCtr: row['COST CTR'],
      yearMonth: row['YEAR MONTH'],
      hours: row.HOURS,
      dollar: row.DOLLAR,
    };
  });
}
