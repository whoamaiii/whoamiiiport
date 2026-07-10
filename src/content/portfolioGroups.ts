import type { SpecialArtwork } from '../components/artworkData';

export const PORTFOLIO_GROUPS = [
  {
    key: 'liminal-rooms',
    label: 'Rooms',
    navLabel: 'Rooms',
    summary: 'Corridors, buses and motel rooms where architecture begins to behave like skin.',
  },
  {
    key: 'domestic-ecosystems',
    label: 'Domestic surfaces',
    navLabel: 'Surfaces',
    summary: 'Floors, rugs, coffee and wet rooms becoming living surfaces instead of backgrounds.',
  },
  {
    key: 'hand-portals',
    label: 'Hands & ritual',
    navLabel: 'Hands',
    summary: 'The hand as sensor, portal, evidence and ritual tool inside the first-person image.',
  },
  {
    key: 'sink-organisms',
    label: 'Body / sink',
    navLabel: 'Body',
    summary: 'Sinks, teeth, slime and practical-effect body horror gathered as tactile material.',
  },
  {
    key: 'tongue-terrain',
    label: 'Tongue studies',
    navLabel: 'Tongue',
    summary: 'Mouth and tongue seen as wet micro-landscapes, almost clinical and almost coral reef.',
  },
  {
    key: 'threshold-studies',
    label: 'Thresholds',
    navLabel: 'Thresholds',
    summary: 'Figures, faces, eyes and material tests that open or close the edge of this world.',
  },
] as const;

type PortfolioGroupKey = (typeof PORTFOLIO_GROUPS)[number]['key'];

export interface LibraryArtworkEntry {
  readonly id: string;
  readonly group: PortfolioGroupKey;
  readonly artwork: SpecialArtwork;
}
