import {
  ferdigcopVideoArtwork,
  nestenferdigTungeVideoArtwork,
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
    id: 'nestenferdig-tunge-video',
    artwork: nestenferdigTungeVideoArtwork,
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
