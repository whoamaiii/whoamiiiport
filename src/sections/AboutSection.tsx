import { ImageReveal } from '../components/ImageReveal';
import { ABOUT_COPY, SOCIAL_LINKS } from '../content/siteCopy';
import {
  getAboutSizes,
  getGalleryAvifSrcset,
  getGalleryImageUrl,
  getGallerySrcset,
  getImageMetadata,
} from '../utils/images';

export const ABOUT_SLUG = 'liquid-perception' as const;

function DiagonalArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19 19 5M8 5h11v11" />
    </svg>
  );
}

function AboutPortrait() {
  return (
    <ImageReveal
      className="about-portrait"
      delay={0}
      direction="up"
      duration={0.52}
    >
      <picture>
        <source
          type="image/avif"
          srcSet={getGalleryAvifSrcset(ABOUT_SLUG)}
          sizes={getAboutSizes()}
        />
        <img
          src={getGalleryImageUrl(ABOUT_SLUG)}
          srcSet={getGallerySrcset(ABOUT_SLUG)}
          sizes={getAboutSizes()}
          alt={getImageMetadata(ABOUT_SLUG).alt}
          loading="lazy"
          decoding="async"
          width={800}
          height={1200}
        />
      </picture>
    </ImageReveal>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      tabIndex={-1}
      aria-labelledby="about-heading"
      className="section-anchor-target deferred-section about-section"
    >
      <div className="editorial-section-shell">
        <header className="about-header">
          <span className="section-signal" aria-hidden="true" />
          <h2 id="about-heading" className="editorial-display about-title">
            {ABOUT_COPY.heading}
          </h2>
        </header>

        <div className="about-composition">
          <AboutPortrait />

          <div className="about-copy">
            <span className="editorial-link-mark" aria-hidden="true" />
            <p className="about-intro">{ABOUT_COPY.intro}</p>
            <p className="about-body">{ABOUT_COPY.body}</p>
          </div>

          <div className="about-identity">
            <p>{ABOUT_COPY.identity}</p>
            <span>{ABOUT_COPY.location}</span>
          </div>

          <nav className="about-links" aria-label="Whoamiii social profiles">
            <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">
              <span>Instagram</span>
              <DiagonalArrow />
            </a>
            <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer">
              <span>X</span>
              <DiagonalArrow />
            </a>
          </nav>
        </div>
      </div>
    </section>
  );
}
