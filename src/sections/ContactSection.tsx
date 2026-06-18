import { motion } from 'motion/react';
import { Mail } from 'lucide-react';
import { MagneticButton } from '../components/MagneticButton';
import { ShaderHeading } from '../components/ShaderHeading';
import { CONTACT_COPY } from '../content/siteCopy';

interface ContactSectionProps {
  reducedMotion: boolean;
}

export default function ContactSection({ reducedMotion }: ContactSectionProps) {
  return (
    <section
      id="contact"
      tabIndex={-1}
      aria-labelledby="contact-heading"
      className="section-anchor-target deferred-section relative z-20 bg-zinc-950 px-4 py-16 focus:outline-none sm:px-6 md:py-32"
    >
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={reducedMotion ? { duration: 0 } : { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="glass-dark relative pointer-events-auto overflow-hidden rounded-[1.75rem] px-5 py-12 md:rounded-[3rem] md:p-20"
        >
          <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/70 to-transparent" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl" />
          <ShaderHeading
            id="contact-heading"
            className="relative z-10 mb-6 text-center text-[2.35rem] font-display tracking-tight md:text-6xl"
            visualLines={["Let's", 'Create', 'Something', 'Trippy.']}
          >
            {CONTACT_COPY.heading}
          </ShaderHeading>
          <p className="liquid-support-text relative z-10 mx-auto mb-9 max-w-[24ch] text-base uppercase leading-7 tracking-[0.22em] md:mb-10 md:text-xl md:normal-case md:tracking-normal">
            {CONTACT_COPY.body}
          </p>

          <MagneticButton
            strength={0.3}
            href="mailto:hello@whoamiii.art"
            className="relative z-10 inline-flex"
          >
            <span className="group relative inline-flex min-h-12 items-center justify-center gap-3 overflow-hidden rounded-[0.35rem] border border-purple-400/80 bg-cyan-400 px-8 py-4 font-semibold uppercase tracking-[0.2em] text-black shadow-[0_0_22px_rgba(34,211,238,0.38),0_0_32px_rgba(168,85,247,0.18)] transition-[box-shadow,transform,background-color] duration-200 hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.52),0_0_44px_rgba(168,85,247,0.24)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 active:scale-[0.98] pointer-events-auto cursor-pointer">
              <span className="relative z-10 flex items-center gap-2">
                <Mail size={20} />
                {CONTACT_COPY.cta}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-cyan-300 to-purple-300 opacity-0 transition-opacity group-hover:opacity-30" />
            </span>
          </MagneticButton>
        </motion.div>
      </div>
    </section>
  );
}
