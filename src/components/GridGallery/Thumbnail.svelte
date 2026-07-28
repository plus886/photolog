<script lang="ts">
  import { lastShowedDayId } from "libs/stores";
  import type { DayCard } from "types/index";
  import type { Locale } from "i18n/utils";

  const {
    image,
    publishedAt,
    featured,
    id,
    localePrefix,
    locale,
    altJa,
    altZh,
    // DayCard, not Day: only what a thumbnail needs, so the location
    // archive's trimmed projection can render one too.
  }: DayCard & {
    localePrefix: string;
    locale: Locale;
  } = $props();

  // Falls back to the date for older entries that have no alt in the CMS.
  const alt = $derived(
    (locale === "zh" ? altZh : altJa) || publishedAt?.slice(0, 10) || "",
  );
  // Highlights the thumbnail the visitor last opened as a day page.
  // The scroll-back-into-view is handled in GridGallery on mount.
  let isLastShowedBySinglePage = $derived($lastShowedDayId === id);

  // Preload the full-size photo when the visitor is about to open the
  // day page (the page HTML itself is hover-prefetched by Astro), so
  // the morph transition lands on an already-loaded image.
  let detailPreloaded = false;
  const preloadDetailImage = () => {
    if (detailPreloaded) return;
    detailPreloaded = true;
    new Image().src = `${image.url}?w=1024`;
  };
</script>

<a
  href={`${localePrefix}/days/${id}`}
  class={{
    "relative transition-all": true,
    "col-span-2 row-span-2": featured,
  }}
  style={`view-transition-name: days_${id}_container`}
  onmouseenter={preloadDetailImage}
  onpointerdown={preloadDetailImage}
>
  <img
    src={`${image.url}?w=${featured ? 220 : 110}&h=${featured ? 140 : 70}&fit=crop&q=40`}
    {alt}
    loading="lazy"
    class={{
      "h-full w-full object-cover": true,
      "animate-pulse": isLastShowedBySinglePage,
    }}
  /></a
>

<style>
  img:hover {
    animation: pulse 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    50% {
      filter: sepia(80%) invert(10%);
      opacity: 0.8;
    }
  }
</style>
