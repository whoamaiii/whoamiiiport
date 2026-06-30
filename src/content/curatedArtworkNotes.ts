import { handArtworkNotes } from './artworkNotesHands';
import { roomArtworkNotes } from './artworkNotesRooms';
import { studyArtworkNotes } from './artworkNotesStudies';

export const curatedArtworkNotes = {
  ...roomArtworkNotes,
  ...handArtworkNotes,
  ...studyArtworkNotes,
} as const;
