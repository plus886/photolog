import type { APIRoute } from "astro";
import { getDays, DEFAULT_LIMIT, getAllDayIds } from "libs/client";

export const GET: APIRoute = async ({ params }) => {
  console.warn(params);
  const currentPage = Number(params.page);
  const res = await getDays({
    offset: (currentPage - 1) * DEFAULT_LIMIT,
  });
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};

export const getStaticPaths = async () => {
  const response = await getAllDayIds();
  const totalPages = Math.ceil(response.length / DEFAULT_LIMIT);

  return Array.from(Array(totalPages), (e, i) => {
    return {
      params: {
        page: i + 1,
      },
    };
  });
};
