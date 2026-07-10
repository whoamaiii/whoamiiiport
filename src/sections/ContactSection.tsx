import { m } from 'motion/react';
import { CONTACT_COPY } from '../content/siteCopy';

interface ContactSectionProps {
  readonly reducedMotion: boolean;
}

function DiagonalArrow() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 19 19 5M8 5h11v11" />
    </svg>
  );
}

export default function ContactSection({ reducedMotion }: ContactSectionProps) {
  return (
    <section
      id="contact"
      tabIndex={-1}
      aria-labelledby="contact-heading"
      className="section-anchor-target deferred-section contact-section"
    >
      <m.div
        initial={reducedMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: reducedMotion ? 0 : 0.68, ease: [0.16, 1, 0.3, 1] }}
        className="editorial-section-shell contact-shell"
      >
        <header className="contact-header">
          <span className="section-signal" aria-hidden="true" />
          <div>
            <p className="editorial-kicker">Commissions / collaborations / exhibitions</p>
            <h2 id="contact-heading" className="editorial-display contact-title">
              {CONTACT_COPY.heading}
            </h2>
          </div>
        </header>

        <div className="contact-invitation">
          <span className="editorial-link-mark" aria-hidden="true" />
          <p>{CONTACT_COPY.body}</p>
        </div>

        <a
          href="mailto:hello@whoamiii.art"
          className="contact-email"
          aria-label="Email Whoamiii at hello@whoamiii.art"
        >
          <span>{CONTACT_COPY.cta}</span>
          <DiagonalArrow />
        </a>
      </m.div>
    </section>
  );
}
