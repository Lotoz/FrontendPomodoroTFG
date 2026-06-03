<template>
  <div class="battle-shell">
    <div
      class="battle-container"
      :style="{ backgroundImage: `url(${obtenerFondoMundo(zonaActual)})` }"
    >
      <div v-if="estadoCombate !== 'ONGOING' || modoCinematica" class="battle-overlay"></div>

      <div
        v-if="estadoCombate === 'VICTORY' || estadoCombate === 'ZONE_CLEARED'"
        class="end-screen victory"
      >
        <h1><img src="/iconsApp/troph.png" alt="Victoria" class="end-icon" /> ¡Victoria!</h1>
        <p>Los enemigos han sido reducidos a polvo.</p>
        <div class="overlay-buttons">
          <button v-if="estadoCombate === 'VICTORY'" @click="cargarEstado" class="btn-rpg primary">
            Siguiente Etapa
          </button>
          <button
            v-if="estadoCombate === 'ZONE_CLEARED'"
            @click="viajarNuevaZona"
            class="btn-rpg primary"
          >
            Viajar a Nueva Zona
          </button>
          <button @click="cerrarVentana" class="btn-rpg secondary">Volver a la Base</button>
        </div>
      </div>

      <div v-else-if="estadoCombate === 'DEFEAT'" class="end-screen defeat">
        <h1><img src="/iconsApp/lose.png" alt="Derrota" class="end-icon" /> Aniquilación...</h1>
        <p>Tus héroes han caído. La oscuridad avanza.</p>
        <button @click="cerrarVentana" class="btn-rpg primary">Huir a la Fortaleza</button>
      </div>

      <div v-else class="combat-ui">
        <header class="top-hud">
          <div class="world-info">
            <h2>
              <img src="/iconsApp/world.png" alt="Zona" class="hud-icon" /> Zona: {{ zonaActual }} |
              Etapa {{ etapaActual }}
            </h2>
          </div>

          <div v-if="heroeActivo && !modoCinematica" class="active-hero-hud">
            <div class="active-hero-details">
              <img
                :src="obtenerSprite(heroeActivo.fighterClass)"
                class="hud-portrait"
                alt="Hero Portrait"
              />
              <div class="hud-stats">
                <h3>
                  Turno de: <span class="hero-name">{{ heroeActivo.name }}</span>
                </h3>
                <div class="hud-health-bar">
                  <div
                    class="hud-health-fill"
                    :style="{
                      width: porcentaje(heroeActivo.currentLife, heroeActivo.maxLife) + '%',
                    }"
                  ></div>
                  <span class="hud-health-text"
                    >{{ heroeActivo.currentLife }} / {{ heroeActivo.maxLife }} HP</span
                  >
                </div>
                <div class="hud-badges">
                  <span class="badge armor"
                    ><img src="/iconsApp/iconoEquipo.png" alt="Armadura" /> ARM:
                    {{ heroeActivo.armor || 0 }}</span
                  >
                  <span v-if="heroeActivo.isStunned" class="badge stun"
                    ><img src="/iconsApp/stun.png" alt="Aturdido" /> Aturdido</span
                  >
                  <span v-if="heroeActivo.isPoisoned" class="badge poison"
                    ><img src="/iconsApp/lose.png" alt="Envenenado" /> Envenenado</span
                  >
                </div>
              </div>
            </div>
          </div>
        </header>

        <div class="battlefield">
          <div class="team-side heroes-side">
            <div
              v-for="(heroe, index) in heroes"
              :key="heroe.id"
              class="sprite-container"
              :class="{
                'is-active': index === indiceHeroeActual && !modoCinematica,
                'has-acted': index < indiceHeroeActual && !modoCinematica,
                'selectable target-hero': accionSeleccionada === 'HEAL' && heroe.currentLife > 0,
              }"
              @click="seleccionarObjetivo(heroe.id, 'hero')"
            >
              <div class="floating-hud">
                <span class="sprite-name">{{ heroe.name }}</span>
                <span class="mini-armor"
                  ><img src="/iconsApp/iconoEquipo.png" alt="ARM" class="mini-icon" />
                  {{ heroe.armor || 0 }}</span
                >
                <div class="hp-bar-mini">
                  <div
                    class="hp-fill"
                    :style="{ width: porcentaje(heroe.currentLife, heroe.maxLife) + '%' }"
                  ></div>
                </div>
              </div>
              <div class="sprite-wrapper">
                <img
                  :src="obtenerSprite(heroe.fighterClass)"
                  class="battle-sprite"
                  alt="Heroe"
                  :class="{
                    'anim-attack': atacanteActivo === heroe.id,
                    'anim-heal': defensorActivo === heroe.id && textoCinematica.includes('cur'),
                    'anim-hit':
                      defensorActivo === heroe.id &&
                      !textoCinematica.includes('cur') &&
                      !textoCinematica.includes('CRÍTICO'),
                    'anim-crit': defensorActivo === heroe.id && textoCinematica.includes('CRÍTICO'),
                    'anim-exhausted':
                      textoCinematica.includes('exhausto') && textoCinematica.includes(heroe.name),
                    'anim-death':
                      muertosRecientes.includes(heroe.id) ||
                      (!modoCinematica && heroe.currentLife <= 0),
                  }"
                />
              </div>
            </div>
          </div>

          <div class="team-side beasts-side">
            <div
              v-for="bestia in bestias"
              :key="bestia.id"
              class="sprite-container"
              :class="{
                'selectable target-beast':
                  (accionSeleccionada === 'ATTACK' || accionSeleccionada === 'STUN') &&
                  bestia.currentLife > 0,
              }"
              @click="seleccionarObjetivo(bestia.id, 'beast')"
            >
              <div class="floating-hud">
                <span class="sprite-name">{{ bestia.name }}</span>
                <span class="mini-armor"
                  ><img src="/iconsApp/iconoEquipo.png" alt="ARM" class="mini-icon" />
                  {{ bestia.armor || 0 }}</span
                >
                <div class="hp-bar-mini">
                  <div
                    class="hp-fill enemy-hp"
                    :style="{ width: porcentaje(bestia.currentLife, bestia.maxLife) + '%' }"
                  ></div>
                </div>
              </div>
              <div class="sprite-wrapper">
                <img
                  :src="obtenerSprite(bestia.fighterClass)"
                  class="battle-sprite enemy-sprite"
                  alt="Bestia"
                  :class="{
                    'anim-attack': atacanteActivo === bestia.id,
                    'anim-heal': defensorActivo === bestia.id && textoCinematica.includes('cur'),
                    'anim-hit':
                      defensorActivo === bestia.id &&
                      !textoCinematica.includes('cur') &&
                      !textoCinematica.includes('CRÍTICO'),
                    'anim-crit':
                      defensorActivo === bestia.id && textoCinematica.includes('CRÍTICO'),
                    'anim-exhausted':
                      textoCinematica.includes('exhausto') && textoCinematica.includes(bestia.name),
                    'anim-death':
                      muertosRecientes.includes(bestia.id) ||
                      (!modoCinematica && bestia.currentLife <= 0),
                    'is-boss': bestia.name.includes('[JEFE]'),
                  }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="bottom-panel-rpg">
          <div v-if="modoCinematica" class="narrator-box">
            <p class="dramatic-text" :class="{ 'crit-text': textoCinematica.includes('CRÍTICO') }">
              {{ textoCinematica }}
            </p>
          </div>

          <div v-else class="player-controls">
            <div class="action-menu" v-if="!accionSeleccionada && heroeActivo">
              <button @click="prepararAccion('ATTACK')" class="menu-btn attack">
                <img src="/iconsApp/sword.png" alt="Atacar" class="menu-icon" /> Atacar
              </button>

              <button
                v-if="heroeActivo.fighterClass === 'Cleric'"
                @click="prepararAccion('HEAL')"
                class="menu-btn heal"
              >
                <img src="/iconsApp/heal.png" alt="Curar" class="menu-icon" /> Curar
              </button>
              <button
                v-if="heroeActivo.fighterClass === 'Wizard'"
                @click="prepararAccion('STUN')"
                class="menu-btn stun"
              >
                <img src="/iconsApp/stun.png" alt="Aturdir" class="menu-icon" /> Aturdir
              </button>

              <button @click="retirada" class="menu-btn retreat">
                <img src="/iconsApp/retreat.png" alt="Huir" class="menu-icon" /> Huir
              </button>
            </div>

            <div class="action-menu selecting" v-else-if="accionSeleccionada">
              <p class="instruction-text">
                Selecciona un objetivo para
                <strong :class="accionSeleccionada">{{
                  accionSeleccionada === 'ATTACK'
                    ? 'Atacar'
                    : accionSeleccionada === 'HEAL'
                      ? 'Curar'
                      : 'Aturdir'
                }}</strong>
              </p>
              <button @click="accionSeleccionada = null" class="menu-btn cancel">
                <img src="/iconsApp/bad.png" alt="Cancelar" class="menu-icon" /> Cancelar
              </button>
            </div>
          </div>
        </div>
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
const { showAlert, showConfirm } = useDialog()

// Estado Global
const heroes = ref([])
const bestias = ref([])
const estadoCombate = ref('ONGOING')
const zonaActual = ref('INITIAL')
const etapaActual = ref(1)

// Estado del Turno
const accionesPendientes = ref([])
const indiceHeroeActual = ref(0)
const accionSeleccionada = ref(null)

// Variables Cinemática y Animaciones por ID único
const modoCinematica = ref(false)
const textoCinematica = ref('')
const atacanteActivo = ref(null)
const defensorActivo = ref(null)
const muertosRecientes = ref([])

const heroeActivo = computed(() => {
  if (heroes.value.length === 0 || indiceHeroeActual.value >= heroes.value.length) return null
  return heroes.value[indiceHeroeActual.value]
})

const porcentaje = (actual, max) => {
  if (max === 0) return 0
  return Math.max(0, Math.min(100, (actual / max) * 100))
}

const cerrarVentana = () => {
  // Navegamos de vuelta a la fortaleza
  router.push('/dashboard')
}

const obtenerFondoMundo = (zona) => {
  const fondos = {
    INITIAL: '/world/mundo1.png',
    FOREST: '/world/mundo2.png',
    LAVA: '/world/mundo3.png',
    INFINITE: '/world/mundo4.png',
  }
  return fondos[zona] || '/world/mundo1.png'
}

const obtenerSprite = (fighterClass) => {
  if (!fighterClass) return '/bestiario/default.png'

  const rutas = {
    Warrior: '/bestiario/caballero.png',
    Dwarf: '/bestiario/enano.png',
    Elf: '/bestiario/elfo.png',
    Cleric: '/bestiario/clerigo.png',
    Wizard: '/bestiario/mago.png',
    Goblins: '/bestiario/duende.png',
    Orcus: '/bestiario/orco.png',
    Naga: '/bestiario/naga.png',
    Sorcerer: '/bestiario/brujo.png',
  }

  return rutas[fighterClass] || '/bestiario/default.png'
}

const cargarEstado = async () => {
  try {
    const res = await api.get('/combat/state')
    actualizarPantalla(res.data)
  } catch (error) {
    if (error.response?.status === 400) {
      showAlert(error.response.data, 'error', 'Error')
      // Retrasamos el cierre 3.5 segundos para que puedan leer el CustomAlert
      setTimeout(() => {
        cerrarVentana()
      }, 3500)
    } else {
      cerrarVentana()
    }
  }
}

const prepararAccion = (tipoAccion) => {
  accionSeleccionada.value = tipoAccion
}

const seleccionarObjetivo = async (idObjetivo, tipoPersonaje) => {
  if (!accionSeleccionada.value || modoCinematica.value) return

  if (accionSeleccionada.value === 'HEAL' && tipoPersonaje === 'beast') return
  if (
    (accionSeleccionada.value === 'ATTACK' || accionSeleccionada.value === 'STUN') &&
    tipoPersonaje === 'hero'
  )
    return

  accionesPendientes.value.push({
    heroId: heroeActivo.value.id,
    targetId: idObjetivo,
    actionType: accionSeleccionada.value,
  })

  accionSeleccionada.value = null
  indiceHeroeActual.value++

  if (indiceHeroeActual.value >= heroes.value.length) {
    await ejecutarRonda()
  }
}

// Búsqueda estricta por nombre exacto para evitar confundir "Orco A" con "Orco B"
const buscarIdPorNombre = (nombreStr) => {
  const nom = nombreStr.trim()

  //  Buscar en vivos primero, coincidencia EXACTA
  let fighter = heroes.value.find((h) => h.name === nom && h.currentLife > 0)
  if (!fighter) fighter = bestias.value.find((b) => b.name === nom && b.currentLife > 0)

  // Si no encuentra vivos, buscar en muertos, coincidencia EXACTA
  if (!fighter) fighter = heroes.value.find((h) => h.name === nom)
  if (!fighter) fighter = bestias.value.find((b) => b.name === nom)

  return fighter ? fighter.id : null
}

const ejecutarRonda = async () => {
  try {
    modoCinematica.value = true
    textoCinematica.value = '¡Comienza la refriega!'

    atacanteActivo.value = null
    defensorActivo.value = null
    // NO limpiamos muertosRecientes aquí al inicio, lo haremos al final de toda la ronda
    // Esto asegura que los que ya murieron mantengan la opacidad/filtro gris.

    const res = await api.post('/combat/execute-round', accionesPendientes.value)

    if (res.data.combatLogs && res.data.combatLogs.length > 0) {
      for (const log of res.data.combatLogs) {
        textoCinematica.value = log

        atacanteActivo.value = null
        defensorActivo.value = null

        // Quitamos la etiqueta de crítico visualmente para la lógica de separación de nombres
        let cleanLog = log.replace('¡GOLPE CRÍTICO! ', '')

        if (cleanLog.includes('atacó a')) {
          const partes = cleanLog.split(' atacó a ')
          if (partes.length > 1) {
            const nombreAtacante = partes[0]
            const nombreDefensor = partes[1].split(' por ')[0]

            atacanteActivo.value = buscarIdPorNombre(nombreAtacante)
            defensorActivo.value = buscarIdPorNombre(nombreDefensor)

            const dmgMatch = cleanLog.match(/por (\d+) de daño/)
            if (dmgMatch && defensorActivo.value) {
              const dmg = parseInt(dmgMatch[1])
              const objetivo =
                heroes.value.find((h) => h.id === defensorActivo.value) ||
                bestias.value.find((b) => b.id === defensorActivo.value)
              if (objetivo) {
                objetivo.currentLife = Math.max(0, objetivo.currentLife - dmg)
              }
            }
          }
        } else if (cleanLog.includes('curó a')) {
          const partes = cleanLog.split(' curó a ')
          if (partes.length > 1) {
            atacanteActivo.value = buscarIdPorNombre(partes[0])
            defensorActivo.value = buscarIdPorNombre(partes[1].split(' por ')[0])

            const healMatch = cleanLog.match(/por (\d+) de vida/)
            if (healMatch && defensorActivo.value) {
              const heal = parseInt(healMatch[1])
              const objetivo =
                heroes.value.find((h) => h.id === defensorActivo.value) ||
                bestias.value.find((b) => b.id === defensorActivo.value)
              if (objetivo) {
                objetivo.currentLife = Math.min(objetivo.maxLife, objetivo.currentLife + heal)
              }
            }
          }
        } else if (cleanLog.includes('aturdió a')) {
          const partes = cleanLog.split(' aturdió a ')
          if (partes.length > 1) {
            atacanteActivo.value = buscarIdPorNombre(partes[0])
            defensorActivo.value = buscarIdPorNombre(partes[1].split(' con')[0])
          }
        } else if (cleanLog.includes('muerto') || cleanLog.includes('destruido')) {
          // FIX: Regex mejorado para capturar el nombre exacto antes de " ha "
          const muerteMatch = cleanLog.match(/^(?:¡)?(.*?)\sha\s/)
          if (muerteMatch && muerteMatch[1]) {
            let nombreCaido = muerteMatch[1].trim()
            let idCaido = buscarIdPorNombre(nombreCaido)
            if (idCaido && !muertosRecientes.value.includes(idCaido)) {
              muertosRecientes.value.push(idCaido)
            }
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 3500))
      }
    }

    atacanteActivo.value = null
    defensorActivo.value = null
    // La lista de muertos recientes la limpiamos solo después de actualizar la pantalla
    // para que la nueva ronda los detecte como ya muertos nativamente (currentLife <= 0)

    actualizarPantalla(res.data)
    modoCinematica.value = false
  } catch (error) {
    console.error('Error al ejecutar ronda', error)
    modoCinematica.value = false
  }
}

const retirarJugador = async () => {
  const resultado = await showConfirm(
    '¿Seguro que quieres huir? Volverás a la etapa 1 de esta zona.',
    'Confirmar Retirada',
  )

  if (!resultado) return

  try {
    const res = await api.post('/world/retreat')
    showAlert(res.data, 'success', 'Retirada Exitosa')
    cerrarVentana()
  } catch (error) {
    console.error(error)
    showAlert('Error al retirarse del combate', 'error', 'Error')
  }
}
const retirada = retirarJugador

const viajarNuevaZona = async () => {
  try {
    await api.post('/world/travel')
    await cargarEstado()
  } catch (error) {
    console.error(error)
  }
}

const actualizarPantalla = (data) => {
  heroes.value = data.heroes
  bestias.value = data.beasts
  estadoCombate.value = data.status
  zonaActual.value = data.currentZone
  etapaActual.value = data.currentStage

  accionesPendientes.value = []
  indiceHeroeActual.value = 0
  muertosRecientes.value = [] // Se limpia aquí
}

onMounted(() => {
  cargarEstado()
})
</script>

<style scoped>
.battle-shell {
  background: linear-gradient(135deg, #1a0d2e 0%, #2d1b4e 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Press Start 2P', sans-serif;
}

.battle-container {
  width: 100%;
  max-width: 1280px;
  height: 90vh;
  background-size: cover;
  background-position: bottom;
  position: relative;
  border: 4px solid #7d33cc;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow:
    0 0 30px rgba(179, 102, 255, 0.4),
    0 10px 40px rgba(0, 0, 0, 0.8);
}

.battle-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 5;
  pointer-events: none;
  backdrop-filter: blur(1px);
}

/* Pantallas Finales */
.end-screen {
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.95) 0%, rgba(26, 13, 46, 0.9) 100%);
  color: white;
  text-align: center;
  backdrop-filter: blur(2px);
}
.end-screen.victory h1 {
  color: #ffd700;
  font-size: 4rem;
  text-shadow:
    0 0 20px rgba(255, 215, 0, 0.8),
    0 4px 10px rgba(0, 0, 0, 0.8);
  animation: glow-pulse 2s ease-in-out infinite;
}
.end-screen.defeat h1 {
  color: #ff4466;
  font-size: 4rem;
  text-shadow:
    0 0 20px rgba(255, 68, 102, 0.8),
    0 4px 10px rgba(0, 0, 0, 0.8);
}
.end-screen p {
  font-size: 1.5rem;
  color: #c9b8ff;
  margin: 20px 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);
}
@keyframes glow-pulse {
  0%,
  100% {
    text-shadow:
      0 0 20px rgba(255, 215, 0, 0.6),
      0 4px 10px rgba(0, 0, 0, 0.8);
  }
  50% {
    text-shadow:
      0 0 40px rgba(255, 215, 0, 1),
      0 4px 20px rgba(0, 0, 0, 0.8);
  }
}
.btn-rpg {
  background: linear-gradient(180deg, rgba(61, 37, 99, 0.8) 0%, rgba(26, 13, 46, 0.8) 100%);
  border: 2px solid #d99fff;
  color: #f0e6ff;
  padding: 15px 35px;
  font-size: 1.2rem;
  cursor: pointer;
  border-radius: 8px;
  margin: 10px;
  font-weight: bold;
  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
  box-shadow: 0 4px 15px rgba(179, 102, 255, 0.3);
}
.btn-rpg.primary {
  border-color: #ffd700;
  color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.4);
}
.btn-rpg:hover {
  background: linear-gradient(180deg, rgba(179, 102, 255, 0.6) 0%, rgba(61, 37, 99, 0.8) 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(179, 102, 255, 0.6);
}
.btn-rpg.primary:hover {
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.8);
}

.combat-ui {
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  z-index: 10;
}

/* --- HUD SUPERIOR --- */
.top-hud {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 40px;
  background: linear-gradient(180deg, rgba(26, 13, 46, 0.95) 0%, rgba(26, 13, 46, 0.6) 100%);
  border-bottom: 2px solid #7d33cc;
  box-shadow: 0 4px 15px rgba(179, 102, 255, 0.2);
}
.world-info h2 {
  margin: 0;
  font-size: 1.3rem;
  color: #ffd700;
  text-shadow:
    0 0 10px rgba(255, 215, 0, 0.6),
    2px 2px rgba(0, 0, 0, 0.8);
  letter-spacing: 2px;
}

.active-hero-hud {
  background: linear-gradient(135deg, rgba(61, 37, 99, 0.9) 0%, rgba(45, 27, 78, 0.8) 100%);
  border: 2px solid #d99fff;
  border-radius: 12px;
  padding: 15px 25px;
  box-shadow:
    0 0 20px rgba(179, 102, 255, 0.4),
    0 4px 15px rgba(0, 0, 0, 0.6);
}
.active-hero-details {
  display: flex;
  align-items: center;
  gap: 20px;
}
.hud-portrait {
  width: 80px;
  height: 80px;
  object-fit: contain;
  background: linear-gradient(135deg, #2d1b4e 0%, #1a0d2e 100%);
  border-radius: 50%;
  border: 3px solid #d99fff;
  box-shadow: 0 0 15px rgba(179, 102, 255, 0.5);
  transition: all 0.3s ease;
}
.hud-portrait:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(179, 102, 255, 0.8);
}
.hud-stats h3 {
  margin: 0 0 8px 0;
  color: #f0e6ff;
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
}
.hud-stats .hero-name {
  color: #ffd700;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.4);
}
.hud-health-bar {
  width: 220px;
  height: 20px;
  background: linear-gradient(180deg, #1a0d2e 0%, #2d1b4e 100%);
  border-radius: 10px;
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;
  border: 2px solid #7d33cc;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.6);
}
.hud-health-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff88 0%, #66ff99 100%);
  transition: width 0.5s ease;
  box-shadow:
    inset -2px 0 5px rgba(0, 0, 0, 0.3),
    0 0 10px rgba(102, 255, 153, 0.5);
}
.hud-health-text {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: 0.75rem;
  color: #f0e6ff;
  font-weight: bold;
  line-height: 20px;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
}
.hud-badges .badge img {
  width: 16px;
  height: 16px;
  object-fit: contain;
  vertical-align: middle;
  margin-right: 4px;
}
.hud-badges .badge.stun {
  border-color: #ffaa00;
  background: linear-gradient(135deg, rgba(255, 170, 0, 0.3) 0%, rgba(255, 100, 0, 0.2) 100%);
}
.hud-badges .badge.poison {
  border-color: #ff4466;
  background: linear-gradient(135deg, rgba(255, 68, 102, 0.3) 0%, rgba(200, 50, 80, 0.2) 100%);
}

/* --- ESCENARIO --- */
.battlefield {
  flex-grow: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 5%;
  background: radial-gradient(ellipse at center, rgba(179, 102, 255, 0.1) 0%, transparent 70%);
}

.team-side {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  gap: 25px;
  width: 45%;
}

.sprite-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.floating-hud {
  background: linear-gradient(135deg, rgba(26, 13, 46, 0.95) 0%, rgba(45, 27, 78, 0.85) 100%);
  padding: 6px 12px;
  border-radius: 8px;
  border: 2px solid #d99fff;
  margin-bottom: 10px;
  text-align: center;
  min-width: 100px;
  box-shadow:
    0 0 15px rgba(179, 102, 255, 0.4),
    0 4px 10px rgba(0, 0, 0, 0.6);
}
.sprite-name {
  color: #f0e6ff;
  font-weight: bold;
  font-size: 0.8rem;
  display: block;
  margin-bottom: 4px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
}
.mini-armor {
  font-size: 0.7rem;
  color: #d99fff;
  display: block;
  margin-bottom: 4px;
}
.hp-bar-mini {
  width: 100%;
  height: 8px;
  background: linear-gradient(180deg, #1a0d2e 0%, #2d1b4e 100%);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid #7d33cc;
}
.hp-fill {
  height: 100%;
  background: linear-gradient(90deg, #00ff88 0%, #66ff99 100%);
  transition: width 0.4s ease;
  box-shadow: 0 0 6px rgba(102, 255, 153, 0.6);
}
.enemy-hp {
  background: linear-gradient(90deg, #ff4466 0%, #ff6688 100%);
  box-shadow: 0 0 6px rgba(255, 68, 102, 0.6);
}

.sprite-wrapper {
  min-width: 90px;
  min-height: 130px;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  position: relative;
}
.battle-sprite {
  height: 170px;
  object-fit: contain;
  filter: drop-shadow(0 5px 8px rgba(0, 0, 0, 0.7)) drop-shadow(0 0 10px rgba(179, 102, 255, 0.2));
  transition:
    transform 0.2s,
    filter 0.2s;
}

.is-boss {
  height: 250px !important;
  filter: drop-shadow(0 10px 15px rgba(255, 68, 102, 0.4)) !important;
  z-index: 2;
}

.is-active .battle-sprite {
  transform: translateY(-15px) scale(1.08);
  filter: drop-shadow(0 0 20px rgba(179, 102, 255, 0.8))
    drop-shadow(0 0 30px rgba(255, 215, 0, 0.4)) brightness(1.3);
  animation: pulse-active 0.6s ease-in-out infinite;
}
@keyframes pulse-active {
  0%,
  100% {
    transform: translateY(-15px) scale(1.08);
  }
  50% {
    transform: translateY(-18px) scale(1.1);
  }
}
.has-acted .battle-sprite {
  filter: grayscale(70%) brightness(0.55) drop-shadow(0 5px 8px rgba(0, 0, 0, 0.7));
  opacity: 0.85;
}

.selectable {
  cursor: crosshair;
}
.selectable.target-beast:hover .battle-sprite {
  filter: drop-shadow(0 0 25px #ff4466) drop-shadow(0 0 15px rgba(255, 68, 102, 0.8))
    brightness(1.4);
  transform: scale(1.12);
}
.selectable.target-hero:hover .battle-sprite {
  filter: drop-shadow(0 0 25px #66ff99) drop-shadow(0 0 15px rgba(102, 255, 153, 0.8))
    brightness(1.4);
  transform: scale(1.12);
}

/* --- ANIMACIONES DE COMBATE --- */
.anim-attack {
  animation: lunge 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  filter: drop-shadow(0 0 20px #ffd700) drop-shadow(0 0 10px rgba(255, 215, 0, 0.6)) brightness(1.3);
}

@keyframes lunge {
  0% {
    transform: translateX(0) scaleX(1);
  }
  50% {
    transform: translateX(35px) scaleX(1.15) scaleY(1.05);
  }
  100% {
    transform: translateX(0) scaleX(1);
  }
}

.enemy-sprite.anim-attack {
  animation: lunge-reverse 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes lunge-reverse {
  0% {
    transform: translateX(0) scaleX(1);
  }
  50% {
    transform: translateX(-35px) scaleX(1.15) scaleY(1.05);
  }
  100% {
    transform: translateX(0) scaleX(1);
  }
}

.anim-heal {
  animation: heal-pulse 0.8s ease;
  filter: drop-shadow(0 0 25px #66ff99) drop-shadow(0 0 15px rgba(102, 255, 153, 0.8))
    brightness(1.4) !important;
}

@keyframes heal-pulse {
  0%,
  100% {
    transform: scale(1) translateY(0);
  }
  50% {
    transform: scale(1.1) translateY(-10px);
  }
}

.anim-hit {
  animation: shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  filter: drop-shadow(0 0 25px #ff4466) drop-shadow(0 0 15px rgba(255, 68, 102, 0.8)) sepia(0.8)
    hue-rotate(-50deg) saturate(3) brightness(0.85) !important;
}

@keyframes shake {
  0% {
    transform: translate3d(0, 0, 0);
  }
  10%,
  90% {
    transform: translate3d(-3px, 2px, 0);
  }
  20%,
  80% {
    transform: translate3d(6px, -2px, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-8px, 3px, 0);
  }
  40%,
  60% {
    transform: translate3d(8px, -3px, 0);
  }
}

.anim-crit {
  animation: crit-shake 1s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  filter: drop-shadow(0 0 40px #ff0000) drop-shadow(0 0 25px rgba(255, 0, 0, 0.9)) sepia(1)
    hue-rotate(-50deg) saturate(5) brightness(1.2) !important;
  transform: scale(1.2) !important;
}
@keyframes crit-shake {
  0% {
    transform: translate3d(0, 0, 0) scale(1.2);
  }
  10%,
  90% {
    transform: translate3d(-5px, 4px, 0) scale(1.2);
  }
  20%,
  80% {
    transform: translate3d(10px, -4px, 0) scale(1.2);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-15px, 6px, 0) scale(1.2);
  }
  40%,
  60% {
    transform: translate3d(15px, -6px, 0) scale(1.2);
  }
}

.anim-exhausted {
  animation: exhaust 1s ease;
  filter: grayscale(50%) brightness(0.6) !important;
}
@keyframes exhaust {
  0%,
  100% {
    transform: rotateZ(0);
  }
  25% {
    transform: rotateZ(-5deg);
  }
  75% {
    transform: rotateZ(5deg);
  }
}

.anim-death {
  animation: fade-death 1.2s ease-in forwards;
}

@keyframes fade-death {
  0% {
    filter: sepia(0) hue-rotate(0deg) saturate(1) brightness(1);
    opacity: 1;
    transform: scale(1);
  }
  30% {
    filter: sepia(1) hue-rotate(-50deg) saturate(4) brightness(0.6);
  }
  100% {
    filter: grayscale(100%) brightness(0.4);
    opacity: 0.6;
    transform: scale(0.8) translateY(20px) rotateZ(15deg);
  }
}

/* --- PANEL INFERIOR --- */
.bottom-panel-rpg {
  height: 160px;
  background: linear-gradient(180deg, rgba(45, 27, 78, 0.95) 0%, rgba(26, 13, 46, 0.98) 100%);
  border-top: 4px solid #d99fff;
  box-shadow:
    inset 0 0 20px rgba(0, 0, 0, 0.8),
    0 -4px 20px rgba(179, 102, 255, 0.2);
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.narrator-box {
  width: 100%;
  text-align: center;
}
.dramatic-text {
  color: #f0e6ff;
  font-size: 1.6rem;
  text-shadow:
    0 0 10px rgba(179, 102, 255, 0.4),
    2px 2px 0px rgba(0, 0, 0, 0.8);
  animation: narrative-glow 1s ease-in-out infinite;
}
.crit-text {
  color: #ff4466 !important;
  font-size: 2rem !important;
  text-transform: uppercase;
  font-weight: 900;
  text-shadow:
    0 0 20px #ff0000,
    3px 3px 0px #000 !important;
  animation: crit-pulse 0.5s infinite !important;
}
@keyframes narrative-glow {
  0%,
  100% {
    text-shadow:
      0 0 10px rgba(179, 102, 255, 0.4),
      2px 2px 0px rgba(0, 0, 0, 0.8);
  }
  50% {
    text-shadow:
      0 0 20px rgba(179, 102, 255, 0.8),
      2px 2px 0px rgba(0, 0, 0, 0.8);
  }
}
@keyframes crit-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.player-controls {
  width: 100%;
  display: flex;
  justify-content: center;
}
.action-menu {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  justify-content: center;
}
.menu-btn {
  background: linear-gradient(180deg, rgba(179, 102, 255, 0.6) 0%, rgba(125, 51, 204, 0.8) 100%);
  border: 3px solid #d99fff;
  border-radius: 10px;
  color: #f0e6ff;
  padding: 12px 28px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
  box-shadow:
    0 0 15px rgba(179, 102, 255, 0.3),
    0 4px 10px rgba(0, 0, 0, 0.5);
  transition: all 0.2s ease;
}
.menu-btn:hover {
  transform: translateY(-3px) scale(1.08);
  filter: brightness(1.3);
  box-shadow:
    0 0 25px rgba(179, 102, 255, 0.6),
    0 6px 15px rgba(0, 0, 0, 0.6);
}
.menu-btn:active {
  transform: translateY(-1px) scale(1.05);
}
.menu-btn.attack {
  background: linear-gradient(180deg, rgba(255, 68, 102, 0.7) 0%, rgba(200, 30, 60, 0.8) 100%);
  border-color: #ff4466;
}
.menu-btn.heal {
  background: linear-gradient(180deg, rgba(102, 255, 153, 0.6) 0%, rgba(0, 200, 100, 0.8) 100%);
  border-color: #66ff99;
}
.menu-btn.cancel {
  background: linear-gradient(180deg, rgba(100, 110, 140, 0.6) 0%, rgba(60, 70, 100, 0.8) 100%);
  border-color: #c9b8ff;
}
.menu-btn.retreat {
  background: linear-gradient(180deg, rgba(120, 100, 100, 0.6) 0%, rgba(80, 50, 50, 0.8) 100%);
  border-color: #c9b8ff;
}

.instruction-text {
  color: #f0e6ff;
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6);
  margin-right: 20px;
}
.instruction-text .ATTACK {
  color: #ff4466;
  text-shadow: 0 0 8px rgba(255, 68, 102, 0.6);
}
.instruction-text .HEAL {
  color: #66ff99;
  text-shadow: 0 0 8px rgba(102, 255, 153, 0.6);
}

/* RESPONSIVIDAD */
@media (max-height: 800px), (max-width: 1024px) {
  .battle-container {
    height: auto;
    min-height: 100vh;
    max-width: 100%;
  }

  .top-hud {
    padding: 15px 25px;
    flex-direction: column;
    gap: 15px;
  }

  .world-info h2 {
    font-size: 1rem;
  }

  .active-hero-hud {
    padding: 12px 20px;
    width: 100%;
  }

  .active-hero-details {
    gap: 15px;
  }

  .hud-portrait {
    width: 60px;
    height: 60px;
  }

  .hud-stats h3 {
    font-size: 0.9rem;
  }

  .hud-health-bar {
    width: 150px;
    height: 16px;
  }

  .battlefield {
    padding: 15px 3%;
    gap: 15px;
  }

  .team-side {
    width: 50%;
    gap: 15px;
  }

  .sprite-wrapper {
    min-width: 70px;
    min-height: 100px;
  }

  .battle-sprite {
    height: 120px;
  }

  .is-boss {
    height: 200px !important;
  }

  .bottom-panel-rpg {
    height: auto;
    padding: 15px;
  }

  .dramatic-text {
    font-size: 1.2rem;
  }

  .action-menu {
    gap: 12px;
  }

  .menu-btn {
    padding: 10px 20px;
    font-size: 0.85rem;
  }
}

@media (max-width: 768px) {
  .battle-shell {
    padding: 5px;
  }

  .battle-container {
    border: 2px solid #7d33cc;
    height: 90vh;
    max-width: 100%;
  }

  .top-hud {
    padding: 12px 15px;
    border-bottom: 1px solid #7d33cc;
  }

  .world-info h2 {
    font-size: 0.9rem;
    letter-spacing: 1px;
  }

  .active-hero-hud {
    padding: 10px 15px;
    border-radius: 8px;
    border: 1px solid #d99fff;
  }

  .active-hero-details {
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }

  .hud-portrait {
    width: 50px;
    height: 50px;
  }

  .hud-stats h3 {
    font-size: 0.8rem;
    margin-bottom: 4px;
  }

  .hud-health-bar {
    width: 100%;
    height: 14px;
    margin-bottom: 6px;
  }

  .hud-health-text {
    font-size: 0.6rem;
    line-height: 14px;
  }

  .hud-badges .badge {
    padding: 2px 8px;
    font-size: 0.7rem;
    margin-right: 4px;
  }

  .battlefield {
    padding: 10px 2%;
    flex-direction: column;
    justify-content: space-around;
  }

  .team-side {
    width: 100%;
    flex-direction: row;
    gap: 10px;
  }

  .sprite-container {
    flex-basis: calc(50% - 5px);
  }

  .floating-hud {
    padding: 4px 8px;
    margin-bottom: 6px;
    font-size: 0.75rem;
    min-width: 80px;
  }

  .sprite-name {
    font-size: 0.7rem;
    margin-bottom: 2px;
  }

  .mini-armor {
    font-size: 0.65rem;
    margin-bottom: 2px;
  }

  .hp-bar-mini {
    height: 6px;
  }

  .sprite-wrapper {
    min-width: 50px;
    min-height: 80px;
  }

  .battle-sprite {
    height: 80px;
  }

  .is-boss {
    height: 150px !important;
  }

  .bottom-panel-rpg {
    height: auto;
    padding: 12px;
    border-top: 2px solid #d99fff;
  }

  .dramatic-text {
    font-size: 1rem;
    text-shadow:
      0 0 8px rgba(179, 102, 255, 0.4),
      1px 1px 0px rgba(0, 0, 0, 0.8);
  }

  .action-menu {
    gap: 8px;
    flex-wrap: wrap;
  }

  .menu-btn {
    padding: 8px 16px;
    font-size: 0.75rem;
    border: 2px solid #d99fff;
    border-radius: 6px;
  }

  .instruction-text {
    font-size: 0.9rem;
    margin-right: 10px;
  }

  .end-screen h1 {
    font-size: 2rem !important;
  }

  .end-screen p {
    font-size: 1rem;
    margin: 15px 0;
  }

  .btn-rpg {
    padding: 10px 25px;
    font-size: 0.9rem;
    margin: 8px;
  }
}

@media (max-width: 480px) {
  .battle-shell {
    padding: 0;
  }

  .battle-container {
    border: 1px solid #7d33cc;
    border-radius: 0;
    height: 100vh;
  }

  .top-hud {
    padding: 10px;
    gap: 8px;
    flex-direction: column;
  }

  .world-info h2 {
    font-size: 0.75rem;
    letter-spacing: 0px;
  }

  .active-hero-hud {
    padding: 8px 10px;
    border: 1px solid #d99fff;
    width: 100%;
  }

  .active-hero-details {
    gap: 8px;
  }

  .hud-portrait {
    width: 40px;
    height: 40px;
  }

  .hud-stats h3 {
    font-size: 0.7rem;
  }

  .hud-health-bar {
    width: 100%;
    height: 12px;
  }

  .hud-health-text {
    font-size: 0.55rem;
    line-height: 12px;
  }

  .hud-badges .badge {
    padding: 1px 6px;
    font-size: 0.6rem;
  }

  .battlefield {
    padding: 8px;
    gap: 8px;
  }

  .team-side {
    width: 100%;
    gap: 8px;
  }

  .sprite-container {
    flex-basis: calc(50% - 4px);
  }

  .floating-hud {
    padding: 3px 6px;
    margin-bottom: 4px;
    font-size: 0.65rem;
    min-width: 70px;
  }

  .sprite-name {
    font-size: 0.6rem;
  }

  .mini-armor {
    font-size: 0.55rem;
  }

  .hp-bar-mini {
    height: 5px;
  }

  .sprite-wrapper {
    min-width: 40px;
    min-height: 60px;
  }

  .battle-sprite {
    height: 60px;
  }

  .is-boss {
    height: 120px !important;
  }

  .bottom-panel-rpg {
    height: auto;
    padding: 10px;
  }

  .dramatic-text {
    font-size: 0.8rem;
  }

  .action-menu {
    gap: 6px;
  }

  .menu-btn {
    padding: 6px 12px;
    font-size: 0.65rem;
    border: 1px solid #d99fff;
  }

  .instruction-text {
    font-size: 0.75rem;
    margin-right: 5px;
  }

  .end-screen {
    padding: 20px;
  }

  .end-screen h1 {
    font-size: 1.5rem !important;
  }

  .end-screen p {
    font-size: 0.85rem;
    margin: 10px 0;
  }

  .btn-rpg {
    padding: 8px 20px;
    font-size: 0.75rem;
    margin: 6px;
  }
}

/* Estilos para iconos */
.end-icon {
  width: 40px;
  height: 40px;
  object-fit: contain;
  flex-shrink: 0;
  filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6));
}

.hud-icon {
  width: 24px;
  height: 24px;
  object-fit: contain;
  vertical-align: middle;
  filter: drop-shadow(0 0 4px rgba(255, 215, 0, 0.4));
}

.mini-icon {
  width: 16px;
  height: 16px;
  object-fit: contain;
  vertical-align: middle;
}

.menu-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  flex-shrink: 0;
  margin-right: 6px;
  vertical-align: middle;
}
</style>
