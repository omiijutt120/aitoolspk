import { defineConfig } from '@playwright/test';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 45000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL,
    launchOptions: {
      executablePath:
        process.env.CHROME_PATH ||
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
    },
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run start',
    url: baseURL,
    reuseExistingServer: true,
    timeout: 30000,
  },
});
