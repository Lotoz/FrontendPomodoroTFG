<template>
  <div class="page-shell">
    <div class="camp-container">
      <header class="header-top">
        <div class="title-section">
          <h1><img src="/iconsApp/camp.png" alt="Campamento" class="h1-icon" /> Campamento de Héroes</h1>
          <p class="subtitle">
            Gestiona a tus mercenarios. Solo los que estén en el "Equipo Activo" lucharán en la Zona
            de Batalla.
          </p>
        </div>
        <button @click="router.push('/dashboard')" class="btn-back">Volver a la Fortaleza</button>
      </header>

      <div v-if="cargando" class="status-message">Reuniendo a las tropas...</div>

      <div v-else class="roster-grid">
        <section class="team-section active-team">
          <div class="section-header">
            <h2><img src="/iconsApp/sword.png" alt="Batalla" /> Equipo Activo</h2>
            <span class="badge">{{ activos.length }} en formación</span>
          </div>

          <div v-if="activos.length === 0" class="empty-state">
            Nadie defenderá la vanguardia. ¡Activa a algún héroe!
          </div>

          <div class="cards-layout">
            <div v-for="heroe in activos" :key="heroe.id" class="hero-card active-card">
              <div class="hero-image-container">
                <img
                  :src="obtenerCuerpoCompleto(heroe.heroClass)"
                  alt="Héroe"
                  class="hero-fullbody"
                />
              </div>

              <div class="card-header">
                <h3>{{ heroe.name }} (Nv. {{ heroe.level }})</h3>
                <span class="class-badge">{{ heroe.heroClass }}</span>
              </div>
              <div class="card-stats">
                <p>
                  <img src="/iconsApp/star.png" alt="Vida" /> Vida: {{ heroe.life }} /
                  {{ heroe.lifeMax }}
                </p>
                <p><img src="/iconsApp/iconoEquipo.png" alt="Armadura" /> Armadura: {{ heroe.armor }}</p>
              </div>
              <button @click="toggleStatus(heroe.id)" class="btn-action remove">
                Mandar al Banquillo
              </button>
            </div>
          </div>
        </section>

        <section class="team-section benched-team">
          <div class="section-header">
            <h2><img src="/iconsApp/rest.png" alt="Banquillo" class="h2-icon" /> Banquillo (Descansando)</h2>
            <span class="badge">{{ inactivos.length }} descansando</span>
          </div>

          <div v-if="inactivos.length === 0" class="empty-state">
            No tienes a nadie en la reserva.
          </div>

          <div class="cards-layout">
            <div v-for="heroe in inactivos" :key="heroe.id" class="hero-card benched-card">
              <div class="hero-image-container">
                <img
                  :src="obtenerCuerpoCompleto(heroe.heroClass)"
                  alt="Héroe"
                  class="hero-fullbody"
                />
              </div>

              <div class="card-header">
                <h3>{{ heroe.name }} (Nv. {{ heroe.level }})</h3>
                <span class="class-badge">{{ heroe.heroClass }}</span>
              </div>
              <div class="card-stats">
                <p>
                  <img src="/iconsApp/star.png" alt="Vida" /> Vida: {{ heroe.life }} /
                  {{ heroe.lifeMax }}
                </p>
                <p><img src="/iconsApp/iconoEquipo.png" alt="Armadura" /> Armadura: {{ heroe.armor }}</p>
              </div>
              <button @click="toggleStatus(heroe.id)" class="btn-action add">
                Añadir al Equipo
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'
import { useDialog } from '../composables/useDialog'

const router = useRouter()
const { showAlert } = useDialog()
const todosLosHeroes = ref([])
const cargando = ref(true)

// Computamos las dos listas basándonos en la variable inActivateTeam
const activos = computed(() => todosLosHeroes.value.filter((h) => h.inActivateTeam))
const inactivos = computed(() => todosLosHeroes.value.filter((h) => !h.inActivateTeam))

// Función para obtener la ruta de la imagen según la clase del héroe
const obtenerCuerpoCompleto = (clase) => {
  const rutas = {
    Warrior: '/bestiario/caballero.png',
    Dwarf: '/bestiario/enano.png',
    Elf: '/bestiario/elfo.png',
    Cleric: '/bestiario/clerigo.png',
    Wizard: '/bestiario/mago.png',
  }
  return rutas[clase] || '/images/bodyDefault.png'
}

const cargarCampamento = async () => {
  cargando.value = true
  try {
    const res = await api.get('/heroes/todos')
    if (Array.isArray(res.data)) {
      todosLosHeroes.value = res.data
    }
  } catch (error) {
    console.error('Error cargando campamento:', error)
    if (error.response?.status === 401) router.push('/')
  } finally {
    cargando.value = false
  }
}

const toggleStatus = async (id) => {
  try {
    const res = await api.post(`/heroes/toggle-active/${id}`)
    // Refrescamos la lista para mover la carta visualmente
    await cargarCampamento()
  } catch (error) {
    const mensaje = error.response?.data || error.message
    showAlert(mensaje, 'error', 'Error al cambiar estado')
  }
}

onMounted(() => {
  cargarCampamento()
})
</script>

<style scoped>
.page-shell {
  background-color: var(--bg-main);
  min-height: 100vh;
  padding: 20px;
  font-family: sans-serif;
}

.camp-container {
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
.h1-icon, .h2-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
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
}
.btn-back:hover {
  background: var(--primary);
  color: var(--bg-main);
}

.roster-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.team-section {
  background: var(--panel-bg);
  border: 3px solid var(--stroke);
  border-radius: 12px;
  padding: 20px;
}
.active-team {
  border-color: #3b82f6;
}
.benched-team {
  border-color: #64748b;
  opacity: 0.9;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  border-bottom: 1px solid var(--stroke);
  padding-bottom: 10px;
}
.section-header h2 {
  margin: 0;
  color: var(--text-main);
}
.badge {
  background: var(--primary);
  color: var(--bg-main);
  padding: 4px 12px;
  border-radius: 20px;
  font-weight: bold;
}

.empty-state {
  text-align: center;
  padding: 20px;
  color: var(--text-main);
  opacity: 0.6;
  font-style: italic;
}

.cards-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 15px;
}

.hero-card {
  background: var(--bg-main);
  border: 2px solid var(--stroke);
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}
.active-card {
  border-color: #3b82f6;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.2);
}
.benched-card {
  border-style: dashed;
  filter: grayscale(40%);
}

/* ESTILOS NUEVOS PARA LA IMAGEN DEL HÉROE */
.hero-image-container {
  width: 100%;
  height: 150px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
  align-items: flex-end; /* Para que la imagen quede pegada abajo */
  overflow: hidden;
}

.hero-fullbody {
  height: 90%;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.hero-card:hover .hero-fullbody {
  transform: scale(1.05);
}
/* FIN ESTILOS NUEVOS */

.card-header h3 {
  margin: 0 0 5px 0;
  color: var(--text-main);
  font-size: 1.1rem;
}
.class-badge {
  font-size: 0.8rem;
  background: var(--stroke);
  padding: 2px 8px;
  border-radius: 10px;
  color: var(--text-main);
}
.card-stats p {
  margin: 5px 0;
  color: var(--text-main);
  font-size: 0.9rem;
}

.btn-action {
  margin-top: 15px;
  padding: 8px;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
.btn-action.add {
  background: #22c55e;
  color: white;
}
.btn-action.remove {
  background: #ef4444;
  color: white;
}

/* RESPONSIVIDAD */
@media (max-width: 900px) {
  .page-shell {
    padding: 15px;
  }

  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding-bottom: 12px;
    border-bottom: 2px solid var(--stroke);
  }

  .title-section h1 {
    font-size: 1.6rem;
  }

  .btn-back {
    width: 100%;
    text-align: center;
  }

  .cards-layout {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .page-shell {
    padding: 10px;
  }

  .header-top {
    padding-bottom: 10px;
  }

  .title-section h1 {
    font-size: 1.3rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .btn-back {
    width: 100%;
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .roster-grid {
    gap: 15px;
  }

  .team-section {
    padding: 15px;
  }

  .section-header h2 {
    font-size: 1.2rem;
  }

  .cards-layout {
    grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
    gap: 10px;
  }

  .hero-card {
    padding: 12px;
  }

  .hero-image-container {
    height: 120px;
    margin-bottom: 12px;
  }

  .card-header h3 {
    font-size: 1rem;
  }

  .btn-action {
    padding: 6px;
    margin-top: 10px;
  }
}

@media (max-width: 480px) {
  .page-shell {
    padding: 8px;
  }

  .camp-container {
    gap: 10px;
  }

  .header-top {
    flex-direction: column;
    gap: 10px;
    padding-bottom: 8px;
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
    padding: 6px 10px;
    font-size: 0.8rem;
  }

  .roster-grid {
    gap: 10px;
  }

  .team-section {
    padding: 12px;
    border-radius: 8px;
  }

  .section-header {
    margin-bottom: 12px;
    padding-bottom: 8px;
  }

  .section-header h2 {
    font-size: 1rem;
  }

  .badge {
    padding: 3px 8px;
    font-size: 0.75rem;
  }

  .cards-layout {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .hero-card {
    padding: 10px;
  }

  .hero-image-container {
    height: 100px;
    margin-bottom: 10px;
  }

  .card-header h3 {
    font-size: 0.95rem;
  }

  .class-badge {
    font-size: 0.7rem;
  }

  .card-stats p {
    font-size: 0.8rem;
  }

  .btn-action {
    padding: 6px;
    font-size: 0.85rem;
  }

  .empty-state {
    padding: 20px;
    font-size: 0.95rem;
  }
}
</style>
