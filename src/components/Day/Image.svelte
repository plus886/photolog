<script lang="ts">
  import type { OptimizedDay } from "types/index";
  type Props = OptimizedDay;
  const { image, slug, id }: Props = $props();
</script>

<img
  src={`${image.url}?w=1024`}
  alt={slug}
  class="max-h-[50dvh] w-[90dvw] object-contain transition-all md:max-h-[70dvh] md:w-full"
  style={`view-transition-name: days_${id}_container`}
/>
