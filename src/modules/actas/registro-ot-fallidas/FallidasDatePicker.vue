<template>
  <div ref="root" class="fallidas-date-picker">
    <button type="button" class="fallidas-date-button" :class="{ active: open }" @click="toggle">
      <span>{{ displayValue }}</span>
      <span class="material-icons">event</span>
    </button>

    <div v-if="open" class="fallidas-calendar-popover">
      <div class="fallidas-calendar-head">
        <button type="button" @click="previousMonth">‹</button>
        <div class="fallidas-calendar-title">
          <strong>{{ monthNames[currentMonth] }}</strong>
          <select v-model.number="currentYear" aria-label="Año">
            <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <button type="button" @click="nextMonth">›</button>
      </div>

      <div class="fallidas-calendar-weekdays">
        <span v-for="day in weekDays" :key="day">{{ day }}</span>
      </div>

      <div class="fallidas-calendar-days">
        <button
          v-for="day in days"
          :key="`${day.date}-${day.outside}`"
          type="button"
          :class="{ outside: day.outside, selected: day.date === modelValue, today: day.date === today }"
          @click="selectDate(day.date)"
        >
          {{ day.day }}
        </button>
      </div>

      <div class="fallidas-calendar-actions">
        <button type="button" @click="clearDate">Borrar</button>
        <button type="button" @click="selectDate(today)">Hoy</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])

const root = ref(null)
const open = ref(false)
const now = new Date()
const today = toDateString(now)
const currentYear = ref(props.modelValue ? Number(props.modelValue.slice(0, 4)) : now.getFullYear())
const currentMonth = ref(props.modelValue ? Number(props.modelValue.slice(5, 7)) - 1 : now.getMonth())
const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const weekDays = ['DO', 'LU', 'MA', 'MI', 'JU', 'VI', 'SA']
const yearOptions = computed(() => {
  const base = now.getFullYear()
  return Array.from({ length: 31 }, (_, index) => base - 15 + index)
})

const displayValue = computed(() => props.modelValue ? formatDisplay(props.modelValue) : props.placeholder)
const days = computed(() => {
  const first = new Date(currentYear.value, currentMonth.value, 1)
  const start = new Date(first)
  start.setDate(first.getDate() - first.getDay())
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return {
      date: toDateString(date),
      day: date.getDate(),
      outside: date.getMonth() !== currentMonth.value
    }
  })
})

watch(() => props.modelValue, (value) => {
  if (!value) return
  currentYear.value = Number(value.slice(0, 4))
  currentMonth.value = Number(value.slice(5, 7)) - 1
})

function toggle() {
  open.value = !open.value
}
function close() {
  open.value = false
}
function previousMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
}
function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
}
function selectDate(date) {
  emit('update:modelValue', date)
  nextTick(close)
}
function clearDate() {
  emit('update:modelValue', '')
  close()
}
function handleDocumentMouseDown(event) {
  if (!root.value || root.value.contains(event.target)) return
  close()
}
function toDateString(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
function formatDisplay(value) {
  const [year, month, day] = value.split('-')
  return `${day}/${month}/${year}`
}

onMounted(() => document.addEventListener('mousedown', handleDocumentMouseDown))
onBeforeUnmount(() => document.removeEventListener('mousedown', handleDocumentMouseDown))
</script>
