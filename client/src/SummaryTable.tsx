import { useQuery } from '@tanstack/react-query';
import { getSummary, type MissingUploadsError } from './api';

function formatCurrency(value: number | null) {
  if (value === null) return 'N/A - no usage data';
  return value.toLocaleString('en-AU', { style: 'currency', currency: 'AUD' });
}

export function SummaryTable() {
  const { data, error } = useQuery({
    queryKey: ['summary'],
    queryFn: getSummary,
    retry: false,
  });

  if (error) {
    const missing = (error as Error & { body?: MissingUploadsError }).body?.missing;
    if (missing) {
      return <p>Upload all required files in the Upload tab before viewing the summary. Missing: {missing.join(', ')}</p>;
    }
    return <p style={{ color: 'red' }}>{(error as Error).message}</p>;
  }

  if (!data) return <p>Loading summary...</p>;

  return (
    <div>
      <h2>Family Rollup</h2>
      <table>
        <thead>
          <tr>
            <th>Family</th>
            <th>TOTAL EXPENSES</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data.families).map(([family, categories]) => (
            <tr key={family}>
              <td>{family}</td>
              <td>{formatCurrency(categories['TOTAL EXPENSES'])}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Per-Product Summary (2026-27)</h2>
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Total Expense</th>
            <th>Revenue</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data.products).map(([product, summary]) => (
            <tr key={product}>
              <td>{product}</td>
              <td>{formatCurrency(summary.cost['TOTAL EXPENSES'])}</td>
              <td>{formatCurrency(summary.revenue)}</td>
              <td>{formatCurrency(summary.profit)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
