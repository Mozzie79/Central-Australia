import Papa from 'papaparse';
import { z } from 'zod';
import type { FixedAssetRow } from '@dcs/shared';

const rawRowSchema = z.object({
  'COST CENTRE': z.string(),
  'COST BASIS': z.coerce.number(),
  'ACCUM DEPN': z.coerce.number(),
  'CURR DEPN': z.coerce.number(),
  'ACQ DATE': z.string(),
  'EST LIFE YYY/MM': z.string(),
});

function parseEstLifeYears(estLife: string): number {
  const match = estLife.match(/(\d+)Yr/);
  return match ? Number(match[1]) : 0;
}

export function parseFixedAssetsCsv(csv: string): FixedAssetRow[] {
  const { data } = Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: true });

  return data.map((raw) => {
    const row = rawRowSchema.parse(raw);
    return {
      costCentre: row['COST CENTRE'],
      costBasis: row['COST BASIS'],
      accumDepn: row['ACCUM DEPN'],
      currDepn: row['CURR DEPN'],
      acqDate: row['ACQ DATE'],
      estLifeYears: parseEstLifeYears(row['EST LIFE YYY/MM']),
    };
  });
}
