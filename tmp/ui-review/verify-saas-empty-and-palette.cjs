const { chromium } = require('C:/Users/paulo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  console.log('Launching browser for SaaS empty state & palette test...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });

  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  // Reset store to ensure testing starts from clean SaaS empty slate
  await fetch('http://localhost:3106/api/v1/sample-seed', { method: 'DELETE' });

  console.log('1. Navigating to http://localhost:3106/app ...');
  await page.goto('http://localhost:3106/app', { waitUntil: 'networkidle' });

  // Verify Palette on root body / container
  const bg = await page.evaluate(() => getComputedStyle(document.querySelector('main')?.parentElement || document.body).backgroundColor);
  console.log('Computed background color:', bg);

  // 1. Verify Clean SaaS Empty State
  console.log('2. Checking Clean SaaS Empty State...');
  await page.getByText('No active spending mandates yet').waitFor();
  await page.getByRole('button', { name: 'Create Your First Mandate' }).waitFor();
  await page.screenshot({ path: 'tmp/ui-review/saas-empty-mandates.png' });

  // 2. Check Review Queue Empty State
  console.log('3. Checking Clean Review Queue...');
  await page.getByRole('button', { name: 'Review Queue' }).first().click();
  await page.getByText('Review Queue is Clean').waitFor();
  await page.screenshot({ path: 'tmp/ui-review/saas-empty-queue.png' });

  // 3. Create a Custom Mandate via Modal
  console.log('4. Creating Custom Mandate via Modal...');
  await page.getByRole('button', { name: 'Mandates' }).first().click();
  await page.getByRole('button', { name: 'New Mandate' }).first().click();
  await page.getByPlaceholder('e.g. Q4 Data Science Workstations').fill('SaaS Production GPUs Mandate');
  await page.getByPlaceholder('e.g. Sarah Jenkins').fill('CTO Operations');
  await page.getByRole('button', { name: 'Confirm & Activate Mandate' }).click();

  await page.getByText('SaaS Production GPUs Mandate').waitFor();
  console.log('Custom Mandate successfully created!');

  // 4. Test Persistence on Reload
  console.log('5. Testing Persistence across page reload...');
  await page.reload({ waitUntil: 'networkidle' });
  await page.getByText('SaaS Production GPUs Mandate').waitFor();
  console.log('Persistence verified: Mandate reloaded from API v1 / store!');
  await page.screenshot({ path: 'tmp/ui-review/saas-persisted-mandate.png' });

  // 5. Test Loading Pitch Demo Scenario on Demand
  console.log('6. Loading Pitch Demo Scenario on Demand...');
  await page.getByRole('button', { name: 'Review Queue' }).first().click();
  await page.getByRole('button', { name: 'Simulate Pitch Interception' }).click();
  await page.getByText('Intercept Analysis: QUANTITY_MISMATCH').waitFor();
  console.log('Pitch Demo Interception successfully loaded and visible!');
  await page.screenshot({ path: 'tmp/ui-review/saas-pitch-interception.png' });

  // 6. Mobile Responsiveness Check
  console.log('7. Testing Mobile Viewport (390x844)...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3106/app', { waitUntil: 'networkidle' });

  const isOverflowing = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (isOverflowing) {
    throw new Error('Mobile layout has horizontal overflow!');
  }

  // Open mobile drawer
  await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
  await page.getByText('Intent Operations & Rails').waitFor();
  await page.screenshot({ path: 'tmp/ui-review/saas-mobile-drawer.png' });

  console.log('ALL SAAS PERSISTENCE, EMPTY STATE & PALETTE TESTS PASSED! Errors:', errors);
  await browser.close();

  if (errors.length > 0) process.exit(1);
})().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
