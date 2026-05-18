<script lang="ts">
  import DrawerButton from "./DrawerButton.svelte";
  import DrawerContents from "./DrawerContents.svelte";
  import { isDrawerOpen } from "libs/stores";
  import { locales, localeNames } from "i18n/ui";
  import type { Locale } from "i18n/utils";

  let {
    locale,
    switchUrl,
    localePrefix,
  }: { locale: Locale; switchUrl: string; localePrefix: string } = $props();
</script>

<div
  class={{
    "sticky top-0 z-10 grid touch-none overflow-hidden transition-[grid,background-color] delay-150 duration-500 ease-in-out md:static md:top-auto md:z-auto": true,
    "bg-pale-accent dark:bg-inky-accent grid-rows-[10dvh_90dvh] md:grid-cols-[calc(100vw/12)_calc(100vw/12*5)] md:grid-rows-1":
      $isDrawerOpen,
    "dark:bg-inky grid-rows-[10dvh_0dvh] bg-white md:grid-cols-[calc(100vw/12)_calc(100vw/12)] md:grid-rows-1":
      !$isDrawerOpen,
  }}
>
  <div class="flex items-center justify-between gap-4 md:h-dvh md:flex-col">
    <h1
      class="font-cactus px-6 text-lg tracking-[0.5em] text-nowrap md:px-12 md:text-xl md:tracking-[1em] md:[writing-mode:vertical-lr]"
    >
      <a href={`${localePrefix}/`} class="no-underline hover:animate-pulse"
        >翳光臺灣</a
      >
    </h1>
    <DrawerButton />
    <!-- Always-visible language switcher: both endonyms, the current
         one dimmed, the other a link to the same page. It occupies the
         rail's bottom slot so the menu button keeps the dead-centre. -->
    <nav
      aria-label="Language"
      class="font-serif flex items-center gap-2 pr-6 text-xs tracking-wide whitespace-nowrap md:px-12 md:pr-0 md:[writing-mode:vertical-lr]"
    >
      {#each locales as loc, i}
        {#if i > 0}
          <span aria-hidden="true" class="opacity-30">／</span>
        {/if}
        {#if loc === locale}
          <span aria-current="true" class="opacity-40">{localeNames[loc]}</span>
        {:else}
          <a
            href={switchUrl}
            hreflang={loc}
            class="no-underline hover:animate-pulse">{localeNames[loc]}</a
          >
        {/if}
      {/each}
    </nav>
  </div>
  {#if $isDrawerOpen}
    <DrawerContents {locale} />
  {/if}
</div>
