import type { APIRoute } from "astro";
import { getAllDaySummaries, getLocationSummaries } from "libs/client";
import { isPrivateLocation } from "libs/location";
import { SSR_CACHE_CONTROL } from "libs/cache";

export const prerender = false;

const escapeXml = (s: string) =>
  s.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c]!,
  );

type Entry = { loc: string; lastmod?: string; image?: string };

const renderUrl = ({ loc, lastmod, image }: Entry) =>
  [
    "  <url>",
    `    <loc>${escapeXml(loc)}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    // Only image:loc — Google dropped support for image:title / image:caption
    // / image:license in 2022, so the alt text earns its keep in the page
    // markup rather than here.
    ...(image
      ? [
          "    <image:image>",
          `      <image:loc>${escapeXml(image)}</image:loc>`,
          "    </image:image>",
        ]
      : []),
    "  </url>",
  ].join("\n");

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL("https://photo.kokaiji.tw")).origin;
  const [days, locations] = await Promise.all([
    getAllDaySummaries(),
    getLocationSummaries(),
  ]);
  const publicLocations = locations.filter(
    (l) => !isPrivateLocation(l.location),
  );

  const entries: Entry[] = [];
  for (const prefix of ["", "/zh"]) {
    entries.push({ loc: `${base}${prefix}/` });
    for (const { location, cover } of publicLocations) {
      entries.push({
        loc: `${base}${prefix}/locations/${location.id}`,
        image: `${cover.url}?w=1024`,
      });
    }
    for (const day of days) {
      entries.push({
        loc: `${base}${prefix}/days/${day.id}`,
        lastmod: (day.revisedAt ?? day.publishedAt)?.slice(0, 10),
        // The same resized file the page renders, so the crawler doesn't
        // treat the original and the displayed image as two.
        image: `${day.image.url}?w=1024`,
      });
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.map(renderUrl).join("\n")}
</urlset>`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": SSR_CACHE_CONTROL,
    },
  });
};
