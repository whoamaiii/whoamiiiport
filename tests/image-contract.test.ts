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
import { ferdigcopVideoArtwork } from '../src/components/artworkData';
import { FEATURED_ARTWORKS } from '../src/content/featuredArtworks';
import { GALLERY_VIDEOS } from '../src/utils/media';

const generatedImagePath = (urlPath: string) =>
  resolve('public', urlPath.replace(/^\/+/, ''));

const splitSrcset = (srcset: string) =>
  srcset.split(',').map((entry) => entry.trim().split(' ')[0]).filter(Boolean);

describe('image contract', () => {
  it('keeps the hero asset contract explicit and resolvable', () => {
    expect(HERO_WIDTHS).toEqual([960, 1440]);

    const srcset = getHeroSrcset('liquid-perception-hero');
    const urls = splitSrcset(srcset);
    expect(urls).toEqual([
      '/images/liquid-perception-hero-960.webp',
      '/images/liquid-perception-hero-1440.webp',
    ]);

    for (const url of urls) {
      expect(existsSync(generatedImagePath(url))).toBe(true);
    }
  });

  it('maps the current featured artworks to generated gallery assets', () => {
    const artworks = FEATURED_ARTWORKS.map(({ artwork }) => artwork);

    expect(artworks).toHaveLength(4);
    expect(new Set(artworks.map((artwork) => artwork.imageSlug)).size).toBe(4);
    expect(FEATURED_ARTWORKS.map(({ id }) => id)).toEqual([
      'liquid-perception',
      'psychedelic-bathroom-portrait',
      'psychedelic-bathroom-scream',
      'ferdigcop-video',
    ]);
    expect(artworks.map((artwork) => artwork.imageSlug)).toEqual([
      'liquid-perception',
      'psychedelic-bathroom-portrait',
      'psychedelic-bathroom-scream',
      'ferdigcop-video-poster',
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

    expect(getImageMetadata('liquid-perception').galleryObjectPosition).toBe('52% 54%');
    expect(getImageMetadata('psychedelic-bathroom-portrait').galleryObjectPosition).toBe('40% 50%');
    expect(getImageMetadata('psychedelic-bathroom-scream').galleryObjectPosition).toBe('46% 50%');
  });

  it('keeps the active image manifest free of retired gallery slugs', () => {
    expect(Object.keys(IMAGE_MANIFEST)).toEqual([
      'liquid-perception-hero',
      'liquid-perception',
      'psychedelic-bathroom-portrait',
      'psychedelic-bathroom-scream',
      'ferdigcop-video-poster',
      'about-portrait',
    ]);
  });

  it('keeps gallery video sources explicit and resolvable', () => {
    expect(GALLERY_VIDEOS).toEqual({
      ferdigcop: {
        src: '/videos/ferdigcop-gallery.mp4',
        type: 'video/mp4',
        posterSlug: 'ferdigcop-video-poster',
      },
    });
    expect(ferdigcopVideoArtwork.videoSrc).toBe(GALLERY_VIDEOS.ferdigcop.src);
    expect(existsSync(resolve('public', GALLERY_VIDEOS.ferdigcop.src.replace(/^\/+/, '')))).toBe(true);
    expect(existsSync(generatedImagePath(getModalImageUrl(GALLERY_VIDEOS.ferdigcop.posterSlug)))).toBe(true);
  });

  it('keeps the about portrait on the same generated local asset pipeline', () => {
    const metadata = getImageMetadata('about-portrait');
    expect(metadata.alt).toMatch(/portrait of the artist/i);

    const srcset = getGallerySrcset('about-portrait');
    const urls = splitSrcset(srcset);
    expect(urls).toEqual([
      '/images/about-portrait-480.webp',
      '/images/about-portrait-800.webp',
      '/images/about-portrait-1200.webp',
    ]);

    urls.forEach((url) => expect(existsSync(generatedImagePath(url))).toBe(true));
    expect(existsSync(generatedImagePath(getModalImageUrl('about-portrait')))).toBe(true);
  });

  it('keeps modal URLs aligned with generated files for every featured artwork', () => {
    expect(GALLERY_WIDTHS).toEqual([480, 800, 1200]);

    const modalExpectations = [
      ['liquid-perception', 1600],
      ['psychedelic-bathroom-portrait', 1600],
      ['psychedelic-bathroom-scream', 1600],
      ['ferdigcop-video-poster', 1600],
    ] as const;

    for (const [slug, width] of modalExpectations) {
      const modalUrl = getModalImageUrl(slug);
      const modalSrcset = getModalSrcset(slug);

      expect(modalUrl).toBe(`/images/${slug}-modal-${width}.webp`);
      expect(modalSrcset).toBe(`/images/${slug}-modal-${width}.webp ${width}w`);
      expect(existsSync(generatedImagePath(modalUrl))).toBe(true);
      expect(existsSync(generatedImagePath(getImageUrl(slug, 1200)))).toBe(true);
      expect(readFileSync(generatedImagePath(modalUrl)).byteLength).toBeGreaterThan(0);
    }
  });
});
