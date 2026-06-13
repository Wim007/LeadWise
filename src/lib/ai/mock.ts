import type {
  CoachingAdvice,
  HerschrijverResultaat,
  ConversationScenario,
  LiveCoachResponse,
  ReflectionReview,
  ScenarioType,
} from '@/types';
import { delay } from '@/lib/utils';

// Simuleert AI-vertraging
const MOCK_DELAY = 1200;

export async function mockVoorbereiderResponse(medewerkernaam: string): Promise<CoachingAdvice> {
  await delay(MOCK_DELAY);
  return {
    gespreksdoel: `Het doel is om met ${medewerkernaam} een open gesprek te hebben over de huidige situatie en samen tot concrete afspraken te komen. Je wilt vertrekken vanuit begrip en richting geven zonder de relatie te schaden.`,
    risicos: [
      `${medewerkernaam} kan zich aangevallen voelen als je te direct begint — start met erkenning.`,
      'Als er geen concrete afspraken komen, verlies je geloofwaardigheid bij volgende gesprekken.',
      'Emoties kunnen hoog oplopen als de context al langere tijd sluimert.',
    ],
    aanbevolenToon: 'Kalm, nieuwsgierig en direct. Geen verwijten, wel duidelijkheid.',
    openingszin: `"${medewerkernaam}, ik heb dit gesprek ingepland omdat ik echt even wil begrijpen hoe jij de afgelopen tijd hebt ervaren. Niet om te oordelen, maar omdat ik denk dat we samen iets kunnen verbeteren."`,
    coachvragen: [
      `Wat gaat er volgens jou goed in je werk op dit moment, ${medewerkernaam}?`,
      'Als je eerlijk bent: waar loop jij het vaakst tegenaan?',
      'Wat heb je nodig om je werk beter te kunnen doen?',
      'Hoe zie jij de samenwerking met het team?',
      'Wat zou voor jou een concreet verbeterpunt zijn voor de komende maand?',
    ],
    vermijdZinnen: [
      '"Iedereen merkt het" — dit klinkt als groepsdruk en is vernederend.',
      '"Je moet gewoon..." — bevelen werken averechts en sluiten de dialoog.',
      '"Dit kan toch niet zo moeilijk zijn" — ondermijnt de ervaring van de medewerker.',
    ],
    gespreksplan:
      '1. Open met erkenning en stel een brede vraag. 2. Luister actief en vat samen. 3. Benoem concreet wat je hebt waargenomen zonder te oordelen. 4. Sluit af met één concrete afspraak en een datum.',
  };
}

export async function mockHerschrijverResponse(origineel: string): Promise<HerschrijverResultaat> {
  await delay(MOCK_DELAY);
  return {
    origineel,
    varianten: [
      {
        type: 'vriendelijk_duidelijk',
        label: 'Vriendelijk en duidelijk',
        tekst: `Hoi, ik wil even kort iets met je bespreken. Ik zie dat ${origineel.substring(0, 30)}... en ik zou graag willen kijken hoe we dit samen beter kunnen aanpakken. Kun je morgen even langskomen?`,
        waaromBeter: 'Directe toon zonder lading — de medewerker weet wat er komt maar voelt zich niet aangevallen.',
        vermijdtRisico: 'Vermijdt defensiviteit door de boodschap neutraal en uitnodigend te houden.',
        gebruikWanneer: 'Bij een eerste gesprek over een klein aandachtspunt.',
      },
      {
        type: 'empathisch',
        label: 'Empathisch',
        tekst: `Ik merk dat het waarschijnlijk niet gemakkelijk is geweest de afgelopen tijd. Ik wil graag begrijpen hoe jij dit ervaart. Zullen we er samen rustig naar kijken?`,
        waaromBeter: 'Erkent de emotie van de medewerker vóórdat je met de inhoud komt.',
        vermijdtRisico: 'Vermijdt een gesloten houding en weerstand door eerst verbinding te maken.',
        gebruikWanneer: 'Als je vermoedt dat er meer speelt dan het oppervlakkige probleem.',
      },
      {
        type: 'begrenzend_respectvol',
        label: 'Begrenzend maar respectvol',
        tekst: `Ik wil duidelijk zijn: dit is iets waar we iets mee moeten doen. Ik respecteer jou als professional en juist daarom wil ik er direct over praten. Laten we samen kijken wat een realistische oplossing is.`,
        waaromBeter: 'Stelt een grens zonder te kwetsen — de medewerker weet dat het serieus is.',
        vermijdtRisico: 'Vermijdt dat de boodschap te zacht wordt en niet aankomt.',
        gebruikWanneer: 'Als eerdere zachte gesprekken geen effect hebben gehad.',
      },
      {
        type: 'motiverend_coachend',
        label: 'Motiverend en coachend',
        tekst: `Ik geloof dat je dit kunt verbeteren — en ik wil je daarin helpen. Wat heb jij nodig om de komende maand echt een stap vooruit te zetten? Laten we samen een concrete aanpak bedenken.`,
        waaromBeter: 'Stimuleert eigenaarschap bij de medewerker in plaats van het probleem extern te leggen.',
        vermijdtRisico: 'Vermijdt passiviteit en het gevoel van "het zal toch niet lukken".',
        gebruikWanneer: 'Als de medewerker capabel is maar de motivatie ontbreekt.',
      },
    ],
  };
}

export async function mockScenarioResponse(scenario: ScenarioType): Promise<ConversationScenario> {
  await delay(MOCK_DELAY);

  const scenarioData: Record<ScenarioType, ConversationScenario> = {
    onderprestatie: {
      id: 'onderprestatie',
      titel: 'Medewerker presteert onder niveau',
      omschrijving: 'De medewerker haalt de verwachte resultaten niet.',
      openingszin: '"Ik wil graag een eerlijk gesprek met je hebben. Niet om te oordelen, maar omdat ik zie dat het niet loopt zoals we hadden gehoopt — en ik wil begrijpen hoe jij dat ervaart."',
      vervolgvragen: [
        'Wat gaat er in jouw ogen goed op dit moment?',
        'Waar loop jij zelf het vaakst tegenaan in je werk?',
        'Wat heb je nodig om je werk beter te kunnen doen?',
        'Wat zou voor jou een realistische verbetering zijn de komende 4 weken?',
        'Hoe kan ik jou daarin het beste ondersteunen?',
      ],
      waarschuwingszinnen: [
        '"Iedereen ziet het ook" — dit klinkt als groepsdruk en werkt beschamend.',
        '"Dit is je laatste kans" — veroorzaakt paniek en sluit de dialoog.',
        '"Ik begrijp echt niet hoe dit kan" — suggereert onbegrip en ondermijnt vertrouwen.',
      ],
      reactiesOpWeerstand: [
        'Als de medewerker zegt "anderen doen het ook": "Ik snap dat je dat zo ervaart. Laten we het even over jouw situatie houden — wat speelt er bij jou?"',
        'Als de medewerker zwijgt of afsluit: "Neem gerust even de tijd. Dit is geen rechtbank. Ik wil het echt begrijpen."',
        'Als de medewerker de schuld buiten zichzelf legt: "Wat jij aangeeft klinkt logisch. Tegelijk: wat is jouw invloed in dit geheel?"',
      ],
      afsluitingMet: '"We spreken dan het volgende af: [concrete actie]. Ik schrijf dit op en stuur je het vandaag na. Over twee weken kijken we samen hoe het gaat — afgesproken?"',
    },
    defensief: {
      id: 'defensief',
      titel: 'Medewerker is defensief',
      omschrijving: 'De medewerker reageert met ontkenning, tegenaanval of afsluiting.',
      openingszin: '"Ik merk dat dit gesprek misschien wat spanning geeft. Dat begrijp ik. Ik wil geen debat — ik wil gewoon begrijpen hoe jij het ervaart."',
      vervolgvragen: [
        'Wat maakt dit gesprek voor jou lastig op dit moment?',
        'Heb je het gevoel dat ik iets mis in mijn beeld?',
        'Wat zou jij willen dat ik beter begreep over jouw situatie?',
        'Waar wil jij naartoe in je werk — wat is voor jou belangrijk?',
        'Wat heb jij van mij nodig om dit gesprek zinvol te maken?',
      ],
      waarschuwingszinnen: [
        '"Je bent altijd zo defensief" — dit is een aanval op het karakter en maakt het erger.',
        '"Je luistert niet" — escaleert het conflict zonder enig voordeel.',
        '"Anderen hebben hier geen moeite mee" — vergelijkingen werken nooit goed.',
      ],
      reactiesOpWeerstand: [
        'Bij harde ontkenning: "Oké. Laten we dan kijken naar wat ik concreet heb waargenomen — niet als verwijt, maar als startpunt."',
        'Bij tegenaanval: "Ik hoor dat er frustratie is. Die frustratie is waardevol. Kun je me vertellen wat er precies achter zit?"',
        'Bij volledig afsluiten: "Laten we dit gesprek dan even pauzeren. Wanneer zou het voor jou een beter moment zijn?"',
      ],
      afsluitingMet: '"Ik waardeer dat je hier toch in bent mee gegaan. Ik stel voor dat we [concrete kleine stap] afspreken, en dat we over een week even kort checken hoe dat voelt. Is dat haalbaar voor jou?"',
    },
    teamconflict: {
      id: 'teamconflict',
      titel: 'Conflict in het team',
      omschrijving: 'Er is spanning of openlijk conflict tussen teamleden.',
      openingszin: '"Ik wil dit gesprek gebruiken om samen te begrijpen wat er speelt in het team — niet om schuld toe te wijzen, maar om te kijken wat we nodig hebben om weer goed samen te werken."',
      vervolgvragen: [
        'Hoe ervaar jij de sfeer in het team op dit moment?',
        'Wanneer is het in jouw beleving mis gegaan?',
        'Wat heb jij zelf gedaan om de situatie te verbeteren?',
        'Wat heb jij nodig van de rest van het team?',
        'Wat zou voor jou een teken zijn dat het de goede kant opgaat?',
      ],
      waarschuwingszinnen: [
        '"Ik weet wie het probleem is" — dit kiest partij en beschadigt vertrouwen.',
        '"Dit gedrag is niet professioneel" — labels werken escalerend in conflictsituaties.',
        '"Jullie moeten gewoon volwassen met elkaar omgaan" — neerbuigend en niet constructief.',
      ],
      reactiesOpWeerstand: [
        'Als teamleden de ander beschuldigen: "Ik hoor je. Laten we dat meenemen — en ook kijken wat jij in deze situatie kunt doen."',
        'Als iemand weigert mee te werken: "Ik begrijp dat je er klaar mee bent. Toch heb ik jouw inbreng nodig om dit op te lossen."',
        'Als iemand zegt "het maakt me niks uit meer": "Dat je dat zegt, is juist een signaal dat het je veel doet. Wat zou het verschil maken voor jou?"',
      ],
      afsluitingMet: '"We spreken af dat iedereen [concrete actie] doet de komende week. Ik kom er volgende week op terug. Is er iemand die iets wil toevoegen of iets niet haalbaar vindt?"',
    },
    weinig_eigenaarschap: {
      id: 'weinig_eigenaarschap',
      titel: 'Medewerker neemt weinig eigenaarschap',
      omschrijving: 'De medewerker wacht af, legt problemen extern en neemt geen initiatief.',
      openingszin: '"Ik wil het vandaag hebben over hoe jij je werk ervaart — en meer specifiek: waar jij zelf invloed op denkt te hebben."',
      vervolgvragen: [
        'Wat gaat er in je werk goed als jij er invloed op hebt?',
        'Waar heb jij het gevoel dat je invloed mist of wordt geblokkeerd?',
        'Wat zou jij kunnen doen als je morgen wakker werd en het probleem half opgelost was?',
        'Welke beslissing zou jij willen nemen als je dat volledig mocht?',
        'Wat houdt je nu tegen om die stap zelf te zetten?',
      ],
      waarschuwingszinnen: [
        '"Je wacht altijd af" — aanval op karakter, niet op gedrag.',
        '"Jij moet zelf initiatief nemen" — benoemt het probleem zonder te helpen.',
        '"Iedereen verwacht meer van je" — groepsdruk werkt averechts bij eigenaarschapsproblemen.',
      ],
      reactiesOpWeerstand: [
        'Als de medewerker zegt "dat is niet mijn taak": "Interessant. Wat zie jij dan wél als jouw verantwoordelijkheid?"',
        'Als de medewerker alleen naar anderen wijst: "Ik begrijp dat anderen ook een rol spelen. Wat is jouw rol in dit geheel?"',
        'Als de medewerker passief blijft: "Laten we het klein maken. Welke ene kleine stap kun jij deze week zetten?"',
      ],
      afsluitingMet: '"Je neemt dan de verantwoordelijkheid voor [concrete kleine actie]. Ik hoef niet overal bij te zijn — maar ik wil wel over twee weken horen hoe dat ging. Klinkt dat haalbaar?"',
    },
    weerstand_verandering: {
      id: 'weerstand_verandering',
      titel: 'Weerstand tegen verandering',
      omschrijving: 'De medewerker verzet zich tegen nieuwe werkwijzen, structuren of beslissingen.',
      openingszin: '"Ik merk dat de nieuwe aanpak bij jou wat weerstand oproept. Ik wil graag begrijpen waar dat vandaan komt — want ik heb jouw ervaring nodig om dit goed te laten landen."',
      vervolgvragen: [
        'Wat werkte goed aan de oude manier van werken?',
        'Wat maakt de nieuwe aanpak voor jou lastig of onlogisch?',
        'Zijn er aspecten van de verandering die je wel begrijpt of kunt waarderen?',
        'Wat heb jij nodig om dit een eerlijke kans te geven?',
        'Hoe zou jij de overgang beter of handelbaarder maken als je dat kon?',
      ],
      waarschuwingszinnen: [
        '"Dit is gewoon hoe het nu gaat" — negeert de bezwaren volledig.',
        '"Je moet je erbij neerleggen" — veroorzaakt ondergrondse weerstand.',
        '"Anderen hebben er geen moeite mee" — vergelijkingen escaleren altijd.',
      ],
      reactiesOpWeerstand: [
        'Bij principiële weerstand: "Ik begrijp dat je het er niet mee eens bent. De beslissing is genomen — maar jouw input over de uitvoering is waardevol."',
        'Bij angst voor verlies: "Wat is het ergste wat er voor jou kan gebeuren in deze verandering?"',
        'Bij stilte of afhaken: "Je hoeft het niet meteen te accepteren. Wat heb je nodig om er rustig over na te denken?"',
      ],
      afsluitingMet: '"Ik waardeer je eerlijkheid. We spreken af dat je [kleine concrete actie] probeert de komende twee weken. Daarna evalueren we samen. Is dat een redelijk verzoek?"',
    },
    gevoelige_correctie: {
      id: 'gevoelige_correctie',
      titel: 'Gevoelige correctie',
      omschrijving: 'Je moet iets corrigeren dat persoonlijk gevoelig ligt of langere tijd heeft gespeeld.',
      openingszin: '"Ik wil iets met je bespreken wat ik lastig vind om te zeggen — maar ik doe het omdat ik denk dat het voor jou op langere termijn belangrijk is."',
      vervolgvragen: [
        'Ben jij je er zelf van bewust dat dit zo overkomt?',
        'Hoe denk jij dat collega\'s dit ervaren?',
        'Heb je al eerder feedback gekregen op dit punt?',
        'Wat maakt dit voor jou een moeilijk thema?',
        'Wat zou voor jou een realistisch eerste verbeterpunt zijn?',
      ],
      waarschuwingszinnen: [
        '"Iedereen ervaart dit zo" — groepsdruk versterkt schaamte en maakt het erger.',
        '"Dit zijn al lange tijd signalen geweest" — beschuldigend als je er niet eerder op bent aangesproken.',
        '"Ik had dit veel eerder moeten zeggen" — maakt jou kwetsbaar en leidt af van het gesprek.',
      ],
      reactiesOpWeerstand: [
        'Bij ontkenning: "Ik begrijp dat dit anders aanvoelt vanuit jouw positie. Mag ik je één concreet voorbeeld noemen?"',
        'Bij emotionele reactie: "Neem even de tijd. Dit is zwaar om te horen. Dat begrijp ik."',
        'Bij schaamte of terugtrekken: "Dit gesprek is niet bedoeld als aanval. Ik zie je als professional — en juist daarom ben ik direct."',
      ],
      afsluitingMet: '"We laten het even landen. Ik stel voor dat je er een nacht over slaapt en dat we [datum] even kort contact hebben. Dan bepalen we samen een kleine concrete stap. Is dat goed?"',
    },
  };

  return scenarioData[scenario];
}

export async function mockLiveCoachResponse(uiting: string): Promise<LiveCoachResponse> {
  await delay(600); // Live coach is sneller
  return {
    interpretatie: `De medewerker signaleert frustratie of onzekerheid. Achter de woorden "${uiting.substring(0, 40)}..." zit waarschijnlijk een behoefte aan erkenning of duidelijkheid.`,
    aanbevolenReactie: '"Dat klinkt frustrerend. Vertel me meer over wat er dan precies speelt."',
    coachvraag: 'Wat heb je op dit moment het meeste nodig?',
    valkuil: 'Geef nu geen oplossing — luister eerst volledig zonder te onderbreken.',
    volgendestap: 'Vat samen wat je hebt gehoord en vraag of dat klopt.',
  };
}

export async function mockReflectieResponse(): Promise<ReflectionReview> {
  await delay(MOCK_DELAY);
  return {
    analyse: 'Het gesprek laat zien dat er aan beide kanten bereidheid was, maar dat de kern van het probleem nog niet volledig is benoemd. De spanning die er was, duidt op een diepere kwestie rond verwachtingen.',
    watGoedGedaan: 'Je hebt goed doorgevraagd bij weerstand en je hebt de medewerker de ruimte gegeven om te praten. Je toon was kalm en professioneel, ook op de moeilijke momenten.',
    gemistekans: 'Je had vroeger in het gesprek concreet kunnen vragen wat de medewerker van jou als leidinggevende nodig heeft — dat had het gesprek persoonlijker en productiever gemaakt.',
    verbeterpunt: 'Formuleer de concrete afspraak aan het einde altijd luid en vraag de medewerker die te herhalen — zo voorkom je onduidelijkheid achteraf.',
    followupBericht: 'Hoi, dank voor ons gesprek van vandaag. Zoals afgesproken: jij zorgt voor [actie] vóór [datum]. Ik kijk ernaar uit om over twee weken samen te evalueren hoe het gaat. Laat me weten als er iets is. Groeten, [naam]',
  };
}
