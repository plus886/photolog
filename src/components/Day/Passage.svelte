<script lang="ts">
  import type { Locale } from "i18n/utils";

  // Per-locale passage text, resolved upstream from the microCMS
  // `passageJa` / `passageZh` fields. Empty until filled in microCMS.
  // ja uses Hina Mincho; zh uses Cactus Classical Serif (the logo face).
  let {
    passage,
    locale,
    class: className,
  }: { passage?: string; locale: Locale; class?: string } = $props();
</script>

<div class={["flex h-full items-center justify-center", className]}>
  {#if passage}
    <p
      class={[
        "leading-8 tracking-[0.15em] whitespace-pre [writing-mode:vertical-rl] md:text-sm",
        locale === "zh" ? "font-cactus" : "font-hina",
      ]}
    >
      {passage}
    </p>
  {/if}
</div>
