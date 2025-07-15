import { type Fetcher, type Request } from "@cloudflare/workers-types";

interface Env {
  ASSETS: Fetcher;
}

interface Redirect {
  from: string;
  to: string;
  status: number;
  kind: "static" | "dynamic";
};

type Redirects = ReadonlyArray<Redirect>;

type HeaderPatterns = Record<string, Record<string, string>>;

const headerPatterns: HeaderPatterns = {
  // Headers which are common to all paths. This includes most security
  // headers.
  "/.*": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy": "default-src 'self'; connect-src *; img-src 'self' data:; script-src 'self' 'sha256-dNGbdYMnwBYenrRGOHR0l33DkR37uJKlpRHFVeG85Lk=' https://umami.acearchive.lgbt; style-src 'self' 'unsafe-inline'; base-uri 'self'; frame-ancestors 'none';",
    "Referrer-Policy": "strict-origin",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
    "Cache-Control": "no-cache",
    "Access-Control-Allow-Origin": "*",
  },
  // Path-specific caching headers. We want to employ a different caching
  // strategy with files that have cache-busting filenames (e.g. JS/CSS) vs
  // those that do not (e.g. HTML).
  "/js/[^/]+\\.js": {
    "Cache-Control": "public, immutable, max-age=31536000",
  },
  "/js/vendor/.+": {
    "Cache-Control": "no-cache",
  },
  "/js/vendor/bootstrap/dist/js/[^/]+\\.js": {
    "Cache-Control": "public, immutable, max-age=31536000",
  },
  "/css/[^/]+\\.css": {
    "Cache-Control": "public, immutable, max-age=31536000",
  },
  "/css/vendor/.+": {
    "Cache-Control": "no-cache",
  },
  "/icons/.+": {
    "Cache-Control": "public, immutable, max-age=31536000",
  },
  "/fonts/.+": {
    "Cache-Control": "public, immutable, max-age=31536000",
  },
  // Headers specific to Stoplight Elements, the app we embed for rendering the
  // OpenAPI docs.
  "/docs/api/.+": {
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src https://raw.githubusercontent.com https://api.acearchive.lgbt; frame-ancestors 'none';",
  },
  // File-specific header overrides.
  "/cute\\.gif": {
    "Content-Type": "image/webp",
  }
};

export default {
  async fetch(request: Request, env: Env) {
    const requestUrl = new URL(request.url);

    const redirectsUrl = new URL(request.url);
    redirectsUrl.pathname = "/redirects.json";

    const redirectsResponse = await env.ASSETS.fetch(redirectsUrl);
    const redirects: Redirects = await redirectsResponse.json();

    for (const redirect of redirects) {
      if (
        (redirect.kind === "static" && requestUrl.pathname === redirect.from)
        || (redirect.kind === "dynamic" && requestUrl.pathname.startsWith(redirect.from))
      ) {
        const url = new URL(request.url);
        url.pathname = redirect.to;
        return Response.redirect(url.toString(), redirect.status);
      }
    }

    const response = await env.ASSETS.fetch(request);
    const newResponse = new Response(response.body, response);

    for (const [pattern, patternHeaders] of Object.entries(headerPatterns)) {
      if (new RegExp(pattern).test(requestUrl.pathname)) {
        for (const [key, value] of Object.entries(patternHeaders)) {
          newResponse.headers.set(key, value);
        }
      }
    }

    return newResponse;
  },
};
