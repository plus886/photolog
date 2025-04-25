<script lang="ts">
  import dayjs from "../libs/dayjs";
  import { isDrawerOpen } from "../libs/stores";

  interface Props {
    date: Date;
  }

  const { date }: Props = $props();
</script>

<div
  class={{
    "font-cactus flex items-center justify-center gap-2 transition-all delay-150 duration-500 ease-in-out": true,
    "md:scale-65": $isDrawerOpen,
  }}
>
  <p>
    {dayjs(date).format("YYYY年")}
  </p>
  <p class="text-2xl font-bold">
    {dayjs(date).format("M月D日")}
  </p>
</div>
