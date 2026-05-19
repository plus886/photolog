/**
 * SSR ルート共通の Cache-Control。
 * - max-age=0     : ブラウザは毎回再検証し、常に最新の HTML を取得する。
 *                   古い HTML を出すと、再ビルド/デプロイで消えた旧ハッシュの
 *                   CSS/JS（/_astro/*）を参照して 404 → スタイル落ちになる。
 * - s-maxage=1800 : CDN(Cloudflare) では 30 分キャッシュ（SSR の負荷軽減）。
 *
 * stale-while-revalidate はブラウザにも効き、古い HTML を即返してしまうため
 * 使わない。反映を速めたい場合は s-maxage の値だけ調整する。
 */
export const SSR_CACHE_CONTROL = "public, max-age=0, s-maxage=1800";
