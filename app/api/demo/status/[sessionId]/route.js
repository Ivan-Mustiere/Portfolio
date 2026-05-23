import { NextResponse } from 'next/server';

const BACKEND = process.env.DOCKER_BACKEND_URL || 'http://localhost:4000';
const SECRET = process.env.DOCKER_BACKEND_SECRET || '';

export async function GET(request, { params }) {
  const { sessionId } = await params;
  try {
    const res = await fetch(`${BACKEND}/status/${encodeURIComponent(sessionId)}`, {
      headers: { 'x-backend-secret': SECRET },
      cache: 'no-store',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Backend indisponible' }, { status: 503 });
  }
}
