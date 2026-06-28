import { Instagram, Mail, Twitter } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';

export default function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-white/10 bg-zinc-950 px-6 py-14 sm:py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
        <div className="space-y-3">
          <a href="#main-content" className="site-footer-wordmark">
            Whoamiii<span>.</span>
          </a>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-zinc-400 sm:text-[0.95rem]">
            Psychedelic paintings, altered-state studies, and commission inquiries from the archive.
          </p>
        </div>

        <div className="flex gap-4">
          <MagneticButton
            strength={0.5}
            href="https://instagram.com/whoamiii"
            target="_blank"
            rel="noopener noreferrer"
            ariaLabel="Instagram"
            className="social-orb-link"
          >
            <Instagram size={22} />
          </MagneticButton>
          <MagneticButton
            strength={0.5}
            href="https://twitter.com/whoamiii"
            target="_blank"
            rel="noopener noreferrer"
            ariaLabel="Twitter"
            className="social-orb-link"
          >
            <Twitter size={22} />
          </MagneticButton>
          <MagneticButton
            strength={0.5}
            href="mailto:hello@whoamiii.art"
            ariaLabel="Email"
            className="social-orb-link"
          >
            <Mail size={22} />
          </MagneticButton>
        </div>

        <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">
          © {new Date().getFullYear()} Whoamiii. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
