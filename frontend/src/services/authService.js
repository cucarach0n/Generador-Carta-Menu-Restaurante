import apiClient from './api';

export default {
    // Registrar nuevo usuario
    registrar(datos) {
        return apiClient.post('/autenticacion/registrar', datos);
    },

    // Iniciar sesión
    iniciarSesion(credenciales) {
        return apiClient.post('/autenticacion/iniciar-sesion', credenciales);
    },

    // Cerrar sesión
    cerrarSesion() {
        return apiClient.post('/autenticacion/cerrar-sesion');
    },

    // Obtener usuario autenticado
    obtenerUsuario() {
        return apiClient.get('/autenticacion/usuario');
    },
};
