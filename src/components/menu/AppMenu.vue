<template>
  <nav class="app-menu">
    <div class="mobile-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen">
      <span class="material-icons">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
    </div>

    <div :class="['nav-items', { 'is-open': isMobileMenuOpen }]">
      <MenuItem v-for="(menu, index) in menuList" :key="index" :title="menu.title" :submenus="menu.submenus" @submenu-click="handleSubmenu" />
    </div>

    <div class="user-profile">
      <img src="https://ui-avatars.com/api/?name=Lautaro+Buson&background=fff&color=00bcd4&rounded=true&size=30" alt="Avatar" />
      <span style="margin-left: 5px;">Lautaro Buson</span>
      <span class="material-icons" style="font-size: 16px;">arrow_drop_down</span>
      <div class="user-submenu">
        <div @click="handleLogout"><span class="material-icons">logout</span> Cerrar Sesión</div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import MenuItem from './MenuItem.vue'
import { useAuth } from '../../composables/useAuth.js'

const { logout } = useAuth()
const emit = defineEmits(['load-module'])
const isMobileMenuOpen = ref(false)

const handleLogout = () => {
  logout()
}

const handleSubmenu = (sub) => {
  isMobileMenuOpen.value = false
  if (sub.action && sub.action !== 'none') {
    emit('load-module', sub.action)
  } else {
    alert(`Módulo en construcción: ${sub.label}`)
  }
}

const menuList = ref([
  {
    title: 'Gestión de Materiales',
    submenus: [
      { id: 1, label: 'Gestionar Materiales en OTs', icon: 'build', action: 'materiales-ot' },
      { id: 2, label: 'Materiales Descargados', icon: 'download', action: 'materiales-descargados' }
    ]
  },
  {
    title: 'Gestión del Extendido',
    submenus: [
      { id: 3, label: 'Búsqueda Clásica', icon: 'search', action: 'search-classic' },
      { id: 4, label: 'Configuraciones Generales', icon: 'settings', action: 'none' }
    ]
  },
  {
    title: 'Monitoreo',
    submenus: [
      { id: 5, label: 'Dashboard en Tiempo Real', icon: 'speed', action: 'none' }
    ]
  },
  {
    title: 'Administración',
    submenus: [
      { id: 6, label: 'Usuarios y Roles', icon: 'people', action: 'none' }
    ]
  },
  {
    title: 'Alarmas',
    submenus: [
      { id: 7, label: 'Visor de Eventos', icon: 'notifications_active', action: 'none' }
    ]
  },
  {
    title: 'Reportes',
    submenus: [
      { id: 8, label: 'Exportación Mensual', icon: 'picture_as_pdf', action: 'none' }
    ]
  }
])
</script>