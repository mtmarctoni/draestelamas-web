/**
 * HTTP Basic Auth gate.
 *
 * Returns null when the request is authorized (caller should call next()),
 * or a 401 Response when it is not.
 *
 * Auth is OPT-IN: if either AUTH_USER or AUTH_PASS is unset / empty the gate
 * is a no-op (returns null), so production can run without auth simply by not
 * configuring the env vars.
 */

export function basicAuthGate(
  authUser: string | undefined,
  authPass: string | undefined,
  authorization: string | null,
  realm = "draestelamas",
): Response | null {
  if (!authUser || !authPass) return null;

  if (!authorization?.startsWith("Basic ")) {
    return unauthorizedResponse(realm);
  }

  const encoded = authorization.slice("Basic ".length).trim();

  let decoded: string;
  try {
    decoded = atob(encoded);
  } catch {
    return unauthorizedResponse(realm);
  }

  const colonIdx = decoded.indexOf(":");
  if (colonIdx === -1) return unauthorizedResponse(realm);

  const user = decoded.slice(0, colonIdx);
  const pass = decoded.slice(colonIdx + 1);

  if (constantTimeEqual(user, authUser) && constantTimeEqual(pass, authPass)) {
    return null;
  }

  return unauthorizedResponse(realm);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

function unauthorizedResponse(realm: string): Response {
  return new Response("401 Unauthorized\n", {
    status: 401,
    headers: {
      "WWW-Authenticate": `Basic realm="${realm}", charset="UTF-8"`,
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
