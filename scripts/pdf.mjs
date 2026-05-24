import puppeteer from 'puppeteer-core';
import { createServer } from 'http';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root     = resolve(__dirname, '..');
const distDir  = resolve(root, 'dist');

// Minimal static server so absolute asset paths (/_astro/...) resolve correctly
const MIMES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css',
  '.js':   'application/javascript',
  '.json': 'application/json',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.woff2':'font/woff2',
  '.woff': 'font/woff',
  '.ttf':  'font/ttf',
  '.pdf':  'application/pdf',
};

const server = createServer((req, res) => {
  const url      = req.url.split('?')[0];
  const filePath = resolve(distDir, url === '/' ? 'index.html' : `.${url}`);

  if (!existsSync(filePath)) {
    res.writeHead(404); res.end(); return;
  }
  res.writeHead(200, { 'Content-Type': MIMES[extname(filePath)] ?? 'text/plain' });
  res.end(readFileSync(filePath));
});

const PORT = 4322;
await new Promise(r => server.listen(PORT, '127.0.0.1', r));
console.log(`Serving dist/ on http://localhost:${PORT}`);

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});

const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 900 });

// Set print media BEFORE loading so GSAP and animations see it immediately
await page.emulateMediaType('print');
await page.goto(`http://localhost:${PORT}`, { waitUntil: 'networkidle0', timeout: 30_000 });

// Wait for web fonts (Google Fonts, Nerd Fonts CDN)
await page.evaluateHandle('document.fonts.ready');

const outPath = resolve(root, 'dist/CV – Guillaume Friloux.pdf');

const heights = await page.evaluate(() => {
    const r = (sel) => {
      const el = document.querySelector(sel);
      return el ? Math.round(el.getBoundingClientRect().height) : null;
    };
    return { hero: r('#hero'), xac: r('#xac'), page: document.documentElement.scrollHeight };
  });
  console.log('Heights (px @96dpi):', heights);

await page.pdf({
  path: outPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '1.5cm', right: '1.5cm', bottom: '1.5cm', left: '1.5cm' },
  tagged: true,
});

await browser.close();
server.close();
console.log('PDF généré :', outPath);
