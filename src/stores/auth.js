import { defineStore } from 'pinia'
import axios from 'axios'

// Añadimos la URL de tu backend como respaldo por si la variable de Vercel falla
const API_URL = import.meta.env.VITE_API_URL || 'https://backendpomodorotfg.onrender.com/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        masterName: localStorage.getItem('masterName') || 'lotoz',
        error: null
    }),

    actions: {
        // Método para aplicar el CSS globalmente
        applyTheme(themeName) {
            document.documentElement.setAttribute('data-theme', themeName.toLowerCase());
        },

        async login(username, password) {
            this.error = null;
            try {
                // Ajustado a /auth/login asumiendo que esa es la ruta en tu backend
                const response = await axios.post(`${API_URL}/auth/login`, { username, password });
                this.token = response.data.token;
                this.masterName = response.data.masterName || 'lotoz';

                localStorage.setItem('token', this.token);
                localStorage.setItem('masterName', this.masterName);
                this.applyTheme(this.masterName);

                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al iniciar sesión';
                return false;
            }
        },

        async register(username, email, password, masterName) {
            this.error = null;
            try {
                // Ajustado a /auth/register
                const response = await axios.post(`${API_URL}/auth/register`, { username, email, password, masterName });
                this.token = response.data.token;
                this.masterName = response.data.masterName;

                localStorage.setItem('token', this.token);
                localStorage.setItem('masterName', this.masterName);
                this.applyTheme(this.masterName);

                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al registrarse';
                return false;
            }
        },

        logout() {
            this.token = null;
            this.masterName = 'lotoz';
            localStorage.removeItem('token');
            localStorage.removeItem('masterName');
            this.applyTheme('lotoz');
        }
    }
})