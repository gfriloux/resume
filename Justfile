default: dev

install:
    npm install

dev:
    @[ -x node_modules/.bin/astro ] || npm install
    npm run dev

build:
    @[ -x node_modules/.bin/astro ] || npm install
    npm run build

preview: build
    npm run preview

pdf: build
    node scripts/pdf.mjs

# Régénère public/social-card.png (image des previews Open Graph)
social-card:
    node scripts/social-card.mjs

clean:
    rm -rf dist node_modules/.cache

shell:
    nix develop
