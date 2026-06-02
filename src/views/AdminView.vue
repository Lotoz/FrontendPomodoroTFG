<template>
  <div class="page-shell">
    <div class="admin-container">
      <header class="header-top">
        <h1>
          <img src="/iconsApp/fortress.png" alt="Admin" class="h1-icon" />
          Sala de Mando Suprema
        </h1>
        <button @click="router.push('/dashboard')" class="btn-back">Volver al Tablón</button>
      </header>

      <div class="admin-content">
        <section class="panel users-panel">
          <h3>Comandantes Registrados ({{ usuarios.length }})</h3>

          <div v-if="cargando" class="status-message">
            Consultando los archivos de la Fortaleza...
          </div>

          <div v-else-if="usuarios.length === 0" class="status-message empty-message">
            No hay usuarios a editar.
          </div>

          <div v-else class="table-responsive">
            <table class="rpg-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Maestro</th>
                  <th>Rango</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in usuarios" :key="user.username">
                  <td class="fw-bold text-primary">{{ user.username }}</td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span :class="['badge-master', user.masterName]">
                      {{ user.masterName }}
                    </span>
                  </td>
                  <td>
                    <span :class="user.role === 'ADMIN' ? 'text-gold fw-bold' : 'text-muted'">
                      {{ user.role || 'USER' }}
                    </span>
                  </td>
                  <td class="action-cell">
                    <button
                      @click="seleccionarUsuario(user)"
                      class="btn-icon-action edit"
                      title="Editar Comandante"
                    >
                      <img src="/iconsApp/IconoEdit.png" alt="Editar" />
                    </button>
                    <button
                      v-if="user.role !== 'ADMIN'"
                      @click="confirmarDestierro(user.username)"
                      class="btn-icon-action delete"
                      title="Desterrar Comandante"
                    >
                      <img src="/iconsApp/IconoBorrar.png" alt="Borrar" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <transition name="fade">
          <section v-if="usuarioEditando" class="panel edit-panel">
            <h3>
              Editando a: <span class="text-gold">{{ usuarioEditando.username }}</span>
            </h3>

            <div class="form-group">
              <label>Nuevo Correo Electrónico</label>
              <input
                v-model="formularioEdicion.email"
                type="email"
                class="form-input"
                placeholder="Dejar en blanco para no cambiar"
              />
            </div>

            <div class="form-group">
              <label>Nueva Contraseña (Opcional)</label>
              <input
                v-model="formularioEdicion.password"
                type="password"
                class="form-input"
                placeholder="Dejar en blanco para no cambiar"
              />
            </div>

            <div class="edit-actions">
              <button @click="guardarCambios" :disabled="guardando" class="btn-save">
                {{ guardando ? 'Aplicando edicto...' : 'Guardar Cambios' }}
              </button>
              <button @click="cancelarEdicion" class="btn-cancel">Cancelar</button>
            </div>
          </section>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { useDialog } from '../composables/useDialog'

const router = useRouter()
const { showAlert, showConfirm } = useDialog()

const usuarios = ref([])
const cargando = ref(true)
const guardando = ref(false)

const usuarioEditando = ref(null)
const formularioEdicion = ref({
  email: '',
  password: '',
})

const cargarUsuarios = async () => {
  cargando.value = true
  try {
    const res = await api.get('/admin/users')
    usuarios.value = res.data
  } catch (error) {
    showAlert(
      'No tienes permisos para ver esta sala o la sesión ha caducado.',
      'error',
      'Acceso Denegado',
    )
    router.push('/dashboard')
  } finally {
    cargando.value = false
  }
}

const seleccionarUsuario = (user) => {
  usuarioEditando.value = user
  formularioEdicion.value = {
    email: user.email,
    password: '', // Nunca mostramos la contraseña actual por seguridad
  }
}

const cancelarEdicion = () => {
  usuarioEditando.value = null
  formularioEdicion.value = { email: '', password: '' }
}

const guardarCambios = async () => {
  guardando.value = true
  try {
    const payload = {}
    if (formularioEdicion.value.email) payload.email = formularioEdicion.value.email
    if (formularioEdicion.value.password) payload.password = formularioEdicion.value.password

    const res = await api.patch(`/admin/users/${usuarioEditando.value.username}`, payload)

    showAlert(res.data.message, 'success', 'Edicto Aprobado')
    cancelarEdicion()
    await cargarUsuarios() // Refrescamos la tabla
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Error al actualizar al comandante.'
    showAlert(errorMsg, 'error', 'Error')
  } finally {
    guardando.value = false
  }
}

const confirmarDestierro = async (username) => {
  const confirm = await showConfirm(
    `¿Estás seguro de que quieres desterrar a ${username}? Se borrará su cuenta, sus héroes y todo su progreso de forma irreversible.`,
    '¿Desterrar Comandante?',
  )
  if (!confirm) return

  try {
    const res = await api.delete(`/admin/users/${username}`)
    showAlert(res.data.message, 'success', 'Comandante Eliminado')
    await cargarUsuarios() // Refrescamos la tabla
  } catch (error) {
    const errorMsg = error.response?.data?.message || 'Error al desterrar al usuario.'
    showAlert(errorMsg, 'error', 'Error de Ejecución')
  }
}

onMounted(() => {
  cargarUsuarios()
})
</script>

<style scoped>
.page-shell {
  background-color: var(--bg-main);
  min-height: 100vh;
  padding: 20px;
  font-family: sans-serif;
}

.admin-container {
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

.header-top h1 {
  color: var(--primary);
  font-size: 2rem;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.h1-icon {
  width: 32px;
  height: 32px;
  object-fit: contain;
}

.btn-back {
  background: var(--stroke);
  color: var(--text-main);
  border: 2px solid var(--panel-bg);
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: var(--primary);
  color: var(--bg-main);
}

.admin-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.panel {
  background: var(--panel-bg);
  border-radius: 12px;
  padding: 24px;
  border: 3px solid var(--stroke);
  color: var(--text-main);
}

.panel h3 {
  color: var(--primary);
  margin-top: 0;
  margin-bottom: 20px;
  border-bottom: 2px solid var(--stroke);
  padding-bottom: 10px;
}

/* MENSAJES DE ESTADO */
.status-message {
  text-align: center;
  padding: 30px;
  font-size: 1.1rem;
  color: var(--primary-light, #d99fff);
  font-style: italic;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  border: 1px dashed var(--stroke);
}

.empty-message {
  color: var(--text-muted, #999);
}

/* Tabla RPG */
.table-responsive {
  overflow-x: auto;
}

.rpg-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.rpg-table th {
  background-color: rgba(0, 0, 0, 0.2);
  color: var(--primary);
  padding: 12px;
  border-bottom: 2px solid var(--stroke);
}

.rpg-table td {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  vertical-align: middle;
}

.rpg-table tr:hover {
  background-color: rgba(255, 255, 255, 0.03);
}

.text-gold {
  color: #ffd700;
}
.text-primary {
  color: var(--primary-light, #d99fff);
}
.text-muted {
  opacity: 0.6;
}
.fw-bold {
  font-weight: bold;
}

.badge-master {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}
.badge-master.lotoz {
  background: #4c1d95;
  color: #fef08a;
}
.badge-master.icefrost {
  background: #bae6fd;
  color: #0c4a6e;
}
.badge-master.blody {
  background: #fca5a5;
  color: #7f1d1d;
}
.badge-master.vindicator {
  background: #485454;
  color: #ede6c8;
}

.action-cell {
  display: flex;
  gap: 10px;
}

.btn-icon-action {
  background: transparent;
  border: 2px solid var(--stroke);
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
  transition:
    transform 0.1s,
    border-color 0.2s;
  font-size: 1.1rem;
}

.btn-icon-action.edit:hover {
  border-color: #ffd700;
  transform: scale(1.1);
}
.btn-icon-action.delete:hover {
  border-color: #ef4444;
  transform: scale(1.1);
}

/* Formulario de Edición */
.edit-panel {
  border-color: #ffd700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 0.9rem;
}

.form-input {
  width: 100%;
  padding: 10px;
  border: 2px solid var(--stroke);
  border-radius: 8px;
  background: var(--bg-main);
  color: var(--text-main);
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #ffd700;
}

.edit-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.btn-save {
  flex: 2;
  padding: 10px;
  background: #ffd700;
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
}

.btn-save:hover:not(:disabled) {
  background: #e6c200;
}

.btn-cancel {
  flex: 1;
  padding: 10px;
  background: transparent;
  color: var(--text-main);
  border: 2px solid var(--stroke);
  border-radius: 8px;
  cursor: pointer;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.btn-icon-action img {
  width: 20px;
  height: 20px;
  object-fit: contain;
  vertical-align: middle;
}

/* Responsividad movil */
@media (max-width: 768px) {
  .page-shell {
    padding: 10px;
  }

  .admin-container {
    gap: 15px;
  }

  .header-top {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
    padding-bottom: 12px;
  }

  .header-top h1 {
    font-size: 1.5rem;
    justify-content: center;
  }

  .btn-back {
    width: 100%;
    text-align: center;
    padding: 12px;
  }

  .panel {
    padding: 15px;
    border-radius: 10px;
  }

  .panel h3 {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }

  .rpg-table th,
  .rpg-table td {
    padding: 10px 8px;
    font-size: 0.9rem;
  }

  .badge-master {
    font-size: 0.75rem;
    padding: 3px 8px;
  }
}

@media (max-width: 480px) {
  .page-shell {
    padding: 8px;
  }

  .header-top h1 {
    font-size: 1.3rem;
  }

  .h1-icon {
    width: 24px;
    height: 24px;
  }

  .panel h3 {
    font-size: 1.1rem;
  }

  .rpg-table th,
  .rpg-table td {
    padding: 8px 6px;
    font-size: 0.85rem;
  }

  .action-cell {
    flex-direction: column;
    gap: 6px;
    align-items: center;
  }

  .btn-icon-action {
    padding: 8px;
  }

  .form-group label {
    font-size: 0.85rem;
  }

  .form-input {
    padding: 8px;
    font-size: 0.9rem;
  }

  .edit-actions {
    flex-direction: column;
    gap: 10px;
  }

  .btn-save,
  .btn-cancel {
    width: 100%;
    padding: 12px;
    font-size: 1rem;
  }
}
</style>
