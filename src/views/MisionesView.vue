<script setup>
import { ref, onMounted } from 'vue'
import api from '../api/axios'
import { useRouter } from 'vue-router'
import { useDialog } from '../composables/useDialog'

const router = useRouter()
const { showAlert } = useDialog()
const tareas = ref([])
const filtro = ref('todas') // "todas", "pendientes", "completadas"
const nuevaTarea = ref('')
const editingId = ref(null)
const editingTitulo = ref('')

// Cargar datos
const cargarDatos = async () => {
  try {
    const tareasRes = await api.get('/tareas')
    tareas.value = tareasRes.data
  } catch (error) {
    if (error.response?.status === 401) router.push('/')
  }
}

// Agregar tarea
const agregarTarea = async () => {
  if (!nuevaTarea.value.trim()) return
  try {
    // RUTA LIMPIA
    const res = await api.post('/tareas', {
      titulo: nuevaTarea.value,
      completada: false,
    })
    tareas.value.push(res.data)
    nuevaTarea.value = ''
    showAlert('Misión creada exitosamente', 'success', 'Misión Creada')
  } catch (e) {
    const mensajeReal = e.response?.data?.message || e.message
    showAlert(mensajeReal, 'error', 'Error al crear')
    console.error(e)
  }
}

// Toggle completada
const toggleCompletada = async (tarea) => {
  try {
    await api.patch(`/tareas/${tarea.id}`, {
      completada: !tarea.completada,
    })
    tarea.completada = !tarea.completada
  } catch (e) {
    const mensajeReal = e.response?.data?.message || e.message
    showAlert(mensajeReal, 'error', 'Error al actualizar')
    console.error(e)
  }
}

// Editar tarea
const iniciarEdicion = (tarea) => {
  editingId.value = tarea.id
  editingTitulo.value = tarea.titulo
}

const guardarEdicion = async (tareaId) => {
  if (!editingTitulo.value.trim()) return
  try {
    await api.patch(`/tareas/${tareaId}`, { titulo: editingTitulo.value })
    const tarea = tareas.value.find((t) => t.id === tareaId)
    if (tarea) {
      tarea.titulo = editingTitulo.value
    }
    editingId.value = null
    editingTitulo.value = ''
    showAlert('Misión actualizada', 'success', 'Misión Editada')
  } catch (e) {
    const mensajeReal = e.response?.data?.message || e.message
    showAlert(mensajeReal, 'error', 'Error al editar')
    console.error(e)
  }
}

const cancelarEdicion = () => {
  editingId.value = null
  editingTitulo.value = ''
}

// Eliminar tarea
const eliminarTarea = async (id) => {
  try {
    await api.post('/tareas/borrar', { id: id })
    tareas.value = tareas.value.filter((t) => t.id !== id)
    showAlert('Misión eliminada', 'success', 'Misión Eliminada')
  } catch (e) {
    const mensajeReal = e.response?.data?.message || e.message
    showAlert(mensajeReal, 'error', 'Error al eliminar')
    console.error(e)
  }
}

// Filtrar tareas
const tareasFiltradas = () => {
  if (filtro.value === 'pendientes') {
    return tareas.value.filter((t) => !t.completada)
  } else if (filtro.value === 'completadas') {
    return tareas.value.filter((t) => t.completada)
  }
  return tareas.value
}

onMounted(cargarDatos)
</script>

<template>
  <div class="page-shell">
    <div class="page-card">
      <div class="tareas-view-container">
        <header class="tareas-header">
          <div class="header-top">
            <h1>
              <img src="/iconsApp/scroll.png" alt="Misiones" class="h1-icon" /> Tablón de Misiones
            </h1>
            <button @click="router.push('/dashboard')" class="btn-back">
              Volver al Tablón Principal
            </button>
          </div>

          <form @submit.prevent="agregarTarea" class="add-task-form-expanded">
            <input
              v-model="nuevaTarea"
              placeholder="Escribe una nueva misión para tu reino..."
              type="text"
              class="input-new-task"
            />
            <button type="submit" class="btn-add-large">+ Forjar Misión</button>
          </form>

          <div class="filter-buttons">
            <button
              @click="filtro = 'todas'"
              :class="{ active: filtro === 'todas' }"
              class="btn-filter"
            >
              Todas ({{ tareas.length }})
            </button>
            <button
              @click="filtro = 'pendientes'"
              :class="{ active: filtro === 'pendientes' }"
              class="btn-filter"
            >
              En Curso ({{ tareas.filter((t) => !t.completada).length }})
            </button>
            <button
              @click="filtro = 'completadas'"
              :class="{ active: filtro === 'completadas' }"
              class="btn-filter"
            >
              Superadas ({{ tareas.filter((t) => t.completada).length }})
            </button>
          </div>
        </header>

        <main class="tareas-main">
          <div v-if="tareasFiltradas().length === 0" class="empty-state-large">
            <p v-if="filtro === 'todas'">El tablón está vacío. ¡Es hora de descansar!</p>
            <p v-else-if="filtro === 'pendientes'">
              No hay misiones activas. ¡Buen trabajo, comandante!
            </p>
            <p v-else>Aún no has completado ninguna misión.</p>
          </div>

          <ul class="tareas-list" v-else>
            <li
              v-for="tarea in tareasFiltradas()"
              :key="tarea.id"
              class="tarea-item-expanded"
              :class="{ completada: tarea.completada }"
            >
              <template v-if="editingId !== tarea.id">
                <div class="tarea-main-content">
                  <input
                    type="checkbox"
                    :checked="tarea.completada"
                    @change="toggleCompletada(tarea)"
                    class="mission-checkbox"
                  />
                  <div class="tarea-info">
                    <h3 class="tarea-titulo">{{ tarea.titulo }}</h3>
                    <p class="tarea-status">
                      {{ tarea.completada ? 'Misión Cumplida' : 'Misión Pendiente' }}
                    </p>
                  </div>
                </div>

                <div class="tarea-actions-expanded">
                  <button @click="iniciarEdicion(tarea)" class="btn-action-edit" title="Editar">
                    <img src="/iconsApp/IconoEdit.png" alt="Editar" />
                  </button>
                  <form @submit.prevent="eliminarTarea(tarea.id)" class="form-delete-mission">
                    <button type="submit" class="btn-action-delete" title="Eliminar">
                      <img src="/iconsApp/IconoBorrar.png" alt="Eliminar" />
                    </button>
                  </form>
                </div>
              </template>

              <template v-else>
                <input
                  v-model="editingTitulo"
                  @keyup.enter="guardarEdicion(tarea.id)"
                  @keyup.escape="cancelarEdicion"
                  class="edit-input-expanded"
                  placeholder="Reescribir misión..."
                />
                <div class="edit-actions-expanded">
                  <button @click="guardarEdicion(tarea.id)" class="btn-save-expanded">
                    <img src="/iconsApp/good.png" alt="Guardar" /> Guardar
                  </button>
                  <button @click="cancelarEdicion" class="btn-cancel-expanded">
                    <img src="/iconsApp/bad.png" alt="Cancelar" /> Cancelar
                  </button>
                </div>
              </template>
            </li>
          </ul>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-shell {
  background-color: var(--bg-main);
  min-height: 100vh;
  font-family: sans-serif;
  transition: background-color 0.3s;
}

.tareas-view-container {
  display: flex;
  flex-direction: column;
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.tareas-header {
  margin-bottom: 30px;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 4px solid var(--stroke);
  padding-bottom: 15px;
}

.header-top h1 {
  color: var(--primary);
  font-size: 2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}
.h1-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
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

/* Formulario */
.add-task-form-expanded {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.input-new-task {
  flex-grow: 1;
  padding: 12px 15px;
  background: var(--panel-bg);
  border: 3px solid var(--stroke);
  color: var(--text-main);
  font-family: inherit;
  font-size: 1.1rem;
  border-radius: 8px;
}

.input-new-task:focus {
  outline: none;
  border-color: var(--primary);
}

.btn-add-large {
  background: var(--primary);
  color: var(--bg-main);
  border: 3px solid var(--stroke);
  padding: 10px 25px;
  cursor: pointer;
  font-size: 1.1rem;
  border-radius: 8px;
  font-weight: 800;
  transition: opacity 0.2s;
}
.btn-add-large:hover {
  opacity: 0.8;
}

/* Filtros */
.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.btn-filter {
  background: var(--panel-bg);
  color: var(--text-main);
  border: 2px solid var(--stroke);
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.95rem;
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

/* Lista de tareas */
.tareas-main {
  flex-grow: 1;
}
.empty-state-large {
  display: flex;
  justify-content: center;
  min-height: 200px;
  font-size: 1.3rem;
  color: var(--text-main);
  opacity: 0.7;
  align-items: center;
}

.tareas-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: 15px;
}

.tarea-item-expanded {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px;
  background: var(--panel-bg);
  border: 2px solid var(--stroke);
  border-radius: 12px;
  transition: all 0.3s ease;
}
.tarea-item-expanded:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}
.tarea-item-expanded.completada {
  opacity: 0.6;
}

.tarea-main-content {
  display: flex;
  align-items: center;
  gap: 18px;
  flex-grow: 1;
}
.mission-checkbox {
  width: 24px;
  height: 24px;
  cursor: pointer;
  accent-color: var(--primary);
}

.tarea-info {
  flex-grow: 1;
}
.tarea-titulo {
  margin: 0;
  color: var(--text-main);
  font-size: 1.2rem;
  font-weight: bold;
}
.tarea-status {
  margin: 5px 0 0 0;
  color: var(--text-main);
  font-size: 0.9rem;
  opacity: 0.8;
}
.tarea-item-expanded.completada .tarea-titulo {
  text-decoration: line-through;
}

/* Botones de acción */
.tarea-actions-expanded {
  display: flex;
  gap: 10px;
}
.btn-action-edit,
.btn-action-delete {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action-edit img,
.btn-action-delete img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
.btn-action-edit:hover,
.btn-action-delete:hover {
  background: var(--stroke);
}

/* Modo Edición */
.edit-input-expanded {
  flex-grow: 1;
  padding: 12px 15px;
  border: 3px solid var(--primary);
  background: var(--bg-main);
  color: var(--text-main);
  border-radius: 8px;
  font-family: inherit;
  font-size: 1.1rem;
}
.edit-input-expanded:focus {
  outline: none;
}
.edit-actions-expanded {
  display: flex;
  gap: 10px;
  margin-left: 10px;
}
.btn-save-expanded,
.btn-cancel-expanded {
  padding: 10px 15px;
  border: 2px solid var(--stroke);
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-save-expanded img,
.btn-cancel-expanded img {
  width: 18px;
  height: 18px;
  object-fit: contain;
}
.btn-save-expanded {
  background: #10b981;
  color: white;
  border-color: #059669;
}
.btn-cancel-expanded {
  background: #ef4444;
  color: white;
  border-color: #b91c1c;
}

@media (max-width: 768px) {
  .tareas-view-container {
    padding: 15px;
    max-width: 100%;
  }

  .header-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    border-bottom: 2px solid var(--stroke);
    padding-bottom: 12px;
    margin-bottom: 20px;
  }

  .header-top h1 {
    font-size: 1.5rem;
    width: 100%;
  }

  .btn-back {
    width: 100%;
    text-align: center;
    padding: 10px 15px;
    font-size: 0.9rem;
  }

  .add-task-form-expanded {
    flex-direction: column;
    gap: 8px;
    margin-bottom: 15px;
  }

  .input-new-task {
    padding: 10px 12px;
    font-size: 1rem;
  }

  .btn-add-large {
    padding: 10px 15px;
    font-size: 1rem;
    width: 100%;
  }

  .filter-buttons {
    gap: 8px;
  }

  .btn-filter {
    flex: 1;
    font-size: 0.8rem;
    padding: 8px 12px;
  }

  .form-delete-mission {
    margin: 0;
    padding: 0;
    display: inline-flex;
  }
  .tarea-item-expanded {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 15px;
  }

  .tarea-main-content {
    width: 100%;
    gap: 15px;
  }

  .tarea-info {
    flex-grow: 1;
    width: 100%;
  }

  .tarea-titulo {
    font-size: 1rem;
  }

  .tarea-actions-expanded {
    width: 100%;
    justify-content: flex-end;
    gap: 8px;
  }

  .edit-input-expanded {
    width: 100%;
    padding: 8px 10px;
    font-size: 0.95rem;
  }

  .edit-actions-expanded {
    width: 100%;
    gap: 8px;
    margin-left: 0;
  }

  .btn-save-expanded,
  .btn-cancel-expanded {
    flex: 1;
    padding: 8px 10px;
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .tareas-view-container {
    padding: 10px;
  }

  .page-card {
    padding: 0;
  }

  .header-top {
    padding-bottom: 10px;
    margin-bottom: 15px;
    border-bottom: 2px solid var(--stroke);
  }

  .header-top h1 {
    font-size: 1.2rem;
  }

  .btn-back {
    width: 100%;
    padding: 8px 12px;
    font-size: 0.8rem;
  }

  .tareas-header {
    margin-bottom: 15px;
  }

  .add-task-form-expanded {
    gap: 6px;
    margin-bottom: 12px;
  }

  .input-new-task {
    padding: 8px 10px;
    font-size: 0.9rem;
  }

  .btn-add-large {
    padding: 8px 12px;
    font-size: 0.85rem;
    width: 100%;
  }

  .filter-buttons {
    gap: 6px;
  }

  .btn-filter {
    font-size: 0.7rem;
    padding: 6px 8px;
  }

  .tareas-list {
    gap: 10px;
  }

  .tarea-item-expanded {
    padding: 12px;
    gap: 10px;
    border-radius: 8px;
  }

  .mission-checkbox {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }

  .tarea-titulo {
    font-size: 0.95rem;
  }

  .tarea-status {
    font-size: 0.8rem;
  }

  .tarea-actions-expanded {
    width: 100%;
  }

  .btn-action-edit,
  .btn-action-delete {
    font-size: 1.2rem;
    padding: 6px;
  }

  .edit-input-expanded {
    width: 100%;
    padding: 6px 8px;
    font-size: 0.9rem;
  }

  .edit-actions-expanded {
    width: 100%;
    gap: 6px;
    margin-left: 0;
  }

  .btn-save-expanded,
  .btn-cancel-expanded {
    flex: 1;
    padding: 6px 8px;
    font-size: 0.8rem;
  }

  .empty-state-large {
    font-size: 1rem;
    min-height: 150px;
  }
}
</style>
