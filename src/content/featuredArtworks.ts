import type { SpecialArtwork } from '../components/artworkData';
import { getLibraryArtworkEntry } from './libraryArtworks';

interface FeaturedArtworkEntry {
  readonly id: string;
  readonly artwork: SpecialArtwork;
}

const featuredArtworkIds = [
  'video5-optical-focus',
  'kaaffe-texture-motion',
  'living-floor',
  'mushroom-offering',
] as const;

export const FEATURED_ARTWORKS = featuredArtworkIds.map((id) => {
  const entry = getLibraryArtworkEntry(id);

  return {
    id: entry.id,
    artwork: entry.artwork,
  };
}) satisfies readonly FeaturedArtworkEntry[];
