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
  title: ArtworkTitle;
  sections: ArtworkSection[];
}

export const derSnoenHolderTiden: SpecialArtwork = {
  imageSlug: 'jennysno',
  title: {
    primary: 'Where Snow Holds Time',
    secondary: 'Der snøen holder tiden',
    secondaryLanguage: 'no'
  },
  sections: [
    {
      body: `Dette bildet føles som vinter som har snudd seg innover. Portrettet er tett på, stille og nesten litt hellig, men ikke på sånn pyntelig galleri-måte. Hodet er bøyd, hedda er dratt opp, fleecejakka og de svarte hanskene ligger tett rundt kroppen som et lite privat ritual mot kulda. Men snøen er ikke lenger bare snø. Den oppfører seg som stjernestøv, som om himmelen har løst seg opp og drysset kosmisk dritt over et helt vanlig menneskelig øyeblikk.

Det jeg liker best her er spennet mellom det lille og det enorme. Figuren er stille og lukket i seg selv, mens hele lufta rundt antyder at noe mye større presser bak overflaten. Bildet handler for meg om hvordan ensomhet kan være både et skjold og et svart hull. Universet trenger ikke alltid å komme som et episk lysshow. Noen ganger legger det seg bare mykt på jakka di mens du prøver å ikke fryse ræva av deg.`,
    },
    {
      heading: 'Hvordan jeg lagde bildet',
      body: `Utgangspunktet var et nøkternt vinterportrett analysert nesten som et åsted: en ung person i fallende snø, svart hoodie med «CherryBomb»-tekst, beige sherpa-fleece, svarte hansker, snødekt bakke, nakne busker og en uskarp bygning i bakgrunnen. Hvert materiale ble lest som sitt eget system. Sherpaen som et tett felt av matte mikrofibre. Hoodien som roligere fleece-strikk. Snøen som lyse partikler med diffus spredning og små blink.

Komposisjonen ble til og med redusert til et lite ASCII-grid som markerte tre ting: silhuetten, tekstsonen og tomrommene der bildet skulle få puste.`,
    },
    {
      heading: 'Den psykedeliske logikken',
      body: `Ble bygd inn gjennom tre skalaer. På makronivå fikk bare den uskarpe bakgrunnen en nesten umerkelig pusterytme, en langsom drift rundt 0,2 til 0,4 Hz. På mesonivå fikk frakkens kanter og glidelåssømmer en minimal forskyvning, så liten at du mer kjenner den enn ser den. På mikronivå ble sherpa-jakka behandlet som et biologisk landskap der små rosetter, celleformer og spindelvevslignende mønstre kunne oppstå inne i fibrene, ikke oppå dem.`,
      formula: `x' = x + A·sin(2πft + φ)·n(x)`,
      formulaCaption: 'Drift-formel for lavfrekvent romforvrengning',
    },
    {
      heading: 'Mikrogeometri — Reaction-Diffusion',
      body: `Mønsterdannelsen i sherpaen ble tenkt gjennom en reaction-diffusion-modell. To størrelser sprer seg og reagerer på hverandre over tid, og ut av det kan det oppstå organiske mønstre. D_u og D_v styrer spredning, mens F og k bestemmer hvor lett mønstre tennes, vokser og dør.`,
      formula: `∂u/∂t = D_u∇²u − uv² + F(1−u)\n∂v/∂t = D_v∇²v + uv² − (F+k)v`,
      formulaCaption: 'Gray-Scott reaction-diffusion system',
    },
    {
      heading: 'Kontrollpanelet',
      body: `κ_flat ≈ 0,45 betydde moderat flating av romfølelsen. Π ≈ 0,70Π₀ betydde mindre rigid top-down-kontroll, altså mer rom for at hjernen kunne begynne å låse inn struktur. σ_η ble holdt lav til moderat for å unngå støykaos, og χ_crit ble lagt nær kritisk nivå. På godt norsk: bildet ble dytta akkurat langt nok mot levende struktur, men ikke så langt at det ble neon-suppe.`,
    },
    {
      heading: 'Optikk og snø',
      body: `Mesteparten ble tenkt som achromatisk halasjon – en myk glød rundt lyse snøpartier og høylys, slik ekte optikk faktisk kan oppføre seg. Det kromatiske avviket ble holdt nesten usynlig og bare lagt langs hetten, håret og frakkens silhuett. Snøen fungerer ikke som pynt, men som et tidslag. Enkelte fnugg får en svak etterhengende persistens, som om nervesystemet bruker et lite øyeblikk for lenge på å slippe dem.

Hele bildet ble bygd som en OEV-dominant struktur: forvrengt virkelighet, ikke erstattet virkelighet. Ingen nye objekter. Ingen fantasivesener. Bare virkelighet som begynner å bøye seg i sine egne fibre, kanter, lysfelt og dybder.`,
    },
    {
      heading: 'Replikasjonsmetoder',
      body: `For å gjenskape psykedeliske visuelle effekter sånn de faktisk kan føles, ble bildet ikke behandlet som ett flatt lerret, men som et system av bærere, grenser og regler. Tracers ble tenkt som diskrete visuelle ekko. Sherpa-jakka ble brukt som et mikroskopisk landskap for fremvoksende struktur – små rosetter, celleformer og spindelvevslignende forbindelser som allerede lå latent i fibrene.

Bakgrunnens pustende drift ble ikke bygd som dramatisk smelting, men som lavfrekvent romlig modulering. Verden puster. Personen gjør det ikke.`,
    },
    {
      heading: 'Kvalitetskontroll',
      body: `Hvis geometrien så klistret ut, hadde embedding feilet. Hvis ansiktet driftet, hadde identitetslåsen feilet. Hvis fargene ble for neon, måtte metningen strupes. Verket ble altså ikke bare laga for å se fett ut, men testet mot hvor troverdig det faktisk føltes som psykedelisk persepsjon.`,
    },
  ],
};

export const detAttendeIndre: SpecialArtwork = {
  imageSlug: 'dimensiontripp',
  title: {
    primary: 'The Eighth Interior',
    secondary: 'Det åttende indre',
    secondaryLanguage: 'no'
  },
  sections: [
    {
      body: `Dette bildet føles som et stup inn i selve synet. Ikke et sted du kan gå til, men et rom som virker som det ligger bak øynene, bak tanken, bak hele den vanlige jævla virkeligheten. Tunnelen er biologisk og kosmisk samtidig. Den ser ut som hud, korall, celler, ornament og katedral på én gang. De sirkulære rosettene gjentar seg som om bildet ikke finner opp mønsteret, men avdekker noe som allerede har ligget og ventet under bevisstheten hele tiden.

Det er det som gjør bildet både vakkert og litt urovekkende. Det føles gammelt, intimt og altfor nært, som om du ikke ser på et landskap, men på innsiden av en tanke som har fått arkitektur. Dette er ikke fantasy i vanlig forstand. Det føles mer som kroppen som drømmer i geometri. For meg handler verket om at bevisstheten kanskje ikke er et vindu i det hele tatt, men et mønstret kammer som folder seg innover og innover og hele tiden bygger nye verdener av seg selv.`,
    },
    {
      heading: 'Hvordan bildet ble bygd',
      body: `I motsetning til første bildet, som tok utgangspunkt i et faktisk vinterfoto, er dette et fullt syntetisk bilde. Det er ikke en fotografert ting som har blitt vridd. Det er bygd som et CEV-dominant rom fra bunnen av, altså noe som lener seg mer mot lukket-øye-geometri og gjennombruddsaktig tunnelstruktur enn mot vanlig synsforvrengning. Hele scenen ble lest som et system av nivåer: en stor tunnel som ryggrad, foldede membraner som bærerform, og rosetter som et tett mikrolag av gjentatt ornament.

Materialene ble behandlet som om de var en blanding av fløyel, keramikk og levende membran. Overflatene måtte føles glatte og organiske nok til å flyte, men skarpe nok til at rosettene fortsatt kunne leses som struktur og ikke bare som dekorgrøt. Lyset ble holdt delt mellom en varm indre glød i tunnelens lommer og en kjøligere teal-aktig omgivelsesfarge ute i foldene.`,
    },
    {
      heading: 'Den psykedeliske logikken',
      body: `Ble også her bygd i skalaer. På makronivå er hele bildet en tunnel eller trakt, en klassisk formkonstant som gir følelsen av å bli dratt innover. På mesonivå bøyer foldene seg som membraner eller bånd, så rommet føles levende og ikke bare mekanisk. På mikronivå ligger de gjentatte rosettene tett som en slags ornamental cellekultur, med små interne variasjoner som hindrer at alt bare ser kopiert og dødt ut.`,
    },
    {
      heading: 'Tunnelpust — radial forskyvning',
      body: `Selve tunnelpusten kan tenkes som en radial forskyvning rundt et sentrum. r er avstanden fra sentrum av tunnelen, r' er den samme avstanden etter at rommet har pustet litt, A er amplituden, f er frekvensen og φ er faseforskyvningen. Hele korridoren kan utvide seg og trekke seg sammen på en måte som kjennes levende, uten å miste formen.`,
      formula: `r'(t) = r · (1 + A sin(2πft + φ))`,
      formulaCaption: 'Radial breathing / tunnelpust',
    },
    {
      heading: 'Spiraldrift',
      body: `For å gi bildet en svak spiraldrift kan vinkelen også forskyves. I praksis betyr det at rommet ikke bare puster, men også vrir seg litt rundt sin egen akse. Ikke nok til at du mister lesbarheten, bare nok til at hele tunnelen får den klassiske følelsen av å være en levende korridor.`,
      formula: `θ'(t) = θ + ωt + α sin(2πft)`,
      formulaCaption: 'Helisk vinkelforskyvning',
    },
    {
      heading: 'Rosettmønstre',
      body: `De sirkulære mønstrene ble ikke brukt som pynt, men som et tett ornamental-lattice som følger foldene. Intensiteten i hver rosett bygges som ringer inni ringer, med en vinkelstyrt symmetri som bestemmer hvor mange «kronblad» eller segmenter formen får.`,
      formula: `I(r,θ) = Σ aₖ exp(−((r−rₖ)² / 2σₖ²)) · (1 + b cos(nθ))`,
      formulaCaption: 'Rosett-intensitetsfunksjon',
    },
    {
      heading: 'Mikrovariasjon — Reaction-Diffusion',
      body: `For å hindre at mønsteret ble for sterilt og copy-paste-aktig, ble det tenkt inn en reaction-diffusion-variant. Samme grunnidé: to størrelser sprer seg og påvirker hverandre, og ut av det kan det vokse fram organiske variasjoner. Her ble det brukt til å gi rosettene små avvik i ruhet, dybde og liv.`,
      formula: `∂U/∂t = D_u∇²U − UV² + F(1−U)\n∂V/∂t = D_v∇²V + UV² − (F+k)V`,
      formulaCaption: 'Reaction-diffusion for mikrovariasjon',
    },
    {
      heading: 'Farge og lys',
      body: `Varm kjerne mot kjølig periferi gjør at tunnelen får en nesten religiøs dybde. Det varme ser ut som glød fra innsiden, mens teal-feltene på utsiden holder rommet åpent og kaldere. Glowen ble behandlet som noe som kommer fra hulrom og dybdelommer, ikke som et lag lagt utenpå.`,
    },
    {
      heading: 'Replikasjonsmetoder',
      body: `1. Tunnelen som formkonstant — gir følelsen av retning, sug og dybde.
2. Rosetter som levende gitter — geometri og overflate smelter sammen.
3. Rekursjon som små verdener inni verdener — jo lenger du ser, jo mer åpner bildet seg.
4. Breathing og spiraldrift — tunnelen både puster og vrir seg litt.
5. Mikrovariasjon — reaction-diffusion bryter opp repetisjonen.
6. Lys som portal — glowen kommer fra hulrom, ikke utenpå.
7. DMT-aktig struktur med kontroll — hyperornament, rekursjon og gjennombruddsfølelse.
8. Kvalitetskontroll — hvis du ikke kan falle inn i bildet, funker det ikke.`,
    },
  ],
};

export const derVerdenGlir: SpecialArtwork = {
  imageSlug: 'loongdrive',
  title: {
    primary: 'Where the World Glides',
    secondary: 'Der verden glir gjennom sansene',
    secondaryLanguage: 'no'
  },
  sections: [
    {
      body: `Dette bildet er ren terskelmagi. Bilens mørke interiør holder alt fast i noe ordinært og gjenkjennelig, mens verden utenfor eksploderer i blomster, glimt og hastighet. Vinduet blir mer enn glass. Det blir en tynn membran mellom kontroll og overgivelse, mellom det indre og det ytre, mellom det du styrer og det som bare suser forbi og nekter å la seg holde fast.

Det som gjør verket sterkt, er at det ikke føles som flukt. Det føles som overgang. Mange av de kraftigste bevissthetsskiftene skjer ikke når man ankommer, men mens man er midt mellom ting, halvveis i fart, halvveis i tanke, halvveis i ferd med å bli noe annet. Bildet skjønner det. Skjønnheten står ikke alltid og venter ved målet. Noen ganger klistrer den seg til ruta akkurat mens du passerer.`,
    },
    {
      heading: 'Hvordan bildet ble bygd',
      body: `I motsetning til tunnelbildet, som er fullt syntetisk, er dette forankret i en helt konkret fysisk situasjon: innsiden av en bil, et sidevindu, en mørk dørflate i forgrunnen, og et solbelyst felt av blomster og løvverk som streker forbi utenfor. Hele poenget var å bevare den drive-by-sannheten. Interiøret måtte holde seg rigid. Ruta måtte oppføre seg som glass.

Materialene ble delt inn ganske brutalt. Dørpanelet ble lest som matt plast eller vinyl, nesten uten effektbærer. Glasset ble behandlet som en tynn optisk sone med Fresnel-kantlys og små refleksprikker. Utsiden var et fullverdig psykedelisk arbeidsområde: kronblader, blader, høylys og bevegelsesstriper.`,
    },
    {
      heading: 'Den psykedeliske logikken',
      body: `Bygd opp rundt det som allerede finnes i bildet. På makronivå fikk scenen nesten ingen global geometri. Ingen tunnel, ingen kaleidoskop. Bare en nesten usynlig koherens i lyset utenfor. På mesonivå ble blomsterfeltet og løvverket gitt en svak pusterytme og tracerlogikk som følger den eksisterende bevegelsesretningen. På mikronivå fikk høylys, bladoverflater og glasskantene lov til å bære små optiske avvik, prismefringing og organisk filigran.`,
    },
    {
      heading: 'Foliage mesodrift — flow-field',
      body: `Foliagens mesodrift ble tenkt som et lite flow-field. Et punkt i bildet kan flyttes litt av et mykt strømfelt, styrt av en liten amplitude. Bladene og blomsterstripene får lov til å puste og flyte litt, men uten at formene kollapser. Det må fortsatt se ut som løvverk i fart.`,
      formula: `p' = p + α·F(p,t)`,
      formulaCaption: 'Flow-field forskyvning',
    },
    {
      heading: 'Spiralguide for shimmer',
      body: `Rundt det lyseste feltet kunne det ligge en nesten usynlig spiralguide. Ikke som en synlig spiral, men som en skjult faseguide for hvordan shimmer og oppmerksomhet kan samle seg rundt et hotspot. Usynlig hvis den feiler, men når den fungerer, glir blikket naturlig inn mot et senter.`,
      formula: `r(θ) = a·e^(bθ)`,
      formulaCaption: 'Logaritmisk spiralguide',
    },
    {
      heading: 'Mikrovariasjon — Reaction-Diffusion',
      body: `Mikrostrukturen i bladverket ble tenkt gjennom reaction-diffusion-logikk. Brukt til å tenke fram mikroveiner, små filigranaktige avvik og en levende ruhet i løvverket, så naturen ikke bare ser fargerik ut, men litt for våken.`,
      formula: `∂u/∂t = D_u∇²u − uv² + F(1−u)\n∂v/∂t = D_v∇²v + uv² − (F+k)v`,
      formulaCaption: 'Reaction-diffusion for mikrotekstur',
    },
    {
      heading: 'OEV-dominant lavdose',
      body: `Dose ble holdt lavt, rundt 3 av 10. Forbedringer og forvrengninger fikk lov til å eksistere, men ikke hallusinasjoner. Glasset kunne få mikroprisme. Blomsterstripene kunne få svake motion-echoes. Løvverket kunne få pust og organisk mikrostruktur. Men bilen, ramma og den grunnleggende fysikken måtte holde seg hard og troverdig.`,
    },
    {
      heading: 'Replikasjonsmetoder',
      body: `1. Vinduet som optisk membran — prismatiske avvik og vinkelavhengig shimmer.
2. Blomsterstripene som tracers — motion blur brukt som motor for persistens-ekko.
3. Løvverk som levende tekstur — nesten usynlige pustebevegelser.
4. Rigid interiør mot levende utside — bilen holdes hard, kontrasten er avgjørende.
5. Lavdose OEV — virkeligheten glir litt, men holder seg troverdig.
6. Fargekontroll — mer vibrasjon, mindre ketchupulykke.
7. Kvalitetskontroll — føles det som et virkelig øyeblikk som glir ut av normal persepsjon?`,
    },
  ],
};

export const denSomSerTilbake: SpecialArtwork = {
  imageSlug: 'eye-figure',
  title: {
    primary: 'The One Who Looks Back',
    secondary: 'Den som ser tilbake',
    secondaryLanguage: 'no'
  },
  sections: [
    {
      body: `Dette er et av de mest mytiske og urolige verkene i serien. Figuren sitter i lotusstilling, rolig og sentrert, nesten som en klassisk meditasjonsskikkelse, men hele kroppen er bygd av øyne. Ikke symbolsk. Ikke antydet. Bokstavelig talt dekket av dem. Tunnelen bak fortsetter samme logikk innover i mørket, som om hele rommet er et nervesystem som har lært seg å stirre tilbake.

Det er det som gjør bildet så jævlig sterkt. Det handler ikke bare om å se. Det handler om å være fullstendig sett. Verket føles som et portrett av bevissthet under total eksponering, der oppmerksomhet ikke er passiv, men aktiv, hellig og litt nådeløs. Den som ser, blir selv sett. Den som prøver å betrakte, blir dratt inn i en katedral av blikk.`,
    },
    {
      heading: 'Hvordan bildet ble bygd',
      body: `I motsetning til bilbildet og vinterportrettet, som fortsatt var forankret i noe ytre og gjenkjennelig, er dette et fullt hallusinert rom. Det er ikke OEV, altså virkelighet som bøyer seg litt. Det er CEV-dominant og mye nærmere en faktisk erstatningsverden. Hele scenen ble bygd som en hyperspace-ikonografi: en menneskelignende skikkelse i sentrum, et tunnelrom som trekker alt bakover mot et forsvinningspunkt, og øyne som grunnmodul både i kroppen og i miljøet.

Kroppen ble behandlet som om hud var byttet ut med okulære moduler. Hver enhet måtte lese som et ekte øye, med våt korneaglans, matte sclera-flater, fibrøse iriser og små kantsoner som oppfører seg nesten som øyelokk mellom flisene. Det er en umulig anatomi, selvfølgelig, men den måtte likevel kjennes fysisk plausibel.`,
    },
    {
      heading: 'Rommet og figuren',
      body: `Tunnelveggene er ikke bare mørke vegger, men et massivt felt av øye-sokler og blikkmoduler som forsvinner innover i dybden. Mellom dem ligger små lommer av stjernestøv, nebula og svart kosmisk tomrom. Det gjør at bildet ikke bare leses som en figur foran en bakgrunn, men som om figuren og rommet er laget av samme stoff. Som om bevisstheten ikke står i universet, men universet er sydd av bevissthet.`,
    },
    {
      heading: 'Tunnelstruktur — polarkoordinater',
      body: `Tunnelstrukturen ble tenkt i polarkoordinater. Når radius r blir oversatt til en logaritmisk dybde z, får du en følelse av at rommet strekker seg uendelig innover uten at alt må tegnes realistisk som vanlig arkitektur.`,
      formula: `r = √(x² + y²)\nθ = atan2(y,x)\nz = −log(r/r₀ + ε)`,
      formulaCaption: 'Polar til logaritmisk dybde',
    },
    {
      heading: 'Tunnelpust',
      body: `Selve tunnelpusten ble tenkt som en koherent radial forskyvning. Rommet kan trekke seg sammen og utvide seg med én samlet rytme. Ikke jitter. Ikke kaos. Bare en dyp, langsom puls som holder tunnelen levende.`,
      formula: `Δr(x,y,t) = A sin(2πft + φ) · g(r)`,
      formulaCaption: 'Koherent radial forskyvning',
    },
    {
      heading: 'Øyegitter — heksagonal pakking',
      body: `Øyefeltene ble tenkt gjennom et gitter, omtrent som heksagonal pakking. Det lar tusenvis av øyne sitte tett sammen på en måte som føles strukturert i stedet for tilfeldig kasta utover.`,
      formula: `a₁ = (d,0)\na₂ = (d/2, √3d/2)\npₘ,ₙ = m·a₁ + n·a₂`,
      formulaCaption: 'Heksagonal øyeposisjonering',
    },
    {
      heading: 'Mikrovariasjon — Reaction-Diffusion',
      body: `For å hindre at hele greia blir for steril, ble det tenkt inn en veldig liten reaction-diffusion-modulering i irisglans og kantsoner. Øynene får mikroskopiske avvik i tekstur, fuktighet og liv, akkurat nok til at de slutter å se fabrikkprodusert ut og begynner å føles som noe som faktisk stirrer.`,
      formula: `∂u/∂t = D_u∇²u − uv² + F(1−u)\n∂v/∂t = D_v∇²v + uv² − (F+k)v`,
      formulaCaption: 'Reaction-diffusion for iris-variasjon',
    },
    {
      heading: 'Lys og corneahøylys',
      body: `Corneahøylysene måtte følge én koherent lyskilde, ellers hadde hele illusjonen kollapset. Nebulaen måtte holde seg svak nok til at øynene fortsatt er hovedsaken. Den våte glansen måtte balanseres mot matte sclera-flater og mykere kantsoner, så bildet ikke ble til plastikkporno med rombakgrunn.`,
    },
    {
      heading: 'Replikasjonsmetoder',
      body: `1. Figuren som stillpunkt i kaoset — den mediterende kroppen er et stabilt sentrum.
2. Øyne som materiale, ikke symbol — selve byggesteinen i kropp og rom.
3. Tunnelen som psykisk arkitektur — retning, sug, dybde og innsuging.
4. Brystvortex som sekundær portal — kroppen og rommet kobles sammen.
5. Heksagonal pakking for orden i galskapen — strukturert, ikke tilfeldig.
6. Mikrovariasjon for å unngå plastikkhelvete — liv uten å miste kontroll.
7. CEV fremfor OEV — et nytt rom, ikke en forvrengt versjon av denne verden.
8. Kvalitetskontroll — føles det som om bildet ser på deg også?`,
    },
  ],
};
