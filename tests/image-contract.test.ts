import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  GALLERY_WIDTHS,
  HERO_WIDTHS,
  IMAGE_MANIFEST,
  MODAL_FALLBACK_WIDTH,
  MODAL_WIDTHS,
  getGallerySrcset,
  getHeroSrcset,
  getImageMetadata,
  getImageUrl,
  getModalImageUrl,
  getModalSrcset,
} from '../src/utils/images';
import { ferdigcopVideoArtwork } from '../src/components/artworkData';
import { FEATURED_ARTWORKS } from '../src/content/featuredArtworks';
import {
  WORKFLOW_IMAGE_WIDTHS,
  WORKFLOW_STEPS,
  getWorkflowImageUrl,
  getWorkflowSrcset,
} from '../src/content/workflowSteps';
import { GALLERY_VIDEOS } from '../src/utils/media';

const generatedImagePath = (urlPath: string) =>
  resolve('public', urlPath.replace(/^\/+/, ''));

const splitSrcset = (srcset: string) =>
  srcset.split(',').map((entry) => entry.trim().split(' ')[0]).filter(Boolean);

describe('image contract', () => {
  it('keeps the hero asset contract explicit and resolvable', () => {
    expect(HERO_WIDTHS).toEqual([720, 960, 1440]);

    const srcset = getHeroSrcset('liquid-perception-hero');
    const urls = splitSrcset(srcset);
    expect(urls).toEqual([
      '/images/liquid-perception-hero-720.webp',
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

  it('keeps workflow carousel steps mapped to optimized local images', () => {
    expect(WORKFLOW_STEPS).toHaveLength(15);
    expect(WORKFLOW_IMAGE_WIDTHS).toEqual([480, 800, 1200]);

    for (let index = 0; index < WORKFLOW_STEPS.length; index += 1) {
      const stepNumber = index + 1;
      expect(WORKFLOW_STEPS[index].title.length).toBeGreaterThan(0);
      expect(WORKFLOW_STEPS[index].description.length).toBeGreaterThan(0);
      expect(WORKFLOW_STEPS[index].detailSections.length).toBeGreaterThanOrEqual(2);
      WORKFLOW_STEPS[index].detailSections.forEach((section) => {
        expect(section.heading.length).toBeGreaterThan(0);
        expect(section.body.length).toBeGreaterThan(90);
      });
      expect(WORKFLOW_STEPS[index].alt.length).toBeGreaterThan(0);
      expect(getWorkflowSrcset(stepNumber)).toBe(
        WORKFLOW_IMAGE_WIDTHS
          .map((width) => `/images/workflow/workflow-step-${String(stepNumber).padStart(2, '0')}-${width}.webp ${width}w`)
          .join(', '),
      );

      for (const width of WORKFLOW_IMAGE_WIDTHS) {
        expect(existsSync(generatedImagePath(getWorkflowImageUrl(stepNumber, width)))).toBe(true);
      }
    }
  });

  it('keeps the about portrait on the same generated local asset pipeline', () => {
    const metadata = getImageMetadata('about-portrait');
    expect(metadata.alt).toMatch(/portrait of the artist/i);

    const srcset = getGallerySrcset('about-portrait');
    const urls = splitSrcset(srcset);
    expect(urls).toEqual([
      '/images/about-portrait-480.webp',
      '/images/about-portrait-560.webp',
      '/images/about-portrait-800.webp',
      '/images/about-portrait-1024.webp',
      '/images/about-portrait-1200.webp',
    ]);

    urls.forEach((url) => expect(existsSync(generatedImagePath(url))).toBe(true));
    expect(existsSync(generatedImagePath(getModalImageUrl('about-portrait')))).toBe(true);
  });

  it('keeps modal URLs aligned with generated files for every modal-capable artwork', () => {
    expect(GALLERY_WIDTHS).toEqual([480, 560, 800, 1024, 1200]);
    expect(MODAL_WIDTHS).toEqual([800, 1200, 1600]);
    expect(MODAL_FALLBACK_WIDTH).toBe(1600);

    const modalSlugs = [
      'liquid-perception',
      'psychedelic-bathroom-portrait',
      'psychedelic-bathroom-scream',
      'ferdigcop-video-poster',
      'about-portrait',
    ] as const;

    for (const slug of modalSlugs) {
      const modalUrl = getModalImageUrl(slug);
      const modalSrcset = getModalSrcset(slug);
      const modalSrcsetUrls = splitSrcset(modalSrcset);

      expect(modalUrl).toBe(`/images/${slug}-modal-${MODAL_FALLBACK_WIDTH}.webp`);
      expect(modalSrcset).toBe(
        MODAL_WIDTHS.map((width) => `/images/${slug}-modal-${width}.webp ${width}w`).join(', '),
      );
      expect(existsSync(generatedImagePath(modalUrl))).toBe(true);
      expect(existsSync(generatedImagePath(getImageUrl(slug, 1024)))).toBe(true);
      expect(existsSync(generatedImagePath(getImageUrl(slug, 1200)))).toBe(true);
      expect(readFileSync(generatedImagePath(modalUrl)).byteLength).toBeGreaterThan(0);
      modalSrcsetUrls.forEach((url) => {
        expect(existsSync(generatedImagePath(url))).toBe(true);
        expect(readFileSync(generatedImagePath(url)).byteLength).toBeGreaterThan(0);
      });
    }
  });
});
