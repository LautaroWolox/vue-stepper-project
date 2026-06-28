<template>
  <nav class="app-menu">
    <MenuItem 
      title="Gestión Principal" 
      icon="dashboard"
      :submenus="[
        { id: 1, label: 'Cargar Módulo Búsqueda', icon: 'search' },
        { id: 2, label: 'Configuraciones', icon: 'settings' }
      ]"
      @submenu-click="handleSubmenu"
    />
    <MenuItem title="Reportes" icon="assessment" :submenus="[]" />
  </nav>
</template>

<script setup>
import MenuItem from './MenuItem.vue'

const emit = defineEmits(['load-module'])
const handleSubmenu = (sub) => {
  if (sub.id === 1) emit('load-module')
}
</script>