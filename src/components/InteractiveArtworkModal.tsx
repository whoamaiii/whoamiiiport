import { useEffect, useRef, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, m } from 'motion/react';
import type { ArtworkSection, ArtworkTitle } from './artworkData';

type ArtworkModalRefs = {
  readonly closeButtonRef: RefObject<HTMLButtonElement | null>;
  readonly modalRef: RefObject<HTMLDivElement | null>;
  readonly videoRef: RefObject<HTMLVideoElement | null>;
};

type ArtworkModalContent = {
  readonly displayTitle: string;
  readonly imageAlt: string;
  readonly infoPanelId: string;
  readonly modalTitleId: string;
  readonly sections: readonly ArtworkSection[];
  readonly sectionsLang?: string;
  readonly title: ArtworkTitle;
};

type ArtworkModalMedia = {
  readonly isVideoArtwork: boolean;
  readonly modalAvifSrcset?: string;
  readonly modalImageUrl: string;
  readonly modalSrcset?: string;
  readonly videoSrc?: string;
};

type ArtworkModalState = {
  readonly isDesktopLayout: boolean;
  readonly isOpen: boolean;
  readonly prefersReducedMotion: boolean;
  readonly showInfo: boolean;
};

type ArtworkModalHandlers = {
  readonly onClose: () => void;
  readonly onHideInfo: () => void;
  readonly onShowInfo: () => void;
};

type InteractiveArtworkModalProps = {
  readonly content: ArtworkModalContent;
  readonly handlers: ArtworkModalHandlers;
  readonly media: ArtworkModalMedia;
  readonly refs: ArtworkModalRefs;
  readonly state: ArtworkModalState;
};

export function InteractiveArtworkModal({
  content,
  handlers,
  media,
  refs,
  state,
}: InteractiveArtworkModalProps) {
  const infoPanelRef = useRef<HTMLDivElement>(null);
  const mobileShowInfoButtonRef = useRef<HTMLButtonElement>(null);
  const previousShowInfoRef = useRef(state.showInfo);

  // On mobile the info toggle unmounts once the panel opens (and vice versa),
  // which would otherwise drop keyboard focus onto <body> inside the dialog.
  useEffect(() => {
    const wasShowingInfo = previousShowInfoRef.current;
    previousShowInfoRef.current = state.showInfo;

    if (!state.isOpen || state.isDesktopLayout || state.showInfo === wasShowingInfo) {
      return;
    }

    if (state.showInfo) {
      infoPanelRef.current?.focus({ preventScroll: true });
      return;
    }

    mobileShowInfoButtonRef.current?.focus({ preventScroll: true });
  }, [state.isDesktopLayout, state.isOpen, state.showInfo]);

  return createPortal(
    <AnimatePresence>
      {state.isOpen && (
        <m.div
          ref={refs.modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={content.modalTitleId}
          tabIndex={-1}
          initial={state.prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={state.prefersReducedMotion ? { duration: 0 } : { duration: 0.24 }}
          className="artwork-modal"
          onClick={(event) => {
            if (event.target !== event.currentTarget) {
              return;
            }

            handlers.onClose();
          }}
        >
          <h2 id={content.modalTitleId} className="sr-only">
            {content.displayTitle} artwork details
          </h2>

          <button
            ref={refs.closeButtonRef}
            type="button"
            onClick={handlers.onClose}
            className="artwork-modal-close"
            aria-label="Close artwork"
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>

          <div className="w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-12">
            <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch justify-center">
              <div className="relative flex-1 min-h-0 flex items-center justify-center">
                {media.isVideoArtwork ? (
                  <m.video
                    ref={refs.videoRef}
                    initial={state.prefersReducedMotion ? false : { scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={state.prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
                    poster={media.modalImageUrl}
                    autoPlay={!state.prefersReducedMotion}
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={`${content.displayTitle} video`}
                    className="max-w-full max-h-[68vh] lg:max-h-full object-contain bg-zinc-950"
                  >
                    <source src={media.videoSrc} type="video/mp4" />
                  </m.video>
                ) : (
                  <picture className="flex max-h-[68vh] max-w-full items-center justify-center lg:max-h-full">
                    {media.modalAvifSrcset ? (
                      <source
                        type="image/avif"
                        srcSet={media.modalAvifSrcset}
                        sizes="(max-width: 1024px) 100vw, 70vw"
                      />
                    ) : null}
                    <m.img
                      initial={state.prefersReducedMotion ? false : { scale: 0.96, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={state.prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
                      src={media.modalImageUrl}
                      srcSet={media.modalSrcset}
                      sizes="(max-width: 1024px) 100vw, 70vw"
                      alt={content.imageAlt}
                      className="max-w-full max-h-[68vh] lg:max-h-full object-contain"
                    />
                  </picture>
                )}

                {!state.isDesktopLayout && !state.showInfo && (
                  <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-4">
                    <button
                      ref={mobileShowInfoButtonRef}
                      type="button"
                      onClick={handlers.onShowInfo}
                      className="artwork-modal-info-toggle"
                      aria-expanded={state.showInfo}
                    >
                      Read meaning + process
                    </button>
                  </div>
                )}
              </div>

              <AnimatePresence initial={false}>
                {state.showInfo && (
                  <m.div
                    id={content.infoPanelId}
                    ref={infoPanelRef}
                    tabIndex={-1}
                    initial={
                      state.prefersReducedMotion
                        ? false
                        : { x: state.isDesktopLayout ? 40 : 0, y: state.isDesktopLayout ? 0 : 24, opacity: 0 }
                    }
                    animate={{ x: 0, y: 0, opacity: 1 }}
                    exit={
                      state.prefersReducedMotion
                        ? { opacity: 0 }
                        : { x: state.isDesktopLayout ? 40 : 0, y: state.isDesktopLayout ? 0 : 24, opacity: 0 }
                    }
                    transition={state.prefersReducedMotion ? { duration: 0 } : { duration: 0.3 }}
                    className={`artwork-modal-panel custom-scrollbar ${media.isVideoArtwork ? 'mt-6 lg:mt-0' : ''}`}
                  >
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-100 font-medium mb-2">
                          Artist notes
                        </p>
                        <h3 className="text-2xl font-bold text-white leading-tight">
                          {content.title.primary}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={handlers.onHideInfo}
                        aria-controls={content.infoPanelId}
                        aria-expanded="true"
                        className="artwork-modal-hide-notes"
                      >
                        Hide notes
                      </button>
                    </div>

                    <div className="mb-4 h-px w-14 bg-cyan-200/65" />

                    <div className="space-y-6" lang={content.sectionsLang}>
                      {content.sections.map((sec) => {
                        const sectionKey = `${sec.heading ?? 'note'}-${sec.body.slice(0, 48)}`;

                        return (
                          <div key={sectionKey}>
                            {sec.heading && (
                              <h4 className="mb-3 text-sm font-bold uppercase tracking-[0.22em] text-cyan-50">
                                {sec.heading}
                              </h4>
                            )}
                            {sec.body.split('\n\n').map((p) => (
                              <p
                                key={`${sectionKey}-${p.slice(0, 48)}`}
                                className="mb-4 max-w-[62ch] text-[0.96rem] font-normal leading-[1.85] tracking-[0.01em] text-zinc-50/95 sm:text-base"
                              >
                                {p}
                              </p>
                            ))}
                            {sec.formula && (
                              <div className="my-4 border border-cyan-300/20 bg-zinc-950/70 p-3">
                                <pre className="text-xs text-cyan-100/90 font-mono whitespace-pre-wrap leading-relaxed">
                                  {sec.formula}
                                </pre>
                                {sec.formulaCaption && (
                                  <p className="text-[10px] uppercase tracking-widest text-zinc-500 mt-2">
                                    {sec.formulaCaption}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </m.div>
                )}
              </AnimatePresence>

              {state.isDesktopLayout && !state.showInfo && (
                <div className="lg:w-[26rem] hidden lg:flex items-end">
                  <button
                    type="button"
                    onClick={handlers.onShowInfo}
                    aria-expanded={state.showInfo}
                    className="artwork-modal-desktop-toggle"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/80 mb-2">
                      Artist notes
                    </p>
                    <p className="text-xl font-semibold text-white">
                      Read the meaning and process behind the work
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                      Open the field notes while the artwork remains in view.
                    </p>
                  </button>
                </div>
              )}
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
