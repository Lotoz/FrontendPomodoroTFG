<template>
  <transition name="alert-fade">
    <div v-if="show" class="alert-overlay" @click.self="closeAlert">
      <div class="alert-box" :class="[type, 'animate-float']">
        <!-- Brillo decorativo superior -->
        <div class="alert-glow-top"></div>

        <!-- Ícono -->
        <div class="alert-icon">
          <img v-if="type === 'success'" src="/iconsApp/good.png" alt="Éxito" />
          <img v-else-if="type === 'error'" src="/iconsApp/bad.png" alt="Error" />
          <img v-else-if="type === 'warning'" src="/iconsApp/warning.png" alt="Advertencia" />
          <img v-else src="/iconsApp/warning.png" alt="Información" />
        </div>

        <!-- Título -->
        <h3 class="alert-title">{{ title }}</h3>

        <!-- Mensaje -->
        <p class="alert-message">{{ message }}</p>

        <!-- Brillo decorativo inferior -->
        <div class="alert-glow-bottom"></div>

        <!-- Botón -->
        <button class="btn-accept btn-rpg primary" @click="closeAlert">Aceptar</button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: 'Aviso' },
  message: { type: String, default: '' },
  type: { type: String, default: 'info' }, // 'info', 'error', 'success', 'warning'
})

const emit = defineEmits(['close'])

const closeAlert = () => {
  emit('close')
}

// Manejar tecla Escape para cerrar el alert
const handleKeydown = (event) => {
  if (event.key === 'Escape' && props.show) {
    closeAlert()
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
.alert-overlay {
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

/* Caja de alerta principal */
.alert-box {
  background: linear-gradient(
    135deg,
    var(--panel-bg, #3d2563) 0%,
    var(--panel-hover, #4a2f7a) 100%
  );
  border: 3px solid var(--primary-light, #d99fff);
  border-radius: 16px;
  padding: 40px 30px;
  width: 90%;
  max-width: 480px;
  text-align: center;
  box-shadow:
    0 0 60px rgba(179, 102, 255, 0.5),
    0 0 40px rgba(179, 102, 255, 0.3),
    0 15px 50px rgba(0, 0, 0, 0.8);
  font-family: sans-serif;
  animation: alert-pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
}

@keyframes alert-pop-in {
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
.alert-box::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  border-radius: 16px 16px 0 0;
  background: linear-gradient(
    90deg,
    var(--primary-light, #d99fff) 0%,
    var(--accent-gold, #ffd700) 100%
  );
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
.alert-box::after {
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
.alert-glow-top,
.alert-glow-bottom {
  position: absolute;
  width: 100%;
  height: 1px;
  left: 0;
  background: linear-gradient(90deg, transparent, rgba(179, 102, 255, 0.6), transparent);
  filter: blur(2px);
}

.alert-glow-top {
  top: 15px;
  animation: glow-move 3s ease-in-out infinite;
}

.alert-glow-bottom {
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

/* Variantes por tipo */
.alert-box.error {
  border-color: var(--damage, #ff4466);
  box-shadow:
    0 0 60px rgba(255, 68, 102, 0.4),
    0 0 40px rgba(255, 68, 102, 0.2),
    0 15px 50px rgba(0, 0, 0, 0.8);
}

.alert-box.error::before {
  background: linear-gradient(90deg, var(--damage, #ff4466) 0%, #ff6688 100%);
}

.alert-box.error .alert-title {
  color: var(--damage, #ff4466);
  text-shadow:
    0 0 15px rgba(255, 68, 102, 0.6),
    0 2px 10px rgba(0, 0, 0, 0.5);
}

.alert-box.success {
  border-color: var(--success, #00ff88);
  box-shadow:
    0 0 60px rgba(0, 255, 136, 0.4),
    0 0 40px rgba(0, 255, 136, 0.2),
    0 15px 50px rgba(0, 0, 0, 0.8);
}

.alert-box.success::before {
  background: linear-gradient(90deg, var(--success, #00ff88) 0%, var(--healing, #66ff99) 100%);
}

.alert-box.success .alert-title {
  color: var(--success, #00ff88);
  text-shadow:
    0 0 15px rgba(0, 255, 136, 0.6),
    0 2px 10px rgba(0, 0, 0, 0.5);
}

.alert-box.warning {
  border-color: var(--stun, #ffaa00);
  box-shadow:
    0 0 60px rgba(255, 170, 0, 0.4),
    0 0 40px rgba(255, 170, 0, 0.2),
    0 15px 50px rgba(0, 0, 0, 0.8);
}

.alert-box.warning::before {
  background: linear-gradient(90deg, var(--stun, #ffaa00) 0%, #ffcc44 100%);
}

.alert-box.warning .alert-title {
  color: var(--stun, #ffaa00);
  text-shadow:
    0 0 15px rgba(255, 170, 0, 0.6),
    0 2px 10px rgba(0, 0, 0, 0.5);
}

.alert-box.info {
  border-color: var(--primary-light, #d99fff);
  box-shadow:
    0 0 60px rgba(179, 102, 255, 0.4),
    0 0 40px rgba(179, 102, 255, 0.2),
    0 15px 50px rgba(0, 0, 0, 0.8);
}

.alert-box.info .alert-title {
  color: var(--primary-light, #d99fff);
  text-shadow:
    0 0 15px rgba(179, 102, 255, 0.6),
    0 2px 10px rgba(0, 0, 0, 0.5);
}

/* Icono */
.alert-icon {
  margin-bottom: 15px;
  animation: icon-bounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.alert-icon img {
  width: 50px;
  height: 50px;
  object-fit: contain;
  filter: drop-shadow(0 0 8px rgba(179, 102, 255, 0.6));
}

@keyframes icon-bounce {
  0% {
    opacity: 0;
    transform: scale(0) translateY(-30px);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Título */
.alert-title {
  margin: 15px 0 12px 0;
  font-size: 1.8rem;
  font-weight: bold;
  font-family: 'Cinzel', 'Orbitron', sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
}

/* Mensaje */
.alert-message {
  color: var(--text-main, #f0e6ff);
  font-size: 1.05rem;
  margin: 20px 0 30px 0;
  line-height: 1.6;
  font-weight: 500;
  font-family: 'Orbitron', sans-serif;
}

/* Botón */
.btn-accept {
  width: 100%;
  min-height: 45px;
  font-size: 1rem;
  position: relative;
  z-index: 1;
}

/* Transiciones */
.alert-fade-enter-active,
.alert-fade-leave-active {
  transition: all 0.3s ease;
}

.alert-fade-enter-from,
.alert-fade-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

/* Responsividad */
@media (max-width: 768px) {
  .alert-overlay {
    padding: 20px;
  }

  .alert-box {
    width: 100%;
    max-width: 100%;
    padding: 30px 20px;
    border-radius: 12px;
  }

  .alert-icon {
    font-size: 2.5rem;
    margin-bottom: 12px;
  }

  .alert-title {
    font-size: 1.4rem;
    margin: 12px 0 10px 0;
  }

  .alert-message {
    font-size: 0.95rem;
    margin: 15px 0 20px 0;
  }

  .btn-accept {
    min-height: 40px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .alert-box {
    padding: 20px 15px;
    border: 2px solid var(--primary-light, #d99fff);
  }

  .alert-icon {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .alert-title {
    font-size: 1.1rem;
    margin: 10px 0 8px 0;
    letter-spacing: 1px;
  }

  .alert-message {
    font-size: 0.85rem;
    margin: 12px 0 15px 0;
    line-height: 1.5;
  }

  .btn-accept {
    min-height: 36px;
    font-size: 0.8rem;
  }

  .alert-box::before,
  .alert-box::after {
    height: 2px;
  }
}
</style>
<style scoped>
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
  border: 3px solid var(--stroke-light, #4a2f7a);
  border-radius: 14px;
  padding: 30px;
  width: 90%;
  max-width: 450px;
  text-align: center;
  box-shadow:
    0 0 40px rgba(179, 102, 255, 0.4),
    0 10px 35px rgba(0, 0, 0, 0.6);
  font-family: sans-serif;
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

.alert-box.error {
  border-color: var(--damage, #ff4466);
  box-shadow:
    0 0 40px rgba(255, 68, 102, 0.3),
    0 10px 35px rgba(0, 0, 0, 0.6);
}

.alert-box.error::before {
  background: var(--damage, #ff4466);
}

.alert-box.error .alert-title {
  color: var(--damage, #ff4466);
  text-shadow: 0 0 10px rgba(255, 68, 102, 0.3);
}

.alert-box.success {
  border-color: var(--success, #00ff88);
  box-shadow:
    0 0 40px rgba(102, 255, 153, 0.3),
    0 10px 35px rgba(0, 0, 0, 0.6);
}

.alert-box.success::before {
  background: var(--success, #00ff88);
}

.alert-box.success .alert-title {
  color: var(--success, #00ff88);
  text-shadow: 0 0 10px rgba(102, 255, 153, 0.3);
}

.alert-box.info {
  border-color: var(--primary-light, #d99fff);
  box-shadow:
    0 0 40px rgba(179, 102, 255, 0.3),
    0 10px 35px rgba(0, 0, 0, 0.6);
}

.alert-box.info::before {
  background: var(--primary-light, #d99fff);
}

.alert-box.info .alert-title {
  color: var(--primary-light, #d99fff);
  text-shadow: 0 0 10px rgba(179, 102, 255, 0.4);
}

.alert-title {
  margin: 8px 0 15px 0;
  font-size: 1.6rem;
  font-weight: bold;
  transition: all 0.3s ease;
}

.alert-message {
  color: var(--text-main, #f0e6ff);
  font-size: 1.05rem;
  margin-bottom: 25px;
  line-height: 1.6;
  font-weight: 500;
}

.btn-accept {
  background: linear-gradient(
    135deg,
    var(--primary, #b366ff) 0%,
    var(--primary-dark, #7d33cc) 100%
  );
  color: var(--text-main, #f0e6ff);
  border: 2px solid var(--primary-light, #d99fff);
  padding: 12px 28px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  font-size: 1rem;
  box-shadow:
    0 0 15px rgba(179, 102, 255, 0.3),
    0 4px 10px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-accept:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 25px rgba(179, 102, 255, 0.6),
    0 6px 15px rgba(0, 0, 0, 0.4);
  filter: brightness(1.1);
}

.btn-accept:active {
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

  .btn-accept {
    padding: 10px 24px;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
  }
}

@media (max-width: 480px) {
  .alert-box {
    padding: 20px 15px;
    border: 2px solid var(--stroke-light, #4a2f7a);
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

  .btn-accept {
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
