<template>
  <div class="equipo-container">
    <div class="header-equipo">
      <h3><img src="/iconsApp/iconoEquipo.png" alt="Equipo" /> Héroes en el Campamento</h3>
      <span class="badge-count">{{ equipo.length }} Activos</span>
    </div>

    <div v-if="equipo.length === 0" class="empty-state">
      <p>No tienes héroes en tu equipo. ¡Visita la Taberna para reclutar!</p>
    </div>

    <div v-else class="heroes-grid">
      <div v-for="heroe in equipo" :key="heroe.id" class="hero-card">
        <div class="hero-header">
          <h4 class="hero-name">{{ heroe.name }}</h4>
          <span class="hero-level">Nv. {{ heroe.level }}</span>
        </div>

        <div class="hero-stats">
          <p>
            <img src="/iconsApp/iconoEquipo.png" alt="Armadura" /> Armadura:
            <strong>{{ heroe.armor }}</strong>
          </p>

          <div class="life-bar-container">
            <div class="life-text">
              <img src="/iconsApp/star.png" alt="Vida" /> Vida: {{ heroe.life }} /
              {{ heroe.lifeMax }}
            </div>
            <div class="life-bar-bg">
              <div
                class="life-bar-fill"
                :style="{ width: calcularPorcentajeVida(heroe.life, heroe.lifeMax) + '%' }"
                :class="{ 'low-health': calcularPorcentajeVida(heroe.life, heroe.lifeMax) < 30 }"
              ></div>
            </div>
          </div>
        </div>

        <div class="status-effects" v-if="heroe.stun || heroe.poisoned">
          <span v-if="heroe.stun" class="effect-badge stun"
            ><img src="/iconsApp/stun.png" alt="Aturdido" /> Aturdido</span
          >
          <span v-if="heroe.poisoned" class="effect-badge poison"
            ><img src="/iconsApp/lose.png" alt="Envenenado" /> Envenenado</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  equipo: {
    type: Array,
    required: true,
  },
})

// Función para calcular el ancho de la barra de vida
const calcularPorcentajeVida = (vidaActual, vidaMax) => {
  if (vidaMax === 0) return 0
  const porcentaje = (vidaActual / vidaMax) * 100
  return Math.max(0, Math.min(100, porcentaje)) // Asegura que esté entre 0 y 100
}
</script>

<style scoped>
.equipo-container {
  background: linear-gradient(135deg, var(--panel-bg) 0%, var(--panel-hover, #4a2f7a) 100%);
  border: 3px solid var(--stroke-light, #4a2f7a);
  border-radius: 12px;
  padding: 20px;
  margin-top: 10px;
  box-shadow:
    0 0 25px rgba(179, 102, 255, 0.3),
    0 4px 15px rgba(0, 0, 0, 0.3);
}

.header-equipo {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--primary-light, #d99fff);
  padding-bottom: 15px;
  margin-bottom: 20px;
}

.header-equipo h3 {
  margin: 0;
  color: var(--accent-gold, #ffd700);
  font-size: 1.5rem;
  text-shadow:
    0 0 10px rgba(179, 102, 255, 0.3),
    1px 1px 2px rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-equipo h3 img {
  width: 30px;
  height: 30px;
  object-fit: contain;
  flex-shrink: 0;
}

.badge-count {
  background: linear-gradient(
    135deg,
    var(--primary, #b366ff) 0%,
    var(--primary-dark, #7d33cc) 100%
  );
  color: var(--text-main);
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 0.9rem;
  border: 2px solid var(--primary-light, #d99fff);
  box-shadow: 0 0 15px rgba(179, 102, 255, 0.3);
}

.empty-state {
  text-align: center;
  padding: 30px;
  color: var(--text-secondary, #c9b8ff);
  opacity: 0.7;
  font-style: italic;
  border: 2px dashed var(--primary-light, #d99fff);
  border-radius: 8px;
  background: rgba(45, 27, 78, 0.5);
}

.heroes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 15px;
}

/* Tarjeta de Héroe */
.hero-card {
  background: linear-gradient(135deg, rgba(45, 27, 78, 0.8) 0%, rgba(26, 13, 46, 0.8) 100%);
  border: 2px solid var(--primary-dark, #7d33cc);
  border-radius: 10px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: all 0.3s ease;
  box-shadow:
    0 0 15px rgba(179, 102, 255, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

.hero-card:hover {
  border-color: var(--primary-light, #d99fff);
  box-shadow:
    0 0 25px rgba(179, 102, 255, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.4);
  transform: translateY(-4px);
}

.hero-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid var(--primary-dark, #7d33cc);
  padding-bottom: 8px;
}

.hero-name {
  margin: 0;
  color: var(--accent-gold, #ffd700);
  font-size: 1.1rem;
  font-weight: 800;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.3);
}

.hero-level {
  font-size: 0.9rem;
  font-weight: bold;
  color: var(--healing, #66ff99);
  text-shadow: 0 0 6px rgba(102, 255, 153, 0.3);
}

.hero-stats p {
  margin: 5px 0;
  color: var(--text-main);
  font-size: 0.95rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hero-stats p img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}

/* Barra de Vida */
.life-bar-container {
  margin-top: 10px;
}

.life-text {
  font-size: 0.85rem;
  color: var(--text-secondary, #c9b8ff);
  margin-bottom: 6px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
}

.life-text img {
  width: 18px;
  height: 18px;
  object-fit: contain;
  flex-shrink: 0;
}

.life-bar-bg {
  width: 100%;
  height: 14px;
  background: linear-gradient(180deg, var(--bg-main) 0%, var(--bg-secondary, #2d1b4e) 100%);
  border-radius: 7px;
  overflow: hidden;
  border: 1px solid var(--primary-dark, #7d33cc);
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.4);
}

.life-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--success, #00ff88) 0%, var(--healing, #66ff99) 100%);
  transition:
    width 0.4s ease,
    background-color 0.3s ease;
  box-shadow: 0 0 8px rgba(102, 255, 153, 0.5);
}

.life-bar-fill.low-health {
  background: linear-gradient(90deg, var(--damage, #ff4466) 0%, #ff7788 100%);
  box-shadow: 0 0 12px rgba(255, 68, 102, 0.6);
  animation: danger-pulse 0.5s ease-in-out infinite;
}

@keyframes danger-pulse {
  0%,
  100% {
    box-shadow: 0 0 12px rgba(255, 68, 102, 0.6);
  }
  50% {
    box-shadow: 0 0 20px rgba(255, 68, 102, 1);
  }
}

/* Efectos Alterados */
.status-effects {
  display: flex;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.effect-badge {
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: bold;
  color: white;
  border: 1px solid;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.effect-badge img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.effect-badge:hover {
  transform: scale(1.08);
}

.effect-badge.stun {
  background: linear-gradient(135deg, var(--stun, #ffaa00) 0%, #ff8800 100%);
  border-color: var(--stun, #ffaa00);
  box-shadow: 0 0 10px rgba(255, 170, 0, 0.4);
}

.effect-badge.poison {
  background: linear-gradient(135deg, var(--damage, #ff4466) 0%, #dd1155 100%);
  border-color: var(--damage, #ff4466);
  box-shadow: 0 0 10px rgba(255, 68, 102, 0.4);
}

/* RESPONSIVIDAD */
@media (max-width: 1024px) {
  .heroes-grid {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 12px;
  }

  .equipo-container {
    padding: 18px;
  }

  .header-equipo h3 {
    font-size: 1.3rem;
  }
}

@media (max-width: 768px) {
  .heroes-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 12px;
  }

  .equipo-container {
    padding: 15px;
    border-radius: 10px;
    margin-top: 8px;
  }

  .header-equipo {
    flex-wrap: wrap;
    gap: 10px;
    padding-bottom: 12px;
    margin-bottom: 15px;
  }

  .header-equipo h3 {
    font-size: 1.1rem;
  }

  .badge-count {
    font-size: 0.8rem;
    padding: 5px 12px;
  }

  .hero-card {
    padding: 12px;
    gap: 8px;
  }

  .hero-name {
    font-size: 1rem;
  }

  .hero-level {
    font-size: 0.85rem;
  }

  .hero-stats p {
    font-size: 0.9rem;
  }

  .life-text {
    font-size: 0.8rem;
  }

  .life-bar-bg {
    height: 12px;
  }

  .effect-badge {
    font-size: 0.7rem;
    padding: 3px 8px;
  }
}

@media (max-width: 480px) {
  .heroes-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .equipo-container {
    padding: 12px;
    border-radius: 8px;
    border: 2px solid var(--stroke-light, #4a2f7a);
    margin-top: 6px;
  }

  .header-equipo {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding-bottom: 10px;
    margin-bottom: 12px;
    border-bottom: 2px solid var(--primary-light, #d99fff);
  }

  .header-equipo h3 {
    font-size: 1rem;
    margin: 0;
  }

  .badge-count {
    font-size: 0.75rem;
    padding: 4px 10px;
    width: 100%;
    text-align: center;
  }

  .empty-state {
    padding: 20px;
    font-size: 0.85rem;
  }

  .hero-card {
    padding: 10px;
    gap: 6px;
    border: 1px solid var(--primary-dark, #7d33cc);
  }

  .hero-header {
    padding-bottom: 6px;
  }

  .hero-name {
    font-size: 0.95rem;
  }

  .hero-level {
    font-size: 0.8rem;
  }

  .hero-stats p {
    font-size: 0.85rem;
    margin: 4px 0;
  }

  .life-bar-container {
    margin-top: 8px;
  }

  .life-text {
    font-size: 0.75rem;
    margin-bottom: 4px;
  }

  .life-bar-bg {
    height: 10px;
    border: 1px solid var(--primary-dark, #7d33cc);
  }

  .status-effects {
    gap: 4px;
    margin-top: 6px;
  }

  .effect-badge {
    font-size: 0.65rem;
    padding: 2px 6px;
  }
}
</style>
