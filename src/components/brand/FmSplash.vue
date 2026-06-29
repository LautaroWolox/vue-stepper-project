<template>
  <div class="fm-brand" aria-label="Field Manager">
    <div class="fm-logo-mark">
      <span class="fm-logo-corner"></span>
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
  width: min(350px, 44vw);
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
  filter: drop-shadow(0 12px 14px rgba(0, 0, 0, 0.06));
}

.fm-logo-corner {
  position: absolute;
  left: 20.45%;
  top: 19.75%;
  width: 6.8%;
  height: 6.8%;
  display: block;
  background: #4f4f4f;
  opacity: 0;
  z-index: 3;
  animation: fmCornerIn 260ms ease-out 80ms both;
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
  stroke: #08b8bb;
  stroke-width: 10;
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
  font-size: clamp(64px, 9vw, 92px);
  font-weight: 900;
  letter-spacing: -8px;
  color: #777;
  opacity: 0;
  transform: scale(0.82);
  animation: fmTextIn 520ms ease-out 880ms forwards, fmTextBeat 2300ms ease-in-out 1500ms infinite;
}

@keyframes fmCornerIn {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fmRingDraw {
  to { stroke-dashoffset: 0; }
}

@keyframes fmTextIn {
  from { opacity: 0; transform: scale(0.82); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes fmTextBeat {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.97; }
}

@media (max-width: 1200px) {
  .fm-brand {
    width: min(320px, 48vw);
  }

  .fm-logo-text {
    font-size: clamp(58px, 10vw, 84px);
  }
}

@media (max-width: 768px) {
  .fm-brand {
    width: min(285px, 68vw);
  }

  .fm-logo-text {
    font-size: clamp(52px, 17vw, 76px);
    letter-spacing: -6px;
  }
}

@media (max-width: 420px) {
  .fm-brand {
    width: min(235px, 78vw);
  }

  .fm-logo-text {
    font-size: clamp(44px, 20vw, 66px);
    letter-spacing: -5px;
  }
}
</style>
