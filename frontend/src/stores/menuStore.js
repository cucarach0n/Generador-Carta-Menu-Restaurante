import { defineStore } from 'pinia';
import menuService from '../services/menuService';

export const useMenuStore = defineStore('menu', {
    state: () => ({
        menus: [],
        menuActual: null,
        loading: false,
        error: null,
    }),

    getters: {
        totalMenus: (state) => state.menus.length,
    },

    actions: {
        async cargarMenus() {
            this.loading = true;
            this.error = null;
            try {
                const response = await menuService.obtenerMenus();
                this.menus = response.data.menus;
            } catch (error) {
                this.error = error.response?.data?.mensaje || 'Error al cargar menús';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async crearMenu(menuData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await menuService.crearMenu(menuData);
                this.menus.unshift(response.data.menu);
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.mensaje || 'Error al crear menú';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async cargarMenu(id) {
            this.loading = true;
            this.error = null;
            try {
                const response = await menuService.obtenerMenu(id);
                this.menuActual = response.data.menu;
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.mensaje || 'Error al cargar menú';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async actualizarMenu(id, menuData) {
            this.loading = true;
            this.error = null;
            try {
                const response = await menuService.actualizarMenu(id, menuData);
                const index = this.menus.findIndex((m) => m.id === id);
                if (index !== -1) {
                    this.menus[index] = response.data.menu;
                }
                if (this.menuActual?.id === id) {
                    this.menuActual = response.data.menu;
                }
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.mensaje || 'Error al actualizar menú';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async eliminarMenu(id) {
            this.loading = true;
            this.error = null;
            try {
                await menuService.eliminarMenu(id);
                this.menus = this.menus.filter((m) => m.id !== id);
                if (this.menuActual?.id === id) {
                    this.menuActual = null;
                }
            } catch (error) {
                this.error = error.response?.data?.mensaje || 'Error al eliminar menú';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async activarDesactivar(id) {
            try {
                const response = await menuService.activarDesactivar(id);
                const index = this.menus.findIndex((m) => m.id === id);
                if (index !== -1) {
                    this.menus[index].activo = response.data.activo;
                }
                return response.data;
            } catch (error) {
                this.error = error.response?.data?.mensaje || 'Error al cambiar estado';
                throw error;
            }
        },

        limpiarMenuActual() {
            this.menuActual = null;
        },
    },
});
