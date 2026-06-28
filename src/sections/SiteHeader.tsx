import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { LiquidGlassCard, type LiquidGlassSettings } from '@ogtirth/liquid-glass-oss';
import { X } from 'lucide-react';
import { useOverlayBehavior } from '../hooks/useOverlayBehavior';
import { getImageUrl } from '../utils/images';

const MOBILE_MENU_GLASS_BACKGROUND = getImageUrl('liquid-perception-hero', 720);
const MOBILE_MENU_GLASS_SETTINGS = {
  blur: 0.34, refraction: 0.34, chromaticAberration: 0.032, distortion: 0.014,
  edgeHighlight: 0.14, specular: 0.16, fresnel: 1.02, depth: 38,
  brightness: -0.08, saturation: -0.04, darkTint: 0.48, tintStrength: 0.12,
  opacity: 1, liquidMotion: 0.08, liquidSpring: 0.048, liquidDamping: 0.88,
} satisfies Partial<LiquidGlassSettings>;

function supportsWebGlRendering(): boolean {
  const canvas = document.createElement('canvas');
  return Boolean(
    canvas.getContext('webgl')
    || canvas.getContext('experimental-webgl'),
  );
}

function useWebGlSupport(): boolean | null {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setIsSupported(supportsWebGlRendering());
  }, []);

  return isSupported;
}

function MobileMenuLiquidPanel({ children }: { readonly children: ReactNode }) {
  const supportsWebGl = useWebGlSupport();

  if (supportsWebGl) {
    return (
      <LiquidGlassCard
        backgroundImage={MOBILE_MENU_GLASS_BACKGROUND}
        className="mobile-menu-liquid-panel"
        settings={MOBILE_MENU_GLASS_SETTINGS}
        variant="dark"
      >
        {children}
      </LiquidGlassCard>
    );
  }

  return (
    <section className="mobile-menu-liquid-panel mobile-menu-liquid-panel--fallback">
      <span className="mobile-menu-liquid-fallback-sheen" aria-hidden="true" />
      <div className="lg-card__content">{children}</div>
    </section>
  );
}

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
  const triggerLabel = isOpen ? 'Lukk navigasjonsmeny' : 'Åpne meny';

  return (
    <button
      ref={buttonRef}
      type="button"
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
  closeButtonRef: RefObject<HTMLButtonElement | null>;
  containerRef?: React.RefObject<HTMLDivElement | null>;
}

function MobileMenu({
  isOpen,
  onClose,
  onNavigateToSection,
  reducedMotion,
  closeButtonRef,
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
        <m.div
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
            Navigasjonsmeny
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/14 bg-white/8 text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-xl transition-[border-color,background-color,transform] duration-200 hover:border-cyan-100/38 hover:bg-cyan-100/10 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-zinc-950"
            aria-label="Lukk meny"
          >
            <X size={20} strokeWidth={1.8} aria-hidden="true" />
          </button>
          <MobileMenuLiquidPanel>
            <div className="mobile-menu-liquid-content">
              <nav className="flex flex-col gap-4 text-center" aria-label="Mobilmeny">
                <button
                  type="button"
                  onClick={() => navigateToSection('work')}
                  className="mobile-menu-liquid-link"
                >
                  Verk
                </button>
                <button
                  type="button"
                  onClick={() => navigateToSection('gallery')}
                  className="mobile-menu-liquid-link"
                >
                  Galleri
                </button>
                <button
                  type="button"
                  onClick={() => navigateToSection('about')}
                  className="mobile-menu-liquid-link"
                >
                  Om
                </button>
              </nav>

              <button
                type="button"
                onClick={() => navigateToSection('contact')}
                className="mobile-menu-liquid-cta"
              >
                Ta kontakt
              </button>
            </div>
          </MobileMenuLiquidPanel>
        </m.div>
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
  const mobileMenuCloseButtonRef = useRef<HTMLButtonElement>(null);

  useOverlayBehavior({
    isOpen: isMobileMenuOpen,
    containerRef: mobileMenuRef,
    initialFocusRef: mobileMenuCloseButtonRef,
    restoreFocusRef: menuButtonRef,
    onClose: () => setIsMobileMenuOpen(false),
  });

  return (
    <div>
      <nav
        aria-label="Primær"
        data-testid="site-header"
        className={`absolute top-4 left-1/2 w-full max-w-[100rem] -translate-x-1/2 px-4 sm:top-5 sm:px-6 md:top-6 md:px-12 ${
          isMobileMenuOpen ? 'z-[70]' : 'z-50'
        }`}
      >
        <div className="site-header-bar">
          <m.a
            href="#main-content"
            aria-label="Whoamiii — hopp til hovedinnhold"
            className="site-header-wordmark cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 rounded-lg"
            aria-hidden={isMobileMenuOpen || undefined}
            tabIndex={isMobileMenuOpen ? -1 : undefined}
            whileHover={reducedMotion ? undefined : { scale: 1.04 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <span className="site-header-wordmark-text">WHOAMIII</span>
          </m.a>

          <div className="site-header-actions">
            <button
              type="button"
              onClick={() => onNavigateToSection('work')}
              className="site-header-work-pill focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              aria-hidden={isMobileMenuOpen || undefined}
              tabIndex={isMobileMenuOpen ? -1 : undefined}
            >
              <span className="site-header-work-pill-text">Verk</span>
              <span className="pill-arrow" aria-hidden="true">&rarr;</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateToSection('gallery')}
              className="site-header-gallery-pill focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200"
              aria-hidden={isMobileMenuOpen || undefined}
              tabIndex={isMobileMenuOpen ? -1 : undefined}
            >
              <span>Galleri</span>
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
        closeButtonRef={mobileMenuCloseButtonRef}
        containerRef={mobileMenuRef}
      />
    </div>
  );
}
