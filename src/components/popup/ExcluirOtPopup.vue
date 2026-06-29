<template>
  <div class="floating-popup" style="width: 450px; z-index: 6000; left: 50%; top: 50%; transform: translate(-50%, -50%);" v-if="show">
    <div class="popup-header" style="background: white; color: #546e7a; border-bottom: 1px solid #eceff1;">
      <div class="popup-title" style="font-weight: normal; font-size: 16px;">Alerta</div>
      <div class="popup-controls"><span class="material-icons" style="font-size: 18px; color: #b0bec5; font-weight: bold; cursor: pointer;" @click="$emit('close')">close</span></div>
    </div>
    
    <div class="popup-body" style="background: white; padding: 20px;">
      <p style="color: #455a64; font-size: 14px; margin-top: 0;">¿Confirma que desea excluir la(s) OT(s) seleccionada(s)?</p>
      
      <div class="form-group" style="margin-bottom: 15px;">
        <label style="color: #000; font-size: 13px;">Motivo</label>
        <select class="form-control" style="border-radius: 4px;">
          <option value=""></option>
          <option value="Error">Error de Sistema</option>
          <option value="Duplicado">Duplicado</option>
          <option value="Rechazo">Rechazo Manual</option>
        </select>
      </div>

      <div class="form-group">
        <label style="color: #000; font-size: 13px;">Nota</label>
        <textarea class="form-control" rows="3" placeholder="Opcional" style="resize: none; border-radius: 4px;"></textarea>
      </div>
    </div>

    <div class="popup-actions" style="background: white; border-top: none; padding: 0 20px 20px 20px; justify-content: flex-end;">
      <button class="btn btn-danger" style="border-radius: 20px; padding: 8px 25px; margin-right: 10px;" @click="$emit('close')">CANCELAR</button>
      <button class="btn" style="background: #00bcd4; font-weight: bold; border-radius: 20px; padding: 8px 25px;" @click="$emit('confirmar')">ACEPTAR</button>
    </div>
  </div>
</template>

<script setup>
defineProps(['show'])
defineEmits(['close', 'confirmar'])
</script>