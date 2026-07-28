<script lang="ts">
  // @ts-ignore
  import IconLeft from "~icons/material-symbols-light/arrow-left-rounded";
  import Thumbnail from "./Thumbnail.svelte";
  import { currentPage, cachedDays, lastShowedDayId } from "libs/stores";
  import { onDestroy, onMount, tick } from "svelte";
  import { fade } from "svelte/transition";
  import { createObserver } from "libs/intersectionObserver";
  import type { GetDays, GridGalleryProps } from "types/index";
  import type { Action } from "svelte/action";

  const { totalPages, localePrefix, locale, initialDays }: GridGalleryProps =
    $props();

  // Hydration has to reconcile against the markup the server sent, which is
  // always the first page. The store can already hold more than that from
  // earlier scrolling in this session, so only read it once mounted —
  // switching the list mid-hydration would leave Svelte matching nodes that
  // aren't in the DOM yet.
  let mounted = $state(false);
  const days = $derived(
    mounted && $cachedDays.length ? $cachedDays : initialDays,
  );

  const fetchItems = async (page: number): Promise<void> => {
    const res = await fetch(`/api/day/${page}.json`);
    const body: GetDays = await res.json();
    cachedDays.set([...$cachedDays, ...body.contents]);
  };

  // Fires on change only, so the server-rendered first page isn't refetched.
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

  onMount(async () => {
    // Seed the store so pagination appends to the page already on screen.
    if (!cachedDays.get().length) cachedDays.set(initialDays);
    mounted = true;

    // Reopened from a day page: bring that thumbnail back into view,
    // centred. tick() ensures the grid DOM reflects cachedDays first;
    // a native scroll is adopted by Lenis (desktop) / the document
    // scroll (mobile) once the page settles.
    await tick();
    const lastId = lastShowedDayId.get();
    if (lastId) {
      document.querySelector(`a[href$="/days/${lastId}"]`)?.scrollIntoView({
        behavior: "instant",
        block: "center",
        inline: "nearest",
      });
    }
  });

  onDestroy(() => {
    unbindListener();
  });
</script>

<div class="grid grid-cols-7 lg:grid-cols-11">
  <ul
    class="col-span-7 grid auto-rows-[4rem] grid-cols-[repeat(auto-fill,minmax(5rem,1fr))] gap-1 md:grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] lg:col-span-10"
  >
    {#each days as item, i}
      {@const isLastItem = i === days.length - 1}
      <!-- Per-item random delay (a {@const}, so it is evaluated once per
           row rather than hoisted) gives a staggered fade-in. Hydration
           doesn't play intro transitions, so this animates the pages
           fetched on scroll, not the one that arrived with the HTML. -->
      {@const fadeDelay = Math.random() * 1200}
      <li in:fade={{ delay: fadeDelay, duration: 500 }}>
        <Thumbnail {...item} {localePrefix} {locale} />
      </li>
      {#if isLastItem}
        <!-- Sentinel cell at the tail of the loaded items; the
             intersection observer attached here triggers the next page. -->
        <li
          class="bg-pale-accent dark:bg-inky-accent dark:text-pale flex items-center justify-center text-stone-700 transition-colors delay-150 duration-500"
          use:handlePaginationOnScroll={isLastItem}
        >
          <IconLeft class="animate-ping" />
        </li>
      {/if}
    {/each}
  </ul>
</div>
