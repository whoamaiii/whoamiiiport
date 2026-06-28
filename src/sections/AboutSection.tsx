import { Instagram, Twitter } from 'lucide-react';
import { ImageReveal } from '../components/ImageReveal';
import { MagneticButton } from '../components/MagneticButton';
import { ShaderHeading } from '../components/ShaderHeading';
import { ABOUT_COPY } from '../content/siteCopy';
import {
  getAboutSizes,
  getGalleryAvifSrcset,
  getGalleryImageUrl,
  getGallerySrcset,
  getImageMetadata,
} from '../utils/images';

export const ABOUT_SLUG = 'liquid-perception' as const;

function AboutPortrait({ className = '' }: { className?: string }) {
  return (
    <ImageReveal
      className={`glass relative mx-auto aspect-[4/5] w-full max-w-sm rounded-[1.35rem] p-2 md:mx-0 md:ml-auto md:rounded-3xl ${className}`.trim()}
      delay={0}
      direction="up"
      duration={0.48}
    >
      <picture className="block h-full w-full">
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
          className="h-full w-full rounded-[1rem] object-cover object-[50%_50%] contrast-105 saturate-110 md:rounded-2xl"
        />
      </picture>
      <div
        className="pointer-events-none absolute inset-2 rounded-[1rem] opacity-[0.16] mix-blend-screen md:rounded-2xl"
        style={{
          backgroundImage:
            'repeating-linear-gradient(180deg, rgba(255,255,255,0.18) 0 1px, rgba(255,255,255,0) 1px 7px)',
        }}
        aria-hidden="true"
      />
    </ImageReveal>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      tabIndex={-1}
      aria-labelledby="about-heading"
      className="section-anchor-target deferred-section relative z-20 bg-zinc-950 px-4 py-16 focus:outline-none sm:px-6 md:py-32"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass relative overflow-hidden rounded-[1.75rem] p-5 sm:p-8 md:rounded-[3rem] md:p-16">
          <div className="absolute top-0 right-0 h-96 w-96 -translate-y-1/2 translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(103,232,249,0.16),rgba(245,222,192,0.08)_38%,rgba(148,68,104,0.10)_58%,transparent_72%)] blur-[80px]" />
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />

          <div className="relative z-10 grid gap-8 md:grid-cols-2 md:gap-16">
            <div>
              <ShaderHeading
                id="about-heading"
                delay={0}
                className="mb-6 text-[2.45rem] font-display tracking-tight md:mb-8 md:text-5xl"
                visualLines={['Sinnet', 'bak', 'bildet']}
              >
                {ABOUT_COPY.heading}
              </ShaderHeading>
              <AboutPortrait className="mb-7 md:hidden" />
              <p className="mb-5 text-[1.02rem] leading-7 text-zinc-200/88 md:text-lg md:leading-relaxed">
                {ABOUT_COPY.intro}
              </p>
              <p className="mb-7 text-[1.02rem] leading-7 text-zinc-400 md:mb-8 md:text-lg md:leading-relaxed">
                {ABOUT_COPY.body}
              </p>
              <div className="flex gap-4">
                <MagneticButton
                  strength={0.4}
                  href="https://instagram.com/whoamiii"
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel="Instagram"
                  className="social-orb-link"
                >
                  <Instagram size={20} />
                </MagneticButton>
                <MagneticButton
                  strength={0.4}
                  href="https://twitter.com/whoamiii"
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel="Twitter"
                  className="social-orb-link"
                >
                  <Twitter size={20} />
                </MagneticButton>
              </div>
            </div>
            <AboutPortrait className="hidden md:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
