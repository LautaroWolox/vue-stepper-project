<template>
  <nav class="app-menu">
    <div class="mobile-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen"><span class="material-icons">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span></div>
    <div :class="['nav-items', { 'is-open': isMobileMenuOpen }]"><MenuItem v-for="(menu, index) in menuList" :key="index" :title="menu.title" :submenus="menu.submenus" @submenu-click="handleSubmenu" /></div>
    <div class="user-profile"><img src="https://ui-avatars.com/api/?name=Lautaro+Buson&background=fff&color=00bcd4&rounded=true&size=30" alt="Avatar" /><span style="margin-left: 5px;">Lautaro Buson</span><span class="material-icons" style="font-size: 16px;">arrow_drop_down</span><div class="user-submenu"><div @click="handleLogout"><span class="material-icons">logout</span> Cerrar Sesión</div></div></div>
    <div class="animated-bar"></div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import MenuItem from './MenuItem.vue'
import { useAuth } from '../../composables/useAuth.js'
const { logout } = useAuth()
const emit = defineEmits(['load-module'])
const isMobileMenuOpen = ref(false)
const handleLogout = () => logout()
const handleSubmenu = (item) => { isMobileMenuOpen.value = false; if (item.action && item.action !== 'none') emit('load-module', item.action); else alert(`Módulo en construcción: ${item.label}`) }
const menuList = ref([
  { title: 'Gestión del Extendido', submenus: [{ id: 1, label: 'Búsqueda Clásica', action: 'search-classic' }] },
  { title: 'Monitoreo', submenus: [] },
  { title: 'Administración', submenus: [] },
  { title: 'Gestión de Materiales', submenus: [{ id: 4, label: 'Errores de Gestión Sucursal', action: 'errores-gestion-sucursal' }, { id: 5, label: 'Gestionar Materiales en OTs', action: 'materiales-ot' }, { id: 7, label: 'Errores de Gestión', action: 'errores-gestion' }, { id: 8, label: 'Registro de OTs Fallidas', action: 'none' }, { id: 6, label: 'Materiales Descargados', action: 'materiales-descargados' }, { id: 9, label: 'Validación OT de Redes', action: 'none' }] },
  { title: 'Alarmas', submenus: [] },
  { title: 'GDA Operaciones', submenus: [] },
  { title: 'Reportes', submenus: [] },
  { title: 'Ordenes Trabajo', submenus: [] },
  { title: 'Web de Guardias', submenus: [] },
  { title: 'Agendamiento', submenus: [] },
  { title: 'Certificación Contratista', submenus: [{ id: 101, label: 'WorkAround', action: 'none' }, { id: 102, label: 'Gestión de Reglas', mobileExpanded: false, children: [{ id: 1021, label: 'Consultar Reglas', action: 'none' }, { id: 1022, label: 'Monitoreo y Ejecución de Reglas', action: 'none' }] }, { id: 103, label: 'Gestión de Actas', mobileExpanded: false, children: [{ id: 1031, label: 'Consultar Actas', action: 'consultar-actas' }, { id: 1032, label: 'Consultar Notas de Crédito', action: 'consultar-nota-credito' }, { id: 1033, label: 'Consultar Notas de Debito', action: 'consultar-nota-debito' }] }, { id: 104, label: 'Parametrizaciones', mobileExpanded: false, children: [{ id: 1041, label: 'Configuración Jobtype-Contrato', action: 'config-jobtype' }, { id: 1042, label: 'Configuración CMO-Actividad', action: 'config-cmo' }] }, { id: 105, label: 'Registro OTs Fallidas', action: 'registro-ots-fallidas' }, { id: 106, label: 'Búsqueda de OTs', action: 'none' }] }
])
</script>
