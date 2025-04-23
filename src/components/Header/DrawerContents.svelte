<script lang="ts">
  import { fade } from "svelte/transition";
  import IconSun from "~icons/material-symbols-light/wb-sunny-outline-rounded";
  import IconMoon from "~icons/material-symbols-light/moon-stars-outline-rounded";
  import { theme } from "../../libs/stores";
</script>

<div
  class="flex items-center justify-center"
  in:fade={{ delay: 600, duration: 500 }}
  out:fade={{ duration: 150 }}
>
  <div
    class="max-w-2xl px-6 font-serif text-sm/6 tracking-wide md:pr-12 md:pl-0"
  >
    <div class="hidden h-18 items-start justify-center md:flex">
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
      <p class="py-4">
        台湾で生活する日本人が、一日一枚、写真を投稿するフォトログです。
        ここで生きているといろいろなことがあるものですが、なるべくその「いろいろ」が表現できるといいな、と思いながらやっています。
      </p>
      <p class="py-4">
        作者のプロフィールは<a
          class="hover:animate-pulse"
          href="https://kokaiji.tw"
          target="_blank">ポートフォリオサイト</a
        >をご覧ください。
      </p>
      <p class="py-4 italic">
        ——
        生活環境や風景にしても、それらが真の姿を明らかにするのは、写真家がそうした対象を、それらの顔貌に現れている名づけようのない現象において把握することを心得ている場合だけである。（ヴァルター・ベンヤミン）
      </p>
    </div>
    <div class="hidden h-18 items-end justify-center md:flex">
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
    <div class="flex items-center justify-end md:hidden">
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
