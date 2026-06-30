import { curatedArtworkNotes } from './curatedArtworkNotes';
import type { LibraryArtworkEntry } from './portfolioGroups';

export const bodyStillArtworks: readonly LibraryArtworkEntry[] = [
  {
    id: 'forensic-hand-mouth',
    group: 'sink-organisms',
    artwork: {
      imageSlug: 'forensic-hand-mouth',
      title: { primary: 'Forensisk håndmunn', secondary: 'vaskelaboratorium' },
      sections: curatedArtworkNotes['forensic-hand-mouth'],
    },
  },
  {
    id: 'open-hand-mouth',
    group: 'sink-organisms',
    artwork: {
      imageSlug: 'open-hand-mouth',
      title: { primary: 'Åpen håndmunn', secondary: 'hovedversjon' },
      sections: curatedArtworkNotes['open-hand-mouth'],
    },
  },
  {
    id: 'handpose-mouth',
    group: 'sink-organisms',
    artwork: {
      imageSlug: 'handpose-mouth',
      title: { primary: 'Håndposemunn', secondary: 'bordobjekt-kropp' },
      sections: curatedArtworkNotes['handpose-mouth'],
    },
  },
  {
    id: 'nasty-food-still',
    group: 'sink-organisms',
    artwork: {
      imageSlug: 'nasty-food-still',
      title: { primary: 'Vaskemunn', secondary: 'tenner og matrest' },
      sections: curatedArtworkNotes['nasty-food-still'],
    },
  },
  {
    id: 'sink-organism',
    group: 'sink-organisms',
    artwork: {
      imageSlug: 'sink-organism',
      title: { primary: 'Sinkorganisme', secondary: 'grønn våt scene' },
      sections: curatedArtworkNotes['sink-organism'],
    },
  },
  {
    id: 'raw-sink-study',
    group: 'sink-organisms',
    artwork: {
      imageSlug: 'raw-sink-study',
      title: { primary: 'Rå vaskestudie', secondary: 'telefonaktig support' },
      sections: curatedArtworkNotes['raw-sink-study'],
    },
  },
  {
    id: 'tongue-terrain',
    group: 'tongue-terrain',
    artwork: {
      imageSlug: 'tongue-terrain',
      title: { primary: 'Tungeterreng', secondary: 'mest komplett' },
      sections: curatedArtworkNotes['tongue-terrain'],
    },
  },
  {
    id: 'tongue-crater',
    group: 'tongue-terrain',
    artwork: {
      imageSlug: 'tongue-crater',
      title: { primary: 'Tungekrater', secondary: 'porestruktur' },
      sections: curatedArtworkNotes['tongue-crater'],
    },
  },
  {
    id: 'tongue-soft',
    group: 'tongue-terrain',
    artwork: {
      imageSlug: 'tongue-soft',
      title: { primary: 'Myk tungeflate', secondary: 'variant' },
      sections: curatedArtworkNotes['tongue-soft'],
    },
  },
  {
    id: 'tongue-close',
    group: 'tongue-terrain',
    artwork: {
      imageSlug: 'tongue-close',
      title: { primary: 'Tett tungeflate', secondary: 'nærvariant' },
      sections: curatedArtworkNotes['tongue-close'],
    },
  },
  {
    id: 'threshold-witness',
    group: 'threshold-studies',
    artwork: {
      imageSlug: 'threshold-witness',
      title: { primary: 'Terskelvitne', secondary: 'mørk prologfigur' },
      sections: curatedArtworkNotes['threshold-witness'],
    },
  },
];
