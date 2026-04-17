<template>
  <div class="menus-view min-vh-100 bg-light">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <span class="navbar-brand">
          <i class="bi bi-box-seam-fill"></i>
          El Mixto
        </span>
        <div class="d-flex align-items-center">
          <span class="text-white me-3">{{ authStore.nombreUsuario }}</span>
          <button @click="handleCerrarSesion" class="btn btn-outline-light btn-sm">
            <i class="bi bi-box-arrow-right"></i> Salir
          </button>
        </div>
      </div>
    </nav>

    <div class="container py-4">
      <div class="row mb-4">
        <div class="col">
          <h2>Mis Menús</h2>
          <p class="text-muted">Gestiona todos tus menús creados</p>
        </div>
        <div class="col-auto">
          <router-link to="/generator" class="btn btn-primary">
            <i class="bi bi-plus-circle"></i> Crear Nuevo Menú
          </router-link>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <!-- Lista de menús -->
      <div v-else-if="menus.length > 0" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <div v-for="menu in menus" :key="menu.id" class="col">
          <div class="card h-100 shadow-sm">
            <div class="card-body">
              <h5 class="card-title">{{ menu.nombre }}</h5>
              <p class="card-text">
                <strong>Precio:</strong> S/ {{ menu.precio }}<br />
                <strong>Items:</strong> {{ menu.items?.length || 0 }}<br />
                <strong>Estado:</strong>
                <div class="form-check form-switch d-inline-block ms-2">
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :checked="menu.activo"
                    @change="toggleActivo(menu)"
                    title="Activar/Desactivar"
                    style="cursor: pointer;"
                  >
                  <label class="form-check-label small text-muted">
                    {{ menu.activo ? 'Activo' : 'Inactivo' }}
                  </label>
                </div>
              </p>
              <p class="text-muted small">
                <i class="bi bi-calendar"></i>
                {{ formatearFecha(menu.created_at) }}
              </p>
            </div>
            <div class="card-footer bg-white">
              <div class="d-flex justify-content-between gap-2">
                <button @click="editarMenu(menu.id)" class="btn btn-sm btn-outline-warning w-100" title="Editar">
                  <i class="bi bi-pencil"></i>
                </button>
                <button @click="verPreview(menu)" class="btn btn-sm btn-outline-info w-100" title="Vista Previa">
                  <i class="bi bi-eye"></i>
                </button>
                <button @click="descargarPDFDesdeLista(menu)" class="btn btn-sm btn-outline-success w-100" title="Descargar PDF">
                  <i class="bi bi-file-pdf"></i>
                </button>
              </div>
              <div class="d-flex justify-content-between gap-2 mt-2">
                <button
                  @click="verQR(menu)"
                  class="btn btn-sm btn-outline-primary w-100"
                  title="Ver QR"
                >
                  <i class="bi bi-qr-code"></i>
                </button>
                <button
                  @click="eliminar(menu)"
                  class="btn btn-sm btn-outline-danger w-100"
                  title="Eliminar"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- ... -->
    </div>
    
    <!-- Modal Preview -->
    <div class="modal fade" id="previewModal" tabindex="-1" ref="previewModalRef">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Vista Previa - {{ menuSeleccionado?.nombre }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
             <canvas id="canvasPreviewModal" width="1123" height="794" style="max-width: 100%; border: 2px solid #333;"></canvas>
          </div>
          <div class="modal-footer">
            <button @click="descargarPDFDesdeLista(menuSeleccionado)" class="btn btn-success">
               <i class="bi bi-file-earmark-pdf"></i> Descargar PDF
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal QR -->
    <div
      class="modal fade"
      id="qrModal"
      tabindex="-1"
      ref="qrModalRef"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Código QR - {{ menuSeleccionado?.nombre }}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
            <div v-if="qrLoading" class="spinner-border text-primary"></div>
            <div v-else-if="qrSvg" v-html="qrSvg" class="mb-3"></div>
            <p class="small text-muted">
              URL: {{ urlPublica }}
            </p>
            <button @click="copiarURL" class="btn btn-sm btn-outline-primary">
              <i class="bi bi-clipboard"></i> Copiar URL
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Canvas Oculto para Generación de PDF -->
    <canvas id="canvasHidden" width="1123" height="794" style="position:fixed; left:-9999px; visibility:hidden;"></canvas>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import { useMenuStore } from '../stores/menuStore';
import menuService from '../services/menuService';
import { Modal } from 'bootstrap';
import { drawMenuCanvas, loadBackgroundImage } from '../utils/menuCanvas';
import { exportMenuToPDF } from '../utils/pdfExport';
import Swal from 'sweetalert2';

export default {
  name: 'MenusView',
  setup() {
    const router = useRouter();
    const authStore = useAuthStore();
    const menuStore = useMenuStore();

    const loading = ref(false);
    const error = ref(null);
    const qrModalRef = ref(null);
    const qrModal = ref(null);
    const previewModalRef = ref(null); // New Ref
    const previewModal = ref(null); // New Ref
    const menuSeleccionado = ref(null);
    const qrSvg = ref(null);
    const qrLoading = ref(false);
    const urlPublica = ref('');
    const menus = ref([]);

    const cargarMenus = async () => {
      loading.value = true;
      error.value = null;
      try {
        await menuStore.cargarMenus();
        menus.value = menuStore.menus;
      } catch (err) {
        error.value = 'Error al cargar los menús';
      } finally {
        loading.value = false;
      }
    };

    const toggleActivo = async (menu) => {
      const originalState = menu.activo;
      // Optimistic update
      menu.activo = !menu.activo;
      
      try {
        await menuStore.activarDesactivar(menu.id);
        // Change confirmed by server
      } catch (err) {
        // Revert on failure
        menu.activo = originalState;
        alert('Error al cambiar el estado');
      }
    };

    const editarMenu = (id) => {
      router.push(`/generator/${id}`);
    };

    const prepararCanvas = async (canvasId, menu) => {
      const imagenUrl = menu.imagen_fondo || '/imagenes/fondo.png';
      const img = await loadBackgroundImage(imagenUrl);
      const titulos = {
        entradas: menu.titulo_entradas,
        segundos: menu.titulo_segundos,
        extras: menu.titulo_extras,
        bebidas: menu.titulo_bebidas
      };
      const visibilidad = {
        mostrar_entradas: menu.mostrar_entradas,
        mostrar_segundos: menu.mostrar_segundos,
        mostrar_extras: menu.mostrar_extras,
        mostrar_bebidas: menu.mostrar_bebidas
      };
      drawMenuCanvas(canvasId, menu, img, 1, titulos, visibilidad);
    };

    const verPreview = async (menu) => {
      menuSeleccionado.value = menu;
      previewModal.value.show();
      await nextTick();
      try {
        await prepararCanvas('canvasPreviewModal', menu);
      } catch (error) {
        console.error("Error cargando imagen para preview", error);
      }
    };
    
    const descargarPDFDesdeLista = async (menu) => {
      try {
        Swal.fire({
            title: 'Generando PDF...',
            text: 'Por favor espera',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });
        
        // Usar canvas oculto
        await prepararCanvas('canvasHidden', menu);
        
        // Esperar un momento para asegurar renderizado
        await new Promise(resolve => setTimeout(resolve, 500));

        const nombreArchivo = `Menu_${menu.nombre.replace(/\s+/g, '_')}`;
        await exportMenuToPDF('canvasHidden', nombreArchivo);
        
        Swal.fire({
            icon: 'success',
            title: '¡Descargado!',
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
      } catch (err) {
        console.error(err);
        Swal.fire('Error', 'No se pudo generar el PDF', 'error');
      }
    };

    const verQR = async (menu) => {
      menuSeleccionado.value = menu;
      qrLoading.value = true;
      qrSvg.value = null;
      urlPublica.value = `http://localhost:5174/menu/${menu.codigo_unico}`;

      qrModal.value.show();

      try {
        const response = await menuService.generarQR(menu.id);
        const svgBlob = new Blob([response.data], { type: 'image/svg+xml' });
        qrSvg.value = await svgBlob.text();
      } catch (err) {
        qrSvg.value = '<p class="text-danger">Error al generar QR</p>';
      } finally {
        qrLoading.value = false;
      }
    };

    const copiarURL = () => {
      navigator.clipboard.writeText(urlPublica.value);
      alert('URL copiada al portapapeles');
    };

    const eliminar = async (menu) => {
      const result = await Swal.fire({
        title: `¿Eliminar "${menu.nombre}"?`,
        text: "Esta acción no se puede deshacer",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        try {
          await menuStore.eliminarMenu(menu.id);
          menus.value = menus.value.filter(m => m.id !== menu.id);
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El menú ha sido eliminado correctamente.',
            timer: 1500,
            showConfirmButton: false
          });
        } catch (err) {
          Swal.fire('Error', 'Hubo un problema al eliminar el menú', 'error');
        }
      }
    };

    const handleCerrarSesion = async () => {
      await authStore.cerrarSesion();
      router.push('/login');
    };

    const formatearFecha = (fecha) => {
      return new Date(fecha).toLocaleDateString('es-ES');
    };

    onMounted(() => {
      cargarMenus();
      qrModal.value = new Modal(qrModalRef.value);
      previewModal.value = new Modal(previewModalRef.value);
    });

    return {
      authStore, loading, error, menus,
      toggleActivo, verQR, eliminar, handleCerrarSesion, formatearFecha,
      qrModalRef, previewModalRef, menuSeleccionado, qrSvg, qrLoading, urlPublica, copiarURL,
      editarMenu, verPreview, descargarPDFDesdeLista
    };
  },
};
</script>
