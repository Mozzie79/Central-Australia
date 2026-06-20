export function computeCpuCharge(
  usageByAgency: Record<string, number>,
  excludedAgencies: string[],
  cpuTotalChargePool: number,
): Record<string, number> {
  const excluded = new Set(excludedAgencies);

  let totalForecastCpu = 0;
  for (const [agency, cpu] of Object.entries(usageByAgency)) {
    if (!excluded.has(agency)) totalForecastCpu += cpu;
  }

  const charges: Record<string, number> = {};
  for (const [agency, cpu] of Object.entries(usageByAgency)) {
    charges[agency] = excluded.has(agency) ? 0 : Math.round((cpu / totalForecastCpu) * cpuTotalChargePool);
  }
  return charges;
}
