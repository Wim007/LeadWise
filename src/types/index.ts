// ─── Conversatie voorbereiding ───────────────────────────────────────────────

export type GespreksType =
  | 'functioneringsgesprek'
  | 'correctiegesprek'
  | 'motivatiegesprek'
  | 'conflictgesprek'
  | 'verzuimgesprek'
  | 'ontwikkelgesprek'
  | 'exitgesprek'
  | 'overig';

export type GesprekGevoeligheid = 'laag' | 'gemiddeld' | 'hoog' | 'zeer_hoog';

export interface GespreksVoorbereiding {
  gespreksType: GespreksType;
  medewerkernaam: string;
  context: string;
  probleemOfDoel: string;
  alGeprobeerd: string;
  gewensteUitkomst: string;
  gevoeligheid: GesprekGevoeligheid;
}

export interface CoachingAdvice {
  gespreksdoel: string;
  risicos: string[];
  aanbevolenToon: string;
  openingszin: string;
  coachvragen: string[];
  vermijdZinnen: string[];
  gespreksplan: string;
}

// ─── Herschrijver ─────────────────────────────────────────────────────────────

export type RewriteVariantType =
  | 'vriendelijk_duidelijk'
  | 'empathisch'
  | 'begrenzend_respectvol'
  | 'motiverend_coachend';

export interface RewriteVariant {
  type: RewriteVariantType;
  label: string;
  tekst: string;
  waaromBeter: string;
  vermijdtRisico: string;
  gebruikWanneer: string;
}

export interface HerschrijverResultaat {
  origineel: string;
  varianten: RewriteVariant[];
}

// ─── Scenario cockpit ─────────────────────────────────────────────────────────

export type ScenarioType =
  | 'onderprestatie'
  | 'defensief'
  | 'teamconflict'
  | 'weinig_eigenaarschap'
  | 'weerstand_verandering'
  | 'gevoelige_correctie';

export interface ConversationScenario {
  id: ScenarioType;
  titel: string;
  omschrijving: string;
  openingszin: string;
  vervolgvragen: string[];
  waarschuwingszinnen: string[];
  reactiesOpWeerstand: string[];
  afsluitingMet: string;
}

// ─── Live coachmodus ─────────────────────────────────────────────────────────

export interface LiveCoachInput {
  medewerkerUiting: string;
  gesprekContext?: string;
}

export interface LiveCoachResponse {
  interpretatie: string;
  aanbevolenReactie: string;
  coachvraag: string;
  valkuil: string;
  volgendestap: string;
}

// ─── Reflectie na gesprek ─────────────────────────────────────────────────────

export interface ReflectieInput {
  watGebeurd: string;
  watWerkte: string;
  waarVastgelopen: string;
  vervolgactie: string;
}

export interface ReflectionReview {
  analyse: string;
  watGoedGedaan: string;
  gemistekans: string;
  verbeterpunt: string;
  followupBericht: string;
}

// ─── Systeem gedragsregels ────────────────────────────────────────────────────

export interface SystemBehaviorRules {
  taal: 'nl';
  niveau: 'B1' | 'B2';
  verboden: string[];
  verplicht: string[];
  toonprofiel: string;
  outputStijl: string;
}

// ─── Prompt bibliotheek ───────────────────────────────────────────────────────

export interface PromptTemplate {
  id: string;
  categorie: string;
  titel: string;
  situatie: string;
  prompt: string;
  tags: string[];
}

// ─── App instellingen ─────────────────────────────────────────────────────────

export interface AppInstellingen {
  gebruikersnaam: string;
  organisatie: string;
  rol: string;
  aiModel: string;
  taalNiveau: 'B1' | 'B2';
  mockModus: boolean;
}

// ─── API response wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  loading?: boolean;
}
