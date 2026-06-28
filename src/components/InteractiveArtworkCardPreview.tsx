import type { MouseEventHandler, RefObject } from 'react';
import { Play } from 'lucide-react';
import { m, type MotionValue } from 'motion/react';
import type {
  GalleryImageFetchPriority,
  GalleryImageLoading,
} from './InteractiveArtworkCardState';
import type { ArtworkTitle } from './artworkData';

type ArtworkCardPreviewRefs = {
  readonly cardRef: RefObject<HTMLDivElement | null>;
  readonly triggerRef: RefObject<HTMLButtonElement | null>;
};

type ArtworkCardPreviewContent = {
  readonly displayTitle: string;
  readonly eyebrowLabel: string;
  readonly isVideoArtwork: boolean;
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

export function InteractiveArtworkCardPreview({
  content,
  image,
  motion,
  onGalleryImageLoad,
  onOpen,
  refs,
}: InteractiveArtworkCardPreviewProps) {
  return (
    <m.div
      ref={refs.cardRef}
      className="group relative aspect-[4/5] w-full rounded-3xl overflow-hidden glass p-2 cursor-pointer"
      onMouseMove={motion.enable ? motion.onMouseMove : undefined}
      onMouseEnter={motion.enable ? motion.onMouseEnter : undefined}
      onMouseLeave={motion.enable ? motion.onMouseLeave : undefined}
      style={{
        transformPerspective: motion.enable ? 1200 : undefined,
        rotateX: motion.enable ? motion.rotateX : 0,
        rotateY: motion.enable ? motion.rotateY : 0,
      }}
      animate={
        motion.enable
          ? {
              boxShadow: motion.isHovered
                ? '0 30px 80px -36px rgba(0,0,0,0.92), 0 0 0 1px rgba(255,255,255,0.08)'
                : '0 18px 54px -40px rgba(0,0,0,0.86), 0 0 0 1px rgba(255,255,255,0.04)',
            }
          : undefined
      }
      transition={{ type: 'spring', stiffness: 280, damping: 24 }}
    >
      <m.button
        ref={refs.triggerRef}
        type="button"
        onClick={onOpen}
        className="group w-full h-full text-left rounded-2xl overflow-hidden relative focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-zinc-950"
        aria-label={`Se ${content.displayTitle} ${content.isVideoArtwork ? 'video' : 'verk'} med notater`}
        whileHover={motion.enable ? { scale: 1.02 } : undefined}
        whileTap={motion.prefersReducedMotion ? undefined : { scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        <div className="w-full h-full rounded-2xl overflow-hidden relative">
          <picture className="block h-full w-full">
            {image.avifSrcset ? (
              <source
                type="image/avif"
                srcSet={image.avifSrcset}
                sizes={image.sizes}
              />
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
              className={`w-full h-full object-cover ${image.canLoad ? '' : 'opacity-0'} ${
                motion.enable ? 'transition-transform duration-700 group-hover:scale-[1.04] group-focus-visible:scale-[1.04]' : ''
              }`.trim()}
            />
          </picture>

          {motion.enable && (
            <m.div
              className="absolute inset-0 pointer-events-none z-10 mix-blend-screen"
              style={{ background: motion.glowBackground }}
              initial={false}
              animate={{ opacity: motion.isHovered ? 0.95 : 0 }}
              transition={{ duration: 0.25 }}
            />
          )}

          {motion.enable && (
            <m.div
              className="absolute inset-0 pointer-events-none z-20"
              style={{ background: motion.glareBackground }}
              initial={{ opacity: 0 }}
              animate={{ opacity: motion.isHovered ? 0.6 : 0 }}
              transition={{ duration: 0.3 }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100 transition-opacity duration-500 flex items-end p-4 md:p-6 z-30">
            <div className="w-full transform translate-y-0 lg:translate-y-3 lg:group-hover:translate-y-0 lg:group-focus-visible:translate-y-0 transition-transform duration-500">
              <p className="text-[10px] uppercase tracking-[0.32em] text-cyan-100/70 mb-2">
                {content.eyebrowLabel}
              </p>
              <p className="font-medium text-white text-lg md:text-xl">{content.title.primary}</p>
              {content.title.secondary && (
                <p className="mt-1 text-sm text-zinc-400">{content.title.secondary}</p>
              )}

              <div className="mt-4 flex items-center gap-3 text-sm text-zinc-200">
                <span className="h-px w-8 bg-gradient-to-r from-cyan-200 via-emerald-200 to-transparent" />
                {content.isVideoArtwork && <Play size={14} aria-hidden="true" />}
                <span>{content.isVideoArtwork ? 'Se video' : 'Se verk'}</span>
              </div>
            </div>
          </div>
        </div>
      </m.button>
    </m.div>
  );
}
