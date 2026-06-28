<template>
  <div class="menu-item">
    <span class="material-icons">{{ icon }}</span>
    {{ title }}
    <span v-if="submenus.length" class="material-icons" style="font-size: 16px;">expand_more</span>
    
    <div class="submenu" v-if="submenus.length">
      <div v-for="sub in submenus" :key="sub.id" @click.stop="$emit('submenu-click', sub)">
        <span class="material-icons" style="font-size: 18px;">{{ sub.icon }}</span>
        {{ sub.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['title', 'icon', 'submenus'])
</script>