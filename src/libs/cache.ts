/**
 * SSR ルート共通の Cache-Control。
 * - max-age=0           : ブラウザは毎回再検証
 * - s-maxage=3600       : CDN(Cloudflare) で 1 時間キャッシュ
 * - stale-while-revalidate=86400 : 失効後 1 日は古い内容を返しつつ裏で更新
 *
 * 反映を速めたい場合は s-maxage の値だけ調整する。
 */
export const SSR_CACHE_CONTROL =
  "public, max-age=0, s-maxage=1800, stale-while-revalidate=86400";
