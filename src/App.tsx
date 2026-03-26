import { useEffect, useState, useRef, lazy, Suspense, type RefObject } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { Instagram, Twitter, Mail, Menu, X } from 'lucide-react';
import { 
  getHeroSrcset, 
  getHeroSizes, 
  getGallerySrcset, 
  getGallerySizes, 
  getImageUrl, 
  getImageMetadata 
} from './utils/images';
import { derSnoenHolderTiden, detAttendeIndre, derVerdenGlir, denSomSerTilbake, type SpecialArtwork } from './components/artworkData';
import { useReducedMotion } from './hooks/useReducedMotion';

const InteractiveArtworkCard = lazy(() => import('./components/InteractiveArtworkCard'));

// Hero image configuration
const HERO_SLUG = 'joetrip2' as const;
const heroMetadata = getImageMetadata(HERO_SLUG);

const specialArtworks: Record<string, SpecialArtwork> = {
  'derSnoen': derSnoenHolderTiden,
  'detAttende': detAttendeIndre,
  'derVerden': derVerdenGlir,
  'denSomSer': denSomSerTilbake,
};

const artworks = [
  { id: 1, title: 'Der snøen holder tiden', url: '', isSpecial: true, dataKey: 'derSnoen' },
  { id: 2, title: 'Det åttende indre', url: '', isSpecial: true, dataKey: 'detAttende' },
  { id: 3, title: 'Der verden glir gjennom sansene', url: '', isSpecial: true, dataKey: 'derVerden' },
  { id: 4, title: 'Den som ser tilbake', url: '', isSpecial: true, dataKey: 'denSomSer' },
];

// Mobile Menu Button Component
function MobileMenuButton({
  isOpen,
  onClick,
  buttonRef,
}: {
  isOpen: boolean;
  onClick: () => void;
  buttonRef: RefObject<HTMLButtonElement | null>;
}) {
  return (
    <button
      ref={buttonRef}
      className="md:hidden text-white hover:text-white p-2"
      onClick={onClick}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      aria-controls="mobile-menu"
    >
      <Menu size={24} />
    </button>
  );
}

// Mobile Menu Component with Focus Trap
function MobileMenu({
  isOpen,
  onClose,
  menuButtonRef,
  reducedMotion,
}: {
  isOpen: boolean;
  onClose: () => void;
  menuButtonRef: RefObject<HTMLButtonElement | null>;
  reducedMotion: boolean;
}) {
  const menuRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const menuTitleId = 'mobile-menu-title';

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    target.scrollIntoView({
      behavior: reducedMotion ? 'auto' : 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    if (!isOpen) return;

    // Store the element that had focus before opening
    previousFocusRef.current = document.activeElement as HTMLElement;
    
    // Focus the close button when menu opens
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 100);

    // Handle Tab key for focus trap and Escape to close
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (e.key === 'Tab' && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll(
          'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => !(el as HTMLElement).hasAttribute('disabled') && !(el as HTMLElement).getAttribute('aria-hidden')
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
    document.documentElement.style.overflow = 'hidden';

    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      menuButtonRef.current?.focus();
      previousFocusRef.current = null;
    };
  }, [isOpen, onClose, menuButtonRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          ref={menuRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-labelledby={menuTitleId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] glass-dark flex flex-col items-center justify-center"
        >
          <h2 id={menuTitleId} className="sr-only">
            Navigation menu
          </h2>
          <button
            ref={closeButtonRef}
            className="absolute top-8 right-8 text-white hover:text-white p-2"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={32} />
          </button>
          <nav className="flex flex-col gap-8 text-2xl font-bold text-center" aria-label="Mobile menu">
            <a 
              href="#work" 
              onClick={(e) => {
                e.preventDefault();
                onClose();
                setTimeout(() => {
                  scrollToSection('work');
                }, 100);
              }} 
              className="text-white/90 hover:text-white hover:text-gradient transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 rounded px-4 py-2"
            >
              Work
            </a>
            <a 
              href="#about" 
              onClick={(e) => {
                e.preventDefault();
                onClose();
                setTimeout(() => {
                  scrollToSection('about');
                }, 100);
              }} 
              className="text-white/90 hover:text-white hover:text-gradient transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 rounded px-4 py-2"
            >
              About
            </a>
            <a 
              href="#contact" 
              onClick={(e) => {
                e.preventDefault();
                onClose();
                setTimeout(() => {
                  scrollToSection('contact');
                }, 100);
              }} 
              className="text-white/90 hover:text-white hover:text-gradient transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 rounded px-4 py-2"
            >
              Contact
            </a>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollY } = useScroll();
  
  // Reduced motion: no parallax on scroll
  const headerY = useTransform(scrollY, [0, 1000], prefersReducedMotion ? [0, 0] : [0, 300]);
  const headerOpacity = useTransform(scrollY, [0, 500], prefersReducedMotion ? [1, 1] : [1, 0]);
  
  // Mouse tracking for parallax (disabled with reduced motion)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });
  
  const parallaxX = useTransform(smoothX, (v) => 
    prefersReducedMotion ? 0 : (v - window.innerWidth / 2) * -0.03
  );
  const parallaxY = useTransform(smoothY, (v) => 
    prefersReducedMotion ? 0 : (v - window.innerHeight / 2) * -0.03
  );

  // Background blob parallax transforms
  const blobX1 = useTransform(smoothX, v => prefersReducedMotion ? 0 : v * 0.05);
  const blobY1 = useTransform(smoothY, v => prefersReducedMotion ? 0 : v * 0.05);
  const blobX2 = useTransform(smoothX, v => prefersReducedMotion ? 0 : v * -0.05);
  const blobY2 = useTransform(smoothY, v => prefersReducedMotion ? 0 : v * -0.05);
  const blobX3 = useTransform(smoothX, v => prefersReducedMotion ? 0 : v * 0.03);
  const blobY3 = useTransform(smoothY, v => prefersReducedMotion ? 0 : v * -0.03);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const heroReveal = (delay = 0) =>
    prefersReducedMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1, delay },
        };
  const sectionReveal = (delay = 0) =>
    prefersReducedMotion
      ? {
          initial: false as const,
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0 },
        }
      : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, delay },
        };

  useEffect(() => {
    if (prefersReducedMotion) return; // Skip mouse tracking with reduced motion
    
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY, prefersReducedMotion]);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-zinc-950 font-sans selection:bg-purple-500/30">
      {/* Skip to content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg"
      >
        Skip to content
      </a>
      
      {/* Interactive Psychedelic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-30 mix-blend-color-dodge opacity-60">
        <motion.div
          className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600 mix-blend-normal filter blur-[100px] animate-blob"
          style={{ x: blobX1, y: blobY1 }}
        />
        <motion.div
          className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-emerald-500 mix-blend-normal filter blur-[100px] animate-blob animation-delay-2000"
          style={{ x: blobX2, y: blobY2 }}
        />
        <motion.div
          className="absolute bottom-[-20%] left-[20%] w-[45vw] h-[45vw] rounded-full bg-pink-600 mix-blend-normal filter blur-[100px] animate-blob animation-delay-4000"
          style={{ x: blobX3, y: blobY3 }}
        />
      </div>

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-7xl px-6 z-50">
        <div className="glass relative overflow-hidden rounded-full px-6 py-4 flex items-center justify-between">
          <div className="absolute inset-0 rounded-full bg-black/35 pointer-events-none" />
          <span className="relative z-10 text-xl font-bold tracking-tighter text-white whitespace-nowrap">Whoamiii<span className="text-purple-400">.</span></span>
          <div className="relative z-10 hidden md:flex gap-8 text-sm font-medium text-white/90">
            <a href="#work" className="hover:text-white transition-colors">Work</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <a href="#contact" className="relative z-10 hidden md:block px-6 py-2 rounded-full text-sm font-medium bg-white text-black hover:bg-zinc-200 transition-colors whitespace-nowrap">
            Get in touch
          </a>
          <MobileMenuButton 
            buttonRef={menuButtonRef}
            isOpen={isMobileMenuOpen} 
            onClick={() => setIsMobileMenuOpen(true)} 
          />
        </div>
      </nav>

      {/* Mobile Menu Overlay with Focus Trap */}
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        menuButtonRef={menuButtonRef}
        reducedMotion={prefersReducedMotion}
      />

      <main id="main-content">
      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden z-10 bg-black">
        {/* Parallax Header Image */}
        <motion.div 
          className="absolute inset-0 z-0 origin-center"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-transparent to-transparent z-10" />
          
          <motion.img
            src={getImageUrl(HERO_SLUG, 1440)}
            srcSet={getHeroSrcset(HERO_SLUG)}
            sizes={getHeroSizes()}
            alt={heroMetadata.alt}
            fetchPriority="high"
            decoding="async"
            className="min-w-[120vw] min-h-[120vh] object-cover object-center absolute -top-[10vh] -left-[10vw] animate-hue-breathe"
            style={{ y: parallaxY, x: parallaxX }}
          />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20">
          {/* Backlight Glow for perfect contrast */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-black/60 filter blur-[100px] rounded-full pointer-events-none -z-10" />
          
          <motion.div
            {...heroReveal(0.2)}
            className="glass-dark inline-block px-10 py-4 rounded-full mb-8 relative border-purple-500/30"
          >
            <span className="inline-block text-2xl md:text-3xl font-bold uppercase text-purple-200 animate-psychedelic-breathe">WHOAMIII</span>
          </motion.div>
          
          <motion.h1 
            {...heroReveal(0.4)}
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none mb-6 text-white drop-shadow-2xl"
          >
            Altered <br className="hidden md:block" />
            <span className="text-gradient">Perceptions.</span>
          </motion.h1>
          
          <motion.p 
            {...heroReveal(0.6)}
            className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-md"
          >
            Exploring the boundaries of consciousness through vibrant colors, intricate patterns, and surreal landscapes.
          </motion.p>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="work" className="relative py-32 px-6 bg-zinc-950 z-20" aria-labelledby="selected-works-heading">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            {...sectionReveal()}
            className="mb-16"
          >
            <h2 id="selected-works-heading" className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Selected Works</h2>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {artworks.map((art, index) => {
              const data = specialArtworks[art.dataKey as string];
              if (!data) return null;
              return (
                <motion.div
                  key={art.id}
                  initial={prefersReducedMotion ? false : { opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: prefersReducedMotion ? '0px' : '-100px' }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: index * 0.1 }}
                >
                  <Suspense fallback={<div className="aspect-[4/5] rounded-3xl glass p-2 animate-pulse bg-zinc-800/50" />}>
                    <InteractiveArtworkCard 
                      imageSlug={data.imageSlug} 
                      title={data.title}
                      sections={data.sections} 
                    />
                  </Suspense>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-32 px-6 bg-zinc-950 z-20">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
            {/* Inner glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-[80px] -translate-y-1/2 translate-x-1/2" />
            
            <div className="grid md:grid-cols-2 gap-16 relative z-10">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">The Mind Behind the Canvas</h2>
                <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                  My work is deeply influenced by the exploration of altered states of consciousness. I aim to capture the fleeting, geometric, and profoundly vibrant visions that exist just beyond our everyday perception.
                </p>
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  Using a mix of traditional painting and digital manipulation, I create pieces that feel both organic and synthetic, inviting the viewer to step into a different reality.
                </p>
                <div className="flex gap-4">
                  <a href="https://instagram.com/whoamiii" target="_blank" rel="noopener noreferrer" className="glass w-12 h-12 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all shadow-lg text-zinc-300 hover:text-white" aria-label="Instagram">
                    <Instagram size={20} />
                  </a>
                  <a href="https://twitter.com/whoamiii" target="_blank" rel="noopener noreferrer" className="glass w-12 h-12 rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all shadow-lg text-zinc-300 hover:text-white" aria-label="Twitter">
                    <Twitter size={20} />
                  </a>
                </div>
              </div>
              <div className="relative aspect-square rounded-3xl overflow-hidden glass p-2">
                <img
                  src="https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=800&auto=format&fit=crop"
                  alt="Artist in studio"
                  loading="lazy"
                  decoding="async"
                  width={800}
                  height={800}
                  className="w-full h-full object-cover rounded-2xl filter contrast-125 saturate-150"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-32 px-6 bg-zinc-950 z-20">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={prefersReducedMotion ? { duration: 0 } : undefined}
            className="glass-dark rounded-[3rem] p-12 md:p-20 relative pointer-events-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6 relative z-10">Let's Create Something <span className="text-gradient">Trippy.</span></h2>
            <p className="text-xl text-zinc-400 mb-10 relative z-10">Open for commissions, collaborations, and exhibitions.</p>
            
            <a href="mailto:hello@whoamiii.art" className="group relative z-10 inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg overflow-hidden transition-transform hover:scale-105 pointer-events-auto">
              <span className="relative z-10 flex items-center gap-2">
                <Mail size={20} />
                Send a Message
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-20 border-t border-white/10 pt-16 pb-8 px-6 flex flex-col items-center bg-zinc-950">
        <div className="flex gap-6 mb-8">
          <a href="https://instagram.com/whoamiii" target="_blank" rel="noopener noreferrer" className="p-3 glass rounded-full hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all text-zinc-400 hover:text-white" aria-label="Instagram">
            <Instagram size={24} />
          </a>
          <a href="https://twitter.com/whoamiii" target="_blank" rel="noopener noreferrer" className="p-3 glass rounded-full hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all text-zinc-400 hover:text-white" aria-label="Twitter">
            <Twitter size={24} />
          </a>
          <a href="mailto:hello@whoamiii.art" className="p-3 glass rounded-full hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:border-transparent transition-all text-zinc-400 hover:text-white" aria-label="Email">
            <Mail size={24} />
          </a>
        </div>
        <p className="text-zinc-500 text-sm">© {new Date().getFullYear()} Artist Portfolio. All rights reserved.</p>
      </footer>
      </main>
    </div>
  );
}
