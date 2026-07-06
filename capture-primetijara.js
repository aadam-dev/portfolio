/**
 * Capture the full PrimeTijara picture — storefront + Odoo-style back office + POS.
 * Requires PrimeHub dev server on :3001. Run: node capture-primetijara.js
 * Screen shots → public/previews/primehub/<screen>.png (used by PreviewRouter real-shot mode)
 * Landing hero → public/images/projects/primetijara-landing.png
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const BASE = 'http://localhost:3001';
const SHOTS = path.join(__dirname, 'public/previews/primehub');
const HERO = path.join(__dirname, 'public/images/projects');
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 2 };

async function snap(page, url, file, { delay = 2500, fullPage = false } = {}) {
  process.stdout.write(`  → ${url} … `);
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
  } catch {
    try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 }); } catch {}
  }
  await new Promise((r) => setTimeout(r, delay));
  await page.screenshot({ path: file, fullPage });
  console.log(`✓ ${path.basename(file)}`);
}

async function login(page, email, password) {
  console.log(`  Logging in as ${email} …`);
  await page.goto(`${BASE}/login`, { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1500));
  const emailEl = await page.$('input[type="email"], input[name="email"]');
  const passEl = await page.$('input[type="password"], input[name="password"]');
  if (!emailEl || !passEl) { console.log('  ✗ login inputs not found'); return false; }
  await emailEl.click({ clickCount: 3 });
  await emailEl.type(email, { delay: 15 });
  await passEl.click({ clickCount: 3 });
  await passEl.type(password, { delay: 15 });
  const submit = await page.$('button[type="submit"]');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {}),
    submit ? submit.click() : page.keyboard.press('Enter'),
  ]);
  await new Promise((r) => setTimeout(r, 3000));
  const ok = !/\/login/.test(page.url());
  console.log(ok ? `  ✓ logged in → ${page.url()}` : `  ✗ still on login`);
  return ok;
}

(async () => {
  fs.mkdirSync(SHOTS, { recursive: true });
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport(DESKTOP);

  console.log('\n🏗️  PrimeTijara — storefront');
  await snap(page, `${BASE}/`, path.join(SHOTS, 'landing.png'), { delay: 4000 });
  await snap(page, `${BASE}/`, path.join(HERO, 'primetijara-landing.png'), { delay: 1000 });
  await snap(page, `${BASE}/products`, path.join(SHOTS, 'products.png'), { delay: 3500 });
  await snap(page, `${BASE}/categories`, path.join(SHOTS, 'categories.png'), { delay: 3000 });

  console.log('\n🔐  Back office');
  if (await login(page, process.env.PT_EMAIL || 'admin@primetijara.com', process.env.PT_PASSWORD || 'admin123456')) {
    await snap(page, `${BASE}/admin`, path.join(SHOTS, 'admin.png'), { delay: 4000 });
    await snap(page, `${BASE}/admin/orders`, path.join(SHOTS, 'orders.png'), { delay: 3500 });
    await snap(page, `${BASE}/admin/inventory`, path.join(SHOTS, 'inventory.png'), { delay: 3500 });
    await snap(page, `${BASE}/admin/reports`, path.join(SHOTS, 'reports.png'), { delay: 3500 });
    await snap(page, `${BASE}/pos`, path.join(SHOTS, 'pos.png'), { delay: 3500 });
  } else {
    console.log('  !! back-office captures skipped');
  }

  await browser.close();
  console.log('\n✅ Done — shots in public/previews/primehub/');
})();
