<template>
  <transition name="confirm-fade">
    <div v-if="show" class="confirm-overlay" @click.self="cancel">
      <div class="confirm-box animate-float">
        <!-- Brillo decorativo superior -->
        <div class="confirm-glow-top"></div>

        <!-- Ícono -->
        <div class="confirm-icon">
          <img src="/iconsApp/warning.png" alt="Pregunta" />
        </div>

        <!-- Título -->
        <h3 class="confirm-title">{{ title }}</h3>

        <!-- Mensaje -->
        <p class="confirm-message">{{ message }}</p>

        <!-- Brillo decorativo inferior -->
        <div class="confirm-glow-bottom"></div>

        <!-- Botones -->
        <div class="button-group">
          <button class="btn-cancel btn-rpg danger" @click="cancel">
            <img src="/iconsApp/bad.png" alt="Cancelar" /> Cancelar
          </button>
          <button class="btn-confirm btn-rpg success" @click="confirm">
            <img src="/iconsApp/good.png" alt="Confirmar" /> Confirmar
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: '¿Confirmar?' },
  message: { type: String, default: '' },
})

const emit = defineEmits(['confirm', 'cancel'])

const confirm = () => emit('confirm')
const cancel = () => emit('cancel')

// Manejar tecla Escape para cancelar
const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.show) {
    cancel()
  }
}

// Agregar y remover listener de Escape
watch(
  () => props.show,
  (newShow) => {
    if (newShow) {
      document.addEventListener('keydown', handleKeydown)
      document.body.style.overflow = 'hidden'
    } else {
      document.removeEventListener('keydown', handleKeydown)
      document.body.style.overflow = 'auto'
    }
  },
)

onMounted(() => {
  if (props.show) {
    document.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = 'auto'
})
</script>

<style scoped>
/* Overlay con efectos épicos */
.confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.85) 0%, rgba(26, 13, 46, 0.75) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
  animation: overlay-fade-in 0.3s ease;
}

@keyframes overlay-fade-in {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(5px);
  }
}

/* Caja de confirmación principal */
.confirm-box {
  background: linear-gradient(
    135deg,
    var(--panel-bg, #3d2563) 0%,
    var(--panel-hover, #4a2f7a) 100%
  );
  border: 3px solid var(--primary-light, #d99fff);
  border-radius: 16px;
  padding: 40px 30px;
  width: 90%;
  max-width: 500px;
  text-align: center;
  box-shadow:
    0 0 60px rgba(179, 102, 255, 0.5),
    0 0 40px rgba(179, 102, 255, 0.3),
    0 15px 50px rgba(0, 0, 0, 0.8);
  animation: confirm-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

@keyframes confirm-pop-in {
  from {
    opacity: 0;
    transform: scale(0.7) translateY(-50px);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
    filter: blur(0);
  }
}

/* Borde superior decorativo */
.confirm-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 16px 16px 0 0;
  background: linear-gradient(90deg, var(--stun, #ffaa00) 0%, var(--accent-gold, #ffd700) 100%);
  animation: shimmer-top 2s ease-in-out infinite;
}

@keyframes shimmer-top {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

/* Borde inferior decorativo */
.confirm-box::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary-light, #d99fff), transparent);
  animation: shimmer-bottom 3s ease-in-out infinite;
}

@keyframes shimmer-bottom {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
}

/* Brillos decorativos */
.confirm-glow-top,
.confirm-glow-bottom {
  position: absolute;
  width: 100%;
  height: 1px;
  left: 0;
  background: linear-gradient(90deg, transparent, rgba(255, 170, 0, 0.6), transparent);
  filter: blur(2px);
}

.confirm-glow-top {
  top: 15px;
  animation: glow-move 3s ease-in-out infinite;
}

.confirm-glow-bottom {
  bottom: 15px;
  animation: glow-move 3s ease-in-out infinite reverse;
}

@keyframes glow-move {
  0%,
  100% {
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
}

/* Icono */
.confirm-icon {
  font-size: 3.5rem;
  margin-bottom: 15px;
  animation: icon-shake 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: block;
}

@keyframes icon-shake {
  0%,
  100% {
    opacity: 0;
    transform: scale(0) rotate(-180deg);
  }
  50% {
    transform: scale(1.1) rotate(10deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}

/* Título */
.confirm-title {
  margin: 15px 0 12px 0;
  font-size: 1.8rem;
  font-weight: bold;
  font-family: 'Cinzel', 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: var(--stun, #ffaa00);
  text-shadow:
    0 0 15px rgba(255, 170, 0, 0.6),
    0 2px 10px rgba(0, 0, 0, 0.5);
}

/* Mensaje */
.confirm-message {
  color: var(--text-main, #f0e6ff);
  font-size: 1.05rem;
  margin: 20px 0 30px 0;
  line-height: 1.6;
  font-weight: 500;
  font-family: 'Orbitron', sans-serif;
}

/* Grupo de botones */
.button-group {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  justify-content: center;
}

.btn-cancel,
.btn-confirm {
  flex: 1;
  min-width: 150px;
  font-size: 0.95rem;
}

/* Transiciones */
.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: all 0.3s ease;
}

.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Responsividad */
@media (max-width: 768px) {
  .confirm-overlay {
    padding: 20px;
  }

  .confirm-box {
    width: 100%;
    max-width: 100%;
    padding: 30px 20px;
    border-radius: 12px;
  }

  .confirm-icon {
    font-size: 2.5rem;
    margin-bottom: 12px;
  }

  .confirm-title {
    font-size: 1.4rem;
    margin: 12px 0 10px 0;
  }

  .confirm-message {
    font-size: 0.95rem;
    margin: 15px 0 20px 0;
  }

  .button-group {
    flex-direction: column;
    gap: 10px;
  }

  .btn-cancel,
  .btn-confirm {
    min-width: auto;
  }
}

@media (max-width: 480px) {
  .confirm-box {
    padding: 20px 15px;
    border: 2px solid var(--primary-light, #d99fff);
  }

  .confirm-icon {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .confirm-title {
    font-size: 1.1rem;
    margin: 10px 0 8px 0;
    letter-spacing: 1px;
  }

  .confirm-message {
    font-size: 0.85rem;
    margin: 12px 0 15px 0;
    line-height: 1.5;
  }

  .button-group {
    gap: 8px;
  }

  .confirm-box::before,
  .confirm-box::after {
    height: 2px;
  }
}
</style>

<style scoped>
/* Los estilos del overlay y box son similares a tu Alert */
.alert-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.8) 0%, rgba(26, 13, 46, 0.7) 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(5px);
  animation: overlay-fade-in 0.3s ease;
}

@keyframes overlay-fade-in {
  from {
    opacity: 0;
    backdrop-filter: blur(0px);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(5px);
  }
}

.alert-box {
  background: linear-gradient(
    135deg,
    var(--panel-bg, #3d2563) 0%,
    var(--panel-hover, #4a2f7a) 100%
  );
  border: 3px solid var(--primary-light, #d99fff);
  border-radius: 14px;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  text-align: center;
  color: white;
  box-shadow:
    0 0 40px rgba(179, 102, 255, 0.4),
    0 10px 35px rgba(0, 0, 0, 0.6);
  animation: alert-pop-in 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  position: relative;
}

@keyframes alert-pop-in {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.alert-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: 14px 14px 0 0;
  background: linear-gradient(
    90deg,
    var(--primary-light, #d99fff) 0%,
    var(--accent-gold, #ffd700) 100%
  );
}

.alert-title {
  margin: 8px 0 15px 0;
  font-size: 1.6rem;
  font-weight: bold;
  color: var(--primary-light, #d99fff);
  text-shadow: 0 0 10px rgba(179, 102, 255, 0.4);
}

.alert-message {
  color: var(--text-main, #f0e6ff);
  font-size: 1.05rem;
  margin-bottom: 25px;
  line-height: 1.6;
  font-weight: 500;
}

.button-group {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.btn-confirm,
.btn-cancel {
  flex: 1;
  padding: 12px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-confirm {
  background: linear-gradient(135deg, var(--success, #00ff88) 0%, var(--healing, #66ff99) 100%);
  color: var(--bg-main, #1a0d2e);
  border-color: var(--success, #00ff88);
  box-shadow: 0 0 15px rgba(0, 255, 136, 0.3);
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 25px rgba(0, 255, 136, 0.6),
    0 6px 15px rgba(0, 0, 0, 0.4);
  filter: brightness(1.1);
}

.btn-confirm:active {
  transform: translateY(0);
}

.btn-cancel {
  background: linear-gradient(135deg, var(--damage, #ff4466) 0%, #ff6688 100%);
  color: white;
  border-color: var(--damage, #ff4466);
  box-shadow: 0 0 15px rgba(255, 68, 102, 0.3);
}

.btn-cancel:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 25px rgba(255, 68, 102, 0.6),
    0 6px 15px rgba(0, 0, 0, 0.4);
  filter: brightness(1.1);
}

.btn-cancel:active {
  transform: translateY(0);
}

/* RESPONSIVIDAD PARA MÓVILES Y TABLETS */
@media (max-width: 768px) {
  .alert-overlay {
    padding: 20px;
  }

  .alert-box {
    width: 100%;
    max-width: 100%;
    padding: 25px 20px;
    border-radius: 12px;
  }

  .alert-title {
    font-size: 1.3rem;
    margin: 0 0 12px 0;
  }

  .alert-message {
    font-size: 0.95rem;
    margin-bottom: 20px;
  }

  .btn-confirm,
  .btn-cancel {
    padding: 10px 24px;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
  }
}

@media (max-width: 480px) {
  .alert-box {
    padding: 20px 15px;
    border: 2px solid var(--primary-light, #d99fff);
  }

  .alert-title {
    font-size: 1.1rem;
    margin: 0 0 10px 0;
  }

  .alert-message {
    font-size: 0.85rem;
    margin-bottom: 15px;
    line-height: 1.5;
  }

  .btn-confirm,
  .btn-cancel {
    padding: 10px 20px;
    font-size: 0.8rem;
    letter-spacing: 0px;
  }

  .alert-box::before {
    height: 2px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
