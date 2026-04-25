import { Suspense, lazy } from 'react';
import { motion } from 'motion/react';
import { StaggerContainer, StaggerItem } from '../components/StaggerContainer';
import { ShaderHeading } from '../components/ShaderHeading';
import { FEATURED_ARTWORKS } from '../content/featuredArtworks';
import { GALLERY_COPY } from '../content/siteCopy';

const InteractiveArtworkCard = lazy(() => import('../components/InteractiveArtworkCard'));

interface GallerySectionProps {
  reducedMotion: boolean;
}

export function GallerySection({ reducedMotion }: GallerySectionProps) {
  return (
    <section
      id="work"
      tabIndex={-1}
      className="section-anchor-target deferred-section relative py-32 px-6 bg-zinc-950 z-20 focus:outline-none"
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
            <p className="gallery-eyebrow mb-3 sm:mb-4">{GALLERY_COPY.eyebrow}</p>
            <ShaderHeading
              id="selected-works-heading"
              className="gallery-title"
              as="h2"
              variant="gallery"
            >
              {GALLERY_COPY.heading}
            </ShaderHeading>
            <p className="gallery-subtitle mt-5 max-w-[27ch] sm:mt-6 sm:max-w-[29ch]">
              {GALLERY_COPY.subtitle}
            </p>
          </motion.div>
        </div>

        <StaggerContainer
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
          staggerDelay={0.15}
        >
          {FEATURED_ARTWORKS.map(({ id, artwork }) => (
            <Suspense
              key={id}
              fallback={<div className="aspect-[4/5] rounded-3xl glass p-2 animate-pulse bg-zinc-800/50" />}
            >
              <StaggerItem>
                <InteractiveArtworkCard
                  imageSlug={artwork.imageSlug}
                  videoSrc={artwork.videoSrc}
                  title={artwork.title}
                  sections={artwork.sections}
                />
              </StaggerItem>
            </Suspense>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

export default GallerySection;
