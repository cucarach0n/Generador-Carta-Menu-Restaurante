<template>
  <div class="generator-view min-vh-100 bg-light">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container-fluid">
        <span class="navbar-brand">
          <i class="bi bi-box-seam-fill"></i>
          El Mixto - Generador
        </span>
        <div class="d-flex align-items-center gap-2">
          <router-link to="/menus" class="btn btn-outline-light btn-sm">
            <i class="bi bi-list"></i> Mis Menús
          </router-link>
          <button @click="handleCerrarSesion" class="btn btn-outline-light btn-sm">
            <i class="bi bi-box-arrow-right"></i> Salir
          </button>
        </div>
      </div>
    </nav>

    <div class="container-fluid py-4">
      <div class="row">
        <!-- Panel de configuración -->
        <div class="col-md-4">
          <div class="card shadow-sm mb-4">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Configuración del Menú</h5>
            </div>
            <div class="card-body">
              <div class="mb-3">
                <label class="form-label">Nombre del Menú</label>
                <input
                  v-model="nombreMenu"
                  type="text"
                  class="form-control"
                  placeholder="Ej: Menú Ejecutivo"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Precio</label>
                <div class="input-group">
                  <span class="input-group-text">S/</span>
                  <input
                    v-model.number="precio"
                    type="number"
                    step="0.01"
                    class="form-control"
                    placeholder="10.00"
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label">Imagen de Fondo</label>
                <select v-model="imagenFondoSeleccionada" @change="cambiarImagenFondo" class="form-select mb-2">
                  <option value="/imagenes/fondo.png">Plantilla 1 (Verde)</option>
                  <option value="/imagenes/fondov2.JPG">Plantilla 2 (Azul)</option>
                  <option value="/imagenes/imagenCarta.jpg">Plantilla 3 (Crema)</option>
                </select>
                <button @click="mostrarModalPreview" class="btn btn-sm btn-outline-primary w-100 mb-2">
                  <i class="bi bi-eye"></i> Ver Vista Preliminar
                </button>
                <button @click="mostrarEditorLayout" class="btn btn-sm btn-outline-secondary w-100">
                  <i class="bi bi-grid-3x3"></i> Diseñar Layout
                </button>
              </div>

              <!-- Títulos de Secciones eliminados -->
              <!-- Se editan directamente en cada sección -->
            </div>
          </div>

          <!-- Items por categoría -->
          <div class="card shadow-sm">
            <div class="card-header bg-success text-white">
              <h5 class="mb-0">Items del Menú</h5>
            </div>
            <div class="card-body">
              <!-- Entrada -->
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div class="flex-grow-1 me-2" @click="editandoTitulo.entradas = true" style="cursor: pointer;">
                     <input v-if="editandoTitulo.entradas" ref="inputEntradas" v-model="tituloEntradas" @blur="editandoTitulo.entradas = false" @keyup.enter="editandoTitulo.entradas = false" class="form-control form-control-sm fw-bold" autofocus />
                     <h6 v-else class="mb-0 d-flex align-items-center">
                        {{ tituloEntradas }} <i class="bi bi-pencil-fill text-muted ms-2" style="font-size: 0.8rem;"></i>
                     </h6>
                  </div>
                  <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" v-model="mostrarEntradas" title="Mostrar/Ocultar Sección">
                  </div>
                </div>
                <div class="input-group mb-2" v-for="(item, index) in entradas" :key="`entrada-${index}`">
                  <input v-model="item.nombre" type="text" class="form-control form-control-sm" placeholder="Nombre del plato" />
                  <button @click="eliminarItem('entrada', index)" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
                <button @click="agregarItem('entrada')" class="btn btn-sm btn-outline-success w-100">
                  <i class="bi bi-plus"></i> Agregar Entrada
                </button>
              </div>

              <!-- Segundo -->
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div class="flex-grow-1 me-2" @click="editandoTitulo.segundos = true" style="cursor: pointer;">
                     <input v-if="editandoTitulo.segundos" v-model="tituloSegundos" @blur="editandoTitulo.segundos = false" @keyup.enter="editandoTitulo.segundos = false" class="form-control form-control-sm fw-bold" autofocus />
                     <h6 v-else class="mb-0 d-flex align-items-center">
                        {{ tituloSegundos }} <i class="bi bi-pencil-fill text-muted ms-2" style="font-size: 0.8rem;"></i>
                     </h6>
                  </div>
                  <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" v-model="mostrarSegundos" title="Mostrar/Ocultar Sección">
                  </div>
                </div>
                <div class="input-group mb-2" v-for="(item, index) in segundos" :key="`segundo-${index}`">
                  <input v-model="item.nombre" type="text" class="form-control form-control-sm" placeholder="Nombre del plato" />
                  <button @click="eliminarItem('segundo', index)" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
                <button @click="agregarItem('segundo')" class="btn btn-sm btn-outline-success w-100">
                  <i class="bi bi-plus"></i> Agregar Segundo
                </button>
              </div>

              <!-- Extra -->
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div class="flex-grow-1 me-2" @click="editandoTitulo.extras = true" style="cursor: pointer;">
                     <input v-if="editandoTitulo.extras" v-model="tituloExtras" @blur="editandoTitulo.extras = false" @keyup.enter="editandoTitulo.extras = false" class="form-control form-control-sm fw-bold" autofocus />
                     <h6 v-else class="mb-0 d-flex align-items-center">
                        {{ tituloExtras }} <i class="bi bi-pencil-fill text-muted ms-2" style="font-size: 0.8rem;"></i>
                     </h6>
                  </div>
                  <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" v-model="mostrarExtras" title="Mostrar/Ocultar Sección">
                  </div>
                </div>
                <div class="input-group mb-2" v-for="(item, index) in extras" :key="`extra-${index}`">
                  <input v-model="item.nombre" type="text" class="form-control form-control-sm" placeholder="Nombre del extra" />
                  <input v-model.number="item.precio" type="number" step="0.01" class="form-control form-control-sm" placeholder="Precio" style="max-width: 80px;" />
                  <button @click="eliminarItem('extra', index)" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
                <button @click="agregarItem('extra')" class="btn btn-sm btn-outline-success w-100">
                  <i class="bi bi-plus"></i> Agregar Extra
                </button>
              </div>

              <!-- Bebida -->
              <div class="mb-3">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div class="flex-grow-1 me-2" @click="editandoTitulo.bebidas = true" style="cursor: pointer;">
                     <input v-if="editandoTitulo.bebidas" v-model="tituloBebidas" @blur="editandoTitulo.bebidas = false" @keyup.enter="editandoTitulo.bebidas = false" class="form-control form-control-sm fw-bold" autofocus />
                     <h6 v-else class="mb-0 d-flex align-items-center">
                        {{ tituloBebidas }} <i class="bi bi-pencil-fill text-muted ms-2" style="font-size: 0.8rem;"></i>
                     </h6>
                  </div>
                  <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" v-model="mostrarBebidas" title="Mostrar/Ocultar Sección">
                  </div>
                </div>
                <div class="input-group mb-2" v-for="(item, index) in bebidas" :key="`bebida-${index}`">
                  <input v-model="item.nombre" type="text" class="form-control form-control-sm" placeholder="Nombre de la bebida" />
                  <input v-model.number="item.precio" type="number" step="0.01" class="form-control form-control-sm" placeholder="Precio" style="max-width: 80px;" />
                  <button @click="eliminarItem('bebida', index)" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
                <button @click="agregarItem('bebida')" class="btn btn-sm btn-outline-success w-100">
                  <i class="bi bi-plus"></i> Agregar Bebida
                </button>
              </div>
            </div>
          </div>

          <!-- Botón guardar -->
          <div class="d-grid gap-2 mt-3">
            <button
              @click="guardarMenu"
              class="btn btn-lg btn-primary"
              :disabled="guardando || !nombreMenu || !precio"
            >
              <span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span>
              {{ guardando ? 'Guardando...' : (esEdicion ? 'Actualizar Menú' : 'Guardar Menú') }}
            </button>
          </div>

          <div v-if="error" class="alert alert-danger mt-3" role="alert">
            {{ error }}
          </div>

          <div v-if="mensajeExito" class="alert alert-success mt-3" role="alert">
            {{ mensajeExito }}
          </div>
        </div>

        <!-- Vista previa pequeña -->
        <div class="col-md-8">
          <div class="card shadow-sm">
            <div class="card-header bg-info text-white">
              <h5 class="mb-0">Vista Previa Actual</h5>
            </div>
            <div class="card-body text-center">
              <canvas id="canvasPreview" width="675" height="477" style="max-width: 100%; height: auto; border: 2px solid #333; box-shadow: 0 4px 8px rgba(0,0,0,0.2);"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Vista Preliminar Completa -->
    <div class="modal fade" id="modalPreview" tabindex="-1">
      <div class="modal-dialog modal-xl">
        <div class="modal-content">
          <div class="modal-header bg-primary text-white">
            <h5 class="modal-title">Vista Preliminar del Menú</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body text-center">
            <canvas id="canvasCarta" width="1123" height="794" style="max-width: 100%; border: 2px solid #333;"></canvas>
          </div>
          <div class="modal-footer">
            <button @click="descargarPDF" class="btn btn-success">
              <i class="bi bi-file-earmark-pdf"></i> Descargar PDF
            </button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Layout Editor Modal -->
    <LayoutEditorModal
      :show="mostrandoEditorLayout"
      :menuData="menuData"
      :currentPositions="posicionesMenu"
      @close="mostrandoEditorLayout = false"
      @save="guardarPosiciones"
    />
  </div>
</template>

<script>
// ... imports
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // useRoute added
import { useAuthStore } from '../stores/authStore';
import { useMenuStore } from '../stores/menuStore';
import menuService from '../services/menuService'; // Import service directly for fetching single menu
import { drawMenuCanvas, loadBackgroundImage } from '../utils/menuCanvas';
import { exportMenuToPDF } from '../utils/pdfExport';
import { Modal } from 'bootstrap';
import LayoutEditorModal from '../components/LayoutEditorModal.vue';

export default {
  name: 'GeneratorView',
  components: {
    LayoutEditorModal
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const authStore = useAuthStore();
    const menuStore = useMenuStore();

    const menuId = ref(null); // ID for editing
    const esEdicion = computed(() => !!menuId.value);

    const nombreMenu = ref('');
    const precio = ref(10);
    const imagenFondoSeleccionada = ref('/imagenes/fondo.png');
    const imagenFondoCargada = ref(null);

    // Títulos de secciones personalizables
    const tituloEntradas = ref('ENTRADAS');
    const tituloSegundos = ref('SEGUNDOS');
    const tituloExtras = ref('EXTRAS');
    const tituloBebidas = ref('BEBIDAS');

    // Visibilidad de secciones
    const mostrarEntradas = ref(true);
    const mostrarSegundos = ref(true);
    const mostrarExtras = ref(true);
    const mostrarBebidas = ref(true);

    // Estado de edición inline de títulos
    const editandoTitulo = ref({
      entradas: false,
      segundos: false,
      extras: false,
      bebidas: false
    });

    const entradas = ref([]);
    const segundos = ref([]);
    const extras = ref([]);
    const bebidas = ref([]);

    const guardando = ref(false);
    const error = ref(null);
    const mensajeExito = ref(null);

    // Layout editor state
    const mostrandoEditorLayout = ref(false);
    const posicionesMenu = ref(null);

    const totalItems = computed(() => {
      return entradas.value.length + segundos.value.length + extras.value.length + bebidas.value.length;
    });

    const titulosSecciones = computed(() => ({
      entradas: tituloEntradas.value || 'ENTRADAS',
      segundos: tituloSegundos.value || 'SEGUNDOS',
      extras: tituloExtras.value || 'EXTRAS',
      bebidas: tituloBebidas.value || 'BEBIDAS'
    }));

    const visibilidadSecciones = computed(() => ({
      mostrar_entradas: mostrarEntradas.value,
      mostrar_segundos: mostrarSegundos.value,
      mostrar_extras: mostrarExtras.value,
      mostrar_bebidas: mostrarBebidas.value
    }));

    // Datos del menú para el canvas
    const menuData = computed(() => ({
      nombre: nombreMenu.value,
      precio: precio.value,
      imagen_fondo: imagenFondoSeleccionada.value,  // Para el modal
      titulo_entradas: tituloEntradas.value,
      titulo_segundos: tituloSegundos.value,
      titulo_extras: tituloExtras.value,
      titulo_bebidas: tituloBebidas.value,
      mostrar_entradas: mostrarEntradas.value,
      mostrar_segundos: mostrarSegundos.value,
      mostrar_extras: mostrarExtras.value,
      mostrar_bebidas: mostrarBebidas.value,
      items: [
        ...entradas.value.map(item => ({ ...item, categoria: 'entrada' })),
        ...segundos.value.map(item => ({ ...item, categoria: 'segundo' })),
        ...extras.value.map(item => ({ ...item, categoria: 'extra', precio: item.precio || 0 })),
        ...bebidas.value.map(item => ({ ...item, categoria: 'bebida', precio: item.precio || 0 })),
      ]
    }));

    // Cargar imagen de fondo
    const cambiarImagenFondo = async () => {
      try {
        const img = await loadBackgroundImage(imagenFondoSeleccionada.value);
        imagenFondoCargada.value = img;
        await nextTick();
        renderizarPreview();
      } catch (err) {
        console.error('Error cargando imagen de fondo:', err);
      }
    };

    // Renderizar canvas preview pequeño
    const renderizarPreview = () => {
      drawMenuCanvas('canvasPreview', menuData.value, imagenFondoCargada.value, 0.6, titulosSecciones.value, visibilidadSecciones.value, posicionesMenu.value);
    };

    // Renderizar canvas completo para modal
    const renderizarCanvasCompleto = () => {
      drawMenuCanvas('canvasCarta', menuData.value, imagenFondoCargada.value, 1, titulosSecciones.value, visibilidadSecciones.value, posicionesMenu.value);
    };

    // ... (mostrarModalPreview y descargarPDF igual) ...
    const mostrarModalPreview = () => {
      const modalEl = document.getElementById('modalPreview');
      const modal = new Modal(modalEl);
      modal.show();
      setTimeout(() => { renderizarCanvasCompleto(); }, 200);
    };

    const descargarPDF = async () => {
      try {
        const nombreArchivo = `Menu_${nombreMenu.value.replace(/\s+/g, '_') || 'ElMixto'}`;
        await exportMenuToPDF('canvasCarta', nombreArchivo);
      } catch (err) {
        console.error('Error al descargar PDF:', err);
        alert('Error al generar el PDF.');
      }
    };

    const mostrarEditorLayout = () => {
      mostrandoEditorLayout.value = true;
    };

    const guardarPosiciones = (nuevasPosiciones) => {
      posicionesMenu.value = nuevasPosiciones;
      renderizarPreview();
    };

    const agregarItem = (categoria) => {
      const nuevoItem = { nombre: '', categoria, orden: 0 };
      if (categoria === 'extra' || categoria === 'bebida') nuevoItem.precio = 0;
      
      switch (categoria) {
        case 'entrada': entradas.value.push(nuevoItem); break;
        case 'segundo': segundos.value.push(nuevoItem); break;
        case 'extra': extras.value.push(nuevoItem); break;
        case 'bebida': bebidas.value.push(nuevoItem); break;
      }
    };

    const eliminarItem = (categoria, index) => {
      switch (categoria) {
        case 'entrada': entradas.value.splice(index, 1); break;
        case 'segundo': segundos.value.splice(index, 1); break;
        case 'extra': extras.value.splice(index, 1); break;
        case 'bebida': bebidas.value.splice(index, 1); break;
      }
    };

    const guardarMenu = async () => {
      if (!nombreMenu.value || !precio.value) {
        error.value = 'Completa nombre y precio'; return;
      }
      if (totalItems.value === 0) {
        error.value = 'Agrega al menos un item'; return;
      }

      guardando.value = true;
      error.value = null;
      mensajeExito.value = null;

      try {
        const items = [
          ...entradas.value.map((item, i) => ({ ...item, categoria: 'entrada', orden: i })),
          ...segundos.value.map((item, i) => ({ ...item, categoria: 'segundo', orden: i })),
          ...extras.value.map((item, i) => ({ ...item, categoria: 'extra', orden: i, precio: item.precio || 0 })),
          ...bebidas.value.map((item, i) => ({ ...item, categoria: 'bebida', orden: i, precio: item.precio || 0 })),
        ].filter(item => item.nombre.trim() !== '');

        const datosMenu = {
          nombre: nombreMenu.value,
          precio: precio.value,
          imagen_fondo: imagenFondoSeleccionada.value,
          imagen_fondo_tipo: 'default',
          items: items,
          titulo_entradas: tituloEntradas.value,
          titulo_segundos: tituloSegundos.value,
          titulo_extras: tituloExtras.value,
          titulo_bebidas: tituloBebidas.value,
          mostrar_entradas: mostrarEntradas.value,
          mostrar_segundos: mostrarSegundos.value,
          mostrar_extras: mostrarExtras.value,
          mostrar_bebidas: mostrarBebidas.value,
          posiciones: posicionesMenu.value,
        };

        if (esEdicion.value) {
          await menuService.actualizarMenu(menuId.value, datosMenu);
          mensajeExito.value = '¡Menú actualizado exitosamente!';
        } else {
          await menuStore.crearMenu(datosMenu);
          mensajeExito.value = '¡Menú creado exitosamente!';
        }
        
        setTimeout(() => { router.push('/menus'); }, 1500);
      } catch (err) {
        error.value = err.response?.data?.mensaje || 'Error al guardar';
      } finally {
        guardando.value = false;
      }
    };

    const cargarMenuExistente = async (id) => {
        try {
            const response = await menuService.obtenerMenu(id);
            const menu = response.data.menu;
            
            menuId.value = menu.id;
            nombreMenu.value = menu.nombre;
            precio.value = Number(menu.precio);
            imagenFondoSeleccionada.value = menu.imagen_fondo || '/imagenes/fondo.png';
            
            // Cargar títulos personalizados
            tituloEntradas.value = menu.titulo_entradas || 'ENTRADAS';
            tituloSegundos.value = menu.titulo_segundos || 'SEGUNDOS';
            tituloExtras.value = menu.titulo_extras || 'EXTRAS';
            tituloBebidas.value = menu.titulo_bebidas || 'BEBIDAS';

            // Cargar visibilidad (con fallback a true si no existe)
            mostrarEntradas.value = menu.mostrar_entradas !== false;
            mostrarSegundos.value = menu.mostrar_segundos !== false;
            mostrarExtras.value = menu.mostrar_extras !== false;
            mostrarBebidas.value = menu.mostrar_bebidas !== false;

            // Cargar posiciones personalizadas
            posicionesMenu.value = menu.posiciones || null;

            // Limpiar arrays
            entradas.value = [];
            segundos.value = [];
            extras.value = [];
            bebidas.value = [];

            // Distribuir items
            if (menu.items && menu.items.length > 0) {
                menu.items.forEach(item => {
                    const itemData = {
                        nombre: item.nombre,
                        categoria: item.categoria,
                        precio: Number(item.precio),
                        orden: item.orden
                    };
                    
                    if (item.categoria === 'entrada') entradas.value.push(itemData);
                    else if (item.categoria === 'segundo') segundos.value.push(itemData);
                    else if (item.categoria === 'extra') extras.value.push(itemData);
                    else if (item.categoria === 'bebida') bebidas.value.push(itemData);
                });
            }
            
            // Recargar imagen y canvas
            await cambiarImagenFondo();

        } catch (err) {
            console.error(err);
            error.value = "Error al cargar el menú para editar";
            setTimeout(() => router.push('/menus'), 2000);
        }
    };

    const handleCerrarSesion = async () => {
      await authStore.cerrarSesion();
      router.push('/login');
    };

    watch([nombreMenu, precio, entradas, segundos, extras, bebidas, 
           tituloEntradas, tituloSegundos, tituloExtras, tituloBebidas,
           mostrarEntradas, mostrarSegundos, mostrarExtras, mostrarBebidas], () => {
      renderizarPreview();
    }, { deep: true });

    onMounted(async () => {
      if (route.params.id) {
          await cargarMenuExistente(route.params.id);
      } else {
          await cambiarImagenFondo();
      }
    });

    return {
      nombreMenu, precio, imagenFondoSeleccionada,
      tituloEntradas, tituloSegundos, tituloExtras, tituloBebidas,
      mostrarEntradas, mostrarSegundos, mostrarExtras, mostrarBebidas, // Nuevas variables
      editandoTitulo, // Estado de edición
      entradas, segundos, extras, bebidas, totalItems,
      agregarItem, eliminarItem, guardarMenu, guardando, error, mensajeExito,
      handleCerrarSesion, cambiarImagenFondo, mostrarModalPreview, descargarPDF,
      esEdicion,
      mostrandoEditorLayout, mostrarEditorLayout, guardarPosiciones, posicionesMenu,
      menuData  // Computed para pasar al modal
    };
  },
};
</script>

<style scoped>
.preview-container {
  border: 2px dashed #dee2e6;
}
</style>
