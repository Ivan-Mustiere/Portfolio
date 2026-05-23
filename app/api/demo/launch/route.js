import { NextResponse } from 'next/server';

const BACKEND = process.env.DOCKER_BACKEND_URL || 'http://localhost:4000';
const SECRET = process.env.DOCKER_BACKEND_SECRET || '';

export async function POST(request) {
  const { projectId } = await request.json();
  if (!projectId) return NextResponse.json({ error: 'projectId requis' }, { status: 400 });

  try {
    const res = await fetch(`${BACKEND}/launch/${encodeURIComponent(projectId)}`, {
      method: 'POST',
      headers: { 'x-backend-secret': SECRET, 'content-type': 'application/json' },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: 'Backend indisponible' }, { status: 503 });
  }
}
