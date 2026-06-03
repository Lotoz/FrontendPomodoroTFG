<template>
  <div class="login-container">
    <div class="login-card" :class="{ 'card-wide': currentMode === 'register' }">
      <h2>{{ getTitle }}</h2>

      <form @submit.prevent="handleSubmit">
        <!-- MODO: LOGIN -->
        <template v-if="currentMode === 'login'">
          <div class="form-group">
            <label>Nombre de Comandante</label>
            <input v-model="form.username" type="text" required />
          </div>
          <div class="form-group">
            <label>Contraseña Mágica</label>
            <input v-model="form.password" type="password" required />
          </div>
        </template>

        <!-- MODO: REGISTRO -->
        <template v-else-if="currentMode === 'register'">
          <div class="form-group">
            <label>Nombre de Comandante</label>
            <input v-model="form.username" type="text" required />
          </div>

          <div class="form-group">
            <label>Email Cifrado</label>
            <input v-model="form.email" type="email" required />
          </div>
          <div class="form-group">
            <label>Confirmar Email Cifrado</label>
            <input
              v-model="form.confirmEmail"
              type="email"
              required
              placeholder="Repite tu correo"
            />
          </div>

          <div class="form-group">
            <label>Elige a tu Maestro</label>
            <div class="master-grid">
              <div
                class="master-card icefrost"
                :class="{ selected: form.masterName === 'icefrost' }"
                @click="form.masterName = 'icefrost'"
              >
                <span class="emoji"><img src="/iconsApp/icefrost.png" alt="Icefrost" /></span>
                <span class="name">Icefrost</span>
              </div>
              <div
                class="master-card blody"
                :class="{ selected: form.masterName === 'blody' }"
                @click="form.masterName = 'blody'"
              >
                <span class="emoji"><img src="/iconsApp/bloody.png" alt="Blody" /></span>
                <span class="name">Blody</span>
              </div>
              <div
                class="master-card vindicator"
                :class="{ selected: form.masterName === 'vindicator' }"
                @click="form.masterName = 'vindicator'"
              >
                <span class="emoji"><img src="/iconsApp/vindicator.png" alt="Vindicator" /></span>
                <span class="name">Vindicator</span>
              </div>
              <div
                class="master-card lotoz"
                :class="{ selected: form.masterName === 'lotoz' }"
                @click="form.masterName = 'lotoz'"
              >
                <span class="emoji"><img src="/iconsApp/lotoz.png" alt="Lotoz" /></span>
                <span class="name">Lotoz</span>
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Contraseña Mágica</label>
            <input v-model="form.password" type="password" required />
          </div>
          <div class="form-group">
            <label>Confirmar Contraseña Mágica</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              required
              placeholder="Repite tu contraseña"
            />
          </div>
        </template>

        <!-- MODO: OLVIDÉ CONTRASEÑA -->
        <template v-else-if="currentMode === 'forgot'">
          <p class="instruction-text">
            Introduce tu correo para recibir un pergamino de recuperación.
          </p>
          <div class="form-group">
            <label>Email Cifrado</label>
            <input v-model="form.email" type="email" required />
          </div>
        </template>

        <!-- MODO: RESTABLECER CONTRASEÑA -->
        <template v-else-if="currentMode === 'reset'">
          <p class="instruction-text">Introduce el código de 6 dígitos enviado a tu correo.</p>
          <div class="form-group">
            <label>Código de Recuperación</label>
            <input v-model="form.code" type="text" placeholder="Ej: 123456" required />
          </div>
          <div class="form-group">
            <label>Nueva Contraseña Mágica</label>
            <input v-model="form.password" type="password" required />
          </div>
        </template>

        <!-- MENSAJE DE ERROR DEL STORE -->
        <div v-if="authStore.error" class="error-msg">
          {{ authStore.error }}
        </div>

        <button type="submit" class="btn-primary" :disabled="loading">
          {{ getButtonText }}
        </button>
      </form>

      <div class="nav-links">
        <button
          v-if="currentMode === 'login'"
          @click="setMode('forgot')"
          class="btn-text warning-text"
        >
          ¿Olvidaste tu contraseña?
        </button>
        <button v-if="currentMode === 'login'" @click="setMode('register')" class="btn-text">
          ¿Buscas maestro? Regístrate
        </button>
        <button v-if="currentMode !== 'login'" @click="setMode('login')" class="btn-text">
          Volver a la entrada de la Fortaleza
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
import { useDialog } from '../composables/useDialog'

const authStore = useAuthStore()
const router = useRouter()
const { showAlert } = useDialog()

// Modos posibles: 'login', 'register', 'forgot', 'reset'
const currentMode = ref('login')
const loading = ref(false)

const form = reactive({
  username: '',
  email: '',
  confirmEmail: '', // Nuevo campo
  password: '',
  confirmPassword: '', // Nuevo campo
  code: '',
  masterName: 'lotoz',
})

const getTitle = computed(() => {
  if (currentMode.value === 'register') return 'Forja tu Alianza'
  if (currentMode.value === 'forgot') return 'Recuperar Llave'
  if (currentMode.value === 'reset') return 'Forjar Nueva Llave'
  return 'Entrar a la Fortaleza'
})

const getButtonText = computed(() => {
  if (loading.value) return 'Canalizando magia...'
  if (currentMode.value === 'register') return 'Reclamar Maestro'
  if (currentMode.value === 'forgot') return 'Enviar Pergamino'
  if (currentMode.value === 'reset') return 'Sellar Contraseña'
  return 'Desplegar Tropas'
})

const setMode = (mode) => {
  currentMode.value = mode
  authStore.error = null
  // Limpiamos datos sensibles al cambiar de vista
  form.password = ''
  form.confirmPassword = ''
  form.confirmEmail = ''
  form.code = ''
}

const handleSubmit = async () => {
  loading.value = true
  let success = false

  try {
    if (currentMode.value === 'register') {
      // 1. Barreras de validación local
      if (form.email !== form.confirmEmail) {
        showAlert('Los correos cifrados no coinciden.', 'warning', 'Pergamino Inválido')
        loading.value = false
        return
      }

      if (form.password !== form.confirmPassword) {
        showAlert('Las contraseñas mágicas no coinciden.', 'warning', 'Sello Roto')
        loading.value = false
        return
      }

      // 2. Si pasa las barreras, llama al servidor
      success = await authStore.register(form.username, form.email, form.password, form.masterName)
      if (success) router.push('/dashboard')
    } else if (currentMode.value === 'login') {
      success = await authStore.login(form.username, form.password)
      if (success) router.push('/dashboard')
    } else if (currentMode.value === 'forgot') {
      const res = await authStore.forgotPassword(form.email)
      if (res.success) {
        showAlert(res.message, 'success', 'Pergamino Enviado')
        setMode('reset')
      }
    } else if (currentMode.value === 'reset') {
      const res = await authStore.resetPassword(form.email, form.code, form.password)
      if (res.success) {
        showAlert(res.message, 'success', 'Contraseña Restaurada')
        setMode('login')
      }
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (authStore.masterName) {
    authStore.applyTheme(authStore.masterName)
  }
})
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--bg-main);
  padding: 20px;
  transition: background-color 0.3s ease;
}

.login-card {
  background: var(--panel-bg);
  padding: 2.5rem;
  border-radius: 12px;
  border: 3px solid var(--stroke);
  box-shadow: 0 8px 0px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  color: var(--text-main);
  transition: all 0.3s ease;
}

.login-card h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--primary);
}

.card-wide {
  max-width: 500px !important;
}

.instruction-text {
  text-align: center;
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  line-height: 1.4;
}

.form-group {
  margin-bottom: 1.2rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  background: var(--bg-main);
  border: 2px solid var(--stroke);
  color: var(--text-main);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: var(--primary);
}

.error-msg {
  color: #ef4444;
  background-color: #fee2e2;
  border: 1px solid #f87171;
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background-color: var(--primary);
  color: var(--bg-main);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  font-weight: bold;
  font-size: 1.1rem;
  text-transform: uppercase;
  transition: opacity 0.2s;
}

.btn-primary:hover:not(:disabled) {
  opacity: 0.9;
}
.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.nav-links {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 1.5rem;
}

.btn-text {
  width: 100%;
  background: none;
  border: none;
  color: var(--text-main);
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
  opacity: 0.8;
}

.btn-text:hover {
  opacity: 1;
}

.warning-text {
  color: var(--stun, #ffaa00);
}

.master-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 5px;
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
  font-size: 0.9rem;
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

@media (max-width: 768px) {
  .login-container {
    padding: 15px;
    min-height: auto;
  }

  .login-card {
    padding: 2rem;
    border-radius: 10px;
    max-width: 100%;
  }

  .login-card h2 {
    font-size: 1.3rem;
    margin-bottom: 1.2rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .form-group label {
    font-size: 0.95rem;
  }

  .form-group input {
    padding: 0.7rem;
    font-size: 0.95rem;
  }

  .master-grid {
    grid-template-columns: 1fr 1fr;
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
    font-size: 0.8rem;
  }

  .btn-primary {
    padding: 0.9rem;
    font-size: 1rem;
  }

  .card-wide {
    max-width: 100% !important;
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 10px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
  }

  .login-card {
    padding: 1.5rem;
    border-radius: 8px;
    max-width: 100%;
    margin-top: 20px;
  }

  .login-card h2 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .form-group input {
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  .master-grid {
    gap: 6px;
    margin-top: 8px;
  }

  .master-card .emoji {
    width: 40px;
    height: 40px;
  }

  .btn-primary {
    padding: 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
