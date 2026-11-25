import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

// Search engines and AI answer engines (GEO) that should read the site.
// They're already covered by the "*" rule; naming them makes the intent
// explicit and survives a future tightening of the default rule.
const AI_AND_SEARCH_BOTS = [
  "Googlebot",
  "Bingbot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot",
  "Applebot-Extended",
];

// /blog/busca stays crawlable on purpose: it carries `noindex, follow`
// (which a robots block would hide from crawlers) and it is the target of
// the WebSite SearchAction that AI assistants can call.
const DISALLOW = ["/api/"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // `/_next/` must stay crawlable: Google needs the JS/CSS chunks to
      // render pages and `/_next/image` to index images.
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
