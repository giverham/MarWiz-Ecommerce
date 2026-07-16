import { chromium, devices } from 'playwright';
import fs from 'fs';
import path from 'path';

const baseUrl = 'http://127.0.0.1:4173/';
const deviceNames = ['iPhone 14', 'iPhone 15', 'iPhone 15 Pro', 'iPhone 15 Pro Max'];
const outDir = path.resolve('scratch', 'validation-screenshots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const results = [];
const browser = await chromium.launch();
for (const deviceName of deviceNames) {
  const device = devices[deviceName];
  if (!device) {
    results.push({ device: deviceName, error: 'device not found' });
    continue;
  }

  const context = await browser.newContext({
    ...device,
    viewport: device.viewport,
    userAgent: device.userAgent,
    isMobile: device.isMobile,
    hasTouch: device.hasTouch,
    locale: device.locale,
    javaScriptEnabled: true,
  });
  const page = await context.newPage();

  try {
    await page.goto(baseUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    const beforeScroll = await page.evaluate(() => {
      window.scrollTo({ top: 650, behavior: 'instant' });
      return window.scrollY;
    });

    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, `${deviceName.replace(/ /g, '_')}_before.png`), fullPage: false });

    await page.click('button[aria-label="Shopping bag"]');
    await page.waitForSelector('.cart-drawer-container', { state: 'visible', timeout: 5000 });
    await page.waitForTimeout(500);

    const openScroll = await page.evaluate(() => window.scrollY);
    const bodyStyleDuringOpen = await page.evaluate(() => ({
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
      bodyWidth: document.body.style.width,
    }));

    await page.screenshot({ path: path.join(outDir, `${deviceName.replace(/ /g, '_')}_open.png`), fullPage: false });

    await page.click('.cart-drawer-backdrop');
    await page.waitForSelector('.cart-drawer-container', { state: 'hidden', timeout: 5000 });
    await page.waitForTimeout(500);

    const afterScroll = await page.evaluate(() => window.scrollY);
    const bodyStyleAfterClose = await page.evaluate(() => ({
      bodyOverflow: document.body.style.overflow,
      htmlOverflow: document.documentElement.style.overflow,
      bodyPosition: document.body.style.position,
      bodyTop: document.body.style.top,
      bodyWidth: document.body.style.width,
    }));

    results.push({
      device: deviceName,
      beforeScroll,
      openScroll,
      afterScroll,
      diff: afterScroll - beforeScroll,
      bodyStyleDuringOpen,
      bodyStyleAfterClose,
      screenshotBefore: `${deviceName.replace(/ /g, '_')}_before.png`,
      screenshotOpen: `${deviceName.replace(/ /g, '_')}_open.png`,
    });
  } catch (error) {
    results.push({ device: deviceName, error: error?.message || String(error) });
  } finally {
    await context.close();
  }
}
await browser.close();
const output = { url: baseUrl, results };
const outputPath = path.resolve('scratch', 'validateCartDrawerPlaywright-results.json');
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
console.log(JSON.stringify(output, null, 2));
console.log(`screenshots saved to ${outDir}`);
console.log(`results saved to ${outputPath}`);
