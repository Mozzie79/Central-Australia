export function computeEglCharge(appCountByAgency: Record<string, number>, eglChargePool: number): Record<string, number> {
  const totalAppCount = Object.values(appCountByAgency).reduce((sum, count) => sum + count, 0);

  const charges: Record<string, number> = {};
  for (const [agency, count] of Object.entries(appCountByAgency)) {
    charges[agency] = Math.round((count / totalAppCount) * eglChargePool);
  }
  return charges;
}
