<script lang="ts">
  // @ts-ignore
  import IconSun from "~icons/material-symbols-light/wb-sunny-outline-rounded";
  // @ts-ignore
  import IconMoon from "~icons/material-symbols-light/moon-stars-outline-rounded";
  import dayjs from "libs/dayjs";
  import { fade } from "svelte/transition";
  import { theme } from "libs/stores";
  import type { HeaderProps } from "types/index";

  const { lastCommitHash, lastCommitTime, publishedAt }: HeaderProps = $props();

  const lastPublishedAt = dayjs.tz(dayjs(publishedAt));
  const lastCommittedAt = dayjs.tz(dayjs(lastCommitTime));
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
        台湾人の家族と共に生きる日本人が、一日一枚写真を投稿するフォトログです。以下のキーボードショートカットが使えます。
      </p>
      <table class="mx-auto md:my-4">
        <tbody>
          <tr>
            <td class="p-1 px-2">←</td>
            <td class="p-1 px-2">次の日</td>
          </tr>
          <tr>
            <td class="p-1 px-2">→</td>
            <td class="p-1 px-2">前の日</td>
          </tr>
          <tr>
            <td class="p-1 px-2">Space</td>
            <td class="p-1 px-2">ランダム</td>
          </tr>
          <tr>
            <td class="p-1 px-2">Backspace</td>
            <td class="p-1 px-2">リストに戻る</td>
          </tr>
        </tbody>
      </table>
      <p class="py-4">
        作者のプロフィールは<a
          class="hover:animate-pulse"
          href="https://kokaiji.tw"
          target="_blank">ポートフォリオサイト</a
        >をご覧ください。
      </p>
      <blockquote class="pt-4 pb-8 italic">
        ——
        生活環境や風景にしても、それらが真の姿を明らかにするのは、写真家がそうした対象を、それらの顔貌に現れている名づけようのない現象において把握することを心得ている場合だけである。（ヴァルター・ベンヤミン）
      </blockquote>
      <p
        class="font-leica flex justify-end gap-2 text-[0.45rem] tracking-normal"
      >
        <a
          class="hover:animate-pulse"
          href={`https://github.com/plus886/photolog/commit/${lastCommitHash}`}
          target="_blank"
        >
          #{lastCommitHash.slice(0, 7)}</a
        >
        <span>
          LAST DEPLOYMENT: {(lastCommittedAt.isAfter(lastPublishedAt)
            ? lastCommittedAt
            : lastPublishedAt
          ).format("YYYY/M/D H:mm")}
        </span>
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
