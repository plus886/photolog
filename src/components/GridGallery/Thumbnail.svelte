<script lang="ts">
  import { lastShowedDayId } from "libs/stores";
  import type { Action } from "svelte/action";
  import type { OptimizedDay } from "types/index";

  const { image, slug, featured, id }: OptimizedDay = $props();
  let isLoading = $state(false);
  let isLastShowedBySinglePage = $derived($lastShowedDayId === id);

  const onload: Action<HTMLImageElement> = (e) => {
    const handleImageLoad = () => {
      isLoading = false;
      e.removeEventListener("load", handleImageLoad);
    };
    isLoading = true;
    if (e.complete) {
      isLoading = false;
      return;
    }
    e.addEventListener("load", handleImageLoad);
  };

  const handleScroll: Action<HTMLElement> = (e) => {
    if (!isLastShowedBySinglePage) return;
    e.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "nearest",
    });
  };
</script>

<a
  href={`/days/${slug}`}
  class={{
    "relative transition-all": true,
    "col-span-2 row-span-2": featured,
  }}
  style={`view-transition-name: days_${id}_container`}
  use:handleScroll
>
  <img
    src={`${image.url}?w=${featured ? 300 : 150}&q=40`}
    alt={slug}
    class={{
      "h-full w-full object-cover transition-opacity duration-700": true,
      "opacity-0": isLoading,
      "animate-pulse": isLastShowedBySinglePage,
    }}
    use:onload
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
