import { m } from 'motion/react';
import InteractiveArtworkCard from '../components/InteractiveArtworkCard';
import { StaggerContainer, StaggerItem } from '../components/StaggerContainer';
import { WorkflowProcessCard } from '../components/WorkflowProcessCard';
import { FEATURED_ARTWORKS } from '../content/featuredArtworks';
import { GALLERY_COPY } from '../content/siteCopy';

interface GallerySectionProps {
  readonly reducedMotion: boolean;
  readonly onNavigateToSection?: (id: string) => void;
}

const FEATURED_LAYOUTS = [
  { className: 'selected-work-item selected-work-item--one', frame: 'portrait' },
  { className: 'selected-work-item selected-work-item--two', frame: 'square' },
  { className: 'selected-work-item selected-work-item--three', frame: 'landscape' },
  { className: 'selected-work-item selected-work-item--four', frame: 'portrait' },
] as const;

function DiagonalArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19 19 5M8 5h11v11" />
    </svg>
  );
}

export function GallerySection({
  reducedMotion,
  onNavigateToSection,
}: GallerySectionProps) {
  return (
    <section
      id="work"
      tabIndex={-1}
      className="section-anchor-target selected-work-section"
      aria-labelledby="selected-works-heading"
    >
      <div className="editorial-section-shell">
        <m.header
          initial={reducedMotion ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{
            duration: reducedMotion ? 0 : 0.65,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="selected-work-header"
        >
          <span className="section-signal" aria-hidden="true" />
          <div>
            <p className="editorial-kicker">{GALLERY_COPY.eyebrow}</p>
            <h2 id="selected-works-heading" className="editorial-display selected-work-title">
              {GALLERY_COPY.heading}
            </h2>
            <p className="editorial-intro">{GALLERY_COPY.subtitle}</p>
          </div>
        </m.header>

        <StaggerContainer
          className="selected-work-grid"
          staggerDelay={0.11}
          mobileFastReveal
        >
          {FEATURED_ARTWORKS.map(({ id, artwork }, index) => {
            const layout = FEATURED_LAYOUTS[index] ?? FEATURED_LAYOUTS[0];

            return (
              <StaggerItem key={id} className={layout.className} mobileDistance={18}>
                <InteractiveArtworkCard
                  imageSlug={artwork.imageSlug}
                  videoSrc={artwork.videoSrc}
                  title={artwork.title}
                  sections={artwork.sections}
                  sectionsLang={artwork.sectionsLang ?? 'no'}
                  imageLoading={index === 0 ? 'eager' : 'lazy'}
                  imageFetchPriority={index === 0 ? 'auto' : 'low'}
                  deferImageUntilVisible={index > 0}
                  frameVariant={layout.frame}
                  indexLabel={`${String(index + 1).padStart(2, '0')} —`}
                  presentation="editorial"
                />
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <m.button
          type="button"
          onClick={() => onNavigateToSection?.('gallery')}
          initial={reducedMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reducedMotion ? 0 : 0.48 }}
          className="editorial-link selected-archive-link"
        >
          <span className="editorial-link-mark" aria-hidden="true" />
          <span>Open the living archive</span>
          <DiagonalArrow />
        </m.button>

        <WorkflowProcessCard reducedMotion={reducedMotion} />
      </div>
    </section>
  );
}
