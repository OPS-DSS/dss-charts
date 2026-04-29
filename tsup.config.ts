import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.tsx', 'src/*.tsx'],
  format: ['esm'],
  jsx: 'react-jsx',
  external: ['react', 'react-dom', 'recharts', 'leaflet', 'react-leaflet'],
  dts: true,
})
