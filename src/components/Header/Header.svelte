<script lang="ts">
  import DrawerButton from "./DrawerButton.svelte";
  import DrawerContents from "./DrawerContents.svelte";
  import { isDrawerOpen } from "libs/stores";
  import type { HeaderProps } from "types/index";

  const headerProps: HeaderProps = $props();
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
      <a href="/" class="no-underline hover:animate-pulse">翳光臺灣</a>
    </h1>
    <DrawerButton />
    <p
      class="font-leica hidden text-[0.625rem] md:block md:px-12 md:[writing-mode:vertical-lr]"
    >
      FORMOSA CHIAROSCURO
    </p>
  </div>
  {#if $isDrawerOpen}
    <DrawerContents {...headerProps} />
  {/if}
</div>
