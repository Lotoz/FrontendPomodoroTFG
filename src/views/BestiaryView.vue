<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'

const router = useRouter()
const entradas = ref([])
const filtroActual = ref('todos') // 'todos', 'hero', 'beast'
const cargando = ref(true)

// Índice para la paginación del libro
const indiceActual = ref(0)

// Propiedad computada para obtener el personaje que estamos viendo ahora mismo
const entradaActual = computed(() => entradas.value[indiceActual.value])

// Función para cargar los datos desde el backend
const cargarBestiario = async (bando = 'todos') => {
  cargando.value = true
  filtroActual.value = bando
  try {
    const url = bando === 'todos' ? '/bestiario' : `/bestiario/bando/${bando}`
    const res = await api.get(url)
    entradas.value = res.data
    indiceActual.value = 0
  } catch (error) {
    console.error('Error al leer los pergaminos:', error)
    if (error.response?.status === 401) router.push('/')
  } finally {
    cargando.value = false
  }
}

const paginaAnterior = () => {
  if (indiceActual.value > 0) {
    indiceActual.value--
  }
}

const paginaSiguiente = () => {
  if (indiceActual.value < entradas.value.length - 1) {
    indiceActual.value++
  }
}

onMounted(() => {
  cargarBestiario()
})
</script>

<template>
  <div class="page-shell">
    <div class="bestiary-container">
      <header class="header-top">
        <h1>
          <img src="/iconsApp/bestiario.png" alt="Bestiario" class="h1-icon" /> Gran Bestiario del
          Reino
        </h1>
        <button @click="router.push('/dashboard')" class="btn-back">Volver al Tablón</button>
      </header>

      <div class="filter-buttons">
        <button
          @click="cargarBestiario('todos')"
          :class="{ active: filtroActual === 'todos' }"
          class="btn-filter"
        >
          <img src="/iconsApp/scroll.png" alt="Registros" class="btn-icon" /> Todos los Registros
        </button>
        <button
          @click="cargarBestiario('hero')"
          :class="{ active: filtroActual === 'hero' }"
          class="btn-filter"
        >
          <img src="/iconsApp/iconoEquipo.png" alt="Héroes" class="btn-icon" /> Solo Héroes
        </button>
        <button
          @click="cargarBestiario('beast')"
          :class="{ active: filtroActual === 'beast' }"
          class="btn-filter"
        >
          <img src="/iconsApp/warning.png" alt="Bestias" class="btn-icon" /> Solo Bestias
        </button>
      </div>

      <div v-if="cargando" class="status-message">Desenrollando pergaminos...</div>

      <div v-else-if="entradas.length === 0" class="status-message">
        Aún no hay registros en esta sección de la biblioteca.
      </div>

      <div v-else class="book-wrapper">
        <div class="book-open">
          <div class="book-spine"></div>

          <transition name="page-turn" mode="out-in">
            <div class="book-pages-container" :key="entradaActual.id">
              <div class="book-page left-page">
                <div class="image-frame">
                  <img
                    v-if="entradaActual.photo"
                    :src="entradaActual.photo"
                    :alt="entradaActual.name"
                  />
                  <span class="emoji-placeholder">
                    <img
                      v-if="entradaActual.team === 'hero'"
                      src="/iconsApp/sword.png"
                      alt="Héroe"
                    />
                    <img v-else src="/iconsApp/beast.png" alt="Bestia" />
                  </span>
                </div>
                <div class="character-identity">
                  <h2>{{ entradaActual.name }}</h2>
                  <span :class="['badge', entradaActual.team]">
                    {{ entradaActual.team === 'hero' ? 'Bando: Héroe' : 'Bando: Bestia' }}
                  </span>
                </div>
              </div>

              <div class="book-page right-page">
                <div class="lore-content">
                  <p class="zone">
                    <img src="/iconsApp/star.png" alt="Zona" class="inline-icon" />
                    <strong>Hábitat / Zona:</strong> {{ entradaActual.zone }}
                  </p>
                  <div class="divider"></div>
                  <p class="description">{{ entradaActual.description }}</p>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div class="book-controls">
          <button @click="paginaAnterior" :disabled="indiceActual === 0" class="btn-page">
            Página Anterior
          </button>

          <span class="page-indicator">
            Página {{ indiceActual + 1 }} de {{ entradas.length }}
          </span>

          <button
            @click="paginaSiguiente"
            :disabled="indiceActual === entradas.length - 1"
            class="btn-page"
          >
            Siguiente Página
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-shell {
  background-color: var(--bg-main);
  min-height: 100vh;
  padding: 20px;
  font-family: sans-serif;
  transition: background-color 0.3s;
}

.bestiary-container {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 4px solid var(--stroke);
  padding-bottom: 15px;
}

.header-top h1 {
  color: var(--primary);
  font-size: 2.2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.h1-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
  flex-shrink: 0;
}
.btn-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  vertical-align: middle;
}
.inline-icon {
  width: 18px;
  height: 18px;
  object-fit: contain;
  vertical-align: middle;
}

.btn-back {
  background: var(--stroke);
  color: var(--text-main);
  border: 2px solid var(--panel-bg);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: var(--primary);
  color: var(--bg-main);
}

.filter-buttons {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.btn-filter {
  background: var(--panel-bg);
  color: var(--text-main);
  border: 2px solid var(--stroke);
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-filter:hover {
  border-color: var(--primary);
}
.btn-filter.active {
  background: var(--primary);
  color: var(--bg-main);
  border-color: var(--primary);
}

.status-message {
  text-align: center;
  padding: 50px;
  font-size: 1.5rem;
  color: var(--text-main);
  opacity: 0.7;
  background: var(--panel-bg);
  border: 2px dashed var(--stroke);
  border-radius: 12px;
}

/* =========================================
   DISEÑO DEL LIBRO ABIERTO
   ========================================= */
.book-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.book-open {
  background: var(--panel-bg);
  border: 4px solid var(--stroke);
  border-radius: 12px;
  position: relative;
  min-height: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.book-spine {
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--stroke);
  transform: translateX(-50%);
  z-index: 10;
  box-shadow:
    -2px 0 5px rgba(0, 0, 0, 0.1),
    2px 0 5px rgba(0, 0, 0, 0.1);
}

/* Contenedor de las dos páginas (para animarlo junto) */
.book-pages-container {
  display: flex;
  width: 100%;
  min-height: 100%;
}

.book-page {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  width: 50%;
}

/* --- Página Izquierda (Imagen) --- */
.left-page {
  align-items: center;
  justify-content: center;
}

.image-frame {
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1 / 1;
  border: 4px solid var(--stroke);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-main);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  box-shadow:
    inset 0 0 20px rgba(0, 0, 0, 0.05),
    4px 4px 0px var(--stroke);
  padding: 15px; /* Margen interno para que la imagen respire */
}

.image-frame img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* Cambio crucial: encaja la imagen sin cortarla */
  filter: drop-shadow(
    0px 8px 6px rgba(0, 0, 0, 0.2)
  ); /* Le da volumen al personaje si tiene fondo transparente */
  animation: floatCharacter 4s ease-in-out infinite; /* Animación de flote */
}

/* Animación de levitación */
@keyframes floatCharacter {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
  }
}

.emoji-placeholder {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  animation: floatCharacter 4s ease-in-out infinite;
}

.emoji-placeholder img {
  width: 80px;
  height: 80px;
  object-fit: contain;
}
.character-identity {
  text-align: center;
}
.character-identity h2 {
  font-size: 2rem;
  color: var(--text-main);
  margin: 0 0 15px 0;
  font-weight: 900;
}

/* --- Página Derecha (Texto) --- */
.right-page {
  justify-content: center;
}

.lore-content {
  background: var(--bg-main);
  padding: 30px;
  border: 2px solid var(--stroke);
  border-radius: 8px;
  height: 100%;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.zone {
  font-size: 1.2rem;
  color: var(--primary);
  margin-top: 0;
}
.divider {
  height: 2px;
  background: var(--stroke);
  margin: 20px 0;
  opacity: 0.5;
}
.description {
  font-size: 1.15rem;
  line-height: 1.8;
  color: var(--text-main);
  text-align: justify;
}

/* --- Badges --- */
.badge {
  padding: 6px 15px;
  border-radius: 20px;
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 2px;
  border: 2px solid var(--stroke);
}
.badge.hero {
  background: var(--primary);
  color: var(--bg-main);
}
.badge.beast {
  background: #ef4444;
  color: white;
}

/* --- Paginación --- */
.book-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--panel-bg);
  padding: 15px 30px;
  border: 3px solid var(--stroke);
  border-radius: 12px;
}

.btn-page {
  background: var(--primary);
  color: var(--bg-main);
  border: 2px solid var(--stroke);
  padding: 10px 20px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition:
    opacity 0.2s,
    transform 0.1s;
  font-size: 1.05rem;
}

.btn-page:hover:not(:disabled) {
  opacity: 0.8;
  transform: scale(1.02);
}
.btn-page:disabled {
  background: var(--stroke);
  color: var(--bg-main);
  cursor: not-allowed;
  opacity: 0.5;
}
.page-indicator {
  font-weight: bold;
  font-size: 1.1rem;
  color: var(--text-main);
}

/* =========================================
   ANIMACIONES VUE (TRANSITIONS)
   ========================================= */
.page-turn-enter-active,
.page-turn-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.page-turn-enter-from {
  opacity: 0;
  transform: translateX(15px); /* Entra deslizándose ligeramente desde la derecha */
}

.page-turn-leave-to {
  opacity: 0;
  transform: translateX(-15px); /* Sale deslizándose hacia la izquierda */
}

/* --- Responsividad --- */
@media (max-width: 900px) {
  .page-shell {
    padding: 15px;
  }

  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding-bottom: 12px;
  }

  .header-top h1 {
    font-size: 1.6rem;
  }

  .btn-back {
    width: 100%;
    text-align: center;
  }

  .filter-buttons {
    gap: 10px;
  }

  .btn-filter {
    font-size: 0.9rem;
    padding: 10px 16px;
  }
}

@media (max-width: 850px) {
  .book-pages-container {
    flex-direction: column;
  }

  .book-spine {
    width: 100%;
    height: 4px;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
  }

  .book-page {
    width: 100%;
    padding: 25px;
  }

  .left-page {
    border-bottom: 3px solid var(--stroke);
  }

  .image-frame {
    max-width: 250px;
    margin-bottom: 20px;
  }

  .character-identity h2 {
    font-size: 1.6rem;
  }

  .description {
    font-size: 1rem;
  }

  .book-controls {
    padding: 12px 20px;
  }

  .btn-page {
    font-size: 0.95rem;
    padding: 8px 16px;
  }

  .page-indicator {
    font-size: 1rem;
  }
}

@media (max-width: 600px) {
  .page-shell {
    padding: 10px;
  }

  .bestiary-container {
    gap: 12px;
  }

  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    padding-bottom: 10px;
  }

  .header-top h1 {
    font-size: 1.3rem;
  }

  .btn-back {
    width: 100%;
    padding: 8px 12px;
    font-size: 0.85rem;
  }

  .filter-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .btn-filter {
    width: 100%;
    font-size: 0.8rem;
    padding: 8px 12px;
  }

  .book-open {
    min-height: 400px;
    border: 2px solid var(--stroke);
    border-radius: 8px;
  }

  .book-page {
    padding: 15px;
  }

  .left-page {
    justify-content: flex-start;
  }

  .image-frame {
    max-width: 180px;
    border: 2px solid var(--stroke);
    margin-bottom: 15px;
  }

  .character-identity h2 {
    font-size: 1.3rem;
    margin-bottom: 10px;
  }

  .lore-content {
    padding: 15px;
  }

  .zone {
    font-size: 1rem;
    margin-top: 0;
    margin-bottom: 10px;
  }

  .divider {
    margin: 12px 0;
  }

  .description {
    font-size: 0.9rem;
    line-height: 1.6;
  }

  .badge {
    padding: 4px 10px;
    font-size: 0.8rem;
    letter-spacing: 1px;
  }

  .book-controls {
    flex-direction: column;
    gap: 10px;
    padding: 10px 15px;
    border-radius: 8px;
  }

  .btn-page {
    width: 100%;
    font-size: 0.85rem;
    padding: 8px 12px;
  }

  .page-indicator {
    font-size: 0.95rem;
  }

  .status-message {
    padding: 30px 15px;
    font-size: 1rem;
  }
}
</style>
