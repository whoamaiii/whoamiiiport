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
    primary: 'Mushroom Offering',
    secondary: 'soft signal study',
  },
  sectionsLang: 'no',
  sections: [
    {
      body: `Dette bildet er mer stille enn de elektriske skogverkene, men det har samme indre språk. En hånd holder en sopp som et lite fysisk objekt, mens huden og bakgrunnen glir over i mønstre, riller og regnbueaktig lys. Det føles nært, taktilt og litt drømmeaktig.`,
    },
    {
      heading: 'Mening',
      body: `For meg handler det om den lille gesten: å holde noe i hånden og la hele synsfeltet rundt handlingen begynne å endre seg. Soppen er sentrum, men bildet handler like mye om hvordan hud, tekstil, lys og psykedelisk mønster begynner å høre sammen.`,
    },
    {
      heading: 'Byggelogikk',
      body: `Komposisjonen fungerer fordi den er enkel i fronten og kompleks i overflaten. Hånden gir realisme og skala. Soppen gir et tydelig punkt å lande på. De myke mønstrene i huden og det prismatiske lyset bygger den endrede tilstanden uten å overdøve motivet.`,
    },
    {
      heading: 'Overflate',
      body: `Jeg liker at bildet ikke er høyt og neon-aggressivt. Det er mer porøst: lilla hudtoner, matte skygger, små detaljer i soppen og regnbuebånd som ligger som optiske spor over kroppen. Det gir serien en roligere første inngang før de mer intense verkene kommer.`,
    },
  ],
};

export const mycelialHandArtwork: SpecialArtwork = {
  imageSlug: 'mycelial-hand',
  title: {
    primary: 'Mycelial Hand',
    secondary: 'forest signal study',
  },
  sectionsLang: 'no',
  sections: [
    {
      body: `Dette verket flytter identiteten fra ansiktet til hånden. Fingrene blir et lite økosystem: sopp, våt hud, chrome-resin og skoglys vokser inn i samme form. Det er fortsatt en kropp, men kroppen virker som om den har begynt å samarbeide med skogen rundt seg.`,
    },
    {
      heading: 'Mening',
      body: `For meg handler bildet om kontakt. Ikke kontakt som noe romantisk eller mykt, men som en fysisk kobling mellom hånd, jord, lys og psykedelisk signal. Soppene gjør hånden levende på en ny måte, mens den blå himmelen over trekker alt inn i et større, nesten kosmisk system.`,
    },
    {
      heading: 'Byggelogikk',
      body: `Komposisjonen er enkel og sterk: hånden fyller fronten, skogen holder dybden, og himmelen åpner bildet opp. De organiske detaljene får være intense, men de følger fortsatt fingrene og håndflaten. Derfor føles mutasjonen festet til kroppen i stedet for limt oppå den.`,
    },
    {
      heading: 'Overflate',
      body: `Jeg ville at materialene skulle være litt ubehagelig taktile. Soppene er myke og jordlige, chrome-resinet er blankt og kunstig, huden er våt og nær, og skogen er skarp nok til at bildet ikke mister sin fotografiske kropp. Det er et bilde av vekst, men også av kontrolltap.`,
    },
  ],
};

export const handPortalVideoArtwork: SpecialArtwork = {
  imageSlug: 'hand-portal-video-poster',
  videoSrc: GALLERY_VIDEOS.handPortal.src,
  title: {
    primary: 'Hand Portal',
    secondary: 'moving organic study',
  },
  sectionsLang: 'no',
  sections: [
    {
      body: `Dette er et bevegelig håndverk der håndflaten åpner seg som et organisk rom. Videoen starter nært og nesten rolig, men innsiden begynner å folde seg ut i lag av fingre, hud, mønster og mørke. Det er mer kroppslig enn dekorativt.`,
    },
    {
      heading: 'Mening',
      body: `Jeg leser den som en portal uten fantasy-språk. Åpningen i hånden er ikke en magisk dør, men et indre trykkpunkt som blir synlig. Den menneskelige kroppen blir et sted, nesten en arkitektur, og bevegelsen gjør at bildet føles som en prosess i stedet for en ferdig pose.`,
    },
    {
      heading: 'Byggelogikk',
      body: `Posterbildet er valgt sent i videoen fordi det viser hele ideen: håndformen, den revne kanten, det mørke sentrumet og de små gjentatte hendene inni. Selve videoen er komprimert til en lett webversjon, så modalvisningen kan være levende uten at galleriet blir tungt på mobil.`,
    },
  ],
};

export const skinTerrainVideoArtwork: SpecialArtwork = {
  imageSlug: 'skin-terrain-video-poster',
  videoSrc: GALLERY_VIDEOS.skinTerrain.src,
  title: {
    primary: 'Skin Terrain',
    secondary: 'macro texture motion',
  },
  sectionsLang: 'no',
  sections: [
    {
      body: `Dette videoverket er mer abstrakt og stille enn de andre. Det ser ut som en overflate mellom hud, tekstil og landskap, filmet så nært at skalaen blir usikker. Rillene beveger seg som en myk topografi, med små hår og kromatiske kanter som gjør materialet levende.`,
    },
    {
      heading: 'Mening',
      body: `Jeg liker at det ikke forklarer seg med et tydelig objekt. Det fungerer mer som en pustende detalj fra samme univers: en overflate som kunne vært kropp, teppe, hud, terreng eller et mikroskopisk landskap. Det gir galleriet et roligere, mer taktilt punkt mellom de mer intense bildene.`,
    },
    {
      heading: 'Byggelogikk',
      body: `Videoen er lagt inn som et teksturstudie med eget posterbilde, ikke som en bakgrunnseffekt. Den trenger bare å vise bevegelse, dybde og materialfølelse. Derfor er den holdt lett, uten lyd, og åpnes først når noen velger verket.`,
    },
  ],
};
