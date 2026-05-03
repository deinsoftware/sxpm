import { configDefaults, defineConfig } from 'vitest/config'

const include = [
  'src/**/*'
]

const exclude = [
  ...configDefaults.exclude,
  'bin/**',
  'test{,s}/**',
  'test{,-*}.{js,cjs,mjs,ts,tsx,jsx}',
  '**/*{.,-}types.{js,cjs,mjs,ts,tsx,jsx}',
  '**/*{.,-}test.{js,cjs,mjs,ts,tsx,jsx}',
  'src/index.ts'
]

export default defineConfig({
  test: {
    globals: true,
    reporters: ['verbose'],
    include: ['./src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: [
      ...configDefaults.exclude,
      '**/test.{js,cjs,mjs,ts,tsx,jsx}'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: [...include],
      exclude: [...exclude],
      thresholds: {
        statements: 92,
        branches: 83,
        functions: 100,
        lines: 97
      }
    }
  }
})