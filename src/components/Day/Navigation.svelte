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
  import { prefetch } from "astro:prefetch";
  import hotkeys from "hotkeys-js";
  import type { DayProps } from "types/index";
  import type { DayPeek } from "libs/client";

  type Props = Pick<DayProps, "nextPost" | "prevPost" | "localePrefix"> & {
    currentId: string;
  };

  let { nextPost, prevPost, localePrefix, currentId }: Props = $props();
  let isRandomizing = $state(false);
  // onMount で 1 件決めて HTML と写真を温めておく。クリック時は
  // navigate() を呼ぶだけになり、Random ボタンが next/prev と同じ
  // ように即座に遷移する。
  let randomTargetId: string | null = null;
  let randomReady: Promise<string | null> | null = null;
  const nextId = nextPost && nextPost.id;
  const prevId = prevPost && prevPost.id;

  const prepareRandom = async (): Promise<string | null> => {
    try {
      const res = await fetch("/api/day/random.json");
      const peeks: DayPeek[] = await res.json();
      // 今いるページ自身は除外（選んでも遷移が起きず無反応に見える）。
      const pool = peeks.filter((p) => p.id !== currentId);
      if (pool.length === 0) return null;
      const pick = pool[Math.floor(Math.random() * pool.length)];
      // next/prev と同じ温め方：HTML と原寸近い写真の両方を先に取る。
      prefetch(`${localePrefix}/days/${pick.id}`);
      new Image().src = `${pick.imageUrl}?w=1024`;
      randomTargetId = pick.id;
      return pick.id;
    } catch {
      return null;
    }
  };

  onMount(() => {
    isRandomizing = false;
    randomReady = prepareRandom();
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
    // 事前準備が間に合っていればそれを使う。まだ in-flight なら待つ。
    // それでも取れなければ最終手段としてもう一度 fetch する。
    let target =
      randomTargetId ?? (randomReady ? await randomReady : null);
    if (!target) {
      try {
        const res = await fetch("/api/day/random.json");
        const peeks: DayPeek[] = await res.json();
        const pool = peeks.filter((p) => p.id !== currentId);
        target =
          pool[Math.floor(Math.random() * pool.length)]?.id ?? null;
      } catch {
        // give up
      }
    }
    if (!target) {
      isRandomizing = false;
      return;
    }
    navigate(`${localePrefix}/days/${target}`);
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
