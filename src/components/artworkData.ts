import type { ImageSlug } from '../utils/images';

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
  imageSlug: ImageSlug;
  videoSrc?: string;
  title: ArtworkTitle;
  sections: ArtworkSection[];
}

export const dreamyCatNapInSparklingTextiles: SpecialArtwork = {
  imageSlug: 'dreamy-cat-nap',
  title: {
    primary: 'Dreamy Cat Nap',
    secondary: 'in sparkling textiles',
  },
  sections: [
    {
      body: `I dette verket ville jeg holde fast i noe trygt, mykt og ekte, og så la det psykedeliske vokse frem inni det i stedet for å legges oppå det. For meg handler bildet om den tilstanden der noe helt hverdagslig, varmt og nært plutselig begynner å føles uendelig, nesten hellig. Jeg ville at katten fortsatt skulle føles som en virkelig kropp i søvn, men at tekstilene og lyset rundt den skulle oppføre seg som om drømmen hadde begynt å sive ut i rommet.\n\nDet viktige for meg var at bildet aldri skulle miste omsorgen. Jeg ville ikke at verket skulle bli aggressivt, ironisk eller visuelt kåt på sin egen effekt. Hele utgangspunktet mitt var å gjøre søvn, trygghet og stofflighet til selve motoren i bildet, og så la den altererte følelsen oppstå som et trykk under overflaten.`,
    },
    {
      heading: 'Mening',
      body: `Baktanken min var ikke å lage noe "trippy" bare for å være trippy. Jeg var ute etter kontrasten mellom uskyld, ro og noe som nesten føles kosmisk levende under overflaten. Når jeg ser på bildet, opplever jeg at det handler om hvordan bevisstheten kan gjøre et lite øyeblikk enormt: pels, stoff, pust og lys blir til et helt indre landskap.\n\nJeg ville at verket skulle kjennes omsorgsfullt først, og psykedelisk etterpå. Derfor lar jeg katten være det emosjonelle ankeret, mens mønstrene og glimmeret får bære den mer hallusinatoriske følelsen. Det er egentlig den balansen jeg er ute etter i mye av arbeidet mitt: ikke ren deformasjon, men en tilstand der virkeligheten fortsatt er gjenkjennelig mens den samtidig begynner å overskride seg selv.`,
    },
    {
      heading: 'Metode',
      body: `Metoden min her var å starte med et fotorealistisk anker og beskytte det nesten brutalt. Katten måtte få være katt hele veien: søvnen, kroppstyngden, øyelokkene, nesen, varmen i øret, pelsen og den sammenkrøllede stillingen måtte fortsatt leses som noe virkelig observert. Først når det satt, lot jeg de psykedeliske tegnene få slippe inn.\n\nJeg fordelte ikke effekten tilfeldig over hele bildet. Jeg tenkte i materialer og bærere. Teppet fikk bære mesteparten av geometrien fordi tekstil tåler ornament, repetisjon og mønster uten å miste sannheten sin. Pelsen fikk bare små lysende hendelser, glitter og mikrospiraler. Ansiktet fikk nesten ingen fri deformasjon i det hele tatt, fordi ansiktet er der tilliten i bildet bor. Hvis ansiktet kollapser, kollapser hele verket.`,
    },
    {
      heading: 'Perseptuell modell',
      body: `Måten jeg tenkte på kan beskrives som en struktur-lås. Jo nærmere et område ligger identitet, kropp og emosjonell lesbarhet, jo mindre frihet får det. Jo mer et område fungerer som carrier-surface, altså en overflate som kan bære mønster og kompleksitet, jo mer visuell frihet får det. Derfor får teppet lov til å være mest ornamentalt, mens ansiktet forblir nesten sober.\n\nJeg jobbet også med dybdehierarki. Det som ligger i fokus kan få detalj og struktur, men blur-soner må ikke plutselig begynne å skrike etter oppmerksomhet. Hvis alt blir like aktivt, slutter bildet å føles fotografisk og begynner å føles som pynt. Derfor måtte glimmeret i forgrunnen oppføre seg som lys og ikke som et nytt motiv.`,
      formula: `psykedelisk_signal = (tekstil × kurvatur × mønsterkapasitet)\n                   + (pels × glimt × retning)\n                   + (værhår × lyskant)\n\ntroverdighet = identitetslås + materialsannhet + dybdeskarphet - effektstøy\n\ndistorsjon(ansikt) << distorsjon(tekstil)\naktivitet(blur) < aktivitet(pels) < aktivitet(tekstil)`,
      formulaCaption: `Dette er måten jeg beskriver arbeidslogikken på i etterkant. Det er ikke laboratoriemålinger, men den faktiske komposisjonelle regelen jeg fulgte.`,
    },
    {
      heading: 'Prosess',
      body: `I praksis betydde det at jeg hele tiden jobbet med hva som skulle få lov til å mutere, og hva som måtte holdes nede. Jeg lot teppet gjøre mesteparten av den psykedeliske jobben fordi det både tåler og inviterer til mønsterfortetning. Jeg lot pelsen få små optiske hendelser fordi det gir liv uten å bryte søvnen. Jeg lot nesen, øynene og kroppsformen holde på roen fordi de må fortsette å være følelsesmessig lesbare.\n\nDet jeg prøvde å unngå var den vanlige AI-fellen der alt i bildet blir like spennende samtidig. Jeg ville ikke ha global kaleidoskop-logikk. Jeg ville ha et bilde der noe fortsatt sover, mens noe annet under overflaten er i ferd med å våkne. Hele baktanken i workflowen var egentlig å la det intime og det altererte leve samtidig, slik at verket føles som en ekte drømmetilstand og ikke bare en effektøvelse.`,
    },
    {
      heading: 'Tilstand, ikke oppskrift',
      body: `Jeg prøver ikke å redusere slike verk til en offentlig stoffliste eller en dose-tabell, fordi det ville vært både falskt og for grunt i forhold til det jeg faktisk undersøker. Det jeg er ute etter her er fenomenologien: mønsterforsterkning, carrier-surfaces, glimmer i pels, ro i ansiktet, og følelsen av at en vanlig scene begynner å utvide seg innenfra. For meg er dette mer en presis arkitektur av persepsjon enn en enkel "trip report" forkledd som kunsttekst.`,
    },
  ],
};

export const nestenferdigTungeVideoArtwork: SpecialArtwork = {
  imageSlug: 'nestenferdig-tunge-video-poster',
  videoSrc: '/videos/nestenferdig-tunge-gallery.mp4',
  title: {
    primary: 'Nestenferdig Tunge',
    secondary: 'moving image study',
  },
  sections: [
    {
      body: `Dette er lagt inn som en levende arbeidspiece i stedet for et stillbilde. Videoen får være hovedverket: bevegelse, kropp, tekstur og rytme får gjøre det et bilde ikke kan gjøre alene.`,
    },
    {
      heading: 'Hvorfor video',
      body: `Cardet bruker bare en poster-frame i galleriet, slik at siden fortsatt holder seg lett. Først når noen åpner verket, lastes selve videoopplevelsen inn med native controls, autoplay og mulighet til å styre avspillingen.`,
    },
    {
      heading: 'Byggelogikk',
      body: `Den originale videoen ble komprimert til en webversjon for porteføljen. Målet er at verket skal føles levende i modalvisningen uten å gjøre hele startsiden treg eller tung.`,
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
  videoSrc: '/videos/ferdigcop-gallery.mp4',
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
