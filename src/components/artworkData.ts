import type { ModalImageSlug } from '../utils/images';
import { GALLERY_VIDEOS } from '../utils/media';

export interface ArtworkSection {
  heading?: string;
  body: string;
  formula?: string;
  formulaCaption?: string;
}

export type ArtworkTitle = {
  primary: string;
  secondary?: string;
};

export interface SpecialArtwork {
  imageSlug: ModalImageSlug;
  videoSrc?: string;
  title: ArtworkTitle;
  sections: ArtworkSection[];
  /** BCP 47 language of the notes sections when it differs from the page language. */
  sectionsLang?: 'no';
}

export const mushroomOfferingArtwork: SpecialArtwork = {
  imageSlug: 'mushroom-offering',
  title: {
    primary: 'Soppoffer',
    secondary: 'myk signalstudie',
  },
  sections: [
    {
      body: `Dette bildet er stille, men det snakker samme språk som de mer intense verkene. En hånd holder en sopp som et lite offer, mens hud, stoff og lys begynner å gli inn i det samme myke mønsterfeltet.`,
    },
    {
      heading: 'Lesning',
      body: `For meg handler det om den lille gesten: å holde noe i hånden og se hele synsfeltet rundt handlingen begynne å forandre seg. Soppen er ankeret, men motivet handler like mye om hvordan alt rundt den plutselig hører sammen.`,
    },
    {
      heading: 'Byggelogikk',
      body: `Komposisjonen er enkel i fronten og mer kompleks i overflaten. Hånden gir skala, soppen gir blikket et sted å lande, og prismedetaljene lar den endrede tilstanden vokse uten å sluke objektet.`,
    },
    {
      heading: 'Overflate',
      body: `Jeg liker at bildet ikke trenger å rope. Det føles porøst: hudtone, myk skygge, små detaljer i soppen og regnbuespor som ligger på kroppen som noe lyset husket.`,
    },
  ],
};

export const mycelialHandArtwork: SpecialArtwork = {
  imageSlug: 'mycelial-hand',
  title: {
    primary: 'Mycelhånd',
    secondary: 'skoglig signalstudie',
  },
  sections: [
    {
      body: `Dette verket flytter identiteten bort fra ansiktet og inn i hånden. Fingrene blir et lite økosystem: sopp, våt hud, kromresin og skogslys som prøver å vokse gjennom samme kropp.`,
    },
    {
      heading: 'Lesning',
      body: `Det handler om kontakt, men ikke på en romantisk måte. Mer som en fysisk kobling mellom hånd, jord, lys og signal. Soppene gjør kroppen levende i et annet register.`,
    },
    {
      heading: 'Byggelogikk',
      body: `Hånden fyller forgrunnen, skogen holder dybden, og himmelen åpner trykket oppover. Mutasjonen fungerer fordi den følger fingrene og håndflaten i stedet for å ligge oppå som pynt.`,
    },
    {
      heading: 'Overflate',
      body: `Jeg vil at materialene skal føles nesten for taktile. Soppene er myke og jordlige, resinen blank og kunstig, huden nær, og skogen holder bildet fast i virkeligheten.`,
    },
  ],
};

export const handPortalVideoArtwork: SpecialArtwork = {
  imageSlug: 'hand-portal-video-poster',
  videoSrc: GALLERY_VIDEOS.handPortal.src,
  title: {
    primary: 'Håndportal',
    secondary: 'bevegelig organisk studie',
  },
  sections: [
    {
      body: `Dette er hånden som blir til et rom. Videoen starter nært og nesten rolig, før håndflaten begynner å folde seg ut i hud, fingre, mønster og mørkt indre rom.`,
    },
    {
      heading: 'Lesning',
      body: `Jeg leser den som en portal uten fantasy-språk. Åpningen er ikke magi; den er et indre trykkpunkt som blir synlig. Kroppen blir et sted, nesten en arkitektur.`,
    },
    {
      heading: 'Byggelogikk',
      body: `Posterbildet fanger hele ideen: håndformen, den revne kanten, det mørke sentrumet og de små gjentatte formene inni. Bevegelsen er viktig fordi verket føles mer som en prosess enn en ferdig positur.`,
    },
  ],
};

export const fingernailPortalArtwork: SpecialArtwork = {
  imageSlug: 'fingernail-portal',
  title: {
    primary: 'Negleportal',
    secondary: 'spiral detaljstudie',
  },
  sections: [
    {
      body: `En liten kroppslig detalj blir til et helt rom. Neglen krøller seg innover som et spiralskall, mens hud, glans, revne kanter og prismemønster lager en portal av noe man vanligvis overser.`,
    },
    {
      heading: 'Lesning',
      body: `For meg handler det om hvor mye som kan åpne seg i noe nært og vanlig. Fingeren forblir fysisk og gjenkjennelig, men neglen blir et sted å gå inn i.`,
    },
    {
      heading: 'Byggelogikk',
      body: `Spiralen holder blikket fast. Den store neglen bygger portalen, den mindre gjentakelsen gir rytme, og det iriserende feltet gjør skalaen både makro og kosmisk.`,
    },
    {
      heading: 'Overflate',
      body: `Overflaten er blank, våt og nesten skjør. Huden holder det intimt, mens den holografiske detaljen gir det en mer elektrisk kropp. Det skal kjennes taktilt før det kjennes digitalt.`,
    },
  ],
};

export const skinTerrainVideoArtwork: SpecialArtwork = {
  imageSlug: 'skin-terrain-video-poster',
  videoSrc: GALLERY_VIDEOS.skinTerrain.src,
  title: {
    primary: 'Hudterreng',
    secondary: 'makrotekstur i bevegelse',
  },
  sections: [
    {
      body: `Denne videoen er roligere og mer abstrakt enn kroppsportalene. Den føles som en overflate mellom hud, tekstil og landskap, filmet så nært at skalaen slutter å oppføre seg.`,
    },
    {
      heading: 'Lesning',
      body: `Jeg liker at den ikke forklarer seg gjennom et tydelig objekt. Den fungerer som en pustende detalj fra samme univers: kropp, stoff, terreng og mikroskopisk landskap samlet i én tekstur.`,
    },
    {
      heading: 'Byggelogikk',
      body: `Den er behandlet som en teksturstudie, ikke en bakgrunnseffekt. Bevegelsen trenger bare å vise dybde og materialfølelse, slik at verket kan være lett i galleriet og bli levende når det åpnes.`,
    },
  ],
};
