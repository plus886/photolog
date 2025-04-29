<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  // @ts-ignore
  import IconLeft from "~icons/material-symbols-light/arrow-left-rounded";
  import Thumbnail from "./Thumbnail.svelte";
  import type { GetDays } from "types/index";
  import { currentPage, cachedDays } from "libs/stores";

  const fetchItems = async (page: number) => {
    console.warn("fetching", page);
    const res = await fetch(`/api/day/${page}.json`);
    const body: GetDays = await res.json();
    cachedDays.set($cachedDays.concat(body.contents));
  };

  onMount(async () => {
    if ($currentPage > 1) return;
    console.warn($currentPage);
    fetchItems($currentPage);
  });

  onDestroy(() => {
    unbindListener();
  });

  const unbindListener = currentPage.listen(async (v) => {
    fetchItems(v);
  });

  const getNextPage = () => {
    currentPage.set($currentPage + 1);
  };
</script>

<div class="grid grid-cols-7 lg:grid-cols-11">
  <ul
    class="col-span-7 grid auto-rows-[5rem] grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1 lg:col-span-10"
  >
    <!-- <li>
      <button onclick={getNextPage}>OSEYO {$currentPage}</button>
    </li> -->
    {#each $cachedDays as item}
      <li>
        <Thumbnail {...item} />
      </li>
      <!-- {#if item.isLastOfYear}
        <li
          class="bg-pale-accent dark:bg-inky-accent dark:text-pale flex items-center justify-center text-stone-700 transition-colors delay-150 duration-500"
        >
          <IconLeft class="animate-ping" />
          <p class="font-leica text-[0.6rem]">{item.year}</p>
        </li>
      {/if} -->
    {/each}
  </ul>
</div>
