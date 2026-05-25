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

/**
 * 動的 OG 画像専用の Cache-Control。
 * OG カードは公開後ほぼ不変のバイナリ（写真＋Passage）で、HTML と違い
 * 消えたアセットハッシュを参照する心配がないため、長めにキャッシュして
 * 実行時レンダリング（Cloudflare Workers の CPU 課金対象）の回数を抑える。
 * バズなどで取得が集中しても、ほとんどがエッジキャッシュHITで Worker は
 * 起動しない。
 *
 * - s-maxage=86400            : CDN(Cloudflare) で 1 日フレッシュ。
 * - stale-while-revalidate=7d : 期限切れ後も最大 7 日は即座に旧カードを返し、
 *                               裏で 1 回だけ再生成（ブロッキングなレンダリングを
 *                               避ける。Cloudflare が SWR 非対応でも、その場合は
 *                               単に期限切れ時に 1 回ミス→再生成するだけで無害）。
 */
export const OG_CACHE_CONTROL =
  "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800";
