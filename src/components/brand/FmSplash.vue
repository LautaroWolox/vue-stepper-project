<template>
  <div class="fm-brand" aria-label="Field Manager">
    <div class="fm-logo-orb">
      <svg class="fm-logo-svg" viewBox="0 0 220 220" role="img" aria-hidden="true">
        <defs>
          <linearGradient id="fmTealGradient" x1="28" y1="34" x2="174" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0" stop-color="#00c8cf" />
            <stop offset="1" stop-color="#009da7" />
          </linearGradient>
          <filter id="fmSoftShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#00838f" flood-opacity="0.14" />
          </filter>
        </defs>

        <circle class="fm-logo-halo" cx="110" cy="110" r="82" />
        <path
          class="fm-logo-ring"
          filter="url(#fmSoftShadow)"
          d="M66 45 H113 C150 45 181 76 181 113 C181 155 149 187 110 187 C68 187 39 155 39 113 V45"
        />
        <rect class="fm-logo-square" x="39" y="30" width="15" height="15" rx="2" />
      </svg>

      <div class="fm-logo-text" aria-hidden="true">
        <span>F</span><span>M</span>
      </div>
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
  width: min(330px, 52vw);
  aspect-ratio: 1;
  pointer-events: none;
}

.fm-logo-orb {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fm-logo-svg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.fm-logo-halo {
  fill: #ffffff;
  opacity: 0.48;
  transform-origin: 110px 110px;
  animation: fmHaloIn 650ms ease-out both;
}

.fm-logo-ring {
  fill: none;
  stroke: url(#fmTealGradient);
  stroke-width: 16;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 460;
  stroke-dashoffset: 460;
  animation: fmRingDraw 1200ms cubic-bezier(0.22, 1, 0.36, 1) 120ms forwards;
}

.fm-logo-square {
  fill: #4f4f4f;
  opacity: 0;
  animation: fmSquareIn 360ms ease-out 180ms forwards;
}

.fm-logo-text {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-family: 'Roboto', Arial, sans-serif;
  font-size: clamp(64px, 10vw, 96px);
  font-weight: 900;
  letter-spacing: -7px;
  color: #686868;
  opacity: 0;
  transform: scale(0.82);
  animation: fmTextIn 520ms ease-out 850ms forwards, fmTextBeat 2300ms ease-in-out 1500ms infinite;
}

.fm-logo-text span {
  display: inline-block;
  line-height: 0.9;
}

@keyframes fmHaloIn {
  from { opacity: 0; transform: scale(0.88); }
  to { opacity: 0.48; transform: scale(1); }
}

@keyframes fmRingDraw {
  to { stroke-dashoffset: 0; }
}

@keyframes fmSquareIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fmTextIn {
  from { opacity: 0; transform: scale(0.82); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes fmTextBeat {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.035); opacity: 0.96; }
}

@media (max-width: 768px) {
  .fm-brand {
    width: min(285px, 70vw);
  }

  .fm-logo-text {
    font-size: clamp(54px, 17vw, 82px);
    letter-spacing: -6px;
  }
}

@media (max-width: 420px) {
  .fm-brand {
    width: min(235px, 78vw);
  }

  .fm-logo-text {
    font-size: clamp(46px, 20vw, 72px);
    letter-spacing: -5px;
  }
}
</style>
