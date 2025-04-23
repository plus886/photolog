<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import IconLeft from "~icons/material-symbols-light/chevron-left-rounded";
  import IconRight from "~icons/material-symbols-light/chevron-right-rounded";
  import IconGrid from "~icons/material-symbols-light/grid-view";
  import { isDrawerOpen } from "../libs/stores";

  import { navigate } from "astro:transitions/client";
  import hotkeys from "hotkeys-js";

  interface Props {
    nextSlug?: string;
    prevSlug?: string;
  }

  const { nextSlug, prevSlug }: Props = $props();

  onMount(() => {
    hotkeys("left", () => {
      if (!nextSlug) return;
      navigate(`/days/${nextSlug}`);
    });

    hotkeys("right", () => {
      if (!prevSlug) return;
      navigate(`/days/${prevSlug}`);
    });

    hotkeys("space, backspace, delete", () => {
      navigate(`/`);
    });
  });

  onDestroy(() => {
    hotkeys.unbind();
  });
</script>

{#if !$isDrawerOpen}
  <div
    class="flex items-center justify-center gap-6 self-end-safe md:flex-col md:items-start md:justify-start"
    in:fade={{ delay: 500, duration: 500 }}
    out:fade={{ duration: 200 }}
  >
    <a href={nextSlug ? `/days/${nextSlug}` : ""}>
      <button
        class={{
          "flex cursor-pointer justify-center p-2 transition-all hover:scale-130": true,
          "pointer-events-none opacity-20": !nextSlug,
        }}
      >
        <IconLeft class="text-xl" />
      </button>
    </a>
    <a href="/">
      <button
        class="flex cursor-pointer justify-center p-2 transition-all hover:scale-130"
      >
        <IconGrid class="text-xl" />
      </button>
    </a>
    <a href={prevSlug ? `/days/${prevSlug}` : ""}>
      <button
        class={{
          "flex cursor-pointer justify-center p-2 transition-all hover:scale-130": true,
          "pointer-events-none opacity-20": !prevSlug,
        }}
      >
        <IconRight class="text-xl" />
      </button>
    </a>
  </div>
{/if}
