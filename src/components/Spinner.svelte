<script lang="ts">
  type Props = {
    /** Pixel size of the square spinner. */
    size?: number;
    /** Extra classes applied to the grid root (e.g. for positioning). */
    class?: string;
  };
  let { size = 48, class: className = "" }: Props = $props();
</script>

<!-- 3x3 grid mirroring the favicon. Five dark cells stay put; the four
     "on" cells light up from bottom to top (bottom-mid → center →
     mid-right → top-right) to land on the favicon's lit state, then
     snap back to all-dark for the next loop. -->
<div
  class={`spinner ${className}`}
  style:--size={`${size}px`}
  role="status"
  aria-label="Loading"
>
  <span class="cell off"></span>
  <span class="cell off"></span>
  <span class="cell on on-3"></span>
  <span class="cell off"></span>
  <span class="cell on on-1"></span>
  <span class="cell on on-2"></span>
  <span class="cell off"></span>
  <span class="cell on on-0"></span>
  <span class="cell off"></span>
</div>

<style>
  .spinner {
    /* off ≈ page-foreground (always visible on bg); on ≈ a "lit" tone
       that contrasts in both modes. Tuned against the existing theme
       tokens so light/dark inversion stays consistent. */
    --off: var(--color-inky);
    --on: var(--color-pale-accent);
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    /* Match the favicon's ~5.3% gap (≈ 20/375 in the source SVG). */
    gap: calc(var(--size) * 0.053);
    width: var(--size);
    height: var(--size);
  }
  :global(.dark) .spinner {
    /* Mid-stone reads clearly against the inky page background but
       stays dim enough to feel "off"; pale is the same light tone the
       site uses for foreground text, so lit cells pop. */
    --off: var(--color-stone-600);
    --on: var(--color-pale);
  }
  .cell {
    width: 100%;
    height: 100%;
  }
  .off {
    background-color: var(--off);
  }
  .on {
    /* All four lit cells share the same clock so they reset together
       at each iteration boundary. step-end gives a crisp snap at the
       cell's threshold rather than a fade. */
    background-color: var(--off);
    animation-duration: 1.4s;
    animation-iteration-count: infinite;
    animation-timing-function: step-end;
  }
  .on-0 {
    animation-name: light-up-0;
  }
  .on-1 {
    animation-name: light-up-1;
  }
  .on-2 {
    animation-name: light-up-2;
  }
  .on-3 {
    animation-name: light-up-3;
  }

  /* Each cell flips on at its own threshold (20/40/60/80%) and holds
     until 100%. step-end + the (--off → --on) jump means the value
     stays at --off through the segment and snaps to --on at the stop.
     At iteration boundary (100% → next 0%) all four snap back to --off
     together — that's the "reset to all-black" frame. */
  @keyframes light-up-0 {
    0% {
      background-color: var(--off);
    }
    20%,
    100% {
      background-color: var(--on);
    }
  }
  @keyframes light-up-1 {
    0% {
      background-color: var(--off);
    }
    40%,
    100% {
      background-color: var(--on);
    }
  }
  @keyframes light-up-2 {
    0% {
      background-color: var(--off);
    }
    60%,
    100% {
      background-color: var(--on);
    }
  }
  @keyframes light-up-3 {
    0% {
      background-color: var(--off);
    }
    80%,
    100% {
      background-color: var(--on);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .on {
      /* Honour the visitor's setting: show the favicon's lit state
         statically rather than cycling. */
      animation: none;
      background-color: var(--on);
    }
  }
</style>
