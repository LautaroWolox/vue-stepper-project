<template>
  <div class="fm-brand" aria-label="Field Manager">
    <div class="fm-logo-mark">
      <span class="fm-logo-corner fm-logo-corner-vertical"></span>
      <span class="fm-logo-corner fm-logo-corner-horizontal"></span>
      <svg class="fm-logo-ring" viewBox="0 0 160 160" role="img" aria-hidden="true">
        <path
          class="fm-ring-path"
          d="M40 36 H84 C110 36 132 58 132 84 C132 116 107 140 80 140 C50 140 28 117 28 86 V36"
        />
      </svg>
      <div class="fm-logo-text" aria-hidden="true">FM</div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.fm-brand {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: min(390px, 58vw);
  aspect-ratio: 1;
  pointer-events: none;
}

.fm-logo-mark {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 18px 18px rgba(0, 0, 0, 0.08));
}

.fm-logo-corner {
  position: absolute;
  left: 18%;
  top: 16%;
  width: 7%;
  height: 7%;
  display: block;
  background: #4f4f4f;
  opacity: 0;
  animation: fmCornerIn 260ms ease-out 80ms both;
}

.fm-logo-corner-horizontal {
  transform: translateY(115%);
}

.fm-logo-ring {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.fm-ring-path {
  fill: none;
  stroke: #08b7ba;
  stroke-width: 12;
  stroke-linecap: square;
  stroke-linejoin: round;
  stroke-dasharray: 390;
  stroke-dashoffset: 390;
  animation: fmRingDraw 1150ms ease 160ms forwards;
}

.fm-logo-text {
  position: relative;
  z-index: 2;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(78px, 14vw, 126px);
  font-weight: 900;
  letter-spacing: -10px;
  color: #777;
  opacity: 0;
  transform: scale(0.72);
  animation: fmTextAppear 500ms ease-out 880ms forwards, fmTextBeat 2100ms ease-in-out 1450ms infinite;
}

@keyframes fmCornerIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fmRingDraw {
  to { stroke-dashoffset: 0; }
}

@keyframes fmTextAppear {
  from { opacity: 0; transform: scale(0.72); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes fmTextBeat {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.045); }
}

@media (max-width: 768px) {
  .fm-brand {
    width: min(300px, 72vw);
  }

  .fm-logo-text {
    font-size: clamp(62px, 19vw, 96px);
    letter-spacing: -8px;
  }
}

@media (max-width: 420px) {
  .fm-brand {
    width: min(250px, 80vw);
  }

  .fm-logo-text {
    font-size: clamp(52px, 22vw, 82px);
    letter-spacing: -6px;
  }
}
</style>
