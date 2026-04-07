import { chromium } from 'playwright';
import fs from 'fs';

const screenshotDir = '/home/arkrly/Work/notetakingapp/frontend/audit/screenshots';
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

const header = Buffer.from(JSON.stringify({alg: 'HS256', typ: 'JWT'})).toString('base64');
const exp = Math.floor(Date.now() / 1000) + 3600;
const payload = Buffer.from(JSON.stringify({sub: 'testuser', username: 'testuser', role: 'ROLE_USER', email: 'test@example.com', exp})).toString('base64');
const dummyToken = `${header}.${payload}.dummy_signature`;

const routes = [
  { path: '/', name: 'home', auth: false },
  { path: '/login', name: 'login', auth: false },
  { path: '/register', name: 'register', auth: false },
  { path: '/notes', name: 'dashboard', auth: true },
  { path: '/profile', name: 'profile', auth: true }
];

async function main() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });
  
  console.log('Creating contexts...');
  const desktopContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko)'
  });

  for (const route of routes) {
    console.log(`Processing ${route.path}...`);
    const page = await desktopContext.newPage();
    if (route.auth) {
      await page.goto('http://localhost:4200/login');
      await page.evaluate(({token}) => {
        localStorage.setItem('note_app_token', token);
        localStorage.setItem('username', 'testuser');
        localStorage.setItem('role', 'ROLE_USER');
      }, {token: dummyToken});
    }
    try {
      await page.goto(`http://localhost:4200${route.path}`, { waitUntil: 'load', timeout: 15000 });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `${screenshotDir}/${route.name}-desktop.png`, fullPage: false });
    } catch(e) {
      console.error(`Error on desktop ${route.path}:`, e.message);
    }
    await page.close();

    const mobilePage = await mobileContext.newPage();
    if (route.auth) {
      await mobilePage.goto('http://localhost:4200/login');
      await mobilePage.evaluate(({token}) => {
        localStorage.setItem('note_app_token', token);
        localStorage.setItem('username', 'testuser');
        localStorage.setItem('role', 'ROLE_USER');
      }, {token: dummyToken});
    }
    try {
      await mobilePage.goto(`http://localhost:4200${route.path}`, { waitUntil: 'load', timeout: 15000 });
      await mobilePage.waitForTimeout(2000);
      await mobilePage.screenshot({ path: `${screenshotDir}/${route.name}-mobile.png`, fullPage: false });
    } catch(e) {
      console.error(`Error on mobile ${route.path}:`, e.message);
    }
    await mobilePage.close();
  }

  console.log('Processing modal...');
  const dialogPage = await desktopContext.newPage();
  try {
    await dialogPage.goto('http://localhost:4200/login');
    await dialogPage.evaluate(({token}) => {
      localStorage.setItem('note_app_token', token);
      localStorage.setItem('username', 'testuser');
      localStorage.setItem('role', 'ROLE_USER');
    }, {token: dummyToken});
    await dialogPage.goto('http://localhost:4200/notes', { waitUntil: 'load', timeout: 15000 });
    await dialogPage.waitForTimeout(2000);
    const button = dialogPage.locator('button:has-text("New Note")').first();
    if (await button.isVisible()) {
      await button.click();
      await dialogPage.waitForTimeout(1500);
      await dialogPage.screenshot({ path: `${screenshotDir}/modal-desktop.png`, fullPage: false });
    }
  } catch (e) {
    console.error('Could not open modal:', e.message);
  }
  await dialogPage.close();

  await browser.close();
  console.log('Done!');
}

main().catch(e => {
  console.error("Fatal error:", e);
  process.exit(1);
});
