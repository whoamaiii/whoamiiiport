import { IMAGE_MANIFEST, type ArtworkImageManifestEntry } from '../content/imageManifest';

export { IMAGE_MANIFEST };

type ImageSlug = keyof typeof IMAGE_MANIFEST;
export type ModalImageSlug = Exclude<ImageSlug, 'liquid-perception-hero'>;

type ArtworkImage = ArtworkImageManifestEntry & {
  readonly slug: ImageSlug;
};

type ImageFormat = 'avif' | 'webp';

export const HERO_WIDTHS = [720, 960, 1440] as const;
export const HERO_FALLBACK_WIDTH = HERO_WIDTHS[HERO_WIDTHS.length - 1];
export const GALLERY_WIDTHS = [480, 560, 800, 1024, 1200] as const;
export const MODAL_WIDTHS = [800, 1200, 1600] as const;
export const MODAL_FALLBACK_WIDTH = MODAL_WIDTHS[MODAL_WIDTHS.length - 1];

function getSrcset(
  slug: ImageSlug,
  widths: readonly number[],
  suffix = '',
  format: ImageFormat = 'webp',
): string {
  return widths
    .map((width) => `/images/${slug}${suffix ? `-${suffix}` : ''}-${width}.${format} ${width}w`)
    .join(', ');
}

export function getImageUrl(
  slug: ImageSlug,
  width: number,
  suffix = '',
  format: ImageFormat = 'webp',
): string {
  return `/images/${slug}${suffix ? `-${suffix}` : ''}-${width}.${format}`;
}

export function getAvifImageUrl(slug: ImageSlug, width: number, suffix = ''): string {
  return getImageUrl(slug, width, suffix, 'avif');
}

export function getGalleryImageUrl(slug: ImageSlug): string {
  return getImageUrl(slug, 800);
}

export function getHeroSrcset(slug: ImageSlug): string {
  return getSrcset(slug, HERO_WIDTHS);
}

export function getHeroAvifSrcset(slug: ImageSlug): string {
  return getSrcset(slug, HERO_WIDTHS, '', 'avif');
}

export function getGallerySrcset(slug: ImageSlug): string {
  return getSrcset(slug, GALLERY_WIDTHS);
}

export function getGalleryAvifSrcset(slug: ImageSlug): string {
  return getSrcset(slug, GALLERY_WIDTHS, '', 'avif');
}

export function getModalImageUrl(slug: ModalImageSlug): string {
  return `/images/${slug}-modal-${MODAL_FALLBACK_WIDTH}.webp`;
}

export function getModalAvifImageUrl(slug: ModalImageSlug): string {
  return `/images/${slug}-modal-${MODAL_FALLBACK_WIDTH}.avif`;
}

export function getModalSrcset(slug: ModalImageSlug): string {
  return getSrcset(slug, MODAL_WIDTHS, 'modal');
}

export function getModalAvifSrcset(slug: ModalImageSlug): string {
  return getSrcset(slug, MODAL_WIDTHS, 'modal', 'avif');
}

export function getHeroSizes(): string {
  return '100vw';
}

export function getGallerySizes(): string {
  return '(max-width: 767px) calc(100vw - 4.125rem), (max-width: 1200px) 50vw, 33vw';
}

export function getAboutSizes(): string {
  return '(max-width: 768px) calc(100vw - 3rem), (max-width: 1280px) calc(50vw - 5rem), 32rem';
}

export function getImageMetadata(slug: ImageSlug): ArtworkImage {
  const metadata = IMAGE_MANIFEST[slug];

  if ('galleryObjectPosition' in metadata) {
    return {
      slug,
      alt: metadata.alt,
      galleryObjectPosition: metadata.galleryObjectPosition,
    };
  }

  return {
    slug,
    alt: metadata.alt,
  };
}
