import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { PriceBookEditor } from './PriceBookEditor';
import { SummaryTable } from './SummaryTable';
import { UploadPanel } from './UploadPanel';
import { ValidationPage } from './ValidationPage';

const queryClient = new QueryClient();

const TABS = ['Upload', 'Price Book', 'Summary', 'Validation'] as const;
type Tab = (typeof TABS)[number];

function App() {
  const [tab, setTab] = useState<Tab>('Upload');

  return (
    <QueryClientProvider client={queryClient}>
      <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
        <h1>DCS Input Costs Model</h1>
        <nav style={{ marginBottom: '1.5rem' }}>
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)} disabled={tab === t} style={{ marginRight: '0.5rem' }}>
              {t}
            </button>
          ))}
        </nav>
        {tab === 'Upload' && <UploadPanel />}
        {tab === 'Price Book' && <PriceBookEditor />}
        {tab === 'Summary' && <SummaryTable />}
        {tab === 'Validation' && <ValidationPage />}
      </main>
    </QueryClientProvider>
  );
}

export default App;
