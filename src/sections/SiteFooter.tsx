export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="editorial-section-shell site-footer-inner">
        <a href="#main-content" className="site-footer-wordmark">
          Whoamiii <span>/ 2026</span>
        </a>

        <nav aria-label="Footer links">
          <a href="https://instagram.com/whoamiii" target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href="https://twitter.com/whoamiii" target="_blank" rel="noopener noreferrer">
            X
          </a>
          <a href="mailto:hello@whoamiii.art">Email</a>
        </nav>

        <p>Oslo — Norway</p>
      </div>
    </footer>
  );
}
