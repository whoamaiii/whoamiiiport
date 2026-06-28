import type { SpecialArtwork } from '../components/artworkData';

interface LibraryStillArtworkEntry {
  readonly id: string;
  readonly artwork: SpecialArtwork;
}

export const stillArtworks = [
  {
    id: 'eye-terrain',
    artwork: {
      imageSlug: 'eye-terrain',
      title: {
        primary: 'Øyeterreng',
        secondary: 'nært signalportrett',
      },
      sections: [
        {
          body:
            'Et øye blir til et lite værsystem. Hud, vipper, iris og opphøyde mønstre ligger i det samme våte optiske feltet, nært nok til at ansiktet begynner å lese som terreng.',
        },
        {
          heading: 'Lesning',
          body:
            'Jeg liker når det endrede laget føles innebygd i stedet for påført. Øyet forblir menneskelig, men overflaten rundt begynner å oppføre seg som et kart over trykk, søvn og lys.',
        },
      ],
    },
  },
  {
    id: 'trippy-jump',
    artwork: {
      imageSlug: 'trippy-jump',
      title: {
        primary: 'Fargefall',
        secondary: 'fallende fargebrudd',
      },
      sections: [
        {
          body:
            'En kropp faller inn i et fargebrudd. Bakke, himmel og bevegelsesuskarphet kollapser til én mettet tunnel, og figuren blir det eneste lesbare inne i støtet.',
        },
        {
          heading: 'Lesning',
          body:
            'Dette handler mer om fart enn sted. Jeg ville at bildet skulle føles som sekundet før landing, når verden strekker seg og kroppen fortsatt prøver å holde seg samlet.',
        },
      ],
    },
  },
  {
    id: 'snow-road',
    artwork: {
      imageSlug: 'snow-road',
      title: {
        primary: 'Snøvei',
        secondary: 'kald kaustisk vei',
      },
      sections: [
        {
          body:
            'Gatelys og snø blir til en kald flytende hud. Veien er vanlig, men kanten av den begynner å krype med løkker, riller og små optiske blåmerker.',
        },
        {
          heading: 'Lesning',
          body:
            'Tilbakeholdenheten er viktig. Det føles fortsatt som en nattlig gåtur, ikke et fantasisted. Den endrede tilstanden kommer gjennom snøen og lyset, og derfor føles den mer troverdig for meg.',
        },
      ],
    },
  },
  {
    id: 'leg-prism',
    artwork: {
      imageSlug: 'leg-prism',
      title: {
        primary: 'Beinprisme',
        secondary: 'hvilende kroppssignal',
      },
      sections: [
        {
          body:
            'Beina bare hviler, men rommet er ikke rolig. Regnbuetrykk beveger seg over hud, gulv og skygge til kroppen føles som om den mottar vær fra innsiden av teppet.',
        },
        {
          heading: 'Lesning',
          body:
            'Dette hører sammen med hånd- og negleverkene fordi kroppen først får være vanlig. Det rare er ikke et kostyme; det er lys som passerer over sliten hud og gjør det kjente nyfølsomt.',
        },
      ],
    },
  },
  {
    id: 'drain-bloom',
    artwork: {
      imageSlug: 'drain-bloom',
      title: {
        primary: 'Slukblomst',
        secondary: 'baderomsgulvorganisme',
      },
      sections: [
        {
          body:
            'Et baderomsgulv blir til et vått lite økosystem. Såpe, fliser, sluk, hår, moseaktig materiale og regnbuemønster samler seg på det laveste punktet og begynner å oppføre seg som én organisme.',
        },
        {
          heading: 'Lesning',
          body:
            'Jeg liker den stygge hjemlige sannheten i det. Det er ikke en ren portal. Det er smuss, vann og rester av kroppsmateriale som blir vakkert uten å late som det er rent.',
        },
      ],
    },
  },
  {
    id: 'open-hand-mouth',
    artwork: {
      imageSlug: 'open-hand-mouth',
      title: {
        primary: 'Åpen håndmunn',
        secondary: 'visceral håndflateportal',
      },
      sections: [
        {
          body:
            'Hånden åpner seg på for mange måter samtidig. Tenner, våt membran, mose og mettet mønster gjør håndflaten til noe mellom et sår, en munn og en døråpning.',
        },
        {
          heading: 'Lesning',
          body:
            'Dette er et av de mer konfronterende kroppsverkene, men det trenger fortsatt håndverk og farge for å bære seg. Jeg vil at det skal føles ekkelt, levende og merkelig inviterende, ikke bare sjokkerende.',
        },
      ],
    },
  },
  {
    id: 'night-bus',
    artwork: {
      imageSlug: 'night-bus',
      title: {
        primary: 'Nattbuss',
        secondary: 'transittmønsterstudie',
      },
      sections: [
        {
          body:
            'Et regnvått bussinteriør blir til et lite arkiv av refleksjoner, vindusglans, mønstrede seter og kontakt i håndskala. Kollektivtransport blir et privat endret rom et øyeblikk.',
        },
        {
          heading: 'Lesning',
          body:
            'Det vanlige stedet er det viktige. Altered-state-språket kommer gjennom stoff, glass, regn og slitent nattlys, ikke gjennom å rømme fra stedet.',
        },
      ],
    },
  },
  {
    id: 'handpose-mouth',
    artwork: {
      imageSlug: 'handpose-mouth',
      title: {
        primary: 'Håndposemunn',
        secondary: 'bordobjekt-kropp',
      },
      sections: [
        {
          body:
            'Et håndformet objekt åpner seg til tenner, tråder og organisk tekstur, lagt på en tallerken som noe halvveis mellom middag, skulptur og en dårlig idé som ble nyttig.',
        },
        {
          heading: 'Lesning',
          body:
            'Det ligger mellom kroppshorror og håndverksobjekt. Jeg vil at ubehaget skal være ekte, men ikke tomt; detaljene må fortsette å trekke blikket tilbake etter den første reaksjonen.',
        },
      ],
    },
  },
] satisfies readonly LibraryStillArtworkEntry[];
