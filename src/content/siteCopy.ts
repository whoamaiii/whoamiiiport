interface HeroCopy {
  eyebrow: string;
  titleSemantic: string;
  titleLines: readonly [string, string];
  subtitle: string;
  cta: string;
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
  };
  body: string;
  cta: string;
}

export const HERO_COPY: HeroCopy = {
  eyebrow: 'Digital artist / visual experiments',
  titleSemantic: 'Altered perception.',
  titleLines: ['Altered', 'Perception'],
  subtitle: 'Personal photographs pushed into unstable encounters between the organic and the synthetic.',
  cta: 'Enter the archive',
} as const;

export const GALLERY_COPY: GalleryCopy = {
  eyebrow: 'Curated sequence / 01—04',
  heading: 'Selected work',
  subtitle: 'Rooms become skin. Hands become interfaces. Familiar images drift into living surfaces.',
} as const;

export const ABOUT_COPY = {
  heading: 'The mind behind the image',
  intro:
    'I turn personal photographs into unstable encounters between the organic and the synthetic.',
  body:
    'My practice moves between personal photographs, 3D Blender scenes, AI-assisted image research and psychedelic visual effects that occur under the influence of psychedelic substances.',
  identity: 'Q / Whoamiii',
  location: 'Oslo, Norway / available worldwide',
} as const;

export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/quentin_qmann/',
  x: 'https://x.com/Quentin21118961',
} as const;

export const CONTACT_EMAIL = 'whoamiii@poke.com' as const;

const CONTACT_HEADING_PARTS = {
  lead: 'Make something strange with me.',
} as const;

export const CONTACT_COPY: ContactCopy = {
  heading: CONTACT_HEADING_PARTS.lead,
  headingParts: CONTACT_HEADING_PARTS,
  body: 'Open for commissions, collaborations and exhibitions.',
  cta: CONTACT_EMAIL,
} as const;
