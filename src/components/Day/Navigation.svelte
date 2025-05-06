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

  type Props = Pick<DayProps, "nextPost" | "prevPost">;

  let { nextPost, prevPost }: Props = $props();
  let isRandomizing = $state(false);
  const nextSlug = nextPost && nextPost.slug;
  const prevSlug = prevPost && prevPost.slug;

  onMount(() => {
    isRandomizing = false;
    hotkeys("left", () => {
      if (!nextSlug) return;
      if ($isDrawerOpen) return;
      navigate(`/days/${nextSlug}`);
    });
    hotkeys("right", () => {
      if (!prevSlug) return;
      if ($isDrawerOpen) return;
      navigate(`/days/${prevSlug}`);
    });
    hotkeys("space", () => {
      if (isRandomizing) return;
      if ($isDrawerOpen) return;
      randomize();
    });
    hotkeys("backspace, delete, esc", () => {
      if ($isDrawerOpen) return;
      navigate(`/`);
    });
  });

  onDestroy(() => {
    hotkeys.unbind();
  });

  const randomize = async () => {
    isRandomizing = true;
    const res = await fetch("/api/day/random.json");
    const slugs: string[] = await res.json();
    navigate(`/days/${slugs[Math.floor(Math.random() * slugs.length)]}`);
  };
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
          "hover:animate-bounce-left flex cursor-pointer justify-center p-2 transition-all hover:scale-130": true,
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
    <a href={prevSlug ? `/days/${prevSlug}` : ""}>
      <button
        class={{
          "hover:animate-bounce-right flex cursor-pointer justify-center p-2 transition-all hover:scale-130": true,
          "pointer-events-none opacity-20": !prevSlug,
        }}
      >
        <IconRight class="text-xl" />
      </button>
    </a>
  </div>
{/if}
