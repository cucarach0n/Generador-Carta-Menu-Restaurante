<template>
  <div class="login-view min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">
                <i class="bi bi-box-seam-fill text-primary me-2"></i>
                <span>El Mixto</span>
              </h2>
              <h4 class="text-center mb-4">Iniciar Sesión</h4>

              <form @submit.prevent="handleIniciarSesion">
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="email"
                    required
                    :disabled="loading"
                  />
                </div>

                <div class="mb-3">
                  <label for="password" class="form-label">Contraseña</label>
                  <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="password"
                    required
                    :disabled="loading"
                  />
                </div>

                <div v-if="error" class="alert alert-danger" role="alert">
                  {{ error }}
                </div>

                <button
                  type="submit"
                  class="btn btn-primary w-100 mb-3"
                  :disabled="loading"
                >
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ loading ? 'Iniciando sesión...' : 'Iniciar Sesión' }}
                </button>

                <div class="text-center">
                  <p class="mb-0">
                    ¿No tienes cuenta?
                    <router-link to="/register" class="text-decoration-none">
                      Regístrate aquí
                    </router-link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

export default {
  name: 'LoginView',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref(null);

    const handleIniciarSesion = async () => {
      loading.value = true;
      error.value = null;

      try {
        await authStore.iniciarSesion({
          email: email.value,
          password: password.value,
        });
        router.push('/generator');
      } catch (err) {
        error.value = err.response?.data?.mensaje || 'Error al iniciar sesión';
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      password,
      loading,
      error,
      handleIniciarSesion,
    };
  },
};
</script>
