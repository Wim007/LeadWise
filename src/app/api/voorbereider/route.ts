import { NextRequest, NextResponse } from 'next/server';
import { generateVoorbereiding } from '@/lib/ai/client';
import type { GespreksVoorbereiding } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as GespreksVoorbereiding;

    if (!body.medewerkernaam || !body.probleemOfDoel) {
      return NextResponse.json(
        { error: 'Vul minimaal een naam en het probleem of doel in.' },
        { status: 400 }
      );
    }

    const result = await generateVoorbereiding(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Voorbereider error:', error);
    return NextResponse.json(
      { error: 'Er is iets misgegaan. Probeer het opnieuw.' },
      { status: 500 }
    );
  }
}
