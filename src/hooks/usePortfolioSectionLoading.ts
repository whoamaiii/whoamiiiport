import { useCallback, useEffect, useRef, useState } from 'react';
import {
  getInitialDeferredSectionLoad,
  getInitialGallerySectionLoad,
  getInitialLibrarySectionLoad,
  getSectionIdFromHash,
  isDeferredSection,
  preloadFirstGalleryImage,
} from '../utils/sectionLoading';

const GALLERY_IDLE_LOAD_TIMEOUT_MS = 900;
const DEFERRED_SECTION_LOAD_TIMEOUT_MS = 9000;
const PENDING_NAVIGATION_ATTEMPT_LIMIT = 80;
const PENDING_NAVIGATION_RETRY_MS = 50;

interface PortfolioSectionLoadingOptions {
  readonly prefersReducedMotion: boolean;
}

interface PortfolioSectionLoadingState {
  readonly loadGallerySection: boolean;
  readonly loadLibrarySection: boolean;
  readonly loadDeferredSections: boolean;
  readonly handleSectionNavigation: (id: string) => void;
}

export function usePortfolioSectionLoading({
  prefersReducedMotion,
}: PortfolioSectionLoadingOptions): PortfolioSectionLoadingState {
  const [loadGallerySection, setLoadGallerySection] = useState(getInitialGallerySectionLoad);
  const [loadLibrarySection, setLoadLibrarySection] = useState(getInitialLibrarySectionLoad);
  const [loadDeferredSections, setLoadDeferredSections] = useState(
    getInitialDeferredSectionLoad,
  );
  const pendingSectionNavigationRef = useRef<string | null>(null);
  const pendingSectionNavigationInitializedRef = useRef(false);
  const pendingNavigationTimerRef = useRef<number | null>(null);
  const pendingNavigationAttemptsRef = useRef(0);

  if (!pendingSectionNavigationInitializedRef.current) {
    pendingSectionNavigationRef.current = getSectionIdFromHash();
    pendingSectionNavigationInitializedRef.current = true;
  }

  const enableDeferredSections = useCallback(() => {
    setLoadDeferredSections(true);
  }, []);

  const enableGallerySection = useCallback(() => {
    setLoadGallerySection(true);
    preloadFirstGalleryImage();
  }, []);

  const enableLibrarySection = useCallback(() => {
    setLoadLibrarySection(true);
  }, []);

  const enableDeferredSectionsRef = useRef(enableDeferredSections);
  enableDeferredSectionsRef.current = enableDeferredSections;
  const enableGallerySectionRef = useRef(enableGallerySection);
  enableGallerySectionRef.current = enableGallerySection;
  const enableLibrarySectionRef = useRef(enableLibrarySection);
  enableLibrarySectionRef.current = enableLibrarySection;

  const scrollToSection = useCallback(
    (id: string) => {
      if (typeof document === 'undefined') {
        return false;
      }

      const target = document.getElementById(id);
      if (!target) {
        return false;
      }

      target.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      target.focus({ preventScroll: true });
      window.setTimeout(() => {
        target.scrollIntoView({
          behavior: 'auto',
          block: 'start',
        });
      }, prefersReducedMotion ? 0 : 240);
      return true;
    },
    [prefersReducedMotion],
  );

  const clearPendingNavigationTimer = useCallback(() => {
    if (pendingNavigationTimerRef.current === null) {
      return;
    }

    window.clearTimeout(pendingNavigationTimerRef.current);
    pendingNavigationTimerRef.current = null;
  }, []);

  const tryPendingSectionNavigation = useCallback(() => {
    const pendingSectionNavigation = pendingSectionNavigationRef.current;

    if (!pendingSectionNavigation) {
      clearPendingNavigationTimer();
      return;
    }

    if (scrollToSection(pendingSectionNavigation)) {
      pendingSectionNavigationRef.current = null;
      pendingNavigationAttemptsRef.current = 0;
      clearPendingNavigationTimer();
      return;
    }

    pendingNavigationAttemptsRef.current += 1;

    if (pendingNavigationAttemptsRef.current >= PENDING_NAVIGATION_ATTEMPT_LIMIT) {
      pendingSectionNavigationRef.current = null;
      pendingNavigationAttemptsRef.current = 0;
      clearPendingNavigationTimer();
      return;
    }

    clearPendingNavigationTimer();
    pendingNavigationTimerRef.current = window.setTimeout(() => {
      tryPendingSectionNavigation();
    }, PENDING_NAVIGATION_RETRY_MS);
  }, [clearPendingNavigationTimer, scrollToSection]);

  const handleSectionNavigation = useCallback(
    (id: string) => {
      if (id === 'work' || isDeferredSection(id)) {
        enableGallerySection();
      }

      if (id === 'gallery') {
        enableLibrarySection();
      }

      if (isDeferredSection(id)) {
        enableDeferredSections();
      }

      if (!scrollToSection(id)) {
        pendingSectionNavigationRef.current = id;
        pendingNavigationAttemptsRef.current = 0;
        tryPendingSectionNavigation();
      }
    },
    [
      enableDeferredSections,
      enableGallerySection,
      enableLibrarySection,
      scrollToSection,
      tryPendingSectionNavigation,
    ],
  );

  useEffect(() => {
    if (loadGallerySection) {
      preloadFirstGalleryImage();
      return;
    }

    const enableAfterHeroScroll = () => {
      if (window.scrollY > window.innerHeight * 0.35) {
        enableGallerySectionRef.current();
      }
    };
    const enableGallery = () => enableGallerySectionRef.current();
    const requestIdle = window.requestIdleCallback?.bind(window);
    let idleCallbackId: number | null = null;
    let timeoutId: number | null = null;

    if (requestIdle) {
      idleCallbackId = requestIdle(enableGallery, { timeout: GALLERY_IDLE_LOAD_TIMEOUT_MS });
    } else {
      timeoutId = window.setTimeout(enableGallery, GALLERY_IDLE_LOAD_TIMEOUT_MS);
    }

    window.addEventListener('scroll', enableAfterHeroScroll, { passive: true });
    window.addEventListener('hashchange', enableGallery, { once: true });
    enableAfterHeroScroll();

    return () => {
      if (idleCallbackId !== null) {
        window.cancelIdleCallback?.(idleCallbackId);
      }

      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }

      window.removeEventListener('scroll', enableAfterHeroScroll);
      window.removeEventListener('hashchange', enableGallery);
    };
  }, [loadGallerySection]);

  useEffect(() => {
    if (loadLibrarySection) {
      return;
    }

    const enableFromGalleryHash = () => {
      if (window.location.hash === '#gallery') {
        enableLibrarySectionRef.current();
      }
    };

    window.addEventListener('hashchange', enableFromGalleryHash);
    enableFromGalleryHash();

    return () => window.removeEventListener('hashchange', enableFromGalleryHash);
  }, [loadLibrarySection]);

  useEffect(() => {
    if (loadDeferredSections) {
      return;
    }

    const enableAfterHeroScroll = () => {
      if (window.scrollY > window.innerHeight * 0.45) {
        enableDeferredSectionsRef.current();
      }
    };
    const enableDeferred = () => enableDeferredSectionsRef.current();
    const timeoutId = window.setTimeout(enableDeferred, DEFERRED_SECTION_LOAD_TIMEOUT_MS);

    window.addEventListener('scroll', enableAfterHeroScroll, { passive: true });
    window.addEventListener('hashchange', enableDeferred, { once: true });
    window.addEventListener('pointerdown', enableDeferred, { once: true, passive: true });
    window.addEventListener('keydown', enableDeferred, { once: true });
    enableAfterHeroScroll();

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('scroll', enableAfterHeroScroll);
      window.removeEventListener('hashchange', enableDeferred);
      window.removeEventListener('pointerdown', enableDeferred);
      window.removeEventListener('keydown', enableDeferred);
    };
  }, [loadDeferredSections]);

  useEffect(() => {
    tryPendingSectionNavigation();
  }, [
    loadDeferredSections,
    loadGallerySection,
    loadLibrarySection,
    tryPendingSectionNavigation,
  ]);

  useEffect(() => clearPendingNavigationTimer, [clearPendingNavigationTimer]);

  return {
    loadGallerySection,
    loadLibrarySection,
    loadDeferredSections,
    handleSectionNavigation,
  };
}
