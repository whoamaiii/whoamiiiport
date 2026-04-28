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
  secondaryLanguage?: 'en' | 'no';
};

export interface SpecialArtwork {
  imageSlug: ModalImageSlug;
  videoSrc?: string;
  title: ArtworkTitle;
  sections: ArtworkSection[];
}

export const liquidPerceptionArtwork: SpecialArtwork = {
  imageSlug: 'liquid-perception',
  title: {
    primary: 'Liquid Perception',
    secondary: 'chrome skin study',
  },
  sections: [
    {
      body: `Dette bildet startet som noe veldig direkte: en tett utendørs selfie i hette, sollys og skog. Det kunne egentlig ha blitt et helt vanlig portrett, men jeg ville presse det til punktet der virkeligheten fortsatt er der, samtidig som overflaten begynner å oppføre seg feil. Ansiktet er fortsatt lesbart, øynene er fortsatt menneskelige, og kamerafølelsen er fortsatt nær, men huden, himmelen og kantene har begynt å ta inn et annet signal.\n\nFor meg handler verket om identitet som ikke forsvinner i forvrengningen, men blir mer synlig gjennom den. Chrome-formene ligger ikke som en maske som skjuler ansiktet. De fungerer mer som et materiale for persepsjon: blankt, hardt, flytende og nesten kirurgisk, som om synet selv har størknet oppå huden.`,
    },
    {
      heading: 'Mening',
      body: `Jeg ville at bildet skulle sitte mellom kontroll og overbelastning. Figuren står fortsatt midt i seg selv, men verden rundt har begynt å avsløre skjulte systemer: himmelen blir cellulær, skogen blir elektrisk, kantene splittes i farge, og hendene med røde negler gjør selfien mer rituell enn tilfeldig.\n\nDet interessante for meg er spenningen mellom det organiske og det syntetiske. Varm hud, mørk hoodie, bark og sollys møter flytende metall, cyan glød og en himmel som nesten ser ut som en nerveflate. Bildet spør egentlig ikke hvem personen er. Det spør hva som skjer med et selvbilde når hele synsfeltet begynner å speile, forsterke og mutere det.`,
    },
    {
      heading: 'Metode',
      body: `Arbeidsregelen var å beskytte portrettet først. Ansiktsformen, øynene, munnen, skjegget, håret, hendene, hoodien og den skrå selfie-vinkelen måtte få bli igjen som realistiske holdepunkter. Hvis alt hadde smeltet samtidig, ville bildet bare blitt visuelt bråk. Derfor ligger den sterkeste transformasjonen i utvalgte flater: chrome-fragmentene i ansiktet og på hendene, den blå cellulære himmelen, barken, løvet og de kromatiske kantene.\n\nLightroom-delen handlet om å balansere intensiteten etterpå: holde sollyset varmt, la skyggene i hoodien bli tunge, gjøre blåtonene dype uten at de ble plastiske, og stramme opp kontrasten slik at chrome-materialet føles integrert i bildet i stedet for limt på. Effekten skulle kjennes høyintensiv, men kontrollert.`,
    },
    {
      heading: 'Overflate-logikk',
      body: `Jeg tenkte på bildet som et system av materialer. Hud måtte fortsatt være hud. Chrome måtte oppføre seg som flytende speil. Hoodien måtte være matt, mørk og tekstilaktig. Skogen kunne få bære mer fargestøy og kantdeling fordi grener, bark og løv allerede er naturlige mønstersystemer. Himmelen fikk mest frihet, og ble gjort om til et blått felt av celler, bølger og lysende membraner.\n\nDet er derfor bildet fortsatt føles fotografisk selv om det er langt fra realistisk. Forvrengningen er ikke fordelt likt over alt. Den er forankret i hvilke overflater som tåler hva. Ansiktet holder identiteten. Chrome holder det kunstige speilet. Skogen holder fraktal energi. Himmelen holder den indre geometrien.`,
      formula: `stabilitet = ansikt + blikk + selfie-perspektiv + sollys\n\nforvrengning = chrome(overflate) + cellulær_himmel + kromatisk_kanttrykk\n\nportrett_troverdighet = stabilitet - global_oppløsning + materialpresisjon`,
      formulaCaption: 'Dette er arbeidsregelen bak bildet: ikke oppløse alt, men la bestemte flater bære bestemte typer signal.',
    },
    {
      heading: 'Tilstand',
      body: `Jeg prøver ikke å skrive dette som en bokstavelig forklaring på et rusminne. Det som interesserer meg er mer presist enn det: følelsen av at et vanlig bilde plutselig får for mye informasjon i seg. Ikke fantasy, ikke filter, ikke tilfeldig psykedelisk pynt, men et portrett der realistisk lys og kropp blir presset inn i en annen visuell grammatikk.\n\nDerfor liker jeg at bildet fortsatt har telefonfoto-energi. Det er ikke et rent studiobilde. Det føles som bevis fra et øyeblikk der verden var ekte, men ikke stabil. Et ansikt, en skog, røde negler, sollys og en himmel som har begynt å vise nervesystemet sitt.`,
    },
  ],
};

export const psychedelicBathroomPortrait: SpecialArtwork = {
  imageSlug: 'psychedelic-bathroom-portrait',
  title: {
    primary: 'Psychedelic Bathroom Portrait',
    secondary: 'in distorted mirror light',
  },
  sections: [
    {
      body: `Dette bildet handler om øyeblikket der et helt vanlig bad slutter å føles som et rom og begynner å oppføre seg som et psykisk trykkammer. Flisene, dusjslangen og kroppen er fortsatt lesbare, men alt er presset gjennom mørke, fargestøy og kromatisk drift. Ansiktet er ikke borte; det er bare fanget midt i en forskyvning, som om synet bruker for lang tid på å samle seg igjen.\n\nJeg ville at bildet skulle kjennes fysisk og ubehagelig nært, ikke som en pen effektøvelse. Det viktige er at kroppen fortsatt er der, tung og tilstede, mens mønstrene i veggen og fargene i huden begynner å lekke inn i hverandre. Det er et portrett av persepsjon som mister fotfestet uten at rommet forsvinner helt.`,
    },
    {
      heading: 'Mening',
      body: `For meg ligger styrken i kontrasten mellom det private og det kosmiske. Badet er et av de mest hverdagslige stedene som finnes, men her blir det nesten seremonielt: mørkt, lukket og elektrisk. Figuren står ikke foran en fantastisk verden. Den fantastiske verdenen presser seg ut av flisene, huden og lyset.\n\nBildet handler ikke bare om å se rart. Det handler om å bli sittende fast i et øyeblikk der kroppen, rommet og signalstøyen i nervesystemet glir over i samme materiale. Det er derfor jeg liker at det er uklart og brutalt mørkt. Ubehaget er ikke en feil; det er selve motoren.`,
    },
    {
      heading: 'Byggelogikk',
      body: `Komposisjonen er holdt stram: figur i front, flislagt vegg som mønsterbærer, dusjslange som hard vertikal kontrast. Den psykedeliske delen fikk ikke lov til å oppfinne nye objekter. Den måtte feste seg til det som allerede finnes i bildet: ansiktsformen, hudflaten, fugene mellom flisene og de geometriske mønstrene i bakgrunnen.\n\nArbeidsregelen var å la veggen bære mest struktur, kroppen bære mest fargeforskyvning, og mørket holde alt samlet. Hvis hele bildet hadde blitt like lyst og detaljert, ville det mistet den klaustrofobiske energien. Derfor måtte store deler få være nesten svarte, slik at fargene føles som signaler som bryter gjennom i stedet for pynt som ligger oppå.`,
    },
  ],
};

export const psychedelicBathroomScream: SpecialArtwork = {
  imageSlug: 'psychedelic-bathroom-scream',
  title: {
    primary: 'Psychedelic Bathroom Scream',
    secondary: 'under tiled signal pressure',
  },
  sections: [
    {
      body: `Dette verket er mer eksplosivt enn den mørkere søsterversjonen. Her er ikke kroppen bare fanget i en forskyvning; den ser ut som den blir gjennomlyst av mønsteret rundt seg. Flisene, dusjslangen, huden og munnen danner ett hardt optisk felt, som om hele badet har blitt en skjerm for nervesystemet.\n\nJeg ville at bildet skulle føles som et visuelt skrik, men fortsatt være fysisk forankret. Det er ikke et abstrakt monsterbilde. Det er et bad, en kropp, en vegg og en dusj, presset så langt inn i kromatisk støy og konturlinjer at virkeligheten begynner å se ut som den har fått for mye signalstyrke.`,
    },
    {
      heading: 'Mening',
      body: `Det sterke her er at bildet ikke prøver å være rolig. Det lar panikken, intensiteten og mønsterpresset være hele poenget. Ansiktet oppløses ikke i tilfeldige effekter; det blir nesten et topografisk kart over overbelastning. Munnen blir et sentrum, ikke fordi den er realistisk, men fordi hele komposisjonen peker mot den.\n\nFor meg handler bildet om den typen indre trykk der rommet ikke lenger er passivt. Veggene begynner å svare. Overflatene begynner å stirre tilbake. Kroppen og omgivelsene slutter å være separate ting og blir ett felt av lys, frykt, mønster og energi.`,
    },
    {
      heading: 'Byggelogikk',
      body: `Komposisjonen fungerer fordi den bruker badet som et strukturert rutenett. Flisene holder bildet på plass mens mønsteret får lov til å bli voldsomt. Kroppen ligger foran dette systemet som en mørk, organisk motform, og dusjslangen gir en hard metallisk kurve som holder høyresiden stram.\n\nArbeidsregelen var å la konturlinjene følge materialene i stedet for å ligge som en løs effekt. Veggen får presise geometriske felt. Huden får tettere og mer kroppslig kromatikk. Munnen og ansiktet får høyest signalstyrke. Derfor leses bildet fortsatt som et rom, selv når alt i rommet skriker optisk.`,
    },
  ],
};

export const ferdigcopVideoArtwork: SpecialArtwork = {
  imageSlug: 'ferdigcop-video-poster',
  videoSrc: GALLERY_VIDEOS.ferdigcop.src,
  title: {
    primary: 'Ferdigcop',
    secondary: 'moving image study',
  },
  sections: [
    {
      body: `Dette er lagt inn som en levende arbeidspiece i stedet for et stillbilde. Videoen får beholde følelsen av en ferdig sekvens: bevegelse, lys, rytme og overgang står i sentrum, mens gallerikortet bruker en rolig poster-frame slik at siden fortsatt laster kontrollert.`,
    },
    {
      heading: 'Hvorfor det fungerer',
      body: `Et stillbilde kan vise komposisjon, men video kan vise hvordan en visuell tilstand utvikler seg. Derfor passer denne som fjerde kort: den avslutter rekken med noe som beveger seg, uten å gjøre hele galleriet tungt eller kaotisk.`,
    },
    {
      heading: 'Byggelogikk',
      body: `Den originale filen ble komprimert til en webversjon for porteføljen og får native video controls i modalvisningen. Kortet viser bare posterbildet, slik at nettsiden ikke begynner å laste en stor video før noen faktisk velger å åpne den.`,
    },
  ],
};
