import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { basicAuthGate } from "./lib/basic-auth";

export const onRequest = defineMiddleware((context, next) => {
  const gate = basicAuthGate(
    env.AUTH_USER,
    env.AUTH_PASS,
    context.request.headers.get("authorization"),
  );
  if (gate) return gate;

  return next().then((response) => {
    if (!env.AUTH_USER || !env.AUTH_PASS) return response;

    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "no-store, s-maxage=0");
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  });
});
