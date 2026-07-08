/**
 * Capture the full Jireh Natural Foods picture — site + restaurant back office + POS.
 * Requires restaurant-platform dev server on :3002 and JIREH_EMAIL / JIREH_PASSWORD env vars.
 * Run: JIREH_EMAIL=... JIREH_PASSWORD=... node capture-jireh.js
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:3002';
const SHOTS = path.join(__dirname, 'public/previews/jireh');
const HERO = path.join(__dirname, 'public/images/projects');
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 2 };

async function snap(page, url, file, delay = 3000) {
  process.stdout.write(`  → ${url} … `);
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
  } catch {
    try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 }); } catch {}
  }
  await new Promise((r) => setTimeout(r, delay));
  await page.screenshot({ path: file });
  console.log(`✓ ${path.basename(file)}`);
}

(async () => {
  const email = process.env.JIREH_EMAIL;
  const password = process.env.JIREH_PASSWORD;
  if (!email || !password) { console.error('Set JIREH_EMAIL and JIREH_PASSWORD'); process.exit(1); }

  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport(DESKTOP);

  console.log('\n🍛 Jireh — public site');
  await snap(page, `${BASE}/`, path.join(SHOTS, 'landing.png'), 4000);
  await snap(page, `${BASE}/`, path.join(HERO, 'jireh-live.png'), 1000);

  console.log('\n🔐 Back office login');
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1500));
  const emailEl = await page.$('input[type="email"], input[name="email"]');
  const passEl = await page.$('input[type="password"], input[name="password"]');
  if (!emailEl || !passEl) { console.log('  ✗ login inputs not found'); await browser.close(); process.exit(1); }
  await emailEl.type(email, { delay: 15 });
  await passEl.type(password, { delay: 15 });
  const submit = await page.$('button[type="submit"]');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {}),
    submit ? submit.click() : page.keyboard.press('Enter'),
  ]);
  await new Promise((r) => setTimeout(r, 3000));
  if (/\/login/.test(page.url())) { console.log(`  ✗ still on login → ${page.url()}`); await browser.close(); process.exit(1); }
  console.log(`  ✓ logged in → ${page.url()}`);

  await snap(page, `${BASE}/admin`, path.join(SHOTS, 'dashboard.png'), 4000);
  await snap(page, `${BASE}/admin/orders`, path.join(SHOTS, 'orders.png'), 3500);
  await snap(page, `${BASE}/admin/menu`, path.join(SHOTS, 'menu.png'), 3500);
  await snap(page, `${BASE}/admin/inventory`, path.join(SHOTS, 'inventory.png'), 3500);
  await snap(page, `${BASE}/admin/sales`, path.join(SHOTS, 'sales.png'), 3500);
  await snap(page, `${BASE}/pos`, path.join(SHOTS, 'pos.png'), 4000);

  await browser.close();
  console.log('\n✅ Done — shots in public/previews/jireh/');
})();
