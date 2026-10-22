import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://127.0.0.1:3000';
const localChrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const executablePath =
  process.env.CHROME_PATH ||
  (process.platform === 'win32' && existsSync(localChrome)
    ? localChrome
    : undefined);
export default defineConfig({
  testDir: './tests/browser',
  timeout: 45000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL,
    launchOptions: executablePath ? { executablePath } : {},
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run start',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
