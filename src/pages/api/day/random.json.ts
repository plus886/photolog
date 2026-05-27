import type { APIRoute } from "astro";
import { getAllDayPeeks } from "libs/client";
import { SSR_CACHE_CONTROL } from "libs/cache";

export const prerender = false;

// Day ページの Random ボタンが onMount で叩く。id と写真 URL のペアを
// 全件返し、クライアント側でランダムに 1 件選んで HTML と写真をプリ
// フェッチする。エッジで 30 分キャッシュされるので microCMS 側の負荷も
// 小さい。
export const GET: APIRoute = async () => {
  const res = await getAllDayPeeks();
  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": SSR_CACHE_CONTROL,
    },
  });
};
