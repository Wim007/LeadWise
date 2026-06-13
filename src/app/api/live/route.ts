import { NextRequest, NextResponse } from 'next/server';
import { generateLiveCoachReactie } from '@/lib/ai/client';
import type { LiveCoachInput } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as LiveCoachInput;

    if (!body.medewerkerUiting || body.medewerkerUiting.trim().length < 3) {
      return NextResponse.json(
        { error: 'Typ wat de medewerker zegt.' },
        { status: 400 }
      );
    }

    const result = await generateLiveCoachReactie(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Live coach error:', error);
    return NextResponse.json(
      { error: 'Er is iets misgegaan. Probeer het opnieuw.' },
      { status: 500 }
    );
  }
}
