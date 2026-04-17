<template>
  <div class="register-view min-vh-100 d-flex align-items-center justify-content-center bg-light">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="card shadow">
            <div class="card-body p-5">
              <h2 class="text-center mb-4">
                <i class="bi bi-box-seam-fill text-primary me-2"></i>
                <span>El Mixto</span>
              </h2>
              <h4 class="text-center mb-4">Crear Cuenta</h4>

              <form @submit.prevent="handleRegistrar">
                <div class="mb-3">
                  <label for="name" class="form-label">Nombre</label>
                  <input
                    type="text"
                    class="form-control"
                    id="name"
                    v-model="name"
                    required
                    :disabled="loading"
                  />
                </div>

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
                    minlength="8"
                    :disabled="loading"
                  />
                  <small class="text-muted">Mínimo 8 caracteres</small>
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
                  {{ loading ? 'Registrando...' : 'Registrarse' }}
                </button>

                <div class="text-center">
                  <p class="mb-0">
                    ¿Ya tienes cuenta?
                    <router-link to="/login" class="text-decoration-none">
                      Inicia sesión aquí
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
  name: 'RegisterView',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    
    const name = ref('');
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref(null);

    const handleRegistrar = async () => {
      loading.value = true;
      error.value = null;

      try {
        await authStore.registrar({
          name: name.value,
          email: email.value,
          password: password.value,
        });
        router.push('/generator');
      } catch (err) {
        error.value = err.response?.data?.mensaje || 'Error al registrar';
      } finally {
        loading.value = false;
      }
    };

    return {
      name,
      email,
      password,
      loading,
      error,
      handleRegistrar,
    };
  },
};
</script>
