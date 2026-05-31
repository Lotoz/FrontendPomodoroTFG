<template>
  <div class="graveyard-shell">
    <div class="graveyard-container">
      <header class="header-top">
        <div class="title-section">
          <h1><img src="/iconsApp/lose.png" alt="Cementerio" /> Cementerio de los Caídos</h1>
          <p class="subtitle">
            Descansan en paz aquellos que dieron su vida contra la procrastinación.
          </p>
        </div>
        <button @click="router.push('/dashboard')" class="btn-back">⬅ Volver a la Fortaleza</button>
      </header>

      <div v-if="cargando" class="status-message">Avanzando entre la niebla...</div>

      <div v-else-if="caidos.length === 0" class="empty-state">
        Las tierras del cementerio están vacías. Tus héroes han sobrevivido... por ahora.
      </div>

      <div v-else class="graveyard-grid">
        <div v-for="heroe in caidos" :key="heroe.id" class="tombstone" @click="abrirModal(heroe)">
          <div class="tomb-cross"><img src="/iconsApp/lose.png" alt="Tumba" /></div>
          <h3 class="tomb-name">{{ heroe.name }}</h3>
          <span class="tomb-date">{{ heroe.fallenDate.split(' ')[0] }}</span>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="heroeSeleccionado" class="modal-overlay" @click.self="cerrarModal">
        <div class="modal-content">
          <button class="btn-close" @click="cerrarModal">
            <img src="/iconsApp/bad.png" alt="Cerrar" />
          </button>

          <div class="modal-header">
            <span class="emoji-class"><img :src="obtenerIconoClase(heroeSeleccionado.heroClass)" alt="Clase" class="modal-class-icon" /></span>
            <h2>{{ heroeSeleccionado.name }}</h2>
            <span class="level-badge">Nivel {{ heroeSeleccionado.level }}</span>
          </div>

          <div class="modal-body">
            <h4 class="epitaph-title">Causa de la muerte:</h4>
            <p class="epitaph-text">"{{ heroeSeleccionado.deathReason }}"</p>

            <div class="divider"></div>

            <p class="death-date">
              <strong>Fecha del deceso:</strong> {{ heroeSeleccionado.fallenDate }}
            </p>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const caidos = ref([])
const cargando = ref(true)

// Estado del Modal
const heroeSeleccionado = ref(null)

const cargarCementerio = async () => {
  cargando.value = true
  try {
    const res = await api.get('/combat/cementerio')
    caidos.value = res.data
  } catch (error) {
    console.error('Error al visitar el cementerio:', error)
    if (error.response?.status === 401) router.push('/')
  } finally {
    cargando.value = false
  }
}

const abrirModal = (heroe) => {
  heroeSeleccionado.value = heroe
  // Bloquear el scroll de la página de fondo
  document.body.style.overflow = 'hidden'
}

const cerrarModal = () => {
  heroeSeleccionado.value = null
  document.body.style.overflow = 'auto'
}

const obtenerIconoClase = (clase) => {
  const iconos = {
    Warrior: '/iconsApp/iconoEquipo.png',
    Dwarf: '/iconsApp/iconoEquipo.png',
    Elf: '/iconsApp/iconoEquipo.png',
    Cleric: '/iconsApp/iconoEquipo.png',
    Wizard: '/iconsApp/iconoEquipo.png',
  }
  return iconos[clase] || '/iconsApp/iconoEquipo.png'
}

onMounted(() => {
  cargarCementerio()
})
</script>

<style scoped>
/* Tema oscuro específico para el cementerio */
.graveyard-shell {
  background-color: #1a1c23; /* Un tono más oscuro y azulado */
  min-height: 100vh;
  padding: 20px;
  font-family: serif; /* Fuente con serifas para darle un toque más antiguo */
}

.graveyard-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Cabecera */
.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #3f4451;
  padding-bottom: 15px;
}

.title-section h1 {
  color: #94a3b8; /* Gris azulado */
  font-size: 2.5rem;
  margin: 0 0 5px 0;
}

.subtitle {
  margin: 0;
  color: #64748b;
  font-style: italic;
}

.btn-back {
  background: #334155;
  color: #cbd5e1;
  border: 1px solid #475569;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-family: sans-serif;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #475569;
  color: white;
}

.status-message,
.empty-state {
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #64748b;
}

/* =========================================
   DISEÑO DE LAS LÁPIDAS (CSS Art)
   ========================================= */
.graveyard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 30px;
  padding: 40px 0;
}

.tombstone {
  background: linear-gradient(180deg, #64748b 0%, #475569 100%);
  border: 3px solid #334155;
  /* El truco del border-radius: Redondeado por arriba, plano por abajo */
  border-radius: 90px 90px 10px 10px;
  padding: 30px 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  box-shadow:
    inset -3px -3px 10px rgba(0, 0, 0, 0.3),
    0 10px 15px rgba(0, 0, 0, 0.5);
  transition:
    transform 0.3s,
    filter 0.3s;
  position: relative;
}

/* Base de tierra bajo la lápida */
.tombstone::after {
  content: '';
  position: absolute;
  bottom: -10px;
  width: 110%;
  height: 20px;
  background: #27272a;
  border-radius: 50%;
  z-index: -1;
}

.tombstone:hover {
  transform: translateY(-5px) scale(1.02);
  filter: brightness(1.2);
}

.tomb-cross {
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 15px;
  text-shadow: 1px 1px 0px rgba(255, 255, 255, 0.2);
}

.tomb-name {
  margin: 0;
  color: #0f172a;
  font-size: 1.2rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tomb-date {
  margin-top: 15px;
  font-size: 0.85rem;
  color: #1e293b;
  font-weight: bold;
}

/* =========================================
   MODAL DE EPITAFIO
   ========================================= */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--panel-bg, #2c2f33);
  border: 4px solid #475569;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  padding: 30px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  font-family: sans-serif;
}

.btn-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #ef4444;
}

.modal-header {
  text-align: center;
  margin-bottom: 20px;
}

.emoji-class {
  font-size: 3rem;
  display: block;
  margin-bottom: 10px;
}
.modal-class-icon {
  width: 64px;
  height: 64px;
  object-fit: contain;
}

.modal-header h2 {
  margin: 0 0 10px 0;
  color: #f8fafc;
  font-size: 2rem;
}

.level-badge {
  background: #475569;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
}

.modal-body {
  background: rgba(0, 0, 0, 0.2);
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #3f4451;
}

.epitaph-title {
  margin: 0 0 10px 0;
  color: #94a3b8;
  font-size: 1rem;
  text-transform: uppercase;
}

.epitaph-text {
  margin: 0;
  color: #cbd5e1;
  font-size: 1.1rem;
  line-height: 1.6;
  font-style: italic;
}

.divider {
  height: 1px;
  background: #475569;
  margin: 20px 0;
}

.death-date {
  margin: 0;
  color: #94a3b8;
  font-size: 0.9rem;
  text-align: right;
}

/* Transición del Modal */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* RESPONSIVIDAD */
@media (max-width: 900px) {
  .graveyard-shell {
    padding: 15px;
  }

  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 2px solid #3f4451;
  }

  .title-section h1 {
    font-size: 1.8rem;
  }

  .btn-back {
    width: 100%;
    text-align: center;
  }

  .graveyard-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 20px;
    padding: 30px 0;
  }
}

@media (max-width: 768px) {
  .graveyard-shell {
    padding: 10px;
  }

  .header-top {
    padding-bottom: 10px;
  }

  .title-section h1 {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .btn-back {
    width: 100%;
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .graveyard-grid {
    grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
    gap: 15px;
    padding: 20px 0;
  }

  .tombstone {
    padding: 20px 10px;
  }

  .tomb-cross {
    font-size: 2rem;
    margin-bottom: 10px;
  }

  .tomb-name {
    font-size: 1rem;
  }

  .tomb-date {
    margin-top: 10px;
    font-size: 0.8rem;
  }

  .modal-content {
    width: 90%;
    max-width: 450px;
    padding: 20px;
  }

  .modal-header h2 {
    font-size: 1.6rem;
  }

  .emoji-class {
    font-size: 2.5rem;
  }

  .level-badge {
    font-size: 0.85rem;
  }

  .modal-body {
    padding: 15px;
  }

  .epitaph-title {
    font-size: 0.9rem;
  }

  .epitaph-text {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .graveyard-shell {
    padding: 8px;
  }

  .graveyard-container {
    gap: 10px;
  }

  .header-top {
    flex-direction: column;
    gap: 10px;
    padding-bottom: 8px;
    border-bottom: 1px solid #3f4451;
  }

  .title-section h1 {
    font-size: 1.2rem;
  }

  .subtitle {
    font-size: 0.75rem;
  }

  .btn-back {
    width: 100%;
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .status-message,
  .empty-state {
    padding: 30px 15px;
    font-size: 1rem;
  }

  .graveyard-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    padding: 15px 0;
  }

  .tombstone {
    padding: 15px 8px;
    border-radius: 80px 80px 8px 8px;
    border: 2px solid #334155;
  }

  .tomb-cross {
    font-size: 1.8rem;
    margin-bottom: 8px;
  }

  .tomb-name {
    font-size: 0.85rem;
    letter-spacing: 0.5px;
  }

  .tomb-date {
    margin-top: 8px;
    font-size: 0.7rem;
  }

  .modal-overlay {
    padding: 10px;
  }

  .modal-content {
    width: 95%;
    max-width: 100%;
    padding: 15px;
    border-radius: 8px;
  }

  .btn-close {
    font-size: 1.3rem;
    top: 10px;
    right: 10px;
  }

  .modal-header h2 {
    font-size: 1.3rem;
    margin-bottom: 8px;
  }

  .emoji-class {
    font-size: 2rem;
    margin-bottom: 8px;
  }

  .level-badge {
    font-size: 0.8rem;
    padding: 3px 10px;
  }

  .modal-body {
    padding: 12px;
    border-radius: 6px;
  }

  .epitaph-title {
    font-size: 0.8rem;
    margin-bottom: 8px;
  }

  .epitaph-text {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .divider {
    margin: 12px 0;
  }

  .death-date {
    font-size: 0.8rem;
  }
}
</style>
