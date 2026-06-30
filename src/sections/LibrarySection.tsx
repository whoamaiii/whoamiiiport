import { m } from 'motion/react';
import InteractiveArtworkCard from '../components/InteractiveArtworkCard';
import { ShaderHeading } from '../components/ShaderHeading';
import { StaggerContainer, StaggerItem } from '../components/StaggerContainer';
import { LIBRARY_ARTWORKS } from '../content/libraryArtworks';
import { PORTFOLIO_GROUPS } from '../content/portfolioGroups';

interface LibrarySectionProps {
  readonly reducedMotion: boolean;
}

const artworkIndexById = new Map(
  LIBRARY_ARTWORKS.map(({ id }, index) => [id, index] as const),
);

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
          className="mb-8 max-w-[39rem] sm:mb-10"
        >
          <p className="liquid-kicker mb-3 text-[0.68rem] font-semibold uppercase tracking-[0.32em] sm:mb-4">
            Sortert kunstarkiv
          </p>
          <ShaderHeading
            id="gallery-library-heading"
            className="gallery-title"
            as="h2"
            variant="gallery"
          >
            Galleri.
          </ShaderHeading>
          <p className="liquid-support-text mt-5 max-w-[31ch] text-[1.02rem] leading-[1.6] sm:mt-6 sm:max-w-[40ch]">
            Verkene er samlet i kuratoriske grupper. Tydelige duplikater og webkopier er fjernet, mens final- og hovedversjonene ligger igjen.
          </p>
        </m.div>

        <nav
          aria-label="Galleri-grupper"
          className="gallery-group-nav mb-14 flex flex-wrap gap-2 pb-2"
        >
          {PORTFOLIO_GROUPS.map((group) => (
            <a
              key={group.key}
              href={`#gallery-${group.key}`}
              className="inline-flex min-h-11 shrink-0 items-center rounded-full border border-white/14 bg-white/8 px-4 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-cyan-50 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-[border-color,background-color,transform] duration-200 hover:border-cyan-100/45 hover:bg-cyan-100/12 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-zinc-950"
            >
              {group.navLabel}
            </a>
          ))}
        </nav>

        <div className="space-y-20 md:space-y-28">
          {PORTFOLIO_GROUPS.map((group) => {
            const groupArtworks = LIBRARY_ARTWORKS.filter(
              (entry) => entry.group === group.key,
            );

            return (
              <section
                key={group.key}
                id={`gallery-${group.key}`}
                className="section-anchor-target scroll-mt-28"
                aria-labelledby={`gallery-heading-${group.key}`}
              >
                <div className="mb-7 flex flex-col gap-3 border-t border-white/10 pt-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
                  <div className="max-w-[34rem]">
                    <p className="liquid-kicker mb-2 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-cyan-100/70">
                      {groupArtworks.length} verk
                    </p>
                    <h3
                      id={`gallery-heading-${group.key}`}
                      className="font-display text-[2rem] font-black italic leading-[0.95] tracking-[-0.045em] text-stone-50 sm:text-[2.7rem]"
                    >
                      {group.label}
                    </h3>
                  </div>
                  <p className="max-w-[31ch] text-[0.98rem] leading-[1.58] text-stone-200/78 sm:text-right">
                    {group.summary}
                  </p>
                </div>

                <StaggerContainer
                  className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
                  staggerDelay={0.06}
                  mobileFastReveal
                >
                  {groupArtworks.map(({ id, artwork }) => {
                    const artworkIndex = artworkIndexById.get(id) ?? LIBRARY_ARTWORKS.length;

                    return (
                      <StaggerItem key={id} mobileDistance={16}>
                        <InteractiveArtworkCard
                          imageSlug={artwork.imageSlug}
                          videoSrc={artwork.videoSrc}
                          title={artwork.title}
                          sections={artwork.sections}
                          sectionsLang={artwork.sectionsLang ?? 'no'}
                          imageLoading={artworkIndex < 2 ? 'eager' : 'lazy'}
                          imageFetchPriority={artworkIndex < 2 ? 'auto' : 'low'}
                          deferImageUntilVisible={artworkIndex > 1}
                          eyebrowLabel={group.label}
                        />
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
