import { type Fetcher, type Request } from "@cloudflare/workers-types";

interface Env {
  ASSETS: Fetcher;
}

interface Redirect {
  from: string;
  to: string;
  status: number;
  kind: "static" | "dynamic";
}

type Redirects = ReadonlyArray<Redirect>;

type HeaderPatterns = Record<string, Record<string, string>>;

const jsonLdMediaType = "application/ld+json";
const htmlMediaType = "text/html";

const headerPatterns: HeaderPatterns = {
  // Headers which are common to all paths. This includes most security
  // headers.
  "/.*": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Content-Security-Policy":
      "default-src 'self'; connect-src *; img-src 'self' data:; script-src 'self' 'sha256-dNGbdYMnwBYenrRGOHR0l33DkR37uJKlpRHFVeG85Lk=' https://umami.acearchive.lgbt; style-src 'self' 'unsafe-inline'; base-uri 'self'; frame-ancestors 'none';",
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
    "Cache-Control": "public, max-age=86400",
  },
  // Pages which have a JSON-LD representation, served via content negotiation.
  "/(artifacts|people|identities|collections)/.+": {
    Vary: "Accept",
  },
  "\\.jsonld$": {
    "Content-Type": jsonLdMediaType,
  },
  // Headers specific to Stoplight Elements, the app we embed for rendering the
  // OpenAPI docs.
  "/docs/api/.+": {
    "Content-Security-Policy":
      "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; connect-src https://raw.githubusercontent.com https://api.acearchive.lgbt; frame-ancestors 'none';",
  },
};

// Static media used to be served from this site, but now lives in a separate
// bucket. Redirect the old paths so that external links keep working.
const staticBaseUrl = "https://static.acearchive.lgbt";
// Note that Hugo generates other `/images/logo-*` files (favicons and manifest
// icons, and the header logo) which are still served from here, so this list
// is deliberately exact.
const staticMediaPattern =
  /^\/images\/logo-(card|manifest-maskable|padded|transparent|wordmark)\.(png|webp)$/;

const stripTrailingSlash = (url: string): string =>
  url.endsWith("/") ? url.slice(0, -1) : url;

// The quality the client assigns to a media type in its `Accept` header, using
// the most specific matching media range.
const acceptQuality = (accept: string, mediaType: string): number => {
  const [type] = mediaType.split("/");
  let bestSpecificity = -1;
  let bestQuality = 0;

  for (const range of accept.split(",")) {
    const [rangeType, ...params] = range.split(";").map((s) => s.trim());

    let specificity: number;
    if (rangeType === mediaType) {
      specificity = 2;
    } else if (rangeType === `${type}/*`) {
      specificity = 1;
    } else if (rangeType === "*/*") {
      specificity = 0;
    } else {
      continue;
    }

    if (specificity <= bestSpecificity) continue;

    const qParam = params.find((param) => param.startsWith("q="));
    const quality = qParam === undefined ? 1 : parseFloat(qParam.slice(2));

    bestSpecificity = specificity;
    bestQuality = Number.isNaN(quality) ? 0 : quality;
  }

  return bestQuality;
};

// We serve HTML unless the client prefers JSON-LD.
const prefersJsonLd = (accept: string | null): boolean =>
  accept !== null &&
  acceptQuality(accept, jsonLdMediaType) > acceptQuality(accept, htmlMediaType);

const applyHeaders = (response: Response, pathname: string): Response => {
  const newResponse = new Response(response.body, response);

  for (const [pattern, patternHeaders] of Object.entries(headerPatterns)) {
    if (new RegExp(pattern).test(pathname)) {
      for (const [key, value] of Object.entries(patternHeaders)) {
        newResponse.headers.set(key, value);
      }
    }
  }

  return newResponse;
};

export default {
  async fetch(request: Request, env: Env) {
    const requestUrl = new URL(request.url);

    // Some ad blockers seem to block Umami's tracking script. To work around
    // that, we proxy it through this worker. I'm generally not a fan of trying
    // to circumvent privacy tools, but under the circumstances I think it's
    // reasonable. We're deliberately using an open-source, self-hosted
    // analytics solution to preserve users' privacy.
    if (requestUrl.pathname === "/stats.js") {
      return await fetch("https://umami.acearchive.lgbt/script.js");
    }

    if (staticMediaPattern.test(requestUrl.pathname)) {
      return Response.redirect(`${staticBaseUrl}${requestUrl.pathname}`, 301);
    }

    const redirectsUrl = new URL(request.url);
    redirectsUrl.pathname = "/redirects.json";

    const redirectsResponse = await env.ASSETS.fetch(redirectsUrl);
    const redirects: Redirects = await redirectsResponse.json();

    for (const redirect of redirects) {
      if (
        redirect.kind === "static" &&
        stripTrailingSlash(requestUrl.pathname) ===
        stripTrailingSlash(redirect.from)
      ) {
        const url = new URL(request.url);
        url.pathname = redirect.to;
        return Response.redirect(url.toString(), redirect.status);
      }

      if (
        redirect.kind === "dynamic" &&
        requestUrl.pathname.startsWith(redirect.from)
      ) {
        const url = new URL(request.url);
        const suffix = requestUrl.pathname.slice(redirect.from.length);
        url.pathname = redirect.to + suffix;
        return Response.redirect(url.toString(), redirect.status);
      }
    }

    // Pages for entities in the Omeka Data Connector's JSON-LD documents have
    // an `index.jsonld` alongside their `index.html`. Serve it to clients that
    // prefer JSON-LD. Pages without one fall through to HTML.
    if (
      (request.method === "GET" || request.method === "HEAD") &&
      prefersJsonLd(request.headers.get("Accept"))
    ) {
      const jsonLdUrl = new URL(request.url);
      jsonLdUrl.pathname = `${stripTrailingSlash(requestUrl.pathname)}/index.jsonld`;
      jsonLdUrl.search = "";

      const jsonLdResponse = await env.ASSETS.fetch(jsonLdUrl, {
        method: request.method,
      });

      if (jsonLdResponse.status === 200) {
        return applyHeaders(jsonLdResponse, jsonLdUrl.pathname);
      }
    }

    const response = await env.ASSETS.fetch(request);
    return applyHeaders(response, requestUrl.pathname);
  },
};
