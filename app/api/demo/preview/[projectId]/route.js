const BACKEND = process.env.DOCKER_BACKEND_URL || 'http://localhost:4000';
const SECRET = process.env.DOCKER_BACKEND_SECRET || '';

const PASSTHROUGH = ['content-type', 'content-length', 'content-range', 'accept-ranges', 'cache-control', 'etag', 'last-modified'];

// Streams the demo's preview (video/image) from the backend. Range is forwarded so videos can seek.
export async function GET(request, { params }) {
  const { projectId } = await params;
  const headers = { 'x-backend-secret': SECRET };
  const range = request.headers.get('range');
  if (range) headers.range = range;

  try {
    const res = await fetch(`${BACKEND}/preview/${encodeURIComponent(projectId)}`, { headers, cache: 'no-store' });
    if (!res.ok && res.status !== 206) return new Response(null, { status: res.status === 416 ? 416 : 404 });
    const out = new Headers();
    for (const h of PASSTHROUGH) {
      const v = res.headers.get(h);
      if (v) out.set(h, v);
    }
    return new Response(res.body, { status: res.status, headers: out });
  } catch {
    return new Response(null, { status: 503 });
  }
}
