import { bodyStillArtworks } from './libraryStillBodyArtworks';
import { curatedArtworkNotes } from './curatedArtworkNotes';
import type { LibraryArtworkEntry } from './portfolioGroups';

const coreStillArtworks: readonly LibraryArtworkEntry[] = [
  {
    id: 'textile-corridor',
    group: 'liminal-rooms',
    artwork: {
      imageSlug: 'textile-corridor',
      title: { primary: 'Tekstilkorridor', secondary: 'anbefalt åpner' },
      sections: curatedArtworkNotes['textile-corridor'],
    },
  },
  {
    id: 'corridor-touch',
    group: 'liminal-rooms',
    artwork: {
      imageSlug: 'corridor-touch',
      title: { primary: 'Korridorberøring', secondary: 'hånd mot levende vegg' },
      sections: curatedArtworkNotes['corridor-touch'],
    },
  },
  {
    id: 'patterned-hallway',
    group: 'liminal-rooms',
    artwork: {
      imageSlug: 'patterned-hallway',
      title: { primary: 'Mønstret motelhall', secondary: 'romlig drift' },
      sections: curatedArtworkNotes['patterned-hallway'],
    },
  },
  {
    id: 'green-motel-wall',
    group: 'liminal-rooms',
    artwork: {
      imageSlug: 'green-motel-wall',
      title: { primary: 'Grønn motelhud', secondary: 'organisk veggvariant' },
      sections: curatedArtworkNotes['green-motel-wall'],
    },
  },
  {
    id: 'motel-feet',
    group: 'liminal-rooms',
    artwork: {
      imageSlug: 'motel-feet',
      title: { primary: 'Motel med føtter', secondary: 'førstepersonsrom' },
      sections: curatedArtworkNotes['motel-feet'],
    },
  },
  {
    id: 'night-bus',
    group: 'liminal-rooms',
    artwork: {
      imageSlug: 'night-bus',
      title: { primary: 'Nattbuss', secondary: 'transittmønster' },
      sections: curatedArtworkNotes['night-bus'],
    },
  },
  {
    id: 'color-flood-hallway',
    group: 'liminal-rooms',
    artwork: {
      imageSlug: 'color-flood-hallway',
      title: { primary: 'Fargekorridor', secondary: 'maksimal overgang' },
      sections: curatedArtworkNotes['color-flood-hallway'],
    },
  },
  {
    id: 'living-floor',
    group: 'domestic-ecosystems',
    artwork: {
      imageSlug: 'living-floor',
      title: { primary: 'Levende gulv', secondary: 'ren hovedversjon' },
      sections: curatedArtworkNotes['living-floor'],
    },
  },
  {
    id: 'coffee-cup',
    group: 'domestic-ecosystems',
    artwork: {
      imageSlug: 'coffee-cup',
      title: { primary: 'Kaffekopp', secondary: 'ritualobjekt' },
      sections: curatedArtworkNotes['coffee-cup'],
    },
  },
  {
    id: 'leg-prism',
    group: 'domestic-ecosystems',
    artwork: {
      imageSlug: 'leg-prism',
      title: { primary: 'Beinprisme', secondary: 'kropp på gulvfelt' },
      sections: curatedArtworkNotes['leg-prism'],
    },
  },
  {
    id: 'drain-bloom',
    group: 'domestic-ecosystems',
    artwork: {
      imageSlug: 'drain-bloom',
      title: { primary: 'Slukblomst', secondary: 'våtromsorganisme' },
      sections: curatedArtworkNotes['drain-bloom'],
    },
  },
  {
    id: 'mushroom-offering',
    group: 'hand-portals',
    artwork: {
      imageSlug: 'mushroom-offering',
      title: { primary: 'Tatovert sopphånd', secondary: 'klar signatur' },
      sections: curatedArtworkNotes['mushroom-offering'],
    },
  },
  {
    id: 'mycelial-hand',
    group: 'hand-portals',
    artwork: {
      imageSlug: 'mycelial-hand',
      title: { primary: 'Magisk hånd', secondary: 'organisk portal' },
      sections: curatedArtworkNotes['mycelial-hand'],
    },
  },
  {
    id: 'fractal-palm',
    group: 'hand-portals',
    artwork: {
      imageSlug: 'fractal-palm',
      title: { primary: 'Fraktal håndflate', secondary: 'makroportal' },
      sections: curatedArtworkNotes['fractal-palm'],
    },
  },
  {
    id: 'phone-portal',
    group: 'hand-portals',
    artwork: {
      imageSlug: 'phone-portal',
      title: { primary: 'Telefonportal', secondary: 'ramme i ramme' },
      sections: curatedArtworkNotes['phone-portal'],
    },
  },
  {
    id: 'mirror-wanderer',
    group: 'hand-portals',
    artwork: {
      imageSlug: 'mirror-wanderer',
      title: { primary: 'Vandreren', secondary: 'speilrom med hånd' },
      sections: curatedArtworkNotes['mirror-wanderer'],
    },
  },
  {
    id: 'fingernail-portal',
    group: 'hand-portals',
    artwork: {
      imageSlug: 'fingernail-portal',
      title: { primary: 'Negleportal', secondary: 'liten kroppsåpning' },
      sections: curatedArtworkNotes['fingernail-portal'],
    },
  },
  {
    id: 'soft-mushroom-hand',
    group: 'hand-portals',
    artwork: {
      imageSlug: 'soft-mushroom-hand',
      title: { primary: 'Myk sopphånd', secondary: 'meditativ variant' },
      sections: curatedArtworkNotes['soft-mushroom-hand'],
    },
  },
];

export const stillArtworks: readonly LibraryArtworkEntry[] = [
  ...coreStillArtworks,
  ...bodyStillArtworks,
];
