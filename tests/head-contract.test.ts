import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
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

  it('keeps the referenced social preview asset in the public runtime bundle', () => {
    expect(existsSync(resolve('public/social-preview.png'))).toBe(true);
  });

  it('keeps the static preview shell aligned with the featured gallery', () => {
    const figcaptions = [...indexHtml.matchAll(/<figcaption>([^<]+)<\/figcaption>/g)].map(
      (match) => match[1],
    );

    expect(figcaptions).toEqual(FEATURED_ARTWORKS.map(({ artwork }) => artwork.title.primary));

    const [firstFeaturedArtwork, ...lowerPriorityArtworks] = FEATURED_ARTWORKS.map(
      ({ artwork }) => artwork,
    );
    const firstThumbnailUrl = getImageUrl(firstFeaturedArtwork.imageSlug, 480);
    const firstThumbnailAvifUrl = getAvifImageUrl(firstFeaturedArtwork.imageSlug, 480);

    expect(indexHtml).toContain(`src="${firstThumbnailUrl}"`);
    expect(indexHtml).toContain(`srcset="${firstThumbnailAvifUrl}"`);

    for (const { artwork } of FEATURED_ARTWORKS) {
      const thumbnailUrl = getImageUrl(artwork.imageSlug, 480);
      const thumbnailAvifUrl = getAvifImageUrl(artwork.imageSlug, 480);
      expect(existsSync(resolve('public', thumbnailUrl.replace(/^\/+/, '')))).toBe(true);
      expect(existsSync(resolve('public', thumbnailAvifUrl.replace(/^\/+/, '')))).toBe(true);
    }

    for (const artwork of lowerPriorityArtworks) {
      expect(indexHtml).not.toContain(`src="${getImageUrl(artwork.imageSlug, 480)}"`);
      expect(indexHtml).not.toContain(`srcset="${getAvifImageUrl(artwork.imageSlug, 480)}"`);
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
