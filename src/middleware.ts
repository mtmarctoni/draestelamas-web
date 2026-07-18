import { defineMiddleware } from "astro:middleware";
import { env } from "cloudflare:workers";
import { basicAuthGate } from "./lib/basic-auth";

export const onRequest = defineMiddleware((context, next) => {
  const gate = basicAuthGate(
    env.AUTH_USER,
    env.AUTH_PASS,
    context.request.headers.get("authorization"),
  );
  return gate ?? next();
});
