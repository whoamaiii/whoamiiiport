import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import { FEATURED_ARTWORKS } from '../src/content/featuredArtworks';
import { getAvifImageUrl, getImageUrl } from '../src/utils/images';

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

  it('keeps correctly sized social and install assets in the public runtime bundle', async () => {
    expect(existsSync(resolve('public/social-preview.png'))).toBe(true);
    expect(await sharp(resolve('public/social-preview.png')).metadata()).toMatchObject({
      width: 1280,
      height: 720,
    });
    expect(await sharp(resolve('public/apple-touch-icon.png')).metadata()).toMatchObject({
      width: 180,
      height: 180,
    });
  });

  it('keeps the static preview shell aligned with the featured gallery', () => {
    const figcaptions = [...indexHtml.matchAll(/<figcaption>([^<]+)<\/figcaption>/g)].map(
      (match) => match[1],
    );

    expect(figcaptions).toEqual(FEATURED_ARTWORKS.map(({ artwork }) => artwork.title.primary));
    expect(indexHtml.match(/<noscript>/g)).toHaveLength(FEATURED_ARTWORKS.length);

    for (const { artwork } of FEATURED_ARTWORKS) {
      const thumbnailUrl = getImageUrl(artwork.imageSlug, 480);
      const thumbnailAvifUrl = getAvifImageUrl(artwork.imageSlug, 480);

      expect(indexHtml).toContain(`src="${thumbnailUrl}"`);
      expect(indexHtml).toContain(`srcset="${thumbnailAvifUrl}"`);
      expect(existsSync(resolve('public', thumbnailUrl.replace(/^\/+/, '')))).toBe(true);
      expect(existsSync(resolve('public', thumbnailAvifUrl.replace(/^\/+/, '')))).toBe(true);
    }
  });

  it('keeps a valid static robots.txt instead of serving the app shell to crawlers', () => {
    const robotsTxt = readFileSync(resolve('public/robots.txt'), 'utf8');

    expect(robotsTxt).toBe(
      'User-agent: *\nAllow: /\n\nSitemap: https://whoamiii.art/sitemap.xml\n',
    );
  });

  it('keeps GitHub Pages publishing files reproducible from public assets', () => {
    expect(readFileSync(resolve('public/CNAME'), 'utf8')).toBe('whoamiii.art\n');
    expect(existsSync(resolve('public/.nojekyll'))).toBe(true);
    expect(readdirSync(resolve('public'))).toContain('.nojekyll');

    const sitemapXml = readFileSync(resolve('public/sitemap.xml'), 'utf8');
    expect(sitemapXml).toContain('<loc>https://whoamiii.art/</loc>');
    expect(sitemapXml).toContain('<changefreq>monthly</changefreq>');
  });
});
