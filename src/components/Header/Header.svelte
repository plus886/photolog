<script lang="ts">
  import DrawerButton from "./DrawerButton.svelte";
  import DrawerContents from "./DrawerContents.svelte";
  import { isDrawerOpen } from "../../libs/stores";
</script>

<header
  class={{
    "grid overflow-hidden transition-all delay-150 duration-500 ease-in-out": true,
    "grid-cols-[calc(100vw/12)_calc(100vw/12*5)] bg-stone-300": $isDrawerOpen,
    "grid-cols-[calc(100vw/12)_calc(100vw/12)]": !$isDrawerOpen,
  }}
>
  <div class="flex h-lvh flex-col items-center justify-between gap-4">
    <h1
      class="font-cactus px-12 text-xl tracking-[1em] [writing-mode:vertical-lr]"
    >
      翳光台灣
    </h1>
    <DrawerButton />
    <p class="font-sub px-12 text-xs tracking-wider [writing-mode:vertical-lr]">
      FORMOSA CHIAROSCURO
    </p>
  </div>
  {#if $isDrawerOpen}
    <DrawerContents />
  {/if}
</header>
