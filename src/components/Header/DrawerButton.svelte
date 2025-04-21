<script lang="ts">
  import IconMenu from "~icons/material-symbols-light/menu-rounded";
  import IconClose from "~icons/material-symbols-light/close-rounded";
  import { isDrawerOpen } from "../../libs/stores";

  const onclick = () => {
    isDrawerOpen.set(!$isDrawerOpen);
  };
</script>

<button {onclick} class="cursor-pointer p-2 transition-all hover:scale-90">
  {#if $isDrawerOpen}
    <IconClose class="text-3xl" />
  {:else}
    <IconMenu class="text-3xl" />
  {/if}
</button>
