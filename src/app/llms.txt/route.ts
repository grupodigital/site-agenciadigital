import { getCategories, getPostIndex } from "@/lib/blog";
import { NAV_PAGES, OFFICES, SITE, SOCIAL_LINKS } from "@/lib/site";

// llms.txt (https://llmstxt.org): a plain-Markdown map of the site for AI
// assistants and answer engines (GEO) — who the agency is, where it works,
// which pages matter and every blog article with a one-line summary.
export const dynamic = "force-static";
export const revalidate = 600;

function oneLine(text: string, max = 220) {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
}

export async function GET() {
  const [posts, categories] = await Promise.all([
    getPostIndex().catch(() => []),
    getCategories().catch(() => []),
  ]);

  const offices = OFFICES.map(
    (o) =>
      `- ${o.cidade} (${o.uf}): ${o.endereco}${o.telefone ? ` — ${o.telefone}` : ""}`,
  ).join("\n");

  const pages = NAV_PAGES.map(
    (p) => `- [${p.label}](${SITE.url}${p.href === "/" ? "" : p.href})`,
  ).join("\n");

  const categoryLinks = categories
    .map(
      (c) =>
        `- [${c.name}](${SITE.url}/blog/categoria/${c.slug}): ${c.count} ${c.count === 1 ? "artigo" : "artigos"}`,
    )
    .join("\n");

  const articles = posts
    .map((p) => {
      const meta = [p.category, p.publishedAt.slice(0, 10)].filter(Boolean).join(", ");
      return `- [${p.title}](${SITE.url}/blog/${p.slug}) (${meta}): ${oneLine(p.excerpt)}`;
    })
    .join("\n");

  const body = `# ${SITE.name}

> ${SITE.description}

${SITE.name} é uma agência de comunicação institucional fundada em ${SITE.foundingDate}, com atuação em estratégia, criação, mídia e produção audiovisual, principalmente para o setor público na região Norte do Brasil (Amazonas, Tocantins e Roraima).

## Contato

- Site: ${SITE.url}
- E-mail: ${SITE.email}
${offices}

## Páginas principais

${pages}

## Perfis oficiais

${SOCIAL_LINKS.map((s) => `- [${s.label}](${s.href})`).join("\n")}

## Blog — categorias

${categoryLinks}

## Blog — artigos

${articles}

## Optional

- [Sitemap](${SITE.url}/sitemap.xml)
- [Feed RSS do blog](${SITE.url}/blog/feed.xml)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
