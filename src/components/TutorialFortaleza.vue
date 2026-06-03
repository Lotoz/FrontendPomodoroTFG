<template>
  <div v-if="isOpen" class="tutorial-overlay">
    <div class="tutorial-modal">
      <button class="btn-close" @click="cerrar" title="Cerrar pergamino">✖</button>

      <div class="tutorial-contenido">
        <div class="tutorial-icono">
          <img :src="pasos[pasoActual].icono" :alt="pasos[pasoActual].titulo" />
        </div>

        <h2>{{ pasos[pasoActual].titulo }}</h2>
        <p>{{ pasos[pasoActual].descripcion }}</p>

        <div v-if="pasos[pasoActual].imagen" class="tutorial-imagen">
          <img :src="pasos[pasoActual].imagen" :alt="pasos[pasoActual].titulo" />
        </div>

        <div class="tutorial-indicador">
          <span>Página {{ pasoActual + 1 }} de {{ pasos.length }}</span>
          <div class="progress-dots">
            <button
              v-for="(paso, index) in pasos"
              :key="index"
              @click="irAlPaso(index)"
              :class="{ activo: index === pasoActual }"
              :title="paso.titulo"
            ></button>
          </div>
        </div>
      </div>

      <div class="tutorial-controles">
        <button @click="anteriorPaso" :disabled="pasoActual === 0" class="btn-rpg btn-prev">
          ◀ Atrás
        </button>

        <button
          v-if="pasoActual === pasos.length - 1"
          @click="cerrarYGuardar"
          class="btn-rpg btn-finish"
        >
          ¡A la Batalla! ⚔️
        </button>

        <button v-else @click="siguientePaso" class="btn-rpg btn-next">Siguiente ▶</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const pasoActual = ref(0)

const pasos = [
  {
    titulo: 'Bienvenido a la Fortaleza',
    descripcion:
      'Esta es una aplicación que combina la técnica de estudio Pomodoro con un mundo de fantasía RPG. ¡Estudia, mejora tu productividad y lidera a tus ejércitos!',
    icono: '/iconsApp/fortress.png',
    imagen: '/tutorial/inicio.png',
  },
  {
    titulo: 'Misiones y Productividad',
    descripcion:
      'Anota tus tareas diarias en el Tablón de Misiones. Completa tus objetivos en la vida real y táchalos aquí para mantener el control de tu imperio.',
    icono: '/iconsApp/star.png',
    imagen: '/tutorial/misiones.png',
  },
  {
    titulo: 'Entrenamiento Pomodoro',
    descripcion:
      'Usa el temporizador Pomodoro para tus sesiones de estudio o trabajo. Al completar ciclos, tus héroes equipados subiran de nivel y recuperan su estado.',
    icono: '/iconsApp/troph.png',
    imagen: '/tutorial/pomodoro.png',
  },
  {
    titulo: 'Recluta y Gestiona tu Ejército',
    descripcion:
      'Visita la Taberna para reclutar nuevos héroes que podras seleccionar en el campamento. Selecciona correctamente a tus héroes para las batallas, cada uno tiene habilidades únicas, pero solo podras reclutar un maximo de 10 héroes. Avanza mas en la conquista del mundo para poder reclutar mas!',
    icono: '/iconsApp/beer.png',
    imagen: '/tutorial/taberna.png',
  },
  {
    titulo: 'Gestiona tu equipo',
    descripcion:
      'En el campamento puedes gestionar a tu equipo de héroes, tu equipo de héroes solo podra ser maximo 4, por ende elige sabiamente a tus héroes para las batalla.',
    icono: '/iconsApp/camp.png',
    imagen: '/tutorial/camp.png',
  },
  {
    titulo: 'La Zona de Batalla',
    descripcion:
      'Cuando estés listo, envía a tus héroes a luchar contra las fuerzas oscuras en un combate por turnos. ¡Si mueren, terminarán en el Cementerio!',
    icono: '/iconsApp/sword.png',
    imagen: '/tutorial/zonaBatalla.png',
  },
  {
    titulo: 'Como combatir!',
    descripcion:
      'En la zona de batalla dispondras de dos botones, Atacar y Huir, el boton de atacar hara que tus héroes ataquen a los enemigos, mientras que el boton de huir hara que tus héroes huyan de la batalla, ten cuidado, si huyes perderas la batalla y a los héroes caidos, y perderas todo el avance de zona, ya que la oscuridad aprovechara para avanzar.',
    icono: '/iconsApp/sword.png',
    imagen: '/tutorial/botonesBatalla.png',
  },
  {
    titulo: 'Como combatir!',
    descripcion:
      'Para combatir, selecciona el boton atacar y a tu enemigo en eleccion. Deberas hacerlo por cada heroe de tu equipo. Al finalizar esta eleccion, se ejecutara el turno.',
    icono: '/iconsApp/sword.png',
    imagen: '/tutorial/selectBattle.png',
  },
  {
    titulo: 'Jefes!',
    descripcion:
      'Cada zona de mundo, consta de 10 fases, deberas superar todas para pasar al siguiente mundo. Pero ten cuidado, en la fase 10 de cada mundo, te enfrentaras a un jefe, el cual es mas fuerte que los enemigos comunes, y tendras que usar toda tu estrategia para vencerlo.',
    icono: '/iconsApp/sword.png',
    imagen: '/tutorial/jefeBattle.png',
  },
  {
    titulo: 'Habilidades especiales!',
    descripcion:
      'Tanto algunas bestias como héroes, disponen de habilidades especiales. Descubre cada una de ellas desbloqueandolas! Cuando lo hagas, veras un nuevo boton en la zona de batalla, el cual te permitira usar la habilidad especial de tu heroe.',
    icono: '/iconsApp/sword.png',
  },
  {
    titulo: 'Bestiario',
    descripcion:
      'El conocimiento es poder! En el Bestiario podrás consultar información detallada sobre cada enemigo que hayas enfrentado, sus habilidades, debilidades y estrategias para vencerlos. ¡Usa esta información para planificar tus próximas batallas!',
    icono: '/iconsApp/bestiario.png',
    imagen: '/tutorial/bestiario.png',
  },
  {
    titulo: '¡Todo listo, Comandante!',
    descripcion:
      'Explora el menú, configura tus tiempos de estudio en tu Perfil, y prepárate para conquistar tanto tus exámenes como el mundo virtual.',
    icono: '/iconsApp/config.png',
  },
]

const irAlPaso = (indice) => {
  pasoActual.value = Math.max(0, Math.min(indice, pasos.length - 1))
}

const siguientePaso = () => {
  if (pasoActual.value < pasos.length - 1) {
    pasoActual.value++
  }
}

const anteriorPaso = () => {
  if (pasoActual.value > 0) {
    pasoActual.value--
  }
}

const cerrar = () => {
  emit('close')
}

const cerrarYGuardar = () => {
  // Guardamos en el navegador que ya completó el tutorial
  localStorage.setItem('fortaleza_tutorial_completado', 'true')
  emit('close')
}
</script>

<style scoped>
.tutorial-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

.tutorial-modal {
  background: linear-gradient(135deg, var(--panel-bg, #1a0d2e) 0%, #2d1b4e 100%);
  border-radius: 12px;
  border: 3px solid #d99fff;
  padding: 40px;
  max-width: 550px;
  width: 90%;
  box-shadow:
    0 0 40px rgba(179, 102, 255, 0.4),
    0 10px 30px rgba(0, 0, 0, 0.8);
  position: relative;
  animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  color: #f0e6ff;
  font-family: sans-serif;
}

@keyframes slideIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.btn-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #d99fff;
  transition: all 0.2s ease;
  padding: 5px;
}

.btn-close:hover {
  transform: scale(1.2) rotate(90deg);
  color: #ff4466;
}

.tutorial-contenido {
  text-align: center;
  margin-bottom: 30px;
}

.tutorial-icono {
  margin-bottom: 20px;
  animation: float 2s ease-in-out infinite;
}

.tutorial-icono img {
  width: 80px;
  height: 80px;
  object-fit: contain;
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.6));
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.tutorial-contenido h2 {
  color: #ffd700;
  font-size: 1.8rem;
  margin: 0 0 15px 0;
  font-weight: 800;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.tutorial-contenido p {
  color: #c9b8ff;
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 0 0 25px 0;
}

.tutorial-indicador {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tutorial-indicador span {
  color: #d99fff;
  font-weight: bold;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.progress-dots {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}

.progress-dots button {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #7d33cc;
  background: #1a0d2e;
  cursor: pointer;
  transition: all 0.2s ease;
}

.progress-dots button:hover {
  transform: scale(1.2);
  border-color: #d99fff;
}

.progress-dots button.activo {
  background: #ffd700;
  border-color: #ffd700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
  transform: scale(1.3);
}

.tutorial-controles {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.btn-rpg {
  padding: 10px 20px;
  border: 2px solid #7d33cc;
  border-radius: 8px;
  background: rgba(61, 37, 99, 0.8);
  color: #f0e6ff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  text-transform: uppercase;
}

.btn-rpg:hover:not(:disabled) {
  background: #7d33cc;
  border-color: #d99fff;
  box-shadow: 0 0 15px rgba(179, 102, 255, 0.5);
  transform: translateY(-2px);
}

.btn-rpg:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-next {
  background: linear-gradient(180deg, rgba(179, 102, 255, 0.6) 0%, rgba(125, 51, 204, 0.8) 100%);
  border-color: #d99fff;
}

.btn-finish {
  background: linear-gradient(180deg, #ffd700 0%, #d4af37 100%);
  color: #1a0d2e;
  border-color: #fff;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.6);
  animation: pulse-finish 1.5s infinite;
}

.btn-finish:hover {
  background: #fff;
  color: #000;
  box-shadow: 0 0 30px rgba(255, 215, 0, 1);
}

@keyframes pulse-finish {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.tutorial-imagen {
  margin: auto;
  max-width: 90%;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #7d33cc;
  margin-bottom: 20px;
}

.tutorial-imagen img {
  width: 100%;
  height: auto;
  display: block;
}

@media (max-width: 600px) {
  .tutorial-modal {
    padding: 25px 20px;
  }
  .tutorial-icono img {
    width: 60px;
    height: 60px;
  }
  .tutorial-contenido h2 {
    font-size: 1.4rem;
  }
  .tutorial-contenido p {
    font-size: 0.95rem;
  }
  .btn-rpg {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
}
</style>
