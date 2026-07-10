import { CONTACT_EMAIL, SOCIAL_LINKS } from '../content/siteCopy';

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="editorial-section-shell site-footer-inner">
        <a href="#main-content" className="site-footer-wordmark">
          Whoamiii <span>/ 2026</span>
        </a>

        <nav aria-label="Footer links">
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={SOCIAL_LINKS.x} target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`}>Email</a>
        </nav>

        <p>Oslo — Norway</p>
      </div>
    </footer>
  );
}
