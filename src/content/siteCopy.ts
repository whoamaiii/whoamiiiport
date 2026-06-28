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
  eyebrow: 'Psykedelisk kunstportefølje',
  titleSemantic: 'Endrede sanseflater.',
  titleLines: ['Endrede', 'Sanseflater'],
  subtitle: 'Bilder fra den andre siden av glasset.',
} as const;

export const GALLERY_COPY: GalleryCopy = {
  eyebrow: 'PORTFØLJEUTVALG',
  heading: 'Utvalgte verk.',
  subtitle: 'Drømmebrente bilder og digitale artefakter hentet fra arkivet.',
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
  accent: 'trippy.',
} as const;

export const CONTACT_COPY: ContactCopy = {
  heading: `${CONTACT_HEADING_PARTS.lead} ${CONTACT_HEADING_PARTS.accent}`,
  headingParts: CONTACT_HEADING_PARTS,
  body: 'Åpen for oppdrag, samarbeid og utstillinger.',
  cta: 'Send melding',
} as const;
