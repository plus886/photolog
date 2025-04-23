<script lang="ts">
  import IconMenu from "~icons/material-symbols-light/menu-rounded";
  import IconClose from "~icons/material-symbols-light/close-rounded";
  import { isDrawerOpen } from "../../libs/stores";

  const onclick = () => {
    isDrawerOpen.set(!$isDrawerOpen);
  };
</script>

<button
  {onclick}
  class="cursor-pointer p-4 transition-all hover:scale-90 md:p-2"
>
  {#if $isDrawerOpen}
    <IconClose class="text-xl md:text-2xl" />
  {:else}
    <IconMenu class="text-xl md:text-2xl" />
  {/if}
</button>
