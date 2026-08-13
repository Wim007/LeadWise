# Carnegie Coach

Een persoonlijke gedragstrainer voor betere gesprekken. Geen chatbot en geen
cursus: je oefent één concreet gesprek, je krijgt eerlijke feedback en je gaat
weg met één zin die je morgen echt kunt gebruiken.

## Wat de app doet

**Gesprek oefenen.** Je kiest een context (stakeholder, collega, klant of
zorgpartner, conflict, of privé) en beschrijft de situatie in één veld. De AI
kiest maximaal drie relevante gedragsprincipes en speelt vervolgens je
gesprekspartner. Je krijgt bewust géén feedback tussendoor — dat zou het
rollenspel kapotmaken. Na twee of drie antwoorden volgt een debrief: wat ging
sterk, waar verloor je invloed, welke principes speelden, één betere
voorbeeldzin en één concrete actie.

**Tekst laten beoordelen.** Plak een conceptmail, een appje of een samenvatting
van een gesprek. Je krijgt het sterkste element, het risico of de gemiste kans,
maximaal drie principes en een verbeterde versie die je direct kunt gebruiken.

**Reflecteren op vandaag.** Drie vragen over je dag, maximaal drie korte
reflectiepunten terug, en altijd één micro-opdracht voor morgen.

**Voortgang.** Hoeveel je deze week oefende, welke principes het vaakst
terugkomen, je laatste oefenactie en maximaal drie terugkerende
ontwikkelpunten. Je kunt één sessie verwijderen of in één keer alles wissen.

## Wat de app níét is

Geen therapeut, jurist, HR-systeem of medisch hulpmiddel. Bij signalen van
geweld, zelfbeschadiging, onveiligheid in een relatie of een medische
noodsituatie stopt de coach met coachen en verwijst hij naar echte hulp.

## Techniek

| Onderdeel | Keuze |
|---|---|
| Frontend | React 18 + Vite, JavaScript, mobiel-eerst, eigen CSS (geen framework) |
| Backend | Node.js 22 + Express, JavaScript, ES-modules |
| Database | PostgreSQL via de `pg`-library (geen ORM) |
| AI | Anthropic API, uitsluitend server-side |
| Hosting | Railway, één service met een Dockerfile |

De sleutel voor de AI blijft altijd op de server. De browser praat alleen met
de eigen API en krijgt nooit een sleutel te zien.

## Projectstructuur

```
client/            React-app (Vite)
  src/pages/       Start, Scenario, TextReview, Reflection, Progress
  src/components/  Gedeelde bouwstenen
  src/styles/      Ontwerpwaarden en basisopmaak
  src/api.js       Alle serveraanroepen
server/
  src/index.js     Express-app; serveert in productie ook de client
  src/db.js        Verbindingspool
  src/schema.sql   Databaseschema (idempotent)
  src/migrate.js   Voert het schema uit
  src/routes/      Endpoints per onderwerp
  src/prompts/     De coachinstructie
  src/services/    Koppeling met de Anthropic API
  src/lib/         Validatie, foutafhandeling, veiligheidscheck
Dockerfile         Bouwt client en server tot één image
railway.toml       Railway-configuratie
```

## Lokaal draaien

Nodig: Node.js 20 of hoger en een draaiende PostgreSQL.

```bash
# 1. Dependencies
npm run install:all

# 2. Instellingen
cp .env.example .env
#    Vul DATABASE_URL en ANTHROPIC_API_KEY in.

# 3. Database klaarzetten
createdb carnegie_coach     # als de database nog niet bestaat
npm run db:migrate

# 4. Starten (client en server tegelijk)
npm run dev
```

De app draait dan op **http://localhost:5173**. De API draait op poort 3001;
Vite stuurt `/api`-verzoeken daar automatisch naartoe.

Controleren of de server staat:

```bash
curl http://localhost:3001/api/health
```

### Beschikbare commando's

| Commando | Wat het doet |
|---|---|
| `npm run install:all` | Installeert root, server en client |
| `npm run dev` | Start client en server tegelijk |
| `npm run dev:server` | Alleen de API, met automatische herstart |
| `npm run dev:client` | Alleen de frontend |
| `npm run db:migrate` | Werkt het databaseschema bij |
| `npm run build` | Bouwt de client voor productie |
| `npm start` | Migreert en start de productieserver |
| `npm run lint` | Controleert de frontend |

## Environment variables

| Variabele | Verplicht | Toelichting |
|---|---|---|
| `DATABASE_URL` | ja | PostgreSQL-connectiestring. Op Railway automatisch gevuld. |
| `ANTHROPIC_API_KEY` | ja | Je Anthropic API-sleutel. Zonder deze sleutel start de server niet. |
| `ANTHROPIC_MODEL` | nee | Standaard `claude-sonnet-5`. |
| `PORT` | nee | Standaard 3001. Railway vult dit zelf. |
| `DATABASE_SSL` | nee | Zet op `true` om TLS af te dwingen als je verbinding dat nodig heeft maar `sslmode` niet in de URL staat. |

Zet nooit een echte sleutel in `.env.example` of in een commit. `.env` staat in
`.gitignore`.

## PostgreSQL

Het schema staat in [`server/src/schema.sql`](server/src/schema.sql) en is
idempotent: je kunt het zo vaak draaien als je wilt. `npm run db:migrate` voert
het uit, en de productieserver doet dit automatisch bij elke start. Een aparte
migratietool is voor dit project niet nodig.

Twee tabellen:

- **`sessions`** — één rij per afgeronde oefening: type, contextlabel, gekozen
  principes, feedback, oefenactie, ontwikkelpunt en tijdstip.
- **`messages`** — alleen het rollenspel van een scenario. Verwijder je een
  sessie, dan gaan de bijbehorende berichten automatisch mee.

De tekst die je laat beoordelen wordt **niet** opgeslagen. Alleen de feedback en
de oefenactie blijven bewaard, want dat is wat je nodig hebt voor continuïteit.

## Deployen op Railway

1. **Push de code naar GitHub.**

2. **Maak een project aan.** Ga naar [railway.app](https://railway.app),
   kies *New Project* → *Deploy from GitHub repo* en selecteer deze repository.

3. **Voeg PostgreSQL toe.** Klik in je project op *New* → *Database* →
   *Add PostgreSQL*. Railway maakt de database aan en zet `DATABASE_URL`
   klaar als gedeelde variabele.

4. **Koppel de database aan je service.** Open je app-service → tabblad
   *Variables* → *New Variable* → *Add Reference* → kies `DATABASE_URL` van de
   Postgres-service. Zonder deze koppeling start de server niet.

5. **Zet de AI-sleutel.** Voeg in hetzelfde tabblad toe:

   | Naam | Waarde |
   |---|---|
   | `ANTHROPIC_API_KEY` | je Anthropic API-sleutel |
   | `ANTHROPIC_MODEL` | `claude-sonnet-5` (optioneel) |

   `PORT` hoef je niet te zetten; Railway doet dat zelf en de server leest hem.

6. **Build-instellingen.** Niets aan te passen: `railway.toml` wijst naar de
   `Dockerfile` in de repo-root, en die bouwt zowel de client als de server.
   *Root Directory* blijft leeg (de repo-root). Er is geen apart build- of
   startcommando nodig; het image doet dat zelf.

7. **Deploy.** Railway bouwt automatisch. Bij het starten draait eerst de
   migratie en daarna de server. De healthcheck op `/api/health` moet groen
   worden.

8. **Zet een domein aan.** Service → *Settings* → *Networking* →
   *Generate Domain*. De app is daarna bereikbaar op die URL.

### Controleren of het werkt

```bash
curl https://jouw-app.up.railway.app/api/health
```

Verwacht: `{"status":"ok","database":"ok",...}`. Staat er `"database":
"unreachable"`, dan is `DATABASE_URL` niet gekoppeld aan de service.

## Bekende beperkingen van de MVP

- **Eén gebruiker, geen login.** Iedereen met de URL ziet dezelfde gegevens.
  Zet de app niet op een openbaar domein zonder daar rekening mee te houden.
- **Geen audio-opname.** Bewuste keuze voor deze versie; je typt je antwoorden.
- **Vast aantal beurten.** Een scenario loopt tot de debrief na twee of drie
  antwoorden. Je kunt niet langer doorspelen.
- **Debrief is definitief.** Na de debrief is het scenario afgerond; je kunt
  het gesprek niet hervatten.
- **Geen bewerken achteraf.** Je kunt een sessie verwijderen, niet aanpassen.
- **Terugkerende ontwikkelpunten verschijnen pas** als er minstens drie
  oefeningen met een ontwikkelpunt zijn opgeslagen.
- **Geen exportfunctie.** Je gegevens staan in Postgres; er is nog geen knop om
  ze te downloaden.
- **Crisisdetectie is grofmazig.** Een woordfilter plus de instructie aan de AI.
  Het is een vangnet, geen risicotaxatie, en het kan zowel te vaak als te weinig
  aanslaan.
- **Onbeperkt gebruik.** Er zit geen rem op het aantal AI-aanroepen; je
  Anthropic-verbruik is je eigen verantwoordelijkheid.
