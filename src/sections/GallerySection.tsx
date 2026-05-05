import { motion } from 'motion/react';
import InteractiveArtworkCard from '../components/InteractiveArtworkCard';
import { StaggerContainer, StaggerItem } from '../components/StaggerContainer';
import { ShaderHeading } from '../components/ShaderHeading';
import { WorkflowProcessCard } from '../components/WorkflowProcessCard';
import { FEATURED_ARTWORKS } from '../content/featuredArtworks';
import { GALLERY_COPY } from '../content/siteCopy';

interface GallerySectionProps {
  reducedMotion: boolean;
}

export function GallerySection({ reducedMotion }: GallerySectionProps) {
  return (
    <section
      id="work"
      tabIndex={-1}
      className="section-anchor-target relative py-32 px-6 bg-zinc-950 z-20 focus:outline-none"
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
                imageLoading={index === 0 ? 'eager' : 'lazy'}
                imageFetchPriority={index === 0 ? 'auto' : 'low'}
                deferImageUntilVisible={index > 0}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <WorkflowProcessCard reducedMotion={reducedMotion} />
      </div>
    </section>
  );
}
