import { useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import InteractiveArtworkCard from '../components/InteractiveArtworkCard';
import { LIBRARY_ARTWORKS, getLibraryArtworkEntry } from '../content/libraryArtworks';
import { PORTFOLIO_GROUPS } from '../content/portfolioGroups';
import {
  getGalleryAvifSrcset,
  getGalleryImageUrl,
  getGallerySrcset,
  getImageMetadata,
} from '../utils/images';

interface LibrarySectionProps {
  readonly reducedMotion: boolean;
}

const ARCHIVE_LEAD_IDS = {
  'liminal-rooms': 'textile-corridor',
  'domestic-ecosystems': 'living-floor',
  'hand-portals': 'mushroom-offering',
  'sink-organisms': 'forensic-hand-mouth',
  'tongue-terrain': 'tongue-terrain',
  'threshold-studies': 'threshold-witness',
} as const;

const ARCHIVE_FRAME_SEQUENCE = ['portrait', 'square', 'landscape', 'tall'] as const;

function DiagonalArrow({ open = false }: { readonly open?: boolean }) {
  return (
    <svg className={open ? 'is-open' : undefined} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19 19 5M8 5h11v11" />
    </svg>
  );
}

export function LibrarySection({ reducedMotion }: LibrarySectionProps) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  return (
    <section
      id="gallery"
      tabIndex={-1}
      className="section-anchor-target archive-section"
      aria-labelledby="gallery-library-heading"
    >
      <div className="editorial-section-shell">
        <m.header
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: reducedMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="archive-header"
        >
          <span className="section-signal" aria-hidden="true" />
          <div>
            <p className="editorial-kicker">
              {LIBRARY_ARTWORKS.length} works / {PORTFOLIO_GROUPS.length} chapters
            </p>
            <h2 id="gallery-library-heading" className="editorial-display archive-title">
              The living archive
            </h2>
            <p className="editorial-intro">
              Open one chapter at a time. Every work keeps its notes, original media and
              place in the wider body of work.
            </p>
          </div>
        </m.header>

        <div className="archive-chapters">
          {PORTFOLIO_GROUPS.map((group, groupIndex) => {
            const leadEntry = getLibraryArtworkEntry(ARCHIVE_LEAD_IDS[group.key]);
            const groupArtworks = LIBRARY_ARTWORKS.filter((entry) => entry.group === group.key);
            const isOpen = openGroup === group.key;
            const imageMetadata = getImageMetadata(leadEntry.artwork.imageSlug);
            const panelId = `archive-panel-${group.key}`;

            return (
              <article
                key={group.key}
                id={`gallery-${group.key}`}
                className={`archive-chapter archive-chapter--${groupIndex + 1}`}
              >
                <button
                  type="button"
                  onClick={() => setOpenGroup(isOpen ? null : group.key)}
                  className="archive-chapter-trigger"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                >
                  <span className="archive-chapter-copy">
                    <span>{String(groupIndex + 1).padStart(2, '0')} —</span>
                    <strong>{group.label}</strong>
                    <small>{groupArtworks.length} works</small>
                    <span className="archive-chapter-action">
                      {isOpen ? 'Close chapter' : 'Enter chapter'}
                      <DiagonalArrow open={isOpen} />
                    </span>
                  </span>

                  <span className="archive-chapter-media">
                    <picture>
                      <source
                        type="image/avif"
                        srcSet={getGalleryAvifSrcset(leadEntry.artwork.imageSlug)}
                        sizes="(max-width: 767px) 62vw, 32vw"
                      />
                      <img
                        src={getGalleryImageUrl(leadEntry.artwork.imageSlug)}
                        srcSet={getGallerySrcset(leadEntry.artwork.imageSlug)}
                        sizes="(max-width: 767px) 62vw, 32vw"
                        alt=""
                        loading={groupIndex < 2 ? 'eager' : 'lazy'}
                        decoding="async"
                        width={800}
                        height={1000}
                        style={{ objectPosition: imageMetadata.galleryObjectPosition }}
                      />
                    </picture>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <m.div
                      id={panelId}
                      className="archive-panel"
                      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: reducedMotion ? 0 : 0.36, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="archive-panel-intro">
                        <p>{group.summary}</p>
                        <span>{groupArtworks.length} works in this chapter</span>
                      </div>

                      <div className="archive-artwork-grid">
                        {groupArtworks.map(({ id, artwork }, artworkIndex) => (
                          <InteractiveArtworkCard
                            key={id}
                            imageSlug={artwork.imageSlug}
                            videoSrc={artwork.videoSrc}
                            title={artwork.title}
                            sections={artwork.sections}
                            sectionsLang={artwork.sectionsLang ?? 'no'}
                            imageLoading={artworkIndex < 2 ? 'eager' : 'lazy'}
                            imageFetchPriority="low"
                            deferImageUntilVisible={artworkIndex > 1}
                            frameVariant={ARCHIVE_FRAME_SEQUENCE[artworkIndex % ARCHIVE_FRAME_SEQUENCE.length]}
                            indexLabel={`${String(artworkIndex + 1).padStart(2, '0')} / ${String(groupArtworks.length).padStart(2, '0')}`}
                            presentation="archive"
                          />
                        ))}
                      </div>
                    </m.div>
                  ) : null}
                </AnimatePresence>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
