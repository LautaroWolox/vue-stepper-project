<template>
  <button
    class="fm-button"
    :class="[`fm-button--${variant}`, { 'fm-button--small': small, 'fm-button--disabled': disabled }]"
    :type="type"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: { type: String, default: 'button' },
  variant: { type: String, default: 'primary' },
  small: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

defineEmits(['click'])
</script>

<style scoped>
.fm-button{border-radius:18px;border:1px solid #00a9bd;background:#00a9bd;color:#fff;padding:8px 18px;font-size:13px;font-weight:400;line-height:1;cursor:pointer;transition:background-color .18s ease,border-color .18s ease,box-shadow .18s ease,opacity .18s ease}.fm-button:hover:not(:disabled){background:#008fa1;border-color:#008fa1;box-shadow:0 4px 10px rgba(0,143,161,.22)}.fm-button--secondary{background:#fff;color:#00a9bd}.fm-button--secondary:hover:not(:disabled){background:#e0f7fa;color:#006f7f}.fm-button--danger{background:#d9534f;border-color:#d9534f}.fm-button--danger:hover:not(:disabled){background:#b94340;border-color:#b94340}.fm-button--small{padding:6px 13px;font-size:12px}.fm-button--disabled,.fm-button:disabled{opacity:.55;cursor:not-allowed;box-shadow:none}
</style>