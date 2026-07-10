import type { MouseEventHandler, RefObject } from 'react';
import { m, type MotionValue } from 'motion/react';
import type {
  GalleryImageFetchPriority,
  GalleryImageLoading,
} from './InteractiveArtworkCardState';
import type { ArtworkTitle } from './artworkData';

export type ArtworkCardPresentation = 'standard' | 'editorial' | 'archive';
export type ArtworkFrameVariant = 'portrait' | 'square' | 'landscape' | 'tall';

type ArtworkCardPreviewRefs = {
  readonly cardRef: RefObject<HTMLDivElement | null>;
  readonly triggerRef: RefObject<HTMLButtonElement | null>;
};

type ArtworkCardPreviewContent = {
  readonly displayTitle: string;
  readonly eyebrowLabel: string;
  readonly frameVariant: ArtworkFrameVariant;
  readonly indexLabel?: string;
  readonly isVideoArtwork: boolean;
  readonly presentation: ArtworkCardPresentation;
  readonly title: ArtworkTitle;
};

type ArtworkCardPreviewImage = {
  readonly alt: string;
  readonly avifSrcset?: string;
  readonly canLoad: boolean;
  readonly fetchPriority: GalleryImageFetchPriority;
  readonly loading: GalleryImageLoading;
  readonly objectPosition?: string;
  readonly sizes?: string;
  readonly src?: string;
  readonly srcset?: string;
};

type ArtworkCardPreviewMotion = {
  readonly enable: boolean;
  readonly glareBackground: MotionValue<string>;
  readonly glowBackground: MotionValue<string>;
  readonly isHovered: boolean;
  readonly onMouseEnter: MouseEventHandler<HTMLDivElement>;
  readonly onMouseLeave: MouseEventHandler<HTMLDivElement>;
  readonly onMouseMove: MouseEventHandler<HTMLDivElement>;
  readonly prefersReducedMotion: boolean;
  readonly rotateX: MotionValue<number>;
  readonly rotateY: MotionValue<number>;
};

type InteractiveArtworkCardPreviewProps = {
  readonly content: ArtworkCardPreviewContent;
  readonly image: ArtworkCardPreviewImage;
  readonly motion: ArtworkCardPreviewMotion;
  readonly onGalleryImageLoad: () => void;
  readonly onOpen: () => void;
  readonly refs: ArtworkCardPreviewRefs;
};

function PlayMark() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="m5.5 3.5 6 4.5-6 4.5z" />
    </svg>
  );
}

export function InteractiveArtworkCardPreview({
  content,
  image,
  motion,
  onGalleryImageLoad,
  onOpen,
  refs,
}: InteractiveArtworkCardPreviewProps) {
  const isEditorial = content.presentation !== 'standard';

  return (
    <m.div
      ref={refs.cardRef}
      className={`artwork-card artwork-card--${content.presentation}`}
      onMouseMove={motion.enable ? motion.onMouseMove : undefined}
      onMouseEnter={motion.enable ? motion.onMouseEnter : undefined}
      onMouseLeave={motion.enable ? motion.onMouseLeave : undefined}
      style={{
        transformPerspective: motion.enable ? 1200 : undefined,
        rotateX: motion.enable ? motion.rotateX : 0,
        rotateY: motion.enable ? motion.rotateY : 0,
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
    >
      <m.button
        ref={refs.triggerRef}
        type="button"
        onClick={onOpen}
        className="artwork-card-trigger"
        aria-label={`View ${content.displayTitle}${content.isVideoArtwork ? ' video' : ''} and artist notes`}
        whileTap={motion.prefersReducedMotion ? undefined : { scale: 0.985 }}
        transition={{ type: 'spring', stiffness: 360, damping: 28 }}
      >
        <span className={`artwork-card-frame artwork-card-frame--${content.frameVariant}`}>
          <picture>
            {image.avifSrcset ? (
              <source type="image/avif" srcSet={image.avifSrcset} sizes={image.sizes} />
            ) : null}
            <img
              src={image.src}
              srcSet={image.srcset}
              sizes={image.sizes}
              alt={image.canLoad ? image.alt : ''}
              loading={image.loading}
              fetchPriority={image.fetchPriority}
              decoding="async"
              onLoad={onGalleryImageLoad}
              width={800}
              height={1000}
              style={{ objectPosition: image.objectPosition }}
              className={image.canLoad ? '' : 'opacity-0'}
            />
          </picture>

          {motion.enable ? (
            <>
              <m.span
                className="artwork-card-reactive-glow"
                style={{ background: motion.glowBackground }}
                initial={false}
                animate={{ opacity: motion.isHovered ? 0.82 : 0 }}
                transition={{ duration: 0.24 }}
                aria-hidden="true"
              />
              <m.span
                className="artwork-card-reactive-glare"
                style={{ background: motion.glareBackground }}
                initial={false}
                animate={{ opacity: motion.isHovered ? 0.45 : 0 }}
                transition={{ duration: 0.24 }}
                aria-hidden="true"
              />
            </>
          ) : null}

          {!isEditorial ? (
            <span className="artwork-card-overlay">
              <span>{content.eyebrowLabel}</span>
              <strong>{content.title.primary}</strong>
            </span>
          ) : null}
        </span>

        {isEditorial ? (
          <span className="artwork-card-caption">
            <span className="artwork-card-caption-index">
              {content.indexLabel ?? content.eyebrowLabel}
            </span>
            <strong>{content.title.primary}</strong>
            <span className="artwork-card-caption-action">
              {content.isVideoArtwork ? <PlayMark /> : <span aria-hidden="true" />}
              {content.isVideoArtwork ? 'Watch study' : 'View work'}
            </span>
          </span>
        ) : null}
      </m.button>
    </m.div>
  );
}
