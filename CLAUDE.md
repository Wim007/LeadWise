# Carnegie Coach — projectcontext

## Doel

Een persoonlijke gedragstrainer voor Wim, die hem helpt gedragsprincipes
consequent toe te passen in zakelijke en privégesprekken. Drie manieren van
oefenen: een gesprek naspelen, een tekst laten beoordelen, of terugkijken op de
dag. Elke oefening levert één concrete actie op.

Dit is **geen** generieke chatbot, cursusomgeving, gamification-app of
adminomgeving. Houd het klein en persoonlijk.

## Structuur

```
client/   React 18 + Vite, JavaScript, eigen CSS (geen Tailwind)
  src/pages/        Home, Scenario, TextReview, Reflection, Progress
  src/components/   Ui.jsx — alle gedeelde bouwstenen
  src/styles/       tokens.css (ontwerpwaarden), base.css (opmaak)
  src/api.js        Alle serveraanroepen op één plek

server/   Node.js 22 + Express, ES-modules, pg (geen ORM)
  src/index.js      App; serveert in productie ook client/dist
  src/db.js         Verbindingspool
  src/schema.sql    Schema, idempotent
  src/migrate.js    Voert schema.sql uit
  src/routes/       health zit in index.js; verder scenarios, textReview,
                    reflections, progress, data
  src/prompts/      carnegieCoach.js — alle AI-instructies, providerneutraal
  src/services/     ai.js kiest op AI_PROVIDER; openai.js en anthropic.js zijn
                    de koppelingen. Routes praten alleen met ai.js.
  src/lib/          errors.js, validate.js, safety.js, env.js
```

## Kerncommando's

```bash
npm run install:all   # alles installeren
npm run dev           # client (5173) + server (3001)
npm run db:migrate    # schema bijwerken
npm run build         # client bouwen
npm start             # migreren + productieserver
npm run lint          # frontend controleren
```

Draai na elke inhoudelijke wijziging minstens `npm run lint` en `npm run build`.

## Niet-onderhandelbare regels

**Privacy**

- Verwerk nooit patiënt-, cliënt- of medische gegevens. De waarschuwing boven
  het tekstveld blijft staan.
- Sla alleen op wat nodig is voor continuïteit: type sessie, contextlabel,
  principes, feedback, één oefenactie, ontwikkelpunt en tijdstip.
- Sla **nooit** de geplakte tekst uit de tekstbeoordeling op, en ook niet de
  ruwe antwoorden uit de dagreflectie.
- Verwijderen moet altijd echt verwijderen: per sessie en in één keer alles.
- De tekst "Je bepaalt zelf wat je opslaat en kunt alles verwijderen." blijft in
  de interface staan.

**Sleutels**

- `OPENAI_API_KEY` en `ANTHROPIC_API_KEY` blijven server-side. Nooit naar de
  browser, nooit in client-code, nooit in een commit. Geen echte sleutels in
  `.env.example`.
- `AI_PROVIDER` bepaalt welke van de twee wordt gebruikt. Alleen de sleutel van
  de gekozen aanbieder is verplicht; ontbreekt die, dan stopt de server bij het
  starten.

**De coach**

- Schrijft Nederlands: warm, scherp, concreet, respectvol. Niet slijmerig.
- Coacht op observeerbaar gedrag en woorden, nooit op diagnoses of
  persoonlijkheidsetiketten.
- Gebruikt maximaal drie principes per feedbackmoment.
- Geeft bij elke analyse precies één zin die Wim letterlijk kan gebruiken.
- Citeert of reproduceert geen passages uit boeken of betaalde trainingen, en
  noemt geen titels of auteurs.
- Geeft tijdens een rollenspel géén feedback; die komt pas in de debrief.
- Stopt bij signalen van crisis, geweld, zelfbeschadiging, onveiligheid of
  medische nood, en verwijst naar professionele of acute hulp. Zie
  `server/src/lib/safety.js` en het CRISIS-blok in de promptmodule. Deze grens
  wordt nooit versoepeld.

**Grens van het product**

Geen therapeut, jurist, HR-systeem of medisch hulpmiddel. Geen audio-opname,
geen kalender, geen koppelingen met andere projecten.

## Werkafspraak

Stel bij grotere wijzigingen — nieuwe schermen, wijzigingen in het datamodel,
nieuwe endpoints, een andere stack of andere afhankelijkheden — **eerst een kort
plan voor en wacht op akkoord** voordat je bestanden aanmaakt of wijzigt.
Kleine correcties (een typefout, een stijlwaarde, een duidelijke bug) mag je
direct doen.

Commit en push niets zonder expliciete opdracht.

## Aandachtspunten in de code

- Het schema is idempotent en draait bij elke productiestart. Nieuwe kolommen
  toevoegen met `ALTER TABLE ... ADD COLUMN IF NOT EXISTS`.
- TLS naar de database wordt afgeleid uit `sslmode` in `DATABASE_URL` of uit
  `DATABASE_SSL`, niet uit `NODE_ENV`. Railway's interne verbinding heeft geen
  TLS; forceren breekt de deploy.
- Het model moet JSON teruggeven. `services/ai.js` parseert dat tolerant en
  geeft een nette Nederlandse fout als het misgaat. Nieuwe aanbieder toevoegen?
  Eén bestand met `assertConfigured`, `modelName` en `complete`, en registreren
  in `ai.js` — de routes en prompts blijven ongemoeid.
- OpenAI wisselde van `max_tokens` naar `max_completion_tokens`. `openai.js`
  probeert de nieuwe naam, valt bij een 400 terug op de oude en onthoudt dat.
- De thema-analyse op de Voortgangspagina wordt in het geheugen gecachet op de
  inhoud van de ontwikkelpunten, en valt bij een AI-storing terug op de ruwe
  punten. De pagina mag nooit omvallen op de AI.
- Foutmeldingen uit `AppError` worden rechtstreeks aan de gebruiker getoond en
  zijn dus altijd in het Nederlands en zonder technisch jargon.
