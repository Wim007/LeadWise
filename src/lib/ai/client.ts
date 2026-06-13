import type {
  GespreksVoorbereiding,
  CoachingAdvice,
  HerschrijverResultaat,
  ConversationScenario,
  LiveCoachInput,
  LiveCoachResponse,
  ReflectieInput,
  ReflectionReview,
  ScenarioType,
} from '@/types';
import {
  VOORBEREIDER_PROMPT,
  HERSCHRIJVER_PROMPT,
  SCENARIO_PROMPT,
  LIVE_COACH_PROMPT,
  REFLECTIE_PROMPT,
} from './prompts';
import {
  mockVoorbereiderResponse,
  mockHerschrijverResponse,
  mockScenarioResponse,
  mockLiveCoachResponse,
  mockReflectieResponse,
} from './mock';

const useMock = () =>
  !process.env.ANTHROPIC_API_KEY ||
  process.env.NEXT_PUBLIC_USE_MOCK === 'true';

async function callClaude(systemPrompt: string, userMessage: string): Promise<string> {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const message = await client.messages.create({
    model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  // Extract JSON from response
  const jsonMatch = content.text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('No JSON found in response');
  return jsonMatch[0];
}

export async function generateVoorbereiding(input: GespreksVoorbereiding): Promise<CoachingAdvice> {
  if (useMock()) return mockVoorbereiderResponse(input.medewerkernaam);

  const userMessage = `
Gesprekstype: ${input.gespreksType}
Medewerker: ${input.medewerkernaam}
Context: ${input.context}
Probleem of doel: ${input.probleemOfDoel}
Al geprobeerd: ${input.alGeprobeerd}
Gewenste uitkomst: ${input.gewensteUitkomst}
Gevoeligheid: ${input.gevoeligheid}
  `;

  const json = await callClaude(VOORBEREIDER_PROMPT, userMessage);
  return JSON.parse(json) as CoachingAdvice;
}

export async function generateHerschrijving(origineel: string): Promise<HerschrijverResultaat> {
  if (useMock()) return mockHerschrijverResponse(origineel);

  const json = await callClaude(
    HERSCHRIJVER_PROMPT,
    `Herschrijf deze managerstekst in 4 varianten:\n\n"${origineel}"`
  );
  const parsed = JSON.parse(json);
  return { origineel, varianten: parsed.varianten };
}

export async function generateScenarioAanpak(scenario: ScenarioType): Promise<ConversationScenario> {
  if (useMock()) return mockScenarioResponse(scenario);

  const scenarioLabels: Record<ScenarioType, string> = {
    onderprestatie: 'Medewerker presteert onder niveau',
    defensief: 'Medewerker is defensief',
    teamconflict: 'Conflict in het team',
    weinig_eigenaarschap: 'Medewerker neemt weinig eigenaarschap',
    weerstand_verandering: 'Weerstand tegen verandering',
    gevoelige_correctie: 'Gevoelige correctie',
  };

  const json = await callClaude(
    SCENARIO_PROMPT,
    `Scenario: ${scenarioLabels[scenario]}\nGeef een complete aanpak voor dit gesprekscenario.`
  );
  const parsed = JSON.parse(json);
  return { id: scenario, titel: scenarioLabels[scenario], omschrijving: '', ...parsed };
}

export async function generateLiveCoachReactie(input: LiveCoachInput): Promise<LiveCoachResponse> {
  if (useMock()) return mockLiveCoachResponse(input.medewerkerUiting);

  const userMessage = `
Medewerker zegt: "${input.medewerkerUiting}"
${input.gesprekContext ? `Gesprekscontext: ${input.gesprekContext}` : ''}
  `;

  const json = await callClaude(LIVE_COACH_PROMPT, userMessage);
  return JSON.parse(json) as LiveCoachResponse;
}

export async function generateReflectie(input: ReflectieInput): Promise<ReflectionReview> {
  if (useMock()) return mockReflectieResponse();

  const userMessage = `
Wat is er gebeurd: ${input.watGebeurd}
Wat werkte: ${input.watWerkte}
Waar liep het vast: ${input.waarVastgelopen}
Vervolgactie: ${input.vervolgactie}
  `;

  const json = await callClaude(REFLECTIE_PROMPT, userMessage);
  return JSON.parse(json) as ReflectionReview;
}
