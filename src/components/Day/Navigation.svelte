<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  // @ts-ignore
  import IconLeft from "~icons/material-symbols-light/chevron-left-rounded";
  // @ts-ignore
  import IconRight from "~icons/material-symbols-light/chevron-right-rounded";
  // @ts-ignore
  import IconGrid from "~icons/material-symbols-light/grid-view";
  // @ts-ignore
  import IconReload from "~icons/material-symbols-light/autorenew-rounded";
  import { isDrawerOpen } from "libs/stores";
  import { navigate } from "astro:transitions/client";
  import hotkeys from "hotkeys-js";
  import type { DayProps } from "types/index";

  type Props = Pick<DayProps, "nextPost" | "prevPost" | "localePrefix">;

  let { nextPost, prevPost, localePrefix }: Props = $props();
  let isRandomizing = $state(false);
  const nextId = nextPost && nextPost.id;
  const prevId = prevPost && prevPost.id;

  onMount(() => {
    isRandomizing = false;
    hotkeys("left", () => {
      if (!nextId) return;
      navigate(`${localePrefix}/days/${nextId}`);
    });
    hotkeys("right", () => {
      if (!prevId) return;
      navigate(`${localePrefix}/days/${prevId}`);
    });
    hotkeys("space", () => {
      if (isRandomizing) return;
      randomize();
    });
    hotkeys("backspace, delete, esc", () => {
      navigate(`${localePrefix}/`);
    });
  });

  onDestroy(() => {
    hotkeys.unbind();
  });

  const randomize = async () => {
    isRandomizing = true;
    const res = await fetch("/api/day/random.json");
    const ids: string[] = await res.json();
    navigate(
      `${localePrefix}/days/${ids[Math.floor(Math.random() * ids.length)]}`,
    );
  };
</script>

{#if !$isDrawerOpen}
  <div
    class="flex items-center justify-center gap-6 self-end-safe md:flex-col md:items-start md:justify-start"
    in:fade={{ delay: 500, duration: 500 }}
    out:fade={{ duration: 200 }}
  >
    <a href={nextId ? `${localePrefix}/days/${nextId}` : ""}>
      <button
        class={{
          "hover:animate-bounce-left flex cursor-pointer justify-center p-2 transition-all hover:scale-130": true,
          "pointer-events-none opacity-20": !nextId,
        }}
      >
        <IconLeft class="text-xl" />
      </button>
    </a>
    <a href={`${localePrefix}/`}>
      <button
        class="flex cursor-pointer justify-center p-2 transition-all hover:scale-130"
      >
        <IconGrid class="text-xl" />
      </button>
    </a>
    <button
      class={{
        "flex justify-center p-2 transition-all hover:scale-130": true,
        "animate-spin opacity-60": isRandomizing,
        "cursor-pointer": !isRandomizing,
      }}
      onclick={randomize}
      disabled={isRandomizing}
    >
      <IconReload class="text-xl" />
    </button>
    <a href={prevId ? `${localePrefix}/days/${prevId}` : ""}>
      <button
        class={{
          "hover:animate-bounce-right flex cursor-pointer justify-center p-2 transition-all hover:scale-130": true,
          "pointer-events-none opacity-20": !prevId,
        }}
      >
        <IconRight class="text-xl" />
      </button>
    </a>
  </div>
{/if}
