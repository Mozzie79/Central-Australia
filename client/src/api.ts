import type { PriceBookLineItem, ValidationResponse } from '@dcs/shared';
import * as offline from './offlineCompute';

// Set at build time only by vite.offline.config.ts; the conditionals below
// are dead code eliminated from the normal (server-backed) build.
const OFFLINE = import.meta.env.VITE_OFFLINE === 'true';

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
  if (OFFLINE) return offline.getUploadStatus();
  return fetch('/api/uploads').then((res) => asJson(res));
}

export async function uploadFile(fileType: UploadFileType, csv: string): Promise<{ rowCount: number }> {
  if (OFFLINE) return offline.uploadFile(fileType, csv);
  const res = await fetch(`/api/uploads/${fileType}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ csv }),
  });
  return asJson(res);
}

export function getPriceBook(): Promise<PriceBookLineItem[]> {
  if (OFFLINE) return offline.getPriceBook();
  return fetch('/api/price-book').then((res) => asJson(res));
}

export async function updatePriceBookRate(id: string, rate: number): Promise<PriceBookLineItem[]> {
  if (OFFLINE) return offline.updatePriceBookRate(id, rate);
  const res = await fetch(`/api/price-book/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rate }),
  });
  return asJson(res);
}

export async function getSummary(): Promise<SummaryResponse> {
  if (OFFLINE) return offline.getSummary();
  const res = await fetch('/api/summary');
  return asJson(res);
}

export async function getValidation(): Promise<ValidationResponse> {
  if (OFFLINE) return Promise.reject(new Error('Validation is not available in the offline build (it depends on fixture files bundled only in the server).'));
  const res = await fetch('/api/validation');
  return asJson(res);
}
