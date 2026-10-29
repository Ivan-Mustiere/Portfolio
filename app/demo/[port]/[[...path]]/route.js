// Dev-only stand-in for nginx: /demo/<port>/... → http://127.0.0.1:<port>/demo/<port>/...
// In production nginx serves /demo/ before requests reach Next, and this handler refuses anyway.

const PORT_MIN = 20000;
const PORT_MAX = 59999;
// Hop-by-hop headers, and encoding/length that no longer match once fetch has decoded the body
const DROP_REQUEST = ["host", "connection", "content-length"];
const DROP_RESPONSE = ["content-encoding", "content-length", "transfer-encoding", "connection"];

async function proxy(request, { params }) {
  if (process.env.NODE_ENV === "production") return new Response("Not found", { status: 404 });

  const { port } = await params;
  const portNum = Number(port);
  // Only demo ports, so this can't reach other local services
  if (!Number.isInteger(portNum) || portNum < PORT_MIN || portNum > PORT_MAX) {
    return new Response("Invalid demo port", { status: 400 });
  }

  const url = new URL(request.url);
  const target = `http://127.0.0.1:${portNum}${url.pathname}${url.search}`;
  const headers = new Headers(request.headers);
  DROP_REQUEST.forEach((h) => headers.delete(h));

  let res;
  try {
    res = await fetch(target, {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : request.body,
      duplex: "half",
      redirect: "manual",
    });
  } catch {
    return new Response("Demo unreachable", { status: 502 });
  }

  const outHeaders = new Headers(res.headers);
  DROP_RESPONSE.forEach((h) => outHeaders.delete(h));
  return new Response(res.body, { status: res.status, statusText: res.statusText, headers: outHeaders });
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE, proxy as HEAD, proxy as OPTIONS };
