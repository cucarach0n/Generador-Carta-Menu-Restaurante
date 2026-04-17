<template>
  <div class="public-menu-view min-vh-100 bg-light">
    <!-- Loading -->
    <div v-if="loading" class="d-flex align-items-center justify-content-center min-vh-100">
      <div class="text-center">
        <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-muted">Cargando menú...</p>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="d-flex align-items-center justify-content-center min-vh-100">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="card shadow">
              <div class="card-body text-center py-5">
                <i class="bi bi-exclamation-triangle display-1 text-warning"></i>
                <h3 class="mt-3">Menú no encontrado</h3>
                <p class="text-muted">{{ error }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Menú -->
    <div v-else-if="menu" class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-10">
          <!-- Header -->
          <div class="text-center mb-4">
            <h2 class="text-primary mb-2">
              <i class="bi bi-box-seam-fill"></i>
              El Mixto
            </h2>
            <h3 class="text-dark">{{ menu.nombre }}</h3>
          </div>

          <!-- Canvas del menú -->
          <div class="card shadow-lg mb-4">
            <div class="card-body p-4 text-center">
              <canvas id="canvasMenuPublico" width="1123" height="794" style="max-width: 100%; height: auto; border: 2px solid #333;"></canvas>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="d-flex justify-content-center gap-3 mb-4">
            <button @click="descargarPDF" class="btn btn-success btn-lg">
              <i class="bi bi-file-earmark-pdf"></i> Descargar PDF
            </button>
            <button @click="descargarImagen" class="btn btn-primary btn-lg">
              <i class="bi bi-image"></i> Descargar Imagen
            </button>
          </div>

          <!-- Footer -->
          <div class="text-center text-muted">
            <p class="mb-0">
              <i class="bi bi-heart-fill text-danger"></i>
              Powered by El Mixto
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import menuService from '../services/menuService';
import { drawMenuCanvas, loadBackgroundImage } from '../utils/menuCanvas';
import { exportMenuToPDF, exportMenuToPNG } from '../utils/pdfExport';

export default {
  name: 'PublicMenuView',
  setup() {
    const route = useRoute();
    const menu = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const imagenFondoCargada = ref(null);

    const cargarMenu = async () => {
      loading.value = true;
      error.value = null;

      try {
        const codigo = route.params.codigo;
        const response = await menuService.verMenuPublico(codigo);
        menu.value = response.data.menu;
        
        // Cargar imagen de fondo
        const imagenUrl = menu.value.imagen_fondo || '/imagenes/fondo.png';
        const img = await loadBackgroundImage(imagenUrl);
        imagenFondoCargada.value = img;
        
        // Esperar a que el canvas esté montado antes de renderizar
        await nextTick();
        
        // Pequeña demora adicional para asegurar que el canvas esté en el DOM
        setTimeout(() => {
          renderizarMenu();
        }, 100);
      } catch (err) {
        error.value = err.response?.data?.mensaje || 'Menú no disponible';
      } finally {
        loading.value = false;
      }
    };

    const renderizarMenu = () => {
      // Verificar que el canvas existe antes de renderizar
      const canvas = document.getElementById('canvasMenuPublico');
      if (!canvas) {
        console.error('Canvas "canvasMenuPublico" no encontrado en el DOM');
        // Intentar de nuevo después de un pequeño delay
        setTimeout(renderizarMenu, 200);
        return;
      }

      if (!menu.value || !imagenFondoCargada.value) {
        console.warn('Menu o imagen no cargados aún');
        return;
      }

      const menuData = {
        nombre: menu.value.nombre,
        precio: menu.value.precio,
        items: menu.value.items || []
      };

      const titulos = {
          entradas: menu.value.titulo_entradas,
          segundos: menu.value.titulo_segundos,
          extras: menu.value.titulo_extras,
          bebidas: menu.value.titulo_bebidas
      };
      
      const visibilidad = {
          mostrar_entradas: menu.value.mostrar_entradas,
          mostrar_segundos: menu.value.mostrar_segundos,
          mostrar_extras: menu.value.mostrar_extras,
          mostrar_bebidas: menu.value.mostrar_bebidas
      };

      drawMenuCanvas('canvasMenuPublico', menuData, imagenFondoCargada.value, 1, titulos, visibilidad);
    };

    const descargarPDF = async () => {
      try {
        const nombreArchivo = `Menu_${menu.value.nombre.replace(/\s+/g, '_')}`;
        await exportMenuToPDF('canvasMenuPublico', nombreArchivo);
      } catch (err) {
        console.error('Error al descargar PDF:', err);
        alert('Error al generar el PDF. Por favor intenta nuevamente.');
      }
    };

    const descargarImagen = () => {
      try {
        const nombreArchivo = `Menu_${menu.value.nombre.replace(/\s+/g, '_')}`;
        exportMenuToPNG('canvasMenuPublico', nombreArchivo);
      } catch (err) {
        console.error('Error al descargar imagen:', err);
        alert('Error al generar la imagen. Por favor intenta nuevamente.');
      }
    };

    onMounted(() => {
      cargarMenu();
    });

    return {
      menu,
      loading,
      error,
      descargarPDF,
      descargarImagen,
    };
  },
};
</script>

<style scoped>
.card {
  border: none;
  border-radius: 1rem;
}
</style>
