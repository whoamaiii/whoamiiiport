import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { describe, expect, it } from 'vitest';
import {
  GALLERY_WIDTHS,
  HERO_WIDTHS,
  IMAGE_MANIFEST,
  MODAL_FALLBACK_WIDTH,
  MODAL_WIDTHS,
  getAvifImageUrl,
  getGalleryAvifSrcset,
  getGallerySrcset,
  getHeroAvifSrcset,
  getHeroSrcset,
  getImageMetadata,
  getImageUrl,
  getModalAvifImageUrl,
  getModalAvifSrcset,
  getModalImageUrl,
  getModalSrcset,
  type ModalImageSlug,
} from '../src/utils/images';
import { FEATURED_ARTWORKS } from '../src/content/featuredArtworks';
import { LIBRARY_ARTWORKS } from '../src/content/libraryArtworks';
import { PORTFOLIO_GROUPS } from '../src/content/portfolioGroups';
import { FIRST_GALLERY_PRELOAD_IMAGE_URL } from '../src/App';
import { ABOUT_SLUG } from '../src/sections/AboutSection';
import {
  WORKFLOW_IMAGE_FILE_WIDTHS,
  WORKFLOW_STEPS,
  getWorkflowImageDescriptorWidth,
  getWorkflowImageDimensions,
  getWorkflowImageUrl,
  getWorkflowSrcset,
} from '../src/content/workflowSteps';
import { GALLERY_VIDEOS } from '../src/utils/media';
import { PROCESS_VIDEO } from '../src/components/WorkflowProcessCard';

const generatedImagePath = (urlPath: string) =>
  resolve('public', urlPath.replace(/^\/+/, ''));

const performanceScriptPath = resolve('scripts/measure-load-performance.mjs');
const workflowImagesDir = resolve('public/images/workflow');

const workflowImageFilename = (stepNumber: number, width: number) =>
  `workflow-step-${String(stepNumber).padStart(2, '0')}-${width}.webp`;

const splitSrcset = (srcset: string) =>
  srcset.split(',').map((entry) => entry.trim().split(' ')[0]).filter(Boolean);

const splitSrcsetEntries = (srcset: string) =>
  srcset.split(',').map((entry) => {
    const [url, descriptor] = entry.trim().split(/\s+/);
    return {
      url,
      descriptorWidth: Number(descriptor.replace(/w$/, '')),
    };
  });

const expectedArtworkNoteHeadings = [
  'Mening for meg',
  'Hvordan det er laget',
  'Materiale og overflate',
] as const;

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

    const avifSrcset = getHeroAvifSrcset('liquid-perception-hero');
    expect(splitSrcset(avifSrcset)).toEqual([
      '/images/liquid-perception-hero-720.avif',
      '/images/liquid-perception-hero-960.avif',
      '/images/liquid-perception-hero-1440.avif',
    ]);
    splitSrcset(avifSrcset).forEach((url) => {
      expect(existsSync(generatedImagePath(url))).toBe(true);
    });
  });

  it('maps the current featured artworks to generated gallery assets', () => {
    const artworks = FEATURED_ARTWORKS.map(({ artwork }) => artwork);

    expect(artworks).toHaveLength(4);
    expect(new Set(artworks.map((artwork) => artwork.imageSlug)).size).toBe(4);
    expect(FEATURED_ARTWORKS.map(({ id }) => id)).toEqual([
      'video5-optical-focus',
      'kaaffe-texture-motion',
      'living-floor',
      'mushroom-offering',
    ]);
    expect(artworks.map((artwork) => artwork.imageSlug)).toEqual([
      'video5-optical-focus-poster',
      'kaaffe-texture-motion-poster',
      'living-floor',
      'mushroom-offering',
    ]);

    for (const artwork of artworks) {
      const metadata = getImageMetadata(artwork.imageSlug);
      expect(metadata.slug).toBe(artwork.imageSlug);
      expect(metadata.alt.length).toBeGreaterThan(0);

      const srcset = getGallerySrcset(artwork.imageSlug);
      const urls = splitSrcset(srcset);
      expect(urls.length).toBeGreaterThan(0);
      urls.forEach((url) => expect(existsSync(generatedImagePath(url))).toBe(true));
      splitSrcset(getGalleryAvifSrcset(artwork.imageSlug)).forEach((url) => {
        expect(existsSync(generatedImagePath(url))).toBe(true);
      });
    }

    expect(getImageMetadata('video5-optical-focus-poster').galleryObjectPosition).toBe('50% 50%');
    expect(getImageMetadata('kaaffe-texture-motion-poster').galleryObjectPosition).toBe('50% 50%');
    expect(getImageMetadata('living-floor').galleryObjectPosition).toBe('50% 50%');
    expect(getImageMetadata('mushroom-offering').galleryObjectPosition).toBe('50% 48%');
  });

  it('keeps the active image manifest aligned to the curated gallery slugs', () => {
    const librarySlugs = LIBRARY_ARTWORKS.map(({ artwork }) => artwork.imageSlug);

    expect(Object.keys(IMAGE_MANIFEST)).toEqual([
      'liquid-perception-hero',
      'liquid-perception',
      ...librarySlugs,
    ]);
    expect(Object.keys(IMAGE_MANIFEST)).not.toEqual(expect.arrayContaining([
      'hand-portal-video-poster',
      'skin-terrain-video-poster',
      'trippy-jump',
      'snow-road',
      'street-trip-poster',
      'feet-signal-poster',
      'eye-video-poster',
      'nasty-food-poster',
      'april-portal-poster',
    ]));
  });

  it('preloads the first featured artwork mobile gallery asset from the app shell', () => {
    const [firstFeatured] = FEATURED_ARTWORKS;

    expect(FIRST_GALLERY_PRELOAD_IMAGE_URL).toBe(
      getAvifImageUrl(firstFeatured.artwork.imageSlug, 560),
    );
    expect(existsSync(generatedImagePath(FIRST_GALLERY_PRELOAD_IMAGE_URL))).toBe(true);
  });

  it('keeps the mobile performance guardrail pointed at current featured artwork slugs', () => {
    const script = readFileSync(performanceScriptPath, 'utf8');
    const lowerPriorityFeaturedSlugs = FEATURED_ARTWORKS
      .slice(1)
      .map(({ artwork }) => artwork.imageSlug);

    expect(script).not.toMatch(/psychedelic-bathroom|ferdigcop-video-poster/);
    lowerPriorityFeaturedSlugs.forEach((slug) => {
      expect(script).toContain(slug);
    });
  });

  it('keeps gallery video sources explicit and resolvable', () => {
    expect(Object.keys(GALLERY_VIDEOS)).toEqual([
      'corridorWallTouch',
      'corridorMaster',
      'video5OpticalFocus',
      'kaaffeTextureMotion',
      'cupObjectStudy',
      'cupCoffee',
      'rugField',
      'livingFloor',
      'magicHandMotion',
      'tattooedMushroom',
      'mushroomMotion',
      'bodySinkCompanion',
      'ecologicalHandStudy',
      'facePerformance',
      'tongueStudy',
      'darkFigureSequence',
      'eyeHoodStudy',
      'barkMaterial',
      'voidSpiral',
    ]);
    expect(GALLERY_VIDEOS.corridorMaster).toEqual({
      src: '/videos/corridor-master.mp4',
      type: 'video/mp4',
      posterSlug: 'corridor-master-poster',
    });
    expect(GALLERY_VIDEOS.video5OpticalFocus).toEqual({
      src: '/videos/video5-optical-focus.mp4',
      type: 'video/mp4',
      posterSlug: 'video5-optical-focus-poster',
    });
    expect(GALLERY_VIDEOS.kaaffeTextureMotion).toEqual({
      src: '/videos/kaaffe-texture-motion.mp4',
      type: 'video/mp4',
      posterSlug: 'kaaffe-texture-motion-poster',
    });
    expect(GALLERY_VIDEOS.tongueStudy).toEqual({
      src: '/videos/tongue-study.mp4',
      type: 'video/mp4',
      posterSlug: 'tongue-study-poster',
    });
    expect(GALLERY_VIDEOS.voidSpiral).toEqual({
      src: '/videos/void-spiral.mp4',
      type: 'video/mp4',
      posterSlug: 'void-spiral-poster',
    });
    expect(new Set(Object.values(GALLERY_VIDEOS).map((video) => video.src)).size).toBe(19);
    expect(new Set(Object.values(GALLERY_VIDEOS).map((video) => video.posterSlug)).size).toBe(19);

    Object.values(GALLERY_VIDEOS).forEach((video) => {
      expect(existsSync(resolve('public', video.src.replace(/^\/+/, '')))).toBe(true);
      expect(existsSync(generatedImagePath(getModalImageUrl(video.posterSlug)))).toBe(true);
    });
  });

  it('maps the full library to generated local media assets', () => {
    expect(LIBRARY_ARTWORKS).toHaveLength(48);
    expect(new Set(LIBRARY_ARTWORKS.map(({ id }) => id)).size).toBe(48);
    expect(PORTFOLIO_GROUPS.map((group) => group.key)).toEqual([
      'liminal-rooms',
      'domestic-ecosystems',
      'hand-portals',
      'sink-organisms',
      'tongue-terrain',
      'threshold-studies',
    ]);
    PORTFOLIO_GROUPS.forEach((group) => {
      expect(LIBRARY_ARTWORKS.some((entry) => entry.group === group.key)).toBe(true);
    });

    for (const { artwork } of LIBRARY_ARTWORKS) {
      const metadata = getImageMetadata(artwork.imageSlug);
      expect(metadata.slug).toBe(artwork.imageSlug);
      expect(metadata.alt.length).toBeGreaterThan(0);

      splitSrcset(getGallerySrcset(artwork.imageSlug)).forEach((url) => {
        expect(existsSync(generatedImagePath(url))).toBe(true);
      });
      splitSrcset(getGalleryAvifSrcset(artwork.imageSlug)).forEach((url) => {
        expect(existsSync(generatedImagePath(url))).toBe(true);
      });

      expect(existsSync(generatedImagePath(getModalImageUrl(artwork.imageSlug)))).toBe(true);
      expect(existsSync(generatedImagePath(getModalAvifImageUrl(artwork.imageSlug)))).toBe(true);

      if (artwork.videoSrc) {
        expect(existsSync(resolve('public', artwork.videoSrc.replace(/^\/+/, '')))).toBe(true);
      }
    }
  });

  it('keeps every curated artwork modal note substantial and process-oriented', () => {
    for (const { id, artwork } of LIBRARY_ARTWORKS) {
      expect(artwork.sections, id).toHaveLength(4);

      const [intro, meaning, process, surface] = artwork.sections;
      if (!intro || !meaning || !process || !surface) {
        continue;
      }

      expect(intro.heading, id).toBeUndefined();
      expect([meaning.heading, process.heading, surface.heading], id).toEqual(
        expectedArtworkNoteHeadings,
      );

      for (const section of artwork.sections) {
        expect(section.body.length, `${id}: ${section.heading ?? 'intro'}`).toBeGreaterThan(90);
      }

      expect(meaning.body.toLowerCase(), id).toContain('for meg');
      expect(process.body.toLowerCase(), id).toContain('jeg');
    }
  });

  it('keeps the process video source and poster explicit and resolvable', async () => {
    const processVideoPath = resolve('public', PROCESS_VIDEO.src.replace(/^\/+/, ''));
    const processPosterPath = resolve('public', PROCESS_VIDEO.poster.replace(/^\/+/, ''));

    expect(PROCESS_VIDEO).toEqual({
      src: '/videos/cup-coffee-process.mp4',
      poster: '/images/cup-coffee-process-poster.webp',
      type: 'video/mp4',
      width: 720,
      height: 1160,
      durationLabel: '15 sek',
    });
    expect(existsSync(processVideoPath)).toBe(true);
    expect(existsSync(processPosterPath)).toBe(true);
    expect(readFileSync(processVideoPath).byteLength).toBeGreaterThan(0);

    const posterMetadata = await sharp(processPosterPath).metadata();
    expect(posterMetadata.width).toBe(PROCESS_VIDEO.width);
    expect(posterMetadata.height).toBe(PROCESS_VIDEO.height);
  });

  it('keeps workflow carousel steps mapped to manually managed runtime assets', async () => {
    expect(WORKFLOW_STEPS).toHaveLength(15);
    expect(WORKFLOW_IMAGE_FILE_WIDTHS).toEqual([480, 800, 1200]);

    const expectedFilenames = WORKFLOW_STEPS
      .flatMap((_, index) => {
        const stepNumber = index + 1;
        return WORKFLOW_IMAGE_FILE_WIDTHS.map((fileWidth) => workflowImageFilename(stepNumber, fileWidth));
      })
      .sort();

    expect(existsSync(workflowImagesDir)).toBe(true);

    const actualFilenames = readdirSync(workflowImagesDir).sort();

    expect(actualFilenames).toEqual(expectedFilenames);

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
      const expectedSrcsetEntries = WORKFLOW_IMAGE_FILE_WIDTHS.map((fileWidth) => ({
        url: `/images/workflow/${workflowImageFilename(stepNumber, fileWidth)}`,
        descriptorWidth: getWorkflowImageDescriptorWidth(stepNumber, fileWidth),
      }));
      expect(splitSrcsetEntries(getWorkflowSrcset(stepNumber))).toEqual(expectedSrcsetEntries);

      // Lock the intrinsic width/height hints against the real decoded pixels so
      // an edit to the dimension arrays cannot silently introduce layout shift.
      const declaredDimensions = getWorkflowImageDimensions(stepNumber);
      const largeImagePath = resolve(workflowImagesDir, workflowImageFilename(stepNumber, 1200));
      const largeMetadata = await sharp(largeImagePath).metadata();
      expect(largeMetadata.width).toBe(declaredDimensions.width);
      expect(largeMetadata.height).toBe(declaredDimensions.height);

      for (const fileWidth of WORKFLOW_IMAGE_FILE_WIDTHS) {
        const filename = workflowImageFilename(stepNumber, fileWidth);
        const imagePath = resolve(workflowImagesDir, filename);
        const descriptorWidth = getWorkflowImageDescriptorWidth(stepNumber, fileWidth);

        expect(getWorkflowImageUrl(stepNumber, fileWidth)).toBe(`/images/workflow/${filename}`);
        expect(existsSync(imagePath)).toBe(true);
        expect(readFileSync(imagePath).byteLength).toBeGreaterThan(0);
        expect((await sharp(imagePath).metadata()).width).toBe(descriptorWidth);
      }
    }
  });

  it('keeps the about portrait on the same generated local asset pipeline', () => {
    expect(ABOUT_SLUG).toBe('liquid-perception');

    const metadata = getImageMetadata(ABOUT_SLUG);
    expect(metadata.alt).toMatch(/modifisert selvportrett av kunstneren/i);

    const srcset = getGallerySrcset(ABOUT_SLUG);
    const urls = splitSrcset(srcset);
    expect(urls).toEqual([
      '/images/liquid-perception-480.webp',
      '/images/liquid-perception-560.webp',
      '/images/liquid-perception-800.webp',
      '/images/liquid-perception-1024.webp',
      '/images/liquid-perception-1200.webp',
    ]);

    urls.forEach((url) => expect(existsSync(generatedImagePath(url))).toBe(true));
    splitSrcset(getGalleryAvifSrcset(ABOUT_SLUG)).forEach((url) => {
      expect(existsSync(generatedImagePath(url))).toBe(true);
    });
    expect(existsSync(generatedImagePath(getModalImageUrl(ABOUT_SLUG)))).toBe(true);
  });

  it('keeps modal URLs aligned with generated files for every modal-capable artwork', () => {
    expect(GALLERY_WIDTHS).toEqual([480, 560, 800, 1024, 1200]);
    expect(MODAL_WIDTHS).toEqual([800, 1200, 1600]);
    expect(MODAL_FALLBACK_WIDTH).toBe(1600);

    const modalSlugs = [
      'liquid-perception',
      ...LIBRARY_ARTWORKS.map(({ artwork }) => artwork.imageSlug),
    ] satisfies readonly ModalImageSlug[];

    for (const slug of modalSlugs) {
      const modalUrl = getModalImageUrl(slug);
      const modalSrcset = getModalSrcset(slug);
      const modalSrcsetUrls = splitSrcset(modalSrcset);
      const modalAvifUrl = getModalAvifImageUrl(slug);
      const modalAvifSrcset = getModalAvifSrcset(slug);

      expect(modalUrl).toBe(`/images/${slug}-modal-${MODAL_FALLBACK_WIDTH}.webp`);
      expect(modalSrcset).toBe(
        MODAL_WIDTHS.map((width) => `/images/${slug}-modal-${width}.webp ${width}w`).join(', '),
      );
      expect(modalAvifUrl).toBe(`/images/${slug}-modal-${MODAL_FALLBACK_WIDTH}.avif`);
      expect(modalAvifSrcset).toBe(
        MODAL_WIDTHS.map((width) => `/images/${slug}-modal-${width}.avif ${width}w`).join(', '),
      );
      expect(existsSync(generatedImagePath(modalUrl))).toBe(true);
      expect(existsSync(generatedImagePath(modalAvifUrl))).toBe(true);
      expect(existsSync(generatedImagePath(getImageUrl(slug, 1024)))).toBe(true);
      expect(existsSync(generatedImagePath(getAvifImageUrl(slug, 1024)))).toBe(true);
      expect(existsSync(generatedImagePath(getImageUrl(slug, 1200)))).toBe(true);
      expect(existsSync(generatedImagePath(getAvifImageUrl(slug, 1200)))).toBe(true);
      expect(readFileSync(generatedImagePath(modalUrl)).byteLength).toBeGreaterThan(0);
      expect(readFileSync(generatedImagePath(modalAvifUrl)).byteLength).toBeGreaterThan(0);
      modalSrcsetUrls.forEach((url) => {
        expect(existsSync(generatedImagePath(url))).toBe(true);
        expect(readFileSync(generatedImagePath(url)).byteLength).toBeGreaterThan(0);
      });
      splitSrcset(modalAvifSrcset).forEach((url) => {
        expect(existsSync(generatedImagePath(url))).toBe(true);
        expect(readFileSync(generatedImagePath(url)).byteLength).toBeGreaterThan(0);
      });
    }
  });
});
