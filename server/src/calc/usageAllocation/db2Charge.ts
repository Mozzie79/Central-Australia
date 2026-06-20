export function computeDb2Charge(dbCountByAgency: Record<string, number>, db2ChargePool: number): Record<string, number> {
  const totalDb2Count = Object.values(dbCountByAgency).reduce((sum, count) => sum + count, 0);

  const charges: Record<string, number> = {};
  for (const [agency, count] of Object.entries(dbCountByAgency)) {
    charges[agency] = Math.round((count / totalDb2Count) * db2ChargePool);
  }
  return charges;
}
