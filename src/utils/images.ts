/**
 * Image Utilities
 * Provides slug-based image URL generation and srcset construction
 * for responsive images across the portfolio.
 */

export type ImageSlug =
  | 'joetrip2'
  | 'jennysno'
  | 'dimensiontripp'
  | 'loongdrive'
  | 'eye-figure'
  | 'about-portrait';

export interface ArtworkImage {
  slug: ImageSlug;
  alt: string;
}

export const IMAGE_MANIFEST: Record<ImageSlug, ArtworkImage> = {
  joetrip2: { 
    slug: 'joetrip2', 
    alt: 'Hero artwork - psychedelic portrait' 
  },
  jennysno: { 
    slug: 'jennysno', 
    alt: 'Where Snow Holds Time - Der snøen holder tiden' 
  },
  dimensiontripp: { 
    slug: 'dimensiontripp', 
    alt: 'The Eighth Interior - Det åttende indre' 
  },
  loongdrive: { 
    slug: 'loongdrive', 
    alt: 'Where the World Glides - Der verden glir gjennom sansene' 
  },
  'eye-figure': { 
    slug: 'eye-figure', 
    alt: 'The One Who Looks Back - Den som ser tilbake' 
  },
  'about-portrait': {
    slug: 'about-portrait',
    alt: 'Portrait of the artist in a hooded sweatshirt'
  },
};

// Available widths by profile
export const HERO_WIDTHS = [960, 1440, 1920] as const;
export const GALLERY_WIDTHS = [480, 800, 1200] as const;

const MODAL_FALLBACK_WIDTH_BY_SLUG: Record<ImageSlug, number> = {
  joetrip2: 1600,
  jennysno: 1600,
  dimensiontripp: 1600,
  loongdrive: 1200,
  'eye-figure': 1600,
  'about-portrait': 1600,
};

/**
 * Generate srcset string for responsive images
 */
export function getSrcset(
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
export function getModalImageUrl(slug: ImageSlug): string {
  const fallbackWidth = MODAL_FALLBACK_WIDTH_BY_SLUG[slug];
  return `/images/${slug}-modal-${fallbackWidth}.webp`;
}

/**
 * Get modal image srcset.
 */
export function getModalSrcset(slug: ImageSlug): string {
  const fallbackWidth = MODAL_FALLBACK_WIDTH_BY_SLUG[slug];
  return `${getModalImageUrl(slug)} ${fallbackWidth}w`;
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
  return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
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
