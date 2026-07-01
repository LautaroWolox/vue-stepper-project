<template>
  <div ref="root" class="materiales-date-picker" :class="{ disabled }">
    <button type="button" class="materiales-date-button" :class="{ active: open }" :disabled="disabled" @click="toggle">
      <span>{{ displayValue }}</span>
      <span class="material-icons">event</span>
    </button>

    <div v-if="open" class="materiales-calendar-popover">
      <div class="materiales-calendar-head">
        <button type="button" @click="previousMonth">‹</button>
        <div class="materiales-calendar-title">
          <select v-model.number="currentMonth" aria-label="Mes">
            <option v-for="(name, index) in monthNames" :key="name" :value="index">{{ name }}</option>
          </select>
          <select v-model.number="currentYear" aria-label="Año">
            <option v-for="year in yearOptions" :key="year" :value="year">{{ year }}</option>
          </select>
        </div>
        <button type="button" @click="nextMonth">›</button>
      </div>

      <div class="materiales-calendar-weekdays">
        <span v-for="day in weekDays" :key="day">{{ day }}</span>
      </div>

      <div class="materiales-calendar-days">
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

      <div class="materiales-calendar-actions">
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
  placeholder: { type: String, default: 'Seleccionar fecha' },
  disabled: { type: Boolean, default: false }
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
  return Array.from({ length: 21 }, (_, index) => base - 10 + index)
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

watch(() => props.disabled, (value) => {
  if (value) open.value = false
})

function toggle() {
  if (props.disabled) return
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

<style scoped>
.materiales-date-picker {
  position: relative;
  width: 100%;
}

.materiales-date-button {
  width: 100%;
  height: 30px;
  border: 1px solid #bdbdbd;
  border-radius: 3px;
  background: #fff;
  color: #263238;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  font-size: 12px;
  cursor: pointer;
  box-sizing: border-box;
  transition: border-color .15s ease, box-shadow .15s ease;
}

.materiales-date-button:hover,
.materiales-date-button:focus,
.materiales-date-button.active {
  outline: none;
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0,188,212,.20);
}

.materiales-date-button .material-icons {
  font-size: 16px;
  color: #00a9bd;
}

.materiales-date-picker.disabled .materiales-date-button,
.materiales-date-button:disabled {
  background: #eeeeee;
  color: #78909c;
  cursor: not-allowed;
  box-shadow: none;
}

.materiales-calendar-popover {
  position: absolute;
  z-index: 9500;
  top: 35px;
  left: 0;
  width: 286px;
  background: #fff;
  border: 1px solid #00bcd4;
  border-radius: 6px;
  box-shadow: 0 12px 30px rgba(0,0,0,.20);
  padding: 10px;
}

.materiales-calendar-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.materiales-calendar-head > button {
  width: 26px;
  height: 26px;
  border: 1px solid #d4e3e8;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  color: #00a9bd;
  font-size: 18px;
  line-height: 20px;
}

.materiales-calendar-head > button:hover {
  background: #e0f7fa;
}

.materiales-calendar-title {
  display: flex;
  gap: 6px;
}

.materiales-calendar-title select {
  height: 26px;
  border: 1px solid #c7d1d8;
  border-radius: 3px;
  background: #fff;
  font-size: 12px;
  outline: none;
  accent-color: #00bcd4;
}

.materiales-calendar-title select:focus {
  border-color: #00bcd4;
  box-shadow: 0 0 0 2px rgba(0,188,212,.15);
}

.materiales-calendar-weekdays,
.materiales-calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.materiales-calendar-weekdays span {
  font-size: 10px;
  font-weight: 700;
  text-align: center;
  color: #607d8b;
  padding: 3px 0;
}

.materiales-calendar-days button {
  height: 28px;
  border: 0;
  background: #fff;
  border-radius: 50%;
  cursor: pointer;
  font-size: 12px;
  color: #263238;
}

.materiales-calendar-days button:hover {
  background: #e0f7fa;
}

.materiales-calendar-days button.outside {
  color: #b0bec5;
}

.materiales-calendar-days button.today {
  box-shadow: inset 0 0 0 1px #00bcd4;
}

.materiales-calendar-days button.selected {
  background: #00bcd4;
  color: #fff;
  font-weight: 700;
}

.materiales-calendar-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  border-top: 1px solid #edf2f5;
  padding-top: 8px;
}

.materiales-calendar-actions button {
  border: 0;
  background: transparent;
  color: #00a9bd;
  cursor: pointer;
  font-size: 12px;
}

.materiales-calendar-actions button:hover {
  color: #008fa1;
  text-decoration: underline;
}
</style>
