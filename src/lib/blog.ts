// Client for the WordPress REST API that powers /blog. The data functions run
// on the server only (pages, metadata, sitemap) — fetches are cached by
// Next.js and revalidated every BLOG_REVALIDATE seconds, so new WordPress
// posts show up on the site without a redeploy. The types and the small
// formatting helpers at the bottom are safe to import from client components.

export const BLOG_ORIGIN = "https://blog.agenciadigital.com.vc";
export const BLOG_API = `${BLOG_ORIGIN}/wp-json/wp/v2`;
export const BLOG_REVALIDATE = 600;
export const POSTS_PER_PAGE = 12;
/**
 * Posts on the first page of /blog: the featured post + 9 in the grid
 * (three full rows of three). Later pages show POSTS_PER_PAGE.
 */
export const BLOG_FIRST_PAGE_SIZE = 10;
const WORDS_PER_MINUTE = 200;

export type BlogImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Shown for posts without a featured image in WordPress (most older ones).
 * File: public/blog-capa-padrao.png — 1200×750, same 16:10 ratio as the cards.
 */
export const DEFAULT_POST_IMAGE: BlogImage = {
  src: "/blog-capa-padrao.png",
  alt: "",
  width: 1200,
  height: 750,
};

/** The post's featured image, or the blog's default cover. */
export function coverOf(post: { image: BlogImage | null }): BlogImage {
  return post.image ?? DEFAULT_POST_IMAGE;
}

export type BlogCategory = {
  id: number;
  name: string;
  slug: string;
  count: number;
};

export type BlogAuthor = {
  /** Display name from WordPress (via Yoast — /wp/v2/users is not public). */
  name: string;
  /** Biographical info from the WordPress profile, when filled in. */
  bio: string | null;
  /** The editorial team account ("Redação Digital"), not a person. */
  isTeam: boolean;
};

export type BlogPostSummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  /** Site-local publication date from WordPress (no offset) — for display. */
  date: string;
  /** Publication instant in UTC (ISO 8601 with Z) — for metadata / schema. */
  publishedAt: string;
  readingMinutes: number;
  category: BlogCategory | null;
  image: BlogImage | null;
  author: BlogAuthor | null;
};

export type TocItem = { id: string; text: string };

export type BlogPost = BlogPostSummary & {
  /** Site-local last-modified date — for display. */
  modified: string;
  /** Last-modified instant in UTC (ISO 8601 with Z). */
  modifiedAt: string;
  wordCount: number;
  description: string;
  /** WordPress HTML with an `id` on every <h2> (anchors for the TOC). */
  content: string;
  toc: TocItem[];
  tags: string[];
};

/** Which list a listing page shows — drives titles and pagination links. */
export type ListingScope =
  | { kind: "all" }
  | { kind: "category"; slug: string; name: string }
  | { kind: "search"; query: string };

type WpRendered = { rendered: string };

type WpPost = {
  id: number;
  slug: string;
  date: string;
  date_gmt: string;
  modified?: string;
  modified_gmt?: string;
  title: WpRendered;
  excerpt: WpRendered;
  content?: WpRendered;
  featured_media: number;
  categories: number[];
  tags?: number[];
  yoast_head_json?: {
    description?: string;
    author?: string;
    schema?: { "@graph"?: { "@type"?: string | string[]; name?: string; description?: string }[] };
  };
};

type WpMedia = {
  id: number;
  source_url: string;
  alt_text: string;
  media_details?: { width?: number; height?: number };
};

// `content` is only used to compute reading time; it is dropped after mapping.
const SUMMARY_FIELDS =
  "id,slug,date,date_gmt,title,excerpt,content,featured_media,categories,yoast_head_json.author";

/** WordPress account the agency uses for team-written posts. */
const TEAM_AUTHOR = /^reda[cç][aã]o\b/i;

function toAuthor(name: string | undefined, bio: string | null = null): BlogAuthor | null {
  const clean = name ? decodeEntities(name).trim() : "";
  if (!clean) return null;
  return { name: clean, bio, isTeam: TEAM_AUTHOR.test(clean) };
}

/** The author's bio from the Person node of the post's Yoast schema. */
function authorBio(post: WpPost) {
  const name = post.yoast_head_json?.author;
  const person = post.yoast_head_json?.schema?.["@graph"]?.find(
    (node) => [node["@type"]].flat().includes("Person") && node.name === name,
  );
  const bio = person?.description ? htmlToText(person.description) : "";
  return bio || null;
}

async function wpFetch<T>(
  path: string,
  params: Record<string, string | number>,
): Promise<{ data: T; total: number; totalPages: number } | null> {
  const url = new URL(`${BLOG_API}/${path}`);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, String(value));
  }

  const res = await fetch(url, {
    next: { revalidate: BLOG_REVALIDATE, tags: ["blog"] },
  });

  // WordPress answers 400 when the requested page is past the last one.
  if (res.status === 400 || res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`WordPress API ${res.status} em ${url.pathname}`);
  }

  return {
    data: (await res.json()) as T,
    total: Number(res.headers.get("x-wp-total") ?? 0),
    totalPages: Number(res.headers.get("x-wp-totalpages") ?? 1),
  };
}

/* ------------------------------------------------------------------ */
/* Text helpers                                                        */
/* ------------------------------------------------------------------ */

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  laquo: "«",
  raquo: "»",
};

export function decodeEntities(text: string) {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, code: string) => {
    if (code[0] === "#") {
      const n =
        code[1] === "x" || code[1] === "X"
          ? parseInt(code.slice(2), 16)
          : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : match;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

function htmlToText(html: string) {
  return decodeEntities(html.replace(/<[^>]*>/g, " "))
    .replace(/\[…\]|\[\.\.\.\]/g, "…")
    .replace(/\s+/g, " ")
    .trim();
}

function countWords(html: string) {
  return htmlToText(html).split(" ").filter(Boolean).length;
}

function readingMinutes(html: string) {
  return Math.max(1, Math.ceil(countWords(html) / WORDS_PER_MINUTE));
}

/** WordPress "*_gmt" fields have no offset; mark them as UTC. */
function gmtToIso(gmt: string | undefined, fallback: string) {
  return gmt ? `${gmt}Z` : fallback;
}

function slugify(text: string) {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Gives every <h2> an id and returns the table of contents built from them. */
function addHeadingAnchors(html: string): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const used = new Set<string>();

  const out = html.replace(
    /<h2(\s[^>]*)?>([\s\S]*?)<\/h2>/gi,
    (match, attrs: string | undefined, inner: string) => {
      const text = htmlToText(inner);
      if (!text) return match;

      const existing = attrs?.match(/\sid=["']([^"']+)["']/i)?.[1];
      let id = existing ?? (slugify(text) || "secao");
      if (!existing) {
        const base = id;
        for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
      }
      used.add(id);
      toc.push({ id, text });

      return existing ? match : `<h2 id="${id}"${attrs ?? ""}>${inner}</h2>`;
    },
  );

  return { html: out, toc };
}

const IMAGE_WIDTHS = [640, 828, 1200]; // subset of next/image deviceSizes
const CONTENT_IMAGE_SIZES = "(min-width: 768px) 680px, 100vw";

function optimizedImageUrl(src: string, width: number) {
  return `/_next/image?url=${encodeURIComponent(src)}&amp;w=${width}&amp;q=75`;
}

/**
 * Serves WordPress upload images through the Next.js image optimizer
 * (resized WebP with a srcset instead of full-size PNG/JPG) and lazy-loads
 * every image and embed below the fold.
 */
function optimizeMedia(html: string) {
  const withImages = html.replace(/<img\b([^>]*?)\/?>/gi, (match, attrs: string) => {
    const src = attrs.match(/\ssrc=["']([^"']+)["']/i)?.[1];
    let out = attrs
      .replace(/\s(srcset|sizes|loading|decoding)=["'][^"']*["']/gi, "")
      .trim();

    const optimizable =
      src?.startsWith(`${BLOG_ORIGIN}/wp-content/uploads/`) &&
      !/\.(svg|gif)(\?|$)/i.test(src);

    if (src && optimizable) {
      const decoded = decodeEntities(src);
      out = out.replace(
        /\ssrc=["'][^"']+["']/i,
        ` src="${optimizedImageUrl(decoded, 1200)}"`,
      );
      const srcset = IMAGE_WIDTHS.map(
        (w) => `${optimizedImageUrl(decoded, w)} ${w}w`,
      ).join(", ");
      out += ` srcset="${srcset}" sizes="${CONTENT_IMAGE_SIZES}"`;
    }

    return `<img ${out.replace(/^\s+/, "")} loading="lazy" decoding="async">`;
  });

  return withImages.replace(/<iframe\b(?![^>]*\sloading=)/gi, '<iframe loading="lazy"');
}

/** A post body has one title (the page's <h1>); demote stray <h1>s to <h2>. */
function demoteH1(html: string) {
  return html.replace(/<(\/?)h1(\s|>)/gi, "<$1h2$2");
}

const BLOG_HOST = new URL(BLOG_ORIGIN).host;

/** Path + hash of a link to the WordPress blog host, or null for any other link. */
function blogLinkTarget(href: string) {
  try {
    const url = new URL(decodeEntities(href));
    if (url.host.replace(/^www\./, "") !== BLOG_HOST) return null;
    return { path: url.pathname, hash: url.hash };
  } catch {
    return null; // relative or malformed — not ours to touch
  }
}

function pathSegments(path: string) {
  return path.split("/").filter(Boolean);
}

/** WordPress home, /blog/ and /blog/page/N/ — the post listing. */
function isBlogListingPath(path: string) {
  const segments = pathSegments(path);
  return (
    segments.length === 0 ||
    (segments[0] === "blog" &&
      (segments.length === 1 || (segments[1] === "page" && segments.length <= 3)))
  );
}

type LinkResolution = { slug: string } | "dead" | null;

/**
 * Asks WordPress what an unrecognised post URL is (cached for a day):
 * - 301 to a known post → that post (WordPress keeps old slugs redirecting);
 * - 404/410 → dead link;
 * - anything else (or a network error) → unknown, leave the link alone.
 */
async function resolveBlogLink(path: string, knownSlugs: Set<string>): Promise<LinkResolution> {
  try {
    const res = await fetch(`${BLOG_ORIGIN}${path}`, {
      redirect: "manual",
      signal: AbortSignal.timeout(4000),
      next: { revalidate: 86_400, tags: ["blog"] },
    });
    if (res.status === 404 || res.status === 410) return "dead";
    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      const slug = pathSegments(new URL(location, BLOG_ORIGIN).pathname).at(-1);
      if (slug && knownSlugs.has(slug)) return { slug };
    }
  } catch {
    // Network error or timeout.
  }
  return null;
}

const ANCHOR_PATTERN = /<a\b([^>]*)>([\s\S]*?)<\/a>/gi;
const HREF_PATTERN = /\shref=(["'])([^"']*)\1/i;

/**
 * Links in WordPress content point at the blog subdomain (which is noindex).
 * Repoint posts — including outdated URLs WordPress redirects — and the
 * listing to this site, so link equity and crawling stay on
 * agenciadigital.com.vc; unwrap links WordPress confirms are gone (404),
 * keeping their text.
 */
async function rewriteInternalLinks(html: string, knownSlugs: Set<string>) {
  const knownSlugOf = (path: string) => {
    const slug = pathSegments(path).at(-1);
    return slug && knownSlugs.has(slug) ? slug : null;
  };

  // 1. Find blog links that aren't obviously a post, listing or upload.
  const unknownPaths = new Set<string>();
  for (const [, attrs] of html.matchAll(ANCHOR_PATTERN)) {
    const href = attrs.match(HREF_PATTERN)?.[2];
    const target = href ? blogLinkTarget(href) : null;
    if (
      target &&
      pathSegments(target.path)[0] !== "wp-content" &&
      !knownSlugOf(target.path) &&
      !isBlogListingPath(target.path)
    ) {
      unknownPaths.add(target.path);
    }
  }

  // 2. Ask WordPress about those, in parallel.
  const resolutions = new Map<string, LinkResolution>();
  await Promise.all(
    [...unknownPaths].map(async (path) => {
      resolutions.set(path, await resolveBlogLink(path, knownSlugs));
    }),
  );

  // 3. Rewrite each anchor.
  return html.replace(ANCHOR_PATTERN, (anchor, attrs: string, inner: string) => {
    const href = attrs.match(HREF_PATTERN)?.[2];
    const target = href ? blogLinkTarget(href) : null;
    if (!target || pathSegments(target.path)[0] === "wp-content") return anchor;

    const resolution = resolutions.get(target.path);
    if (resolution === "dead") return inner;

    const slug =
      knownSlugOf(target.path) ??
      (resolution && typeof resolution === "object" ? resolution.slug : null);
    const newHref = slug
      ? `/blog/${slug}${target.hash}`
      : isBlogListingPath(target.path)
        ? "/blog"
        : null;
    if (!newHref) return anchor;

    return `<a${attrs.replace(HREF_PATTERN, ` href="${newHref}"`)}>${inner}</a>`;
  });
}

/** WordPress plugin forms (e.g. Contact Form 7) can't submit from this site. */
function stripForms(html: string) {
  return html.replace(/<form\b[\s\S]*?<\/form>/gi, "");
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

/** Categories that have posts, most used first. */
export async function getCategories(): Promise<BlogCategory[]> {
  const res = await wpFetch<BlogCategory[]>("categories", {
    per_page: 100,
    hide_empty: "true",
    orderby: "count",
    order: "desc",
    _fields: "id,name,slug,count",
  });
  return (res?.data ?? [])
    .filter((c) => c.slug !== "sem-categoria")
    .map((c) => ({ ...c, name: decodeEntities(c.name) }));
}

export async function getCategoryBySlug(slug: string) {
  const categories = await getCategories();
  return categories.find((c) => c.slug === slug) ?? null;
}

async function fetchMedia(ids: number[]) {
  const unique = [...new Set(ids.filter(Boolean))];
  const map = new Map<number, BlogImage>();
  if (unique.length === 0) return map;

  const res = await wpFetch<WpMedia[]>("media", {
    include: unique.join(","),
    per_page: 100,
    _fields: "id,source_url,alt_text,media_details",
  });
  for (const media of res?.data ?? []) {
    map.set(media.id, {
      src: media.source_url,
      alt: decodeEntities(media.alt_text ?? ""),
      width: media.media_details?.width ?? 1200,
      height: media.media_details?.height ?? 720,
    });
  }
  return map;
}

async function toSummaries(posts: WpPost[]): Promise<BlogPostSummary[]> {
  const [media, categories] = await Promise.all([
    fetchMedia(posts.map((p) => p.featured_media)),
    getCategories(),
  ]);
  const categoryById = new Map(categories.map((c) => [c.id, c]));

  return posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: htmlToText(post.title.rendered),
    excerpt: htmlToText(post.excerpt.rendered),
    date: post.date,
    publishedAt: gmtToIso(post.date_gmt, post.date),
    readingMinutes: readingMinutes(post.content?.rendered ?? ""),
    category:
      post.categories.map((id) => categoryById.get(id)).find(Boolean) ?? null,
    image: media.get(post.featured_media) ?? null,
    author: toAuthor(post.yoast_head_json?.author),
  }));
}

type GetPostsOptions = {
  page?: number;
  /**
   * How many posts page 1 shows (default POSTS_PER_PAGE). Later pages show
   * POSTS_PER_PAGE and are offset so nothing is skipped or repeated.
   */
  firstPageSize?: number;
  categoryId?: number;
  search?: string;
};

/** One page of posts, newest first. Returns null past the last page. */
export async function getPosts({
  page = 1,
  firstPageSize = POSTS_PER_PAGE,
  categoryId,
  search,
}: GetPostsOptions = {}) {
  const perPage = page === 1 ? firstPageSize : POSTS_PER_PAGE;
  const offset = page === 1 ? 0 : firstPageSize + (page - 2) * POSTS_PER_PAGE;

  const params: Record<string, string | number> = {
    per_page: perPage,
    offset,
    _fields: SUMMARY_FIELDS,
  };
  if (categoryId) params.categories = categoryId;
  if (search) params.search = search;

  const res = await wpFetch<WpPost[]>("posts", params);
  if (!res || (page > 1 && res.data.length === 0)) return null;

  const totalPages =
    res.total <= firstPageSize
      ? 1
      : 1 + Math.ceil((res.total - firstPageSize) / POSTS_PER_PAGE);

  return {
    posts: await toSummaries(res.data),
    total: res.total,
    totalPages,
  };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const res = await wpFetch<WpPost[]>("posts", {
    slug,
    _fields: `${SUMMARY_FIELDS},modified,modified_gmt,tags,yoast_head_json.description,yoast_head_json.schema`,
  });
  const post = res?.data[0];
  if (!post) return null;

  const tagIds = post.tags ?? [];
  const [[summary], tagsRes, allSlugs] = await Promise.all([
    toSummaries([post]),
    tagIds.length
      ? wpFetch<{ name: string }[]>("tags", {
          include: tagIds.join(","),
          per_page: 100,
          _fields: "name",
        })
      : Promise.resolve(null),
    getAllPostSlugs().catch(() => []),
  ]);

  const raw = post.content?.rendered ?? "";
  const knownSlugs = new Set(allSlugs.map((p) => p.slug));
  const { html, toc } = addHeadingAnchors(
    optimizeMedia(await rewriteInternalLinks(stripForms(demoteH1(raw)), knownSlugs)),
  );

  return {
    ...summary,
    author: toAuthor(post.yoast_head_json?.author, authorBio(post)),
    modified: post.modified ?? post.date,
    modifiedAt: gmtToIso(post.modified_gmt, summary.publishedAt),
    wordCount: countWords(raw),
    description: post.yoast_head_json?.description || summary.excerpt,
    content: html,
    toc,
    tags: (tagsRes?.data ?? []).map((t) => decodeEntities(t.name)),
  };
}

/** Up to 3 posts from the same category, topped up with the latest ones. */
export async function getRelatedPosts(post: BlogPostSummary, limit = 3) {
  const related: BlogPostSummary[] = [];

  if (post.category) {
    const res = await wpFetch<WpPost[]>("posts", {
      categories: post.category.id,
      exclude: post.id,
      per_page: limit,
      _fields: SUMMARY_FIELDS,
    });
    related.push(...(await toSummaries(res?.data ?? [])));
  }

  if (related.length < limit) {
    const res = await wpFetch<WpPost[]>("posts", {
      exclude: [post.id, ...related.map((p) => p.id)].join(","),
      per_page: limit - related.length,
      _fields: SUMMARY_FIELDS,
    });
    related.push(...(await toSummaries(res?.data ?? [])));
  }

  return related;
}

export type BlogIndexEntry = {
  slug: string;
  title: string;
  excerpt: string;
  category: string | null;
  author: string | null;
  publishedAt: string;
  modifiedAt: string;
};

/**
 * Lightweight list of every post, newest first (no body) — for the sitemap,
 * RSS feed, llms.txt and internal-link rewriting.
 */
export async function getPostIndex(): Promise<BlogIndexEntry[]> {
  type Row = Pick<
    WpPost,
    "slug" | "date" | "date_gmt" | "modified_gmt" | "title" | "excerpt" | "categories" | "yoast_head_json"
  >;
  const rows: Row[] = [];
  for (let page = 1; ; page++) {
    const res = await wpFetch<Row[]>("posts", {
      page,
      per_page: 100,
      _fields: "slug,date,date_gmt,modified_gmt,title,excerpt,categories,yoast_head_json.author",
    });
    if (!res) break;
    rows.push(...res.data);
    if (page >= res.totalPages) break;
  }

  const categoryById = new Map((await getCategories()).map((c) => [c.id, c.name]));
  return rows.map((row) => {
    const publishedAt = gmtToIso(row.date_gmt, row.date);
    return {
      slug: row.slug,
      title: htmlToText(row.title.rendered),
      excerpt: htmlToText(row.excerpt.rendered),
      category:
        row.categories.map((id) => categoryById.get(id)).find(Boolean) ?? null,
      author: toAuthor(row.yoast_head_json?.author)?.name ?? null,
      publishedAt,
      modifiedAt: gmtToIso(row.modified_gmt, publishedAt),
    };
  });
}

/** Every post's slug + last-modified instant. */
export async function getAllPostSlugs() {
  return (await getPostIndex()).map(({ slug, modifiedAt }) => ({ slug, modifiedAt }));
}

/* ------------------------------------------------------------------ */
/* Client-safe helpers                                                 */
/* ------------------------------------------------------------------ */

export function listingHref(scope: ListingScope, page = 1) {
  switch (scope.kind) {
    case "all":
      return page <= 1 ? "/blog" : `/blog/pagina/${page}`;
    case "category": {
      const base = `/blog/categoria/${scope.slug}`;
      return page <= 1 ? base : `${base}/pagina/${page}`;
    }
    case "search": {
      const q = `/blog/busca?q=${encodeURIComponent(scope.query)}`;
      return page <= 1 ? q : `${q}&pagina=${page}`;
    }
  }
}

// WordPress `date` is the site's local time with no offset. Only the calendar
// day matters here, so pin it to noon UTC to avoid shifting across midnight.
export function formatPostDate(iso: string, style: "long" | "short" = "long") {
  const date = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  if (style === "short") {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
      .format(date)
      .replace(/\./g, "")
      .replace(/ de /g, " ");
  }
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** "2" → 2; anything that isn't a plain positive integer → NaN. */
export function parsePageParam(value: string | undefined) {
  return value && /^\d+$/.test(value) ? Number(value) : NaN;
}
