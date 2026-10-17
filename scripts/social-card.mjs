import puppeteer from 'puppeteer-core';
import { writeFileSync, readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Génère public/social-card.png (1200×630) — l'image des previews Open Graph.
// À relancer si le hero change (nom, titre, accroche, stats) :
//   nix develop --command node scripts/social-card.mjs

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = resolve(__dirname, '..');

// Node 22 lit resume.ts nativement — la source de vérité reste unique
const { resume } = await import(resolve(root, 'src/data/resume.ts'));
const { name, title, subtitle, availability, website, stats } = resume.basics;

// Polices embarquées en base64 : le rendu ne dépend d'aucune requête réseau
const face = (family, pkg, file, weight) => {
  const b64 = readFileSync(resolve(root, 'node_modules/@fontsource', pkg, 'files', file)).toString('base64');
  return `@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};` +
         `src:url(data:font/woff2;base64,${b64}) format('woff2')}`;
};

const fonts = [
  face('IBM Plex Sans', 'ibm-plex-sans', 'ibm-plex-sans-latin-400-normal.woff2', 400),
  face('IBM Plex Sans', 'ibm-plex-sans', 'ibm-plex-sans-latin-600-normal.woff2', 600),
  face('IBM Plex Sans', 'ibm-plex-sans', 'ibm-plex-sans-latin-700-normal.woff2', 700),
  face('JetBrains Mono', 'jetbrains-mono', 'jetbrains-mono-latin-400-normal.woff2', 400),
  face('JetBrains Mono', 'jetbrains-mono', 'jetbrains-mono-latin-600-normal.woff2', 600),
].join('');

const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8" />
<style>
  ${fonts}
  /* Mêmes tokens que src/styles/global.css */
  :root {
    --bg: #1e1e2e; --surface: #181825; --border: #313244; --border-strong: #45475a;
    --text: #cdd6f4; --text-body: #bac2de; --text-muted: #a6adc8;
    --accent: #cba6f7; --ok: #a6e3a1;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: var(--bg); color: var(--text);
    font-family: 'IBM Plex Sans', sans-serif; -webkit-font-smoothing: antialiased;
  }
  .inner { height: 100%; padding: 72px 80px; display: flex; flex-direction: column; justify-content: center; gap: 26px; }
  .avail {
    align-self: flex-start; display: inline-flex; align-items: center; gap: 12px;
    padding: 10px 18px; border: 1px solid var(--border-strong); border-radius: 999px;
    font-size: 20px; color: var(--ok);
  }
  .avail .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--ok); }
  h1 { font-size: 84px; font-weight: 700; letter-spacing: -.03em; line-height: 1; }
  .subtitle { font-family: 'JetBrains Mono', monospace; font-size: 28px; color: var(--accent); }
  .stats { display: flex; gap: 1px; background: var(--border); border: 1px solid var(--border); border-radius: 14px; overflow: hidden; margin-top: 6px; }
  .cell { flex: 1; background: var(--surface); padding: 20px 22px; display: flex; flex-direction: column; gap: 4px; }
  .value { font-family: 'JetBrains Mono', monospace; font-size: 30px; font-weight: 600; white-space: nowrap; }
  .cell.accent .value { color: var(--accent); }
  .label { font-size: 16px; line-height: 1.35; color: var(--text-muted); }
  .url { font-family: 'JetBrains Mono', monospace; font-size: 20px; color: var(--text-muted); }
</style></head>
<body>
  <div class="inner">
    <p class="avail"><span class="dot"></span>${availability}</p>
    <h1>${name}</h1>
    <p class="subtitle">${title} &#183; ${subtitle}</p>
    <div class="stats">
      ${stats.map(s => `<div class="cell${s.accent ? ' accent' : ''}">
        <span class="value">${s.value}</span><span class="label">${s.label}</span></div>`).join('')}
    </div>
    <p class="url">${website.replace('https://', '')}</p>
  </div>
</body></html>`;

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH ?? '/usr/bin/google-chrome',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  headless: true,
});

const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30_000 });
await page.evaluateHandle('document.fonts.ready');

const outPath = resolve(root, 'public/social-card.png');
writeFileSync(outPath, await page.screenshot({ type: 'png' }));

await browser.close();
console.log('Social card générée :', outPath);
