import type { SpecialArtwork } from '../components/artworkData';

export const PORTFOLIO_GROUPS = [
  {
    key: 'liminal-rooms',
    label: 'Liminale rom',
    navLabel: 'Rom',
    summary: 'Korridor, buss og motelrom der arkitekturen begynner å oppføre seg som hud.',
  },
  {
    key: 'domestic-ecosystems',
    label: 'Hjemlige økosystemer',
    navLabel: 'Hjem',
    summary: 'Gulv, tepper, kaffe og våtrom som blir levende flater i stedet for bakgrunn.',
  },
  {
    key: 'hand-portals',
    label: 'Håndportaler',
    navLabel: 'Hender',
    summary: 'Hånden som sensor, portal, bevis og ritualverktøy i førstepersonsbildet.',
  },
  {
    key: 'sink-organisms',
    label: 'Sinkorganismer',
    navLabel: 'Vask',
    summary: 'Vask, tenner, slim og praktisk-effekt-aktig body-horror samlet som materiale.',
  },
  {
    key: 'tongue-terrain',
    label: 'Tungeflater',
    navLabel: 'Tunge',
    summary: 'Munn og tunge sett som våte mikrolandskap, nesten klinisk og nesten korallrev.',
  },
  {
    key: 'threshold-studies',
    label: 'Terskelstudier',
    navLabel: 'Studier',
    summary: 'Figurer, ansikt, øye og materialtester som åpner eller avrunder universet.',
  },
] as const;

type PortfolioGroupKey = (typeof PORTFOLIO_GROUPS)[number]['key'];

export interface LibraryArtworkEntry {
  readonly id: string;
  readonly group: PortfolioGroupKey;
  readonly artwork: SpecialArtwork;
}
