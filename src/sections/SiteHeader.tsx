import { useRef, useState, type RefObject } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { useOverlayBehavior } from '../hooks/useOverlayBehavior';
import { MobileMenuButton } from './MobileMenuButton';

const NAV_ITEMS = [
  { id: 'work', index: '01', label: 'Work' },
  { id: 'gallery', index: '02', label: 'Archive' },
  { id: 'about', index: '03', label: 'About' },
  { id: 'contact', index: '04', label: 'Contact' },
] as const;

function DiagonalArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19 19 5M8 5h11v11" />
    </svg>
  );
}

interface MobileMenuProps {
  readonly closeButtonRef: RefObject<HTMLButtonElement | null>;
  readonly containerRef: RefObject<HTMLDivElement | null>;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onNavigateToSection: (id: string) => void;
  readonly reducedMotion: boolean;
}

function MobileMenu({
  closeButtonRef,
  containerRef,
  isOpen,
  onClose,
  onNavigateToSection,
  reducedMotion,
}: MobileMenuProps) {
  const navigateToSection = (id: string) => {
    onClose();
    window.setTimeout(() => onNavigateToSection(id), reducedMotion ? 0 : 120);
  };

  return (
    <AnimatePresence initial={false}>
      {isOpen ? (
        <m.div
          ref={containerRef}
          id="mobile-menu"
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
          aria-labelledby="mobile-menu-title"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.24 }}
          className="mobile-menu-overlay"
        >
          <div className="mobile-menu-topline">
            <p id="mobile-menu-title">Index / Whoamiii</p>
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              className="mobile-menu-close"
              aria-label="Close menu"
            >
              <span aria-hidden="true" />
              <span aria-hidden="true" />
            </button>
          </div>

          <nav className="mobile-menu-nav" aria-label="Mobile menu">
            {NAV_ITEMS.map((item, itemIndex) => (
              <m.button
                key={item.id}
                type="button"
                onClick={() => navigateToSection(item.id)}
                className="mobile-menu-link"
                initial={reducedMotion ? false : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.42,
                  delay: reducedMotion ? 0 : 0.05 + itemIndex * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <span className="mobile-menu-index">{item.index}</span>
                <span>{item.label}</span>
                <span className="mobile-menu-arrow"><DiagonalArrow /></span>
              </m.button>
            ))}
          </nav>

          <p className="mobile-menu-location">Oslo — Norway</p>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

interface SiteHeaderProps {
  readonly reducedMotion: boolean;
  readonly onNavigateToSection: (id: string) => void;
}

export function SiteHeader({ reducedMotion, onNavigateToSection }: SiteHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuCloseButtonRef = useRef<HTMLButtonElement>(null);

  useOverlayBehavior({
    isOpen: isMobileMenuOpen,
    containerRef: mobileMenuRef,
    initialFocusRef: mobileMenuCloseButtonRef,
    restoreFocusRef: menuButtonRef,
    onClose: () => setIsMobileMenuOpen(false),
  });

  return (
    <>
      <header
        data-testid="site-header"
        className="site-header"
        aria-hidden={isMobileMenuOpen || undefined}
      >
        <nav className="site-header-nav" aria-label="Primary">
          <a
            href="#main-content"
            className="site-header-wordmark"
            tabIndex={isMobileMenuOpen ? -1 : undefined}
            aria-label="Whoamiii — skip to main content"
          >
            WHOAMIII
          </a>

          <div className="site-header-desktop-nav">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigateToSection(item.id)}
                tabIndex={isMobileMenuOpen ? -1 : undefined}
              >
                <span>{item.index}</span>
                {item.label}
              </button>
            ))}
          </div>

          <MobileMenuButton
            buttonRef={menuButtonRef}
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          />
        </nav>
      </header>

      <MobileMenu
        closeButtonRef={mobileMenuCloseButtonRef}
        containerRef={mobileMenuRef}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onNavigateToSection={onNavigateToSection}
        reducedMotion={reducedMotion}
      />
    </>
  );
}
