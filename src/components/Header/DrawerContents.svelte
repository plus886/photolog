<script lang="ts">
  // @ts-ignore
  import IconSun from "~icons/material-symbols-light/wb-sunny-outline-rounded";
  // @ts-ignore
  import IconMoon from "~icons/material-symbols-light/moon-stars-outline-rounded";
  import { fade } from "svelte/transition";
  import { theme } from "libs/stores";
  import { useTranslations, type Locale } from "i18n/utils";

  let { locale }: { locale: Locale } = $props();
  const t = $derived(useTranslations(locale));
</script>

<div
  class="flex items-center justify-center"
  in:fade={{ delay: 600, duration: 500 }}
  out:fade={{ duration: 150 }}
>
  <div
    class="max-w-2xl px-6 font-serif text-sm/6 tracking-wide md:pr-12 md:pl-0"
  >
    <div class="hidden h-18 items-start justify-center gap-1 md:flex">
      {#if $theme === "dark"}
        <button
          onclick={() => theme.set("light")}
          class="cursor-pointer p-4 transition-transform hover:scale-90 md:p-2"
          transition:fade={{ duration: 200, delay: 100 }}
        >
          <IconSun class="animate-wiggle text-xl md:text-2xl" />
        </button>
      {/if}
    </div>
    <div class="px-4">
      <p class="py-4">{t("drawer.intro")}</p>
      <table class="mx-auto md:my-4">
        <tbody>
          <tr>
            <td class="p-1 px-2">←</td>
            <td class="p-1 px-2">{t("drawer.shortcut.next")}</td>
          </tr>
          <tr>
            <td class="p-1 px-2">→</td>
            <td class="p-1 px-2">{t("drawer.shortcut.prev")}</td>
          </tr>
          <tr>
            <td class="p-1 px-2">Space</td>
            <td class="p-1 px-2">{t("drawer.shortcut.random")}</td>
          </tr>
          <tr>
            <td class="p-1 px-2">Backspace</td>
            <td class="p-1 px-2">{t("drawer.shortcut.back")}</td>
          </tr>
        </tbody>
      </table>
      <p class="py-4">
        {t("drawer.profile.pre")}<a
          class="hover:animate-pulse"
          href="https://kokaiji.tw"
          target="_blank">{t("drawer.profile.link")}</a
        >{t("drawer.profile.post")}
      </p>
      <blockquote class="pt-4 pb-8 italic">
        {t("drawer.quote")}
      </blockquote>
    </div>
    <div class="hidden h-18 items-end justify-center gap-1 md:flex">
      {#if $theme === "light"}
        <button
          onclick={() => theme.set("dark")}
          class="cursor-pointer p-4 transition-transform hover:scale-90 md:p-2"
          transition:fade={{ duration: 200, delay: 100 }}
        >
          <IconMoon class="animate-wiggle text-xl md:text-2xl" />
        </button>
      {/if}
    </div>
    <div class="flex items-center justify-end gap-1 md:hidden">
      <button
        onclick={() => theme.set($theme === "dark" ? "light" : "dark")}
        class="cursor-pointer p-4 transition-transform hover:scale-90 md:p-2"
      >
        {#if $theme === "light"}
          <IconMoon class="animate-wiggle text-xl md:text-2xl" />
        {:else}
          <IconSun class="animate-wiggle text-xl md:text-2xl" />
        {/if}
      </button>
    </div>
  </div>
</div>
