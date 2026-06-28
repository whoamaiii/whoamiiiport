import { motion } from 'motion/react';
import InteractiveArtworkCard from '../components/InteractiveArtworkCard';
import { StaggerContainer, StaggerItem } from '../components/StaggerContainer';
import { ShaderHeading } from '../components/ShaderHeading';
import { WorkflowProcessCard } from '../components/WorkflowProcessCard';
import { FEATURED_ARTWORKS } from '../content/featuredArtworks';
import { GALLERY_COPY } from '../content/siteCopy';

interface GallerySectionProps {
  reducedMotion: boolean;
  onNavigateToSection?: (id: string) => void;
}

export function GallerySection({
  reducedMotion,
  onNavigateToSection,
}: GallerySectionProps) {
  return (
    <section
      id="work"
      tabIndex={-1}
      className="section-anchor-target relative px-6 py-20 bg-zinc-950 z-20 focus:outline-none md:py-32"
      aria-labelledby="selected-works-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mx-auto mb-16 max-w-5xl">
          <motion.div
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="gallery-lockup max-w-[38rem]"
          >
            <p className="gallery-eyebrow liquid-kicker mb-3 sm:mb-4">{GALLERY_COPY.eyebrow}</p>
            <ShaderHeading
              id="selected-works-heading"
              className="gallery-title"
              as="h2"
              variant="gallery"
            >
              {GALLERY_COPY.heading}
            </ShaderHeading>
            <p className="gallery-subtitle liquid-support-text mt-5 max-w-[27ch] sm:mt-6 sm:max-w-[29ch]">
              {GALLERY_COPY.subtitle}
            </p>
          </motion.div>
        </div>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          staggerDelay={0.15}
          mobileFastReveal
        >
          {FEATURED_ARTWORKS.map(({ id, artwork }, index) => (
            <StaggerItem key={id} mobileDistance={16}>
              <InteractiveArtworkCard
                imageSlug={artwork.imageSlug}
                videoSrc={artwork.videoSrc}
                title={artwork.title}
                sections={artwork.sections}
                sectionsLang={artwork.sectionsLang}
                imageLoading={index === 0 ? 'eager' : 'lazy'}
                imageFetchPriority={index === 0 ? 'auto' : 'low'}
                deferImageUntilVisible={index > 0}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.45, delay: 0.1 }}
          className="mx-auto mt-10 flex max-w-5xl justify-start sm:justify-center"
        >
          <button
            type="button"
            onClick={() => onNavigateToSection?.('gallery')}
            className="group inline-flex min-h-12 items-center gap-3 rounded-full border border-cyan-100/35 bg-white/8 px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-[border-color,background-color,transform] duration-200 hover:border-cyan-100/55 hover:bg-cyan-100/12 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-zinc-950"
          >
            Open full gallery
            <span
              aria-hidden="true"
              className="transition-transform duration-200 group-hover:translate-x-1"
            >
              &rarr;
            </span>
          </button>
        </motion.div>

        <WorkflowProcessCard reducedMotion={reducedMotion} />
      </div>
    </section>
  );
}
