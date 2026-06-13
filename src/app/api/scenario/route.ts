import { NextRequest, NextResponse } from 'next/server';
import { generateScenarioAanpak } from '@/lib/ai/client';
import type { ScenarioType } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { scenario } = await request.json() as { scenario: ScenarioType };

    if (!scenario) {
      return NextResponse.json({ error: 'Selecteer een scenario.' }, { status: 400 });
    }

    const result = await generateScenarioAanpak(scenario);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Scenario error:', error);
    return NextResponse.json(
      { error: 'Er is iets misgegaan. Probeer het opnieuw.' },
      { status: 500 }
    );
  }
}
