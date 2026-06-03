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
          <span class="emoji"><img src="/iconsApp/icefrost.png" alt="Icefrost" /></span
          ><span class="name">Icefrost</span>
        </div>
        <div
          class="master-card blody"
          :class="{ selected: form.masterName === 'blody' }"
          @click="form.masterName = 'blody'"
        >
          <span class="emoji"><img src="/iconsApp/bloody.png" alt="Blody" /></span
          ><span class="name">Blody</span>
        </div>
        <div
          class="master-card vindicator"
          :class="{ selected: form.masterName === 'vindicator' }"
          @click="form.masterName = 'vindicator'"
        >
          <span class="emoji"><img src="/iconsApp/vindicator.png" alt="Vindicator" /></span
          ><span class="name">Vindicator</span>
        </div>
        <div
          class="master-card lotoz"
          :class="{ selected: form.masterName === 'lotoz' }"
          @click="form.masterName = 'lotoz'"
        >
          <span class="emoji"><img src="/iconsApp/lotoz.png" alt="Lotoz" /></span
          ><span class="name">Lotoz</span>
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
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useDialog } from '@/composables/useDialog'

const emit = defineEmits(['cambiar-modo'])
const authStore = useAuthStore()
const router = useRouter()
const { showAlert } = useDialog()
const loading = ref(false)

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
/* Estilos base de form compartidos */
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

/* Estilos específicos de maestros */
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
