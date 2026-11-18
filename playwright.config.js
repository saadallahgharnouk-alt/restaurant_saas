import { defineConfig } from '@playwright/test'

const baseURL = 'http://127.0.0.1:4174'

export default defineConfig({
  testDir: './tests',
  forbidOnly: Boolean(process.env.CI),
  use: { baseURL },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4174 --strictPort',
    env: { VITE_API_URL: 'http://127.0.0.1:5000' },
    url: baseURL,
  },
})
