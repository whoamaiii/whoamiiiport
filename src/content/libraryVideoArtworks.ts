import type { SpecialArtwork } from '../components/artworkData';
import { GALLERY_VIDEOS } from '../utils/media';

interface LibraryVideoArtworkEntry {
  readonly id: string;
  readonly artwork: SpecialArtwork;
}

export const videoArtworks = [
  {
    id: 'tongue-study',
    artwork: {
      imageSlug: GALLERY_VIDEOS.tongueStudy.posterSlug,
      videoSrc: GALLERY_VIDEOS.tongueStudy.src,
      title: {
        primary: 'Tungestudie',
        secondary: 'vått bevegelsessignal',
      },
      sections: [
        {
          body:
            'En kort våt studie der tungelignende tekstur, overflateglans og nær organisk bevegelse blir hele motivet. Den hører sammen med kroppsverkene fordi den er intim før den er abstrakt.',
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
        primary: 'Tatovert sopp',
        secondary: 'håndritual i bevegelse',
      },
      sections: [
        {
          body:
            'En tatovert hånd og en sopp bærer offergesten inn i tid. Bevegelsen gjør at objektet føles holdt, sett på og nesten ladet av oppmerksomheten rundt det.',
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
        primary: 'Gatetripp',
        secondary: 'gående forvrengning',
      },
      sections: [
        {
          body:
            'Gatebevegelse blir til en vrengt korridor av farge. Figuren blir inne i bildets puls, fortsatt gående, mens verden rundt mister de rette kantene sine.',
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
        primary: 'Fotsignal',
        secondary: 'bakkekontakt i bevegelse',
      },
      sections: [
        {
          body:
            'En bevegelsesstudie i fothøyde om trykk og kontakt. Bakken er ikke bakgrunn her; den svarer kroppen tilbake gjennom refraktert mønster og små vektforskyvninger.',
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
        primary: 'Korridorsignal',
        secondary: 'arkitektonisk drift',
      },
      sections: [
        {
          body:
            'En korridor bøyer seg inn i et endret romfelt. Den rette arkitekturen gir driften noe å presse mot, så forvrengningen føles målt i stedet for løs.',
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
        primary: 'Øyebevegelse',
        secondary: 'nært portrett i bevegelse',
      },
      sections: [
        {
          body:
            'Øyeportrettet blir tidslig. Små skift i hud, lys og tekstur gjør ansiktet levende og ustabilt, som om bildet tenker gjennom øyet.',
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
        primary: 'Ekkel mat',
        secondary: 'visceral bordbevegelse',
      },
      sections: [
        {
          body:
            'Et matformet bevegelsesverk som lener seg inn i ubehag, glans og organisk overlast. Det fungerer når avskyen og håndverket får bli i samme bilde.',
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
        primary: 'Aprilportal',
        secondary: 'vertikal arkivbevegelse',
      },
      sections: [
        {
          body:
            'Et vertikalt arkivverk bygget for å sees som et fokusert objekt, ikke som bakgrunnstekstur. Det holder portalspråket høyt, komprimert og nært kroppen.',
        },
      ],
    },
  },
] satisfies readonly LibraryVideoArtworkEntry[];
