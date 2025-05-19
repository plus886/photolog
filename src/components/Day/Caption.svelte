<script lang="ts">
  import { fade } from "svelte/transition";
  import { isDrawerOpen, isDayImageLoading } from "libs/stores";
  import type { OptimizedDay } from "types/index";

  type Props = Pick<OptimizedDay, "camera" | "lens">;

  let { camera, lens }: Props = $props();
</script>

<!-- svelte-ignore a11y_figcaption_parent -->
{#if !$isDrawerOpen}
  <figcaption
    class={{
      "font-leica flex justify-end pt-3 text-[0.42rem]": true,
      "opacity-0": $isDayImageLoading,
    }}
    in:fade={{ delay: 600, duration: 500 }}
    out:fade={{ duration: 200 }}
  >
    {`${camera}${lens && lens.length > 0 ? `, ${lens}` : ""}`}
  </figcaption>
{/if}
