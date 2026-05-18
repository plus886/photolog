<script lang="ts">
  import type { Locale } from "i18n/utils";

  // Per-locale passage text, resolved upstream from the microCMS
  // `passageJa` / `passageZh` fields. Empty until filled in microCMS.
  // ja uses Hina Mincho; zh uses Cactus Classical Serif (the logo face).
  let { passage, locale }: { passage?: string; locale: Locale } = $props();
</script>

<div class="flex h-full items-center justify-center">
  {#if passage}
    <p
      class={[
        "text-sm leading-8 tracking-[0.15em] whitespace-pre [writing-mode:vertical-rl]",
        locale === "zh" ? "font-cactus" : "font-hina",
      ]}
    >
      {passage}
    </p>
  {/if}
</div>
