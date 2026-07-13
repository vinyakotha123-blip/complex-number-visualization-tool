import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Graph } from '@/models/Graph';
import { savedGraphInputSchema } from '@/lib/validation';

export async function GET() {
  try {
    await connectToDatabase();
    const graphs = await Graph.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ data: graphs }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch saved graphs.', details: errorMessage(err) },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });
    }

    const parsed = savedGraphInputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed.', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    await connectToDatabase();
    const graph = await Graph.create({
      name: parsed.data.name,
      re: parsed.data.re,
      im: parsed.data.im,
      color: parsed.data.color ?? '#7c5cff',
    });

    return NextResponse.json({ data: graph }, { status: 201 });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to save graph.', details: errorMessage(err) },
      { status: 500 }
    );
  }
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error.';
}
