<script lang="ts">
  // @ts-ignore
  import IconLeft from "~icons/material-symbols-light/arrow-left-rounded";
  import Thumbnail from "./Thumbnail.svelte";
  import { currentPage, cachedDays } from "libs/stores";
  import { onDestroy, onMount } from "svelte";
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

  const getYearFromSlug = (slug: string) => slug.slice(0, 4);

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

<div class="grid grid-cols-7 lg:grid-cols-11">
  <ul
    class="col-span-7 grid auto-rows-[4rem] grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-1 md:grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] lg:col-span-10"
  >
    {#each $cachedDays as item, i}
      {@const year = getYearFromSlug(item.slug)}
      {@const isLastItem = i === $cachedDays.length - 1}
      <li class="snap-end">
        <Thumbnail {...item} />
      </li>
      {#if isLastItem || (i < $cachedDays.length - 1 && year !== getYearFromSlug($cachedDays[i + 1].slug))}
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
