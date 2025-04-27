<script lang="ts">
  import type { OptimizedDay } from "types/index";

  const { image, slug, featured, id }: OptimizedDay = $props();
</script>

<a
  href={`/days/${slug}`}
  class={{
    "relative transition-all": true,
    "col-span-2 row-span-2": featured,
  }}
  style={`view-transition-name: days_${id}_container`}
>
  <img
    src={`${image.url}?w=${featured ? 300 : 150}`}
    alt={slug}
    class={{
      "h-full w-full object-cover": true,
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
