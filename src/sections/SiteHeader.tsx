import { useRef, useState, type RefObject } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useOverlayBehavior } from '../hooks/useOverlayBehavior';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
}

function MobileMenuButton({
  isOpen,
  onClick,
  buttonRef,
}: MobileMenuButtonProps) {
  const triggerLabel = isOpen ? 'Close navigation menu' : 'Open menu';

  return (
    <button
      ref={buttonRef}
      className="site-header-menu-trigger focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
      onClick={onClick}
      aria-label={triggerLabel}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
      aria-controls={isOpen ? 'mobile-menu' : undefined}
      data-open={isOpen ? 'true' : 'false'}
    >
      <span className="site-header-menu-trigger-lines" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </button>
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSection: (id: string) => void;
  reducedMotion: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

function MobileMenu({
  isOpen,
  onClose,
  onNavigateToSection,
  reducedMotion,
  containerRef,
}: MobileMenuProps) {
  const menuTitleId = 'mobile-menu-title';

  const navigateToSection = (id: string) => {
    onClose();
    window.setTimeout(() => {
      onNavigateToSection(id);
    }, reducedMotion ? 0 : 120);
  };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          ref={containerRef}
          id="mobile-menu"
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
          aria-labelledby={menuTitleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-zinc-950/94 px-6 backdrop-blur-2xl"
        >
          <h2 id={menuTitleId} className="sr-only">
            Navigation menu
          </h2>
          <div className="flex w-full max-w-sm flex-col gap-5 text-center">
            <nav className="flex flex-col gap-4 text-center" aria-label="Mobile menu">
              <button
                type="button"
                onClick={() => navigateToSection('work')}
                className="rounded-[1.1rem] border border-white/10 bg-white/7 px-4 py-3 text-xl font-medium text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-[border-color,background-color,color,transform] duration-200 hover:border-cyan-100/36 hover:bg-cyan-100/10 hover:text-white active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-200"
              >
                Work
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('gallery')}
                className="rounded-[1.1rem] border border-white/10 bg-white/7 px-4 py-3 text-xl font-medium text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-[border-color,background-color,color,transform] duration-200 hover:border-cyan-100/36 hover:bg-cyan-100/10 hover:text-white active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-200"
              >
                Gallery
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('about')}
                className="rounded-[1.1rem] border border-white/10 bg-white/7 px-4 py-3 text-xl font-medium text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-[border-color,background-color,color,transform] duration-200 hover:border-cyan-100/36 hover:bg-cyan-100/10 hover:text-white active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-200"
              >
                About
              </button>
            </nav>

            <button
              type="button"
              onClick={() => navigateToSection('contact')}
              className="w-full rounded-full border border-cyan-100/45 bg-cyan-200 px-6 py-4 text-base font-semibold uppercase tracking-[0.18em] text-zinc-950 shadow-[0_16px_42px_-24px_rgba(34,211,238,0.62),inset_0_1px_0_rgba(255,255,255,0.6)] transition-[background-color,transform,box-shadow] duration-200 hover:bg-cyan-100 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              Get in touch
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface SiteHeaderProps {
  reducedMotion: boolean;
  onNavigateToSection: (id: string) => void;
}

export function SiteHeader({ reducedMotion, onNavigateToSection }: SiteHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useOverlayBehavior({
    isOpen: isMobileMenuOpen,
    containerRef: mobileMenuRef,
    initialFocusRef: menuButtonRef,
    restoreFocusRef: menuButtonRef,
    onClose: () => setIsMobileMenuOpen(false),
  });

  return (
    <div>
      <nav
        aria-label="Primary"
        data-testid="site-header"
        className={`absolute top-4 left-1/2 w-full max-w-[100rem] -translate-x-1/2 px-4 sm:top-5 sm:px-6 md:top-6 md:px-12 ${
          isMobileMenuOpen ? 'z-[70]' : 'z-50'
        }`}
      >
        <div className="site-header-bar">
          <motion.a
            href="#main-content"
            aria-label="Whoamiii — jump to main content"
            className="site-header-wordmark cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-lg"
            aria-hidden={isMobileMenuOpen || undefined}
            tabIndex={isMobileMenuOpen ? -1 : undefined}
            whileHover={reducedMotion ? undefined : { scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <span className="site-header-wordmark-text">WHOAMIII</span>
          </motion.a>

          <div className="site-header-actions">
            <button
              type="button"
              onClick={() => onNavigateToSection('work')}
              className="site-header-work-pill focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              aria-hidden={isMobileMenuOpen || undefined}
              tabIndex={isMobileMenuOpen ? -1 : undefined}
            >
              <span className="site-header-work-pill-text">Work</span>
              <span className="pill-arrow" aria-hidden="true">&rarr;</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToSection('gallery')}
              className="site-header-gallery-pill focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              aria-hidden={isMobileMenuOpen || undefined}
              tabIndex={isMobileMenuOpen ? -1 : undefined}
            >
              <span>Gallery</span>
            </button>
            <MobileMenuButton
              buttonRef={menuButtonRef}
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
            />
          </div>
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigateToSection={onNavigateToSection}
        reducedMotion={reducedMotion}
        containerRef={mobileMenuRef}
      />
    </div>
  );
}
