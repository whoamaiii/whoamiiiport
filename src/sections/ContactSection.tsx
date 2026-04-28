import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';
import { TextScramble } from '../components/TextScramble';
import { CONTACT_COPY } from '../content/siteCopy';

interface ContactSectionProps {
  reducedMotion: boolean;
}

export function ContactSection({ reducedMotion }: ContactSectionProps) {
  return (
    <section
      id="contact"
      tabIndex={-1}
      aria-labelledby="contact-heading"
      className="section-anchor-target deferred-section relative py-32 px-6 bg-zinc-950 z-20 focus:outline-none"
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass-dark rounded-[3rem] p-12 md:p-20 relative pointer-events-auto"
        >
          <h2
            id="contact-heading"
            aria-label={CONTACT_COPY.heading}
            className="text-4xl md:text-6xl font-display tracking-tight mb-6 relative z-10"
          >
            <span className="sr-only">{CONTACT_COPY.heading}</span>
            <span aria-hidden="true">
              <TextScramble text={CONTACT_COPY.headingParts.lead} delay={200} duration={1200} />
              <span className="text-gradient">
                {' '}
                <TextScramble text={CONTACT_COPY.headingParts.accent} delay={800} duration={800} />
              </span>
            </span>
          </h2>
          <p className="text-xl text-zinc-400 mb-10 relative z-10">{CONTACT_COPY.body}</p>

          <MagneticButton strength={0.3} href="mailto:hello@whoamiii.art">
            <span className="group relative z-10 inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black rounded-full font-semibold text-lg overflow-hidden transition-transform hover:scale-105 pointer-events-auto cursor-pointer">
              <span className="relative z-10 flex items-center gap-2">
                <Mail size={20} />
                {CONTACT_COPY.cta}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity" />
            </span>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}

export default ContactSection;
