<template>
  <div class="floating-popup" style="width: 95vw; max-width: 1400px; height: 85vh; z-index: 6000; left: 50%; top: 50%; transform: translate(-50%, -50%);" v-if="show">
    
    <!-- HEADER -->
    <div class="popup-header" style="background: white; color: #546e7a; border-bottom: 1px solid #eceff1;">
      <div class="popup-title" style="font-weight: normal; font-size: 16px;">Gestion Traspaso</div>
      <div class="popup-controls">
        <span class="material-icons" style="font-size: 18px; color: #b0bec5; font-weight: bold; cursor: pointer;" @click="$emit('close')">close</span>
      </div>
    </div>
    
    <!-- BODY -->
    <div class="popup-body" style="background: #fafafa; padding: 20px; display: flex; flex-direction: column;">
      
      <!-- FORMULARIO SUPERIOR -->
      <div class="form-grid" style="grid-template-columns: repeat(4, 1fr); margin-bottom: 15px;">
        <div class="form-group">
          <label style="color: #000; font-size: 13px;">Region</label>
          <select class="form-control" style="border-color: #00bcd4;">
            <option value="A00-AMBA">A00-AMBA</option>
            <option value="B00-B2B">B00-B2B</option>
            <option value="C00-Litoral">C00-Litoral</option>
            <option value="D00-Mediterranea">D00-Mediterranea</option>
            <option value="E00-Noroeste Andina">E00-Noroeste Andina</option>
            <option value="P00-PARAGUAY">P00-PARAGUAY</option>
            <option value="F00-Provincia de Buenos Aires y Patagonia">F00-Provincia de Buenos Aires y Patagonia</option>
            <option value="U00-UMSA">U00-UMSA</option>
            <option value="G00-Uruguay">G00-Uruguay</option>
          </select>
        </div>
        <div class="form-group">
          <label style="color: #000; font-size: 13px;">Subregion</label>
          <select class="form-control" style="border-radius: 4px;">
            <option value="Capital Norte">Capital Norte</option>
            <option value="Capital Sur">Capital Sur</option>
            <option value="GBA NORTE">GBA NORTE</option>
            <option value="GBA OESTE">GBA OESTE</option>
            <option value="GBA SUR">GBA SUR</option>
            <option value="SEDE AMBA">SEDE AMBA</option>
          </select>
        </div>
        <div class="form-group">
          <label style="color: #000; font-size: 13px;">Base Tecnica</label>
          <select class="form-control" style="border-radius: 4px;">
            <option value="COLEGIALES">COLEGIALES</option>
            <option value="DEVOTO">DEVOTO</option>
            <option value="PATERNAL">PATERNAL</option>
            <option value="SAAVEDRA">SAAVEDRA</option>
          </select>
        </div>
        <div class="form-group">
          <label style="color: #000; font-size: 13px;">Provincia</label>
          <input type="text" class="form-control" value="CAPITAL FEDERAL" disabled style="background: #f5f5f5; color: #455a64;">
        </div>
        <div class="form-group">
          <label style="color: #000; font-size: 13px;">Tipo Contrato</label>
          <select class="form-control" style="border-radius: 4px;">
            <option value=""></option>
            <option value="Abono Cobre">Abono Cobre</option>
            <option value="BBI Mantenimiento Correctivo">BBI Mantenimiento Correctivo</option>
            <option value="BBI Siniestros">BBI Siniestros</option>
            <option value="Eventos">Eventos</option>
            <option value="Eventos Corporativos">Eventos Corporativos</option>
            <option value="Eventos SMB">Eventos SMB</option>
            <option value="Instalacion Poste FTTH">Instalación Poste FTTH</option>
          </select>
        </div>
        <div class="form-group">
          <label style="color: #000; font-size: 13px;">Sociedad</label>
          <select class="form-control" style="border-radius: 4px;">
            <option value=""></option>
            <option value="Telecom Argentina S.A.">Telecom Argentina S.A.</option>
            <option value="La Capital Cable S.A.">La Capital Cable S.A.</option>
            <option value="Visión Satelital S.A.">Visión Satelital S.A.</option>
          </select>
        </div>
        <div class="form-group">
          <label style="color: #000; font-size: 13px;">Contratista</label>
          <select class="form-control" style="border-radius: 4px;">
            <option value=""></option>
            <option value="0.1 DIGITAL S.R.L.">0.1 DIGITAL S.R.L.</option>
            <option value="300NET SRL">300NET SRL</option>
            <option value="ALL VISION S.A.">ALL VISION S.A.</option>
            <option value="TELEWORLD ARGENTINA S.A.">TELEWORLD ARGENTINA S.A.</option>
          </select>
        </div>
      </div>

      <!-- GRILLA CENTRAL -->
      <div class="table-responsive" style="flex: 1; border: 1px solid #e0e0e0; background: white; margin-bottom: 0; min-height: 150px;">
        <table class="advanced-grid">
          <thead>
            <tr>
              <th style="width: 30px;"><input type="checkbox" class="custom-checkbox"></th>
              <th><div class="resizable-header">Nro de OT</div></th>
              <th><div class="resizable-header">Tech ID</div></th>
              <th><div class="resizable-header">Provincia</div></th>
              <th><div class="resizable-header">Contrato</div></th>
              <th><div class="resizable-header">Sociedad</div></th>
              <th><div class="resizable-header">Contratista</div></th>
              <th><div class="resizable-header">Region</div></th>
              <th><div class="resizable-header">Base Tecnica</div></th>
              <th><div class="resizable-header">Ciudad</div></th>
              <th><div class="resizable-header">Area</div></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="checkbox" class="custom-checkbox"></td>
              <td>J000000000025799459</td>
              <td>13MPD233</td>
              <td>BUENOS AIRES</td>
              <td>Eventos</td>
              <td>Telecom Argentina S.A.</td>
              <td>TELEWORLD ARGENTINA S...</td>
              <td>Provincia de Buenos Aires y P...</td>
              <td>MAR DEL PLATA</td>
              <td>GRAL PUEYRREDON</td>
              <td>13MPDAT1</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINADO CON TACHITO -->
      <div class="modern-pagination" style="justify-content: center; padding: 8px 15px; background: white; border: 1px solid #e0e0e0; border-top: none; position: relative;">
        <div style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%);">
          <span class="material-icons" style="cursor: pointer; color: #546e7a; font-size: 20px;">delete</span>
        </div>
        <span class="material-icons icon-nav">first_page</span>
        <span class="material-icons icon-nav">chevron_left</span>
        <span>Página <input type="text" value="1" disabled style="width: 30px; text-align: center;"> de 1</span>
        <span class="material-icons icon-nav">chevron_right</span>
        <span class="material-icons icon-nav">last_page</span>
      </div>

      <!-- CAMPO NOTA -->
      <div class="form-group" style="margin-top: 15px;">
        <label style="color: #000; font-size: 13px;">Nota</label>
        <textarea class="form-control" rows="3" style="resize: none; border-radius: 4px; border-color: #cfd8dc;"></textarea>
      </div>
      
    </div>

    <!-- BOTONERA INFERIOR -->
    <div class="popup-actions" style="background: white; border-top: none; padding: 15px 20px; justify-content: flex-end; gap: 15px;">
      <button class="btn btn-danger" style="border-radius: 20px; padding: 10px 30px; background: white; color: #00bcd4; border: 1px solid #00bcd4;" @click="$emit('close')">CANCELAR</button>
      <button class="btn" style="background: #4dd0e1; font-weight: bold; border-radius: 20px; padding: 10px 30px;">REALIZAR TRASPASO</button>
    </div>
  </div>
</template>

<script setup>
defineProps(['show'])
defineEmits(['close'])
</script>