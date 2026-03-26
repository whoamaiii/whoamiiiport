import { useState, useRef, useEffect, type RefObject } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { ImageSlug } from '../utils/images';
import {
  getGallerySrcset,
  getModalSrcset,
  getGallerySizes,
  getGalleryImageUrl,
  getModalImageUrl,
  getImageMetadata,
} from '../utils/images';
import type { ArtworkSection, ArtworkTitle } from './artworkData';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface InteractiveArtworkCardProps {
  imageSlug: ImageSlug;
  title: ArtworkTitle;
  sections: ArtworkSection[];
}

function useFocusTrap(
  isActive: boolean,
  onEscape: () => void,
  initialFocusRef: RefObject<HTMLElement | null>,
  restoreFocusRef: RefObject<HTMLElement | null>,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    const raf = requestAnimationFrame(() => {
      initialFocusRef.current?.focus?.();
      if (document.activeElement !== initialFocusRef.current) {
        containerRef.current?.focus();
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onEscape();
        return;
      }

      if (e.key === 'Tab' && containerRef.current) {
        const focusableElements = containerRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => !(el as HTMLElement).hasAttribute('disabled'),
        ) as HTMLElement[];

        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      (restoreFocusRef.current ?? previousFocusRef.current)?.focus?.();
    };
  }, [isActive, onEscape, initialFocusRef, restoreFocusRef]);

  return containerRef;
}

function clampPreview(body?: string) {
  if (!body) return '';
  const firstParagraph = body.split('\n\n')[0]?.replace(/\s+/g, ' ').trim() ?? '';
  if (firstParagraph.length <= 150) return firstParagraph;
  return `${firstParagraph.slice(0, 147).trimEnd()}...`;
}

export default function InteractiveArtworkCard({
  imageSlug,
  title,
  sections,
}: InteractiveArtworkCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [isDesktopLayout, setIsDesktopLayout] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const sync = (matches: boolean) => setIsDesktopLayout(matches);
    sync(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => sync(event.matches);

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  const modalRef = useFocusTrap(
    isModalOpen,
    () => {
      setIsModalOpen(false);
      setShowInfo(false);
    },
    closeButtonRef,
    triggerRef,
  );

  const imageMeta = getImageMetadata(imageSlug);
  const gallerySrcset = getGallerySrcset(imageSlug);
  const modalSrcset = getModalSrcset(imageSlug);
  const sizes = getGallerySizes();
  const fallbackUrl = getGalleryImageUrl(imageSlug);
  const modalImageUrl = getModalImageUrl(imageSlug);

  const displayTitle = title.secondary
    ? `${title.primary} — ${title.secondary}`
    : title.primary;

  const modalTitleId = `artwork-modal-title-${imageSlug}`;
  const previewText = clampPreview(sections[0]?.body);

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        onClick={() => {
          setShowInfo(isDesktopLayout);
          setIsModalOpen(true);
        }}
        className="group relative aspect-[4/5] w-full text-left rounded-3xl overflow-hidden glass p-2 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
        aria-label={`View ${displayTitle} artwork details and notes`}
        whileHover={
          prefersReducedMotion
            ? undefined
            : { y: -8, scale: 1.015, rotateX: 2, rotateY: -2 }
        }
        whileTap={prefersReducedMotion ? undefined : { scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        style={{ transformPerspective: 1200 }}
      >
        <div className="w-full h-full rounded-2xl overflow-hidden relative">
          <img
            src={fallbackUrl}
            srcSet={gallerySrcset}
            sizes={sizes}
            alt={imageMeta.alt}
            loading="lazy"
            decoding="async"
            width={800}
            height={1000}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100 transition-opacity duration-500 flex items-end p-4 md:p-6">
            <div className="glass w-full p-4 rounded-2xl transform translate-y-0 lg:translate-y-4 lg:group-hover:translate-y-0 lg:group-focus-visible:translate-y-0 transition-transform duration-500">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-purple-300/80 mb-2">
                    Selected work
                  </p>
                  <p className="font-medium text-white">{title.primary}</p>
                  {title.secondary && (
                    <p className="text-sm text-zinc-400">{title.secondary}</p>
                  )}
                </div>
                <span className="shrink-0 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                  View + notes
                </span>
              </div>

              {previewText && (
                <p
                  className="mt-3 text-sm leading-6 text-zinc-200/90"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {previewText}
                </p>
              )}

              <div className="mt-4 flex items-center justify-between text-xs tracking-wide text-zinc-400">
                <span>{isDesktopLayout ? 'Opens with notes visible' : 'Tap for artwork details'}</span>
                <span className="text-purple-300">Meaning + process</span>
              </div>
            </div>
          </div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={modalTitleId}
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center outline-none"
            onClick={() => {
              setIsModalOpen(false);
              setShowInfo(false);
            }}
          >
            <h2 id={modalTitleId} className="sr-only">
              {displayTitle} artwork details
            </h2>

            <button
              ref={closeButtonRef}
              onClick={() => {
                setIsModalOpen(false);
                setShowInfo(false);
              }}
              className="absolute top-6 right-6 z-20 p-3 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-400"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>

            <div
              className="w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-12"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full h-full max-w-7xl max-h-[90vh] flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch justify-center">
                <div className="relative flex-1 min-h-0 flex items-center justify-center">
                  <motion.img
                    initial={{ scale: 0.96, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    src={modalImageUrl}
                    srcSet={modalSrcset}
                    sizes="(max-width: 1024px) 100vw, 70vw"
                    alt={imageMeta.alt}
                    className="max-w-full max-h-[68vh] lg:max-h-full object-contain rounded-lg"
                  />

                  {!isDesktopLayout && !showInfo && (
                    <div className="absolute inset-x-0 bottom-0 flex justify-center px-4 pb-4">
                      <button
                        onClick={() => setShowInfo(true)}
                        className="glass-dark w-full max-w-md rounded-full px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-400"
                        aria-controls="artwork-info-panel"
                        aria-expanded={showInfo}
                      >
                        Read meaning + process
                      </button>
                    </div>
                  )}
                </div>

                <AnimatePresence initial={false}>
                  {showInfo && (
                    <motion.aside
                      id="artwork-info-panel"
                      initial={{ x: isDesktopLayout ? 40 : 0, y: isDesktopLayout ? 0 : 24, opacity: 0 }}
                      animate={{ x: 0, y: 0, opacity: 1 }}
                      exit={{ x: isDesktopLayout ? 40 : 0, y: isDesktopLayout ? 0 : 24, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="lg:w-[26rem] w-full lg:max-w-none max-h-[42vh] lg:max-h-[80vh] overflow-y-auto glass-dark rounded-3xl p-6 md:p-7 custom-scrollbar"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.3em] text-purple-400/80 font-medium mb-2">
                            Artwork notes
                          </p>
                          <h3 className="text-2xl font-bold text-white leading-tight">
                            {title.primary}
                          </h3>
                          {title.secondary && (
                            <p className="text-lg text-zinc-400 mt-1">
                              {title.secondary}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => setShowInfo(false)}
                          className="shrink-0 rounded-full border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-zinc-300 transition-colors hover:text-white"
                        >
                          Hide notes
                        </button>
                      </div>

                      <div className="mb-4 h-px w-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />

                      <div className="space-y-6">
                        {sections.map((sec, i) => (
                          <div key={i}>
                            {sec.heading && (
                              <h4 className="text-sm uppercase tracking-[0.2em] text-purple-300/90 font-semibold mb-3">
                                {sec.heading}
                              </h4>
                            )}
                            {sec.body.split('\n\n').map((p, j) => (
                              <p key={j} className="text-sm leading-[1.7] text-zinc-300/90 mb-3 font-light">
                                {p}
                              </p>
                            ))}
                            {sec.formula && (
                              <div className="my-4 p-3 rounded-xl bg-black/40 border border-purple-500/20">
                                <pre className="text-xs text-purple-200/90 font-mono whitespace-pre-wrap leading-relaxed">
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
                        ))}
                      </div>
                    </motion.aside>
                  )}
                </AnimatePresence>

                {isDesktopLayout && !showInfo && (
                  <div className="lg:w-[26rem] hidden lg:flex items-end">
                    <button
                      onClick={() => setShowInfo(true)}
                      className="glass-dark w-full rounded-3xl px-6 py-5 text-left transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-400"
                    >
                      <p className="text-xs uppercase tracking-[0.3em] text-purple-300/80 mb-2">
                        Artwork notes
                      </p>
                      <p className="text-xl font-semibold text-white">
                        Read what the piece means and how it was made
                      </p>
                      <p className="mt-2 text-sm text-zinc-400">
                        The old flip-card reading experience is back in a calmer, dedicated panel.
                      </p>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
