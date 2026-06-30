import { stillArtworks } from './libraryStillArtworks';
import { videoArtworks } from './libraryVideoArtworks';
import type { LibraryArtworkEntry } from './portfolioGroups';

export const LIBRARY_ARTWORKS: readonly LibraryArtworkEntry[] = [
  ...stillArtworks,
  ...videoArtworks,
];

export function getLibraryArtworkEntry(id: string): LibraryArtworkEntry {
  const entry = LIBRARY_ARTWORKS.find((artworkEntry) => artworkEntry.id === id);

  if (entry) {
    return entry;
  }

  throw new Error(`Missing curated artwork entry: ${id}`);
}
