import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/mongodb';
import { Graph } from '@/models/Graph';
import { savedGraphUpdateSchema } from '@/lib/validation';

type RouteContext = {
  params: Promise<{ id: string }>;
};

function isValidId(id: string) {
  return mongoose.Types.ObjectId.isValid(id);
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: 'Invalid graph id.' }, { status: 400 });
  }
  try {
    await connectToDatabase();
    const graph = await Graph.findById(id).lean();
    if (!graph) return NextResponse.json({ error: 'Graph not found.' }, { status: 404 });
    return NextResponse.json({ data: graph }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch graph.', details: errorMessage(err) }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: 'Invalid graph id.' }, { status: 400 });
  }
  try {
    const body = await req.json().catch(() => null);
    if (!body) return NextResponse.json({ error: 'Request body must be valid JSON.' }, { status: 400 });

    const parsed = savedGraphUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed.', details: parsed.error.flatten().fieldErrors },
        { status: 422 }
      );
    }

    await connectToDatabase();
    const graph = await Graph.findByIdAndUpdate(id, parsed.data, { new: true });
    if (!graph) return NextResponse.json({ error: 'Graph not found.' }, { status: 404 });
    return NextResponse.json({ data: graph }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update graph.', details: errorMessage(err) }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  if (!isValidId(id)) {
    return NextResponse.json({ error: 'Invalid graph id.' }, { status: 400 });
  }
  try {
    await connectToDatabase();
    const graph = await Graph.findByIdAndDelete(id);
    if (!graph) return NextResponse.json({ error: 'Graph not found.' }, { status: 404 });
    return NextResponse.json({ data: { deleted: true } }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete graph.', details: errorMessage(err) }, { status: 500 });
  }
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : 'Unknown error.';
}
