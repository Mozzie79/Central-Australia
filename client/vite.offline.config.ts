import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// Produces one self-contained dist-offline/index.html with no server and no
// network calls - see client/src/offlineCompute.ts for the in-browser calc
// path this build enables via the VITE_OFFLINE define below.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  define: {
    'import.meta.env.VITE_OFFLINE': JSON.stringify('true'),
  },
  build: {
    outDir: 'dist-offline',
  },
})
