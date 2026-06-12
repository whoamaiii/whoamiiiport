/**
 * Image Utilities
 * Provides slug-based image URL generation and srcset construction
 * for responsive images across the portfolio.
 */

type ImageSlug =
  | 'liquid-perception-hero'
  | 'mushroom-offering'
  | 'liquid-perception'
  | 'mycelial-hand'
  | 'hand-portal-video-poster'
  | 'skin-terrain-video-poster';

export type ModalImageSlug = Exclude<ImageSlug, 'liquid-perception-hero'>;

interface ArtworkImage {
  slug: ImageSlug;
  alt: string;
  galleryObjectPosition?: string;
}

export const IMAGE_MANIFEST: Record<ImageSlug, ArtworkImage> = {
  'liquid-perception-hero': {
    slug: 'liquid-perception-hero',
    alt: 'Chrome-masked psychedelic forest portrait beneath an electric blue cellular sky',
  },
  'mushroom-offering': {
    slug: 'mushroom-offering',
    alt: 'Hand holding a mushroom over soft psychedelic skin patterns and rainbow light',
    galleryObjectPosition: '50% 48%',
  },
  'liquid-perception': {
    slug: 'liquid-perception',
    alt: 'Modified selfie portrait of the artist with chrome face fragments and refracted psychedelic forest light',
    galleryObjectPosition: '50% 44%',
  },
  'mycelial-hand': {
    slug: 'mycelial-hand',
    alt: 'Hand with mushrooms and chrome resin growing from the fingers under a psychedelic forest sky',
    galleryObjectPosition: '50% 48%',
  },
  'hand-portal-video-poster': {
    slug: 'hand-portal-video-poster',
    alt: 'Poster frame of a hand opening into a nested organic portal in a dark forest',
    galleryObjectPosition: '50% 52%',
  },
  'skin-terrain-video-poster': {
    slug: 'skin-terrain-video-poster',
    alt: 'Macro video poster of skin-like ridges forming a soft topographic terrain',
    galleryObjectPosition: '50% 50%',
  },
};

// Available widths by profile
export const HERO_WIDTHS = [720, 960, 1440] as const;
export const HERO_FALLBACK_WIDTH = HERO_WIDTHS[HERO_WIDTHS.length - 1];
export const GALLERY_WIDTHS = [480, 560, 800, 1024, 1200] as const;
export const MODAL_WIDTHS = [800, 1200, 1600] as const;
export const MODAL_FALLBACK_WIDTH = MODAL_WIDTHS[MODAL_WIDTHS.length - 1];

/**
 * Generate srcset string for responsive images
 */
function getSrcset(
  slug: ImageSlug, 
  widths: readonly number[], 
  suffix = ''
): string {
  return widths
    .map((w) => `/images/${slug}${suffix ? `-${suffix}` : ''}-${w}.webp ${w}w`)
    .join(', ');
}

/**
 * Get image URL for a specific width
 */
export function getImageUrl(
  slug: ImageSlug, 
  width: number, 
  suffix = ''
): string {
  return `/images/${slug}${suffix ? `-${suffix}` : ''}-${width}.webp`;
}

/**
 * Get the canonical gallery fallback image URL.
 */
export function getGalleryImageUrl(slug: ImageSlug): string {
  return getImageUrl(slug, 800);
}

/**
 * Get hero image srcset
 */
export function getHeroSrcset(slug: ImageSlug): string {
  return getSrcset(slug, HERO_WIDTHS);
}

/**
 * Get gallery image srcset
 */
export function getGallerySrcset(slug: ImageSlug): string {
  return getSrcset(slug, GALLERY_WIDTHS);
}

/**
 * Get modal image URL (highest resolution)
 */
export function getModalImageUrl(slug: ModalImageSlug): string {
  return `/images/${slug}-modal-${MODAL_FALLBACK_WIDTH}.webp`;
}

/**
 * Get modal image srcset.
 */
export function getModalSrcset(slug: ModalImageSlug): string {
  return getSrcset(slug, MODAL_WIDTHS, 'modal');
}

/**
 * Get appropriate sizes attribute for hero images
 */
export function getHeroSizes(): string {
  return '100vw';
}

/**
 * Get appropriate sizes attribute for gallery images
 */
export function getGallerySizes(): string {
  return '(max-width: 767px) calc(100vw - 4.125rem), (max-width: 1200px) 50vw, 33vw';
}

/**
 * Get appropriate sizes attribute for the About portrait.
 */
export function getAboutSizes(): string {
  return '(max-width: 768px) calc(100vw - 3rem), (max-width: 1280px) calc(50vw - 5rem), 32rem';
}

/**
 * Get image metadata from manifest
 */
export function getImageMetadata(slug: ImageSlug): ArtworkImage {
  return IMAGE_MANIFEST[slug];
}
