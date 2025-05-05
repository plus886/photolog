<script lang="ts">
  import type { Action } from "svelte/action";
  import type { OptimizedDay } from "types/index";
  import { isDayImageLoading } from "libs/stores";
  type Props = OptimizedDay;

  let { image, slug, id }: Props = $props();

  const onload: Action<HTMLImageElement> = (e) => {
    const handleImageLoad = () => {
      isDayImageLoading.set(false);
      e.removeEventListener("load", handleImageLoad);
    };
    isDayImageLoading.set(true);
    if (e.complete) {
      isDayImageLoading.set(false);
      return;
    }
    e.addEventListener("load", handleImageLoad);
  };
</script>

<div style={`view-transition-name: days_${id}_container`}>
  <img
    src={`${image.url}?w=1024`}
    alt={slug}
    class={{
      "block max-h-[50dvh] w-[90dvw] object-contain transition-all md:max-h-[70dvh] md:w-full": true,
      "opacity-0": $isDayImageLoading,
    }}
    use:onload
  />
</div>
