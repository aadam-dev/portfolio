/**
 * Capture fresh portfolio hero/reference screenshots for the three live local apps:
 *   PrimeTijara (3001), Jireh back office (3002), The Makossa Shop (3003).
 *
 * Run from the portfolio dir with all three dev servers up:
 *   node capture-screenshots.js
 */
const puppeteer = require('puppeteer');
const path = require('path');

const OUT = path.join(__dirname, 'public/images/projects');
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 2 };

async function snap(page, url, filename, { delay = 2000 } = {}) {
  process.stdout.write(`  → ${url} … `);
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
  } catch {
    try { await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 }); } catch {}
  }
  await new Promise((r) => setTimeout(r, delay));
  await page.screenshot({ path: path.join(OUT, filename), fullPage: false });
  console.log(`✓ ${filename}`);
}

async function login(page, { base, email, password }) {
  console.log(`  Logging in at ${base}/login …`);
  await page.goto(`${base}/login`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise((r) => setTimeout(r, 1200));
  const emailEl = await page.$('input[type="email"], input[name="email"]');
  const passEl = await page.$('input[type="password"], input[name="password"]');
  if (!emailEl || !passEl) {
    console.log('  ✗ login inputs not found');
    return false;
  }
  await emailEl.click({ clickCount: 3 });
  await emailEl.type(email, { delay: 15 });
  await passEl.click({ clickCount: 3 });
  await passEl.type(password, { delay: 15 });
  const submit = await page.$('button[type="submit"]');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {}),
    submit ? submit.click() : page.keyboard.press('Enter'),
  ]);
  await new Promise((r) => setTimeout(r, 2500));
  const url = page.url();
  const ok = !/\/login/.test(url);
  console.log(ok ? `  ✓ logged in → ${url}` : `  ✗ still on login → ${url}`);
  return ok;
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport(DESKTOP);

  // ── 1. PrimeTijara (3001) ───────────────────────────────────────
  console.log('\n🏗️  PrimeTijara (3001)');
  const PT = 'http://localhost:3001';
  await snap(page, `${PT}/`, 'primetijara-landing.png', { delay: 3500 });
  await snap(page, `${PT}/products`, 'primetijara-products.png', { delay: 2500 });
  await snap(page, `${PT}/categories`, 'primetijara-categories.png', { delay: 2000 });
  if (await login(page, { base: PT, email: 'admin@primetijara.com', password: 'admin123456' })) {
    await snap(page, `${PT}/admin`, 'primetijara-admin.png', { delay: 3000 });
    await snap(page, `${PT}/admin/orders`, 'primetijara-orders.png', { delay: 2500 });
    await snap(page, `${PT}/admin/inventory`, 'primetijara-inventory.png', { delay: 2500 });
    await snap(page, `${PT}/admin/reports`, 'primetijara-reports.png', { delay: 2500 });
    await snap(page, `${PT}/pos`, 'primetijara-pos.png', { delay: 2500 });
  }

  // ── 2. Jireh Natural Foods back office (3002) ───────────────────
  console.log('\n🍛  Jireh Natural Foods (3002)');
  const JR = 'http://localhost:3002';
  await snap(page, `${JR}/`, 'jireh-landing.png', { delay: 3500 });
  // Jireh back office: set JIREH_EMAIL / JIREH_PASSWORD env vars (do not hardcode real creds)
  const jirehEmail = process.env.JIREH_EMAIL || 'prince@jireh.com';
  const jirehPassword = process.env.JIREH_PASSWORD || '';
  if (jirehPassword && await login(page, { base: JR, email: jirehEmail, password: jirehPassword })) {
    await snap(page, `${JR}/admin`, 'jireh-admin.png', { delay: 3000 });
    await snap(page, `${JR}/admin/orders`, 'jireh-orders.png', { delay: 2500 });
    await snap(page, `${JR}/admin/menu`, 'jireh-menu.png', { delay: 2500 });
    await snap(page, `${JR}/admin/inventory`, 'jireh-inventory.png', { delay: 2500 });
    await snap(page, `${JR}/admin/reports`, 'jireh-reports.png', { delay: 2500 });
    await snap(page, `${JR}/pos`, 'jireh-pos.png', { delay: 2500 });
  }

  // ── 3. The Makossa Shop (3003) — public storefront ──────────────
  console.log('\n🏪  The Makossa Shop (3003)');
  const MK = 'http://localhost:3003';
  await snap(page, `${MK}/`, 'makossa-landing.png', { delay: 3500 });
  await snap(page, `${MK}/catalog`, 'makossa-catalog.png', { delay: 2500 });
  // best-effort back office (may redirect to login)
  await snap(page, `${MK}/pos`, 'makossa-pos.png', { delay: 2000 });
  await snap(page, `${MK}/admin`, 'makossa-admin.png', { delay: 2000 });

  await browser.close();
  console.log('\n✅ Done.');
})();
