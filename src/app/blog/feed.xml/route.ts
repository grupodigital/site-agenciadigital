import { getPostIndex } from "@/lib/blog";
import { SITE } from "@/lib/site";

// Prerendered and refreshed with the rest of the blog.
export const dynamic = "force-static";
export const revalidate = 600;

const FEED_SIZE = 30;

function xml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = (await getPostIndex()).slice(0, FEED_SIZE);
  const blogUrl = `${SITE.url}/blog`;
  const lastBuild = posts[0]?.modifiedAt ?? new Date().toISOString();

  const items = posts
    .map((post) => {
      const url = `${blogUrl}/${post.slug}`;
      return `    <item>
      <title>${xml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <description>${xml(post.excerpt)}</description>${
        post.author ? `\n      <dc:creator>${xml(post.author)}</dc:creator>` : ""
      }${
        post.category ? `\n      <category>${xml(post.category)}</category>` : ""
      }
    </item>`;
    })
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(`Blog — ${SITE.name}`)}</title>
    <link>${blogUrl}</link>
    <atom:link href="${blogUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>${xml("Artigos sobre marketing, estratégia comercial e comunicação institucional na região Norte.")}</description>
    <language>pt-BR</language>
    <lastBuildDate>${new Date(lastBuild).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(body, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
