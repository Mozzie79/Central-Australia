import type { PriceBookLineItem, ValidationResponse } from '@dcs/shared';

export type UploadFileType = 'fixed-assets' | 'employee-expense' | 'contractor-actual' | 'mainframe-usage';

export type UploadStatus = {
  fixedAssets: boolean;
  employeeExpense: boolean;
  contractorActual: boolean;
  mainframeUsage: boolean;
};

export type ProductSummary = {
  cost: Record<string, number>;
  revenue: number | null;
  profit: number | null;
};

export type SummaryResponse = {
  products: Record<string, ProductSummary>;
  families: Record<string, Record<string, number>>;
};

export type MissingUploadsError = { missing: string[] };

async function asJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Object.assign(new Error(body.error ?? `Request failed: ${res.status}`), { body });
  }
  return res.json();
}

export function getUploadStatus(): Promise<UploadStatus> {
  return fetch('/api/uploads').then((res) => asJson(res));
}

export async function uploadFile(fileType: UploadFileType, csv: string): Promise<{ rowCount: number }> {
  const res = await fetch(`/api/uploads/${fileType}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ csv }),
  });
  return asJson(res);
}

export function getPriceBook(): Promise<PriceBookLineItem[]> {
  return fetch('/api/price-book').then((res) => asJson(res));
}

export async function updatePriceBookRate(id: string, rate: number): Promise<PriceBookLineItem[]> {
  const res = await fetch(`/api/price-book/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rate }),
  });
  return asJson(res);
}

export async function getSummary(): Promise<SummaryResponse> {
  const res = await fetch('/api/summary');
  return asJson(res);
}

export async function getValidation(): Promise<ValidationResponse> {
  const res = await fetch('/api/validation');
  return asJson(res);
}
