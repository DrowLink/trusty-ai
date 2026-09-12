const { chromium } = require('C:/Users/paulo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');

(async () => {
  console.log('Launching browser for verification...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));

  // Stub external cloud calls to keep test fast and isolated
  await page.route('**/api/agents', route => route.fulfill({ json: { success: true, agents: [] } }));

  console.log('Navigating to http://localhost:3105/app ...');
  await page.goto('http://localhost:3105/app', { waitUntil: 'networkidle' });

  // 1. Verify Mandates View
  console.log('1. Testing Mandates View...');
  await page.getByText('Active Delegated Mandates').waitFor();
  await page.getByText('Q3 Engineering Onboarding Laptops').waitFor();
  await page.screenshot({ path: 'tmp/ui-review/console-mandates.png' });

  // 2. Open New Mandate Modal
  console.log('2. Testing New Mandate Modal...');
  await page.getByRole('button', { name: 'New Mandate' }).first().click();
  await page.getByText('Create New Human Mandate').waitFor();
  await page.getByRole('button', { name: 'Cancel' }).click();

  // 3. Test Review Queue Tab
  console.log('3. Testing Review Queue Tab...');
  await page.getByRole('button', { name: 'Review Queue' }).first().click();
  await page.getByText('Human-In-The-Loop Intent Interceptions').waitFor();
  await page.getByText('Intercept Analysis: QUANTITY_MISMATCH').waitFor();
  await page.getByText('Dell Latitude 3540 Essential Workstations').first().waitFor();
  await page.screenshot({ path: 'tmp/ui-review/console-approvals.png' });

  // 4. Test Approving an Exception
  console.log('4. Testing Approve Exception Action...');
  await page.getByRole('button', { name: 'Approve Exception & Disburse' }).click();
  await page.getByRole('button', { name: 'Yes, execute' }).click();
  await page.getByText('Resolution Recorded: APPROVED_EXCEPTION').waitFor();

  // 5. Test Audit Trail Tab
  console.log('5. Testing Audit Trail Tab...');
  await page.getByRole('button', { name: 'Audit Trail' }).first().click();
  await page.getByText('Decision & ID').waitFor();
  await page.screenshot({ path: 'tmp/ui-review/console-audit.png' });

  // 6. Test Simulator Tab
  console.log('6. Testing Simulator Tab...');
  await page.getByRole('button', { name: 'Simulator' }).first().click();
  await page.getByText('REAL-TIME TRANSACTION SECURITY').waitFor();

  // 7. Test Agent Tools Tab
  console.log('7. Testing Agent Tools Tab...');
  await page.getByRole('button', { name: 'Agent Tools' }).first().click();
  await page.getByText('Agent Intelligence & Repository Scanner').waitFor();

  // 8. Mobile Responsiveness Test (390x844)
  console.log('8. Testing Mobile Viewport & Drawer...');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3105/app', { waitUntil: 'networkidle' });

  const isOverflowing = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  if (isOverflowing) {
    throw new Error('Mobile layout has horizontal overflow!');
  }

  // Open mobile drawer
  await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
  await page.getByText('Intent Operations & Rails').waitFor();
  await page.screenshot({ path: 'tmp/ui-review/console-mobile-menu.png' });

  // Switch tab in mobile menu
  await page.locator('.md\\:hidden').getByRole('button', { name: 'Review Queue' }).click();
  await page.getByText('Human-In-The-Loop Intent Interceptions').waitFor();
  await page.screenshot({ path: 'tmp/ui-review/console-mobile-approvals.png' });

  console.log('ALL VERIFICATION CHECKS PASSED PERFECTLY! Errors:', errors);
  await browser.close();

  if (errors.length > 0) {
    process.exit(1);
  }
})().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
