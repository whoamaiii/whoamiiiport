/**
 * Image Utilities
 * Provides slug-based image URL generation and srcset construction
 * for responsive images across the portfolio.
 */

type ImageSlug =
  | 'liquid-perception-hero'
  | 'liquid-perception'
  | 'psychedelic-bathroom-portrait'
  | 'psychedelic-bathroom-scream'
  | 'ferdigcop-video-poster'
  | 'about-portrait';

export type ModalImageSlug = Exclude<ImageSlug, 'liquid-perception-hero'>;

interface ArtworkImage {
  slug: ImageSlug;
  alt: string;
  galleryObjectPosition?: string;
}

export const IMAGE_MANIFEST: Record<ImageSlug, ArtworkImage> = {
  'liquid-perception-hero': {
    slug: 'liquid-perception-hero',
    alt: 'Liquid psychedelic forest portrait with chrome face distortion and red nails',
  },
  'liquid-perception': {
    slug: 'liquid-perception',
    alt: 'Surreal hooded forest portrait with chrome face fragments, red nails, and an electric cellular sky',
    galleryObjectPosition: '52% 54%',
  },
  'psychedelic-bathroom-portrait': {
    slug: 'psychedelic-bathroom-portrait',
    alt: 'Dark psychedelic bathroom portrait with rainbow distortion and patterned tiled wall',
    galleryObjectPosition: '40% 50%',
  },
  'psychedelic-bathroom-scream': {
    slug: 'psychedelic-bathroom-scream',
    alt: 'Psychedelic bathroom portrait with screaming figure covered in rainbow contour patterns',
    galleryObjectPosition: '46% 50%',
  },
  'ferdigcop-video-poster': {
    slug: 'ferdigcop-video-poster',
    alt: 'Poster frame from Ferdigcop video artwork'
  },
  'about-portrait': {
    slug: 'about-portrait',
    alt: 'Portrait of the artist in a hooded sweatshirt'
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
