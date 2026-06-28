import type { SpecialArtwork } from '../components/artworkData';
import { FEATURED_ARTWORKS } from './featuredArtworks';
import { stillArtworks } from './libraryStillArtworks';
import { videoArtworks } from './libraryVideoArtworks';

interface LibraryArtworkEntry {
  readonly id: string;
  readonly artwork: SpecialArtwork;
}

export const LIBRARY_ARTWORKS: readonly LibraryArtworkEntry[] = [
  ...FEATURED_ARTWORKS,
  ...stillArtworks,
  ...videoArtworks,
];
