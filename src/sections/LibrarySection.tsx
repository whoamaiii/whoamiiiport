import { m } from 'motion/react';
import InteractiveArtworkCard from '../components/InteractiveArtworkCard';
import { ShaderHeading } from '../components/ShaderHeading';
import { StaggerContainer, StaggerItem } from '../components/StaggerContainer';
import { LIBRARY_ARTWORKS } from '../content/libraryArtworks';

interface LibrarySectionProps {
  readonly reducedMotion: boolean;
}

export function LibrarySection({ reducedMotion }: LibrarySectionProps) {
  return (
    <section
      id="gallery"
      tabIndex={-1}
      className="section-anchor-target relative z-20 bg-zinc-950 px-5 py-20 focus:outline-none sm:px-6 md:py-32"
      aria-labelledby="gallery-library-heading"
    >
      <div className="mx-auto max-w-7xl">
        <m.div
          initial={reducedMotion ? false : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
          }
          className="mb-12 max-w-[39rem] sm:mb-16"
        >
          <p className="liquid-kicker mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.32em] sm:mb-4">
            Full artwork library
          </p>
          <ShaderHeading
            id="gallery-library-heading"
            className="gallery-title"
            as="h2"
            variant="gallery"
          >
            Gallery.
          </ShaderHeading>
          <p className="liquid-support-text mt-5 max-w-[30ch] text-[1.02rem] leading-[1.6] sm:mt-6 sm:max-w-[36ch]">
            The broader archive: stills, moving studies, texture experiments, and altered-state fragments.
          </p>
        </m.div>

        <StaggerContainer
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
          staggerDelay={0.075}
          mobileFastReveal
        >
          {LIBRARY_ARTWORKS.map(({ id, artwork }, index) => (
            <StaggerItem key={id} mobileDistance={16}>
              <InteractiveArtworkCard
                imageSlug={artwork.imageSlug}
                videoSrc={artwork.videoSrc}
                title={artwork.title}
                sections={artwork.sections}
                sectionsLang={artwork.sectionsLang}
                imageLoading={index < 2 ? 'eager' : 'lazy'}
                imageFetchPriority={index < 2 ? 'auto' : 'low'}
                deferImageUntilVisible={index > 1}
                eyebrowLabel="Archive piece"
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
