<template>
  <div class="fm-splash" aria-label="Cargando Field Manager">
    <div class="fm-splash-card">
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
      <div class="fm-splash-label">Field Manager</div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.fm-splash {
  position: fixed;
  inset: 0;
  z-index: 7000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f4f6f8;
  animation: fmSplashOut 420ms ease-in 2600ms forwards;
}

.fm-splash-card {
  width: min(240px, 70vw);
  aspect-ratio: 1;
  border-radius: 34px;
  background: #f7f7f7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12);
  animation: fmCardIn 420ms ease-out both;
}

.fm-logo-mark {
  width: min(148px, 44vw);
  height: min(148px, 44vw);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fm-logo-corner {
  position: absolute;
  left: 18px;
  top: 18px;
  width: 10px;
  height: 10px;
  display: block;
  background: #5f6368;
  opacity: 0;
  animation: fmCornerIn 260ms ease-out 80ms both;
}

.fm-logo-corner-horizontal {
  transform: translateY(12px);
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
  stroke: #12b8bd;
  stroke-width: 10;
  stroke-linecap: square;
  stroke-linejoin: round;
  stroke-dasharray: 390;
  stroke-dashoffset: 390;
  animation: fmRingDraw 1150ms ease 180ms forwards;
}

.fm-logo-text {
  position: relative;
  z-index: 2;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(38px, 11vw, 58px);
  font-weight: 900;
  letter-spacing: -5px;
  color: #555;
  opacity: 0;
  transform: scale(0.72);
  animation: fmTextAppear 500ms ease-out 920ms forwards, fmTextBeat 1850ms ease-in-out 1550ms infinite;
}

.fm-splash-label {
  color: #607d8b;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-transform: uppercase;
  opacity: 0;
  animation: fmLabelIn 420ms ease-out 1180ms forwards;
}

@keyframes fmCardIn {
  from { opacity: 0; transform: translateY(12px) scale(0.96); }
  to { opacity: 1; transform: translateY(0) scale(1); }
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
  50% { transform: scale(1.055); }
}

@keyframes fmLabelIn {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fmSplashOut {
  to { opacity: 0; visibility: hidden; pointer-events: none; }
}

@media (max-width: 560px) {
  .fm-splash-card { width: min(210px, 76vw); border-radius: 28px; }
  .fm-logo-mark { width: min(132px, 54vw); height: min(132px, 54vw); }
  .fm-splash-label { font-size: 11px; }
}
</style>
