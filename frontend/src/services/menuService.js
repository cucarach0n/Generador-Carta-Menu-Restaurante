import apiClient from './api';

export default {
    // Obtener todos los menús del usuario
    obtenerMenus() {
        return apiClient.get('/menus');
    },

    // Crear nuevo menú
    crearMenu(menuData) {
        return apiClient.post('/menus', menuData);
    },

    // Obtener menú específico
    obtenerMenu(id) {
        return apiClient.get(`/menus/${id}`);
    },

    // Actualizar menú
    actualizarMenu(id, menuData) {
        return apiClient.put(`/menus/${id}`, menuData);
    },

    // Eliminar menú
    eliminarMenu(id) {
        return apiClient.delete(`/menus/${id}`);
    },

    // Generar código QR
    generarQR(id) {
        return apiClient.get(`/menus/${id}/generar-qr`, {
            responseType: 'blob', // Para recibir imagen
        });
    },

    // Activar/Desactivar menú
    activarDesactivar(id) {
        return apiClient.put(`/menus/${id}/activar-desactivar`);
    },

    // Ver menú público (sin autenticación)
    verMenuPublico(codigo) {
        return apiClient.get(`/publico/menu/${codigo}`);
    },

    // Subir imagen de fondo
    subirImagen(formData) {
        return apiClient.post('/menus/subir-imagen', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};
