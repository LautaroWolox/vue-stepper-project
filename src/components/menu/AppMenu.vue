<template>
  <nav class="app-menu">
    <div class="mobile-toggle" @click="isMobileMenuOpen = !isMobileMenuOpen">
      <span class="material-icons">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
    </div>

    <div :class="['nav-items', { 'is-open': isMobileMenuOpen }]">
      <MenuItem 
        v-for="(menu, index) in menuList" 
        :key="index"
        :title="menu.title" 
        :submenus="menu.submenus"
        @submenu-click="handleSubmenu"
      />
    </div>

    <div class="user-profile">
      <img src="https://ui-avatars.com/api/?name=Luffyl&background=fff&color=00bcd4&rounded=true&size=30" alt="Avatar" />
      <span style="margin-left: 5px;">Luffy</span>
      <span class="material-icons" style="font-size: 16px;">arrow_drop_down</span>
      
      <div class="user-submenu">
        <div @click="handleLogout">
          <span class="material-icons">logout</span> Cerrar Sesión
        </div>
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

// Cierre de sesión
const handleLogout = () => {
  logout()
}

// Emisor de módulos
const handleSubmenu = (sub) => {
  isMobileMenuOpen.value = false // Cierra el menú móvil al seleccionar algo
  if (sub.action === 'load-search') {
    emit('load-module')
  } else {
    alert(`Módulo en construcción: ${sub.label}`)
  }
}

// Estructura completa basada en la imagen 2
const menuList = ref([
  {
    title: 'Gestión del Extendido',
    submenus: [
      { id: 1, label: 'Cargar Módulo Búsqueda (Stepper)', icon: 'search', action: 'load-search' },
      { id: 2, label: 'Configuraciones Generales', icon: 'settings', action: 'none' }
    ]
  },
  {
    title: 'Monitoreo',
    submenus: [
      { id: 3, label: 'Dashboard en Tiempo Real', icon: 'speed', action: 'none' },
      { id: 4, label: 'Métricas de Red', icon: 'network_check', action: 'none' }
    ]
  },
  {
    title: 'Administración',
    submenus: [
      { id: 5, label: 'Usuarios y Roles', icon: 'people', action: 'none' },
      { id: 6, label: 'Parámetros del Sistema', icon: 'tune', action: 'none' }
    ]
  },
  {
    title: 'Gestión de Materiales',
    submenus: [
      { id: 7, label: 'Control de Stock', icon: 'inventory', action: 'none' },
      { id: 8, label: 'Solicitud de Insumos', icon: 'add_shopping_cart', action: 'none' }
    ]
  },
  {
    title: 'Alarmas',
    submenus: [
      { id: 9, label: 'Visor de Eventos', icon: 'notifications_active', action: 'none' },
      { id: 10, label: 'Histórico de Fallas', icon: 'history', action: 'none' }
    ]
  },
  {
    title: 'GDA Operaciones',
    submenus: [
      { id: 11, label: 'Panel de Control Operativo', icon: 'dashboard_customize', action: 'none' }
    ]
  },
  {
    title: 'Reportes',
    submenus: [
      { id: 12, label: 'Exportación Mensual', icon: 'picture_as_pdf', action: 'none' },
      { id: 13, label: 'Estadísticas de Cierre', icon: 'bar_chart', action: 'none' }
    ]
  },
  {
    title: 'Ordenes Trabajo',
    submenus: [
      { id: 14, label: 'Asignación de OT', icon: 'assignment_ind', action: 'none' },
      { id: 15, label: 'Seguimiento en Calle', icon: 'location_on', action: 'none' }
    ]
  },
  {
    title: 'Web de Guardias',
    submenus: [
      { id: 16, label: 'Turnos Activos', icon: 'calendar_month', action: 'none' }
    ]
  },
  {
    title: 'Agendamiento',
    submenus: [
      { id: 17, label: 'Calendario de Tareas', icon: 'event', action: 'none' }
    ]
  },
  {
    title: 'Certificación Contratista',
    submenus: [
      { id: 18, label: 'Validar Documentación', icon: 'verified', action: 'none' }
    ]
  }
])
</script>