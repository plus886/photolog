<script lang="ts">
  import { lastShowedDayId, lenisStore } from "libs/stores";
  import type { Action } from "svelte/action";
  import type { Day } from "types/index";

  const { image, date, featured, id }: Day = $props();
  let isLastShowedBySinglePage = $derived($lastShowedDayId === id);

  const handleScroll: Action<HTMLElement> = (e) => {
    if (!isLastShowedBySinglePage) return;
    // Lenis (when active) owns the scroll position, so a native
    // scrollIntoView would be overridden on its next frame.
    const lenis = lenisStore.get();
    if (lenis) {
      const wrapper = document.getElementById("scroll-container");
      const offset = wrapper ? -(wrapper.clientHeight - e.offsetHeight) / 2 : 0;
      lenis.scrollTo(e, { offset });
    } else {
      e.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }
  };
</script>

<a
  href={`/days/${id}`}
  class={{
    "relative transition-all": true,
    "col-span-2 row-span-2": featured,
  }}
  style={`view-transition-name: days_${id}_container`}
  use:handleScroll
>
  <img
    src={`${image.url}?w=${featured ? 220 : 110}&h=${featured ? 140 : 70}&fit=crop&q=40`}
    alt={date}
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
