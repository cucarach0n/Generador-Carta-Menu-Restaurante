// Variable para rastrear el elemento que se está editando
var elementoEditando = null;

// Función para agregar producto inline
function agregarProductoInline(tipoCategoria) {
    let lista;
    let tienePrecio = false;

    switch (tipoCategoria) {
        case 1:
            lista = document.getElementById('selectEntrada');
            tienePrecio = false;
            break;
        case 2:
            lista = document.getElementById('selectSegundo');
            tienePrecio = false;
            break;
        case 3:
            lista = document.getElementById('selectExtra');
            tienePrecio = true;
            break;
        case 4:
            lista = document.getElementById('selectBebida');
            tienePrecio = true;
            break;
    }

    // Cancelar cualquier edición en curso
    if (elementoEditando) {
        cancelarEdicionInline();
    }

    // Crear el elemento de edición inline
    const nuevoItem = document.createElement('li');
    nuevoItem.className = 'list-group-item';
    nuevoItem.setAttribute('data-editing', 'true');
    nuevoItem.setAttribute('data-tipo', tipoCategoria);

    if (tienePrecio) {
        nuevoItem.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <input type="text" class="form-control form-control-sm flex-grow-1" placeholder="Nombre del producto" 
                       id="inputNuevoProducto" maxlength="50" style="max-width: 50%;">
                <div class="input-group input-group-sm" style="max-width: 25%;">
                    <span class="input-group-text">S/.</span>
                    <input type="number" class="form-control" placeholder="0.00" 
                           id="inputNuevoPrecio" min="0" step="0.50" max="999">
                </div>
                <div class="d-flex gap-1 ms-auto">
                    <button class="btn btn-sm btn-success" onclick="guardarNuevoProducto(${tipoCategoria});" title="Guardar" style="padding: 0.25rem 0.5rem;">
                        <i class="bi bi-check-lg"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="cancelarEdicionInline();" title="Cancelar" style="padding: 0.25rem 0.5rem;">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
        `;
    } else {
        nuevoItem.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <input type="text" class="form-control form-control-sm flex-grow-1" placeholder="Nombre del producto" 
                       id="inputNuevoProducto" maxlength="50">
                <div class="d-flex gap-1 ms-auto">
                    <button class="btn btn-sm btn-success" onclick="guardarNuevoProducto(${tipoCategoria});" title="Guardar" style="padding: 0.25rem 0.5rem;">
                        <i class="bi bi-check-lg"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="cancelarEdicionInline();" title="Cancelar" style="padding: 0.25rem 0.5rem;">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Agregar al final de la lista (antes del item "Vacio..." si existe)
    const itemVacio = lista.querySelector('[data-posicion="null"]');
    if (itemVacio) {
        lista.insertBefore(nuevoItem, itemVacio);
    } else {
        lista.appendChild(nuevoItem);
    }

    elementoEditando = nuevoItem;

    // Enfocar el input
    setTimeout(() => {
        const input = document.getElementById('inputNuevoProducto');
        if (input) input.focus();
    }, 100);
}

// Función para guardar nuevo producto
function guardarNuevoProducto(tipoCategoria) {
    const inputNombre = document.getElementById('inputNuevoProducto');
    const inputPrecio = document.getElementById('inputNuevoPrecio');

    if (!inputNombre || !inputNombre.value.trim()) {
        alert('El nombre del producto no puede estar vacío');
        return;
    }

    const nombreProducto = inputNombre.value.trim();
    const precioProducto = inputPrecio ? parseFloat(inputPrecio.value) : 0;

    // Validar precio para categorías que lo requieren
    if ((tipoCategoria === 3 || tipoCategoria === 4) && (!precioProducto || precioProducto <= 0)) {
        alert('Debes ingresar un precio válido');
        return;
    }

    // Agregar al array correspondiente
    switch (tipoCategoria) {
        case 1:
            arrayEntradas.push(nombreProducto);
            break;
        case 2:
            arraySegundos.push([nombreProducto, 0]);
            break;
        case 3:
            arrayExtras.push([nombreProducto, precioProducto]);
            break;
        case 4:
            arrayBebidas.push([nombreProducto, precioProducto]);
            break;
    }

    // Actualizar la interfaz
    cancelarEdicionInline();
    escribirMenuHtml();
    limpiarCanvas();
    draw();

    // Usar setTimeout para asegurar que drawPreview se ejecute después de que el DOM se actualice
    setTimeout(function () {
        console.log('Llamando a drawPreview, tipo:', typeof drawPreview);
        if (typeof drawPreview === 'function') {
            drawPreview();
            console.log('drawPreview ejecutado exitosamente');
        } else {
            console.error('drawPreview no está definido!');
        }
    }, 100);
}

// Función para iniciar edición de un producto existente
function editarProductoInline(elemento, tipo, index) {
    // Cancelar cualquier edición en curso y redibujar
    if (elementoEditando) {
        elementoEditando = null;
        escribirMenuHtml(); // Redibujar para limpiar el estado
    }

    // Obtener una referencia fresca del elemento después del redibujado
    // Buscar el elemento por su tipo e índice
    let listaElementos;
    switch (tipo) {
        case 1:
            listaElementos = document.getElementById('selectEntrada').querySelectorAll('.selectProducto');
            break;
        case 2:
            listaElementos = document.getElementById('selectSegundo').querySelectorAll('.selectProducto');
            break;
        case 3:
            listaElementos = document.getElementById('selectExtra').querySelectorAll('.selectProducto');
            break;
        case 4:
            listaElementos = document.getElementById('selectBebida').querySelectorAll('.selectProducto');
            break;
    }

    // Obtener el elemento correcto por índice
    if (listaElementos && listaElementos[index]) {
        elemento = listaElementos[index];
    } else {
        console.error('No se pudo encontrar el elemento para editar');
        return;
    }

    let nombreActual, precioActual;
    const tienePrecio = (tipo === 3 || tipo === 4);

    // Obtener valores actuales
    switch (tipo) {
        case 1:
            nombreActual = arrayEntradas[index];
            break;
        case 2:
            nombreActual = arraySegundos[index][0];
            break;
        case 3:
            nombreActual = arrayExtras[index][0];
            precioActual = arrayExtras[index][1];
            break;
        case 4:
            nombreActual = arrayBebidas[index][0];
            precioActual = arrayBebidas[index][1];
            break;
    }

    // Guardar referencia y datos originales
    elemento.setAttribute('data-editing', 'true');
    elemento.setAttribute('data-index', index);
    elemento.setAttribute('data-tipo', tipo);

    // Crear el formulario inline
    if (tienePrecio) {
        elemento.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <input type="text" class="form-control form-control-sm flex-grow-1" value="${nombreActual}" 
                       id="inputEditProducto" maxlength="50" style="max-width: 50%;">
                <div class="input-group input-group-sm" style="max-width: 25%;">
                    <span class="input-group-text">S/.</span>
                    <input type="number" class="form-control" value="${precioActual}" 
                           id="inputEditPrecio" min="0" step="0.50" max="999">
                </div>
                <div class="d-flex gap-1 ms-auto">
                    <button class="btn btn-sm btn-success" onclick="guardarEdicionProducto();" title="Guardar" style="padding: 0.25rem 0.5rem;">
                        <i class="bi bi-check-lg"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="cancelarEdicionInline();" title="Cancelar" style="padding: 0.25rem 0.5rem;">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
        `;
    } else {
        elemento.innerHTML = `
            <div class="d-flex align-items-center gap-2">
                <input type="text" class="form-control form-control-sm flex-grow-1" value="${nombreActual}" 
                       id="inputEditProducto" maxlength="50">
                <div class="d-flex gap-1 ms-auto">
                    <button class="btn btn-sm btn-success" onclick="guardarEdicionProducto();" title="Guardar" style="padding: 0.25rem 0.5rem;">
                        <i class="bi bi-check-lg"></i>
                    </button>
                    <button class="btn btn-sm btn-secondary" onclick="cancelarEdicionInline();" title="Cancelar" style="padding: 0.25rem 0.5rem;">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
            </div>
        `;
    }

    elementoEditando = elemento;

    // Enfocar el input
    setTimeout(() => {
        const input = document.getElementById('inputEditProducto');
        if (input) {
            input.focus();
            input.select();
        }
    }, 100);
}

// Función para guardar la edición de un producto
function guardarEdicionProducto() {
    if (!elementoEditando) return;

    const inputNombre = document.getElementById('inputEditProducto');
    const inputPrecio = document.getElementById('inputEditPrecio');

    if (!inputNombre || !inputNombre.value.trim()) {
        alert('El nombre del producto no puede estar vacío');
        return;
    }

    const nombreProducto = inputNombre.value.trim();
    const precioProducto = inputPrecio ? parseFloat(inputPrecio.value) : 0;
    const tipo = parseInt(elementoEditando.getAttribute('data-tipo'));
    const index = parseInt(elementoEditando.getAttribute('data-index'));

    // Validar precio para categorías que lo requieren
    if ((tipo === 3 || tipo === 4) && (!precioProducto || precioProducto <= 0)) {
        alert('Debes ingresar un precio válido');
        return;
    }

    // Actualizar el array correspondiente
    switch (tipo) {
        case 1:
            arrayEntradas[index] = nombreProducto;
            break;
        case 2:
            arraySegundos[index] = [nombreProducto, 0];
            break;
        case 3:
            arrayExtras[index] = [nombreProducto, precioProducto];
            break;
        case 4:
            arrayBebidas[index] = [nombreProducto, precioProducto];
            break;
    }

    // Actualizar la interfaz
    cancelarEdicionInline();
    escribirMenuHtml();
    limpiarCanvas();
    draw();

    // Actualizar preview con setTimeout
    setTimeout(function () {
        if (typeof drawPreview === 'function') drawPreview();
    }, 100);
}

// Función para cancelar la edición inline
function cancelarEdicionInline() {
    if (elementoEditando) {
        // Si es un elemento nuevo (no tiene index), simplemente eliminarlo
        if (!elementoEditando.hasAttribute('data-index')) {
            elementoEditando.remove();
        }
        elementoEditando = null;
    }

    // Redibujar el menú para restaurar el estado original
    escribirMenuHtml();
}

// Función para eliminar un producto
function eliminarProductoInline(tipo, index) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        return;
    }

    switch (tipo) {
        case 1:
            arrayEntradas.splice(index, 1);
            break;
        case 2:
            arraySegundos.splice(index, 1);
            break;
        case 3:
            arrayExtras.splice(index, 1);
            break;
        case 4:
            arrayBebidas.splice(index, 1);
            break;
    }

    escribirMenuHtml();
    limpiarCanvas();
    draw();

    // Actualizar preview con setTimeout
    setTimeout(function () {
        if (typeof drawPreview === 'function') drawPreview();
    }, 100);
}

// Función para mostrar los botones de acción al hacer hover
function mostrarBotonesAccion(elemento) {
    // Solo si no está en modo edición
    if (elemento.getAttribute('data-posicion') === 'null') return;
    if (elemento.hasAttribute('data-editing')) return;

    const botonesDiv = elemento.querySelector('.botones-accion');
    if (botonesDiv) {
        botonesDiv.style.display = 'inline-block';
    }
}

// Función para ocultar los botones de acción al salir del hover
function ocultarBotonesAccion(elemento) {
    const botonesDiv = elemento.querySelector('.botones-accion');
    if (botonesDiv) {
        botonesDiv.style.display = 'none';
    }
}
