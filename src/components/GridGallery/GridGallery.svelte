<script lang="ts">
  // @ts-ignore
  import IconLeft from "~icons/material-symbols-light/arrow-left-rounded";
  import Thumbnail from "./Thumbnail.svelte";
  import { currentPage, cachedDays } from "libs/stores";
  import type { GetDays, GridGalleryProps } from "types/index";
  import { onDestroy, onMount } from "svelte";

  const { totalPages }: GridGalleryProps = $props();
  let isInitialLoad = $derived($cachedDays.length === 0);

  const fetchItems = async (page: number): Promise<GetDays> => {
    const res = await fetch(`/api/day/${page}.json`);
    const body: GetDays = await res.json();
    cachedDays.set([...$cachedDays, ...body.contents]);
    return body;
  };

  const unbindListener = currentPage.listen((v) => {
    fetchItems(v);
  });

  onMount(() => {
    if (!isInitialLoad) return;
    fetchItems($currentPage);
  });

  onDestroy(() => {
    unbindListener();
  });

  const getNextPage = () => {
    if ($currentPage < totalPages) {
      currentPage.set($currentPage + 1);
    }
  };

  const getYearFromSlug = (slug: string) => slug.slice(0, 4);
</script>

<div class="grid grid-cols-7 lg:grid-cols-11">
  <ul
    class="col-span-7 grid auto-rows-[5rem] grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1 lg:col-span-10"
  >
    {#each $cachedDays as item, i}
      {@const year = getYearFromSlug(item.slug)}
      <li class="snap-end">
        <Thumbnail {...item} />
      </li>
      {#if i === $cachedDays.length - 1 || (i < $cachedDays.length - 1 && year !== getYearFromSlug($cachedDays[i + 1].slug))}
        <li
          class="bg-pale-accent dark:bg-inky-accent dark:text-pale flex items-center justify-center text-stone-700 transition-colors delay-150 duration-500"
        >
          <IconLeft class="animate-ping" />
          <p class="font-leica text-[0.6rem]">{year}</p>
        </li>
      {/if}
    {/each}
  </ul>
</div>
