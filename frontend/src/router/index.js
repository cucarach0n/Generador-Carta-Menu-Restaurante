import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/LoginView.vue'),
        meta: { requiresGuest: true },
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('../views/RegisterView.vue'),
        meta: { requiresGuest: true },
    },
    {
        path: '/generator/:id?',
        name: 'Generator',
        component: () => import('../views/GeneratorView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/menus',
        name: 'Menus',
        component: () => import('../views/MenusView.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/menu/:codigo',
        name: 'PublicMenu',
        component: () => import('../views/PublicMenuView.vue'),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Guard de navegación para rutas protegidas
router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    const estaAutenticado = authStore.estaAutenticado;

    if (to.meta.requiresAuth && !estaAutenticado) {
        // Ruta requiere autenticación pero el usuario no está autenticado
        next({ name: 'Login' });
    } else if (to.meta.requiresGuest && estaAutenticado) {
        // Ruta es para invitados pero el usuario ya está autenticado
        next({ name: 'Generator' });
    } else {
        next();
    }
});

export default router;
