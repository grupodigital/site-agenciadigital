import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — ${SITE.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PRIMARY = "#143c68";
const SECONDARY = "#f5a201";

type Font = {
  name: string;
  data: ArrayBuffer;
  weight: 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;
  style: "normal" | "italic";
};

// Satori (engine behind ImageResponse) doesn't support variable TTF files.
// We load a static weight of Outfit from Google Fonts CDN at request time.
async function loadGoogleFont(family: string, weight: number) {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}&display=swap`;
    const css = await fetch(cssUrl, {
      headers: { "User-Agent": "Mozilla/5.0" },
    }).then((r) => r.text());
    const match = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype|woff2?)'\)/);
    if (!match) return null;
    const fontRes = await fetch(match[1]);
    if (!fontRes.ok) return null;
    return await fontRes.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const [regular, bold] = await Promise.all([
    loadGoogleFont("Outfit", 400),
    loadGoogleFont("Outfit", 700),
  ]);

  const fonts = [
    regular && { name: "Outfit", data: regular, style: "normal", weight: 400 },
    bold && { name: "Outfit", data: bold, style: "normal", weight: 700 },
  ].filter(Boolean) as Font[];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: PRIMARY,
          color: "#ffffff",
          padding: "72px",
          fontFamily: fonts.length ? "Outfit" : undefined,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 26,
            letterSpacing: "4px",
            textTransform: "uppercase",
            color: SECONDARY,
          }}
        >
          <div style={{ width: 56, height: 4, background: SECONDARY }} />
          <span>Agência Digital</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
          <div
            style={{
              fontSize: 112,
              fontWeight: 700,
              lineHeight: 1.02,
              letterSpacing: "-2px",
            }}
          >
            {SITE.name}
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 400,
              lineHeight: 1.25,
              maxWidth: 880,
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {SITE.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <span>{SITE.url.replace(/^https?:\/\//, "")}</span>
        </div>
      </div>
    ),
    {
      ...size,
      ...(fonts.length ? { fonts } : {}),
    },
  );
}
