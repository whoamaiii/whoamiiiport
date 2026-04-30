import { Instagram, Twitter } from 'lucide-react';
import { ImageReveal } from '../components/ImageReveal';
import { MagneticButton } from '../components/MagneticButton';
import { ShaderHeading } from '../components/ShaderHeading';
import { ABOUT_COPY } from '../content/siteCopy';
import { getAboutSizes, getGalleryImageUrl, getGallerySrcset, getImageMetadata } from '../utils/images';

const ABOUT_SLUG = 'about-portrait' as const;
const aboutMetadata = getImageMetadata(ABOUT_SLUG);

export function AboutSection() {
  return (
    <section
      id="about"
      tabIndex={-1}
      aria-labelledby="about-heading"
      className="section-anchor-target deferred-section relative py-32 px-6 bg-zinc-950 z-20 focus:outline-none"
    >
      <div className="max-w-7xl mx-auto">
        <div className="glass rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-[80px] -translate-y-1/2 translate-x-1/2" />

          <div className="grid md:grid-cols-2 gap-16 relative z-10">
            <div>
              <ShaderHeading
                id="about-heading"
                delay={0}
                className="text-4xl md:text-5xl font-display tracking-tight mb-8"
                visualLines={['The Mind', 'Behind the', 'Canvas']}
              >
                {ABOUT_COPY.heading}
              </ShaderHeading>
              <p className="text-zinc-300 text-lg leading-relaxed mb-6">
                {ABOUT_COPY.intro}
              </p>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
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
            <ImageReveal
              className="relative w-full max-w-sm mx-auto md:mx-0 md:ml-auto aspect-[4/5] rounded-3xl glass p-2"
              delay={0.2}
              direction="up"
            >
              <img
                src={getGalleryImageUrl(ABOUT_SLUG)}
                srcSet={getGallerySrcset(ABOUT_SLUG)}
                sizes={getAboutSizes()}
                alt={aboutMetadata.alt}
                loading="lazy"
                decoding="async"
                width={800}
                height={1200}
                className="w-full h-full object-cover object-[center_16%] rounded-2xl filter contrast-125 saturate-150"
              />
            </ImageReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
