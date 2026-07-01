import { GALLERY_VIDEOS } from '../utils/media';
import { curatedArtworkNotes } from './curatedArtworkNotes';
import type { LibraryArtworkEntry } from './portfolioGroups';

export const videoArtworks: readonly LibraryArtworkEntry[] = [
  {
    id: 'corridor-wall-touch',
    group: 'liminal-rooms',
    artwork: {
      imageSlug: GALLERY_VIDEOS.corridorWallTouch.posterSlug,
      videoSrc: GALLERY_VIDEOS.corridorWallTouch.src,
      title: { primary: 'Korridorvegg', secondary: 'hånd i bevegelse' },
      sections: curatedArtworkNotes['corridor-wall-touch'],
    },
  },
  {
    id: 'corridor-master',
    group: 'liminal-rooms',
    artwork: {
      imageSlug: GALLERY_VIDEOS.corridorMaster.posterSlug,
      videoSrc: GALLERY_VIDEOS.corridorMaster.src,
      title: { primary: 'Korridormaster', secondary: 'bevegelig hovedrom' },
      sections: curatedArtworkNotes['corridor-master'],
    },
  },
  {
    id: 'video5-optical-focus',
    group: 'liminal-rooms',
    artwork: {
      imageSlug: GALLERY_VIDEOS.video5OpticalFocus.posterSlug,
      videoSrc: GALLERY_VIDEOS.video5OpticalFocus.src,
      title: { primary: 'Optisk fokus', secondary: 'Video 5 final' },
      sections: curatedArtworkNotes['video5-optical-focus'],
    },
  },
  {
    id: 'kaaffe-texture-motion',
    group: 'domestic-ecosystems',
    artwork: {
      imageSlug: GALLERY_VIDEOS.kaaffeTextureMotion.posterSlug,
      videoSrc: GALLERY_VIDEOS.kaaffeTextureMotion.src,
      title: { primary: 'Kaffeflate', secondary: 'tekstur i bevegelse' },
      sections: curatedArtworkNotes['kaaffe-texture-motion'],
    },
  },
  {
    id: 'psych-depth-embed-focus',
    group: 'hand-portals',
    artwork: {
      imageSlug: GALLERY_VIDEOS.psychDepthEmbedFocus.posterSlug,
      videoSrc: GALLERY_VIDEOS.psychDepthEmbedFocus.src,
      title: { primary: 'Dybdefokus', secondary: 'innfelt OEV' },
      sections: curatedArtworkNotes['psych-depth-embed-focus'],
    },
  },
  {
    id: 'cup-object-study',
    group: 'domestic-ecosystems',
    artwork: {
      imageSlug: GALLERY_VIDEOS.cupObjectStudy.posterSlug,
      videoSrc: GALLERY_VIDEOS.cupObjectStudy.src,
      title: { primary: 'Objekt på flate', secondary: 'hjemlig studie' },
      sections: curatedArtworkNotes['cup-object-study'],
    },
  },
  {
    id: 'cup-coffee',
    group: 'domestic-ecosystems',
    artwork: {
      imageSlug: GALLERY_VIDEOS.cupCoffee.posterSlug,
      videoSrc: GALLERY_VIDEOS.cupCoffee.src,
      title: { primary: 'Kaffebevegelse', secondary: 'kopp som anker' },
      sections: curatedArtworkNotes['cup-coffee'],
    },
  },
  {
    id: 'rug-field',
    group: 'domestic-ecosystems',
    artwork: {
      imageSlug: GALLERY_VIDEOS.rugField.posterSlug,
      videoSrc: GALLERY_VIDEOS.rugField.src,
      title: { primary: 'Teppefelt', secondary: 'gulvvideo master' },
      sections: curatedArtworkNotes['rug-field'],
    },
  },
  {
    id: 'living-floor-video',
    group: 'domestic-ecosystems',
    artwork: {
      imageSlug: GALLERY_VIDEOS.livingFloor.posterSlug,
      videoSrc: GALLERY_VIDEOS.livingFloor.src,
      title: { primary: 'Gulvfinal', secondary: 'donefloor' },
      sections: curatedArtworkNotes['living-floor-video'],
    },
  },
  {
    id: 'magic-hand-motion',
    group: 'hand-portals',
    artwork: {
      imageSlug: GALLERY_VIDEOS.magicHandMotion.posterSlug,
      videoSrc: GALLERY_VIDEOS.magicHandMotion.src,
      title: { primary: 'Magisk håndbevegelse', secondary: 'portalstudie' },
      sections: curatedArtworkNotes['magic-hand-motion'],
    },
  },
  {
    id: 'tattooed-mushroom',
    group: 'hand-portals',
    artwork: {
      imageSlug: GALLERY_VIDEOS.tattooedMushroom.posterSlug,
      videoSrc: GALLERY_VIDEOS.tattooedMushroom.src,
      title: { primary: 'Tatovert soppvideo', secondary: 'OEV final' },
      sections: curatedArtworkNotes['tattooed-mushroom'],
    },
  },
  {
    id: 'mushroom-motion',
    group: 'hand-portals',
    artwork: {
      imageSlug: GALLERY_VIDEOS.mushroomMotion.posterSlug,
      videoSrc: GALLERY_VIDEOS.mushroomMotion.src,
      title: { primary: 'Soppbevegelse', secondary: 'motion master' },
      sections: curatedArtworkNotes['mushroom-motion'],
    },
  },
  {
    id: 'body-sink-companion',
    group: 'sink-organisms',
    artwork: {
      imageSlug: GALLERY_VIDEOS.bodySinkCompanion.posterSlug,
      videoSrc: GALLERY_VIDEOS.bodySinkCompanion.src,
      title: { primary: 'Kroppsvask', secondary: 'sink companion' },
      sections: curatedArtworkNotes['body-sink-companion'],
    },
  },
  {
    id: 'ecological-hand-study',
    group: 'sink-organisms',
    artwork: {
      imageSlug: GALLERY_VIDEOS.ecologicalHandStudy.posterSlug,
      videoSrc: GALLERY_VIDEOS.ecologicalHandStudy.src,
      title: { primary: 'Økologisk håndstudie', secondary: 'våt body-horror' },
      sections: curatedArtworkNotes['ecological-hand-study'],
    },
  },
  {
    id: 'tongue-study',
    group: 'tongue-terrain',
    artwork: {
      imageSlug: GALLERY_VIDEOS.tongueStudy.posterSlug,
      videoSrc: GALLERY_VIDEOS.tongueStudy.src,
      title: { primary: 'Tungevideo', secondary: 'hovedmotion' },
      sections: curatedArtworkNotes['tongue-study'],
    },
  },
  {
    id: 'dark-figure-sequence',
    group: 'threshold-studies',
    artwork: {
      imageSlug: GALLERY_VIDEOS.darkFigureSequence.posterSlug,
      videoSrc: GALLERY_VIDEOS.darkFigureSequence.src,
      title: { primary: 'Mørk figursekvens', secondary: 'prologvideo' },
      sections: curatedArtworkNotes['dark-figure-sequence'],
    },
  },
  {
    id: 'eye-hood-study',
    group: 'threshold-studies',
    artwork: {
      imageSlug: GALLERY_VIDEOS.eyeHoodStudy.posterSlug,
      videoSrc: GALLERY_VIDEOS.eyeHoodStudy.src,
      title: { primary: 'Øye og hette', secondary: 'nært vitne' },
      sections: curatedArtworkNotes['eye-hood-study'],
    },
  },
  {
    id: 'face-performance',
    group: 'threshold-studies',
    artwork: {
      imageSlug: GALLERY_VIDEOS.facePerformance.posterSlug,
      videoSrc: GALLERY_VIDEOS.facePerformance.src,
      title: { primary: 'Ansiktsperformance', secondary: 'munn og materiale' },
      sections: curatedArtworkNotes['face-performance'],
    },
  },
  {
    id: 'bark-material',
    group: 'threshold-studies',
    artwork: {
      imageSlug: GALLERY_VIDEOS.barkMaterial.posterSlug,
      videoSrc: GALLERY_VIDEOS.barkMaterial.src,
      title: { primary: 'Barkmateriale', secondary: 'teksturtest' },
      sections: curatedArtworkNotes['bark-material'],
    },
  },
  {
    id: 'void-spiral',
    group: 'threshold-studies',
    artwork: {
      imageSlug: GALLERY_VIDEOS.voidSpiral.posterSlug,
      videoSrc: GALLERY_VIDEOS.voidSpiral.src,
      title: { primary: 'Spiralvoid', secondary: 'abstrakt studie' },
      sections: curatedArtworkNotes['void-spiral'],
    },
  },
];
