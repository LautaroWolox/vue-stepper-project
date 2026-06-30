<template>
  <div class="fm-typing-loader" :class="{ overlay, compact }" role="status" aria-live="polite">
    <div class="fm-typing-card">
      <div class="typing-person" aria-hidden="true">
        <div class="person-head"></div>
        <div class="person-body"></div>
        <div class="person-arm left"></div>
        <div class="person-arm right"></div>
        <div class="person-screen"><span></span><span></span><span></span></div>
        <div class="person-keyboard"><i></i><i></i><i></i><i></i></div>
      </div>
      <div class="fm-typing-text">
        <strong>{{ title }}</strong>
        <span>{{ message }}</span>
      </div>
      <div class="fm-progress"><span></span></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: 'Cargando' },
  message: { type: String, default: 'Preparando la información...' },
  overlay: { type: Boolean, default: false },
  compact: { type: Boolean, default: false }
})
</script>

<style scoped>
.fm-typing-loader{width:100%;min-height:170px;display:flex;align-items:center;justify-content:center;padding:18px;color:#263238}.fm-typing-loader.overlay{position:absolute;inset:0;z-index:30;min-height:100%;background:rgba(255,255,255,.78);backdrop-filter:blur(1px)}.fm-typing-card{width:min(340px,96%);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:18px 20px;border:1px solid rgba(0,188,212,.22);border-radius:12px;background:linear-gradient(180deg,#fff 0%,#f5fcfd 100%);box-shadow:0 12px 32px rgba(38,50,56,.14)}.fm-typing-loader.compact{min-height:105px;padding:10px}.fm-typing-loader.compact .fm-typing-card{width:min(250px,94%);padding:12px 14px;box-shadow:none;border-color:transparent;background:transparent}.typing-person{position:relative;width:150px;height:112px}.person-head{position:absolute;left:63px;top:6px;width:30px;height:30px;border-radius:50%;background:#ffccbc;border:2px solid #37474f}.person-head:before{content:"";position:absolute;left:-3px;top:-7px;width:36px;height:15px;border-radius:16px 16px 6px 6px;background:#37474f}.person-body{position:absolute;left:54px;top:39px;width:48px;height:46px;border-radius:22px 22px 8px 8px;background:#00a9bd}.person-screen{position:absolute;left:4px;top:45px;width:60px;height:42px;border-radius:6px;background:#263238;padding:9px 8px;box-shadow:0 5px 0 #78909c}.person-screen span{display:block;height:3px;margin-bottom:7px;border-radius:3px;background:#80deea;animation:linePulse 1.1s ease-in-out infinite}.person-screen span:nth-child(2){width:80%;animation-delay:.18s}.person-screen span:nth-child(3){width:55%;animation-delay:.32s}.person-keyboard{position:absolute;left:78px;top:82px;width:64px;height:16px;border-radius:5px;background:#cfd8dc;display:flex;align-items:center;justify-content:center;gap:8px}.person-keyboard i{width:5px;height:5px;border-radius:50%;background:#008fa1;animation:keyBounce .55s ease-in-out infinite}.person-keyboard i:nth-child(2){animation-delay:.1s}.person-keyboard i:nth-child(3){animation-delay:.2s}.person-keyboard i:nth-child(4){animation-delay:.3s}.person-arm{position:absolute;top:62px;width:38px;height:9px;border-radius:9px;background:#ffab91;transform-origin:right center}.person-arm.left{left:57px;transform:rotate(23deg);animation:typeLeft .42s ease-in-out infinite alternate}.person-arm.right{left:83px;transform:rotate(-23deg);animation:typeRight .38s ease-in-out infinite alternate}.fm-typing-loader.compact .typing-person{width:110px;height:82px;transform:scale(.78)}.fm-typing-text{text-align:center;display:flex;flex-direction:column;gap:3px}.fm-typing-text strong{font-size:14px;font-weight:600;color:#006f7f}.fm-typing-text span{font-size:12px;color:#607d8b}.fm-progress{width:100%;height:4px;overflow:hidden;border-radius:999px;background:#e0f2f5;margin-top:6px}.fm-progress span{display:block;width:42%;height:100%;border-radius:inherit;background:#00a9bd;animation:progressMove 1.15s ease-in-out infinite}@keyframes typeLeft{from{transform:rotate(19deg) translateY(0)}to{transform:rotate(27deg) translateY(2px)}}@keyframes typeRight{from{transform:rotate(-27deg) translateY(1px)}to{transform:rotate(-18deg) translateY(0)}}@keyframes keyBounce{0%,100%{transform:translateY(0);opacity:.55}50%{transform:translateY(-4px);opacity:1}}@keyframes linePulse{0%,100%{opacity:.45}50%{opacity:1}}@keyframes progressMove{0%{transform:translateX(-115%)}55%{transform:translateX(60%)}100%{transform:translateX(250%)}}@media(max-width:560px){.fm-typing-card{padding:14px 16px}.typing-person{transform:scale(.86)}}
</style>
