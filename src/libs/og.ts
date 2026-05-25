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

// Deterministic fit: size the text so the widest line fits the width box
// and all lines fit the height box, clamped to a tasteful range. The
// maxWidth/maxHeight + overflow:hidden on the text node is the safety net.
function fitFontSize(passage: string): number {
  const lines = passage.split("\n");
  const longest = Math.max(1, ...lines.map((l) => [...l].length));
  const byWidth = Math.floor(1000 / (longest * 1.08)); // CJK glyph ≈ 1em
  const byHeight = Math.floor(520 / (lines.length * 1.6));
  return Math.max(28, Math.min(72, byWidth, byHeight));
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
  const fontData = await loadGoogleFont({ family, text: passage || " ", weight: 400 });

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
    children.push({
      type: "div",
      props: {
        style: {
          maxWidth: 1000,
          maxHeight: 520,
          overflow: "hidden",
          color: "#ffffff",
          fontFamily: family,
          fontSize: fitFontSize(passage),
          lineHeight: 1.6,
          letterSpacing: 2,
          whiteSpace: "pre-wrap",
          textAlign: "center",
          textShadow: "0 2px 12px rgba(0, 0, 0, 0.6)",
        },
        children: passage,
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
