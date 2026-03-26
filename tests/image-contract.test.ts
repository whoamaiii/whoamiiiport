import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  GALLERY_WIDTHS,
  HERO_WIDTHS,
  IMAGE_MANIFEST,
  getGallerySrcset,
  getHeroSrcset,
  getImageMetadata,
  getImageUrl,
  getModalImageUrl,
  getModalSrcset,
} from '../src/utils/images';
import {
  denSomSerTilbake,
  derSnoenHolderTiden,
  derVerdenGlir,
  detAttendeIndre,
} from '../src/components/artworkData';

const generatedImagePath = (urlPath: string) =>
  resolve('public', urlPath.replace(/^\/+/, ''));

const splitSrcset = (srcset: string) =>
  srcset.split(',').map((entry) => entry.trim().split(' ')[0]).filter(Boolean);

describe('image contract', () => {
  it('keeps the hero asset contract explicit and resolvable', () => {
    expect(HERO_WIDTHS).toEqual([960, 1440, 1920]);
    const srcset = getHeroSrcset('joetrip2');
    const urls = splitSrcset(srcset);
    expect(urls).toEqual([
      '/images/joetrip2-960.webp',
      '/images/joetrip2-1440.webp',
      '/images/joetrip2-1920.webp',
    ]);

    for (const url of urls) {
      expect(existsSync(generatedImagePath(url))).toBe(true);
    }
  });

  it('maps the four local artworks to the generated gallery assets', () => {
    const artworks = [
      derSnoenHolderTiden,
      detAttendeIndre,
      derVerdenGlir,
      denSomSerTilbake,
    ];

    expect(artworks).toHaveLength(4);
    expect(new Set(artworks.map((artwork) => artwork.imageSlug)).size).toBe(4);
    expect(artworks.map((artwork) => artwork.imageSlug)).toEqual([
      'jennysno',
      'dimensiontripp',
      'loongdrive',
      'eye-figure',
    ]);

    for (const artwork of artworks) {
      const metadata = getImageMetadata(artwork.imageSlug);
      expect(metadata.slug).toBe(artwork.imageSlug);
      expect(metadata.alt.length).toBeGreaterThan(0);

      const srcset = getGallerySrcset(artwork.imageSlug);
      const urls = splitSrcset(srcset);
      expect(urls.length).toBeGreaterThan(0);
      urls.forEach((url) => expect(existsSync(generatedImagePath(url))).toBe(true));
    }
  });

  it('keeps modal URLs aligned with generated files and the loongdrive fallback', () => {
    expect(GALLERY_WIDTHS).toEqual([480, 800, 1200]);

    const modalSlugs = ['jennysno', 'dimensiontripp', 'eye-figure'] as const;

    for (const slug of modalSlugs) {
      const modalUrl = getModalImageUrl(slug);
      expect(existsSync(generatedImagePath(modalUrl))).toBe(true);
    }

    const loongdriveModalUrl = getModalImageUrl('loongdrive');
    const loongdriveSrcset = getModalSrcset('loongdrive');
    expect(loongdriveModalUrl).toBe('/images/loongdrive-modal-1200.webp');
    expect(loongdriveSrcset).toBe('/images/loongdrive-modal-1200.webp 1200w');
    expect(existsSync(generatedImagePath(loongdriveModalUrl))).toBe(true);
    expect(existsSync(generatedImagePath(getImageUrl('loongdrive', 1200)))).toBe(true);

    expect(readFileSync(generatedImagePath(loongdriveModalUrl)).byteLength).toBeGreaterThan(0);
  });
});
