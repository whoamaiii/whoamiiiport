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
  | 'skin-terrain-video-poster'
  | 'eye-terrain'
  | 'trippy-jump'
  | 'snow-road'
  | 'fingernail-portal'
  | 'leg-prism'
  | 'drain-bloom'
  | 'open-hand-mouth'
  | 'night-bus'
  | 'handpose-mouth'
  | 'tongue-study-poster'
  | 'tattooed-mushroom-poster'
  | 'street-trip-poster'
  | 'feet-signal-poster'
  | 'corridor-signal-poster'
  | 'eye-video-poster'
  | 'nasty-food-poster'
  | 'april-portal-poster';

export type ModalImageSlug = Exclude<ImageSlug, 'liquid-perception-hero'>;

interface ArtworkImage {
  slug: ImageSlug;
  alt: string;
  galleryObjectPosition?: string;
}

type ImageFormat = 'avif' | 'webp';

export const IMAGE_MANIFEST: Record<ImageSlug, ArtworkImage> = {
  'liquid-perception-hero': {
    slug: 'liquid-perception-hero',
    alt: 'Krommaskert psykedelisk skogsportrett under en elektrisk blå cellestruktur',
  },
  'mushroom-offering': {
    slug: 'mushroom-offering',
    alt: 'Hånd som holder en sopp over myke psykedeliske hudmønstre og regnbuelys',
    galleryObjectPosition: '50% 48%',
  },
  'liquid-perception': {
    slug: 'liquid-perception',
    alt: 'Modifisert selvportrett av kunstneren med kromfragmenter i ansiktet og refraktert skogslys',
    galleryObjectPosition: '50% 44%',
  },
  'mycelial-hand': {
    slug: 'mycelial-hand',
    alt: 'Hånd med sopp og kromresin som vokser fra fingrene under en psykedelisk skogshimmel',
    galleryObjectPosition: '50% 48%',
  },
  'hand-portal-video-poster': {
    slug: 'hand-portal-video-poster',
    alt: 'Posterbilde av en hånd som åpner seg til en organisk portal i en mørk skog',
    galleryObjectPosition: '50% 52%',
  },
  'skin-terrain-video-poster': {
    slug: 'skin-terrain-video-poster',
    alt: 'Makroposter av hudlignende riller som danner et mykt topografisk terreng',
    galleryObjectPosition: '50% 50%',
  },
  'eye-terrain': {
    slug: 'eye-terrain',
    alt: 'Nært øyeportrett med opphøyde psykedeliske hudmønstre og prismelys',
    galleryObjectPosition: '50% 44%',
  },
  'trippy-jump': {
    slug: 'trippy-jump',
    alt: 'Kropp som faller fremover gjennom en mettet psykedelisk fargetunnel',
    galleryObjectPosition: '50% 48%',
  },
  'snow-road': {
    slug: 'snow-road',
    alt: 'Snøkant ved nattvei forvandlet til lysende psykedelisk tekstur',
    galleryObjectPosition: '50% 52%',
  },
  'fingernail-portal': {
    slug: 'fingernail-portal',
    alt: 'Fingernegl som krøller seg innover til en glitrende spiralportal av hud og mønster',
    galleryObjectPosition: '50% 46%',
  },
  'leg-prism': {
    slug: 'leg-prism',
    alt: 'Bare bein dekket av refrakterte regnbuemønstre på et mørkt gulv',
    galleryObjectPosition: '50% 50%',
  },
  'drain-bloom': {
    slug: 'drain-bloom',
    alt: 'Våt baderomssluk og fliser overtatt av moseaktig psykedelisk væskemønster',
    galleryObjectPosition: '50% 52%',
  },
  'open-hand-mouth': {
    slug: 'open-hand-mouth',
    alt: 'Åpen hånd forvandlet til små munner, tenner, mose og mettet regnbuelys',
    galleryObjectPosition: '50% 48%',
  },
  'night-bus': {
    slug: 'night-bus',
    alt: 'Regnvått nattbussinteriør med psykedeliske mønstre som sprer seg over setene',
    galleryObjectPosition: '50% 48%',
  },
  'handpose-mouth': {
    slug: 'handpose-mouth',
    alt: 'Håndformet munnobjekt på en tallerken med tenner, tråder og regnbuerefraksjon',
    galleryObjectPosition: '50% 46%',
  },
  'tongue-study-poster': {
    slug: 'tongue-study-poster',
    alt: 'Posterbilde for tungestudie med våt organisk psykedelisk tekstur',
    galleryObjectPosition: '50% 50%',
  },
  'tattooed-mushroom-poster': {
    slug: 'tattooed-mushroom-poster',
    alt: 'Posterbilde av en tatovert hånd som holder en sopp i skiftende psykedelisk lys',
    galleryObjectPosition: '50% 48%',
  },
  'street-trip-poster': {
    slug: 'street-trip-poster',
    alt: 'Posterbilde av en person som beveger seg gjennom vrengt gatefarge',
    galleryObjectPosition: '50% 48%',
  },
  'feet-signal-poster': {
    slug: 'feet-signal-poster',
    alt: 'Posterbilde for fotstudie med refraktert tekstur og forandret asfalt',
    galleryObjectPosition: '50% 50%',
  },
  'corridor-signal-poster': {
    slug: 'corridor-signal-poster',
    alt: 'Posterbilde for korridorvideo med strukket arkitektonisk psykedelisk lys',
    galleryObjectPosition: '50% 50%',
  },
  'eye-video-poster': {
    slug: 'eye-video-poster',
    alt: 'Posterbilde for øyevideo med nær hudtekstur og kromatisk forvrengning',
    galleryObjectPosition: '50% 44%',
  },
  'nasty-food-poster': {
    slug: 'nasty-food-poster',
    alt: 'Posterbilde for visceral matstudie med organiske psykedeliske overflater',
    galleryObjectPosition: '50% 48%',
  },
  'april-portal-poster': {
    slug: 'april-portal-poster',
    alt: 'Posterbilde for vertikal portalvideo med tett endret-sansning-tekstur',
    galleryObjectPosition: '50% 48%',
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
  suffix = '',
  format: ImageFormat = 'webp',
): string {
  return widths
    .map((w) => `/images/${slug}${suffix ? `-${suffix}` : ''}-${w}.${format} ${w}w`)
    .join(', ');
}

/**
 * Get image URL for a specific width
 */
export function getImageUrl(
  slug: ImageSlug, 
  width: number, 
  suffix = '',
  format: ImageFormat = 'webp',
): string {
  return `/images/${slug}${suffix ? `-${suffix}` : ''}-${width}.${format}`;
}

export function getAvifImageUrl(
  slug: ImageSlug,
  width: number,
  suffix = '',
): string {
  return getImageUrl(slug, width, suffix, 'avif');
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

export function getHeroAvifSrcset(slug: ImageSlug): string {
  return getSrcset(slug, HERO_WIDTHS, '', 'avif');
}

/**
 * Get gallery image srcset
 */
export function getGallerySrcset(slug: ImageSlug): string {
  return getSrcset(slug, GALLERY_WIDTHS);
}

export function getGalleryAvifSrcset(slug: ImageSlug): string {
  return getSrcset(slug, GALLERY_WIDTHS, '', 'avif');
}

/**
 * Get modal image URL (highest resolution)
 */
export function getModalImageUrl(slug: ModalImageSlug): string {
  return `/images/${slug}-modal-${MODAL_FALLBACK_WIDTH}.webp`;
}

export function getModalAvifImageUrl(slug: ModalImageSlug): string {
  return `/images/${slug}-modal-${MODAL_FALLBACK_WIDTH}.avif`;
}

/**
 * Get modal image srcset.
 */
export function getModalSrcset(slug: ModalImageSlug): string {
  return getSrcset(slug, MODAL_WIDTHS, 'modal');
}

export function getModalAvifSrcset(slug: ModalImageSlug): string {
  return getSrcset(slug, MODAL_WIDTHS, 'modal', 'avif');
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
