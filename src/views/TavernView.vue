<template>
  <div class="page-shell">
    <div class="tavern-container">
      <header class="header-top">
        <div class="title-section">
          <h1>
            <img src="/iconsApp/beer.png" alt="Taberna" class="h1-icon" /> Taberna del Cuervo
            Sediento
          </h1>
          <p class="subtitle">Recluta mercenarios para tu causa o despide a los más débiles.</p>
        </div>
        <button @click="router.push('/dashboard')" class="btn-back">Volver a la Fortaleza</button>
      </header>

      <div v-if="cargando" class="status-message">Sirviendo jarras de hidromiel...</div>

      <div v-else class="tavern-grid">
        <section class="offers-section">
          <h2><img src="/iconsApp/scroll.png" alt="Ofertas" class="h2-icon" /> Ofertas del Día</h2>
          <p class="section-desc">Estos mercenarios cambiarán a medianoche. ¡Decídete rápido!</p>

          <div v-if="ofertas.length === 0" class="empty-state">
            Ya has reclutado a todos los héroes dispuestos a luchar hoy.
          </div>

          <div v-else class="cards-layout">
            <div v-for="oferta in ofertas" :key="oferta.name" class="hero-card offer-card">
              <div class="card-header">
                <img :src="obtenerIcono(oferta.heroClass)" alt="Icono Héroe" class="hero-icon" />
                <h3>{{ oferta.name }}</h3>
                <span class="class-badge">{{ traducirClase(oferta.heroClass) }}</span>
              </div>
              <div class="card-stats">
                <p>
                  <img src="/iconsApp/star.png" alt="Vida" class="stat-icon" /> Vida Base:
                  <strong>{{ oferta.life }}</strong>
                </p>
                <p>
                  <img src="/iconsApp/escudo.png" alt="Armadura" class="stat-icon" /> Armadura:
                  <strong>{{ oferta.armor }}</strong>
                </p>
              </div>
              <button @click="reclutarHeroe(oferta.name)" class="btn-recruit">
                <img src="/iconsApp/coin.png" alt="Reclutar" class="btn-icon" /> Reclutar
              </button>
            </div>
          </div>
        </section>

        <section class="camp-section">
          <div class="camp-header">
            <h2>
              <img src="/iconsApp/camp.png" alt="Campamento" class="h2-icon" /> Tu Campamento
              (Todos)
            </h2>
            <span class="badge-count">{{ equipo.length }} Héroes</span>
          </div>
          <p class="section-desc">
            Si alcanzas el límite de tu zona, deberás despedir a alguien para reclutar.
          </p>

          <div v-if="equipo.length === 0" class="empty-state">
            Tu campamento está vacío. Los ecos resuenan en las tiendas.
          </div>

          <div v-else class="camp-list">
            <div v-for="heroe in equipo" :key="heroe.id" class="hero-row">
              <div class="hero-info">
                <strong>{{ heroe.name }}</strong> (Nv. {{ heroe.level }})
                <span class="hero-life">
                  Vida: {{ heroe.lifeMax }} | Armadura: {{ heroe.armor }} |
                  {{ heroe.inActivateTeam ? 'Activo' : 'Descansando' }}
                </span>
              </div>
              <button @click="despedirHeroe(heroe.id, heroe.name)" class="btn-dismiss">
                Despedir
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'
import { useDialog } from '../composables/useDialog'

const router = useRouter()
const { showAlert, showConfirm } = useDialog()
const ofertas = ref([])
const equipo = ref([])
const cargando = ref(true)

const obtenerIcono = (clase) => {
  const rutas = {
    Warrior: '/iconsApp/warrior.png',
    Dwarf: '/iconsApp/dwarf.png',
    Elf: '/iconsApp/elf.png',
    Cleric: '/iconsApp/cleric.png',
    Wizard: '/iconsApp/wizard.png',
  }
  return rutas[clase] || '/iconsApp/iconoEquipo.png'
}

const traducirClase = (clase) => {
  const diccionario = {
    Warrior: 'Caballero',
    Dwarf: 'Enano',
    Elf: 'Elfo',
    Cleric: 'Clérigo',
    Wizard: 'Mago',
  }
  return diccionario[clase] || clase
}

const cargarDatosTaberna = async () => {
  cargando.value = true
  try {
    // Cargamos TODOS los héroes del usuario
    const resEquipo = await api.get('/heroes/todos')
    if (Array.isArray(resEquipo.data)) {
      equipo.value = resEquipo.data
    } else {
      equipo.value = []
    }

    // Cargamos las ofertas del día (ya filtradas por el backend)
    const resOffers = await api.get('/tavern/offers')
    ofertas.value = resOffers.data
  } catch (error) {
    console.error('Error al cargar la taberna:', error)
    if (error.response?.status === 401) router.push('/')
  } finally {
    cargando.value = false
  }
}

const reclutarHeroe = async (heroName) => {
  try {
    const res = await api.post(`/tavern/recruit?heroName=${encodeURIComponent(heroName)}`)
    showAlert(res.data, 'success', '¡Reclutado!')
    await cargarDatosTaberna()
  } catch (error) {
    const mensaje = error.response?.data || 'Error al reclutar héroe.'
    showAlert(mensaje, 'error', 'Error')
  }
}

const despedirHeroe = async (id, nombre) => {
  const resultado = await showConfirm(
    `¿Estás seguro de que quieres despedir a ${nombre}? Esta acción no se puede deshacer.`,
    'Confirmar Despido',
  )

  if (!resultado) return

  try {
    const res = await api.delete(`/tavern/dismiss/${id}`)
    showAlert(res.data, 'success', 'Héroe Despedido')
    await cargarDatosTaberna()
  } catch (error) {
    const mensaje = error.response?.data || 'Error al despedir héroe.'
    showAlert(mensaje, 'error', 'Error')
  }
}

onMounted(() => {
  cargarDatosTaberna()
})
</script>

<style scoped>
.page-shell {
  background-color: var(--bg-main);
  min-height: 100vh;
  padding: 20px;
  font-family: sans-serif;
}

.tavern-container {
  max-width: 1200px;
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

.title-section h1 {
  color: var(--primary);
  font-size: 2.2rem;
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.h1-icon,
.h2-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
  vertical-align: middle;
}
.stat-icon,
.btn-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  vertical-align: middle;
}

.subtitle {
  margin: 0;
  color: var(--text-main);
  opacity: 0.8;
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
  transition: all 0.2s;
}

.btn-back:hover {
  background: var(--primary);
  color: var(--bg-main);
}

.status-message {
  text-align: center;
  padding: 50px;
  font-size: 1.5rem;
  color: var(--text-main);
  opacity: 0.7;
}

.tavern-grid {
  display: grid;
  grid-template-columns: 3fr 2fr;
  gap: 30px;
}

section h2 {
  color: var(--text-main);
  margin-top: 0;
  margin-bottom: 5px;
  font-size: 1.8rem;
}
.section-desc {
  color: var(--text-main);
  opacity: 0.7;
  font-size: 0.95rem;
  margin-bottom: 20px;
}

.cards-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
}
.hero-icon {
  width: 50px;
  height: 50px;
  object-fit: contain;
  border-radius: 8px;
  background-color: var(--stroke);
}
.header-info h3 {
  margin: 0 0 5px 0;
  color: var(--text-main);
  font-size: 1.1rem;
}

.hero-card {
  background: var(--panel-bg);
  border: 3px solid var(--stroke);
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  transition:
    transform 0.2s,
    border-color 0.2s;
}

.hero-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary);
}

.card-header h3 {
  margin: 0 0 10px 0;
  color: var(--text-main);
  font-size: 1.1rem;
}
.class-badge {
  display: inline-block;
  background: var(--stroke);
  color: var(--text-main);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  margin-bottom: 15px;
}
.card-stats p {
  margin: 5px 0;
  color: var(--text-main);
  font-size: 0.95rem;
}

.btn-recruit {
  margin-top: auto;
  background: var(--primary);
  color: var(--bg-main);
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.btn-recruit:hover {
  opacity: 0.8;
}

.camp-section {
  background: var(--panel-bg);
  border: 3px solid var(--stroke);
  border-radius: 12px;
  padding: 20px;
}
.camp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.badge-count {
  background: var(--primary);
  color: var(--bg-main);
  padding: 5px 12px;
  border-radius: 20px;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: var(--text-main);
  opacity: 0.5;
  border: 2px dashed var(--stroke);
  border-radius: 8px;
}

.camp-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.hero-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--bg-main);
  padding: 12px 15px;
  border: 1px solid var(--stroke);
  border-radius: 8px;
}
.hero-info {
  display: flex;
  flex-direction: column;
  color: var(--text-main);
  font-size: 1rem;
}
.hero-life {
  font-size: 0.8rem;
  opacity: 0.7;
  margin-top: 4px;
}

.btn-dismiss {
  background: transparent;
  color: #ef4444;
  border: 2px solid #ef4444;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}
.btn-dismiss:hover {
  background: #ef4444;
  color: white;
}

@media (max-width: 900px) {
  .tavern-grid {
    grid-template-columns: 1fr;
  }

  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding-bottom: 12px;
  }

  .title-section h1 {
    font-size: 1.6rem;
  }

  .btn-back {
    width: 100%;
    text-align: center;
  }

  .cards-layout {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

@media (max-width: 768px) {
  .page-shell {
    padding: 15px;
  }

  .tavern-container {
    gap: 15px;
  }

  .title-section h1 {
    font-size: 1.3rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .cards-layout {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }

  .hero-card {
    padding: 12px;
  }

  .card-header {
    gap: 12px;
    margin-bottom: 12px;
  }

  .hero-icon {
    width: 40px;
    height: 40px;
  }

  .card-header h3 {
    font-size: 1rem;
  }

  .btn-recruit {
    padding: 8px;
    font-size: 0.9rem;
  }

  .camp-section {
    padding: 15px;
  }

  .hero-row {
    padding: 10px 12px;
  }

  .btn-dismiss {
    padding: 5px 10px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .page-shell {
    padding: 10px;
  }

  .tavern-container {
    gap: 10px;
  }

  .header-top {
    padding-bottom: 10px;
    border-bottom: 2px solid var(--stroke);
  }

  .title-section h1 {
    font-size: 1.1rem;
  }

  .subtitle {
    font-size: 0.8rem;
  }

  .btn-back {
    width: 100%;
    padding: 8px 12px;
    font-size: 0.85rem;
  }

  section h2 {
    font-size: 1.2rem;
  }

  .cards-layout {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .hero-card {
    padding: 10px;
  }

  .card-header {
    gap: 10px;
    margin-bottom: 10px;
  }

  .hero-icon {
    width: 35px;
    height: 35px;
  }

  .card-header h3 {
    font-size: 0.95rem;
  }

  .class-badge {
    font-size: 0.7rem;
    padding: 3px 8px;
  }

  .card-stats p {
    font-size: 0.85rem;
  }

  .btn-recruit {
    padding: 6px;
    font-size: 0.8rem;
  }

  .camp-section {
    padding: 12px;
    border-radius: 10px;
  }

  .camp-header {
    flex-wrap: wrap;
    gap: 10px;
  }

  .camp-header h2 {
    font-size: 1.1rem;
  }

  .camp-list {
    gap: 8px;
  }

  .hero-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 8px 10px;
  }

  .hero-info {
    width: 100%;
  }

  .btn-dismiss {
    width: 100%;
    text-align: center;
    padding: 6px;
    font-size: 0.8rem;
  }

  .empty-state {
    padding: 20px;
    font-size: 0.9rem;
  }

  .status-message {
    padding: 30px;
    font-size: 1rem;
  }
}
</style>
