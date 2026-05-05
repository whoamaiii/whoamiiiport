import Instagram from 'lucide-react/dist/esm/icons/instagram.js';
import Mail from 'lucide-react/dist/esm/icons/mail.js';
import Twitter from 'lucide-react/dist/esm/icons/twitter.js';
import { MagneticButton } from '../components/MagneticButton';

export default function SiteFooter() {
  return (
    <footer className="relative z-20 border-t border-white/10 bg-zinc-950 px-6 py-14 sm:py-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
        <div className="space-y-3">
          <a
            href="#main-content"
            className="inline-flex items-center font-display text-2xl tracking-tight text-white transition-colors hover:text-white/90 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            Whoamiii<span className="text-purple-400">.</span>
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
            className="glass flex h-12 w-12 items-center justify-center rounded-full text-zinc-400 transition-[color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white cursor-pointer"
          >
            <Instagram size={22} />
          </MagneticButton>
          <MagneticButton
            strength={0.5}
            href="https://twitter.com/whoamiii"
            target="_blank"
            rel="noopener noreferrer"
            ariaLabel="Twitter"
            className="glass flex h-12 w-12 items-center justify-center rounded-full text-zinc-400 transition-[color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white cursor-pointer"
          >
            <Twitter size={22} />
          </MagneticButton>
          <MagneticButton
            strength={0.5}
            href="mailto:hello@whoamiii.art"
            ariaLabel="Email"
            className="glass flex h-12 w-12 items-center justify-center rounded-full text-zinc-400 transition-[color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white cursor-pointer"
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
