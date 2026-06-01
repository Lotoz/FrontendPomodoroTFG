<template>
  <div class="page-shell">
    <div class="page-card">
      <div class="dashboard-container">
        <header class="top-bar">
          <h2>
            <img src="/iconsApp/fortress.png" alt="Fortaleza" class="h2-icon" /> Fortaleza de
            {{ usuario.username }}
          </h2>
          <div class="nav-buttons">
            <button @click="router.push('/dashboard')" class="btn-nav active">Tablón</button>
            <button @click="router.push('/tareas')" class="btn-nav">Misiones</button>
            <button @click="router.push('/heroes')" class="btn-nav">
              <img src="/iconsApp/beer.png" alt="Taberna" /> Taberna
            </button>
            <button @click="router.push('/campamento')" class="btn-nav">
              <img src="/iconsApp/camp.png" alt="Campamento" /> Campamento
            </button>

            <button @click="abrirBatalla" class="btn-nav battle-btn">
              <img src="/iconsApp/sword.png" alt="Batalla" /> Zona de Batalla
            </button>

            <button @click="router.push('/bestiario')" class="btn-nav">
              <img src="/iconsApp/bestiario.png" alt="Bestiario" /> Bestiario
            </button>
            <button @click="router.push('/cementerio')" class="btn-nav">
              <img src="/iconsApp/lose.png" alt="Cementerio" /> Cementerio
            </button>
            <button @click="router.push('/perfil')" class="btn-nav">
              <img src="/iconsApp/config.png" alt="Perfil" /> Perfil
            </button>

            <button @click="logout" class="btn-logout">Abandonar Partida</button>
          </div>
        </header>

        <div class="main-layout">
          <ListaTareas
            :tareas="tareas"
            @agregar="agregarTarea"
            @toggle="toggleCompletada"
            @editar="editarTarea"
            @eliminar="eliminarTarea"
          />

          <PomodoroTimer
            @pomodoro-terminado="registrarEntrenamiento"
            :workDurationMinutes="configPomodoro.workDurationMinutes"
            :shortBreakDurationMinutes="configPomodoro.shortBreakDurationMinutes"
            :longBreakDurationMinutes="configPomodoro.longBreakDurationMinutes"
            :cyclesBeforeLongBreak="configPomodoro.cyclesBeforeLongBreak"
          />
        </div>

        <EquipoHeroes :equipo="equipo" />

        <div class="music-section panel-epic">
          <div class="music-header">
            <h3>
              <img
                :src="musicaId ? '/iconsApp/music.png' : '/iconsApp/muted.png'"
                :alt="musicaId ? 'Bardo tocando' : 'Bardo silenciado'"
                class="bardo-icon"
              />
              Bardo de la Fortaleza
            </h3>
            <p>Pega un enlace de YouTube (ej. Lofi, Música Épica) para ambientar tu estudio.</p>
          </div>

          <div class="music-controls">
            <input
              type="text"
              v-model="musicaUrl"
              placeholder="https://www.youtube.com/watch?v=..."
              class="music-input"
              @keyup.enter="guardarMusica"
            />
            <button @click="guardarMusica" class="btn-rpg primary music-btn">
              <img src="/iconsApp/music.png" alt="Guardar" class="btn-icon-sm" /> Guardar
            </button>
            <button v-if="musicaId" @click="detenerMusica" class="btn-rpg danger music-btn">
              <img src="/iconsApp/muted.png" alt="Silenciar" class="btn-icon-sm" /> Silenciar
            </button>
          </div>

          <div v-if="musicaId" class="iframe-container">
            <iframe
              width="100%"
              height="120"
              :src="`https://www.youtube.com/embed/${musicaId}?autoplay=1&loop=1&playlist=${musicaId}`"
              title="Reproductor de Bardo"
              frameborder="0"
              allow="
                accelerometer;
                autoplay;
                clipboard-write;
                encrypted-media;
                gyroscope;
                picture-in-picture;
              "
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'
import { useDialog } from '../composables/useDialog'

import ListaTareas from '../components/ListaTareas.vue'
import PomodoroTimer from '../components/PomodoroTimer.vue'
import EquipoHeroes from '../components/EquipoHeroes.vue'

const router = useRouter()
const { showAlert } = useDialog()

const tareas = ref([])
const equipo = ref([])
const usuario = ref({ username: 'Comandante' })
const configPomodoro = ref({
  workDurationMinutes: 25,
  shortBreakDurationMinutes: 5,
  longBreakDurationMinutes: 30,
  cyclesBeforeLongBreak: 4,
})

// Variables para el reproductor de música
const musicaUrl = ref('')
const musicaId = ref('')

const cargarDatos = async () => {
  try {
    const configRes = await api.get('/pomodoro/config')
    configPomodoro.value = configRes.data

    usuario.value.username = localStorage.getItem('username') || 'Guerrero'

    const tareasRes = await api.get('/tareas')
    tareas.value = tareasRes.data.filter((t) => !t.completada)

    const heroesRes = await api.get('/heroes/activos')
    equipo.value = heroesRes.data

    // Cargar la música guardada en el navegador
    const musicaGuardada = localStorage.getItem('youtubeMusicId')
    if (musicaGuardada) {
      musicaId.value = musicaGuardada
    }
  } catch (error) {
    console.error('Error al cargar los datos de la fortaleza:', error)
    if (error.response?.status === 401) router.push('/')
  }
}

// --- MÉTODOS DE MÚSICA ---
const extraerIdYoutube = (url) => {
  // Regex para extraer el ID de casi cualquier formato de URL de Youtube
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

const guardarMusica = () => {
  if (!musicaUrl.value) return

  const id = extraerIdYoutube(musicaUrl.value)
  if (id) {
    musicaId.value = id
    localStorage.setItem('youtubeMusicId', id)
    showAlert('El Bardo ha comenzado a tocar', 'success', 'Música Vinculada')
    musicaUrl.value = '' // Limpiamos el input
  } else {
    showAlert('No se pudo reconocer el enlace de YouTube.', 'warning', 'Enlace Inválido')
  }
}

const detenerMusica = () => {
  musicaId.value = ''
  localStorage.removeItem('youtubeMusicId')
  showAlert('El Bardo se ha tomado un descanso.', 'info', 'Silenciado')
}

// --- MÉTODOS PARA CONTROLAR LAS TAREAS DESDE EL DASHBOARD ---

const agregarTarea = async (titulo) => {
  try {
    const res = await api.post('/tareas', { titulo, completada: false })
    tareas.value.push(res.data)
    showAlert('Misión creada exitosamente', 'success', 'Misión Creada')
  } catch (e) {
    const mensajeReal = e.response?.data?.message || e.message
    showAlert('Error al crear la misión: ' + mensajeReal, 'error', 'Error')
  }
}

const toggleCompletada = async (tarea) => {
  try {
    await api.patch(`/tareas/${tarea.id}`, { completada: !tarea.completada })
    tarea.completada = !tarea.completada

    if (tarea.completada) {
      tarea.timeoutId = setTimeout(() => {
        tareas.value = tareas.value.filter((t) => t.id !== tarea.id)
      }, 3000)
    } else {
      if (tarea.timeoutId) {
        clearTimeout(tarea.timeoutId)
        tarea.timeoutId = null
      }
    }
  } catch (e) {
    const mensajeReal = e.response?.data?.message || e.message
    showAlert('Error al actualizar la misión: ' + mensajeReal, 'error', 'Error')
  }
}

const editarTarea = async (tareaData) => {
  try {
    await api.patch(`/tareas/${tareaData.id}`, { titulo: tareaData.titulo })
    const index = tareas.value.findIndex((t) => t.id === tareaData.id)
    if (index !== -1) {
      tareas.value[index].titulo = tareaData.titulo
    }
    showAlert('Misión editada', 'success', 'Misión Actualizada')
  } catch (e) {
    const mensajeReal = e.response?.data?.message || e.message
    showAlert('Error al editar la misión: ' + mensajeReal, 'error', 'Error')
  }
}

const eliminarTarea = async (id) => {
  try {
    await api.post('/tareas/borrar', { id })
    tareas.value = tareas.value.filter((t) => t.id !== id)
    showAlert('Misión eliminada', 'success', 'Misión Eliminada')
  } catch (e) {
    const mensajeReal = e.response?.data?.message || e.message
    showAlert('Error al eliminar la misión: ' + mensajeReal, 'error', 'Error')
  }
}

const registrarEntrenamiento = async () => {
  try {
    const res = await api.post('/pomodoro/finish')
    showAlert(res.data.message, 'success', '¡Ciclo Completado!')
    await cargarDatos()
  } catch (error) {
    console.error('Error al procesar el fin de ciclo:', error)
    showAlert('Hubo un error al guardar tu progreso.', 'error', 'Error del Servidor')
  }
}

const abrirBatalla = () => {
  // Si no hay equipo, mostramos alerta y no abrimos el popup
  if (!equipo.value || equipo.value.length === 0) {
    showAlert(
      'Tu equipo activo está vacío. ¡Ve al Campamento y prepara a tus héroes antes de luchar!',
      'warning',
      'Campamento Vacío',
    )
    return
  }

  const routeData = router.resolve({ path: '/battle' })

  // Guardamos la referencia a la ventana que acabamos de abrir
  const ventanaBatalla = window.open(
    routeData.href,
    '_blank',
    'width=1280,height=800,menubar=no,toolbar=no,location=no,status=no',
  )

  // Intervalo que vigila si la ventana de batalla se ha cerrado
  const monitorVentana = setInterval(() => {
    // Si la ventana es nula o se ha cerrado
    if (!ventanaBatalla || ventanaBatalla.closed) {
      clearInterval(monitorVentana) // Detenemos el monitor
      cargarDatos() // Refrescamos todos los datos del dashboard
    }
  }, 500) // Comprueba el estado cada 500 milisegundos
}
const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('username')
  router.push('/')
}

onMounted(() => {
  cargarDatos()
})
</script>

<style scoped>
.page-shell {
  background: linear-gradient(135deg, var(--bg-main) 0%, var(--bg-secondary) 100%);
  min-height: 100vh;
  font-family: sans-serif;
  padding: 20px;
  transition: background 0.3s ease;
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-card {
  background: linear-gradient(135deg, var(--panel-bg) 0%, var(--panel-hover, #4a2f7a) 100%);
  border-radius: 14px;
  padding: 24px;
  border: 3px solid var(--stroke-light, #4a2f7a);
  box-shadow:
    0 0 30px rgba(179, 102, 255, 0.2),
    0 8px 25px rgba(0, 0, 0, 0.4);
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid var(--primary-light, #d99fff);
  padding-bottom: 15px;
  color: var(--text-main);
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.top-bar h2 {
  margin: 0;
  color: var(--accent-gold, #ffd700);
  font-size: 1.6rem;
  text-shadow:
    0 0 10px rgba(179, 102, 255, 0.3),
    1px 1px 2px rgba(0, 0, 0, 0.6);
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.h2-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0 0 6px rgba(255, 215, 0, 0.5));
}

.nav-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-nav {
  background: linear-gradient(135deg, rgba(179, 102, 255, 0.3) 0%, rgba(125, 51, 204, 0.3) 100%);
  color: var(--text-main);
  border: 2px solid var(--primary-dark, #7d33cc);
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow:
    0 0 10px rgba(179, 102, 255, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.2);
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-nav img {
  width: 22px;
  height: 22px;
  object-fit: contain;
  flex-shrink: 0;
}

.btn-nav:hover {
  background: linear-gradient(
    135deg,
    var(--primary, #b366ff) 0%,
    var(--primary-dark, #7d33cc) 100%
  );
  border-color: var(--primary-light, #d99fff);
  color: var(--text-main);
  transform: translateY(-2px);
  box-shadow:
    0 0 20px rgba(179, 102, 255, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-nav.active {
  background: linear-gradient(
    135deg,
    var(--primary, #b366ff) 0%,
    var(--primary-dark, #7d33cc) 100%
  );
  border-color: var(--primary-light, #d99fff);
  box-shadow:
    0 0 20px rgba(179, 102, 255, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.3);
}

.battle-btn {
  border-color: var(--damage, #ff4466);
  color: var(--damage, #ff4466);
  background: linear-gradient(135deg, rgba(255, 68, 102, 0.2) 0%, rgba(200, 30, 60, 0.2) 100%);
}

.battle-btn:hover {
  background: linear-gradient(135deg, var(--damage, #ff4466) 0%, #cc1111 100%);
  color: white;
  border-color: var(--damage, #ff4466);
  box-shadow:
    0 0 20px rgba(255, 68, 102, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn-logout {
  background: transparent;
  color: var(--damage, #ff4466);
  border: 2px solid var(--damage, #ff4466);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.btn-logout:hover {
  background: var(--damage, #ff4466);
  color: white;
  box-shadow: 0 0 15px rgba(255, 68, 102, 0.4);
  transform: translateY(-2px);
}

.main-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

/* --- ESTILOS BARDO (MÚSICA) --- */
.music-section {
  margin-top: 20px;
  padding: 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(61, 37, 99, 0.6) 0%, rgba(74, 47, 122, 0.6) 100%);
  border: 2px solid var(--primary-dark, #7d33cc);
}

.music-header h3 {
  margin: 0 0 5px 0;
  color: var(--primary-light, #d99fff);
  font-size: 1.3rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  gap: 10px;
}

.bardo-icon {
  width: 30px;
  height: 30px;
  object-fit: contain;
  filter: drop-shadow(0 0 6px rgba(179, 102, 255, 0.6));
  transition: all 0.3s ease;
}

.btn-icon-sm {
  width: 18px;
  height: 18px;
  object-fit: contain;
  vertical-align: middle;
}

.music-header p {
  margin: 0 0 15px 0;
  color: var(--text-secondary);
  font-size: 0.95rem;
}

.music-controls {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 15px;
}

.music-input {
  flex-grow: 1;
  padding: 12px;
  border-radius: 8px;
  border: 2px solid var(--stroke-light);
  background: var(--bg-main);
  color: var(--text-main);
  font-family: inherit;
  font-size: 1rem;
}

.music-input:focus {
  outline: none;
  border-color: var(--primary-light);
  box-shadow: 0 0 10px rgba(179, 102, 255, 0.3);
}

.music-btn {
  padding: 12px 20px;
  font-size: 1rem;
}

.iframe-container {
  border-radius: 10px;
  overflow: hidden;
  border: 2px solid var(--primary-dark);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

/* RESPONSIVIDAD */
@media (max-width: 1024px) {
  .page-shell {
    padding: 15px;
  }
  .page-card {
    padding: 18px;
    border-radius: 12px;
  }
  .top-bar h2 {
    font-size: 1.3rem;
  }
  .btn-nav {
    padding: 8px 14px;
    font-size: 0.8rem;
  }
}

@media (max-width: 768px) {
  .main-layout {
    grid-template-columns: 1fr;
  }
  .page-shell {
    padding: 10px;
  }
  .page-card {
    padding: 15px;
  }
  .dashboard-container {
    gap: 15px;
  }
  .top-bar {
    flex-direction: column;
    align-items: stretch;
    border-bottom: 2px solid var(--primary-light, #d99fff);
    padding-bottom: 12px;
    margin-bottom: 15px;
  }
  .top-bar h2 {
    font-size: 1.1rem;
    margin: 0;
  }
  .nav-buttons {
    flex-direction: column;
    gap: 8px;
  }
  .btn-nav,
  .btn-logout {
    text-align: center;
    padding: 10px 12px;
    font-size: 0.75rem;
    width: 100%;
  }
  .music-controls {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .page-shell {
    padding: 8px;
  }
  .page-card {
    padding: 12px;
    border-radius: 10px;
    border: 2px solid var(--stroke-light, #4a2f7a);
  }
  .top-bar {
    padding-bottom: 10px;
    margin-bottom: 12px;
    gap: 10px;
  }
  .top-bar h2 {
    font-size: 0.95rem;
    text-align: center;
    width: 100%;
  }
  .nav-buttons {
    gap: 6px;
  }
  .btn-nav,
  .btn-logout {
    padding: 8px 10px;
    font-size: 0.65rem;
    letter-spacing: 0px;
  }
  .dashboard-container {
    gap: 12px;
  }
}
</style>
