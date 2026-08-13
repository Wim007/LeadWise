/**
 * Veiligheidslaag.
 *
 * Twee sporen die elkaar aanvullen:
 *  1. Deze lokale check kijkt naar duidelijke signalen in wat de gebruiker
 *     intypt, vóórdat er een AI-aanroep gebeurt.
 *  2. De systeemprompt instrueert het model om zelf te stoppen en "crisis": true
 *     terug te geven bij signalen die deze lijst mist.
 *
 * Bewust grofmazig: liever één keer te vaak doorverwijzen dan één keer te
 * weinig. Dit is geen diagnose-instrument en geen risicotaxatie.
 */

const SIGNALEN = [
  /\bzelfmoord/i,
  /\bzelfdoding/i,
  /\bsuicid/i,
  /\bsuïcid/i,
  /\bniet meer leven\b/i,
  /\bdood wil/i,
  /\bmezelf (iets aandoen|van kant maken|pijn doen)/i,
  /\bmezelf snijden\b/i,
  /\bautomutilat/i,
  /\bmishandel/i,
  /\bhuiselijk geweld\b/i,
  /\bslaat mij\b/i,
  /\bsloeg mij\b/i,
  /\bbedreigt mij\b/i,
  /\bmet de dood bedreig/i,
  /\bik ben bang voor (hem|haar|ze|die)\b/i,
  /\bniet veilig thuis\b/i,
  /\bmisbruik/i,
  /\bverkracht/i,
  /\bmes\b.*\b(dreig|trok)/i,
  /\bacuut gevaar\b/i,
  /\bambulance\b/i,
  /\boverdosis\b/i,
];

export const CRISIS_ANTWOORD = {
  crisis: true,
  title: 'Dit vraagt om echte hulp, niet om oefenen',
  message:
    'Wat je hier beschrijft is te ernstig om als oefening te behandelen. Ik stop daarom met coachen. ' +
    'Neem hier alsjeblieft contact over op met iemand die kan helpen: bel bij direct gevaar 112, ' +
    'bel anders je huisarts of buiten kantooruren de huisartsenpost. ' +
    'Gaat het over gedachten aan zelfdoding? Bel dan 113 of 0800-0113, dag en nacht bereikbaar (113 Zelfmoordpreventie).',
};

/** @returns {boolean} of de tekst een duidelijk crisissignaal bevat. */
export function detectCrisis(...texts) {
  const combined = texts.filter(Boolean).join('\n');
  return SIGNALEN.some((re) => re.test(combined));
}
