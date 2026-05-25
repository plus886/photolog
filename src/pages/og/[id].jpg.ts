import type { APIRoute } from "astro";
import { getDayDetail } from "libs/client";
import { SSR_CACHE_CONTROL } from "libs/cache";
import { renderOgImage } from "libs/og";

export const prerender = false;

// Dynamic OG card for a day page: the photo darkened, with the passage
// in white mincho. `?lang=zh` selects the Chinese passage/font.
export const GET: APIRoute = async ({ params, url }) => {
  const id = params.id;
  if (!id) return new Response(null, { status: 404, statusText: "Not Found" });

  const item = await getDayDetail(id).catch(() => null);
  if (!item) return new Response(null, { status: 404, statusText: "Not Found" });

  const lang = url.searchParams.get("lang") === "zh" ? "zh" : "ja";
  const passage = (lang === "zh" ? item.passageZh : item.passageJa) ?? "";
  const photoUrl = item.image.url;

  try {
    const jpeg = await renderOgImage({ photoUrl, passage, lang });
    return new Response(jpeg, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": SSR_CACHE_CONTROL,
      },
    });
  } catch {
    // Never break the card: fall back to the plain (resized) photo.
    return Response.redirect(`${photoUrl}?w=1200&h=630&fit=crop`, 302);
  }
};
