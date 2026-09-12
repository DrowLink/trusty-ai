const { chromium } = require('C:/Users/paulo/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({headless:true, channel: 'chrome'});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[]; const api=[];
page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().includes('/api/'))api.push(r.url())});
await page.goto('http://localhost:3101/',{waitUntil:'networkidle'});
await page.screenshot({path:'tmp/ui-review/desktop.png',fullPage:true});
if(api.length)throw new Error('Homepage loaded APIs: '+api.join(','));
await page.getByRole('button',{name:'The right purchase',exact:true}).click();
await page.getByText('Matches your mandate',{exact:true}).waitFor();
await page.getByRole('button',{name:'Wrong specification',exact:true}).click();
await page.getByText(/Specification: expected/).waitFor();
await page.getByRole('button',{name:'Different delivery',exact:true}).click();
await page.getByText(/Delivery: expected/).waitFor();
await page.getByRole('button',{name:'Multiple platforms',exact:true}).click();
await page.locator('.flow-providers').getByText('Ramp',{exact:true}).waitFor();
await page.setViewportSize({width:390,height:844});
await page.screenshot({path:'tmp/ui-review/mobile.png',fullPage:true});
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Mobile horizontal overflow');
await page.goto('http://localhost:3101/demo',{waitUntil:'networkidle'});
const downloaded=page.waitForEvent('download');await page.getByRole('button',{name:'Download example decision record'}).click();await (await downloaded).saveAs('tmp/ui-review/decision.json');
await page.goto('http://localhost:3101/contact');
if(!(await page.getByRole('link',{name:'Request a demo by email'}).getAttribute('href')).startsWith('mailto:paulo@trusty.bot'))throw new Error('Wrong contact');
await page.goto('http://localhost:3101/docs');await page.getByRole('heading',{name:'Current availability'}).waitFor();
// Keep verification read-only: stub agent loading rather than touching live cloud stores.
await page.route('**/api/agents',route=>route.fulfill({json:{success:true,agents:[]}}));
await page.goto('http://localhost:3101/?tab=decision_api');
if(!page.url().includes('/app?tab=decision_api'))throw new Error('Legacy route failed');
await page.goto('http://localhost:3101/app?signin=1');
await page.screenshot({path:'tmp/ui-review/app.png',fullPage:true});
console.log(JSON.stringify({homepageApiRequests:api.filter(x=>!x.includes('/api/agents')),errors,checks:'scenarios, providers, mobile overflow, JSON export, contact, docs, legacy redirect, app'}));
await browser.close();if(errors.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});


