<template>
  <p class="instruction-text">Introduce el código de 6 dígitos enviado a tu correo.</p>
  <form @submit.prevent="handleSubmit">
    <div class="form-group">
      <label>Código de Recuperación</label>
      <input v-model="form.code" type="text" placeholder="Ej: 123456" required />
    </div>
    <div class="form-group">
      <label>Nueva Contraseña Mágica</label>
      <input v-model="form.password" type="password" required />
    </div>

    <div v-if="authStore.error" class="error-msg">
      {{ authStore.error }}
    </div>

    <button type="submit" class="btn-primary" :disabled="loading">
      {{ loading ? 'Canalizando magia...' : 'Sellar Contraseña' }}
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

const props = defineProps({
  email: { type: String, required: true },
})
const emit = defineEmits(['cambiar-modo'])
const authStore = useAuthStore()
const { showAlert } = useDialog()
const loading = ref(false)

const form = reactive({
  code: '',
  password: '',
})

const handleSubmit = async () => {
  loading.value = true
  try {
    const res = await authStore.resetPassword(props.email, form.code, form.password)
    if (res.success) {
      showAlert(res.message, 'success', 'Contraseña Restaurada')
      emit('cambiar-modo', 'login')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
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
  background: var(--primary);
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
</style>
