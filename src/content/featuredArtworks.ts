import {
  fingernailPortalArtwork,
  handPortalVideoArtwork,
  mushroomOfferingArtwork,
  mycelialHandArtwork,
  type SpecialArtwork,
} from '../components/artworkData';

interface FeaturedArtworkEntry {
  id: string;
  artwork: SpecialArtwork;
}

export const FEATURED_ARTWORKS: FeaturedArtworkEntry[] = [
  {
    id: 'mushroom-offering',
    artwork: mushroomOfferingArtwork,
  },
  {
    id: 'mycelial-hand',
    artwork: mycelialHandArtwork,
  },
  {
    id: 'hand-portal-video',
    artwork: handPortalVideoArtwork,
  },
  {
    id: 'fingernail-portal',
    artwork: fingernailPortalArtwork,
  },
];
