<script lang="ts">
  import { fade } from "svelte/transition";
  import { isDrawerOpen, isDayImageLoading } from "libs/stores";
  import type { Day } from "types/index";

  type Props = Pick<Day, "camera" | "lens"> & {
    place?: string;
    placeHref?: string;
  };

  let { camera, lens, place, placeHref }: Props = $props();

  const gear = $derived(
    `${camera}${lens && lens.length > 0 ? `, ${lens}` : ""}`,
  );
</script>

<!-- svelte-ignore a11y_figcaption_parent -->
{#if !$isDrawerOpen}
  <figcaption
    class={{
      "font-leica flex justify-between gap-3 pt-3 text-[0.42rem]": true,
      "opacity-0": $isDayImageLoading,
    }}
    in:fade={{ delay: 600, duration: 500 }}
    out:fade={{ duration: 200 }}
  >
    <!-- Doubles as the way into the location archive; without it those
         pages are reachable only from the sitemap. -->
    <span>
      {#if place && placeHref}
        <a href={placeHref}>{place}</a>
      {:else if place}
        {place}
      {/if}
    </span>
    <span>{gear}</span>
  </figcaption>
{/if}
