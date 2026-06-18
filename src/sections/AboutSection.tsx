import { Instagram, Twitter } from 'lucide-react';
import { ImageReveal } from '../components/ImageReveal';
import { MagneticButton } from '../components/MagneticButton';
import { ShaderHeading } from '../components/ShaderHeading';
import { ABOUT_COPY } from '../content/siteCopy';
import { getAboutSizes, getGalleryImageUrl, getGallerySrcset, getImageMetadata } from '../utils/images';

export const ABOUT_SLUG = 'liquid-perception' as const;

function AboutPortrait({ className = '' }: { className?: string }) {
  return (
    <ImageReveal
      className={`glass relative mx-auto aspect-[4/5] w-full max-w-sm rounded-[1.35rem] p-2 md:mx-0 md:ml-auto md:rounded-3xl ${className}`.trim()}
      delay={0}
      direction="up"
      duration={0.48}
    >
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
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-[80px] -translate-y-1/2 translate-x-1/2" />
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />

          <div className="relative z-10 grid gap-8 md:grid-cols-2 md:gap-16">
            <div>
              <ShaderHeading
                id="about-heading"
                delay={0}
                className="mb-6 text-[2.45rem] font-display tracking-tight md:mb-8 md:text-5xl"
                visualLines={['The Mind', 'Behind the', 'Canvas']}
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
                  className="glass flex h-12 w-12 items-center justify-center rounded-full text-zinc-300 shadow-lg transition-[color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white cursor-pointer"
                >
                  <Instagram size={20} />
                </MagneticButton>
                <MagneticButton
                  strength={0.4}
                  href="https://twitter.com/whoamiii"
                  target="_blank"
                  rel="noopener noreferrer"
                  ariaLabel="Twitter"
                  className="glass flex h-12 w-12 items-center justify-center rounded-full text-zinc-300 shadow-lg transition-[color,border-color,box-shadow,transform] duration-200 ease-out hover:-translate-y-0.5 hover:border-transparent hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white cursor-pointer"
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
