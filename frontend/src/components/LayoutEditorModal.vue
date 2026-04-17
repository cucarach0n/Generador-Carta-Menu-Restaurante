<template>
  <div v-if="show" class="layout-editor-overlay" @click.self="closeModal">
    <div class="layout-editor-container">
      <div class="layout-editor-header">
        <h3>Diseñador de Layout</h3>
        <button class="btn-close" @click="closeModal">&times;</button>
      </div>

      <div class="layout-editor-body">
        <div class="canvas-container" ref="canvasContainer">
          <!-- Canvas de fondo -->
          <canvas ref="backgroundCanvas" id="backgroundCanvas" :width="1123" :height="794"></canvas>
          
          <!-- Elementos draggables con tamaño real -->
          <div
            v-for="(element, key) in localPositions"
            :key="key"
            class="draggable-section"
            :class="`section-${key}`"
            :style="{
              left: `${element.x}px`,
              top: `${element.y}px`,
              width: `${sectionSizes[key].width}px`,
              height: `${sectionSizes[key].height}px`
            }"
            @mousedown="startDrag($event, key)"
          >
            <div class="section-header">{{ sectionLabels[key] }}</div>
            <div class="section-grip">⋮⋮</div>
          </div>
        </div>

        <div class="layout-editor-info">
          <p><strong>Instrucciones:</strong></p>
          <ul>
            <li>Arrastra las secciones para reposicionarlas</li>
            <li>Los tamaños reflejan el contenido real</li>
            <li>No puedes sacar elementos fuera del lienzo</li>
            <li>Los cambios se aplicarán al guardar</li>
          </ul>
          
          <div class="warning-box">
            <strong>⚠️ Atención:</strong> Asegúrate de que todas las secciones estén dentro del área visible del canvas.
          </div>
        </div>
      </div>

      <div class="layout-editor-footer">
        <button class="btn btn-secondary" @click="restoreDefaults">
          Restaurar Posiciones Predeterminadas
        </button>
        <button class="btn btn-primary" @click="savePositions">
          Guardar Posiciones
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from 'vue';
import { drawMenuCanvas, loadBackgroundImage } from '../utils/menuCanvas';

const props = defineProps({
  show: Boolean,
  menuData: Object,
  currentPositions: Object
});

const emit = defineEmits(['close', 'save']);

const backgroundCanvas = ref(null);
const canvasContainer = ref(null);

// Labels para cada elemento
const sectionLabels = {
  precio: 'Precio',
  entradas: 'Entradas',
  segundos: 'Segundos',
  extras: 'Extras',
  bebidas: 'Bebidas'
};

// Posiciones por defecto - NUEVO SISTEMA TOP-BASED
// pos.y ahora representa el TOP del elemento, no el baseline del texto
// SINCRONIZADO con menuCanvas.js
const defaultPositions = {
  precio: { x: 282, y: 95 },
  entradas: { x: 41, y: 263 },
  segundos: { x: 38, y: 448 },
  extras: { x: 419, y: 265 },
  bebidas: { x: 789, y: 52 }
};

// Tamaños de cada sección - SIN offsetTop (ya no necesario con top-based coordinates)
const sectionSizes = computed(() => {
  const entradas = props.menuData?.items?.filter(i => i.categoria === 'entrada') || [];
  const segundos = props.menuData?.items?.filter(i => i.categoria === 'segundo') || [];
  const extras = props.menuData?.items?.filter(i => i.categoria === 'extra') || [];
  const bebidas = props.menuData?.items?.filter(i => i.categoria === 'bebida') || [];

  return {
    precio: { 
      width: 130,  // Diámetro del círculo + margen 
      height: 130  // Diámetro del círculo + margen
    },
    entradas: { 
      width: 320,
      height: Math.max(120, 70 + (entradas.length * 40))  // Título + items
    },
    segundos: { 
      width: 320, 
      height: Math.max(120, 70 + (segundos.length * 40))
    },
    extras: { 
      width: 300,
      height: Math.max(120, 70 + (extras.length * 55))
    },
    bebidas: { 
      width: 280, 
      height: Math.max(120, 70 + (bebidas.length * 50))
    }
  };
});

// Posiciones locales (editables)
const localPositions = ref({ ...defaultPositions });

// Estado de arrastre
const dragging = ref(null);
const dragOffset = ref({ x: 0, y: 0 });

// Validar y ajustar posiciones para que ninguna sección salga del canvas
// CON NUEVO SISTEMA: pos.y ES el top, por lo que la validación es directa
const validatePositions = (positions) => {
  const validated = JSON.parse(JSON.stringify(positions));
  const sizes = sectionSizes.value;
  
  Object.keys(validated).forEach(key => {
    if (validated[key] && sizes[key]) {
      const size = sizes[key];
      
      // Límites simples: 0 <= x,y y la esquina inferior derecha debe estar dentro del canvas
      const minX = 0;
      const maxX = 1123 - size.width;
      const minY = 0;  // pos.y ES el top, no hay offset que considerar
      const maxY = 794 - size.height;
      
      validated[key].x = Math.max(minX, Math.min(maxX, validated[key].x));
      validated[key].y = Math.max(minY, Math.min(maxY, validated[key].y));
    }
  });
  
  return validated;
};

// Observar cambios en las posiciones actuales del prop
watch(() => props.currentPositions, (newPositions) => {
  if (newPositions) {
    localPositions.value = validatePositions({ ...newPositions });
  } else {
    localPositions.value = validatePositions({ ...defaultPositions });
  }
}, { immediate: true });

// Validar cuando cambian los tamaños de sección
watch(sectionSizes, () => {
  localPositions.value = validatePositions(localPositions.value);
});

// Renderizar canvas cuando se muestre el modal
watch(() => props.show, async (isShown) => {
  if (isShown && props.menuData) {
    await nextTick();  // Esperar a que el DOM se actualice
    await renderCanvas();
  }
});

const renderCanvas = async () => {
  if (!backgroundCanvas.value || !props.menuData) return;

  let imagen;
  try {
    const imagenFondoPath = props.menuData.imagen_fondo || '/images/fondos/fondo1.jpg';
    imagen = await loadBackgroundImage(imagenFondoPath);
  } catch (error) {
    console.warn('No se pudo cargar la imagen de fondo. Usando imagen por defecto.', error);
    try {
      imagen = await loadBackgroundImage('/images/fondos/fondo1.jpg');
    } catch (fallbackError) {
      console.error('Error cargando imagen de fondo por defecto:', fallbackError);
      return;
    }
  }
  
  const titulos = {
    entradas: props.menuData.titulo_entradas || 'ENTRADAS',
    segundos: props.menuData.titulo_segundos || 'SEGUNDOS',
    extras: props.menuData.titulo_extras ||'EXTRAS',
    bebidas: props.menuData.titulo_bebidas || 'BEBIDAS'
  };

  const visibilidad = {
    mostrar_entradas: props.menuData.mostrar_entradas,
    mostrar_segundos: props.menuData.mostrar_segundos,
    mostrar_extras: props.menuData.mostrar_extras,
    mostrar_bebidas: props.menuData.mostrar_bebidas
  };

  // Renderizar con posiciones locales
  drawMenuCanvas(
    'backgroundCanvas',  // ID del canvas
    props.menuData,
    imagen,
    1,
    titulos,
    visibilidad,
    localPositions.value
  );
};

const startDrag = (event, elementKey) => {
  dragging.value = elementKey;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  dragOffset.value = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', stopDrag);
  event.preventDefault();
};

const onDrag = (event) => {
  if (!dragging.value || !canvasContainer.value) return;

  const containerRect = canvasContainer.value.getBoundingClientRect();
  const newX = event.clientX - containerRect.left - dragOffset.value.x;
  const newY = event.clientY - containerRect.top - dragOffset.value.y;

  // Obtener tamaño de la sección actual
  const sectionSize = sectionSizes.value[dragging.value];

  // Limitar dentro del canvas considerando el tamaño de la sección
  const maxX = 1123 - sectionSize.width;
  const maxY = 794 - sectionSize.height;
  
  const clampedX = Math.max(0, Math.min(maxX, newX));
  const clampedY = Math.max(0, Math.min(maxY, newY));

  localPositions.value[dragging.value] = {
    x: Math.round(clampedX),
    y: Math.round(clampedY)
  };

  // Re-renderizar canvas
  renderCanvas();
};

const stopDrag = () => {
  dragging.value = null;
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', stopDrag);
};

const restoreDefaults = () => {
  localPositions.value = { ...defaultPositions };
  renderCanvas();
};

const savePositions = () => {
  emit('save', { ...localPositions.value });
  closeModal();
};

const closeModal = () => {
  emit('close');
};

onMounted(() => {
  if (backgroundCanvas.value) {
    backgroundCanvas.value.id = 'backgroundCanvas';
  }
});
</script>

<style scoped>
.layout-editor-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.layout-editor-container {
  background: white;
  border-radius: 12px;
  max-width: 95%;
  max-height: 95%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.layout-editor-header {
  padding: 20px 30px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.layout-editor-header h3 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #333;
}

.layout-editor-body {
  padding: 30px;
  flex: 1;
  overflow: auto;
  display: flex;
  gap: 30px;
}

.canvas-container {
  position: relative;
  width: 1123px;
  height: 794px;
  border: 3px solid #007bff;
  background: #fff;
  flex-shrink: 0;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

#backgroundCanvas {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  opacity: 1.0;
  z-index: 0;
}

.draggable-section {
  position: absolute;
  background: rgba(0, 123, 255, 0.25);
  border: 2px dashed #007bff;
  border-radius: 4px;
  cursor: move;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  user-select: none;
  backdrop-filter: blur(1px);
  z-index: 1;
}

.draggable-section:hover {
  background: rgba(0, 123, 255, 0.25);
  border-color: #0056b3;
  border-style: solid;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  z-index: 10;
}

.section-header {
  font-size: 14px;
  font-weight: bold;
  color: #007bff;
  background: rgba(255, 255, 255, 0.9);
  padding: 4px 12px;
  border-radius: 12px;
  margin-bottom: 5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.section-grip {
  font-size: 16px;
  color: #007bff;
  opacity: 0.6;
  line-height: 1;
}

.layout-editor-info {
  flex: 1;
  background: #f0f8ff;
  padding: 20px;
  border-radius: 8px;
}

.layout-editor-info p {
  margin-top: 0;
}

.layout-editor-info ul {
  padding-left: 20px;
  line-height: 1.8;
}

.warning-box {
  margin-top: 20px;
  padding: 15px;
  background: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 6px;
  color: #856404;
}

.warning-box strong {
  display: block;
  margin-bottom: 5px;
}

.layout-editor-footer {
  padding: 20px 30px;
  border-top: 1px solid #e0e0e0;
  display: flex;
  justify-content: flex-end;
  gap: 15px;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-primary:hover {
  background: #0056b3;
}
</style>
