<template>
  <span class="material-icons fm-icon">{{ name }}</span>
</template>

<script setup>
defineProps({
  name: { type: String, required: true }
})
</script>

<style scoped>
.fm-icon{font-size:18px;line-height:1;vertical-align:middle}.fm-icon:hover{color:#00a9bd}
</style>
