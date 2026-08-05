import { ImageResponse, loadGoogleFont } from "workers-og";
import { PhotonImage } from "@cf-wasm/photon";

const W = 1200;
const H = 630;
// JPEG quality for the final card. Photographic backgrounds make a PNG
// huge (>900KB); JPEG keeps it well under WhatsApp's 600KB OG limit.
const JPEG_QUALITY = 82;

// OG card fonts mirror the on-site passage faces (ja = Hina Mincho,
// zh = Cactus Classical Serif); both are on Google Fonts.
const FONT_FAMILY: Record<"ja" | "zh", string> = {
  ja: "Hina Mincho",
  zh: "Cactus Classical Serif",
};

const LINE_HEIGHT = 1.6;

// Deterministic fit: size the text so the widest line fits the width box
// and all lines fit the height box, clamped to a tasteful range. The
// maxWidth/maxHeight + overflow:hidden on the text node is the safety net.
function fitFontSize(passage: string): number {
  const lines = passage.split("\n");
  const longest = Math.max(1, ...lines.map((l) => [...l].length));
  const byWidth = Math.floor(1000 / (longest * 1.08)); // CJK glyph ≈ 1em
  const byHeight = Math.floor(520 / (lines.length * LINE_HEIGHT));
  return Math.max(28, Math.min(72, byWidth, byHeight));
}

// The passages use U+3000 (ideographic space) as a caesura, but Google
// Fonts' subsetter drops it from every `text=` subset — it substitutes
// U+0020 — so Satori finds no glyph and draws .notdef (tofu). No
// substitute character works for both faces either: Cactus Classical Serif
// carries U+2003 EM SPACE, Hina Mincho doesn't. So the gap is laid out
// rather than typeset — an empty 1em box, exactly the width U+3000 would
// have had, in any font.
const IDEOGRAPHIC_SPACE = "　";

function lineChildren(line: string, fontSize: number): unknown[] {
  const children: unknown[] = [];
  line.split(IDEOGRAPHIC_SPACE).forEach((part, i) => {
    if (i > 0)
      children.push({
        type: "div",
        props: { style: { width: fontSize, flexShrink: 0 } },
      });
    if (part)
      children.push({
        type: "div",
        props: { style: { whiteSpace: "pre" }, children: part },
      });
  });
  return children;
}

/**
 * Renders the day's OG card: the photo darkened by a black mask, with the
 * passage centred in white mincho. Returns JPEG bytes (Satori → PNG via
 * resvg, then transcoded to JPEG so the photographic card stays small).
 */
export async function renderOgImage({
  photoUrl,
  passage,
  lang,
}: {
  photoUrl: string;
  passage: string;
  lang: "ja" | "zh";
}): Promise<Uint8Array<ArrayBuffer>> {
  const family = FONT_FAMILY[lang];
  // Fetch a glyph subset of the family for exactly this text (TTF, since
  // Satori can't parse woff2 — loadGoogleFont sends a compatible UA).
  const fontData = await loadGoogleFont({
    family,
    // U+3000 is drawn as layout, not as a glyph, so it isn't part of the
    // subset we need (the subsetter drops it regardless).
    text: passage.split(IDEOGRAPHIC_SPACE).join("") || " ",
    weight: 400,
  });

  const children: unknown[] = [
    {
      type: "img",
      props: {
        src: `${photoUrl}?w=${W}&h=${H}&fit=crop`,
        width: W,
        height: H,
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: W,
          height: H,
          objectFit: "cover",
        },
      },
    },
    {
      type: "div",
      props: {
        style: {
          position: "absolute",
          top: 0,
          left: 0,
          width: W,
          height: H,
          backgroundColor: "rgba(0, 0, 0, 0.45)",
        },
      },
    },
  ];

  if (passage) {
    const fontSize = fitFontSize(passage);
    children.push({
      type: "div",
      props: {
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          maxWidth: 1000,
          maxHeight: 520,
          overflow: "hidden",
          color: "#ffffff",
          fontFamily: family,
          fontSize,
          letterSpacing: 2,
          textShadow: "0 2px 12px rgba(0, 0, 0, 0.6)",
        },
        children: passage.split("\n").map((line) => ({
          type: "div",
          props: {
            // Explicit row height so a blank line still takes one up.
            // Unrounded, to keep the exact line spacing lineHeight gave.
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: fontSize * LINE_HEIGHT,
            },
            children: lineChildren(line, fontSize),
          },
        })),
      },
    });
  }

  const tree = {
    type: "div",
    props: {
      style: {
        display: "flex",
        position: "relative",
        width: W,
        height: H,
        alignItems: "center",
        justifyContent: "center",
      },
      children,
    },
  };

  const res = new ImageResponse(tree as never, {
    width: W,
    height: H,
    fonts: [{ name: family, data: fontData, weight: 400, style: "normal" }],
  });
  const png = new Uint8Array(await res.arrayBuffer());

  const img = PhotonImage.new_from_byteslice(png);
  try {
    // Copy out of WASM memory before free(); the copy is also backed by a
    // plain ArrayBuffer, which Response's BodyInit accepts.
    return new Uint8Array(img.get_bytes_jpeg(JPEG_QUALITY));
  } finally {
    img.free();
  }
}
