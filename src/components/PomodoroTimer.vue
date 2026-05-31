<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  workDurationMinutes: { type: Number, default: 25 },
  shortBreakDurationMinutes: { type: Number, default: 5 },
  longBreakDurationMinutes: { type: Number, default: 30 },
  cyclesBeforeLongBreak: { type: Number, default: 4 },
})

const emit = defineEmits(['pomodoro-terminado'])

const fase = ref('trabajo') // 'trabajo' | 'descanso' | 'descanso-largo'
const cicloActual = ref(0)
const tiempoRestante = ref(props.workDurationMinutes * 60)
const timerActivo = ref(false)
let intervalo = null

// --- LÓGICA DE PERSISTENCIA (LOCALSTORAGE) ---

const guardarEstadoEnLocal = () => {
  const estado = {
    fase: fase.value,
    cicloActual: cicloActual.value,
    tiempoRestante: Math.max(0, tiempoRestante.value), // Nunca guardar negativos
    timestampGuarde: Date.now(), // Guardamos la hora exacta
  }
  localStorage.setItem('pomodoroState', JSON.stringify(estado))
}

const cargarEstadoDesdeLocal = () => {
  const estadoGuardado = localStorage.getItem('pomodoroState')
  if (estadoGuardado) {
    try {
      const estado = JSON.parse(estadoGuardado)

      fase.value = estado.fase
      cicloActual.value = estado.cicloActual

      // Calculamos cuánto tiempo ha pasado desde que se cerró/recargó la pestaña
      const tiempoTranscurridoSegundos = Math.floor((Date.now() - estado.timestampGuarde) / 1000)

      // Si el timer estaba activo ANTES de recargar (podemos deducirlo porque guardamos el estado constantemente si está activo)
      // restamos ese tiempo perdido. Si no, restauramos tal cual.
      // OJO: Por simplicidad, si recarga, lo dejamos en pausa pero con el tiempo correcto que tenía al recargar.
      const nuevoTiempo = estado.tiempoRestante - tiempoTranscurridoSegundos

      if (nuevoTiempo > 0) {
        tiempoRestante.value = nuevoTiempo
      } else {
        // Si el tiempo que pasó es mayor al que quedaba, el pomodoro ya terminó mientras estaba cerrado
        tiempoRestante.value = 0
        finalizarPomodoro() // Ejecutamos la lógica de fin de ciclo
      }
    } catch (e) {
      console.error('Error leyendo localStorage del Pomodoro', e)
    }
  }
}

// Limpiar el localStorage al hacer RESET manual
const limpiarLocal = () => {
  localStorage.removeItem('pomodoroState')
}

// ----------------------------------------------

watch(
  () => props.workDurationMinutes,
  (nuevoValor) => {
    if (!timerActivo.value && fase.value === 'trabajo' && !localStorage.getItem('pomodoroState')) {
      tiempoRestante.value = nuevoValor * 60
    }
  },
)

const tiempoFaseActual = computed(() => {
  if (fase.value === 'trabajo') return props.workDurationMinutes * 60
  if (fase.value === 'descanso-largo') return props.longBreakDurationMinutes * 60
  return props.shortBreakDurationMinutes * 60
})

const etiquetaFase = computed(() => {
  if (fase.value === 'trabajo') return 'Entrenando'
  if (fase.value === 'descanso-largo') return 'Descanso Largo'
  return 'Descanso Corto'
})

const numeroCicloMostrado = computed(() => {
  if (fase.value === 'trabajo') return cicloActual.value + 1
  return cicloActual.value === 0 ? props.cyclesBeforeLongBreak : cicloActual.value
})

const relojVisual = computed(() => {
  const min = Math.floor(tiempoRestante.value / 60)
  const sec = tiempoRestante.value % 60
  return `${min}:${sec < 10 ? '0' + sec : sec}`
})

const sonarAlarma = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const tocarTono = (frecuencia, inicio, duracion) => {
      const oscilador = ctx.createOscillator()
      const ganancia = ctx.createGain()
      oscilador.connect(ganancia)
      ganancia.connect(ctx.destination)
      oscilador.type = 'sine'
      oscilador.frequency.setValueAtTime(frecuencia, ctx.currentTime + inicio)
      ganancia.gain.setValueAtTime(0, ctx.currentTime + inicio)
      ganancia.gain.linearRampToValueAtTime(0.5, ctx.currentTime + inicio + 0.05)
      ganancia.gain.linearRampToValueAtTime(0, ctx.currentTime + inicio + duracion)
      oscilador.start(ctx.currentTime + inicio)
      oscilador.stop(ctx.currentTime + inicio + duracion)
    }
    tocarTono(880, 0.0, 0.35)
    tocarTono(1046, 0.4, 0.35)
    tocarTono(1318, 0.8, 0.6)
  } catch (e) {
    console.warn('No se pudo reproducir la alarma:', e)
  }
}

const finalizarPomodoro = () => {
  clearInterval(intervalo)
  timerActivo.value = false
  sonarAlarma()
  emit('pomodoro-terminado')

  if (fase.value === 'trabajo') {
    cicloActual.value++
    if (cicloActual.value >= props.cyclesBeforeLongBreak) {
      fase.value = 'descanso-largo'
      cicloActual.value = 0
    } else {
      fase.value = 'descanso'
    }
  } else {
    fase.value = 'trabajo'
  }
  tiempoRestante.value = tiempoFaseActual.value
  guardarEstadoEnLocal() // Guardamos que hemos pasado a la siguiente fase
}

const toggleTimer = () => {
  if (timerActivo.value) {
    clearInterval(intervalo)
    timerActivo.value = false
    guardarEstadoEnLocal() // Guardamos estado al pausar
  } else {
    timerActivo.value = true
    guardarEstadoEnLocal() // Actualizamos el timestamp al iniciar
    intervalo = setInterval(() => {
      if (tiempoRestante.value > 0) {
        tiempoRestante.value--
        // Guardamos el estado cada pocos segundos para que sobreviva a F5
        if (tiempoRestante.value % 5 === 0) guardarEstadoEnLocal()
      } else {
        finalizarPomodoro()
      }
    }, 1000)
  }
}

const resetTimer = () => {
  clearInterval(intervalo)
  timerActivo.value = false
  fase.value = 'trabajo'
  cicloActual.value = 0
  tiempoRestante.value = props.workDurationMinutes * 60
  limpiarLocal() // Borramos el progreso guardado
}

// Cuando el componente nace (se abre/recarga la página), intenta recuperar el estado
onMounted(() => {
  cargarEstadoDesdeLocal()
})

// Por seguridad, limpiamos el intervalo si el componente muere (cambio de ruta)
onUnmounted(() => {
  if (intervalo) clearInterval(intervalo)
})
</script>

<template>
  <section class="panel pomodoro-panel">
    <div class="reloj-marco">
      <div class="timer-display">{{ relojVisual }}</div>
    </div>
    <div class="controls">
      <button @click="toggleTimer" :class="timerActivo ? 'btn-stop' : 'btn-start'">
        <span v-if="timerActivo">PAUSAR</span>
        <span v-else>INICIAR</span>
      </button>
      <button @click="resetTimer" class="btn-reset">RESET</button>
    </div>
    <p class="status-text">
      <span v-if="timerActivo">{{ etiquetaFase }}...</span>
      <span v-else>En el campamento</span>
    </p>
    <p class="ciclo-text">
      Ciclo {{ numeroCicloMostrado }} / {{ props.cyclesBeforeLongBreak }}
      &nbsp;·&nbsp;
      <span class="fase-badge" :class="'fase-' + fase">{{ etiquetaFase }}</span>
    </p>
  </section>
</template>

<style scoped>
.panel {
  background: linear-gradient(135deg, var(--panel-bg) 0%, var(--panel-hover, #4a2f7a) 100%);
  border-radius: 12px;
  padding: 24px;
  border: 3px solid var(--stroke-light, #4a2f7a);
  color: var(--text-main);
  box-shadow:
    0 0 25px rgba(179, 102, 255, 0.3),
    0 8px 20px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.pomodoro-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.reloj-marco {
  background: linear-gradient(135deg, var(--bg-main) 0%, var(--bg-secondary, #2d1b4e) 100%);
  padding: 30px 50px;
  border-radius: 16px;
  border: 4px solid var(--primary-light, #d99fff);
  margin-bottom: 20px;
  box-shadow:
    inset 0 4px 10px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(179, 102, 255, 0.3);
  position: relative;
}

.timer-display {
  font-size: 5rem;
  font-weight: 900;
  color: var(--accent-gold, #ffd700);
  font-family: 'Courier New', monospace;
  text-shadow:
    0 0 20px rgba(255, 215, 0, 0.5),
    0 4px 10px rgba(0, 0, 0, 0.6);
  letter-spacing: 4px;
  animation: timer-pulse 1s ease-in-out infinite;
}

@keyframes timer-pulse {
  0%,
  100% {
    text-shadow:
      0 0 20px rgba(255, 215, 0, 0.5),
      0 4px 10px rgba(0, 0, 0, 0.6);
    transform: scale(1);
  }
  50% {
    text-shadow:
      0 0 30px rgba(255, 215, 0, 0.8),
      0 4px 15px rgba(0, 0, 0, 0.6);
    transform: scale(1.02);
  }
}

.controls {
  display: flex;
  gap: 12px;
  margin: 12px 0;
}

.controls button {
  font-size: 1rem;
  padding: 12px 24px;
  border: 3px solid var(--primary-light, #d99fff);
  border-radius: 8px;
  cursor: pointer;
  font-weight: 800;
  text-transform: uppercase;
  transition: all 0.3s ease;
  box-shadow:
    0 0 15px rgba(179, 102, 255, 0.3),
    0 4px 10px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
}

.controls button:hover {
  transform: translateY(-3px);
  box-shadow:
    0 0 25px rgba(179, 102, 255, 0.6),
    0 6px 15px rgba(0, 0, 0, 0.4);
}

.controls button:active {
  transform: translateY(-1px);
}

.btn-start {
  background: linear-gradient(135deg, var(--healing, #66ff99) 0%, var(--success, #00ff88) 100%);
  color: var(--bg-main);
  border-color: var(--healing, #66ff99);
}

.btn-start:hover {
  filter: brightness(1.2);
}

.btn-stop {
  background: linear-gradient(
    135deg,
    var(--primary, #b366ff) 0%,
    var(--primary-dark, #7d33cc) 100%
  );
  color: var(--text-main);
  border-color: var(--primary-light, #d99fff);
}

.btn-reset {
  background: transparent;
  color: var(--text-main);
  border-style: dashed;
  border-color: var(--text-secondary, #c9b8ff);
  opacity: 0.8;
}

.btn-reset:hover {
  opacity: 1;
  border-style: solid;
}

.status-text {
  margin-top: 12px;
  font-weight: bold;
  color: var(--accent-gold, #ffd700);
  text-shadow: 0 0 10px rgba(179, 102, 255, 0.3);
  font-size: 1.1rem;
}

.ciclo-text {
  margin-top: 8px;
  font-size: 0.9rem;
  color: var(--text-secondary, #c9b8ff);
  opacity: 0.9;
}

.fase-badge {
  padding: 4px 12px;
  border-radius: 14px;
  font-size: 0.85rem;
  font-weight: bold;
  border: 2px solid;
  transition: all 0.3s ease;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}

.fase-trabajo {
  background: linear-gradient(
    135deg,
    var(--primary, #b366ff) 0%,
    var(--primary-dark, #7d33cc) 100%
  );
  color: var(--text-main);
  border-color: var(--primary-light, #d99fff);
  box-shadow: 0 0 15px rgba(179, 102, 255, 0.4);
}

.fase-descanso {
  background: linear-gradient(135deg, var(--healing, #66ff99) 0%, var(--success, #00ff88) 100%);
  color: var(--bg-main);
  border-color: var(--healing, #66ff99);
  box-shadow: 0 0 15px rgba(102, 255, 153, 0.4);
}

.fase-descanso-largo {
  background: linear-gradient(135deg, var(--accent-gold, #ffd700) 0%, #ffed4e 100%);
  color: var(--bg-main);
  border-color: var(--accent-gold, #ffd700);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
}

/* RESPONSIVIDAD */
@media (max-width: 768px) {
  .panel {
    padding: 18px;
    border-radius: 10px;
  }

  .reloj-marco {
    padding: 25px 40px;
    border-radius: 12px;
    margin-bottom: 15px;
    border: 3px solid var(--primary-light, #d99fff);
  }

  .timer-display {
    font-size: 3.5rem;
    letter-spacing: 2px;
  }

  .controls {
    gap: 10px;
    margin: 10px 0;
  }

  .controls button {
    font-size: 0.85rem;
    padding: 10px 20px;
    letter-spacing: 0.5px;
  }

  .status-text {
    font-size: 1rem;
    margin-top: 10px;
  }

  .ciclo-text {
    font-size: 0.85rem;
    margin-top: 6px;
  }

  .fase-badge {
    padding: 3px 10px;
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .panel {
    padding: 14px;
    border-radius: 8px;
    border: 2px solid var(--stroke-light, #4a2f7a);
  }

  .reloj-marco {
    padding: 20px 30px;
    border-radius: 10px;
    margin-bottom: 12px;
    border: 2px solid var(--primary-light, #d99fff);
  }

  .timer-display {
    font-size: 2.5rem;
    letter-spacing: 1px;
    text-shadow:
      0 0 15px rgba(255, 215, 0, 0.5),
      0 2px 8px rgba(0, 0, 0, 0.6);
  }

  @keyframes timer-pulse {
    0%,
    100% {
      text-shadow:
        0 0 15px rgba(255, 215, 0, 0.5),
        0 2px 8px rgba(0, 0, 0, 0.6);
      transform: scale(1);
    }
    50% {
      text-shadow:
        0 0 20px rgba(255, 215, 0, 0.8),
        0 2px 10px rgba(0, 0, 0, 0.6);
      transform: scale(1.02);
    }
  }

  .controls {
    flex-direction: column;
    width: 100%;
    gap: 8px;
    margin: 8px 0;
  }

  .controls button {
    font-size: 0.75rem;
    padding: 8px 16px;
    width: 100%;
    letter-spacing: 0px;
    border: 2px solid var(--primary-light, #d99fff);
  }

  .status-text {
    font-size: 0.9rem;
    margin-top: 8px;
  }

  .ciclo-text {
    font-size: 0.75rem;
    margin-top: 4px;
  }

  .fase-badge {
    padding: 2px 8px;
    font-size: 0.7rem;
  }
}
</style>
