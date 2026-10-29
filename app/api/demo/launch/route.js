import { NextResponse } from 'next/server';

const BACKEND = process.env.DOCKER_BACKEND_URL || 'http://localhost:4000';
const SECRET = process.env.DOCKER_BACKEND_SECRET || '';

export async function POST(request) {
  const { projectId } = await request.json();
  if (!projectId) return NextResponse.json({ error: 'projectId requis' }, { status: 400 });

  // nginx sets X-Real-IP; X-Forwarded-For's first hop is client-controlled, so it's only a fallback
  const clientIp = request.headers.get('x-real-ip')
    || request.headers.get('x-forwarded-for')?.split(',').pop().trim()
    || 'unknown';

  try {
    const res = await fetch(`${BACKEND}/launch/${encodeURIComponent(projectId)}`, {
      method: 'POST',
      headers: { 'x-backend-secret': SECRET, 'x-client-ip': clientIp, 'content-type': 'application/json' },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: 'Backend indisponible' }, { status: 503 });
  }
}
