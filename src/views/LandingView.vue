<template>
  <div class="landing-shell" id="top">
    <audio ref="audioRef" loop>
      <source src="/music/initialMusic.mp3" type="audio/mpeg" />
    </audio>

    <button
      class="music-toggle-btn"
      @click="toggleMusic"
      :class="{ playing: isPlaying }"
      :title="isPlaying ? 'Silenciar música' : 'Reproducir música'"
    >
      <img v-if="isPlaying" src="/iconsApp/music.png" alt="Música On" />
      <img v-else src="/iconsApp/muted.png" alt="Música Off" />
    </button>

    <div class="background-effects">
      <div class="star-fall">
        <span class="star" v-for="n in 15" :key="`star-${n}`"></span>
      </div>

      <div class="magic-particles">
        <div class="particle" v-for="n in 20" :key="`particle-${n}`"></div>
      </div>

      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="orb orb-4"></div>

      <div class="magic-circle magic-circle-1"></div>
      <div class="magic-circle magic-circle-2"></div>
    </div>

    <div class="landing-container">
      <nav class="top-nav fade-in-down">
        <div class="logo" @mouseenter="logoHover = true" @mouseleave="logoHover = false">
          <div class="logo-glow" :class="{ active: logoHover }"></div>
          <img src="/tutorial/inicio.png" alt="Logo" class="logo-icon" />
          <span> The Adventure of the Pomodoro </span>
        </div>
        <button @click="irAlLogin" class="btn-outline">Iniciar Sesión</button>
      </nav>

      <main class="hero-section fade-in-up">
        <div class="hero-badge">
          <span class="badge-shine"></span>
          Estudio + RPG + Aventura
        </div>

        <div class="hero-content">
          <h1 class="hero-title">
            Forja tu productividad.<br />
            <span class="text-gold">Derrota a la procrastinación.</span>
          </h1>
          <p class="hero-subtitle">
            Convierte tus horas de trabajo en aventuras épicas. Completa tareas, recluta héroes
            legendarios, descubre bestias temibles y ¡domina tu tiempo mientras jugás!
          </p>

          <div class="hero-actions">
            <button @click="irAlLogin" class="btn-rpg-glow btn-primary">
              <span class="btn-shimmer"></span>
              <img src="/iconsApp/sword.png" alt="Espada" class="btn-icon" />
              <span>Comenzar Aventura</span>
            </button>
          </div>
        </div>
      </main>

      <section class="features-section fade-in-up delay-1">
        <div class="feature-card card-1">
          <div class="card-particle-container">
            <span class="card-particle" v-for="i in 5" :key="`cp1-${i}`"></span>
          </div>
          <div class="feature-icon-wrapper">
            <div class="icon-glow"></div>
            <img src="/iconsApp/scroll.png" alt="Tareas" class="feature-icon" />
          </div>
          <h3>Gestión de Misiones</h3>
          <p>Organiza tus tareas y domina la técnica Pomodoro con nuestro reloj especializado.</p>
          <div class="card-footer">
            <span class="feature-tag">Productividad</span>
          </div>
        </div>

        <div class="feature-card card-2">
          <div class="card-particle-container">
            <span class="card-particle" v-for="i in 5" :key="`cp2-${i}`"></span>
          </div>
          <div class="feature-icon-wrapper">
            <div class="icon-glow"></div>
            <img src="/iconsApp/beer.png" alt="Taberna" class="feature-icon" />
          </div>
          <h3>Recluta tu Ejército</h3>
          <p>
            Gana recompensas con tu esfuerzo real. Contrata caballeros, magos y elfos legendarios.
          </p>
          <div class="card-footer">
            <span class="feature-tag">RPG</span>
          </div>
        </div>

        <div class="feature-card card-3">
          <div class="card-particle-container">
            <span class="card-particle" v-for="i in 5" :key="`cp3-${i}`"></span>
          </div>
          <div class="feature-icon-wrapper">
            <div class="icon-glow"></div>
            <img src="/iconsApp/warning.png" alt="Bestias" class="feature-icon" />
          </div>
          <h3>Combates Épicos</h3>
          <p>Lucha en batallas por turnos animadas. Descubre el Bestiario y sube de nivel.</p>
          <div class="card-footer">
            <span class="feature-tag">Combate</span>
          </div>
        </div>
      </section>

      <section class="gallery-section fade-in-up delay-2">
        <h2 class="section-title">¡Un vistazo a la mazmorra!</h2>
        <div class="gallery-grid">
          <div class="gallery-card">
            <img src="/tutorial/misiones.png" alt="Misiones" class="gallery-img" />
            <div class="gallery-overlay">
              <img src="/iconsApp/star.png" alt="Icon" class="gallery-icon" />
              <h4>Misiones y Productividad</h4>
              <p>
                Anota tus tareas diarias. Completa objetivos en la vida real y táchalos para
                mantener el control de tu imperio.
              </p>
            </div>
          </div>

          <div class="gallery-card">
            <img src="/tutorial/pomodoro.png" alt="Pomodoro" class="gallery-img" />
            <div class="gallery-overlay">
              <img src="/iconsApp/troph.png" alt="Icon" class="gallery-icon" />
              <h4>Entrenamiento Pomodoro</h4>
              <p>
                Usa el temporizador en tus sesiones. Al completar ciclos, tus héroes subirán de
                nivel y recuperarán su estado.
              </p>
            </div>
          </div>

          <div class="gallery-card">
            <img src="/tutorial/camp.png" alt="Campamento" class="gallery-img" />
            <div class="gallery-overlay">
              <img src="/iconsApp/camp.png" alt="Icon" class="gallery-icon" />
              <h4>Gestiona tu Equipo</h4>
              <p>
                Elige sabiamente a tus héroes para la batalla. Cada uno tiene habilidades únicas.
                ¡Solo los mejores irán al frente!
              </p>
            </div>
          </div>

          <div class="gallery-card">
            <img src="/tutorial/zonaBatalla.png" alt="Batalla" class="gallery-img" />
            <div class="gallery-overlay">
              <img src="/iconsApp/sword.png" alt="Icon" class="gallery-icon" />
              <h4>La Zona de Batalla</h4>
              <p>
                Envía a tus héroes a luchar contra las fuerzas oscuras en un combate por turnos. ¡Si
                mueren, terminarán en el Cementerio!
              </p>
            </div>
          </div>

          <div class="gallery-card">
            <img src="/tutorial/jefeBattle.png" alt="Jefes" class="gallery-img" />
            <div class="gallery-overlay">
              <img src="/iconsApp/lose.png" alt="Icon" class="gallery-icon" />
              <h4>¡Peligro: Jefes Finales!</h4>
              <p>
                Cada zona consta de 10 fases. En la última te enfrentarás a un jefe poderoso.
                Tendrás que usar toda tu estrategia para vencerlo.
              </p>
            </div>
          </div>

          <div class="gallery-card">
            <img src="/tutorial/bestiario.png" alt="Bestiario" class="gallery-img" />
            <div class="gallery-overlay">
              <img src="/iconsApp/bestiario.png" alt="Icon" class="gallery-icon" />
              <h4>El Bestiario</h4>
              <p>
                El conocimiento es poder. Consulta información detallada de cada enemigo y descubre
                sus debilidades para futuras batallas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section class="gameplay-section fade-in-up delay-3">
        <h2 class="section-title">Cómo Funciona tu Aventura</h2>
        <div class="gameplay-grid">
          <div class="gameplay-step">
            <div class="step-number">1</div>
            <h4>Completa Pomodoros</h4>
            <p>Usa ciclos de 25 minutos de concentración para avanzar en tus misiones.</p>
          </div>
          <div class="gameplay-step">
            <div class="step-number">2</div>
            <h4>Obtén Monedas</h4>
            <p>Cada Pomodoro completado te da monedas para reclutar tropas.</p>
          </div>
          <div class="gameplay-step">
            <div class="step-number">3</div>
            <h4>Forma tu Ejército</h4>
            <p>Recluta héroes con diferentes habilidades y características únicas.</p>
          </div>
          <div class="gameplay-step">
            <div class="step-number">4</div>
            <h4>Lucha contra Bestias</h4>
            <p>Enfrenta enemigos automáticamente. Gana experiencia y descubre nuevos mundos.</p>
          </div>
        </div>
      </section>
    </div>

    <footer class="landing-footer fade-in-up delay-4">
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
          <a href="#" @click.prevent="irAlLogin">Iniciar Sesión</a>
          <span class="separator">|</span>
          <a href="#" @click.prevent="scrollToTop">Volver Arriba</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
const logoHover = ref(false)

// Lógica de música
const audioRef = ref(null)
const isPlaying = ref(false)

const toggleMusic = () => {
  if (audioRef.value) {
    if (isPlaying.value) {
      audioRef.value.pause()
    } else {
      audioRef.value.volume = 0.4
      audioRef.value.play()
    }
    isPlaying.value = !isPlaying.value
  }
}

// Navegación
const irAlLogin = () => {
  router.push('/login')
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<style scoped>
/* Fondo general más oscuro */
.landing-shell {
  min-height: 100vh;
  background: linear-gradient(135deg, #05020d 0%, #0a0418 50%, #110522 100%);
  color: #f0e6ff;
  font-family: sans-serif;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* =========================================
   CONTENEDOR DE EFECTOS (SOLUCIONA EL BUG DE SCROLL)
   ========================================= */
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

/* =========================================
   BOTÓN DE MÚSICA FLOTANTE
   ========================================= */
.music-toggle-btn {
  position: fixed;
  bottom: 40px;
  left: 40px;
  width: 85px;
  height: 85px;
  background: rgba(30, 18, 55, 0.85);
  backdrop-filter: blur(10px);
  border: 3px solid rgba(217, 159, 255, 0.4);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
}

.music-toggle-btn:hover {
  transform: scale(1.1);
  border-color: #ffd700;
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.5);
}

.music-toggle-btn.playing {
  border-color: #d99fff;
  box-shadow: 0 0 25px rgba(217, 159, 255, 0.6);
}

.music-toggle-btn img {
  width: 38px;
  height: 38px;
  object-fit: contain;
  filter: drop-shadow(0 0 5px rgba(255, 255, 255, 0.5));
}

@media (max-width: 768px) {
  .music-toggle-btn {
    bottom: 25px;
    left: 25px;
    width: 65px;
    height: 65px;
  }
  .music-toggle-btn img {
    width: 28px;
    height: 28px;
  }
}

/* =========================================
   LLUVIA DE ESTRELLAS HACIA LA DERECHA
   ========================================= */
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
    0 0 20px #d99fff,
    0 0 40px #d99fff;
  transform: rotate(-45deg);
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
  background: linear-gradient(to left, #fff 0%, #d99fff 40%, transparent 100%);
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
    transform: translate3d(0, 0, 0) rotate(-45deg);
    opacity: 1;
  }
  100% {
    transform: translate3d(1800px, 1800px, 0) rotate(-45deg);
    opacity: 0;
  }
}

/* Partículas */
.magic-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #d99fff, #7d33cc);
  border-radius: 50%;
  filter: blur(1px);
  opacity: 0.7;
  animation: float-particle 15s infinite ease-in-out;
}
.particle:nth-child(1) {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}
.particle:nth-child(2) {
  top: 30%;
  left: 20%;
  animation-delay: 1s;
}
.particle:nth-child(3) {
  top: 40%;
  left: 80%;
  animation-delay: 2s;
}
.particle:nth-child(4) {
  top: 50%;
  left: 30%;
  animation-delay: 3s;
}
.particle:nth-child(5) {
  top: 60%;
  left: 70%;
  animation-delay: 4s;
}
.particle:nth-child(6) {
  top: 70%;
  left: 15%;
  animation-delay: 5s;
}
.particle:nth-child(7) {
  top: 25%;
  left: 85%;
  animation-delay: 6s;
}
.particle:nth-child(8) {
  top: 55%;
  left: 50%;
  animation-delay: 7s;
}

@keyframes float-particle {
  0% {
    transform: translateY(0) translateX(0) scale(1);
    opacity: 0.3;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(-100px) translateX(50px) scale(0.5);
    opacity: 0.1;
  }
}

/* Orbes y Círculos Mágicos */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  animation: float 12s infinite ease-in-out alternate;
}
.orb-1 {
  width: 500px;
  height: 500px;
  background: rgba(179, 102, 255, 0.15);
  top: -150px;
  left: -150px;
  animation-delay: 0s;
}
.orb-2 {
  width: 400px;
  height: 400px;
  background: rgba(255, 215, 0, 0.1);
  bottom: -100px;
  right: -100px;
  animation-delay: -4s;
}
.orb-3 {
  width: 350px;
  height: 350px;
  background: rgba(255, 68, 102, 0.1);
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: -6s;
}
.orb-4 {
  width: 300px;
  height: 300px;
  background: rgba(100, 200, 255, 0.08);
  top: 30%;
  right: -50px;
  animation-delay: -2s;
}

@keyframes float {
  0% {
    transform: translateY(0px) scale(1);
  }
  100% {
    transform: translateY(-50px) scale(1.2);
  }
}

.magic-circle {
  position: absolute;
  border-radius: 50%;
}
.magic-circle-1 {
  width: 600px;
  height: 600px;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  border: 1px solid rgba(217, 159, 255, 0.1);
  animation: rotate 30s linear infinite;
  box-shadow: inset 0 0 50px rgba(217, 159, 255, 0.05);
}
.magic-circle-2 {
  width: 800px;
  height: 800px;
  bottom: -200px;
  right: -200px;
  border: 1px solid rgba(255, 215, 0, 0.05);
  animation: rotate-reverse 40s linear infinite;
  box-shadow: inset 0 0 80px rgba(255, 215, 0, 0.03);
}

@keyframes rotate {
  0% {
    transform: translateX(-50%) rotate(0deg);
  }
  100% {
    transform: translateX(-50%) rotate(360deg);
  }
}
@keyframes rotate-reverse {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(-360deg);
  }
}

/* =========================================
   CONTENEDOR PRINCIPAL
   ========================================= */
.landing-container {
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  flex-grow: 1; /* Esto empuja el footer hacia abajo */
}

/* Navegación */
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 0;
}
.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 900;
  color: #fff;
  letter-spacing: 1px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}
.logo:hover {
  text-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
}
.logo-glow {
  position: absolute;
  left: -20px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 215, 0, 0);
  transition: all 0.3s ease;
}
.logo-glow.active {
  background: rgba(255, 215, 0, 0.2);
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.4);
}
.logo-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
  transition: all 0.3s ease;
}
.logo:hover .logo-icon {
  filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
  transform: scale(1.1);
}
.btn-outline {
  background: transparent;
  border: 2px solid rgba(217, 159, 255, 0.5);
  color: #fff;
  padding: 10px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}
.btn-outline::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: rgba(217, 159, 255, 0.2);
  transition: left 0.3s ease;
  z-index: -1;
}
.btn-outline:hover::before {
  left: 0;
}
.btn-outline:hover {
  border-color: #d99fff;
  box-shadow: 0 0 20px rgba(179, 102, 255, 0.4);
  transform: translateY(-2px);
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 60px 0 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}
.hero-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.hero-badge {
  background: linear-gradient(
    90deg,
    rgba(179, 102, 255, 0.2) 0%,
    rgba(217, 159, 255, 0.3) 50%,
    rgba(179, 102, 255, 0.2) 100%
  );
  color: #d99fff;
  padding: 12px 24px;
  border-radius: 50px;
  border: 1px solid rgba(217, 159, 255, 0.5);
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  animation: badge-pulse 3s ease-in-out infinite;
}
.badge-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shine 3s infinite;
}
@keyframes badge-pulse {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(217, 159, 255, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(217, 159, 255, 0.6);
  }
}
@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
.hero-title {
  font-size: 4.8rem;
  font-weight: 900;
  line-height: 1.1;
  margin: 0 0 30px;
  color: #fff;
  text-shadow:
    0 4px 20px rgba(0, 0, 0, 0.6),
    0 0 40px rgba(179, 102, 255, 0.3);
  animation: title-glow 3s ease-in-out infinite;
}
@keyframes title-glow {
  0%,
  100% {
    text-shadow:
      0 4px 20px rgba(0, 0, 0, 0.6),
      0 0 40px rgba(179, 102, 255, 0.3);
  }
  50% {
    text-shadow:
      0 4px 20px rgba(0, 0, 0, 0.6),
      0 0 60px rgba(179, 102, 255, 0.6);
  }
}
.text-gold {
  background: linear-gradient(90deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  animation: gold-glow 2s ease-in-out infinite;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.4));
}
@keyframes gold-glow {
  0%,
  100% {
    filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8));
  }
}
.hero-subtitle {
  font-size: 1.3rem;
  color: #c9b8ff;
  max-width: 750px;
  line-height: 1.7;
  margin-bottom: 50px;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.hero-actions {
  display: flex;
  justify-content: center;
  animation: fadeInUp 0.8s ease-out 0.3s both;
  width: 100%;
}
.btn-rpg-glow {
  background: linear-gradient(135deg, #b366ff 0%, #7d33cc 100%);
  color: #fff;
  border: 2px solid #d99fff;
  padding: 18px 45px;
  font-size: 1.2rem;
  font-weight: bold;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  box-shadow:
    0 0 20px rgba(179, 102, 255, 0.5),
    0 8px 15px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}
.btn-rpg-glow::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition:
    width 0.6s,
    height 0.6s;
}
.btn-rpg-glow:active::before {
  width: 300px;
  height: 300px;
}
.btn-rpg-glow:hover {
  transform: translateY(-5px) scale(1.05);
  box-shadow:
    0 0 40px rgba(179, 102, 255, 0.8),
    0 15px 25px rgba(0, 0, 0, 0.4);
  border-color: #fff;
}
.btn-shimmer {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  animation: shimmer 2s infinite;
}
@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}
.btn-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

/* Features */
.features-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  padding: 40px 0 80px;
  flex-grow: 1;
}
.feature-card {
  background: rgba(30, 18, 55, 0.7);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(125, 51, 204, 0.4);
  padding: 35px;
  border-radius: 20px;
  text-align: center;
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: levitate 6s ease-in-out infinite;
  position: relative;
  overflow: hidden;
}
.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(217, 159, 255, 0.1) 0%,
    transparent 50%,
    rgba(125, 51, 204, 0.1) 100%
  );
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}
.feature-card:hover::before {
  opacity: 1;
}
.card-particle-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}
.card-particle {
  position: absolute;
  width: 3px;
  height: 3px;
  background: #d99fff;
  border-radius: 50%;
  opacity: 0;
  animation: particle-rise 2s ease-out forwards;
}
.card-particle:nth-child(1) {
  left: 20%;
  top: 50%;
  animation-delay: 0s;
}
.card-particle:nth-child(2) {
  left: 40%;
  top: 50%;
  animation-delay: 0.2s;
}
.card-particle:nth-child(3) {
  left: 60%;
  top: 50%;
  animation-delay: 0.4s;
}
.feature-card:nth-child(1) {
  animation-delay: 0s;
}
.feature-card:nth-child(2) {
  animation-delay: -2s;
}
.feature-card:nth-child(3) {
  animation-delay: -4s;
}
@keyframes particle-rise {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-60px) scale(0);
    opacity: 0;
  }
}
@keyframes levitate {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}
.feature-card:hover {
  animation-play-state: paused;
  transform: translateY(-30px) scale(1.05);
  border-color: #ffd700;
  box-shadow:
    0 20px 50px rgba(179, 102, 255, 0.4),
    inset 0 0 20px rgba(217, 159, 255, 0.1);
}
.feature-icon-wrapper {
  width: 80px;
  height: 80px;
  background: rgba(179, 102, 255, 0.15);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 25px;
  border: 2px solid rgba(217, 159, 255, 0.4);
  position: relative;
  transition: all 0.3s ease;
}
.icon-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(217, 159, 255, 0.3), transparent);
  transform: translate(-50%, -50%);
  animation: icon-pulse 2s ease-in-out infinite;
}
@keyframes icon-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.3);
    opacity: 0.2;
  }
}
.feature-card:hover .feature-icon-wrapper {
  background: rgba(217, 159, 255, 0.25);
  border-color: #ffd700;
  box-shadow: 0 0 25px rgba(255, 215, 0, 0.3);
  transform: scale(1.1);
}
.feature-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 0 5px rgba(217, 159, 255, 0.4));
  transition: all 0.3s ease;
}
.feature-card:hover .feature-icon {
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.6));
  transform: scale(1.2);
}
.feature-card h3 {
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 15px;
  margin-top: 0;
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;
}
.feature-card:hover h3 {
  color: #ffd700;
}
.feature-card p {
  color: #a894cc;
  line-height: 1.6;
  font-size: 0.95rem;
  margin-bottom: 15px;
  position: relative;
  z-index: 2;
  transition: color 0.3s ease;
}
.feature-card:hover p {
  color: #c9b8ff;
}
.card-footer {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
  position: relative;
  z-index: 2;
}
.feature-tag {
  background: rgba(217, 159, 255, 0.2);
  color: #d99fff;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  border: 1px solid rgba(217, 159, 255, 0.4);
  transition: all 0.3s ease;
}
.feature-card:hover .feature-tag {
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  border-color: rgba(255, 215, 0, 0.6);
}

/* =========================================
   NUEVA SECCIÓN: GALERÍA DE MAZMORRA
   ========================================= */
.gallery-section {
  padding: 40px 0 80px;
  text-align: center;
  z-index: 10;
  position: relative;
}
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
  margin-top: 20px;
}
.gallery-card {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 2px solid rgba(125, 51, 204, 0.4);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: #1a0d2e;
  height: 250px;
  cursor: crosshair;
}
.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition:
    transform 0.5s ease,
    filter 0.5s ease;
  filter: brightness(0.6);
}
.gallery-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgba(15, 7, 31, 0.95) 0%, rgba(30, 18, 55, 0.7) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 25px;
  text-align: center;
  transition: all 0.4s ease;
  opacity: 1;
}
.gallery-card:hover {
  transform: translateY(-10px) scale(1.02);
  border-color: #ffd700;
  box-shadow: 0 15px 35px rgba(255, 215, 0, 0.2);
}
.gallery-card:hover .gallery-img {
  transform: scale(1.1);
  filter: brightness(1);
}
.gallery-card:hover .gallery-overlay {
  background: linear-gradient(to top, rgba(15, 7, 31, 0.95) 0%, transparent 100%);
}
.gallery-icon {
  width: 35px;
  height: 35px;
  object-fit: contain;
  margin-bottom: 10px;
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.6));
  transition: transform 0.3s ease;
}
.gallery-card:hover .gallery-icon {
  transform: scale(1.2) translateY(-10px);
}
.gallery-overlay h4 {
  color: #fff;
  font-size: 1.2rem;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.8);
  transition: color 0.3s ease;
}
.gallery-card:hover .gallery-overlay h4 {
  color: #ffd700;
}
.gallery-overlay p {
  color: #c9b8ff;
  font-size: 0.85rem;
  line-height: 1.4;
  margin: 0;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
}
.gallery-card:hover .gallery-overlay p {
  opacity: 1;
  transform: translateY(0);
}

/* =========================================
   GAMEPLAY SECTION
   ========================================= */
.gameplay-section {
  padding: 60px 0 80px;
  text-align: center;
  z-index: 10;
  position: relative;
}
.section-title {
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 50px;
  color: #fff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  position: relative;
  display: inline-block;
  width: 100%;
}
.section-title::after {
  content: '';
  position: absolute;
  bottom: -15px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 3px;
  background: linear-gradient(90deg, transparent, #ffd700, transparent);
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
}
.gameplay-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 25px;
}
.gameplay-step {
  background: rgba(30, 18, 55, 0.8);
  backdrop-filter: blur(15px);
  border: 2px solid rgba(125, 51, 204, 0.5);
  padding: 30px;
  border-radius: 16px;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
}
.gameplay-step::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #d99fff, #ffd700);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s ease;
}
.gameplay-step:hover::before {
  transform: scaleX(1);
}
.step-number {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #b366ff, #7d33cc);
  border: 2px solid #d99fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: bold;
  color: #fff;
  margin: 0 auto 20px;
  box-shadow: 0 0 20px rgba(179, 102, 255, 0.4);
  transition: all 0.3s ease;
}
.gameplay-step:hover .step-number {
  transform: scale(1.2);
  box-shadow: 0 0 40px rgba(179, 102, 255, 0.8);
}
.gameplay-step h4 {
  font-size: 1.3rem;
  color: #fff;
  margin: 15px 0 10px;
}
.gameplay-step p {
  color: #a894cc;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}
.gameplay-step:hover {
  transform: translateY(-10px);
  border-color: #ffd700;
  box-shadow:
    0 15px 40px rgba(179, 102, 255, 0.3),
    inset 0 0 20px rgba(217, 159, 255, 0.1);
}

.landing-footer {
  width: 100%;
  background: rgba(13, 6, 31, 0.9);
  backdrop-filter: blur(15px);
  border-top: 2px solid rgba(217, 159, 255, 0.4);
  box-shadow: 0 -5px 30px rgba(179, 102, 255, 0.3);
  padding: 40px 0;
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
  background: linear-gradient(90deg, transparent, rgba(217, 159, 255, 0.8), transparent);
  box-shadow: 0 0 20px rgba(217, 159, 255, 1);
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
  z-index: 10;
}

.footer-text {
  color: #c9b8ff;
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

.github-magic-link {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #a894cc;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: bold;
  transition: all 0.3s ease;
  padding: 6px 12px;
  border-radius: 20px;
}

.github-icon {
  width: 18px;
  height: 18px;
  fill: currentColor;
  transition: all 0.3s ease;
}

.github-magic-link:hover {
  color: #ffd700;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
  background: rgba(255, 215, 0, 0.05);
  transform: translateY(-2px);
}

.github-magic-link:hover .github-icon {
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.8));
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
  color: #8c76b1;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-index a:hover {
  color: #d99fff;
  text-decoration: underline;
}

.separator {
  color: #5c4380;
  user-select: none;
}

.fade-in-down {
  animation: fadeInDown 0.8s ease-out forwards;
}
.fade-in-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}
.delay-1 {
  animation-delay: 0.2s;
}
.delay-2 {
  animation-delay: 0.4s;
}
.delay-3 {
  animation-delay: 0.6s;
}
.delay-4 {
  animation-delay: 0.8s;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* RESPONSIVIDAD */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 3.8rem;
  }
  .gameplay-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .magic-circle-1 {
    width: 400px;
  }
  .magic-circle-2 {
    width: 500px;
  }
}
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.8rem;
  }
  .hero-subtitle {
    font-size: 1.1rem;
  }
  .features-section {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .gameplay-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  .gallery-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  .hero-actions {
    width: 100%;
  }
  .btn-rpg-glow {
    width: 100%;
    justify-content: center;
  }
  .section-title {
    font-size: 2.2rem;
  }
  .logo span {
    display: none;
  }
}
@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem;
  }
  .hero-subtitle {
    font-size: 1rem;
  }
  .btn-rpg-glow {
    padding: 12px 20px;
    font-size: 0.95rem;
    gap: 8px;
  }
  .feature-card,
  .gameplay-step {
    padding: 20px;
  }
  .step-number {
    width: 40px;
    height: 40px;
    font-size: 1.4rem;
  }
  .section-title {
    font-size: 1.8rem;
  }
  .footer-text {
    font-size: 0.75rem;
    text-align: center;
  }
  .github-magic-link {
    font-size: 0.8rem;
  }
  .gallery-card {
    height: 200px;
  }
}
</style>
