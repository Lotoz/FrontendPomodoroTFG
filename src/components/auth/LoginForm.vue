<template>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>Nombre de Comandante</label>
      <input v-model="form.username" type="text" required />
    </div>
    <div class="form-group">
      <label>Contraseña Mágica</label>
      <input v-model="form.password" type="password" required />
    </div>

    <div v-if="authStore.error" class="error-msg">
      {{ authStore.error }}
    </div>

    <button type="submit" class="btn-primary" :disabled="loading">
      {{ loading ? 'Canalizando magia...' : 'Desplegar Tropas' }}
    </button>
  </form>

  <div class="nav-links">
    <button @click="$emit('cambiar-modo', 'forgot')" class="btn-text warning-text">
      ¿Olvidaste tu contraseña?
    </button>
    <button @click="$emit('cambiar-modo', 'register')" class="btn-text">
      ¿Buscas maestro? Regístrate
    </button>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const emit = defineEmits(['cambiar-modo'])
const authStore = useAuthStore()
const router = useRouter()
const loading = ref(false)

const form = reactive({
  username: '',
  password: '',
})

const handleSubmit = async () => {
  loading.value = true
  try {
    const success = await authStore.login(form.username, form.password)
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
</style>
