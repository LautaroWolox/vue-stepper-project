<template>
  <div class="menu-item" @click="toggleMobileSubmenu">
    {{ title }}
    <span v-if="submenus.length" class="material-icons" style="font-size: 16px; margin-left: auto;">expand_more</span>
    
    <div class="submenu" :style="{ display: isMobileOpen ? 'block' : '' }" v-if="submenus.length">
      <div v-for="sub in submenus" :key="sub.id" @click.stop="handleSubClick(sub)">
        <span class="material-icons" style="font-size: 18px;">{{ sub.icon }}</span>
        {{ sub.label }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps(['title', 'submenus'])
const emit = defineEmits(['submenu-click'])

const isMobileOpen = ref(false)

const toggleMobileSubmenu = () => {
  // Solo aplica si estamos en pantalla pequeña (donde no funciona el :hover igual que en PC)
  if (window.innerWidth <= 1100) {
    isMobileOpen.value = !isMobileOpen.value
  }
}

const handleSubClick = (sub) => {
  isMobileOpen.value = false // Cierra el menú al hacer click
  emit('submenu-click', sub)
}
</script>