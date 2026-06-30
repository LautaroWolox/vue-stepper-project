<template><div class="ext-backdrop" @mousedown.self="$emit('close')"><div class="ext-modal"><div class="ext-head"><h3>Órdenes de Trabajo Externas</h3><button type="button" @click="$emit('close')">×</button></div></div></div></template>
<script setup>
defineEmits(['close'])
</script>
<style scoped>.ext-backdrop{position:fixed;inset:0;z-index:2500;background:rgba(38,50,56,.28);display:flex;align-items:center;justify-content:center}.ext-modal{width:810px;height:740px;background:#fff;border:1px solid #cfd8dc;box-shadow:0 18px 42px rgba(38,50,56,.28)}.ext-head{height:50px;display:flex;align-items:center;justify-content:space-between;padding:0 14px;border-bottom:1px solid #e0e0e0}.ext-head h3{font-size:16px;font-weight:400;margin:0}.ext-head button{border:0;background:transparent;font-size:24px;color:#b0bec5;cursor:pointer}</style>
