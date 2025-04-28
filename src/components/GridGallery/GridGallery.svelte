<script lang="ts">
  // @ts-ignore
  import IconLeft from "~icons/material-symbols-light/arrow-left-rounded";
  import Thumbnail from "./Thumbnail.svelte";
  import type { GridGalleryProps } from "types/index";

  let { response }: GridGalleryProps = $props();
</script>

<div class="grid grid-cols-7 lg:grid-cols-11">
  <ul
    class="col-span-7 grid auto-rows-[5rem] grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-1 lg:col-span-10"
  >
    {#each response.items as item}
      <li>
        <Thumbnail {...item} />
      </li>
      {#if item.isLastOfYear}
        <li
          class="bg-pale-accent dark:bg-inky-accent dark:text-pale flex items-center justify-center text-stone-700 transition-colors delay-150 duration-500"
        >
          <IconLeft class="animate-ping" />
          <p class="font-leica text-[0.6rem]">{item.year}</p>
        </li>
      {/if}
    {/each}
  </ul>
</div>
