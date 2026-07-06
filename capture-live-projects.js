/**
 * Capture real screenshots of the LIVE deployed projects (public screens).
 * Output: public/previews/<projectId>/<screen>.png
 * Run: node capture-live-projects.js
 */
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 2 };

// projectId → { base, screens: { screenId: path } }
const TARGETS = {
  chalesocks: {
    base: 'https://chalesocks.vercel.app',
    screens: { landing: '/', story: '/#our-story' },
  },
  jireh: {
    base: 'https://jirehnaturalfoods.vercel.app',
    screens: { landing: '/' },
  },
  madinabasketball: {
    base: 'https://madinabball.vercel.app',
    screens: { landing: '/', court: '/court', events: '/events' },
  },
  pronaj: {
    base: 'https://pronaj.vercel.app',
    screens: { landing: '/', sectors: '/sectors', contact: '/contact' },
  },
  ladyangel: {
    base: 'https://lady-angel.vercel.app',
    screens: { landing: '/', membership: '/membership', portfolio: '/portfolio' },
  },
  anisfoods: {
    base: 'https://aniseatery.netlify.app',
    screens: { landing: '/' },
  },
  magilo: {
    base: 'https://magiloartcollege.com',
    screens: { landing: '/', services: '/services', college: '/college' },
  },
  rockmotion: {
    base: 'https://rockmotion.vercel.app',
    screens: { landing: '/', inventory: '/inventory', process: '/process' },
  },
};

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport(DESKTOP);

  for (const [id, cfg] of Object.entries(TARGETS)) {
    const dir = path.join(__dirname, 'public/previews', id);
    fs.mkdirSync(dir, { recursive: true });
    console.log(`\n📸 ${id} (${cfg.base})`);
    for (const [screen, p] of Object.entries(cfg.screens)) {
      const url = cfg.base + p;
      process.stdout.write(`  → ${url} … `);
      try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 45000 });
        await new Promise((r) => setTimeout(r, 3500));
        // settle lazy/scroll-triggered content just below the fold, then return
        await page.evaluate(() => window.scrollTo(0, 300));
        await new Promise((r) => setTimeout(r, 600));
        await page.evaluate(() => window.scrollTo(0, 0));
        await new Promise((r) => setTimeout(r, 800));
        await page.screenshot({ path: path.join(dir, `${screen}.png`) });
        console.log(`✓ ${screen}.png`);
      } catch (e) {
        console.log(`✗ ${e.message.split('\n')[0]}`);
      }
    }
  }

  await browser.close();
  console.log('\n✅ Live capture done.');
})();
