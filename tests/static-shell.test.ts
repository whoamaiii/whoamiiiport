import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { HERO_COPY } from '../src/content/siteCopy';

const indexHtml = readFileSync('index.html', 'utf8');
const normalizedIndexHtml = indexHtml.replace(/\s+/g, ' ');

describe('static HTML shell', () => {
  it('keeps the no-JS hero fallback aligned with the React hero copy', () => {
    const [firstTitleLine, secondTitleLine] = HERO_COPY.titleLines;

    expect(indexHtml).toContain(
      `<p class="app-static-kicker" lang="en">${HERO_COPY.eyebrow.toUpperCase()}</p>`,
    );
    expect(indexHtml).toContain(
      `<h1 id="app-static-title" class="app-static-title" lang="en">${firstTitleLine}<br />${secondTitleLine}.</h1>`,
    );
    expect(indexHtml).toContain(
      '<title>Whoamiii — Altered Perception / Psychedelic Digital Art</title>',
    );
    expect(indexHtml).toContain('<html lang="en">');
    expect(normalizedIndexHtml).toContain(
      `<p class="app-static-subtitle"> ${HERO_COPY.subtitle} </p>`,
    );
    expect(indexHtml).toContain(`>${HERO_COPY.cta}</a>`);
    expect(indexHtml).not.toContain('Endrede<br />Sanseflater.');
    expect(indexHtml).not.toContain('Bilder fra den andre siden av glasset.');
  });
});
