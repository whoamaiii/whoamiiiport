import type { RefObject } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
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
  return createPortal(
    <AnimatePresence>
      {state.isOpen && (
        <m.div
          ref={refs.modalRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={content.modalTitleId}
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center outline-none"
          onClick={(event) => {
            if (event.target !== event.currentTarget) {
              return;
            }

            handlers.onClose();
          }}
        >
          <h2 id={content.modalTitleId} className="sr-only">
            {content.displayTitle} verkdetaljer
          </h2>

          <button
            ref={refs.closeButtonRef}
            type="button"
            onClick={handlers.onClose}
            className="absolute top-6 right-6 z-20 p-3 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200"
            aria-label="Lukk modal"
          >
            <X size={24} />
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
                    autoPlay
                    controls
                    muted
                    playsInline
                    preload="metadata"
                    aria-label={`${content.displayTitle} video`}
                    className="max-w-full max-h-[68vh] lg:max-h-full object-contain rounded-lg bg-black"
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
                      className="max-w-full max-h-[68vh] lg:max-h-full object-contain rounded-lg"
                    />
                  </picture>
                )}

                {!state.isDesktopLayout && !state.showInfo && (
                  <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-4">
                    <button
                      type="button"
                      onClick={handlers.onShowInfo}
                      className="glass-dark w-full max-w-md rounded-full px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                      aria-expanded={state.showInfo}
                    >
                      Les mening + prosess
                    </button>
                  </div>
                )}
              </div>

              <AnimatePresence initial={false}>
                {state.showInfo && (
                  <m.div
                    id={content.infoPanelId}
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
                    className="lg:w-[26rem] w-full lg:max-w-none max-h-[42vh] lg:max-h-[80vh] overflow-y-auto glass-dark rounded-3xl p-6 md:p-7 custom-scrollbar"
                  >
                    <div className="mb-6 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-cyan-100 font-medium mb-2">
                          Verknotater
                        </p>
                        <h3 className="text-2xl font-bold text-white leading-tight">
                          {content.title.primary}
                        </h3>
                        {content.title.secondary && (
                          <p className="text-lg text-zinc-200 mt-1">
                            {content.title.secondary}
                          </p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={handlers.onHideInfo}
                        className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-100 transition-colors hover:text-white"
                      >
                        Skjul notater
                      </button>
                    </div>

                    <div className="mb-4 h-px w-14 bg-gradient-to-r from-cyan-300 to-emerald-300 rounded-full" />

                    <div className="space-y-6" lang={content.sectionsLang}>
                      {content.sections.map((sec) => {
                        const sectionKey = `${sec.heading ?? 'note'}-${sec.body.slice(0, 48)}`;

                        return (
                          <div key={sectionKey}>
                            {sec.heading && (
                              <h4 className="text-sm uppercase tracking-[0.2em] text-cyan-50 font-semibold mb-3">
                                {sec.heading}
                              </h4>
                            )}
                            {sec.body.split('\n\n').map((p) => (
                              <p
                                key={`${sectionKey}-${p.slice(0, 48)}`}
                                className="text-sm leading-[1.7] text-zinc-100 mb-3 font-light"
                              >
                                {p}
                              </p>
                            ))}
                            {sec.formula && (
                              <div className="my-4 p-3 rounded-xl bg-black/40 border border-cyan-300/20">
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
                    className="glass-dark w-full rounded-3xl px-6 py-5 text-left transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-200"
                  >
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-100/80 mb-2">
                      Verknotater
                    </p>
                    <p className="text-xl font-semibold text-white">
                      Les hva verket betyr og hvordan det er bygget
                    </p>
                    <p className="mt-2 text-sm text-zinc-400">
                      Åpne notatene i et rolig sidepanel mens verket blir stående i synsfeltet.
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
