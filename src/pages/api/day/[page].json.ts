import type { APIRoute } from "astro";
import { getDays, DEFAULT_LIMIT } from "libs/client";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const currentPage = Number(params.page);
  const res = await getDays({
    offset: (currentPage - 1) * DEFAULT_LIMIT,
  });
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
};
