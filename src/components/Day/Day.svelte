<script lang="ts">
  import Navigation from "./Navigation.svelte";
  import DayImage from "./Image.svelte";
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

<!-- DOM order is photo / passage / controls — the mobile stacking
     order. md:order-* restores the desktop columns (controls left). -->
<figure class="flex flex-col items-center justify-center md:order-2">
  <DaySpacer />
  <DayImage {...item} {locale} />
  <DayCaption camera={item.camera} lens={item.lens} />
</figure>
<Passage {passage} {locale} class="pt-10 pb-16 md:order-3 md:pt-0 md:pb-0" />
<nav class="self-center md:order-1">
  <Navigation
    {prevPost}
    {nextPost}
    {localePrefix}
    currentId={item.id}
  />
</nav>
