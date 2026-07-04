const FIRST_GALLERY_PRELOAD_ID = 'first-gallery-image-preload';
const ABOUT_PRELOAD_ID = 'about-image-preload';

// Hardcoded (instead of derived from FEATURED_ARTWORKS) so the gallery content
// modules stay out of the main bundle. tests/image-contract.test.ts asserts it
// matches the first featured artwork's mobile gallery asset.
export const FIRST_GALLERY_PRELOAD_IMAGE_URL = '/images/video5-optical-focus-poster-560.avif';
const ABOUT_PRELOAD_IMAGE_URL = '/images/liquid-perception-560.avif';

type HashSectionId = 'work' | 'gallery' | 'about' | 'contact';

const GALLERY_GROUP_TARGET_PREFIX = 'gallery-';

function isHashSectionId(id: string): id is HashSectionId {
  return id === 'work' || id === 'gallery' || id === 'about' || id === 'contact';
}

// Top-level section that must be mounted before `targetId` exists in the DOM.
// Gallery group anchors (e.g. "gallery-hand-portals") live inside the library
// section, so they resolve to 'gallery'.
export function getSectionIdForTarget(targetId: string): HashSectionId | null {
  if (isHashSectionId(targetId)) {
    return targetId;
  }

  if (targetId.length > GALLERY_GROUP_TARGET_PREFIX.length
    && targetId.startsWith(GALLERY_GROUP_TARGET_PREFIX)) {
    return 'gallery';
  }

  return null;
}

// Element id the current hash should navigate to, or null for unknown hashes.
export function getNavigationTargetFromHash(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const targetId = window.location.hash.slice(1);
  return getSectionIdForTarget(targetId) ? targetId : null;
}

export function getSectionIdFromHash(): HashSectionId | null {
  const targetId = getNavigationTargetFromHash();
  return targetId === null ? null : getSectionIdForTarget(targetId);
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
