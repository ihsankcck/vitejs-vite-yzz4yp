import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^~(.*)$/, replacement: '$1' },
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: 'lodash', replacement: 'lodash-es' },
    ],
  },
});
