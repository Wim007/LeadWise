import { NextRequest, NextResponse } from 'next/server';
import { generateHerschrijving } from '@/lib/ai/client';

export async function POST(request: NextRequest) {
  try {
    const { origineel } = await request.json();

    if (!origineel || origineel.trim().length < 10) {
      return NextResponse.json(
        { error: 'Voer minimaal 10 tekens in om te herschrijven.' },
        { status: 400 }
      );
    }

    const result = await generateHerschrijving(origineel);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Herschrijver error:', error);
    return NextResponse.json(
      { error: 'Er is iets misgegaan. Probeer het opnieuw.' },
      { status: 500 }
    );
  }
}
