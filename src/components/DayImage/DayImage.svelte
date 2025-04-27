<script lang="ts">
  import DaySpacer from "./DaySpacer.svelte";
  import DayCaption from "./DayCaption.svelte";
  import type { Day } from "../../libs/client";

  interface Props extends Day {
    slug: string;
  }
  const { image, slug, camera, lens, id }: Props = $props();
</script>

<DaySpacer />
<img
  src={`${image.url}?w=1024`}
  alt={slug}
  class="max-h-[50dvh] w-[90dvw] object-contain transition-all md:max-h-[70dvh] md:w-full"
  style={`view-transition-name: days_${id}_container`}
/>
<DayCaption {camera} {lens} />
