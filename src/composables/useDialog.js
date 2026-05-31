import { ref } from 'vue'

// Estado global para los diálogos
const alertState = ref({
    show: false,
    title: 'Aviso',
    message: '',
    type: 'info', // 'info', 'error', 'success', 'warning'
})

const confirmState = ref({
    show: false,
    title: '¿Confirmar?',
    message: '',
})

let resolveConfirm = null

export function useDialog() {
    /**
     * Muestra una alerta personalizada
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo: 'info', 'error', 'success', 'warning'
     * @param {string} title - Título del alert
     */
    const showAlert = (message, type = 'info', title = 'Aviso') => {
        alertState.value = {
            show: true,
            title,
            message,
            type,
        }
    }

    /**
     * Cierra la alerta
     */
    const closeAlert = () => {
        alertState.value.show = false
    }

    /**
     * Muestra una confirmación y retorna una Promesa
     * @param {string} message - Mensaje de confirmación
     * @param {string} title - Título del diálogo
     * @returns {Promise<boolean>}
     */
    const showConfirm = (message, title = '¿Confirmar?') => {
        return new Promise((resolve) => {
            resolveConfirm = resolve
            confirmState.value = {
                show: true,
                title,
                message,
            }
        })
    }

    /**
     * Confirma la acción
     */
    const confirmAction = () => {
        confirmState.value.show = false
        if (resolveConfirm) {
            resolveConfirm(true)
            resolveConfirm = null
        }
    }

    /**
     * Cancela la acción
     */
    const cancelAction = () => {
        confirmState.value.show = false
        if (resolveConfirm) {
            resolveConfirm(false)
            resolveConfirm = null
        }
    }

    return {
        // Estados reactivos
        alertState,
        confirmState,

        // Métodos
        showAlert,
        closeAlert,
        showConfirm,
        confirmAction,
        cancelAction,
    }
}
