import { useRef, useState, type RefObject } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useOverlayBehavior } from '../hooks/useOverlayBehavior';

const HEADER_GLASS_PATH = [
  'M 100 30',
  'H 430',
  'C 486 30 518 52 540 78',
  'C 558 99 584 105 628 105',
  'H 1328',
  'C 1374 105 1398 96 1416 72',
  'C 1446 32 1478 20 1524 20',
  'A 70 70 0 1 1 1524 160',
  'C 1478 160 1446 148 1416 108',
  'C 1398 84 1374 75 1328 75',
  'H 628',
  'C 584 75 558 81 540 102',
  'C 518 128 486 150 430 150',
  'H 100',
  'C 56 150 25 124 25 90',
  'C 25 56 56 30 100 30',
  'Z',
].join(' ');

const MOBILE_HEADER_GLASS_PATH = [
  'M 43 13',
  'H 135',
  'C 151 13 160 21 167 32',
  'C 173 40 180 43 194 43',
  'H 300',
  'C 313 43 318 39 324 29',
  'C 334 13 347 8 362 8',
  'A 35 35 0 1 1 362 78',
  'C 347 78 334 73 324 57',
  'C 318 47 313 43 300 43',
  'H 194',
  'C 180 43 173 46 167 54',
  'C 160 67 151 75 135 75',
  'H 43',
  'C 22 75 8 62 8 44',
  'C 8 26 22 13 43 13',
  'Z',
].join(' ');

interface HeaderGlassSvgProps {
  className: string;
  edgeGradientId: string;
  fillGradientId: string;
  innerEdgeGradientId: string;
  menuLines: {
    centerX: number;
    centerY: number;
    gap: number;
    width: number;
  };
  path: string;
  reducedMotion: boolean;
  railPath: string;
  viewBox: string;
}

function HeaderGlassSvg({
  className,
  edgeGradientId,
  fillGradientId,
  innerEdgeGradientId,
  menuLines,
  path,
  reducedMotion,
  railPath,
  viewBox,
}: HeaderGlassSvgProps) {
  const lineStart = menuLines.centerX - menuLines.width / 2;
  const lineEnd = menuLines.centerX + menuLines.width / 2;
  const liquidEdgeGradientId = `${edgeGradientId}-liquid`;
  const liquidCausticGradientId = `${edgeGradientId}-liquid-caustic`;
  const liquidPrismGradientId = `${edgeGradientId}-liquid-prism`;
  const liquidRailGradientId = `${edgeGradientId}-liquid-rail`;
  const liquidRailCausticGradientId = `${edgeGradientId}-liquid-rail-caustic`;

  return (
    <svg
      className={className}
      viewBox={viewBox}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={fillGradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.16)" />
          <stop offset="35%" stopColor="rgba(39,34,42,0.72)" />
          <stop offset="100%" stopColor="rgba(16,15,17,0.72)" />
        </linearGradient>
        <linearGradient id={edgeGradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(231,188,255,0.86)" />
          <stop offset="20%" stopColor="rgba(255,255,255,0.66)" />
          <stop offset="56%" stopColor="rgba(255,255,255,0.22)" />
          <stop offset="82%" stopColor="rgba(172,122,230,0.62)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.76)" />
        </linearGradient>
        <linearGradient id={innerEdgeGradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0.42)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.11)" />
          <stop offset="100%" stopColor="rgba(195,130,239,0.42)" />
        </linearGradient>
        <linearGradient
          id={liquidEdgeGradientId}
          x1="-0.4"
          y1="0"
          x2="1.4"
          y2="0"
          spreadMethod="reflect"
        >
          <stop offset="0%" stopColor="rgba(55,122,170,0.08)" />
          <stop offset="14%" stopColor="rgba(89,206,230,0.52)" />
          <stop offset="28%" stopColor="rgba(224,205,168,0.62)" />
          <stop offset="43%" stopColor="rgba(178,95,61,0.42)" />
          <stop offset="58%" stopColor="rgba(90,76,150,0.34)" />
          <stop offset="76%" stopColor="rgba(213,188,143,0.58)" />
          <stop offset="100%" stopColor="rgba(78,177,214,0.1)" />
          {!reducedMotion && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-0.34 0;0.28 0;-0.34 0"
              dur="6.6s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
        <linearGradient
          id={liquidPrismGradientId}
          x1="-0.5"
          y1="0.18"
          x2="1.5"
          y2="0.82"
          spreadMethod="reflect"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="10%" stopColor="rgba(255,255,255,0.42)" />
          <stop offset="19%" stopColor="rgba(96,210,237,0.7)" />
          <stop offset="31%" stopColor="rgba(255,213,151,0.54)" />
          <stop offset="45%" stopColor="rgba(202,126,255,0.34)" />
          <stop offset="62%" stopColor="rgba(36,75,139,0.32)" />
          <stop offset="78%" stopColor="rgba(248,239,217,0.62)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          {!reducedMotion && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-0.48 0;0.34 0;-0.48 0"
              dur="7.2s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
        <linearGradient
          id={liquidCausticGradientId}
          x1="-0.25"
          y1="0"
          x2="1.25"
          y2="0"
          spreadMethod="reflect"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="12%" stopColor="rgba(128,224,246,0.88)" />
          <stop offset="20%" stopColor="rgba(255,244,205,0.94)" />
          <stop offset="29%" stopColor="rgba(255,255,255,0)" />
          <stop offset="48%" stopColor="rgba(214,124,80,0.66)" />
          <stop offset="58%" stopColor="rgba(255,255,255,0)" />
          <stop offset="74%" stopColor="rgba(181,138,232,0.54)" />
          <stop offset="86%" stopColor="rgba(255,255,255,0.66)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          {!reducedMotion && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="0.38 0;-0.24 0;0.38 0"
              dur="4.9s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
        <linearGradient
          id={liquidRailGradientId}
          x1="-0.2"
          y1="0"
          x2="1.2"
          y2="0"
          spreadMethod="reflect"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="22%" stopColor="rgba(93,210,238,0.42)" />
          <stop offset="46%" stopColor="rgba(236,213,174,0.48)" />
          <stop offset="66%" stopColor="rgba(183,98,61,0.28)" />
          <stop offset="86%" stopColor="rgba(255,255,255,0.42)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          {!reducedMotion && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="0.24 0;-0.24 0;0.24 0"
              dur="5.8s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
        <linearGradient
          id={liquidRailCausticGradientId}
          x1="-0.25"
          y1="0"
          x2="1.25"
          y2="0"
          spreadMethod="reflect"
        >
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="18%" stopColor="rgba(111,220,246,0.78)" />
          <stop offset="35%" stopColor="rgba(255,236,188,0.86)" />
          <stop offset="52%" stopColor="rgba(255,255,255,0)" />
          <stop offset="70%" stopColor="rgba(210,124,79,0.52)" />
          <stop offset="86%" stopColor="rgba(244,230,255,0.62)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          {!reducedMotion && (
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              values="-0.3 0;0.32 0;-0.3 0"
              dur="4.4s"
              repeatCount="indefinite"
            />
          )}
        </linearGradient>
      </defs>
      <path className="site-reference-glass-fill" d={path} style={{ fill: `url(#${fillGradientId})` }} />
      <path className="site-reference-glass-edge site-reference-glass-edge--halo" d={path} style={{ stroke: `url(#${edgeGradientId})` }} />
      <path className="site-reference-glass-edge site-reference-glass-edge--liquid-glow" d={path} style={{ stroke: `url(#${liquidPrismGradientId})` }} />
      <path className="site-reference-glass-edge" d={path} style={{ stroke: `url(#${edgeGradientId})` }} />
      <path className="site-reference-glass-edge site-reference-glass-edge--inner" d={path} style={{ stroke: `url(#${innerEdgeGradientId})` }} />
      <path className="site-reference-glass-edge site-reference-glass-edge--liquid" d={path} style={{ stroke: `url(#${liquidEdgeGradientId})` }} />
      <path className="site-reference-glass-edge site-reference-glass-edge--liquid-caustic" d={path} style={{ stroke: `url(#${liquidCausticGradientId})` }}>
        {!reducedMotion && (
          <animate attributeName="stroke-dashoffset" values="0;-420" dur="6.1s" repeatCount="indefinite" />
        )}
      </path>
      <path className="site-reference-rail-light" d={railPath} />
      <path className="site-reference-rail-light site-reference-rail-light--liquid-glow" d={railPath} style={{ stroke: `url(#${liquidPrismGradientId})` }} />
      <path className="site-reference-rail-light site-reference-rail-light--liquid" d={railPath} style={{ stroke: `url(#${liquidRailGradientId})` }} />
      <path className="site-reference-rail-light site-reference-rail-light--liquid-caustic" d={railPath} style={{ stroke: `url(#${liquidRailCausticGradientId})` }}>
        {!reducedMotion && (
          <animate attributeName="stroke-dashoffset" values="0;-190" dur="4.6s" repeatCount="indefinite" />
        )}
      </path>
      <g className="site-reference-menu-lines" data-testid="site-header-menu-lines">
        <line x1={lineStart} x2={lineEnd} y1={menuLines.centerY - menuLines.gap} y2={menuLines.centerY - menuLines.gap} />
        <line x1={lineStart} x2={lineEnd} y1={menuLines.centerY} y2={menuLines.centerY} />
        <line x1={lineStart} x2={lineEnd} y1={menuLines.centerY + menuLines.gap} y2={menuLines.centerY + menuLines.gap} />
      </g>
    </svg>
  );
}

function HeaderWordmark() {
  return (
    <span className="site-reference-wordmark-live" aria-hidden="true">
      WHOAMIII
    </span>
  );
}

function HeaderGlassSurface({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <>
      <HeaderGlassSvg
        className="site-reference-glass-surface site-reference-glass-surface--desktop"
        edgeGradientId="site-header-edge-desktop"
        fillGradientId="site-header-fill-desktop"
        innerEdgeGradientId="site-header-inner-edge-desktop"
        menuLines={{ centerX: 1524, centerY: 90, gap: 18, width: 50 }}
        path={HEADER_GLASS_PATH}
        reducedMotion={reducedMotion}
        railPath="M 574 91 H 1368"
        viewBox="0 0 1600 180"
      />
      <HeaderGlassSvg
        className="site-reference-glass-surface site-reference-glass-surface--mobile"
        edgeGradientId="site-header-edge-mobile"
        fillGradientId="site-header-fill-mobile"
        innerEdgeGradientId="site-header-inner-edge-mobile"
        menuLines={{ centerX: 362, centerY: 43, gap: 8, width: 24 }}
        path={MOBILE_HEADER_GLASS_PATH}
        reducedMotion={reducedMotion}
        railPath="M 174 43 H 322"
        viewBox="0 0 390 88"
      />
    </>
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
  const triggerLabel = isOpen ? 'Close menu' : 'Open menu';

  return (
    <button
      ref={buttonRef}
      className="site-reference-menu-trigger absolute grid place-items-center rounded-full text-white transition-transform duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-purple-300"
      onClick={onClick}
      aria-label={triggerLabel}
      aria-expanded={isOpen}
      aria-haspopup="dialog"
    />
  );
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  reducedMotion: boolean;
}

function MobileMenu({
  isOpen,
  onClose,
  menuButtonRef,
  reducedMotion,
}: MobileMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const menuTitleId = 'mobile-menu-title';

  useOverlayBehavior({
    isOpen,
    containerRef: menuRef,
    initialFocusRef: closeButtonRef,
    restoreFocusRef: menuButtonRef,
    onClose,
  });

  const navigateToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) {
      onClose();
      return;
    }

    onClose();
    window.setTimeout(() => {
      target.scrollIntoView({
        behavior: reducedMotion ? 'auto' : 'smooth',
        block: 'start',
      });
      target.focus({ preventScroll: true });
    }, reducedMotion ? 0 : 120);
  };

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          ref={menuRef}
          id="mobile-menu"
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
          aria-labelledby={menuTitleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/92 px-6 backdrop-blur-2xl"
        >
          <h2 id={menuTitleId} className="sr-only">
            Navigation menu
          </h2>
          <button
            ref={closeButtonRef}
            className="absolute top-5 right-5 rounded-full p-2 text-white transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 sm:top-6 sm:right-6"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={32} />
          </button>
          <div className="flex w-full max-w-sm flex-col gap-5 text-center">
            <nav className="flex flex-col gap-4 text-center" aria-label="Mobile menu">
              <button
                type="button"
                onClick={() => navigateToSection('work')}
                className="rounded-2xl px-4 py-3 text-xl font-medium text-white/90 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                Work
              </button>
              <button
                type="button"
                onClick={() => navigateToSection('about')}
                className="rounded-2xl px-4 py-3 text-xl font-medium text-white/90 transition-colors hover:text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                About
              </button>
            </nav>

            <button
              type="button"
              onClick={() => navigateToSection('contact')}
              className="w-full rounded-full bg-white px-6 py-4 text-base font-semibold text-black transition-colors hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black"
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
}

export function SiteHeader({ reducedMotion }: SiteHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <nav
        aria-label="Primary"
        data-testid="site-header"
        className="absolute top-3 left-1/2 z-50 w-full max-w-[100rem] -translate-x-1/2 px-3 sm:top-4 sm:px-5 md:top-6 md:px-12"
      >
        <div className="site-reference-nav relative mx-auto">
          <HeaderGlassSurface reducedMotion={reducedMotion} />
          <motion.a
            href="#main-content"
            aria-label="Whoamiii — jump to main content"
            className="site-reference-wordmark absolute top-1/2 z-10 flex -translate-y-1/2 cursor-pointer items-center justify-center text-white"
            whileHover={reducedMotion ? undefined : { scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          >
            <HeaderWordmark />
          </motion.a>
          <MobileMenuButton
            buttonRef={menuButtonRef}
            isOpen={isMobileMenuOpen}
            onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
          />
        </div>
      </nav>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        menuButtonRef={menuButtonRef}
        reducedMotion={reducedMotion}
      />
    </>
  );
}

export default SiteHeader;
