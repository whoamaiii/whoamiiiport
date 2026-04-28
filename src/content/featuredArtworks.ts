import {
  ferdigcopVideoArtwork,
  liquidPerceptionArtwork,
  psychedelicBathroomPortrait,
  psychedelicBathroomScream,
  type SpecialArtwork,
} from '../components/artworkData';

export interface FeaturedArtworkEntry {
  id: string;
  artwork: SpecialArtwork;
}

export const FEATURED_ARTWORKS: FeaturedArtworkEntry[] = [
  {
    id: 'liquid-perception',
    artwork: liquidPerceptionArtwork,
  },
  {
    id: 'psychedelic-bathroom-portrait',
    artwork: psychedelicBathroomPortrait,
  },
  {
    id: 'psychedelic-bathroom-scream',
    artwork: psychedelicBathroomScream,
  },
  {
    id: 'ferdigcop-video',
    artwork: ferdigcopVideoArtwork,
  },
];

export default FEATURED_ARTWORKS;
