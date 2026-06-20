import Papa from 'papaparse';
import { z } from 'zod';
import type { MainframeUsageRow } from '@dcs/shared';

const rawRowSchema = z.object({
  Agency: z.string(),
  Date: z.string(),
  RType: z.string(),
  TypeTask: z.string(),
  Resource: z.string(),
  Application: z.string(),
  TranName: z.string(),
  'CPU Secs': z.coerce.number(),
});

export function parseMainframeUsageCsv(csv: string): MainframeUsageRow[] {
  const { data } = Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: true });

  return data.map((raw) => {
    const row = rawRowSchema.parse(raw);
    return {
      agency: row.Agency,
      date: row.Date,
      rType: row.RType,
      typeTask: row.TypeTask,
      resource: row.Resource,
      application: row.Application,
      tranName: row.TranName,
      cpuSecs: row['CPU Secs'],
    };
  });
}
