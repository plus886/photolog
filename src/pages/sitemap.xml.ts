import type { APIRoute } from "astro";
import { getAllDayIds } from "libs/client";
import { SSR_CACHE_CONTROL } from "libs/cache";

export const prerender = false;

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL("https://photo.kokaiji.tw")).origin;
  const ids = await getAllDayIds();

  const paths = ["/", ...ids.map((id) => `/days/${id}`)];
  const urls = [
    ...paths.map((p) => `${base}${p}`),
    ...paths.map((p) => `${base}/zh${p}`),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `  <url><loc>${loc}</loc></url>`).join("\n")}
</urlset>`;

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": SSR_CACHE_CONTROL,
    },
  });
};
