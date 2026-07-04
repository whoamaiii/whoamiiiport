import { afterEach, describe, expect, it } from 'vitest';
import {
  getInitialGallerySectionLoad,
  getInitialLibrarySectionLoad,
  getNavigationTargetFromHash,
  getSectionIdForTarget,
  getSectionIdFromHash,
} from '../src/utils/sectionLoading';

function setHash(hash: string) {
  window.history.replaceState(null, '', `/${hash}`);
}

afterEach(() => {
  window.history.replaceState(null, '', '/');
});

describe('getSectionIdForTarget', () => {
  it('maps top-level section targets to themselves', () => {
    expect(getSectionIdForTarget('work')).toBe('work');
    expect(getSectionIdForTarget('gallery')).toBe('gallery');
    expect(getSectionIdForTarget('about')).toBe('about');
    expect(getSectionIdForTarget('contact')).toBe('contact');
  });

  it('maps gallery group anchors to the gallery section', () => {
    expect(getSectionIdForTarget('gallery-hand-portals')).toBe('gallery');
    expect(getSectionIdForTarget('gallery-liminal-rooms')).toBe('gallery');
  });

  it('rejects unknown targets and a bare group prefix', () => {
    expect(getSectionIdForTarget('gallery-')).toBeNull();
    expect(getSectionIdForTarget('hero')).toBeNull();
    expect(getSectionIdForTarget('')).toBeNull();
  });
});

describe('getNavigationTargetFromHash', () => {
  it('returns the raw target for gallery group hashes', () => {
    setHash('#gallery-hand-portals');
    expect(getNavigationTargetFromHash()).toBe('gallery-hand-portals');
  });

  it('returns top-level section targets', () => {
    setHash('#work');
    expect(getNavigationTargetFromHash()).toBe('work');
  });

  it('returns null for unknown or missing hashes', () => {
    setHash('#unknown-section');
    expect(getNavigationTargetFromHash()).toBeNull();

    setHash('');
    expect(getNavigationTargetFromHash()).toBeNull();
  });
});

describe('initial section load from deep links', () => {
  it('loads the gallery and library sections for a gallery group deep link', () => {
    setHash('#gallery-hand-portals');
    expect(getSectionIdFromHash()).toBe('gallery');
    expect(getInitialGallerySectionLoad()).toBe(true);
    expect(getInitialLibrarySectionLoad()).toBe(true);
  });

  it('keeps the library section deferred for non-gallery deep links', () => {
    setHash('#work');
    expect(getInitialGallerySectionLoad()).toBe(true);
    expect(getInitialLibrarySectionLoad()).toBe(false);
  });
});
