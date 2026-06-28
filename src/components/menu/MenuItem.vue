<template>
  <div class="menu-item" @click="toggleMobileSubmenu">
    {{ title }}
    <span v-if="submenus && submenus.length" class="material-icons" style="font-size: 16px; margin-left: 5px;">expand_more</span>
    
    <div class="submenu" :style="{ display: isMobileOpen ? 'block' : '' }" v-if="submenus && submenus.length">
      <div 
        v-for="sub in submenus" 
        :key="sub.id" 
        class="submenu-item"
        @click.stop="handleSubClick(sub)"
      >
        <span>{{ sub.label }}</span>
        <span v-if="sub.children && sub.children.length" class="material-icons" style="font-size: 14px; color: #b0bec5;">play_arrow</span>

        <div class="nested-submenu" v-if="sub.children && sub.children.length" :style="{ display: sub.mobileExpanded ? 'block' : '' }">
          <div 
            v-for="child in sub.children" 
            :key="child.id" 
            class="nested-item"
            @click.stop="executeAction(child)"
          >
            {{ child.label }}
          </div>
        </div>
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
  if (window.innerWidth <= 1100) isMobileOpen.value = !isMobileOpen.value
}

const handleSubClick = (sub) => {
  if (sub.children && sub.children.length) {
    if (window.innerWidth <= 1100) sub.mobileExpanded = !sub.mobileExpanded
    return 
  }
  executeAction(sub)
}

const executeAction = (item) => {
  if (window.innerWidth <= 1100) isMobileOpen.value = false
  emit('submenu-click', item) 
}
</script>