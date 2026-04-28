export interface HeroCopy {
  eyebrow: string;
  titleSemantic: string;
  titleLines: readonly [string, string];
  subtitle: string;
}

export interface GalleryCopy {
  eyebrow: string;
  heading: string;
  subtitle: string;
}

export interface ContactCopy {
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
  subtitle: 'Digital paintings and dream-burned color studies from altered states.',
} as const;

export const GALLERY_COPY: GalleryCopy = {
  eyebrow: 'PORTFOLIO HIGHLIGHTS',
  heading: 'Selected Works.',
  subtitle: 'Dream-burned paintings and digital artifacts pulled from the archive.',
} as const;

export const ABOUT_COPY = {
  heading: 'The Mind Behind the Canvas',
  intro:
    'My work is deeply influenced by the exploration of altered states of consciousness. I aim to capture the fleeting, geometric, and profoundly vibrant visions that exist just beyond our everyday perception.',
  body:
    'Using a mix of traditional painting and digital manipulation, I create pieces that feel both organic and synthetic, inviting the viewer to step into a different reality.',
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
