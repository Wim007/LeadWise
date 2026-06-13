# Coach Assistent

AI-gestuurde coachingsassistent voor leidinggevenden.

## Lokaal draaien

```bash
npm install
cp .env.example .env.local
# Voeg optioneel je ANTHROPIC_API_KEY toe in .env.local
npm run dev
```

Ga naar http://localhost:3000

**Zonder API key** draaien de modules op realistische mock-antwoorden.

## Deployen op Railway

1. Push naar GitHub
2. Nieuw project aanmaken in Railway
3. Verbind met je GitHub repo
4. Root Directory: `/` (repo root)
5. Voeg omgevingsvariabelen toe:
   - `ANTHROPIC_API_KEY` — je Claude API key
   - `ANTHROPIC_MODEL` — bijv. `claude-sonnet-4-6`
6. Railway detecteert automatisch de Dockerfile

## Claude API koppelen

De app is klaar voor Claude API gebruik. Zonder key werkt alles op mocks.

Koppelpunt: [src/lib/ai/client.ts](src/lib/ai/client.ts)

Het model is configureerbaar via `ANTHROPIC_MODEL`. Aanbevolen: `claude-sonnet-4-6`.

## Modules

| Module | Route | Beschrijving |
|---|---|---|
| Dashboard | `/` | Overzicht en snelstart |
| Gespreksvoorbereider | `/voorbereider` | Gesprek voorbereiden met AI |
| Herschrijver | `/herschrijver` | Boodschap in 4 varianten herschrijven |
| Scenario cockpit | `/scenario` | Aanpak voor 6 moeilijke situaties |
| Live coachmodus | `/live` | Realtime coaching tijdens gesprek |
| Reflectie | `/reflectie` | Analyse na gesprek + opvolgbericht |
| Promptbibliotheek | `/prompts` | Kant-en-klare zinnen en vragen |
| Instellingen | `/instellingen` | AI-configuratie en gedragsregels |
