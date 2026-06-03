import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'https://backendpomodorotfg.onrender.com/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: sessionStorage.getItem('token') || null,
        masterName: localStorage.getItem('masterName') || 'lotoz',
        error: null
    }),

    actions: {
        applyTheme(themeName) {
            document.documentElement.setAttribute('data-theme', themeName.toLowerCase());
        },

        async login(username, password) {
            this.error = null;
            try {
                const response = await axios.post(`${API_URL}/auth/login`, { username, password });
                this.token = response.data.token;
                this.masterName = response.data.masterName || 'lotoz';

                // Guardamos el token en sessionStorage 
                sessionStorage.setItem('token', this.token);

                // Guardamos el nombre y maestro en localStorage
                localStorage.setItem('username', username);
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
                const response = await axios.post(`${API_URL}/auth/register`, { username, email, password, masterName });
                this.token = response.data.token;
                this.masterName = response.data.masterName;

                // Guardamos el token en sessionStorage
                sessionStorage.setItem('token', this.token);

                // Guardamos el nombre y maestro en localStorage
                localStorage.setItem('username', username);
                localStorage.setItem('masterName', this.masterName);

                this.applyTheme(this.masterName);

                return true;
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al registrarse';
                return false;
            }
        },

        async forgotPassword(email) {
            this.error = null;
            try {
                const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
                return { success: true, message: response.data.message };
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al solicitar el código';
                return { success: false };
            }
        },

        async resetPassword(email, code, newPassword) {
            this.error = null;
            try {
                const response = await axios.post(`${API_URL}/auth/reset-password`, {
                    email,
                    code,
                    newPassword
                });
                return { success: true, message: response.data.message };
            } catch (err) {
                this.error = err.response?.data?.message || 'Error al restablecer la contraseña';
                return { success: false };
            }
        },

        logout() {
            this.token = null;
            this.masterName = 'lotoz';
            // Destruimos las llaves de seguridad y los datos locales
            sessionStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('masterName');

            this.applyTheme('lotoz');
        }
    }
})