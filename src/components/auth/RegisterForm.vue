<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>Nombre de Comandante</label>
      <input v-model="form.username" type="text" required />
    </div>

    <div class="form-group">
      <label>Dirección de la Fortaleza (Email)</label>
      <input v-model="form.email" type="email" required />
    </div>
    <div class="form-group">
      <label>Confirmar Dirección (Email)</label>
      <input v-model="form.confirmEmail" type="email" required placeholder="Repite tu correo" />
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
      <div class="input-wrapper">
        <input v-model="form.password" :type="showPassword ? 'text' : 'password'" required />
        <button
          type="button"
          class="btn-eye"
          @click="showPassword = !showPassword"
          :title="showPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
        >
          <svg v-if="!showPassword" viewBox="0 0 24 24">
            <path
              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24">
            <path
              d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.25 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="form-group">
      <label>Confirmar Contraseña Mágica</label>
      <div class="input-wrapper">
        <input
          v-model="form.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          required
          placeholder="Repite tu contraseña"
        />
        <button
          type="button"
          class="btn-eye"
          @click="showConfirmPassword = !showConfirmPassword"
          :title="showConfirmPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
        >
          <svg v-if="!showConfirmPassword" viewBox="0 0 24 24">
            <path
              d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
            />
          </svg>
          <svg v-else viewBox="0 0 24 24">
            <path
              d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.25 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
            />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="authStore.error" class="error-msg">
      {{ authStore.error }}
    </div>

    <button type="submit" class="btn-primary" :disabled="loading">
      {{ loading ? 'Canalizando magia...' : 'Reclamar Maestro' }}
    </button>
  </form>

  <div class="nav-links">
    <button @click="$emit('cambiar-modo', 'login')" class="btn-text">
      Volver a la entrada de la Fortaleza
    </button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useDialog } from '../../composables/useDialog'
import { useRouter } from 'vue-router'

const emit = defineEmits(['cambiar-modo'])
const authStore = useAuthStore()
const router = useRouter()
const { showAlert } = useDialog()
const loading = ref(false)

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  username: '',
  email: '',
  confirmEmail: '',
  password: '',
  confirmPassword: '',
  masterName: 'lotoz',
})

const handleSubmit = async () => {
  loading.value = true
  try {
    if (form.email !== form.confirmEmail) {
      showAlert('Las direcciones de la fortaleza no coinciden.', 'warning', 'Pergamino Inválido')
      return
    }
    if (form.password !== form.confirmPassword) {
      showAlert('Las contraseñas mágicas no coinciden.', 'warning', 'Sello Roto')
      return
    }
    const success = await authStore.register(
      form.username,
      form.email,
      form.password,
      form.masterName,
    )
    if (success) router.push('/dashboard')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1.2rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}
.form-group input {
  width: 100%;
  padding: 0.8rem;
  padding-right: 2.5rem;
  background: var(--bg-main);
  border: 2px solid var(--stroke);
  color: var(--text-main);
  border-radius: 8px;
  font-size: 1rem;
  box-sizing: border-box;
}
.form-group input:focus {
  outline: none;
  border-color: var(--primary);
}

.btn-eye {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: var(--text-main);
  opacity: 0.8;
  filter: drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.6));
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-eye:hover {
  opacity: 1;
  color: var(--primary);
  transform: scale(1.1);
}
.btn-eye svg {
  width: 22px;
  height: 22px;
  fill: currentColor;
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
.nav-links {
  display: flex;
  flex-direction: column;
  margin-top: 1.5rem;
}
.btn-text {
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
    font-size: 0.8rem;
  }
}
</style>
