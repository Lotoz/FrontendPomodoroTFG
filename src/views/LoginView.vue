<template>
  <div class="login-shell">
    <div class="background-effects">
      <div class="star-fall">
        <span class="star" v-for="n in 15" :key="`star-${n}`"></span>
      </div>
    </div>

    <div class="login-container">
      <div class="login-card" :class="{ 'card-wide': currentMode === 'register' }">
        <h2>{{ getTitle }}</h2>

        <LoginForm v-if="currentMode === 'login'" @cambiar-modo="setMode" />
        <RegisterForm v-else-if="currentMode === 'register'" @cambiar-modo="setMode" />
        <ForgotForm
          v-else-if="currentMode === 'forgot'"
          @cambiar-modo="setMode"
          @email-enviado="handleEmailEnviado"
        />
        <ResetForm
          v-else-if="currentMode === 'reset'"
          :email="sharedEmail"
          @cambiar-modo="setMode"
        />
      </div>
    </div>

    <footer class="landing-footer">
      <div class="footer-magic-dust"></div>
      <div class="footer-content">
        <p class="footer-text">
          The Adventure of the Pomodoro © {{ new Date().getFullYear() }} - Proyecto de Fin de Grado
          ZG
        </p>

        <a
          href="https://github.com/Lotoz/The-Adventure-of-the-Pomodoro/tree/main"
          target="_blank"
          class="github-magic-link"
        >
          <svg viewBox="0 0 24 24" class="github-icon">
            <path
              d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"
            />
          </svg>
          Inspeccionar Código en GitHub
        </a>

        <div class="footer-index">
          <a href="#" @click.prevent="router.push('/')">Volver a la Presentación</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

import LoginForm from '../components/auth/LoginForm.vue'
import RegisterForm from '../components/auth/RegisterForm.vue'
import ForgotForm from '../components/auth/ForgotForm.vue'
import ResetForm from '../components/auth/ResetForm.vue'

const authStore = useAuthStore()
const router = useRouter()

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
.login-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-main);
  transition: background-color 0.3s ease;
  position: relative;
  overflow-x: hidden;
}

.login-container {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  z-index: 10;
}

.login-card {
  background: var(--panel-bg);
  padding: 2.5rem;
  border-radius: 12px;
  border: 3px solid var(--stroke);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  width: 100%;
  max-width: 400px;
  color: var(--text-main);
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
}

.login-card h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: var(--primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.card-wide {
  max-width: 500px !important;
}

.background-effects {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

.star-fall {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.star {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  box-shadow:
    0 0 10px #fff,
    0 0 20px var(--primary),
    0 0 40px var(--primary);
  transform: rotate(45deg);
  animation: fall linear infinite;
}

.star::before {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: 150px;
  height: 2px;
  background: linear-gradient(
    to left,
    rgba(255, 255, 255, 1) 0%,
    var(--primary) 30%,
    transparent 100%
  );
}

.star:nth-child(1) {
  top: -20%;
  left: -20%;
  animation-duration: 3.5s;
  animation-delay: 0s;
}
.star:nth-child(2) {
  top: 10%;
  left: -10%;
  animation-duration: 2.8s;
  animation-delay: 1.2s;
}
.star:nth-child(3) {
  top: -10%;
  left: 30%;
  animation-duration: 2.2s;
  animation-delay: 0.5s;
}
.star:nth-child(4) {
  top: 30%;
  left: -30%;
  animation-duration: 3.2s;
  animation-delay: 1.8s;
}
.star:nth-child(5) {
  top: -5%;
  left: 50%;
  animation-duration: 4s;
  animation-delay: 0.8s;
}
.star:nth-child(6) {
  top: -30%;
  left: 10%;
  animation-duration: 4.5s;
  animation-delay: 2.5s;
}
.star:nth-child(7) {
  top: 20%;
  left: -20%;
  animation-duration: 2.9s;
  animation-delay: 1.5s;
}
.star:nth-child(8) {
  top: -15%;
  left: 70%;
  animation-duration: 2.4s;
  animation-delay: 0.3s;
}
.star:nth-child(9) {
  top: 40%;
  left: -40%;
  animation-duration: 3.8s;
  animation-delay: 2.2s;
}
.star:nth-child(10) {
  top: -10%;
  left: 15%;
  animation-duration: 3.3s;
  animation-delay: 1.1s;
}
.star:nth-child(11) {
  top: -25%;
  left: 40%;
  animation-duration: 2.6s;
  animation-delay: 0.7s;
}
.star:nth-child(12) {
  top: 5%;
  left: -5%;
  animation-duration: 4.2s;
  animation-delay: 2s;
}
.star:nth-child(13) {
  top: 50%;
  left: -50%;
  animation-duration: 3.1s;
  animation-delay: 1.4s;
}
.star:nth-child(14) {
  top: -20%;
  left: 80%;
  animation-duration: 2.7s;
  animation-delay: 2.1s;
}
.star:nth-child(15) {
  top: 15%;
  left: 25%;
  animation-duration: 3.9s;
  animation-delay: 0.4s;
}

@keyframes fall {
  0% {
    transform: translate3d(0, 0, 0) rotate(45deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  80% {
    opacity: 1;
  }
  100% {
    transform: translate3d(1800px, 1800px, 0) rotate(45deg);
    opacity: 0;
  }
}

.landing-footer {
  width: 100%;
  background: var(--panel-bg);
  backdrop-filter: blur(15px);
  border-top: 2px solid var(--stroke);
  box-shadow: 0 -5px 30px rgba(0, 0, 0, 0.3);
  padding: 30px 0;
  margin-top: auto;
  position: relative;
  z-index: 20;
}

.footer-magic-dust {
  position: absolute;
  top: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--primary), transparent);
  box-shadow: 0 0 15px var(--primary);
  opacity: 0.7;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.footer-text {
  color: var(--text-main);
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  opacity: 0.8;
}

.github-magic-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.3s ease;
  padding: 6px 12px;
  border-radius: 20px;
  opacity: 0.9;
}

.github-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
  transition: all 0.3s ease;
}

.github-magic-link:hover {
  color: var(--primary);
  text-shadow: 0 0 10px var(--primary);
  transform: translateY(-2px);
  opacity: 1;
}

.github-magic-link:hover .github-icon {
  filter: drop-shadow(0 0 8px var(--primary));
  transform: scale(1.1);
}

.footer-index {
  margin-top: 10px;
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 0.85rem;
}

.footer-index a {
  color: var(--text-main);
  opacity: 0.7;
  text-decoration: none;
  transition: all 0.3s ease;
}

.footer-index a:hover {
  color: var(--primary);
  opacity: 1;
  text-decoration: underline;
}

/* =========================================
   RESPONSIVIDAD
   ========================================= */
@media (max-width: 768px) {
  .login-container {
    padding: 15px;
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
    align-items: flex-start;
  }
  .login-card {
    padding: 1.5rem;
    border-radius: 8px;
    margin-top: 20px;
  }
  .login-card h2 {
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }
  .footer-text {
    font-size: 0.75rem;
    text-align: center;
  }
  .github-magic-link {
    font-size: 0.8rem;
  }
}
</style>
