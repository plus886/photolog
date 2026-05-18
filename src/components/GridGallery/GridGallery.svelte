<script lang="ts">
  // @ts-ignore
  import IconLeft from "~icons/material-symbols-light/arrow-left-rounded";
  import Thumbnail from "./Thumbnail.svelte";
  import { currentPage, cachedDays } from "libs/stores";
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { createObserver } from "libs/intersectionObserver";
  import type { GetDays, GridGalleryProps } from "types/index";
  import type { Action } from "svelte/action";

  const { totalPages }: GridGalleryProps = $props();
  let isInitialLoad = $derived($cachedDays.length === 0);

  const fetchItems = async (page: number): Promise<void> => {
    const res = await fetch(`/api/day/${page}.json`);
    const body: GetDays = await res.json();
    cachedDays.set([...$cachedDays, ...body.contents]);
  };

  const getYearFromDate = (date: string) => date.slice(0, 4);

  const unbindListener = currentPage.listen((v) => {
    fetchItems(v);
  });

  const getNextPage = () => {
    if ($currentPage >= totalPages) return;
    currentPage.set($currentPage + 1);
  };

  const handlePaginationOnScroll: Action<HTMLElement, boolean> = (
    e,
    shouldTrigger,
  ) => {
    if (!shouldTrigger) return;
    const observer = createObserver(getNextPage);
    observer.observe(e);
  };

  onMount(() => {
    if (!isInitialLoad) return;
    fetchItems($currentPage);
  });

  onDestroy(() => {
    unbindListener();
  });
</script>

{#if isInitialLoad}
  <!-- Covers the screen from first paint until the grid data is ready. -->
  <div
    class="dark:bg-inky fixed inset-0 z-50 flex items-center justify-center bg-white"
    out:fade={{ duration: 400 }}
  >
    <div class="spinner"></div>
  </div>
{/if}

<div class="grid grid-cols-7 lg:grid-cols-11">
  <ul
    class="col-span-7 grid auto-rows-[4rem] grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-1 md:grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] lg:col-span-10"
  >
    {#each $cachedDays as item, i}
      {@const year = getYearFromDate(item.date)}
      {@const isLastItem = i === $cachedDays.length - 1}
      <!-- Per-item random delay (a {@const}, so it is evaluated once per
           row rather than hoisted) gives a staggered fade-in. -->
      {@const fadeDelay = Math.random() * 1200}
      <li in:fade={{ delay: fadeDelay, duration: 500 }}>
        <Thumbnail {...item} />
      </li>
      {#if isLastItem || (i < $cachedDays.length - 1 && year !== getYearFromDate($cachedDays[i + 1].date))}
        <li
          class="bg-pale-accent dark:bg-inky-accent dark:text-pale flex items-center justify-center text-stone-700 transition-colors delay-150 duration-500"
          use:handlePaginationOnScroll={isLastItem}
        >
          <IconLeft class="animate-ping" />
          <p class="font-leica text-[0.6rem]">{year}</p>
        </li>
      {/if}
    {/each}
  </ul>
</div>

<style>
  /* Gradient-ring spinner: the transparent border reveals the border-box
     gradient; the padding-box layer (--fill = the loader background) masks
     the gradient inside, leaving just the ring. */
  .spinner {
    --fill: #ffffff;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    border: 2px solid transparent;
    background:
      linear-gradient(var(--fill), var(--fill)) padding-box,
      linear-gradient(45deg, #e4e4e7, #3f3f46) border-box;
    animation: spinner-spin 1.2s linear infinite;
  }

  :global(.dark) .spinner {
    --fill: var(--color-inky);
  }

  @keyframes spinner-spin {
    to {
      transform: rotate(360deg);
    }
  }
</style>
