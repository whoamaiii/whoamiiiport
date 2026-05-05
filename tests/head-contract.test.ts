import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const indexHtml = readFileSync(resolve('index.html'), 'utf8');

describe('document head contract', () => {
  it('declares canonical and social preview metadata for the live domain', () => {
    expect(indexHtml).toContain('<link rel="canonical" href="https://whoamiii.art/" />');
    expect(indexHtml).toContain(
      '<meta property="og:image" content="https://whoamiii.art/social-preview.png" />',
    );
    expect(indexHtml).toContain('<meta name="twitter:card" content="summary_large_image" />');
    expect(indexHtml).toContain(
      '<meta name="twitter:image" content="https://whoamiii.art/social-preview.png" />',
    );
  });

  it('keeps the referenced social preview asset in the public runtime bundle', () => {
    expect(existsSync(resolve('public/social-preview.png'))).toBe(true);
  });

  it('keeps a valid static robots.txt instead of serving the app shell to crawlers', () => {
    const robotsTxt = readFileSync(resolve('public/robots.txt'), 'utf8');

    expect(robotsTxt).toBe('User-agent: *\nAllow: /\n');
  });
});
