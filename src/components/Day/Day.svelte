<script lang="ts">
  import Navigation from "./Navigation.svelte";
  import Image from "./Image.svelte";
  import Passage from "./Passage.svelte";
  import DaySpacer from "./Spacer.svelte";
  import DayCaption from "./Caption.svelte";
  import type { DayProps } from "types/index";
  import { lastShowedDayId } from "libs/stores";
  import { prefetch } from "astro:prefetch";
  import { onMount } from "svelte";

  let { item, nextPost, prevPost, localePrefix, locale, passage }: DayProps =
    $props();

  onMount(() => {
    lastShowedDayId.set(item.id);

    // Warm both neighbours — page HTML and full-size photo — so that
    // next/prev navigation (click or arrow keys) is instant.
    for (const post of [nextPost, prevPost]) {
      if (!post) continue;
      prefetch(`${localePrefix}/days/${post.id}`);
      new Image().src = `${post.image.url}?w=1024`;
    }
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
<Passage {passage} {locale} />
