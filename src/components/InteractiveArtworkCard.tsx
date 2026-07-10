import { useEffect, useReducer, useRef } from 'react';
import type { ModalImageSlug } from '../utils/images';
import { useInteractiveArtworkCardMotion } from '../hooks/useInteractiveArtworkCardMotion';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useOverlayBehavior } from '../hooks/useOverlayBehavior';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { getInteractiveArtworkCardImages } from './InteractiveArtworkCardImages';
import {
  InteractiveArtworkCardPreview,
  type ArtworkCardPresentation,
  type ArtworkFrameVariant,
} from './InteractiveArtworkCardPreview';
import {
  artworkCardReducer,
  shouldUseMobilePriorityPreview,
  type GalleryImageFetchPriority,
  type GalleryImageLoading,
} from './InteractiveArtworkCardState';
import { InteractiveArtworkModal } from './InteractiveArtworkModal';
import type { ArtworkSection, ArtworkTitle } from './artworkData';

type InteractiveArtworkCardProps = {
  readonly deferImageUntilVisible?: boolean;
  readonly eyebrowLabel?: string;
  readonly frameVariant?: ArtworkFrameVariant;
  readonly imageFetchPriority?: GalleryImageFetchPriority;
  readonly imageLoading?: GalleryImageLoading;
  readonly imageSlug: ModalImageSlug;
  readonly indexLabel?: string;
  readonly presentation?: ArtworkCardPresentation;
  readonly sections: readonly ArtworkSection[];
  readonly sectionsLang?: string;
  readonly title: ArtworkTitle;
  readonly videoSrc?: string;
};

export default function InteractiveArtworkCard({
  deferImageUntilVisible = false,
  eyebrowLabel = 'Selected work',
  frameVariant = 'portrait',
  imageFetchPriority = 'auto',
  imageLoading = 'lazy',
  imageSlug,
  indexLabel,
  presentation = 'standard',
  sections,
  sectionsLang,
  title,
  videoSrc,
}: InteractiveArtworkCardProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const mobileUpgradeTimerRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const supportsCardMotion = useMediaQuery('(hover: hover) and (pointer: fine)', false);
  const isDesktopLayout = useMediaQuery('(min-width: 1024px)', false);
  const isMobileLayout = useMediaQuery('(max-width: 767px)', false);
  const [state, dispatch] = useReducer(artworkCardReducer, {
    imageCanLoad: !deferImageUntilVisible,
    isHovered: false,
    isModalOpen: false,
    showInfo: false,
    useMobilePriorityPreview: shouldUseMobilePriorityPreview({
      imageCanLoad: !deferImageUntilVisible,
      imageLoading,
      isMobileLayout,
    }),
  });
  const {
    imageCanLoad,
    isHovered,
    isModalOpen,
    showInfo,
    useMobilePriorityPreview,
  } = state;
  const enableCardMotion =
    presentation === 'standard' && !prefersReducedMotion && supportsCardMotion;
  const cardMotion = useInteractiveArtworkCardMotion({
    cardRef,
    enableCardMotion,
    onCardLeave: () => dispatch({ type: 'setHovered', isHovered: false }),
  });

  useOverlayBehavior({
    isOpen: isModalOpen,
    containerRef: modalRef,
    initialFocusRef: closeButtonRef,
    restoreFocusRef: triggerRef,
    onClose: () => dispatch({ type: 'closeModal' }),
  });

  useEffect(() => {
    if (!isModalOpen || !videoSrc || prefersReducedMotion) {
      return;
    }

    const animationFrame = requestAnimationFrame(() => {
      void videoRef.current?.play().catch(() => {
        // The visible controls remain available if a browser blocks autoplay.
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [isModalOpen, prefersReducedMotion, videoSrc]);

  const isVideoArtwork = Boolean(videoSrc);
  const images = getInteractiveArtworkCardImages({
    imageCanLoad,
    imageSlug,
    isVideoArtwork,
    useMobilePriorityPreview,
  });

  useEffect(() => {
    if (mobileUpgradeTimerRef.current !== null) {
      window.clearTimeout(mobileUpgradeTimerRef.current);
      mobileUpgradeTimerRef.current = null;
    }

    const imageCanLoadImmediately = !deferImageUntilVisible;
    dispatch({
      type: 'resetImageLoad',
      imageCanLoad: imageCanLoadImmediately,
      useMobilePriorityPreview: shouldUseMobilePriorityPreview({
        imageCanLoad: imageCanLoadImmediately,
        imageLoading,
        isMobileLayout,
      }),
    });
  }, [deferImageUntilVisible, imageLoading, imageSlug, isMobileLayout]);

  useEffect(() => {
    if (!deferImageUntilVisible) {
      return;
    }

    const usePriorityPreview = shouldUseMobilePriorityPreview({
      imageCanLoad: true,
      imageLoading,
      isMobileLayout,
    });

    const card = cardRef.current;
    if (!card || typeof IntersectionObserver === 'undefined') {
      dispatch({
        type: 'imageCanLoad',
        useMobilePriorityPreview: usePriorityPreview,
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting || entry.intersectionRatio > 0)) {
          dispatch({
            type: 'imageCanLoad',
            useMobilePriorityPreview: usePriorityPreview,
          });
          observer.disconnect();
        }
      },
      { rootMargin: '160px 0px', threshold: 0.01 },
    );

    observer.observe(card);

    return () => observer.disconnect();
  }, [deferImageUntilVisible, imageLoading, imageSlug, isMobileLayout]);

  const displayTitle = title.primary;
  const modalTitleId = `artwork-modal-title-${imageSlug}`;
  const infoPanelId = `artwork-info-panel-${imageSlug}`;

  const handleGalleryImageLoad = () => {
    if (!useMobilePriorityPreview || mobileUpgradeTimerRef.current !== null) {
      return;
    }

    mobileUpgradeTimerRef.current = window.setTimeout(() => {
      mobileUpgradeTimerRef.current = null;
      dispatch({ type: 'completeMobilePriorityPreview' });
    }, 120);
  };

  return (
    <>
      <InteractiveArtworkCardPreview
        refs={{ cardRef, triggerRef }}
        content={{
          displayTitle,
          eyebrowLabel,
          frameVariant,
          indexLabel,
          isVideoArtwork,
          presentation,
          title,
        }}
        image={{
          alt: images.imageAlt,
          avifSrcset: images.displayedAvifImageSrcset,
          canLoad: imageCanLoad,
          fetchPriority: imageFetchPriority,
          loading: imageLoading,
          objectPosition: images.imageObjectPosition,
          sizes: images.displayedImageSizes,
          src: images.displayedImageSrc,
          srcset: images.displayedImageSrcset,
        }}
        motion={{
          enable: enableCardMotion,
          glareBackground: cardMotion.glareBackground,
          glowBackground: cardMotion.glowBackground,
          isHovered,
          onMouseEnter: () => dispatch({ type: 'setHovered', isHovered: true }),
          onMouseLeave: cardMotion.handleMouseLeave,
          onMouseMove: cardMotion.handleMouseMove,
          prefersReducedMotion,
          rotateX: cardMotion.rotateX,
          rotateY: cardMotion.rotateY,
        }}
        onGalleryImageLoad={handleGalleryImageLoad}
        onOpen={() => dispatch({ type: 'openModal', showInfo: isDesktopLayout })}
      />

      <InteractiveArtworkModal
        refs={{ closeButtonRef, modalRef, videoRef }}
        content={{
          displayTitle,
          imageAlt: images.imageAlt,
          infoPanelId,
          modalTitleId,
          sections,
          sectionsLang,
          title,
        }}
        media={{
          isVideoArtwork,
          modalAvifSrcset: images.modalAvifSrcset,
          modalImageUrl: images.modalImageUrl,
          modalSrcset: images.modalSrcset,
          videoSrc,
        }}
        state={{
          isDesktopLayout,
          isOpen: isModalOpen,
          prefersReducedMotion,
          showInfo,
        }}
        handlers={{
          onClose: () => dispatch({ type: 'closeModal' }),
          onHideInfo: () => dispatch({ type: 'setInfo', showInfo: false }),
          onShowInfo: () => dispatch({ type: 'setInfo', showInfo: true }),
        }}
      />
    </>
  );
}
