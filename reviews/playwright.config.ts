import { defineConfig, devices } from '@playwright/test';

const PORT = 3210;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Tests run against a production build so headers (X-Robots-Tag) and metadata
// behave exactly as they will in deployment.
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    env: {
      // Leave review-URL env vars unset so the build exercises the real
      // config.ts defaults (asserted in the tests).
      // Browser-fired events + request-fixture posts all share one loopback IP;
      // raise the limit so parallel tests don't trip the throttle.
      RATE_LIMIT_MAX: '1000',
    },
  },
});
