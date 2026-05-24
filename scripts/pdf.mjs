import puppeteer from 'puppeteer-core';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const chromePath =
  process.env.CHROME_PATH ||
  '/usr/bin/google-chrome';

const browser = await puppeteer.launch({
  executablePath: chromePath,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

// Emulate print media BEFORE loading so @media print CSS applies from the start
await page.emulateMediaType('print');

const indexPath = `file://${resolve(root, 'dist/index.html')}`;
await page.goto(indexPath, { waitUntil: 'networkidle0', timeout: 30_000 });

// Wait for web fonts (Google Fonts, Nerd Fonts) to finish loading
await page.evaluateHandle('document.fonts.ready');

const outPath = resolve(root, 'dist/CV – Guillaume Friloux.pdf');
await page.pdf({
  path: outPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '1.5cm', right: '1.5cm', bottom: '1.5cm', left: '1.5cm' },
  tagged: true,
});

await browser.close();
console.log('PDF généré :', outPath);
