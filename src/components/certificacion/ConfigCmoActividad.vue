<template>
  <div>
    <div class="soft-accordion">
      <div class="soft-accordion-header" @click="openFilters = !openFilters">
        <span><span class="material-icons">filter_alt</span> FILTROS DE BÚSQUEDA</span>
        <span class="material-icons">{{ openFilters ? 'remove' : 'add' }}</span>
      </div>
      <div class="soft-accordion-content" v-show="openFilters" style="text-align: center; padding: 30px;">
        <button class="btn" style="border-radius: 20px; padding: 10px 40px; background: #00bcd4; font-size: 14px;" @click="handleSearch">
          BUSCAR
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="main-loader-container">
      <svg class="svg-coder" viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="120" width="180" height="8" fill="#B0BEC5" rx="4"/>
        <rect x="55" y="95" width="10" height="25" fill="#78909C"/>
        <rect x="40" y="115" width="40" height="5" fill="#607D8B" rx="2"/>
        <rect x="20" y="35" width="80" height="60" fill="#263238" rx="5"/>
        <rect x="25" y="40" width="70" height="45" fill="#00BCD4" class="screen-glow" rx="2"/>
        <g class="code-lines">
          <rect x="30" y="45" width="40" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0s;"/>
          <rect x="30" y="52" width="50" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.2s;"/>
          <rect x="30" y="59" width="30" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.4s;"/>
          <rect x="30" y="66" width="45" height="3" fill="#ffffff" class="code-line" style="animation-delay: 0.6s;"/>
        </g>
        <rect x="85" y="116" width="40" height="4" fill="#455A64" transform="skewX(-20)"/>
        <path d="M120,120 Q130,70 150,70 Q170,70 180,120 Z" fill="#0097A7"/>
        <circle cx="150" cy="50" r="18" fill="#FFB74D"/>
        <path d="M132,45 Q150,30 168,45" stroke="#3E2723" stroke-width="6" fill="none" stroke-linecap="round"/>
        <rect x="135" y="46" width="8" height="12" fill="#37474F" rx="3"/>
        <path class="arm-left" d="M160,85 Q130,95 105,115" stroke="#00838F" stroke-width="10" fill="none" stroke-linecap="round"/>
        <path class="arm-right" d="M140,85 Q115,100 90,115" stroke="#00BCD4" stroke-width="10" fill="none" stroke-linecap="round"/>
      </svg>
      <span style="margin-top: 15px;">{{ loadingMsg }}</span>
    </div>

    <div class="soft-accordion" v-if="hasSearched && !isLoading">
      <div class="soft-accordion-header" @click="openResults = !openResults">
        <span><span class="material-icons">list</span> RELACIONES CMO-ACTIVIDAD</span>
        <span class="material-icons">{{ openResults ? 'remove' : 'add' }}</span>
      </div>
      <div class="soft-accordion-content" v-show="openResults" style="padding: 0;">
        <GridCmoActividad 
          :data="gridData" 
          @edit-row="openEdit"
          @add-row="openAlta"
        />
      </div>
    </div>

    <EditCmoPopup 
      :show="showEditPopup" 
      :data="selectedForEdit" 
      :position="popupPos"
      @close="showEditPopup = false"
      @update="handleUpdate"
    />

    <AltaCmoPopup 
      :show="showAltaPopup" 
      :position="popupPos"
      @close="showAltaPopup = false"
      @add-relations="handleNewRelations"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import GridCmoActividad from './GridCmoActividad.vue'
import EditCmoPopup from '../popup/EditCmoPopup.vue'
import AltaCmoPopup from '../popup/AltaCmoPopup.vue'

const openFilters = ref(true)
const openResults = ref(true)
const hasSearched = ref(false)
const isLoading = ref(false)
const loadingMsg = ref('')

const showEditPopup = ref(false)
const showAltaPopup = ref(false)
const selectedForEdit = ref(null)
const popupPos = ref({ x: 0, y: 0 })

const gridData = ref([])

const handleSearch = () => {
  openFilters.value = false
  hasSearched.value = true
  isLoading.value = true
  loadingMsg.value = 'Buscando configuraciones CMO-Actividad en el servidor...'

  setTimeout(() => {
    // 100 Registros reales del CSV que proveíste
    gridData.value = [{"id": 1, "cod_act": "WS9035", "desc_act": "Instalar DECO secundario Flow en cte activo", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 2, "cod_act": "WS8035", "desc_act": "Se instaló DECO secundario Flow en cte activo", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "07/05/2025 10:27", "activo": "N", "disabled": true}, {"id": 3, "cod_act": "WS8035", "desc_act": "Se instaló DECO secundario Flow en cte activo", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "02/07/2025 22:27", "activo": "S", "disabled": false}, {"id": 4, "cod_act": "WS800122", "desc_act": "Se instaló DECO secundario Full IP", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "18/10/2024 12:08", "activo": "S", "disabled": false}, {"id": 5, "cod_act": "WS800018", "desc_act": "Se instaló DECO Full IP", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "18/10/2024 12:08", "activo": "S", "disabled": false}, {"id": 6, "cod_act": "WS7995", "desc_act": "Se instaló DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "07/05/2025 10:27", "activo": "N", "disabled": true}, {"id": 7, "cod_act": "WS7995", "desc_act": "Se instaló DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "02/07/2025 22:27", "activo": "S", "disabled": false}, {"id": 8, "cod_act": "WS7835", "desc_act": "Instalar DECO Flow en cte activo", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 9, "cod_act": "WS7795", "desc_act": "Instalar DECO Flow - Venta sin int", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 10, "cod_act": "WR9035", "desc_act": "Retirar DECO secundario Flow con baja de Cte", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 11, "cod_act": "WR8035", "desc_act": "Se retiró DECO secundario Flow con baja de cte", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "07/05/2025 10:27", "activo": "N", "disabled": true}, {"id": 12, "cod_act": "WR8035", "desc_act": "Se retiró DECO secundario Flow con baja de cte", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "02/07/2025 22:27", "activo": "S", "disabled": false}, {"id": 13, "cod_act": "WR800122", "desc_act": "Se retiró DECO secundario Full IP", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "18/10/2024 12:08", "activo": "S", "disabled": false}, {"id": 14, "cod_act": "WR800018", "desc_act": "Se retiró DECO Full IP", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "18/10/2024 12:08", "activo": "S", "disabled": false}, {"id": 15, "cod_act": "WR7995", "desc_act": "Se retiró DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "07/05/2025 10:27", "activo": "N", "disabled": true}, {"id": 16, "cod_act": "WR7995", "desc_act": "Se retiró DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "02/07/2025 22:27", "activo": "S", "disabled": false}, {"id": 17, "cod_act": "WR7835", "desc_act": "Retirar DECO Flow con baja de Cte", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 18, "cod_act": "WM9035", "desc_act": "Modificar a DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 19, "cod": "WM8035", "desc_act": "Se modificó a DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "07/05/2025 10:27", "activo": "N", "disabled": true}, {"id": 20, "cod_act": "WM8035", "desc_act": "Se modificó a DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "02/07/2025 22:27", "activo": "S", "disabled": false}, {"id": 21, "cod_act": "WM800122", "desc_act": "Se modificó a DECO secundario Full IP", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "18/10/2024 12:08", "activo": "S", "disabled": false}, {"id": 22, "cod_act": "WM800018", "desc_act": "Se modificó a DECO Full IP", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "18/10/2024 12:08", "activo": "S", "disabled": false}, {"id": 23, "cod_act": "WM7995", "desc_act": "Se modificó a DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "07/05/2025 10:27", "activo": "N", "disabled": true}, {"id": 24, "cod_act": "WM7995", "desc_act": "Se modificó a DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "02/07/2025 22:27", "activo": "S", "disabled": false}, {"id": 25, "cod_act": "WM7835", "desc_act": "Modificar a DECO Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 26, "cod_act": "WC9035", "desc_act": "Cambiar DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 27, "cod_act": "WC8035", "desc_act": "Se cambió DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "07/05/2025 10:27", "activo": "N", "disabled": true}, {"id": 28, "cod_act": "WC8035", "desc_act": "Se cambió DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "02/07/2025 22:27", "activo": "S", "disabled": false}, {"id": 29, "cod_act": "WC800122", "desc_act": "Se cambió DECO secundario Full IP", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "18/10/2024 12:08", "activo": "S", "disabled": false}, {"id": 30, "cod_act": "WC800018", "desc_act": "Se cambió DECO Full IP", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "18/10/2024 12:08", "activo": "S", "disabled": false}, {"id": 31, "cod_act": "WC7995", "desc_act": "Se cambió DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "07/05/2025 10:27", "activo": "N", "disabled": true}, {"id": 32, "cod_act": "WC7995", "desc_act": "Se cambió DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "02/07/2025 22:27", "activo": "S", "disabled": false}, {"id": 33, "cod_act": "WC7835", "desc_act": "Cambiar DECO Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 34, "cod_act": "W044", "desc_act": "Habilitar línea en Central e interconectar en Df", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 35, "cod_act": "W020", "desc_act": "Acometer con ADSL Linea / Extensión", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 36, "cod_act": "W010", "desc_act": "Instalar Modem ADSL", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 37, "cod_act": "U9048", "desc_act": "RETIRO DE DECO / MODEM ADICIONAL CON DEUDA - EMPRESA - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 38, "cod_act": "U9046", "desc_act": "RETIRO DE DECO / MODEM ADICIONAL - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 39, "cod_act": "U9044", "desc_act": "MUDANZA DE SERVICIO EMPRESA C/ EQUIPOS - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 40, "cod_act": "U9042", "desc_act": "MUDANZA DE SERVICIO C/ EQUIPOS - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 41, "cod_act": "U9040", "desc_act": "CAMBIO DE DECO / MODEM - EMPRESA - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 42, "cod_act": "U9038", "desc_act": "CAMBIO DE DECO / MODEM - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 43, "cod_act": "U9036", "desc_act": "AGREGADO DE DECO / MODEM - EMPRESA - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 44, "cod_act": "U9034", "desc_act": "AGREGADO DE DECO / MODEM - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 45, "cod_act": "U9032", "desc_act": "SERVICIO TECNICO - EMPRESA - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 46, "cod_act": "U9030", "desc_act": "SERVICIO TECNICO FIBERTEL - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 47, "cod_act": "U9028", "desc_act": "SERVICIO TECNICO CABLEVISION - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 48, "cod_act": "U9026", "desc_act": "RECONEXION CON DEUDA - EMPRESA - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 49, "cod_act": "U9024", "desc_act": "RECONEXION - EMPRESA - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 50, "cod_act": "U9022", "desc_act": "RECONEXION CON DEUDA - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 51, "cod_act": "U9020", "desc_act": "RECONEXION - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 52, "cod_act": "U9018", "desc_act": "RETIRO DE EQUIPO EN DOMICILIO CON DEUDA - EMPRESA - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 53, "cod_act": "U9016", "desc_act": "RETIRO DE EQUIPO EN DOMICILIO - EMPRESA - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 54, "cod_act": "U9014", "desc_act": "RETIRO DE EQUIPOS EN DOMICILIO CON DEUDA - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 55, "cod_act": "U9012", "desc_act": "RETIRO DE EQUIPOS EN DOMICILIO - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 56, "cod_act": "U9010", "desc_act": "CORTE DESDE EL POSTE POR DEUDA - EMPRESA - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 57, "cod_act": "U9008", "desc_act": "CORTE DESDE EL POSTE - EMPRESA - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 58, "cod_act": "U9006", "desc_act": "CORTE DESDE EL POSTE POR DEUDA - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 59, "cod_act": "U9004", "desc_act": "CORTE DESDE EL POSTE - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 60, "cod_act": "U9002", "desc_act": "INSTALACION - EMPRESA - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 61, "cod_act": "U9000", "desc_act": "INSTALACION - P/I", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 62, "cod_act": "TX09", "desc_act": "RESERVAR PUERTOS", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 63, "cod_act": "TX08", "desc_act": "RECUPERAR ODF", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 64, "cod_act": "TX07", "desc_act": "COLOCAR CAJA ODF", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 65, "cod_act": "TX06", "desc_act": "PREPARAR TRONCAL OPTICO CABLE ALIMENTACION TX", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 66, "cod_act": "TX05", "desc_act": "ILUMINAR RACK", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 67, "cod_act": "TX04", "desc_act": "ARMAR MODULO PDU", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 68, "cod_act": "TX03", "desc_act": "ARMAR BANDEJA FIBRA TX", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 69, "cod_act": "TX02", "desc_act": "AMURAR RACK", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 70, "cod_act": "TX01", "desc_act": "TENDIDO CABLE TX", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 71, "cod_act": "TR09", "desc_act": "DESARMAR RACK", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 72, "cod_act": "TR08", "desc_act": "RETIRAR EQUIPO ACCESO RACK", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 73, "cod_act": "TR07", "desc_act": "RETIRAR BANDEJA TX", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 74, "cod_act": "TR06", "desc_act": "RETIRAR MODULO PDU", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 75, "cod_act": "TR05", "desc_act": "RETIRAR RECTIFICADOR", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 76, "cod_act": "TR04", "desc_act": "DESENERGIZAR RACK", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 77, "cod_act": "TR03", "desc_act": "LIBERAR PUERTOS BANDEJA FIBRA TX", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 78, "cod_act": "TR02", "desc_act": "DESARMAR TENDIDO ALIMENTACION", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 79, "cod_act": "TR01", "desc_act": "DESARMAR TENDIDO FO", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 80, "cod_act": "TI11", "desc_act": "INSPECCION OBRAS EXTERNAS", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 81, "cod_act": "TE39", "desc_act": "MANTENIMIENTO PREVENTIVO CAMARAS", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 82, "cod_act": "TE38", "desc_act": "MANTENIMIENTO CORRECTIVO GRUPO ELECTROGENO", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 83, "cod_act": "TE37", "desc_act": "REPARACION CALEFACCION", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 84, "cod_act": "TE36", "desc_act": "REPARACION ALARMA INCENDIO", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 85, "cod_act": "TE35", "desc_act": "CAMBIO EXTINTORES", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 86, "cod_act": "TE34", "desc_act": "INSPECCION GRUPO ELECTROGENO FIJO", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 87, "cod_act": "TE33", "desc_act": "INSPECCION EDILICIA EDIFICIOS P2", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 88, "cod_act": "TE32", "desc_act": "INSPECCION EDILICIA EDIFICIOS P1", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 89, "cod_act": "TE31", "desc_act": "TAREAS DE INFRAESTRUCTURA Y SERVICIOS GENERALES EDIFICIOS", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 90, "cod_act": "TE30", "desc_act": "MANTENIMIENTO DE CABLEADO Y BANDEJAS EXISTENTES EDIFICIOS", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 91, "cod_act": "TE29", "desc_act": "MANTENIMIENTO CORRECTIVO SISTEMAS DE BALIZAMIENTO", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 92, "cod_act": "TE28", "desc_act": "VERIFICACION Y MEDICION DE ESTRUCTURAS - EDIFICIOS", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 93, "cod_act": "TE27", "desc_act": "TAREAS DE CABLEADO Y BANDEJAS NUEVAS - EDIFICIOS", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 94, "cod_act": "S8035", "desc_act": "Se desinstaló DECO secundario Flow en cte activo", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "07/05/2025 10:27", "activo": "N", "disabled": true}, {"id": 95, "cod_act": "S8035", "desc_act": "Se desinstaló DECO secundario Flow en cte activo", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "02/07/2025 22:27", "activo": "S", "disabled": false}, {"id": 96, "cod_act": "S7995", "desc_act": "Se desinstaló DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "07/05/2025 10:27", "activo": "N", "disabled": true}, {"id": 97, "cod_act": "S7995", "desc_act": "Se desinstaló DECO secundario Flow", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "FieldManager", "fecha": "02/07/2025 22:27", "activo": "S", "disabled": false}, {"id": 98, "cod_act": "S000000", "desc_act": "RESETEO DE CAJA DE CALLE", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}, {"id": 99, "cod_act": "RM01", "desc_act": "REPARACION / RECAMBIO CABLE CANAL DE MANGUERA DE COBRE", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "14/07/2022 00:32", "activo": "S", "disabled": false}, {"id": 100, "cod_act": "P101", "desc_act": "P101 INSTALACIÓN DE ACOMETIDA EXTENSIÓN HASTA 15 MTS", "cod_s4": "0000001", "cmo": "NO HAY CMO", "usu": "Field Manager", "fecha": "22/07/2025 11:09", "activo": "S", "disabled": false}]
    isLoading.value = false
  }, 1500)
}

const openEdit = (event, row) => {
  selectedForEdit.value = row
  popupPos.value = { 
    x: event.clientX > window.innerWidth - 450 ? window.innerWidth - 450 : event.clientX, 
    y: event.clientY > window.innerHeight - 300 ? window.innerHeight - 300 : event.clientY 
  }
  showEditPopup.value = true
}

const openAlta = (event) => {
  popupPos.value = { 
    x: event.clientX > window.innerWidth - 800 ? window.innerWidth - 850 : event.clientX + 20, 
    y: event.clientY > window.innerHeight - 500 ? window.innerHeight - 550 : event.clientY + 20 
  }
  showAltaPopup.value = true
}

const handleUpdate = (updatedRow) => {
  isLoading.value = true
  loadingMsg.value = 'Actualizando CMO...'
  
  setTimeout(() => {
    const index = gridData.value.findIndex(item => item.id === updatedRow.id)
    if (index !== -1) {
      gridData.value[index].cmo = updatedRow.cmo
      gridData.value[index].fecha = new Date().toLocaleString('es-AR')
    }
    showEditPopup.value = false
    isLoading.value = false
  }, 1200)
}

const handleNewRelations = (newItems) => {
  isLoading.value = true
  loadingMsg.value = 'Guardando nuevas relaciones CMO-Actividad...'

  setTimeout(() => {
    newItems.forEach((item, index) => {
      gridData.value.unshift({
        id: Date.now() + index,
        cod_act: item.actividad,
        desc_act: `Descripción de ${item.actividad}`,
        cod_s4: '0000001',
        cmo: item.cmo,
        usu: 'admin_user',
        fecha: new Date().toLocaleString('es-AR'),
        activo: 'S',
        disabled: false
      })
    })
    showAltaPopup.value = false
    isLoading.value = false
  }, 1200)
}
</script>