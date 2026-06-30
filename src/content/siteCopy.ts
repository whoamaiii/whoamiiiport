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
  };
  body: string;
  cta: string;
}

export const HERO_COPY: HeroCopy = {
  eyebrow: 'Psychedelic art portfolio',
  titleSemantic: 'Altered perception.',
  titleLines: ['Altered', 'Perception'],
  subtitle: '',
} as const;

export const GALLERY_COPY: GalleryCopy = {
  eyebrow: 'KURATERT UTVALG',
  heading: 'Utvalgte verk.',
  subtitle: 'Første inngang til de sorterte seriene: rom, hjemlige flater, hender og ritualobjekter.',
} as const;

export const ABOUT_COPY = {
  heading: 'Sinnet bak bildet',
  intro:
    'Dette er meg inne i arbeidet: et modifisert selvportrett presset gjennom det samme kromet, skogslyset og altered-perception-språket som former resten av porteføljen.',
  body:
    'Jeg bruker digital manipulasjon, malerisk logikk og psykedelisk bildearbeid til å gjøre personlige fotografier om til verk som føles organiske, syntetiske, intime og litt ustabile samtidig.',
} as const;

const CONTACT_HEADING_PARTS = {
  lead: 'La oss lage noe',
} as const;

export const CONTACT_COPY: ContactCopy = {
  heading: CONTACT_HEADING_PARTS.lead,
  headingParts: CONTACT_HEADING_PARTS,
  body: 'Åpen for oppdrag, samarbeid og utstillinger.',
  cta: 'Send melding',
} as const;
