import type { APIRoute } from "astro";
import { getAllDayIds } from "libs/client";

export const prerender = false;

export const GET: APIRoute = async () => {
  const res = await getAllDayIds();
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
};
