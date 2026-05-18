<script lang="ts">
  import Navigation from "./Navigation.svelte";
  import Image from "./Image.svelte";
  import Passage from "./Passage.svelte";
  import DaySpacer from "./Spacer.svelte";
  import DayCaption from "./Caption.svelte";
  import type { DayProps } from "types/index";
  import { lastShowedDayId } from "libs/stores";
  import { onMount } from "svelte";

  let { item, nextPost, prevPost, localePrefix, passage }: DayProps = $props();

  onMount(() => {
    lastShowedDayId.set(item.id);
  });
</script>

<nav class="self-center">
  <Navigation {prevPost} {nextPost} {localePrefix} />
</nav>
<figure class="flex flex-col items-center justify-center">
  <DaySpacer />
  <Image {...item} />
  <DayCaption camera={item.camera} lens={item.lens} />
</figure>
<Passage {passage} />
