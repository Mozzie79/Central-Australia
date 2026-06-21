import { useQuery } from '@tanstack/react-query';
import { getValidation } from './api';

const STATUS_COLOR: Record<string, string> = {
  matched: 'green',
  approximate: 'orange',
  flagged: 'red',
};

export function ValidationPage() {
  const { data, error } = useQuery({
    queryKey: ['validation'],
    queryFn: getValidation,
  });

  if (error) {
    return <p style={{ color: 'red' }}>{(error as Error).message}</p>;
  }

  if (!data) return <p>Loading validation results...</p>;

  const allResults = data.sheets.flatMap((sheet) => sheet.results);
  const matched = allResults.filter((r) => r.status === 'matched').length;
  const approximate = allResults.filter((r) => r.status === 'approximate').length;
  const flagged = allResults.filter((r) => r.status === 'flagged').length;

  return (
    <div>
      <h2>Validation</h2>
      <p>
        {matched} matched, {approximate} approximate, {flagged} flagged
      </p>

      {data.sheets.map((sheet) => (
        <div key={sheet.sheetName} style={{ marginBottom: '1.5rem' }}>
          <h3>{sheet.sheetName}</h3>
          <table>
            <thead>
              <tr>
                <th>Row</th>
                <th>Computed</th>
                <th>Expected</th>
                <th>Diff %</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {sheet.results.map((result) => (
                <tr key={result.row}>
                  <td>{result.row}</td>
                  <td>{result.computed.toFixed(2)}</td>
                  <td>{result.expected.toFixed(2)}</td>
                  <td>{result.diffPct.toFixed(2)}%</td>
                  <td style={{ color: STATUS_COLOR[result.status] }}>{result.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
