const FIRST_GALLERY_PRELOAD_ID = 'first-gallery-image-preload';
const ABOUT_PRELOAD_ID = 'about-image-preload';

// Hardcoded (instead of derived from FEATURED_ARTWORKS) so the gallery content
// modules stay out of the main bundle. tests/image-contract.test.ts asserts it
// matches the first featured artwork's mobile gallery asset.
export const FIRST_GALLERY_PRELOAD_IMAGE_URL = '/images/video5-optical-focus-poster-560.avif';
const ABOUT_PRELOAD_IMAGE_URL = '/images/liquid-perception-560.avif';

type HashSectionId = 'work' | 'gallery' | 'about' | 'contact';

export function getSectionIdFromHash(): HashSectionId | null {
  if (typeof window === 'undefined') {
    return null;
  }

  switch (window.location.hash) {
    case '#work':
      return 'work';
    case '#gallery':
      return 'gallery';
    case '#about':
      return 'about';
    case '#contact':
      return 'contact';
    default:
      return null;
  }
}

export function isDeferredSection(id: string) {
  return id === 'about' || id === 'contact';
}

export function getInitialGallerySectionLoad() {
  const sectionId = getSectionIdFromHash();
  return sectionId !== null;
}

export function getInitialLibrarySectionLoad() {
  return getSectionIdFromHash() === 'gallery';
}

export function getInitialDeferredSectionLoad() {
  const sectionId = getSectionIdFromHash();
  return sectionId !== null && isDeferredSection(sectionId);
}

export function preloadFirstGalleryImage() {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.getElementById(FIRST_GALLERY_PRELOAD_ID)) {
    return;
  }

  const link = document.createElement('link');
  link.id = FIRST_GALLERY_PRELOAD_ID;
  link.rel = 'preload';
  link.as = 'image';
  link.href = FIRST_GALLERY_PRELOAD_IMAGE_URL;
  link.media = '(max-width: 767px)';
  link.fetchPriority = 'auto';
  document.head.append(link);
}

export function preloadAboutImage() {
  if (typeof document === 'undefined') {
    return;
  }

  if (document.getElementById(ABOUT_PRELOAD_ID)) {
    return;
  }

  const link = document.createElement('link');
  link.id = ABOUT_PRELOAD_ID;
  link.rel = 'preload';
  link.as = 'image';
  link.href = ABOUT_PRELOAD_IMAGE_URL;
  link.media = '(max-width: 767px)';
  link.fetchPriority = 'high';
  document.head.append(link);
}
