<script lang="ts">
  // Per-locale passage text, resolved upstream from the microCMS
  // `passageJa` / `passageZh` fields. Empty until filled in microCMS.
  let { passage }: { passage?: string } = $props();
</script>

<div class="flex h-full items-center justify-center">
  {#if passage}
    <p
      class="font-hina max-h-[45dvh] text-sm leading-8 tracking-[0.15em] [writing-mode:vertical-rl]"
    >
      {passage}
    </p>
  {/if}
</div>
