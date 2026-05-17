import type { APIRoute } from "astro";
import { getAllDayIds } from "libs/client";

export const prerender = false;

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL("https://photo.kokaiji.tw")).origin;
  const slugs = await getAllDayIds();

  const urls = [
    `${base}/`,
    ...slugs.map((slug) => `${base}/days/${slug}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
};
