<script lang="ts">
  import { fade } from "svelte/transition";
  import { isDrawerOpen } from "../../libs/stores";
  import type { Day } from "../../libs/client";

  interface Props {
    camera: Day["camera"];
    lens?: Day["lens"];
  }

  const { camera, lens }: Props = $props();
</script>

<!-- svelte-ignore a11y_figcaption_parent -->
{#if !$isDrawerOpen}
  <figcaption
    class="font-leica flex justify-end pt-3 text-[0.5rem]"
    in:fade={{ delay: 600, duration: 500 }}
    out:fade={{ duration: 200 }}
  >
    {`${camera}${lens && lens.length > 0 ? `, ${lens}` : ""}`}
  </figcaption>
{/if}
