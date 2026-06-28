import type { SpecialArtwork } from '../components/artworkData';
import { FEATURED_ARTWORKS } from './featuredArtworks';
import { GALLERY_VIDEOS } from '../utils/media';

export interface LibraryArtworkEntry {
  readonly id: string;
  readonly artwork: SpecialArtwork;
}

const stillArtworks = [
  {
    id: 'eye-terrain',
    artwork: {
      imageSlug: 'eye-terrain',
      title: {
        primary: 'Eye Terrain',
        secondary: 'macro signal portrait',
      },
      sections: [
        {
          body:
            'A close eye becomes a surface map: skin, lashes, iris, and raised patterning all sit in the same wet optical field.',
        },
        {
          heading: 'Reading',
          body:
            'The piece is intimate before it is surreal. The altered texture follows the face closely, so the psychedelic layer feels embedded in the body instead of pasted over it.',
        },
      ],
    },
  },
  {
    id: 'trippy-jump',
    artwork: {
      imageSlug: 'trippy-jump',
      title: {
        primary: 'Trippy Jump',
        secondary: 'falling color study',
      },
      sections: [
        {
          body:
            'A body moves into a saturated tunnel where the ground, sky, and motion blur collapse into one loud field of color.',
        },
        {
          heading: 'Reading',
          body:
            'This one works like impact and velocity. The figure stays readable, but everything around it breaks into the pressure of the fall.',
        },
      ],
    },
  },
  {
    id: 'snow-road',
    artwork: {
      imageSlug: 'snow-road',
      title: {
        primary: 'Snow Road',
        secondary: 'night caustic study',
      },
      sections: [
        {
          body:
            'Streetlight and snow turn into a cold liquid surface, with tiny ripples and loops crawling through the edge of the road.',
        },
        {
          heading: 'Reading',
          body:
            'The restraint matters here. It keeps the scene photographic while the snow starts behaving like a living texture.',
        },
      ],
    },
  },
  {
    id: 'fingernail-portal',
    artwork: {
      imageSlug: 'fingernail-portal',
      title: {
        primary: 'Fingernail Portal',
        secondary: 'spiral detail study',
      },
      sections: [
        {
          body:
            'A nail curls inward like a tiny chamber, with soft skin and glittering surface detail folding into a nested spiral.',
        },
        {
          heading: 'Reading',
          body:
            'It is small, tactile, and slightly impossible. The piece turns a familiar body detail into an architectural opening.',
        },
      ],
    },
  },
  {
    id: 'night-bus',
    artwork: {
      imageSlug: 'night-bus',
      title: {
        primary: 'Night Bus',
        secondary: 'transit pattern study',
      },
      sections: [
        {
          body:
            'A rainy bus interior becomes a moving archive of reflections, window glare, patterned seats, and hand-scale contact.',
        },
        {
          heading: 'Reading',
          body:
            'The ordinary setting keeps the image grounded. The altered-state language arrives through fabric, glass, rain, and light rather than a fantasy scene.',
        },
      ],
    },
  },
  {
    id: 'handpose-mouth',
    artwork: {
      imageSlug: 'handpose-mouth',
      title: {
        primary: 'Handpose Mouth',
        secondary: 'visceral table study',
      },
      sections: [
        {
          body:
            'A hand-shaped form opens into teeth, strands, and organic texture, staged like an object on a plate under refracted light.',
        },
        {
          heading: 'Reading',
          body:
            'The image sits between body horror and craft object. It is uncomfortable, but the material detail keeps pulling the eye back in.',
        },
      ],
    },
  },
] satisfies readonly LibraryArtworkEntry[];

const videoArtworks = [
  {
    id: 'tongue-study',
    artwork: {
      imageSlug: GALLERY_VIDEOS.tongueStudy.posterSlug,
      videoSrc: GALLERY_VIDEOS.tongueStudy.src,
      title: {
        primary: 'Tongue Study',
        secondary: 'wet motion signal',
      },
      sections: [
        {
          body:
            'A short moving study built around tongue-like texture, wet surface detail, and close organic motion.',
        },
      ],
    },
  },
  {
    id: 'tattooed-mushroom',
    artwork: {
      imageSlug: GALLERY_VIDEOS.tattooedMushroom.posterSlug,
      videoSrc: GALLERY_VIDEOS.tattooedMushroom.src,
      title: {
        primary: 'Tattooed Mushroom',
        secondary: 'hand ritual video',
      },
      sections: [
        {
          body:
            'A tattooed hand and mushroom move through the same altered field as the still work, carrying the gesture into time.',
        },
      ],
    },
  },
  {
    id: 'street-trip',
    artwork: {
      imageSlug: GALLERY_VIDEOS.streetTrip.posterSlug,
      videoSrc: GALLERY_VIDEOS.streetTrip.src,
      title: {
        primary: 'Street Trip',
        secondary: 'walking distortion',
      },
      sections: [
        {
          body:
            'Street movement turns into a warped corridor of color, with the figure held inside the pulse of the frame.',
        },
      ],
    },
  },
  {
    id: 'feet-signal',
    artwork: {
      imageSlug: GALLERY_VIDEOS.feetSignal.posterSlug,
      videoSrc: GALLERY_VIDEOS.feetSignal.src,
      title: {
        primary: 'Foot Signal',
        secondary: 'ground contact video',
      },
      sections: [
        {
          body:
            'A foot-level motion study where surface, pressure, and refracted pattern become the main event.',
        },
      ],
    },
  },
  {
    id: 'corridor-signal',
    artwork: {
      imageSlug: GALLERY_VIDEOS.corridorSignal.posterSlug,
      videoSrc: GALLERY_VIDEOS.corridorSignal.src,
      title: {
        primary: 'Corridor Signal',
        secondary: 'architecture drift',
      },
      sections: [
        {
          body:
            'A corridor bends into an altered spatial field, using straight architecture as the structure for the visual drift.',
        },
      ],
    },
  },
  {
    id: 'eye-video',
    artwork: {
      imageSlug: GALLERY_VIDEOS.eyeVideo.posterSlug,
      videoSrc: GALLERY_VIDEOS.eyeVideo.src,
      title: {
        primary: 'Eye Motion',
        secondary: 'close portrait video',
      },
      sections: [
        {
          body:
            'The eye portrait becomes temporal: small shifts in surface, light, and texture make the face feel alive and unstable.',
        },
      ],
    },
  },
  {
    id: 'nasty-food',
    artwork: {
      imageSlug: GALLERY_VIDEOS.nastyFood.posterSlug,
      videoSrc: GALLERY_VIDEOS.nastyFood.src,
      title: {
        primary: 'Nasty Food',
        secondary: 'visceral motion study',
      },
      sections: [
        {
          body:
            'A visceral food-form video that leans into discomfort, gloss, and organic overload without losing the crafted surface language.',
        },
      ],
    },
  },
  {
    id: 'april-portal',
    artwork: {
      imageSlug: GALLERY_VIDEOS.aprilPortal.posterSlug,
      videoSrc: GALLERY_VIDEOS.aprilPortal.src,
      title: {
        primary: 'April Portal',
        secondary: 'vertical archive video',
      },
      sections: [
        {
          body:
            'A tall archive video converted into a lighter web study, built for viewing as a focused moving artwork rather than a background loop.',
        },
      ],
    },
  },
] satisfies readonly LibraryArtworkEntry[];

export const LIBRARY_ARTWORKS: readonly LibraryArtworkEntry[] = [
  ...FEATURED_ARTWORKS,
  ...stillArtworks,
  ...videoArtworks,
];
