import { defineStore } from 'pinia';
import authService from '../services/authService';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        usuario: JSON.parse(localStorage.getItem('usuario') || 'null'),
        loading: false,
        error: null,
    }),

    getters: {
        estaAutenticado: (state) => !!state.token,
        nombreUsuario: (state) => state.usuario?.name || '',
    },

    actions: {
        async registrar(datos) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authService.registrar(datos);
                this.token = response.data.token;
                this.usuario = response.data.usuario;
                localStorage.setItem('token', this.token);
                localStorage.setItem('usuario', JSON.stringify(this.usuario));
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al registrar';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async iniciarSesion(credenciales) {
            this.loading = true;
            this.error = null;
            try {
                const response = await authService.iniciarSesion(credenciales);
                this.token = response.data.token;
                this.usuario = response.data.usuario;
                localStorage.setItem('token', this.token);
                localStorage.setItem('usuario', JSON.stringify(this.usuario));
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.message || 'Error al iniciar sesión';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async cerrarSesion() {
            try {
                await authService.cerrarSesion();
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            } finally {
                this.token = null;
                this.usuario = null;
                localStorage.removeItem('token');
                localStorage.removeItem('usuario');
            }
        },

        async obtenerUsuario() {
            if (!this.token) return;

            try {
                const response = await authService.obtenerUsuario();
                this.usuario = response.data.usuario;
                localStorage.setItem('usuario', JSON.stringify(this.usuario));
            } catch (error) {
                console.error('Error al obtener usuario:', error);
                this.cerrarSesion();
            }
        },
    },
});
