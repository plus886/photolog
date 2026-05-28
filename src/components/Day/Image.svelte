<script lang="ts">
  import type { Action } from "svelte/action";
  import type { Day } from "types/index";
  import { isDayImageLoading } from "libs/stores";
  import { fade } from "svelte/transition";
  import Spinner from "../Spinner.svelte";
  type Props = Day;

  let { image, publishedAt, id }: Props = $props();

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

<!-- Outer `relative` hosts the spinner overlay. Keep the inner div
     as the sole `view-transition-name` target so the morph between
     day pages only touches the <img>, not the (transient) spinner. -->
<div class="relative">
  <div style={`view-transition-name: days_${id}_container`}>
    <img
      src={`${image.url}?w=1024`}
      alt={publishedAt?.slice(0, 10)}
      class={{
        "max-h-[50dvh] w-[90dvw] object-contain transition-all md:max-h-[70dvh] md:w-full": true,
        // While loading, hide the (empty) <img> but reserve space so the
        // spinner overlay is centred against a stable box. Mobile needs
        // an explicit height because w-[90dvw] alone collapses to 0.
        "opacity-0 h-[40dvh] md:h-[30dvh] md:w-full": $isDayImageLoading,
      }}
      use:onload
    />
  </div>
  {#if $isDayImageLoading}
    <div
      class="pointer-events-none absolute inset-0 flex items-center justify-center"
      out:fade={{ duration: 300 }}
    >
      <Spinner size={48} />
    </div>
  {/if}
</div>
