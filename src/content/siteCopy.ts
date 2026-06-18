interface HeroCopy {
  eyebrow: string;
  titleSemantic: string;
  titleLines: readonly [string, string];
  subtitle: string;
}

interface GalleryCopy {
  eyebrow: string;
  heading: string;
  subtitle: string;
}

interface ContactCopy {
  heading: string;
  headingParts: {
    lead: string;
    accent: string;
  };
  body: string;
  cta: string;
}

export const HERO_COPY: HeroCopy = {
  eyebrow: 'Psychedelic Art Portfolio',
  titleSemantic: 'Altered Perceptions.',
  titleLines: ['Altered', 'Perceptions'],
  subtitle: 'Paintings from the other side of the glass.',
} as const;

export const GALLERY_COPY: GalleryCopy = {
  eyebrow: 'PORTFOLIO HIGHLIGHTS',
  heading: 'Selected Works.',
  subtitle: 'Dream-burned paintings and digital artifacts pulled from the archive.',
} as const;

export const ABOUT_COPY = {
  heading: 'The Mind Behind the Canvas',
  intro:
    'This is me inside the work: a modified selfie pushed through the same chrome, forest light, and altered-perception language that shapes the rest of the portfolio.',
  body:
    'I use digital manipulation, painting logic, and psychedelic image-making to turn personal photographs into pieces that feel organic, synthetic, intimate, and slightly unstable at the same time.',
} as const;

const CONTACT_HEADING_PARTS = {
  lead: "Let's Create Something",
  accent: 'Trippy.',
} as const;

export const CONTACT_COPY: ContactCopy = {
  heading: `${CONTACT_HEADING_PARTS.lead} ${CONTACT_HEADING_PARTS.accent}`,
  headingParts: CONTACT_HEADING_PARTS,
  body: 'Open for commissions, collaborations, and exhibitions.',
  cta: 'Send a Message',
} as const;
