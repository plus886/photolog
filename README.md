# photolog

Photographs by 康凱爾, posted at <https://photo.kokaiji.tw> alongside a 31-syllable Japanese tanka and a Mandarin counterpart. Each entry is one photo plus two short poems; the site shows them side by side and remembers the language you picked.

This repository also serves as a reasonably complete reference for shipping an Astro 6 + Svelte 5 site on Cloudflare Workers with microCMS as the headless CMS.

## Live

<https://photo.kokaiji.tw>

## Stack

- **Astro 6** with the `@astrojs/cloudflare` adapter. Most pages are SSR (`prerender = false`) so that adding a photo in microCMS doesn't require a rebuild.
- **Svelte 5** runes for the client islands (gallery, day-page navigation, header drawer).
- **Tailwind 4** via `@tailwindcss/vite`. Project tokens (`--color-inky`, `--color-pale`, …) live in `src/styles/global.css` under `@theme`.
- **microCMS** as the content store, fetched via `microcms-js-sdk` in `src/libs/client.ts`.
- **Cloudflare Workers** for hosting. The Workers Paid plan is required because the dynamic OG card exceeds the Free plan's 10 ms CPU budget — see *Notable bits*.

## Content model (microCMS)

A single `days` endpoint with the following fields:

| Field         | Type     | Notes                                                  |
| ------------- | -------- | ------------------------------------------------------ |
| `image`       | media    | The photograph.                                        |
| `camera`      | text[]   | Camera model(s); shown in the caption.                 |
| `lens`        | text[]   | Lens(es); shown in the caption.                        |
| `featured`    | boolean  | Reserved; currently unused in the UI.                  |
| `passageJa`   | textArea | Japanese tanka (newlines preserved as written).        |
| `passageZh`   | textArea | Mandarin counterpart.                                  |
| `publishedAt` | built-in | Drives ordering and next/prev adjacency.               |

## Local development

```sh
cp .env.example .env       # fill in MICROCMS_DOMAIN and MICROCMS_API_KEY
npm install
npm run dev                # http://localhost:4321
```

Other scripts:

- `npm run build` — Astro build + Cloudflare adapter bundle.
- `npm run preview` — runs the built worker locally on `workerd`. Closer to production than `dev`; the real CPU/WASM behaviour shows here.
- `npm run deploy` — `astro build && wrangler deploy`.

## Notable bits

- **Bilingual routing.** `/...` is Japanese, `/zh/...` is Mandarin. On the prefix-less root the client routes to the saved-or-browser locale; `/zh/...` URLs are honoured as shared. Sitemap and `hreflang` alternates wire it up for crawlers. See `src/layouts/Layout.astro` and `src/i18n/`.
- **OG card per day.** `src/pages/og/[id].jpg.ts` renders a 1200×630 card at request time — the photo darkened with a semi-transparent mask, the passage centred in mincho. `workers-og` (Satori + resvg) handles the layout and `@cf-wasm/photon` transcodes the PNG output to a ~150 KB JPEG (under WhatsApp's 600 KB OG limit). Edge-cached for a day with `stale-while-revalidate` so a viral link doesn't keep re-rendering. The render itself lives in `src/libs/og.ts`.
- **Prefetched next / prev / random.** Day pages warm the HTML and full-size photo of their neighbours on mount (`src/components/Day/Day.svelte`), and pre-pick a random destination so the random button feels like a normal navigation rather than a fetch-then-go (`src/components/Day/Navigation.svelte`). The random-list endpoint returns `{ id, imageUrl }` pairs so the photo can be prefetched without a second round-trip.
- **Loading spinner = the favicon.** The 3×3 favicon shape is reused as the loading indicator — four cells fade in bottom-up to land on the favicon's lit state, then snap back and loop. `src/components/Spinner.svelte`. Used on the gallery's first paint and over the day-page photo while it's loading.
- **Edge caching.** SSR HTML is `s-maxage=1800`; the OG card is `s-maxage=86400, stale-while-revalidate=604800` because it's effectively immutable per day. Both constants live in `src/libs/cache.ts`.

## Deployment

Targets Cloudflare Workers. The Worker is on the Workers Paid plan (the OG card render exceeds the Free plan's 10 ms CPU-per-request budget; the limit isn't enforced by `workerd` locally, so `npm run preview` succeeds even when production would 1102). microCMS credentials are set as Worker secrets:

```sh
npx wrangler secret put MICROCMS_DOMAIN
npx wrangler secret put MICROCMS_API_KEY
```

## Credit

Photographs and poems © 康凱爾. The code is published for reference; if you reuse parts of it for your own site, please don't republish the photographs or passages.
