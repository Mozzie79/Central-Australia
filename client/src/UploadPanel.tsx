import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getUploadStatus, uploadFile, type UploadFileType } from './api';

const SLOTS: { fileType: UploadFileType; label: string }[] = [
  { fileType: 'fixed-assets', label: 'Fixed Assets' },
  { fileType: 'employee-expense', label: 'Employee Expense' },
  { fileType: 'contractor-actual', label: 'Contractor Actual' },
  { fileType: 'mainframe-usage', label: 'Mainframe Usage' },
];

function UploadSlot({ fileType, label }: { fileType: UploadFileType; label: string }) {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (csv: string) => uploadFile(fileType, csv),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['uploads'] });
      queryClient.invalidateQueries({ queryKey: ['summary'] });
      queryClient.invalidateQueries({ queryKey: ['priceBook'] });
    },
  });

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const csv = await file.text();
    mutation.mutate(csv);
  };

  return (
    <div style={{ marginBottom: '0.75rem' }}>
      <label>
        {label}: <input type="file" accept=".csv" onChange={handleChange} />
      </label>
      {mutation.isPending && <span> uploading...</span>}
      {mutation.isSuccess && <span> ✓ {mutation.data.rowCount} rows</span>}
      {mutation.isError && <span style={{ color: 'red' }}> {(mutation.error as Error).message}</span>}
    </div>
  );
}

export function UploadPanel() {
  const { data: status } = useQuery({ queryKey: ['uploads'], queryFn: getUploadStatus });

  return (
    <div>
      <h2>Upload Files</h2>
      {SLOTS.map((slot) => (
        <UploadSlot key={slot.fileType} {...slot} />
      ))}
      {status && (
        <p>
          Status:{' '}
          {Object.entries(status)
            .map(([key, uploaded]) => `${key}: ${uploaded ? 'uploaded' : 'missing'}`)
            .join(', ')}
        </p>
      )}
    </div>
  );
}
