import { NextResponse } from 'next/server';

const BACKEND = process.env.DOCKER_BACKEND_URL || 'http://localhost:4000';
const SECRET = process.env.DOCKER_BACKEND_SECRET || '';

export async function POST(request, { params }) {
  const { sessionId } = await params;
  try {
    const res = await fetch(`${BACKEND}/extend/${encodeURIComponent(sessionId)}`, {
      method: 'POST',
      headers: { 'x-backend-secret': SECRET },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch {
    return NextResponse.json({ error: 'Backend indisponible' }, { status: 503 });
  }
}
