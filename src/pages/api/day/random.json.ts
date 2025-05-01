import type { APIRoute } from "astro";
import { getAllDayIds } from "libs/client";

export const GET: APIRoute = async () => {
  const res = await getAllDayIds();
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export function getStaticPaths() {
  return [{ params: {} }];
}
