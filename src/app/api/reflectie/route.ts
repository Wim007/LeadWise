import { NextRequest, NextResponse } from 'next/server';
import { generateReflectie } from '@/lib/ai/client';
import type { ReflectieInput } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as ReflectieInput;

    if (!body.watGebeurd || body.watGebeurd.trim().length < 10) {
      return NextResponse.json(
        { error: 'Beschrijf kort wat er is gebeurd.' },
        { status: 400 }
      );
    }

    const result = await generateReflectie(body);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Reflectie error:', error);
    return NextResponse.json(
      { error: 'Er is iets misgegaan. Probeer het opnieuw.' },
      { status: 500 }
    );
  }
}
