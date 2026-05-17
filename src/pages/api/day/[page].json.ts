import type { APIRoute } from "astro";
import { getDays, DEFAULT_LIMIT } from "libs/client";
import { SSR_CACHE_CONTROL } from "libs/cache";

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
      "Cache-Control": SSR_CACHE_CONTROL,
    },
  });
};
