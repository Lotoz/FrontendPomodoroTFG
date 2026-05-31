<script setup>
import { ref } from 'vue'

const props = defineProps({
  tareas: {
    type: Array,
    default: () => [], // Esto soluciona el error: si no hay datos, usa un array vacío
  },
})

const emit = defineEmits(['agregar', 'toggle', 'eliminar', 'editar'])
const nuevaTarea = ref('')
const editingId = ref(null)
const editingTitulo = ref('')

const submitAgregar = () => {
  if (nuevaTarea.value.trim()) {
    emit('agregar', nuevaTarea.value)
    nuevaTarea.value = ''
  }
}

const iniciarEdicion = (tarea) => {
  editingId.value = tarea.id
  editingTitulo.value = tarea.titulo
}

const guardarEdicion = (tareaId) => {
  if (editingTitulo.value.trim()) {
    emit('editar', { id: tareaId, titulo: editingTitulo.value })
    editingId.value = null
    editingTitulo.value = ''
  }
}
</script>

<template>
  <section class="panel tareas-panel">
    <h3><img src="/iconsApp/sword.png" alt="Batalla" /> Misiones Pendientes</h3>

    <form @submit.prevent="submitAgregar" class="add-task-form">
      <input v-model="nuevaTarea" placeholder="Asignar nueva misión al reino..." type="text" />
      <button type="submit" class="btn-add">+</button>
    </form>

    <div v-if="tareas.length === 0" class="empty-state">No hay misiones activas en el tablón.</div>

    <ul>
      <li
        v-for="tarea in tareas"
        :key="tarea.id"
        class="tarea-item"
        :class="{ completada: tarea.completada }"
      >
        <template v-if="editingId !== tarea.id">
          <label class="tarea-content">
            <input
              type="checkbox"
              :checked="tarea.completada"
              @change="$emit('toggle', tarea)"
              class="mission-checkbox"
            />
            <span class="tarea-texto">{{ tarea.titulo }}</span>
          </label>
          <div class="tarea-actions">
            <button @click="iniciarEdicion(tarea)" type="button" class="btn-edit-task">
              <img src="/iconsApp/IconoEdit.png" alt="Editar" />
            </button>

            <form @submit.prevent="$emit('eliminar', tarea.id)" class="form-delete">
              <button type="submit" class="btn-delete">
                <img src="/iconsApp/IconoBorrar.png" alt="Borrar" />
              </button>
            </form>
          </div>
        </template>

        <template v-else>
          <input
            v-model="editingTitulo"
            @keyup.enter="guardarEdicion(tarea.id)"
            class="edit-input"
          />
          <div class="edit-actions">
            <button @click="guardarEdicion(tarea.id)" class="btn-save">
              <img src="/iconsApp/good.png" alt="Guardar" />
            </button>
            <button @click="editingId = null" class="btn-cancel">
              <img src="/iconsApp/bad.png" alt="Cancelar" />
            </button>
          </div>
        </template>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.panel {
  background: linear-gradient(135deg, var(--panel-bg) 0%, var(--panel-hover, #4a2f7a) 100%);
  border-radius: 12px;
  padding: 24px;
  border: 3px solid var(--stroke-light, #4a2f7a);
  color: var(--text-main);
  transition: all 0.3s ease;
  box-shadow:
    0 0 20px rgba(179, 102, 255, 0.2),
    0 4px 15px rgba(0, 0, 0, 0.3);
}

.panel h3 {
  margin-top: 0;
  color: var(--accent-gold, #ffd700);
  text-shadow:
    0 0 10px rgba(179, 102, 255, 0.3),
    1px 1px 2px rgba(0, 0, 0, 0.6);
  letter-spacing: 1px;
}

.add-task-form {
  display: flex;
  gap: 10px;
  margin: 14px 0;
}

.add-task-form input {
  flex-grow: 1;
  padding: 12px;
  background: linear-gradient(135deg, var(--bg-secondary, #2d1b4e) 0%, var(--bg-main) 100%);
  border: 2px solid var(--primary-light, #d99fff);
  color: var(--text-main);
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: inset 0 2px 5px rgba(0, 0, 0, 0.3);
}

.add-task-form input:focus {
  outline: none;
  border-color: var(--accent-gold, #ffd700);
  box-shadow:
    inset 0 2px 5px rgba(0, 0, 0, 0.3),
    0 0 15px rgba(255, 215, 0, 0.3);
}

.add-task-form input::placeholder {
  color: var(--text-secondary, #c9b8ff);
  opacity: 0.6;
}

.btn-add {
  background: linear-gradient(
    135deg,
    var(--primary, #b366ff) 0%,
    var(--primary-dark, #7d33cc) 100%
  );
  color: var(--text-main);
  border: 2px solid var(--primary-light, #d99fff);
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow:
    0 0 15px rgba(179, 102, 255, 0.3),
    0 4px 10px rgba(0, 0, 0, 0.3);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 25px rgba(179, 102, 255, 0.6),
    0 6px 15px rgba(0, 0, 0, 0.4);
}

.btn-add:active {
  transform: translateY(0);
}

.tarea-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: linear-gradient(135deg, rgba(45, 27, 78, 0.8) 0%, rgba(26, 13, 46, 0.8) 100%);
  margin-bottom: 10px;
  border-radius: 8px;
  border: 2px solid var(--primary-dark, #7d33cc);
  transition: all 0.3s ease;
  box-shadow:
    0 0 10px rgba(179, 102, 255, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

.tarea-item:hover {
  border-color: var(--primary-light, #d99fff);
  box-shadow:
    0 0 20px rgba(179, 102, 255, 0.4),
    0 4px 12px rgba(0, 0, 0, 0.4);
  transform: translateX(4px);
}

.tarea-item.completada {
  background: linear-gradient(135deg, rgba(102, 255, 153, 0.15) 0%, rgba(50, 150, 100, 0.15) 100%);
  border-color: var(--success, #00ff88);
  box-shadow:
    0 0 15px rgba(102, 255, 153, 0.2),
    0 2px 8px rgba(0, 0, 0, 0.3);
}

.tarea-item.completada .tarea-texto {
  text-decoration: line-through;
  opacity: 0.6;
  color: var(--success, #00ff88);
}

.tarea-content {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex-grow: 1;
}

.mission-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: var(--success, #00ff88);
  transition: all 0.3s ease;
}

.mission-checkbox:hover {
  transform: scale(1.1);
}

.tarea-texto {
  transition: all 0.3s ease;
  color: var(--text-main);
}

.empty-state {
  text-align: center;
  color: var(--text-secondary, #c9b8ff);
  opacity: 0.7;
  padding: 20px;
  font-style: italic;
}

.tarea-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.form-delete {
  margin: 0;
  padding: 0;
  display: inline-flex;
}

.tarea-actions button,
.edit-actions button {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
  padding: 4px 8px;
  border-radius: 4px;
}

.tarea-actions button:hover,
.edit-actions button:hover {
  transform: scale(1.2);
  filter: brightness(1.3);
}

.btn-edit-task:hover {
  background: rgba(179, 102, 255, 0.3);
}

.btn-delete:hover {
  background: rgba(255, 68, 102, 0.3);
}

.edit-input {
  flex-grow: 1;
  padding: 8px;
  background: linear-gradient(135deg, var(--bg-secondary, #2d1b4e) 0%, var(--bg-main) 100%);
  border: 2px solid var(--accent-gold, #ffd700);
  color: var(--text-main);
  border-radius: 6px;
  transition: all 0.3s ease;
}

.edit-input:focus {
  outline: none;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.4);
}

.edit-actions {
  display: flex;
  gap: 8px;
}

.btn-save:hover {
  color: var(--success, #00ff88);
  background: rgba(102, 255, 153, 0.2);
}

.btn-cancel:hover {
  color: var(--damage, #ff4466);
  background: rgba(255, 68, 102, 0.2);
}

/* RESPONSIVIDAD */
@media (max-width: 768px) {
  .panel {
    padding: 18px;
    border-radius: 10px;
  }

  .panel h3 {
    font-size: 1.2rem;
    margin-bottom: 12px;
  }

  .add-task-form {
    gap: 8px;
    margin: 12px 0;
  }

  .add-task-form input {
    padding: 10px;
    font-size: 0.9rem;
  }

  .btn-add {
    padding: 10px 16px;
    font-size: 1rem;
  }

  .tarea-item {
    padding: 10px;
    margin-bottom: 8px;
    font-size: 0.95rem;
  }

  .tarea-actions {
    gap: 8px;
  }

  .tarea-actions button,
  .edit-actions button {
    font-size: 1rem;
    padding: 3px 6px;
  }
}

@media (max-width: 480px) {
  .panel {
    padding: 14px;
    border-radius: 8px;
    border: 2px solid var(--stroke-light, #4a2f7a);
  }

  .panel h3 {
    font-size: 1rem;
    margin: 0 0 10px 0;
    letter-spacing: 0px;
  }

  .add-task-form {
    flex-direction: column;
    gap: 6px;
    margin: 10px 0;
  }

  .add-task-form input {
    padding: 8px;
    font-size: 0.85rem;
    width: 100%;
  }

  .btn-add {
    padding: 8px 12px;
    font-size: 0.9rem;
    width: 100%;
  }

  .tarea-item {
    flex-direction: column;
    align-items: flex-start;
    padding: 8px;
    margin-bottom: 6px;
  }

  .tarea-content {
    width: 100%;
    margin-bottom: 8px;
    gap: 8px;
  }

  .mission-checkbox {
    width: 18px;
    height: 18px;
  }

  .tarea-texto {
    font-size: 0.9rem;
    word-break: break-word;
  }

  .tarea-actions {
    width: 100%;
    justify-content: flex-end;
    gap: 6px;
  }

  .tarea-actions button,
  .edit-actions button {
    font-size: 0.9rem;
    padding: 2px 4px;
  }

  .edit-input {
    padding: 6px;
    font-size: 0.85rem;
  }

  .empty-state {
    font-size: 0.85rem;
    padding: 15px;
  }
}
</style>
