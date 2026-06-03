<template>
  <div class="login-container">
    <div class="login-card" :class="{ 'card-wide': currentMode === 'register' }">
      <h2>{{ getTitle }}</h2>

      <!-- Componentes Dinámicos -->
      <LoginForm v-if="currentMode === 'login'" @cambiar-modo="setMode" />
      <RegisterForm v-else-if="currentMode === 'register'" @cambiar-modo="setMode" />
      <ForgotForm
        v-else-if="currentMode === 'forgot'"
        @cambiar-modo="setMode"
        @email-enviado="handleEmailEnviado"
      />
      <ResetForm v-else-if="currentMode === 'reset'" :email="sharedEmail" @cambiar-modo="setMode" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'
import ForgotForm from '../components/auth/ForgotForm.vue'
import ResetForm from '../components/auth/ResetForm.vue'

const authStore = useAuthStore()

// Estado del Padre
const currentMode = ref('login')
const sharedEmail = ref('') // Guarda el email entre el paso de "Olvido" y "Reseteo"

const getTitle = computed(() => {
  if (currentMode.value === 'register') return 'Forja tu Alianza'
  if (currentMode.value === 'forgot') return 'Recuperar Llave'
  if (currentMode.value === 'reset') return 'Forjar Nueva Llave'
  return 'Entrar a la Fortaleza'
})

const setMode = (mode) => {
  currentMode.value = mode
  authStore.error = null // Limpiamos errores al cambiar de vista
}

const handleEmailEnviado = (email) => {
  sharedEmail.value = email
}

onMounted(() => {
  // Mantenemos la lógica global del tema
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
}
</style>
