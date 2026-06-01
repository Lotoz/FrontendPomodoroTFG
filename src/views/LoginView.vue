<template>
  <div class="login-container">
    <div class="login-card" :class="{ 'card-wide': isRegistering }">
      <h2>{{ isRegistering ? 'Forja tu Alianza' : 'Entrar a la Fortaleza' }}</h2>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Nombre de Comandante</label>
          <input v-model="form.username" type="text" required />
        </div>

        <template v-if="isRegistering">
          <div class="form-group">
            <label>Email Cifrado</label>
            <input v-model="form.email" type="email" required />
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
        </template>

        <div class="form-group">
          <label>Contraseña Mágica</label>
          <input v-model="form.password" type="password" required />
        </div>

        <div v-if="authStore.error" class="error-msg">
          {{ authStore.error }}
        </div>

        <button type="submit" class="btn-primary">
          {{ isRegistering ? 'Reclamar Maestro' : 'Desplegar Tropas' }}
        </button>
      </form>

      <button @click="toggleMode" class="btn-text">
        {{ isRegistering ? '¿Ya tienes alianza? Inicia sesión' : '¿Buscas maestro? Regístrate' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const isRegistering = ref(false)
const form = reactive({
  username: '',
  email: '',
  password: '',
  masterName: 'lotoz', // Maestro por defecto
})

const toggleMode = () => {
  isRegistering.value = !isRegistering.value
  authStore.error = null
}

const handleSubmit = async () => {
  let success = false
  if (isRegistering.value) {
    success = await authStore.register(form.username, form.email, form.password, form.masterName)
  } else {
    success = await authStore.login(form.username, form.password)
  }

  if (success) {
    router.push('/dashboard')
  }
}

// Al cargar, si ya había un tema guardado, aplicarlo
onMounted(() => {
  if (authStore.masterName) {
    authStore.applyTheme(authStore.masterName)
  }
})
</script>
<style scoped>
/* Contenedor principal conectado al tema */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--bg-main);
  padding: 20px;
  transition: background-color 0.3s ease;
}

/* Tarjeta de login */
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

/* Formularios */
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

/* Mensaje de error */
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

/* Botones */
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

.btn-primary:hover {
  opacity: 0.9;
}

.btn-text {
  width: 100%;
  background: none;
  border: none;
  color: var(--text-main);
  margin-top: 1.5rem;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
  opacity: 0.8;
}

.btn-text:hover {
  opacity: 1;
}

/* Cuadrícula de Maestros */
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

/* Colores de selección activa (Fijos para que destaquen al seleccionar) */
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

/* RESPONSIVIDAD */
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

  .btn-text {
    font-size: 0.85rem;
    margin-top: 1.2rem;
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
    border: 2px solid var(--stroke);
    max-width: 100%;
    margin-top: 20px;
  }

  .login-card h2 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  .form-group {
    margin-bottom: 0.8rem;
  }

  .form-group label {
    font-size: 0.9rem;
    margin-bottom: 0.4rem;
  }

  .form-group input {
    padding: 0.6rem;
    font-size: 0.9rem;
    border-radius: 6px;
  }

  .master-grid {
    grid-template-columns: 1fr 1fr;
    gap: 6px;
    margin-top: 8px;
  }

  .master-card {
    padding: 6px;
    border-radius: 6px;
  }

  .master-card .emoji {
    width: 40px;
    height: 40px;
    margin-bottom: 3px;
  }

  .master-card .name {
    font-size: 0.7rem;
  }

  .error-msg {
    padding: 0.6rem;
    font-size: 0.8rem;
    margin-bottom: 0.8rem;
  }

  .btn-primary {
    padding: 0.8rem;
    font-size: 0.9rem;
    margin-top: 0.8rem;
  }

  .btn-text {
    font-size: 0.75rem;
    margin-top: 1rem;
  }
}
</style>
