import puppeteer from 'puppeteer-core';
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Génère public/social-card.png (1200×630) — l'image des previews Open Graph.
// À relancer si le nom, le titre ou les badges du Hero changent :
//   nix develop --command node scripts/social-card.mjs

const __dirname = dirname(fileURLToPath(import.meta.url));
const root      = resolve(__dirname, '..');

// Node 22 déstructure les types TS nativement — resume.ts reste la source de vérité
const { resume } = await import(resolve(root, 'src/data/resume.ts'));
const { name, title, yearsExp, location, website } = resume.basics;

// Même liste que src/components/Hero.astro
const badges = ['28 ans Linux', 'Terraform', 'NixOS', 'AWS', 'C / Rust'];

const html = `<!DOCTYPE html>
<html lang="fr"><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  /* Catppuccin Mocha — cf. src/styles/global.css */
  :root {
    --bg: #1e1e2e; --s0: #313244; --s1: #45475a;
    --text: #cdd6f4; --sub0: #a6adc8; --mauve: #cba6f7; --green: #a6e3a1;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px; height: 630px; overflow: hidden; position: relative;
    background: var(--bg); color: var(--text);
    font-family: 'Inter', sans-serif; -webkit-font-smoothing: antialiased;
  }
  .grid {
    position: absolute; inset: 0;
    background-image:
      linear-gradient(to right, rgba(203,166,247,.055) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(203,166,247,.055) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: radial-gradient(ellipse 90% 80% at 30% 35%, #000 30%, transparent 78%);
  }
  .glow {
    position: absolute; width: 760px; height: 760px; left: -220px; top: -340px;
    background: radial-gradient(circle, rgba(203,166,247,.16), transparent 62%);
  }
  .inner { position: relative; padding: 76px 80px; height: 100%;
           display: flex; flex-direction: column; justify-content: center; }
  .eyebrow {
    font-family: 'JetBrains Mono', monospace; font-size: 19px; color: var(--mauve);
    display: flex; align-items: center; gap: 12px; letter-spacing: .06em; margin-bottom: 22px;
  }
  .eyebrow .line { width: 38px; height: 1px; background: var(--mauve); }
  h1 { font-size: 92px; font-weight: 800; letter-spacing: -.04em; line-height: 1; margin-bottom: 20px; }
  .prompt-line {
    font-family: 'JetBrains Mono', monospace; font-size: 29px; font-weight: 500;
    display: flex; align-items: center; gap: 11px; margin-bottom: 38px; color: var(--mauve);
  }
  .prompt-line .chevron { color: var(--green); }
  .prompt-line .cursor { width: 15px; height: 30px; background: var(--mauve); border-radius: 2px; }
  .badges { display: flex; gap: 12px; margin-bottom: 44px; }
  .badge {
    font-family: 'JetBrains Mono', monospace; font-size: 16px; font-weight: 500;
    padding: 9px 19px; border: 1px solid rgba(203,166,247,.3); border-radius: 999px;
    background: rgba(203,166,247,.08); color: var(--mauve);
  }
  .meta {
    font-family: 'JetBrains Mono', monospace; font-size: 18px; color: var(--sub0);
    display: flex; align-items: center; gap: 16px;
  }
  .meta .sep { color: var(--s1); }
  .meta .url { color: var(--text); }
  .rule { position: absolute; left: 0; right: 0; bottom: 0; height: 5px;
          background: linear-gradient(90deg, var(--mauve), #89b4fa, #94e2d5, var(--green)); }
</style></head>
<body>
  <div class="grid"></div>
  <div class="glow"></div>
  <div class="inner">
    <p class="eyebrow"><span class="line"></span> ~/sysadmin --senior</p>
    <h1>${name}</h1>
    <div class="prompt-line">
      <span class="chevron">&#10095;</span><span>${title}</span><span class="cursor"></span>
    </div>
    <div class="badges">${badges.map(b => `<span class="badge">${b}</span>`).join('')}</div>
    <div class="meta">
      <span class="url">${website.replace('https://', '')}</span>
      <span class="sep">&#183;</span><span>${yearsExp} ans d'expérience</span>
      <span class="sep">&#183;</span><span>${location} · Remote</span>
    </div>
  </div>
  <div class="rule"></div>
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
