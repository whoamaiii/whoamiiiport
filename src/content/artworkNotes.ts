import type { ArtworkSection } from '../components/artworkData';

type ArtworkNoteBodies = readonly [
  intro: string,
  meaning: string,
  process: string,
  surface: string,
];

export function createArtworkSections([
  intro,
  meaning,
  process,
  surface,
]: ArtworkNoteBodies): readonly ArtworkSection[] {
  return [
    { body: intro },
    { heading: 'Mening for meg', body: meaning },
    { heading: 'Hvordan det er laget', body: process },
    { heading: 'Materiale og overflate', body: surface },
  ];
}
