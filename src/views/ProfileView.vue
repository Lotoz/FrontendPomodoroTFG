<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useDialog } from '../composables/useDialog'

const router = useRouter()
const authStore = useAuthStore()
const { showAlert } = useDialog()

// Estados de carga para los botones
const savingProfile = ref(false)
const savingPassword = ref(false)
const savingPomodoro = ref(false)

// Datos del Perfil (Usuario, Email y Maestro)
const profileData = ref({
  username: '',
  email: '',
  masterName: 'lotoz',
})

// Datos de la Contraseña
const passwordData = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// Datos del Pomodoro
const pomodoroData = ref({
  workDurationMinutes: 25,
  shortBreakDurationMinutes: 5,
  longBreakDurationMinutes: 30,
  cyclesBeforeLongBreak: 4,
})

const cargarDatos = async () => {
  try {
    profileData.value.username = localStorage.getItem('username') || 'Comandante'
    profileData.value.masterName = authStore.masterName || 'lotoz'

    const configRes = await api.get('/pomodoro/config')
    if (configRes.data) {
      pomodoroData.value = configRes.data
    }
  } catch (error) {
    if (error.response?.status === 401) router.push('/')
  }
}

const saveProfile = async () => {
  savingProfile.value = true
  try {
    const res = await api.put('/auth/profile', profileData.value)

    // Aplicamos los cambios visuales y guardamos en local
    authStore.applyTheme(profileData.value.masterName)
    localStorage.setItem('masterName', profileData.value.masterName)

    // Mostramos el mensaje que viene desde Java
    showAlert(res.data.message, 'success', 'Perfil Actualizado')
  } catch (e) {
    const errorMsg = e.response?.data?.message || 'Error al actualizar el perfil'
    showAlert(errorMsg, 'error', 'Error')
  } finally {
    savingProfile.value = false
  }
}

const savePassword = async () => {
  if (passwordData.value.newPassword !== passwordData.value.confirmPassword) {
    showAlert('Las contraseñas nuevas no coinciden', 'warning', ' Validación')
    return
  }
  savingPassword.value = true
  try {
    const res = await api.put('/auth/password', passwordData.value)

    // Mostramos el mensaje que viene desde Java
    showAlert(res.data.message, 'success', 'Contraseña Cambiada')

    // Limpiamos los campos
    passwordData.value = { currentPassword: '', newPassword: '', confirmPassword: '' }
  } catch (e) {
    const errorMsg = e.response?.data?.message || 'Error al cambiar la contraseña'
    showAlert(errorMsg, 'error', 'Error')
  } finally {
    savingPassword.value = false
  }
}

const savePomodoro = async () => {
  savingPomodoro.value = true
  try {
    const res = await api.put('/pomodoro/settings', pomodoroData.value)
    showAlert('Tiempos de entrenamiento guardados', 'success', 'Configuración Guardada')
  } catch (e) {
    const errorMsg = e.response?.data?.message || 'Error al actualizar el Pomodoro'
    showAlert(errorMsg, 'error', 'Error')
  } finally {
    savingPomodoro.value = false
  }
}
const confirmResetProgress = async () => {
  const confirm = await showConfirm(
    '¿Estás seguro de que quieres reducir tu progreso a cenizas? Perderás todo tu equipo, bestias y misiones. Esta acción no se puede deshacer.',
    '¿Reiniciar Progreso?',
  )
  if (!confirm) return

  resettingProgress.value = true
  try {
    const res = await api.post('/auth/reset-progress')
    showAlert(res.data.message, 'success', 'Progreso Reiniciado')
  } catch (e) {
    const errorMsg = e.response?.data?.message || 'Error al reiniciar el progreso'
    showAlert(errorMsg, 'error', 'Error')
  } finally {
    resettingProgress.value = false
  }
}

const confirmDeleteAccount = async () => {
  const confirm = await showConfirm(
    '¿Estás absolutamente seguro de que quieres destruir la Fortaleza? Tu cuenta y todo tu progreso serán eliminados para siempre.',
    '¿Eliminar Cuenta?',
  )
  if (!confirm) return

  deletingAccount.value = true
  try {
    const res = await api.post('/auth/delete-account')
    showAlert(res.data.message, 'success', 'Fortaleza Destruida')

    // Limpiamos la sesión y expulsamos al jugador al login
    authStore.logout()
    router.push('/')
  } catch (e) {
    const errorMsg = e.response?.data?.message || 'Error al eliminar la cuenta'
    showAlert(errorMsg, 'error', 'Error')
  } finally {
    deletingAccount.value = false
  }
}

onMounted(() => {
  cargarDatos()
})
</script>
<template>
  <div class="page-shell">
    <div class="settings-container">
      <header class="header-top">
        <h1>
          <img src="/iconsApp/config.png" alt="Ajustes" class="h1-icon" /> Ajustes de la Fortaleza
        </h1>
        <button @click="router.push('/dashboard')" class="btn-back">Volver al Tablón</button>
      </header>

      <div class="settings-grid">
        <section class="panel">
          <h3>
            <img src="/iconsApp/user.png" alt="Comandante" class="h3-icon" /> Datos del Comandante
          </h3>

          <div class="form-group">
            <label>Nombre de Usuario</label>
            <input
              v-model="profileData.username"
              type="text"
              class="form-input"
              disabled
              title="El nombre de usuario no se puede cambiar"
            />
          </div>

          <div class="form-group">
            <label>Correo Electrónico</label>
            <input
              v-model="profileData.email"
              type="email"
              class="form-input"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div class="form-group">
            <label>Cambiar Maestro (Paleta de Colores)</label>
            <div class="master-grid">
              <div
                class="master-card icefrost"
                :class="{ selected: profileData.masterName === 'icefrost' }"
                @click="profileData.masterName = 'icefrost'"
              >
                <span class="emoji"><img src="/iconsApp/icefrost.png" alt="Icefrost" /></span
                ><span class="name">Icefrost</span>
              </div>
              <div
                class="master-card blody"
                :class="{ selected: profileData.masterName === 'blody' }"
                @click="profileData.masterName = 'blody'"
              >
                <span class="emoji"><img src="/iconsApp/bloody.png" alt="Blody" /></span
                ><span class="name">Blody</span>
              </div>
              <div
                class="master-card vindicator"
                :class="{ selected: profileData.masterName === 'vindicator' }"
                @click="profileData.masterName = 'vindicator'"
              >
                <span class="emoji"><img src="/iconsApp/vindicator.png" alt="Vindicator" /></span
                ><span class="name">Vindicator</span>
              </div>
              <div
                class="master-card lotoz"
                :class="{ selected: profileData.masterName === 'lotoz' }"
                @click="profileData.masterName = 'lotoz'"
              >
                <span class="emoji"><img src="/iconsApp/lotoz.png" alt="Lotoz" /></span
                ><span class="name">Lotoz</span>
              </div>
            </div>
          </div>

          <button @click="saveProfile" :disabled="savingProfile" class="btn-save">
            {{ savingProfile ? 'Guardando...' : 'Guardar Perfil' }}
          </button>
        </section>

        <section class="panel">
          <h3><img src="/iconsApp/lock.png" alt="Seguridad" class="h3-icon" /> Seguridad</h3>

          <div class="form-group">
            <label>Contraseña Actual</label>
            <input v-model="passwordData.currentPassword" type="password" class="form-input" />
          </div>

          <div class="form-group">
            <label>Nueva Contraseña</label>
            <input v-model="passwordData.newPassword" type="password" class="form-input" />
          </div>

          <div class="form-group">
            <label>Confirmar Nueva Contraseña</label>
            <input v-model="passwordData.confirmPassword" type="password" class="form-input" />
          </div>

          <button @click="savePassword" :disabled="savingPassword" class="btn-save">
            {{ savingPassword ? 'Actualizando...' : 'Cambiar Contraseña' }}
          </button>
        </section>
        <section class="panel danger-panel">
          <h3><img src="/iconsApp/warning.png" alt="Peligro" class="h3-icon" /> Zona de Peligro</h3>
          <p class="danger-text">
            Estas acciones son irreversibles. Procede con precaución, Comandante.
          </p>

          <div class="danger-buttons">
            <button
              @click="confirmResetProgress"
              :disabled="resettingProgress"
              class="btn-danger-outline"
            >
              {{ resettingProgress ? 'Destruyendo...' : 'Reiniciar Progreso' }}
            </button>

            <button @click="confirmDeleteAccount" :disabled="deletingAccount" class="btn-danger">
              {{ deletingAccount ? 'Aniquilando...' : 'Eliminar Cuenta' }}
            </button>
          </div>
        </section>

        <section class="panel pomodoro-panel">
          <h3>
            <img src="/iconsApp/troph.png" alt="Entrenamiento" class="h3-icon" /> Entrenamiento
            (Pomodoro)
          </h3>

          <div class="form-group">
            <label>Tiempo de Trabajo (minutos)</label>
            <input
              v-model.number="pomodoroData.workDurationMinutes"
              type="number"
              min="1"
              max="120"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Descanso Corto (minutos)</label>
            <input
              v-model.number="pomodoroData.shortBreakDurationMinutes"
              type="number"
              min="1"
              max="60"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Descanso Largo (minutos)</label>
            <input
              v-model.number="pomodoroData.longBreakDurationMinutes"
              type="number"
              min="1"
              max="120"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label>Ciclos antes del Descanso Largo</label>
            <input
              v-model.number="pomodoroData.cyclesBeforeLongBreak"
              type="number"
              min="1"
              max="10"
              class="form-input"
            />
          </div>

          <button @click="savePomodoro" :disabled="savingPomodoro" class="btn-save">
            {{ savingPomodoro ? 'Guardando...' : 'Guardar Tiempos' }}
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-shell {
  background-color: var(--bg-main);
  min-height: 100vh;
  padding: 20px;
  font-family: sans-serif;
  transition: background-color 0.3s;
}
.settings-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 4px solid var(--stroke);
  padding-bottom: 15px;
}
.header-top h1 {
  color: var(--primary);
  font-size: 2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.h1-icon,
.h3-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  vertical-align: middle;
  flex-shrink: 0;
}
.btn-back {
  background: var(--stroke);
  color: var(--text-main);
  border: 2px solid var(--panel-bg);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}
.btn-back:hover {
  background: var(--primary);
  color: var(--bg-main);
}

.settings-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

@media (max-width: 900px) {
  .page-shell {
    padding: 15px;
  }

  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--stroke);
  }

  .header-top h1 {
    font-size: 1.5rem;
  }

  .btn-back {
    width: 100%;
    text-align: center;
  }

  .settings-grid {
    grid-template-columns: 1fr;
  }

  .panel {
    padding: 18px;
  }

  .panel h3 {
    font-size: 1.1rem;
    margin-bottom: 15px;
  }

  .master-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .master-card .emoji {
    width: 45px;
    height: 45px;
  }
}

@media (max-width: 768px) {
  .page-shell {
    padding: 10px;
  }

  .settings-container {
    gap: 12px;
  }

  .header-top {
    flex-direction: column;
    gap: 10px;
    padding-bottom: 10px;
  }

  .header-top h1 {
    font-size: 1.2rem;
  }

  .btn-back {
    width: 100%;
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .settings-grid {
    gap: 12px;
  }

  .panel {
    padding: 15px;
    border-radius: 10px;
  }

  .panel h3 {
    font-size: 1rem;
    margin-bottom: 12px;
    padding-bottom: 8px;
  }

  .form-group {
    margin-bottom: 12px;
  }

  .form-group label {
    font-size: 0.9rem;
    margin-bottom: 6px;
  }

  .form-input {
    padding: 8px 10px;
    font-size: 0.95rem;
  }

  .btn-save {
    padding: 10px;
    font-size: 0.95rem;
    margin-top: 8px;
  }

  .master-grid {
    gap: 8px;
  }

  .master-card {
    padding: 8px;
  }

  .master-card .emoji {
    width: 45px;
    height: 45px;
  }

  .master-card .name {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .page-shell {
    padding: 8px;
  }

  .settings-container {
    gap: 10px;
  }

  .header-top {
    padding-bottom: 8px;
    border-bottom: 2px solid var(--stroke);
  }

  .header-top h1 {
    font-size: 1.1rem;
  }

  .btn-back {
    width: 100%;
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .settings-grid {
    gap: 10px;
  }

  .panel {
    padding: 12px;
    border-radius: 8px;
    border: 2px solid var(--stroke);
  }

  .panel h3 {
    font-size: 0.95rem;
    margin-bottom: 10px;
    padding-bottom: 6px;
  }

  .form-group {
    margin-bottom: 10px;
  }

  .form-group label {
    font-size: 0.85rem;
    margin-bottom: 4px;
  }

  .form-input {
    padding: 6px 8px;
    font-size: 0.9rem;
  }

  .btn-save {
    padding: 8px;
    font-size: 0.85rem;
    margin-top: 6px;
  }

  .master-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;
  }

  .master-card {
    padding: 6px;
  }

  .master-card .emoji {
    width: 40px;
    height: 40px;
    margin-bottom: 3px;
  }

  .master-card .name {
    font-size: 0.7rem;
  }
}

.pomodoro-panel {
  grid-column: 1 / -1;
}

.panel {
  background: var(--panel-bg);
  border-radius: 12px;
  padding: 24px;
  border: 3px solid var(--stroke);
  color: var(--text-main);
  transition: all 0.3s;
}
.panel h3 {
  color: var(--primary);
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--stroke);
  padding-bottom: 10px;
}

.form-group {
  margin-bottom: 18px;
}
.form-group label {
  display: block;
  font-weight: bold;
  font-size: 0.95rem;
  margin-bottom: 8px;
  opacity: 0.9;
}
.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid var(--stroke);
  border-radius: 8px;
  font-size: 1rem;
  color: var(--text-main);
  background: var(--bg-main);
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.form-input:focus {
  outline: none;
  border-color: var(--primary);
}
.form-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-save {
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: var(--bg-main);
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.05rem;
  cursor: pointer;
  transition: opacity 0.2s;
  margin-top: 10px;
}
.btn-save:hover:not(:disabled) {
  opacity: 0.8;
}
.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Selector de Maestro */
.master-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.master-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: var(--bg-main);
  border: 2px solid var(--stroke);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.master-card.selected {
  transform: scale(1.05);
}
.master-card .emoji {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  margin-bottom: 5px;
}

.master-card .emoji img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.master-card .name {
  font-weight: bold;
  font-size: 0.85rem;
  color: var(--text-main);
}
.master-card.icefrost.selected {
  border-color: #0284c7;
  background: #bae6fd;
}
.master-card.icefrost.selected .name {
  color: #0c4a6e;
}
.master-card.blody.selected {
  border-color: #b91c1c;
  background: #fca5a5;
}
.master-card.blody.selected .name {
  color: #7f1d1d;
}
.master-card.vindicator.selected {
  border-color: #8fbfd5;
  background: #485454;
}
.master-card.vindicator.selected .name {
  color: #ede6c8;
}
.master-card.lotoz.selected {
  border-color: #d946ef;
  background: #4c1d95;
}
.master-card.lotoz.selected .name {
  color: #fef08a;
}

/* ==========================================
   ZONA DE PELIGRO
   ========================================== */
.danger-panel {
  grid-column: 1 / -1;
  border-color: #ef4444;
  background: linear-gradient(135deg, var(--panel-bg) 0%, rgba(239, 68, 68, 0.05) 100%);
}

.danger-panel h3 {
  color: #ef4444;
  border-bottom-color: rgba(239, 68, 68, 0.3);
}

.danger-text {
  color: var(--text-main);
  opacity: 0.8;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.danger-buttons {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}

.btn-danger-outline {
  flex: 1;
  padding: 12px;
  background: transparent;
  color: #ef4444;
  border: 2px solid #ef4444;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 200px;
}

.btn-danger-outline:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.1);
  transform: translateY(-2px);
}

.btn-danger {
  flex: 1;
  padding: 12px;
  background: #ef4444;
  color: white;
  border: 2px solid #ef4444;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1.05rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 200px;
  box-shadow: 0 4px 10px rgba(239, 68, 68, 0.3);
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
  border-color: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(239, 68, 68, 0.4);
}

.btn-danger:disabled,
.btn-danger-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}
</style>
