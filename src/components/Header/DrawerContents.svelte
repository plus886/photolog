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
    <div
      class={{
        "flex justify-start": true,
        invisible: $theme === "light",
      }}
    >
      <button
        onclick={() => theme.set("light")}
        class="cursor-pointer p-4 transition-all hover:scale-90 md:p-2"
      >
        <IconSun class="text-xl md:text-3xl" />
      </button>
    </div>
    <div class="px-4">
      <p class="py-4">
        台湾で生活する日本人が、一日一枚、写真を投稿するフォトログです。
        ここで生きているといろいろなことがあるものですが、なるべくその「いろいろ」が表現できるといいな、と思いながらやっています。
      </p>
      <p class="py-4">作者のプロフィールはこちらをご覧ください。</p>
      <p class="py-4 italic">
        ——
        生活環境や風景にしても、それらが真の姿を明らかにするのは、写真家がそうした対象を、それらの顔貌に現れている名づけようのない現象において把握することを心得ている場合だけである。（ヴァルター・ベンヤミン）
      </p>
    </div>
    <div
      class={{
        "flex justify-end": true,
        invisible: $theme !== "light",
      }}
    >
      <button
        onclick={() => theme.set("dark")}
        class="cursor-pointer p-4 transition-all hover:scale-90 md:p-2"
      >
        <IconMoon class="text-xl md:text-3xl" />
      </button>
    </div>
  </div>
</div>
