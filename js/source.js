//producto seleccionado
var productoSeleccionado = [];
//tipo producto
var tipoProducto = 1;
//precio del menu
var precioMenu = 7.5;
// arreglos de productos
var arrayEntradas = ['Ensalada de Palta', 'Sopa de casa', 'Huancaina'];
var arraySegundos = [['Arroz con pollo + crema', 7], ['Seco de carne con frejol', 8]];
var arrayExtras = [['Arroz chaufa', 7.5], ['Lomo Saltado', 8.50], ['Aeropuerto', 8]];//max 24 caracteres
var arrayBebidas = [['Inka kola persona', 2], ['Coca cola personal', 2]];
//selects de la carta
const selectEntradas = document.getElementById('selectEntrada');
const selectSegundos = document.getElementById('selectSegundo');
const selectExtras = document.getElementById('selectExtra');
const selectBebidas = document.getElementById('selectBebida');
//txt producto y precio
const txtProducto = document.getElementById('txtNombreProducto');
const txtPrecio = document.getElementById('txtPrecioProducto');
//botones de agregar producto y limpiar
const btnAgregarProducto = document.getElementById('btnAgregarProducto');
const btnLimpiar = document.getElementById('btnLimpiar');
//label precio
const labelPrecio = document.getElementById('lblPrecio');
//construyendo item menu
/*
    <li class="selectProducto list-group-item d-flex justify-content-between align-items-center">
        A list item
    </li>
*/
const itemMenu = document.createElement('li');
itemMenu.className = 'selectProducto list-group-item d-flex justify-content-between align-items-center';
itemMenu.setAttribute('onclick', 'seleccionarProducto(this)');
itemMenu.style.cursor = 'pointer';
itemMenu.style.marginBottom = '2px';
//itemMenu.style.borderTopWidth = '1px';
//construyendo item menu con precio
/*
    <li class="selectProducto list-group-item d-flex justify-content-between align-items-center">
        A list item
        <span class="badge bg-primary rounded-pill">14</span>
    </li>
*/
const itemMenuConPrecio = document.createElement('li');
itemMenuConPrecio.className = 'selectProducto list-group-item d-flex justify-content-between align-items-center';
itemMenuConPrecio.setAttribute('onclick', 'seleccionarProducto(this)');
itemMenuConPrecio.style.cursor = 'pointer';
itemMenuConPrecio.style.marginBottom = '2px';
//itemMenuConPrecio.style.borderTopWidth = '1px';
const spanPrecio = document.createElement('span');
spanPrecio.className = 'badge bg-success rounded-pill';
spanPrecio.style.fontSize = '14px';
//funcion para agregar y actualizar producto al menu
function agregarActualizarProducto(evt) {

    //llamando required del input nombreProducto
    if (btnAgregarProducto.value == 'Agregar') {
        if (txtProducto.checkValidity()) {
            evt.preventDefault();
            //validando tipo producto a agregar
            var nombreProducto = txtProducto.value;
            switch (tipoProducto) {
                case 1:
                    arrayEntradas.push(nombreProducto);
                    escribirMenuHtml();
                    break;
                case 2:
                    var precioProducto = 0;
                    arraySegundos.push([nombreProducto, precioProducto]);
                    escribirMenuHtml();
                    break;
                case 3:
                    if (txtPrecio.checkValidity()) {

                        var precioProducto = txtPrecio.value;
                        arrayExtras.push([nombreProducto, precioProducto]);
                        escribirMenuHtml();
                        txtPrecio.value = '';
                    }
                    else {
                        document.getElementById('frmMenu').reportValidity();
                    }
                    break;
                case 4:
                    if (txtPrecio.checkValidity()) {
                        var precioProducto = txtPrecio.value;
                        arrayBebidas.push([nombreProducto, precioProducto]);
                        escribirMenuHtml();
                        txtPrecio.value = '';
                    }
                    else {
                        document.getElementById('frmMenu').reportValidity();
                    }
                    break;
            }
            txtProducto.value = '';
            limpiarCanvas();
            draw();
        }
        else {
            document.getElementById('frmMenu').reportValidity();
        }
    }
    else if (btnAgregarProducto.value == "Actualizar") {
        if (txtProducto.checkValidity()) {
            evt.preventDefault();
            productoSeleccionado[1] = txtProducto.value;
            switch (tipoProducto) {
                case 1:
                    arrayEntradas[productoSeleccionado[3]] = productoSeleccionado[1];
                    break;
                case 2:
                    arraySegundos[productoSeleccionado[3]][0] = productoSeleccionado[1];
                    break;
                case 3:
                    if (txtPrecio.checkValidity()) {
                        arrayExtras[productoSeleccionado[3]][0] = productoSeleccionado[1];
                        productoSeleccionado[2] = txtPrecio.value;
                        arrayExtras[productoSeleccionado[3]][1] = productoSeleccionado[2];
                    }
                    else {
                        document.getElementById('frmMenu').reportValidity();
                    }
                    break;
                case 4:
                    if (txtPrecio.checkValidity()) {
                        arrayBebidas[productoSeleccionado[3]][0] = productoSeleccionado[1];
                        productoSeleccionado[2] = txtPrecio.value;
                        arrayBebidas[productoSeleccionado[3]][1] = productoSeleccionado[2];
                    }
                    else {
                        document.getElementById('frmMenu').reportValidity();
                    }
                    break;

            }
            btnAgregarProducto.value = 'Agregar';
            btnLimpiar.value = 'Limpiar';
            txtProducto.value = '';
            txtPrecio.value = '';
            escribirMenuHtml();
            limpiarCanvas();
            draw();
            indicarCambioSeleccionElemento(null, productoSeleccionado[0])
        }
        else {
            document.getElementById('frmMenu').reportValidity();
        }

    }

}

function cambiarTipoProducto(tipo) {
    tipoProducto = tipo;
    limpiarCancelarProducto(true);
    switch (tipo) {
        case 1:
            document.getElementById('lblPrecioProducto').style.display = 'none';
            document.getElementById('lblTextPrecioProducto').style.display = 'none';
            document.getElementById('txtPrecioProducto').required = false;
            break;

        case 2:
            document.getElementById('lblPrecioProducto').style.display = 'none';
            document.getElementById('lblTextPrecioProducto').style.display = 'none';
            document.getElementById('txtPrecioProducto').required = false;
            break;
        case 3:
            document.getElementById('lblPrecioProducto').style.display = '';
            document.getElementById('lblTextPrecioProducto').style.display = '';
            document.getElementById('txtPrecioProducto').required = true;
            break;
        case 4:
            document.getElementById('lblPrecioProducto').style.display = '';
            document.getElementById('lblTextPrecioProducto').style.display = '';
            document.getElementById('txtPrecioProducto').required = true;
            break;
    }
}


function indicarCambioSeleccionElemento(elemento, tipo) {
    if (tipo == null) {
        elemento.classList.add('gradient-border');
        setTimeout(function () {
            elemento.classList.remove('gradient-border');
        }, 2000);
    }
    else {
        switch (tipo) {
            case 1:
                for (var i = 0; i < selectEntradas.childNodes.length; i++) {
                    if (i == productoSeleccionado[3]) {
                        selectEntradas.childNodes[i].classList.add('gradient-border');
                        agregarTimeOut(selectEntradas.childNodes[i], 2000);
                    }
                }
                break;
            case 2:
                for (var i = 0; i < selectSegundos.childNodes.length; i++) {
                    if (i == productoSeleccionado[3]) {
                        selectSegundos.childNodes[i].classList.add('gradient-border');
                        agregarTimeOut(selectSegundos.childNodes[i], 2000);
                    }
                }
                break;
            case 3:
                for (var i = 0; i < selectExtras.childNodes.length; i++) {
                    if (i == productoSeleccionado[3]) {
                        selectExtras.childNodes[i].classList.add('gradient-border');
                        agregarTimeOut(selectExtras.childNodes[i], 2000);
                    }
                }
                break;
            case 4:
                for (var i = 0; i < selectBebidas.childNodes.length; i++) {
                    if (i == productoSeleccionado[3]) {
                        selectBebidas.childNodes[i].classList.add('gradient-border');
                        agregarTimeOut(selectBebidas.childNodes[i], 2000);
                    }
                }
                break;
        }
    }
}

function cambiarPrecio(e) {
    if (document.getElementById('frmCambiarPrecio').checkValidity()) {
        e.preventDefault();
        precioMenu = document.getElementById('inputPrecio').value;
        labelPrecio.innerText = '';
        labelPrecio.innerText = "S/. " + extraerUnidadDecima(precioMenu)[0] + '.' + extraerUnidadDecima(precioMenu)[1];
        /*labelPrecio.classList.add('gradient-border');
        setTimeout(function(){
            labelPrecio.classList.remove('gradient-border');
        },2000);
        */
        indicarCambioSeleccionElemento(labelPrecio, null);
        draw();
    }
    else {
        document.getElementById('frmCambiarPrecio').reportValidity();
    }

}
function limpiarSeccionMenu(limpio) {
    var menu = itemMenu.cloneNode(true);
    menu.innerText = 'Vacio...';
    menu.setAttribute('data-posicion', 'null');
    menu.setAttribute('data-nombreProducto', 'null');
    menu.setAttribute('data-precioProducto', 'null');
    menu.setAttribute('data-tipoProducto', 'null');
    selectEntradas.innerHTML = '';
    selectSegundos.innerHTML = '';
    selectExtras.innerHTML = '';
    selectBebidas.innerHTML = '';
    if (arrayEntradas.length == 0) {
        console.log('entradas');
        selectEntradas.appendChild(menu.cloneNode(true));
    }
    if (arraySegundos.length == 0) {
        console.log('segundos');
        selectSegundos.appendChild(menu.cloneNode(true));
    }
    if (arrayExtras.length == 0) {
        console.log('extras');
        selectExtras.appendChild(menu.cloneNode(true));
    }
    if (arrayBebidas.length == 0) {
        console.log('bebidas');
        selectBebidas.appendChild(menu.cloneNode(true));
    }
}

// Función para editar el precio del menú inline
function editarPrecioMenu() {
    const lblPrecio = document.getElementById('lblPrecio');
    const precioActual = precioMenu.toFixed(2);

    // Remover el onclick para evitar clicks accidentales durante la edición
    lblPrecio.removeAttribute('onclick');
    lblPrecio.style.cursor = 'default';

    // Crear input inline para editar
    lblPrecio.innerHTML = `
        <div class="d-inline-flex align-items-center gap-1">
            <span>S/.</span>
            <input type="number" id="inputPrecioMenu" class="form-control form-control-sm d-inline" 
                   value="${precioActual}" min="1" max="99" step="0.50" 
                   style="width: 80px; display: inline-block;">
            <button class="btn btn-sm btn-success" onclick="event.stopPropagation(); guardarPrecioMenu();" title="Guardar" style="padding: 0.15rem 0.4rem;">
                <i class="bi bi-check-lg"></i>
            </button>
            <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); cancelarPrecioMenu();" title="Cancelar" style="padding: 0.15rem 0.4rem;">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>
    `;

    // Enfocar el input
    setTimeout(() => {
        const input = document.getElementById('inputPrecioMenu');
        if (input) {
            input.focus();
            input.select();
        }
    }, 50);
}

// Función para guardar el nuevo precio del menú
function guardarPrecioMenu() {
    const input = document.getElementById('inputPrecioMenu');
    if (!input) return;

    const nuevoPrecio = parseFloat(input.value);
    if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
        alert('Ingresa un precio válido');
        return;
    }

    precioMenu = nuevoPrecio;
    restaurarVisualizacionPrecio();

    // Redibujar el canvas con el nuevo precio
    limpiarCanvas();
    draw();
    if (typeof drawPreview === 'function') drawPreview();
}

// Función para cancelar la edición del precio del menú
function cancelarPrecioMenu() {
    restaurarVisualizacionPrecio();
}

// Función auxiliar para restaurar la visualización normal del precio
function restaurarVisualizacionPrecio() {
    const lblPrecio = document.getElementById('lblPrecio');
    if (!lblPrecio) return;

    // Restaurar el contenido y eventos
    lblPrecio.innerHTML = `S/. ${precioMenu.toFixed(2)}`;
    lblPrecio.setAttribute('onclick', 'editarPrecioMenu();');
    lblPrecio.style.cursor = 'pointer';
    lblPrecio.setAttribute('title', 'Click para editar');
}

function escribirMenuHtml() {
    limpiarSeccionMenu(true);

    // Escribir Entradas
    for (var i = 0; i < arrayEntradas.length; i++) {
        var item = itemMenu.cloneNode(true);
        item.innerHTML = `
            <span class="producto-nombre">${arrayEntradas[i]}</span>
            <span class="botones-accion" style="display: none; white-space: nowrap;">
                <button class="btn btn-sm btn-primary" onclick="editarProductoInline(this.parentElement.parentElement, 1, ${i});" title="Editar" style="padding: 0.15rem 0.4rem; font-size: 0.7rem; margin-left: 5px;">
                    <i class="bi bi-pencil" style="font-size: 0.7rem;"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProductoInline(1, ${i});" title="Eliminar" style="padding: 0.15rem 0.4rem; font-size: 0.7rem; margin-left: 3px;">
                    <i class="bi bi-trash" style="font-size: 0.7rem;"></i>
                </button>
            </span>
        `;
        item.setAttribute('data-posicion', i);
        item.setAttribute('data-nombreProducto', arrayEntradas[i]);
        item.setAttribute('data-precioProducto', 0);
        item.setAttribute('data-tipoProducto', 1);
        item.setAttribute('onclick', 'seleccionarProducto(this); mostrarBotonesAccion(this);');
        item.setAttribute('onmouseleave', 'ocultarBotonesAccion(this);');

        if (productoSeleccionado.length > 0) {
            if (productoSeleccionado[0] == 1 && productoSeleccionado[3] == i) {
                item.style.boxShadow = '0px 0px 15px #bded12 inset';
            }
        }
        selectEntradas.appendChild(item);
    }

    // Escribir Segundos
    for (var i = 0; i < arraySegundos.length; i++) {
        var item = itemMenu.cloneNode(true);
        item.innerHTML = `
            <span class="producto-nombre">${arraySegundos[i][0]}</span>
            <span class="botones-accion" style="display: none; white-space: nowrap;">
                <button class="btn btn-sm btn-primary" onclick="editarProductoInline(this.parentElement.parentElement, 2, ${i});" title="Editar" style="padding: 0.15rem 0.4rem; font-size: 0.7rem; margin-left: 5px;">
                    <i class="bi bi-pencil" style="font-size: 0.7rem;"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProductoInline(2, ${i});" title="Eliminar" style="padding: 0.15rem 0.4rem; font-size: 0.7rem; margin-left: 3px;">
                    <i class="bi bi-trash" style="font-size: 0.7rem;"></i>
                </button>
            </span>
        `;
        item.setAttribute('data-posicion', i);
        item.setAttribute('data-nombreProducto', arraySegundos[i][0]);
        item.setAttribute('data-precioProducto', 0);
        item.setAttribute('data-tipoProducto', 2);
        item.setAttribute('onclick', 'seleccionarProducto(this); mostrarBotonesAccion(this);');
        item.setAttribute('onmouseleave', 'ocultarBotonesAccion(this);');

        if (productoSeleccionado.length > 0) {
            if (productoSeleccionado[0] == 2 && productoSeleccionado[3] == i) {
                item.style.boxShadow = '0px 0px 15px #bded12 inset';
            }
        }
        selectSegundos.appendChild(item);
    }

    // Escribir Extras
    for (var i = 0; i < arrayExtras.length; i++) {
        var item = itemMenuConPrecio.cloneNode(true);
        item.innerHTML = `
            <span class="producto-nombre">${arrayExtras[i][0]}</span>
            <span style="white-space: nowrap;">
                <span class="badge bg-success rounded-pill" style="font-size: 0.75rem; padding: 0.25em 0.5em;">S/. ${extraerUnidadDecima(arrayExtras[i][1])[0]}.${extraerUnidadDecima(arrayExtras[i][1])[1]}</span>
                <span class="botones-accion" style="display: none; white-space: nowrap;">
                    <button class="btn btn-sm btn-primary" onclick="editarProductoInline(this.parentElement.parentElement.parentElement, 3, ${i});" title="Editar" style="padding: 0.15rem 0.4rem; font-size: 0.7rem; margin-left: 5px;">
                        <i class="bi bi-pencil" style="font-size: 0.7rem;"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarProductoInline(3, ${i});" title="Eliminar" style="padding: 0.15rem 0.4rem; font-size: 0.7rem; margin-left: 3px;">
                        <i class="bi bi-trash" style="font-size: 0.7rem;"></i>
                    </button>
                </span>
            </span>
        `;
        item.setAttribute('data-posicion', i);
        item.setAttribute('data-nombreProducto', arrayExtras[i][0]);
        item.setAttribute('data-precioProducto', arrayExtras[i][1]);
        item.setAttribute('data-tipoProducto', 3);
        item.setAttribute('onclick', 'seleccionarProducto(this); mostrarBotonesAccion(this);');
        item.setAttribute('onmouseleave', 'ocultarBotonesAccion(this);');

        if (productoSeleccionado.length > 0) {
            if (productoSeleccionado[0] == 3 && productoSeleccionado[3] == i) {
                item.style.boxShadow = '0px 0px 15px #bded12 inset';
            }
        }
        selectExtras.appendChild(item);
    }

    // Escribir Bebidas
    for (var i = 0; i < arrayBebidas.length; i++) {
        var item = itemMenuConPrecio.cloneNode(true);
        item.innerHTML = `
            <span class="producto-nombre">${arrayBebidas[i][0]}</span>
            <span style="white-space: nowrap;">
                <span class="badge bg-success rounded-pill" style="font-size: 0.75rem; padding: 0.25em 0.5em;">S/. ${extraerUnidadDecima(arrayBebidas[i][1])[0]}.${extraerUnidadDecima(arrayBebidas[i][1])[1]}</span>
                <span class="botones-accion" style="display: none; white-space: nowrap;">
                    <button class="btn btn-sm btn-primary" onclick="editarProductoInline(this.parentElement.parentElement.parentElement, 4, ${i});" title="Editar" style="padding: 0.15rem 0.4rem; font-size: 0.7rem; margin-left: 5px;">
                        <i class="bi bi-pencil" style="font-size: 0.7rem;"></i>
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="eliminarProductoInline(4, ${i});" title="Eliminar" style="padding: 0.15rem 0.4rem; font-size: 0.7rem; margin-left: 3px;">
                        <i class="bi bi-trash" style="font-size: 0.7rem;"></i>
                    </button>
                </span>
            </span>
        `;
        item.setAttribute('data-posicion', i);
        item.setAttribute('data-nombreProducto', arrayBebidas[i][0]);
        item.setAttribute('data-precioProducto', arrayBebidas[i][1]);
        item.setAttribute('data-tipoProducto', 4);
        item.setAttribute('onclick', 'seleccionarProducto(this); mostrarBotonesAccion(this);');
        item.setAttribute('onmouseleave', 'ocultarBotonesAccion(this);');

        if (productoSeleccionado.length > 0) {
            if (productoSeleccionado[0] == 4 && productoSeleccionado[3] == i) {
                item.style.boxShadow = '0px 0px 15px #bded12 inset';
            }
        }
        selectBebidas.appendChild(item);
    }
}

function limpiarCanvas() {
    var canvasCarta = document.getElementById("canvasCarta");
    const ctx = canvasCarta.getContext('2d');
    ctx.clearRect(0, 0, 1123, 794);

}
function print() {
    var canvasElement = document.getElementById("canvasCarta");
    var imgData = canvasElement.toDataURL("image/png", 1);
    var pdf = new jsPDF('l');

    pdf.addImage(imgData, 'JPEG', 0, 0);
    pdf.save("download.pdf");
}
function extraerUnidadDecima(numero) {
    var unidadPrecio = Math.floor(numero);
    var decimaPrecio = ((numero - Math.floor(numero)) * 100).toFixed(0);
    if (decimaPrecio == 0) {
        decimaPrecio = "00";
    }
    return [unidadPrecio, decimaPrecio];
}

// Función para dividir texto largo en múltiples líneas
function wrapText(ctx, text, maxWidth) {
    var words = text.split(' ');
    var lines = [];
    var currentLine = words[0];

    for (var i = 1; i < words.length; i++) {
        var word = words[i];
        var width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

function seleccionarProducto(element) {
    if (element.getAttribute('data-posicion') != 'null') {
        //console.log('selecciono');
        var productos = document.getElementsByClassName('selectProducto');
        for (var i = 0; i < productos.length; i++) {
            productos[i].style.boxShadow = '';
        }
        element.style.boxShadow = '0px 0px 15px #bded12 inset';
        productoSeleccionado = [parseInt(element.getAttribute('data-tipoProducto')),
        element.getAttribute('data-nombreProducto'),
        parseFloat(element.getAttribute('data-precioProducto')),
        parseInt(element.getAttribute('data-posicion'))];//tipo, nombre, precio, posicion

    }

}

function animarSeleccionProducto() {
    $('#modalEditar').modal('show');
    $('#modalEditar').on('hidden.bs.modal', function () {
        /*selectEntradas.classList.add('gradient-border');
        selectSegundos.classList.add('gradient-border');
        selectExtras.classList.add('gradient-border');
        selectBebidas.classList.add('gradient-border');


        //quitar clase borde gradiente
        setTimeout(function(){
            selectEntradas.classList.remove('gradient-border')
            setTimeout(function(){
                selectSegundos.classList.remove('gradient-border')
                setTimeout(function(){
                    selectExtras.classList.remove('gradient-border')
                    setTimeout(function(){
                        selectBebidas.classList.remove('gradient-border')
                    },400);
                },600);
            },800);
        },1000);*/
        animarAgregarBordeGradiente();
        setTimeout(function () {
            animar2AgregarBordeGradiente();
        }, 860);
    });
}

function editarProducto() {

    if (productoSeleccionado.length > 0) {
        location.hash = '';
        location.hash = "#contenedorEditorCarta";
        txtProducto.focus();
        //document.getElementById('contenedorEditorCarta').setAttribute('tabindex', '0');
        switch (productoSeleccionado[0]) {
            case 1:
                document.getElementById('btnEntrada').click();
                break;
            case 2:
                document.getElementById('btnSegundo').click();
                break;
            case 3:
                document.getElementById('btnExtra').click();
                txtPrecio.value = productoSeleccionado[2];
                break;
            case 4:
                document.getElementById('btnBebida').click();
                txtPrecio.value = productoSeleccionado[2];
                break;

        }
        txtProducto.value = productoSeleccionado[1];
        btnAgregarProducto.value = 'Actualizar';
        btnLimpiar.value = 'Cancelar';
        document.getElementById('frmMenu').classList.add('gradient-border');

        setTimeout(function () {
            document.getElementById('frmMenu').classList.remove('gradient-border');
        }, 2000);
        //location.hash = '';
    }
    else {
        //agregar clase borde gradiente
        /*setTimeout(function(){
            selectEntradas.classList.add('gradient-border')
            setTimeout(function(){
                selectSegundos.classList.add('gradient-border')
                setTimeout(function(){
                    selectExtras.classList.add('gradient-border')
                    setTimeout(function(){
                        selectBebidas.classList.add('gradient-border')
                    },600);
                },500);
            },400);
        },300);*/
        /*selectEntradas.classList.add('gradient-border');
            selectSegundos.classList.add('gradient-border');
            selectExtras.classList.add('gradient-border');
            selectBebidas.classList.add('gradient-border');


            //quitar clase borde gradiente
            setTimeout(function(){
                selectEntradas.classList.remove('gradient-border')
                setTimeout(function(){
                    selectSegundos.classList.remove('gradient-border')
                    setTimeout(function(){
                        selectExtras.classList.remove('gradient-border')
                        setTimeout(function(){
                            selectBebidas.classList.remove('gradient-border')
                        },400);
                    },600);
                },800);
            },1000);*/
        document.getElementById('modalAlertaError').innerText = 'Seleccione un producto a Editar';
        /*$('#modalEditar').modal('show');
        $('#modalEditar').on('hidden.bs.modal', function () {
            
            animarAgregarBordeGradiente();
            setTimeout(function(){
                animar2AgregarBordeGradiente();
            },860);
        });*/
        animarSeleccionProducto();
        console.error('No hay producto seleccionado');
    }
}

function agregarTimeOut(element, tiempo) {
    setTimeout(function () {
        element.classList.remove('gradient-border');
    }, tiempo);
}
function animarAgregarBordeGradiente() {
    var hijosEntradas = selectEntradas.childNodes;
    var hijosSegundos = selectSegundos.childNodes;
    var hijosExtras = selectExtras.childNodes;
    var hijosBebidas = selectBebidas.childNodes;
    var segundos = 0;
    for (var hijoEntrada of hijosEntradas) {
        segundos += 50;
        hijoEntrada.classList.add('gradient-border');
        agregarTimeOut(hijoEntrada, segundos);
    }
    for (var hijoSegundo of hijosSegundos) {
        segundos += 60;
        hijoSegundo.classList.add('gradient-border');
        agregarTimeOut(hijoSegundo, segundos);
    }
    for (var hijoExtra of hijosExtras) {
        segundos += 80;
        hijoExtra.classList.add('gradient-border');
        agregarTimeOut(hijoExtra, segundos);
    }
    for (var hijoBebida of hijosBebidas) {
        segundos += 120;
        hijoBebida.classList.add('gradient-border');
        agregarTimeOut(hijoBebida, segundos);
    }
    console.log(segundos);
}
function agregarTimeOut2(element, tiempo) {
    setTimeout(function () {
        element.classList.add('gradient-border');
        setTimeout(function () {
            element.classList.remove('gradient-border');
        }, tiempo - 50);
    }, tiempo);
}
function reverseChildNodes(nodesChild) {
    var nodes = [];
    for (var i = nodesChild.length - 1; i >= 0; i--) {
        nodes.push(nodesChild[i]);
    }
    return nodes;
}
function animar2AgregarBordeGradiente() {
    var hijosEntradas = reverseChildNodes(selectEntradas.childNodes);
    var hijosSegundos = reverseChildNodes(selectSegundos.childNodes);
    var hijosExtras = reverseChildNodes(selectExtras.childNodes);
    var hijosBebidas = reverseChildNodes(selectBebidas.childNodes);
    var segundos = 0;
    for (var hijoBebida of hijosBebidas) {
        segundos += 80;
        agregarTimeOut2(hijoBebida, segundos);

    }
    //segundos = 0;
    for (var hijoExtra of hijosExtras) {
        segundos += 50;
        agregarTimeOut2(hijoExtra, segundos);
    }
    //segundos = 0;
    for (var hijoSegundo of hijosSegundos) {
        segundos += 50;
        agregarTimeOut2(hijoSegundo, segundos);
    }
    //segundos = 0;
    for (var hijoEntrada of hijosEntradas) {
        segundos += 50;
        agregarTimeOut2(hijoEntrada, segundos);
    }



}
function limpiarCancelarProducto(setDefault) {
    /*if (btnLimpiar.value == 'Cancelar' || setDefault) {
        btnLimpiar.value = 'Limpiar';
        btnAgregarProducto.value = 'Agregar';
        txtProducto.value = '';
        txtPrecio.value = '';
    }
    else if (btnLimpiar.value == 'Limpiar') {
        txtProducto.value = '';
        txtPrecio.value = '';
    }*/
}
function eliminarProducto() {
    if (productoSeleccionado.length > 0) {
        switch (productoSeleccionado[0]) {
            case 1:
                var arrayExtrasTemp = [];
                for (var i = 0; i < arrayEntradas.length; i++) {
                    if (i != productoSeleccionado[3]) {
                        arrayExtrasTemp.push(arrayEntradas[i]);
                    }
                }
                arrayEntradas = arrayExtrasTemp;
                productoSeleccionado = [];
                break;
            case 2:
                var arraySegundosTemp = [];
                for (var i = 0; i < arraySegundos.length; i++) {
                    if (i != productoSeleccionado[3]) {
                        arraySegundosTemp.push(arraySegundos[i]);
                    }
                }
                arraySegundos = arraySegundosTemp;
                productoSeleccionado = [];
                break;
            case 3:
                var arrayExtrasTemp = [];
                for (var i = 0; i < arrayExtras.length; i++) {
                    if (i != productoSeleccionado[3]) {
                        arrayExtrasTemp.push(arrayExtras[i]);
                    }
                }
                arrayExtras = arrayExtrasTemp;
                productoSeleccionado = [];
                break;
            case 4:
                var arrayBebidasTemp = [];
                for (var i = 0; i < arrayBebidas.length; i++) {
                    if (i != productoSeleccionado[3]) {
                        arrayBebidasTemp.push(arrayBebidas[i]);
                    }
                }
                arrayBebidas = arrayBebidasTemp;
                productoSeleccionado = [];
                break;

        }
        limpiarCanvas();
        draw();
        escribirMenuHtml();
        limpiarCancelarProducto(true);
    }
    else {
        document.getElementById('modalAlertaError').innerText = 'Seleccione un producto a Eliminar';
        animarSeleccionProducto();
    }
}
function subirPosicionProducto() {
    if (productoSeleccionado.length > 0) {
        switch (productoSeleccionado[0]) {
            case 1:
                if (productoSeleccionado[3] > 0) {
                    var arrayExtrasTemp = [];
                    for (var i = 0; i < arrayEntradas.length; i++) {
                        if (i == productoSeleccionado[3] - 1) {
                            arrayExtrasTemp.push(productoSeleccionado[1]);
                        }
                        else if (i == productoSeleccionado[3]) {
                            arrayExtrasTemp.push(arrayEntradas[i - 1]);
                        }
                        else {
                            arrayExtrasTemp.push(arrayEntradas[i]);
                        }
                    }
                    arrayEntradas = arrayExtrasTemp;
                    console.log(arrayEntradas);
                    productoSeleccionado[3]--;
                    limpiarCanvas();
                    draw();
                    if (typeof drawPreview === 'function') drawPreview();
                    escribirMenuHtml();
                    limpiarCancelarProducto(true);
                }
                break;
            case 2:
                if (productoSeleccionado[3] > 0) {
                    var arraySegundosTemp = [];
                    for (var i = 0; i < arraySegundos.length; i++) {
                        if (i == productoSeleccionado[3] - 1) {
                            arraySegundosTemp.push([productoSeleccionado[1], productoSeleccionado[2]]);
                        }
                        else if (i == productoSeleccionado[3]) {
                            arraySegundosTemp.push(arraySegundos[i - 1]);
                        }
                        else {
                            arraySegundosTemp.push(arraySegundos[i]);
                        }
                    }
                    arraySegundos = arraySegundosTemp;
                    console.log(arraySegundos);
                    productoSeleccionado[3]--;
                    limpiarCanvas();
                    draw();
                    if (typeof drawPreview === 'function') drawPreview();
                    escribirMenuHtml();
                    limpiarCancelarProducto(true);
                }
                break;
            case 3:
                if (productoSeleccionado[3] > 0) {
                    var arrayExtrasTemp = [];
                    for (var i = 0; i < arrayExtras.length; i++) {
                        if (i == productoSeleccionado[3] - 1) {
                            arrayExtrasTemp.push([productoSeleccionado[1], productoSeleccionado[2]]);
                        }
                        else if (i == productoSeleccionado[3]) {
                            arrayExtrasTemp.push(arrayExtras[i - 1]);
                        }
                        else {
                            arrayExtrasTemp.push(arrayExtras[i]);
                        }
                    }
                    arrayExtras = arrayExtrasTemp;
                    console.log(arrayExtras);
                    productoSeleccionado[3]--;
                    limpiarCanvas();
                    draw();
                    if (typeof drawPreview === 'function') drawPreview();
                    escribirMenuHtml();
                    limpiarCancelarProducto(true);
                }
                break;
            case 4:
                if (productoSeleccionado[3] > 0) {
                    var arrayBebidasTemp = [];
                    for (var i = 0; i < arrayBebidas.length; i++) {
                        if (i == productoSeleccionado[3] - 1) {
                            arrayBebidasTemp.push([productoSeleccionado[1], productoSeleccionado[2]]);
                        }
                        else if (i == productoSeleccionado[3]) {
                            arrayBebidasTemp.push(arrayBebidas[i - 1]);
                        }
                        else {
                            arrayBebidasTemp.push(arrayBebidas[i]);
                        }
                    }
                    arrayBebidas = arrayBebidasTemp;
                    console.log(arrayBebidas);
                    productoSeleccionado[3]--;
                    limpiarCanvas();
                    draw();
                    if (typeof drawPreview === 'function') drawPreview();
                    escribirMenuHtml();
                    limpiarCancelarProducto(true);
                }
                break;
        }
    }
    else {
        document.getElementById('modalAlertaError').innerText = 'Seleccione un producto a Mover';
        /*$('#modalEditar').modal('show');
        $('#modalEditar').on('hidden.bs.modal', function () {
            
            animarAgregarBordeGradiente();
            setTimeout(function(){
                animar2AgregarBordeGradiente();
            },860);
        });*/
        animarSeleccionProducto();
    }
}
function bajarPosicionProducto() {
    if (productoSeleccionado.length > 0) {
        switch (productoSeleccionado[0]) {
            case 1:
                if (productoSeleccionado[3] < arrayEntradas.length - 1) {
                    var arrayExtrasTemp = [];
                    for (var i = 0; i < arrayEntradas.length; i++) {
                        if (i == productoSeleccionado[3]) {
                            arrayExtrasTemp.push(arrayEntradas[i + 1]);
                        }
                        else if (i == productoSeleccionado[3] + 1) {
                            arrayExtrasTemp.push(productoSeleccionado[1]);
                        }
                        else {
                            arrayExtrasTemp.push(arrayEntradas[i]);
                        }
                    }
                    arrayEntradas = arrayExtrasTemp;
                    console.log(arrayEntradas);
                    productoSeleccionado[3]++;
                    limpiarCanvas();
                    draw();
                    if (typeof drawPreview === 'function') drawPreview();
                    escribirMenuHtml();
                    limpiarCancelarProducto(true);
                }
                break;
            case 2:
                if (productoSeleccionado[3] < arraySegundos.length - 1) {
                    var arraySegundosTemp = [];
                    for (var i = 0; i < arraySegundos.length; i++) {
                        if (i == productoSeleccionado[3]) {
                            arraySegundosTemp.push(arraySegundos[i + 1]);
                        }
                        else if (i == productoSeleccionado[3] + 1) {
                            arraySegundosTemp.push([productoSeleccionado[1], productoSeleccionado[2]]);
                        }
                        else {
                            arraySegundosTemp.push(arraySegundos[i]);
                        }
                    }
                    arraySegundos = arraySegundosTemp;
                    console.log(arraySegundos);
                    productoSeleccionado[3]++;
                    limpiarCanvas();
                    draw();
                    if (typeof drawPreview === 'function') drawPreview();
                    escribirMenuHtml();
                    limpiarCancelarProducto(true);
                }
                break;
            case 3:
                if (productoSeleccionado[3] < arrayExtras.length - 1) {
                    var arrayExtrasTemp = [];
                    for (var i = 0; i < arrayExtras.length; i++) {
                        if (i == productoSeleccionado[3]) {
                            arrayExtrasTemp.push(arrayExtras[i + 1]);
                        }
                        else if (i == productoSeleccionado[3] + 1) {
                            arrayExtrasTemp.push([productoSeleccionado[1], productoSeleccionado[2]]);
                        }
                        else {
                            arrayExtrasTemp.push(arrayExtras[i]);
                        }
                    }
                    arrayExtras = arrayExtrasTemp;
                    console.log(arrayExtras);
                    productoSeleccionado[3]++;
                    limpiarCanvas();
                    draw();
                    if (typeof drawPreview === 'function') drawPreview();
                    escribirMenuHtml();
                    limpiarCancelarProducto(true);
                }
                break;
            case 4:
                if (productoSeleccionado[3] < arrayBebidas.length - 1) {
                    var arrayBebidasTemp = [];
                    for (var i = 0; i < arrayBebidas.length; i++) {
                        if (i == productoSeleccionado[3]) {
                            arrayBebidasTemp.push(arrayBebidas[i + 1]);
                        }
                        else if (i == productoSeleccionado[3] + 1) {
                            arrayBebidasTemp.push([productoSeleccionado[1], productoSeleccionado[2]]);
                        }
                        else {
                            arrayBebidasTemp.push(arrayBebidas[i]);
                        }
                    }
                    arrayBebidas = arrayBebidasTemp;
                    console.log(arrayBebidas);
                    productoSeleccionado[3]++;
                    limpiarCanvas();
                    draw();
                    if (typeof drawPreview === 'function') drawPreview();
                    escribirMenuHtml();
                    limpiarCancelarProducto(true);
                }
                break;
        }
    }
    else {
        document.getElementById('modalAlertaError').innerText = 'Seleccione un producto a Mover';
        /*$('#modalEditar').modal('show');
        $('#modalEditar').on('hidden.bs.modal', function () {
            
            animarAgregarBordeGradiente();
            setTimeout(function(){
                animar2AgregarBordeGradiente();
            },860);
        });*/
        animarSeleccionProducto();
    }
}

function setPrecio(element) {
    var precio = element.innerHTML;
    console.log(precio);
    document.getElementById('inputPrecio').value = precio;
}

// Variable para guardar la imagen original
var imagenFondoOriginal = null;

// Función para inicializar la vista previa de la imagen de fondo
function inicializarVistaPrevia() {
    const vistaPreview = document.getElementById('vistaPreviewImagenFondo');
    if (vistaPreview && imagenFondo.src) {
        vistaPreview.src = imagenFondo.src;
        // Guardar la imagen original
        if (!imagenFondoOriginal) {
            imagenFondoOriginal = imagenFondo.src;
        }
    }
}

// Función para cambiar la imagen de fondo de la carta
function cambiarImagenFondo(event) {
    const archivo = event.target.files[0];

    if (archivo) {
        // Validar que sea una imagen
        if (!archivo.type.startsWith('image/')) {
            alert('Por favor selecciona un archivo de imagen válido');
            event.target.value = ''; // Limpiar el input
            return;
        }

        // Mostrar indicador de carga
        const loadingIndicator = document.getElementById('loadingIndicator');
        const vistaPreview = document.getElementById('vistaPreviewImagenFondo');

        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            // Actualizar la imagen de fondo con la nueva imagen seleccionada
            imagenFondo.src = e.target.result;

            // Esperar a que la imagen se cargue completamente antes de redibujar
            imagenFondo.onload = function () {
                // Actualizar vista previa
                if (vistaPreview) {
                    vistaPreview.src = e.target.result;
                    // Animación de actualización
                    vistaPreview.style.opacity = '0';
                    setTimeout(() => {
                        vistaPreview.style.transition = 'opacity 0.3s ease-in-out';
                        vistaPreview.style.opacity = '1';
                    }, 50);
                }

                // Ocultar indicador de carga
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }

                // Limpiar y redibujar el canvas con la nueva imagen
                limpiarCanvas();
                draw();

                // Actualizar el canvas de vista previa
                if (typeof drawPreview === 'function') {
                    drawPreview();
                }

                console.log('Imagen de fondo actualizada correctamente');

                // Mostrar mensaje de éxito
                mostrarMensajeExito('¡Imagen de fondo actualizada correctamente!');
            };

            imagenFondo.onerror = function () {
                if (loadingIndicator) {
                    loadingIndicator.style.display = 'none';
                }
                alert('Error al cargar la imagen. La imagen puede estar corrupta o ser demasiado grande.');
                event.target.value = ''; // Limpiar el input
            };
        };

        reader.onerror = function () {
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }
            alert('Error al leer el archivo. Por favor intenta con otro archivo.');
            event.target.value = ''; // Limpiar el input
        };

        // Leer el archivo como Data URL
        reader.readAsDataURL(archivo);
    }
}

// Función para restaurar la imagen de fondo original
function restaurarImagenPorDefecto() {
    if (imagenFondoOriginal) {
        const vistaPreview = document.getElementById('vistaPreviewImagenFondo');
        const loadingIndicator = document.getElementById('loadingIndicator');

        if (loadingIndicator) {
            loadingIndicator.style.display = 'block';
        }

        // Restaurar la imagen original
        imagenFondo.src = imagenFondoOriginal;

        imagenFondo.onload = function () {
            // Actualizar vista previa
            if (vistaPreview) {
                vistaPreview.src = imagenFondoOriginal;
                // Animación de actualización
                vistaPreview.style.opacity = '0';
                setTimeout(() => {
                    vistaPreview.style.transition = 'opacity 0.3s ease-in-out';
                    vistaPreview.style.opacity = '1';
                }, 50);
            }

            // Ocultar indicador de carga
            if (loadingIndicator) {
                loadingIndicator.style.display = 'none';
            }

            // Limpiar y redibujar el canvas
            limpiarCanvas();
            draw();

            // Actualizar el canvas de vista previa
            if (typeof drawPreview === 'function') {
                drawPreview();
            }

            console.log('Imagen de fondo restaurada a la original');

            // Mostrar mensaje de éxito
            mostrarMensajeExito('¡Imagen de fondo restaurada!');
        };

        // Limpiar el input file
        const inputFile = document.getElementById('inputImagenFondo');
        if (inputFile) {
            inputFile.value = '';
        }
    }
}

// Función para mostrar mensaje de éxito temporal
function mostrarMensajeExito(mensaje) {
    const contenedor = document.getElementById('contenedorVistaPrevia');
    if (contenedor) {
        const mensajeDiv = document.createElement('div');
        mensajeDiv.className = 'alert alert-success';
        mensajeDiv.style.cssText = 'position: absolute; top: 10px; right: 10px; padding: 8px 15px; font-size: 12px; z-index: 1000; animation: fadeIn 0.3s;';
        mensajeDiv.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${mensaje}`;

        contenedor.style.position = 'relative';
        contenedor.appendChild(mensajeDiv);

        // Remover el mensaje después de 3 segundos
        setTimeout(() => {
            mensajeDiv.style.animation = 'fadeOut 0.3s';
            setTimeout(() => {
                if (mensajeDiv.parentNode) {
                    mensajeDiv.parentNode.removeChild(mensajeDiv);
                }
            }, 300);
        }, 3000);
    }
}

const imagenCarta = new Image();
imagenCarta.src = "imagenes/imagenCarta.jpg";
function draw() {
    var BerlinSansFBDemiBold = new FontFace('BerlinSansFBDemiBold', 'url(fonts/BerlinSansFBDemiBold.ttf)');
    BerlinSansFBDemiBold.load().then(function (font) {
        document.fonts.add(font);
        var canvasCarta = document.getElementById("canvasCarta");
        if (canvasCarta.getContext) {

            var alturaText = 0;
            const ctx = canvasCarta.getContext('2d');

            ctx.drawImage(imagenFondo, -160, -100, 1430, 900);//530,50,200,200
            // --- 1. PREPARACIÓN Y MEDICIÓN ---
            // Definimos los textos que vamos a usar
            var textoSoles = "s/.";
            var textoEntero = extraerUnidadDecima(precioMenu)[0] + ".";
            var textoDecimal = extraerUnidadDecima(precioMenu)[1];

            // Medimos el ancho de la parte entera (que es la más grande y variable)
            ctx.font = "bold 40px Arial";
            var anchoTextoEntero = ctx.measureText(textoEntero).width;

            // Medimos el ancho de la parte decimal
            ctx.font = "bold 20px Arial";
            var anchoTextoDecimal = ctx.measureText(textoDecimal).width;

            // --- 2. CÁLCULO DE POSICIÓN Y TAMAÑO DEL CÍRCULO ---
            // Calculamos dónde empieza y dónde termina visualmente todo el precio
            var inicioX = 230; // Posición X donde dibujas el "s/."
            var posicionEntero = 275; // Posición X donde dibujas el número grande
            var finX = posicionEntero + anchoTextoEntero + anchoTextoDecimal; // Donde termina el decimal

            // El ancho total visual del bloque de precio
            var anchoTotalBloque = finX - inicioX;

            // El centro del círculo debe ser la mitad de ese bloque
            var centroXCirculo = inicioX + (anchoTotalBloque / 2);

            // El radio debe ser proporcional al ancho.
            // Math.max(45, ...) asegura que como mínimo mida 45px (para precios cortos como 7.50)
            // Si el precio es largo, usa la mitad del ancho total + un margen de 5px.
            var radioDinamico = Math.max(45, (anchoTotalBloque / 2) + 5);


            // --- 3. DIBUJAR EL CÍRCULO DE FONDO ---
            ctx.beginPath();
            ctx.arc(centroXCirculo, 180, radioDinamico, 0, 2 * Math.PI);
            ctx.fillStyle = "#bcd424";
            ctx.fill();


            // --- 4. DIBUJAR LOS TEXTOS (CAPA SUPERIOR) ---
            ctx.fillStyle = "black";

            // Dibujar "s/."
            ctx.font = "bold 20px Arial";
            ctx.fillText(textoSoles, inicioX, 190);

            // Dibujar Parte Entera
            ctx.font = "bold 40px Arial";
            ctx.fillText(textoEntero, posicionEntero, 190);

            // Dibujar Parte Decimal (usando el ancho calculado previamente para posicionarlo)
            ctx.font = "bold 20px Arial";
            ctx.fillText(textoDecimal, posicionEntero + anchoTextoEntero, 175);

            //escribiendo seccion de la carta entrada
            ctx.font = '800 30px BerlinSansFBDemiBold';
            ctx.fillStyle = 'black';
            ctx.fillText('ENTRADAS', 110, 270);//270,350
            //dibujando linea de separacion de seccion de la carta entrada
            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.lineWidth = 1;
            ctx.moveTo(105, 275);
            ctx.lineTo(265, 275);
            ctx.moveTo(110, 278);
            ctx.lineTo(260, 278);
            ctx.strokeStyle = '#000000';
            ctx.stroke();
            alturaText = 310;
            //escribiendo seccion de la carta entrada
            for (var i = 0; i < arrayEntradas.length; i++) {
                ctx.font = 'bold 20px arial';
                ctx.fillStyle = 'black';
                //alturaText = 310 + (i * 30);//380

                ctx.fillText(arrayEntradas[i], 50, alturaText);//300
                alturaText += 30;
            }
            //escribiendo seccion de la carta segundo

            ctx.font = '800 30px BerlinSansFBDemiBold';
            ctx.fillStyle = 'black';
            //alturaText += 50;//30
            alturaText += 20;
            ctx.fillText('SEGUNDOS', 110, alturaText);
            //dibujando linea de separacion de seccion de la carta segundo
            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.lineWidth = 1;
            alturaText += 5;
            ctx.moveTo(105, alturaText);
            ctx.lineTo(265, alturaText);
            ctx.moveTo(110, alturaText + 3);
            ctx.lineTo(260, alturaText + 3);
            ctx.strokeStyle = 'black';
            ctx.stroke();
            alturaText += 35;//25
            //escribiendo seccion de la carta segundo
            for (var i = 0; i < arraySegundos.length; i++) {
                ctx.font = 'bold 20px arial';
                ctx.fillStyle = 'black';
                ctx.fillText(arraySegundos[i][0], 50, alturaText);
                alturaText += 30;
            }
            //escribiendo seccion de la carta extras
            ctx.font = '800 30px BerlinSansFBDemiBold';
            ctx.fillStyle = 'black';
            ctx.fillText('EXTRAS', 510, 300);//380
            //dibujando linea de separacion de seccion de la carta extras
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.lineCap = "round";
            ctx.moveTo(505, 305);
            ctx.lineTo(620, 305);
            ctx.moveTo(510, 308);
            ctx.lineTo(615, 308);
            ctx.strokeStyle = 'black';
            ctx.stroke();
            //escribiendo elementos de la carta extras
            for (var i = 0; i < arrayExtras.length; i++) {
                //escribiendo nombre de los extras con word wrapping
                ctx.font = 'bold 20px arial';
                ctx.fillStyle = 'black';

                var nombreExtra = arrayExtras[i][0];
                var lines = wrapText(ctx, nombreExtra, 250); // max 250px de ancho
                var baseY = 340 + (i * 50); // Aumentado espaciado a 50px para 2 líneas

                // Dibujar cada línea deltext
                for (var lineIdx = 0; lineIdx < Math.min(lines.length, 2); lineIdx++) {
                    ctx.fillText(lines[lineIdx], 400, baseY + (lineIdx * 20));
                }

                // Precio alineado con la primera línea del texto
                var precioY = baseY;

                //dibujar elipse para el precio de los extras
                ctx.beginPath();
                ctx.ellipse(702, precioY - 7, 28, 13, 0, 0, 2 * Math.PI);
                ctx.fillStyle = '#C1D92E';
                ctx.fill();
                ctx.strokeStyle = 'green';
                ctx.stroke();

                //imprimiendo tipo moneda
                ctx.font = 'bold 10px arial';
                ctx.fillStyle = 'black';
                ctx.fillText("S/.", 678, precioY);
                //imprimiendo precio unidad
                ctx.font = 'bold 20px arial';
                ctx.fillText(extraerUnidadDecima(arrayExtras[i][1])[0] + ".", 690, precioY);
                ctx.font = 'bold 10px arial';

                //validando tamaño de la unidad
                if (extraerUnidadDecima(arrayExtras[i][1])[0].toString().length == 1) {
                    //imprimiendo precio decimal
                    ctx.fillText(extraerUnidadDecima(arrayExtras[i][1])[1], 706, precioY - 8);
                }
                else {
                    //imprimiendo precio decimal
                    ctx.fillText(extraerUnidadDecima(arrayExtras[i][1])[1], 714, precioY - 8);
                }

            }
            //escribiendo seccion de la carta bebidas
            ctx.font = '800 30px BerlinSansFBDemiBold';
            ctx.fillStyle = 'black';
            ctx.fillText('BEBIDAS', 880, 50);
            //dibujando linea de separacion de seccion de la carta bebidas
            ctx.beginPath();
            ctx.lineCap = "round";
            ctx.lineWidth = 1;
            ctx.moveTo(870, 55);
            ctx.lineTo(1005, 55);
            ctx.moveTo(875, 58);
            ctx.lineTo(1000, 58);
            ctx.strokeStyle = 'black';
            ctx.stroke();
            //escribiendo elementos de la carta bebidas
            for (var i = 0; i < arrayBebidas.length; i++) {
                //escribiendo nombre de bebidas con word wrapping
                ctx.font = 'bold 20px arial';
                ctx.fillStyle = 'black';

                var nombreBebida = arrayBebidas[i][0];
                var lines = wrapText(ctx, nombreBebida, 250); // max 250px de ancho
                var baseY = 90 + (i * 50); // Aumentado espaciado a 50px para 2 líneas

                // Dibujar cada línea del texto
                for (var lineIdx = 0; lineIdx < Math.min(lines.length, 2); lineIdx++) {
                    ctx.fillText(lines[lineIdx], 780, baseY + (lineIdx * 20));
                }

                // Precio alineado con la primera línea del texto
                var precioY = baseY;

                //dibujar elipse para el precio de las bebidas
                ctx.beginPath();
                ctx.ellipse(1082, precioY - 7, 28, 13, 0, 0, 2 * Math.PI);
                ctx.fillStyle = '#C1D92E';
                ctx.fill();
                ctx.strokeStyle = 'green';
                ctx.stroke();

                //imprimiendo tipo moneda
                ctx.font = 'bold 10px arial';
                ctx.fillStyle = 'black';
                ctx.fillText("S/.", 1058, precioY);
                //imprimiendo precio unidad
                ctx.font = 'bold 20px arial';
                ctx.fillText(extraerUnidadDecima(arrayBebidas[i][1])[0] + ".", 1070, precioY);
                ctx.font = 'bold 10px arial';

                //validando tamaño de la unidad
                if (extraerUnidadDecima(arrayBebidas[i][1])[0].toString().length == 1) {
                    //imprimiendo precio decimal
                    ctx.fillText(extraerUnidadDecima(arrayBebidas[i][1])[1], 1086, precioY - 8);
                }
                else {
                    //imprimiendo precio decimal
                    ctx.fillText(extraerUnidadDecima(arrayBebidas[i][1])[1], 1094, precioY - 8);
                }
            }

        } else {
            alert('Your browser does not support the HTML5 canvas tag.');
        }
    });



}
//funcion para obtener usuarios del api
async function obtenerUsuarios() {
    try {
        let data = {
            "nombreProducto": 'ensalada de palta',
            "precio": null,
            "imagenProducto": null,
            "tipoProducto": 1
        };
        const response = await fetch(
            "http://localhost:8000/carta/producto/",
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }
        );

        const respuesta = await response.json();
        //console.log(respuesta);
        return respuesta;
    } catch (error) {
        console.log(error);
    }
}


//window.onload = draw();
window.addEventListener('load', async () => {
    draw();
    escribirMenuHtml();
    // Inicializar la vista previa de la imagen de fondo
    inicializarVistaPrevia();
    /*data = await obtenerUsuarios();
    console.log(data);*/
});