<script lang="ts">
  import { fade } from "svelte/transition";
</script>

<div
  class="flex items-center justify-center"
  in:fade={{ delay: 600, duration: 500 }}
  out:fade={{ duration: 150 }}
>
  <div class="max-w-2xl pr-12 font-serif text-sm/6 tracking-wide">
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
</div>
