import { NextResponse } from 'next/server';

const BACKEND = process.env.DOCKER_BACKEND_URL || 'http://localhost:4000';
const SECRET = process.env.DOCKER_BACKEND_SECRET || '';

export async function GET(request, { params }) {
  const { sessionId } = await params;
  const since = new URL(request.url).searchParams.get('since') || '0';
  try {
    const res = await fetch(`${BACKEND}/logs/${encodeURIComponent(sessionId)}?since=${encodeURIComponent(since)}`, {
      headers: { 'x-backend-secret': SECRET },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Backend indisponible' }, { status: 503 });
  }
}
