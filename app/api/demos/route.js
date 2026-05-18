const BACKEND_URL = process.env.DOCKER_BACKEND_URL;
const BACKEND_SECRET = process.env.DOCKER_BACKEND_SECRET;

export async function GET() {
  const res = await fetch(`${BACKEND_URL}/demos`, {
    headers: { "x-backend-secret": BACKEND_SECRET },
  });
  const data = await res.json();
  return Response.json(data);
}
