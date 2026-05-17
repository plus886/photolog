import type { APIRoute } from "astro";
import { getAllDayIds } from "libs/client";
import { SSR_CACHE_CONTROL } from "libs/cache";

export const prerender = false;

export const GET: APIRoute = async () => {
  const res = await getAllDayIds();
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": SSR_CACHE_CONTROL,
    },
  });
};
