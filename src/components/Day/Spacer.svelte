<script lang="ts">
  import { fade } from "svelte/transition";
  import { isDrawerOpen } from "libs/stores";
</script>

{#if !$isDrawerOpen}
  <p
    class="font-leica pb-3 text-[7px]"
    in:fade={{ delay: 600, duration: 500 }}
    out:fade={{ duration: 200 }}
  >
    &nbsp;
  </p>
{/if}
