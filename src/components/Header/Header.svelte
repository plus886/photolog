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
    isHome,
  }: {
    locale: Locale;
    switchUrl: string;
    localePrefix: string;
    isHome: boolean;
  } = $props();
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
  <!-- Mobile: a 3-column grid with equal side columns keeps the menu
       button at the true centre regardless of the logo / switcher
       widths. Desktop: the vertical rail (flex column). -->
  <div
    class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center md:flex md:h-dvh md:flex-col md:justify-between md:gap-4"
  >
    <svelte:element
      this={isHome ? "h1" : "p"}
      class="font-cactus justify-self-start px-6 text-lg tracking-[0.5em] text-nowrap md:px-12 md:text-xl md:tracking-[1em] md:[writing-mode:vertical-lr]"
    >
      <a href={`${localePrefix}/`} class="no-underline hover:animate-pulse"
        >翳光臺灣</a
      >
    </svelte:element>
    <DrawerButton />
    <!-- Always-visible language switcher: both endonyms, the current
         one dimmed, the other a link to the same page. It occupies the
         rail's bottom slot so the menu button keeps the dead-centre. -->
    <nav
      aria-label="Language"
      class="flex items-center gap-2 justify-self-end pr-6 font-serif text-xs tracking-wide whitespace-nowrap md:px-12 md:pr-0 md:[writing-mode:vertical-lr]"
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
            onclick={() => localStorage.setItem("locale", loc)}
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
