//producto seleccionado
var productoSeleccionado = [];
//tipo producto
var tipoProducto = 1;
//precio del menu
var precioMenu = 7.5;
// arreglos de productos
var arrayEntradas = ['Prueba','Prueba2','Prueba3'];
var arraySegundos = [['Prueba1',7],['Prueba2',8]];
var arrayExtras = [['Prueba1',7.5],['Lomo Saltado',88.99],['aaaaaaaaaaaaaaa',8]];//max 24 caracteres
var arrayBebidas = [['Prueba1',7],['Prueba2',88.54]];
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
itemMenu.setAttribute('onclick','seleccionarProducto(this)');
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
itemMenuConPrecio.setAttribute('onclick','seleccionarProducto(this)');
//itemMenuConPrecio.style.borderTopWidth = '1px';
const spanPrecio = document.createElement('span');
spanPrecio.className = 'badge bg-primary rounded-pill';

//funcion para agregar y actualizar producto al menu
function agregarActualizarProducto(evt){
    
    //llamando required del input nombreProducto
    if(btnAgregarProducto.value == 'Agregar'){
        if(txtProducto.checkValidity()){
            evt.preventDefault();
            //validando tipo producto a agregar
            var nombreProducto = txtProducto.value;
            switch(tipoProducto){
                case 1:
                    arrayEntradas.push(nombreProducto);
                    escribirMenuHtml();
                    break;
                case 2:
                    var precioProducto = 0;
                    arraySegundos.push([nombreProducto,precioProducto]);
                    escribirMenuHtml();
                    break;
                case 3:
                    if(txtPrecio.checkValidity()){
    
                        var precioProducto = txtPrecio.value;
                        arrayExtras.push([nombreProducto,precioProducto]);
                        escribirMenuHtml();
                        txtPrecio.value = '';
                    }
                    else{
                        document.getElementById('frmMenu').reportValidity();
                    }
                    break;
                case 4:
                    if(txtPrecio.checkValidity()){
                        var precioProducto = txtPrecio.value;
                        arrayBebidas.push([nombreProducto,precioProducto]);
                        escribirMenuHtml();
                        txtPrecio.value = '';
                    }
                    else{
                        document.getElementById('frmMenu').reportValidity();
                    }
                    break;
            }
            txtProducto.value = '';
            limpiarCanvas();
            draw();
        }
        else{
            document.getElementById('frmMenu').reportValidity();
        }
    }
    else if(btnAgregarProducto.value == "Actualizar"){
        if(txtProducto.checkValidity()){
            evt.preventDefault();
            productoSeleccionado[1] = txtProducto.value;
            switch(tipoProducto){
                case 1:
                    arrayEntradas[productoSeleccionado[3]] = productoSeleccionado[1];
                    break;
                case 2:
                    arraySegundos[productoSeleccionado[3]][0] = productoSeleccionado[1];
                    break;
                case 3:
                    if(txtPrecio.checkValidity()){
                        arrayExtras[productoSeleccionado[3]][0] = productoSeleccionado[1];
                        productoSeleccionado[2] = txtPrecio.value;
                        arrayExtras[productoSeleccionado[3]][1] = productoSeleccionado[2];
                    }
                    else{
                        document.getElementById('frmMenu').reportValidity();
                    }
                    break;
                case 4:
                    if(txtPrecio.checkValidity()){
                        arrayBebidas[productoSeleccionado[3]][0] = productoSeleccionado[1];
                        productoSeleccionado[2] = txtPrecio.value;
                        arrayBebidas[productoSeleccionado[3]][1] = productoSeleccionado[2];
                    }
                    else{
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
        }
        else{
            document.getElementById('frmMenu').reportValidity();
        }
        
    }
    
}

function cambiarTipoProducto(tipo){
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

function cambiarPrecio(){
    precioMenu = document.getElementById('inputPrecio').value;
    labelPrecio.innerText = '';
    labelPrecio.innerText = "s/." + extraerUnidadDecima(precioMenu)[0]+'.'+extraerUnidadDecima(precioMenu)[1];
    draw();
}
function limpiarSeccionMenu(limpio){
    var menu = itemMenu.cloneNode(true);
    menu.innerText= 'Vacio...';
    menu.setAttribute('data-posicion','null');
    menu.setAttribute('data-nombreProducto','null');
    menu.setAttribute('data-precioProducto','null');
    menu.setAttribute('data-tipoProducto','null');
    selectEntradas.innerHTML = '';
    selectSegundos.innerHTML = '';
    selectExtras.innerHTML = '';
    selectBebidas.innerHTML = '';
    if(arrayEntradas.length == 0){
        selectEntradas.appendChild(menu.cloneNode(true));
    }
    else if(arraySegundos.length == 0){
        selectSegundos.appendChild(menu.cloneNode(true));
    }
    else if(arrayExtras.length == 0){
        selectExtras.appendChild(menu.cloneNode(true));
    }
    else if(arrayBebidas.length == 0){
        selectBebidas.appendChild(menu.cloneNode(true));
    }
}

function escribirMenuHtml(){
    limpiarSeccionMenu(true);
    for(var i = 0; i < arrayEntradas.length; i++){
        var item = itemMenu.cloneNode(true);
        item.innerText = arrayEntradas[i];
        item.setAttribute('data-posicion',i);
        item.setAttribute('data-nombreProducto',arrayEntradas[i]);
        item.setAttribute('data-precioProducto',0);
        item.setAttribute('data-tipoProducto',1);
        if(productoSeleccionado.length > 0){
            if(productoSeleccionado[0] == 1 && productoSeleccionado[3] == i){
                console.log('entrada');
                //item.style.boxShadow = '0px 0px 15px green inset';
                item.setAttribute('style','box-shadow: 0px 0px 15px green inset;');
            }
        }
        selectEntradas.appendChild(item);
    }
    for(var i = 0; i < arraySegundos.length; i++){
        var item = itemMenu.cloneNode(true);
        item.innerText = arraySegundos[i][0];
        item.setAttribute('data-posicion',i);
        item.setAttribute('data-nombreProducto',arraySegundos[i][0]);
        item.setAttribute('data-precioProducto',0);
        item.setAttribute('data-tipoProducto',2);
        if(productoSeleccionado.length > 0){
            if(productoSeleccionado[0] == 2 && productoSeleccionado[3] == i){
                item.style.boxShadow = '0px 0px 15px green inset';
            }
        }
        selectSegundos.appendChild(item);
    }
    for(var i = 0; i < arrayExtras.length; i++){
        var item = itemMenuConPrecio.cloneNode(true);
        item.innerText = arrayExtras[i][0];
        item.setAttribute('data-posicion',i);
        item.setAttribute('data-nombreProducto',arrayExtras[i][0]);
        item.setAttribute('data-precioProducto',arrayExtras[i][1]);
        item.setAttribute('data-tipoProducto',3);
        if(productoSeleccionado.length > 0){
            if(productoSeleccionado[0] == 3 && productoSeleccionado[3] == i){
                item.style.boxShadow = '0px 0px 15px green inset';
            }
        }
        var spanItem = spanPrecio.cloneNode(true);
        spanItem.innerText = arrayExtras[i][1];
        item.appendChild(spanItem);
        selectExtras.appendChild(item);
    }
    for(var i = 0; i < arrayBebidas.length; i++){
        var item = itemMenuConPrecio.cloneNode(true);
        item.innerText = arrayBebidas[i][0];
        item.setAttribute('data-posicion',i);
        item.setAttribute('data-nombreProducto',arrayBebidas[i][0]);
        item.setAttribute('data-precioProducto',arrayBebidas[i][1]);
        item.setAttribute('data-tipoProducto',4);
        if(productoSeleccionado.length > 0){
            if(productoSeleccionado[0] == 4 && productoSeleccionado[3] == i){
                item.style.boxShadow = '0px 0px 15px green inset';
            }
        }
        var spanItem = spanPrecio.cloneNode(true);
        spanItem.innerText = arrayBebidas[i][1];
        item.appendChild(spanItem);
        selectBebidas.appendChild(item);
    }
}

function limpiarCanvas() {
    var canvasCarta = document.getElementById("canvasCarta");
    const ctx = canvasCarta.getContext('2d');
    ctx.clearRect(0, 0, 1123, 794);

}
function print(){
    var canvasElement = document.getElementById("canvasCarta");
    var imgData = canvasElement.toDataURL("image/png", 1);
    var pdf = new jsPDF('l');

    pdf.addImage(imgData, 'JPEG', 0, 0);
    pdf.save("download.pdf");
}
function extraerUnidadDecima(numero){
    var unidadPrecio = Math.floor(numero);
    var decimaPrecio = ((numero - Math.floor(numero)) * 100).toFixed(0);
    if(decimaPrecio == 0){
        decimaPrecio = "00";
    }
    return [unidadPrecio, decimaPrecio];
}
function seleccionarProducto(element){
    if(element.getAttribute('data-posicion') != 'null'){
        console.log('selecciono');
        var productos = document.getElementsByClassName('selectProducto');
        for(var i = 0; i < productos.length; i++){
            productos[i].style.boxShadow = '';
        }
        element.style.boxShadow = '0px 0px 15px green inset';
        productoSeleccionado = [parseInt(element.getAttribute('data-tipoProducto')),
                                element.getAttribute('data-nombreProducto'),
                                parseFloat(element.getAttribute('data-precioProducto')),
                                parseInt(element.getAttribute('data-posicion'))];//tipo, nombre, precio, posicion

    }
    
}
function editarProducto(){
    if(productoSeleccionado.length > 0){
        
        
        switch(productoSeleccionado[0]){
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
    }
    else{
        console.error('No hay producto seleccionado');
    }
}

function limpiarCancelarProducto(setDefault){
    if(btnLimpiar.value == 'Cancelar' || setDefault){
        btnLimpiar.value = 'Limpiar';
        btnAgregarProducto.value = 'Agregar';
        txtProducto.value = '';
        txtPrecio.value = '';
    }
    else if(btnLimpiar.value == 'Limpiar'){
        txtProducto.value = '';
        txtPrecio.value = '';
    }
}
function eliminarProducto(){
    if(productoSeleccionado.length > 0){
        switch(productoSeleccionado[0]){
            case 1:
                var arrayExtrasTemp = [];
                for(var i = 0; i < arrayEntradas.length; i++){
                    if(i != productoSeleccionado[3]){
                        arrayExtrasTemp.push(arrayEntradas[i]);
                    }
                }
                arrayEntradas = arrayExtrasTemp;
                productoSeleccionado = [];
                break;
            case 2:
                var arraySegundosTemp = [];
                for(var i = 0; i < arraySegundos.length; i++){
                    if(i != productoSeleccionado[3]){
                        arraySegundosTemp.push(arraySegundos[i]);
                    }
                }
                arraySegundos = arraySegundosTemp;
                productoSeleccionado = [];
                break;
            case 3:
                var arrayExtrasTemp = [];
                for(var i = 0; i < arrayExtras.length; i++){
                    if(i != productoSeleccionado[3]){
                        arrayExtrasTemp.push(arrayExtras[i]);
                    }
                }
                arrayExtras = arrayExtrasTemp;
                productoSeleccionado = [];
                break;
            case 4:
                var arrayBebidasTemp = [];
                for(var i = 0; i < arrayBebidas.length; i++){
                    if(i != productoSeleccionado[3]){
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
}
function draw(){
    var BerlinSansFBDemiBold = new FontFace('BerlinSansFBDemiBold', 'url(fonts/BerlinSansFBDemiBold.ttf)');
    BerlinSansFBDemiBold.load().then(function(font){
        document.fonts.add(font);
        var canvasCarta = document.getElementById("canvasCarta");
        if (canvasCarta.getContext) {
        
            var alturaText = 0;
            const ctx = canvasCarta.getContext('2d');

            ctx.drawImage(imagenFondo, -160, -100,1430,900);//530,50,200,200
            //imprimiendo precio del menu
            ctx.fillStyle = "black";
            ctx.font = "bold 20px Arial";
            ctx.fillText("s/.", 245, 190);
            ctx.font = "bold 40px Arial";
            //var unidadPrecio = Math.floor(precioMenu);
            //var decimaPrecio = ((precioMenu - Math.floor(precioMenu)) * 100).toFixed(0);
            var espacioDecimal = 265;
            ctx.fillText(extraerUnidadDecima(precioMenu)[0]+".", espacioDecimal, 190);//250,190
            ctx.font = "bold 20px Arial";
            espacioDecimal += 35;
            /*if(decimaPrecio == 0){
                decimaPrecio = "00";
            }*/
            ctx.fillText(extraerUnidadDecima(precioMenu)[1], espacioDecimal, 175);
            
            //escribiendo seccion de la carta entrada
            ctx.font = '800 30px BerlinSansFBDemiBold';
            ctx.fillStyle = 'black';
            ctx.fillText('ENTRADAS', 110, 270);//270,350
            //dibujando linea de separacion de seccion de la carta entrada
            ctx.beginPath();
            ctx.lineCap="round";
            ctx.lineWidth = 1;
            ctx.moveTo(105, 275);
            ctx.lineTo(265, 275);
            ctx.moveTo(110, 278);
            ctx.lineTo(260, 278);
            ctx.strokeStyle = '#000000';
            ctx.stroke();
            alturaText = 310;
            //escribiendo seccion de la carta entrada
            for(var i = 0; i < arrayEntradas.length; i++){
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
            ctx.lineCap="round";
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
            for(var i = 0; i < arraySegundos.length; i++){
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
            ctx.lineCap="round";
            ctx.moveTo(505, 305);
            ctx.lineTo(620, 305);
            ctx.moveTo(510, 308);
            ctx.lineTo(615, 308);
            ctx.strokeStyle = 'black';
            ctx.stroke();
            //escribiendo elementos de la carta extras
            for(var i = 0; i < arrayExtras.length; i++){
                //dibujar elipse para el precio de los extras
                ctx.beginPath();
                ctx.ellipse(702, 333 + (i * 30), 28, 13, 0, 0, 2 * Math.PI);
                ctx.fillStyle = '#C1D92E';
                ctx.fill();
                ctx.strokeStyle = 'green';
                ctx.stroke();
                //escribiendo nombre de los extras
                ctx.font = 'bold 20px arial';
                ctx.fillStyle = 'black';
                ctx.fillText(arrayExtras[i][0], 400,340+ (i * 30));
                
                var tamañoExtra = arrayExtras[i][0].length;
                var guiones = '';
                for(var j = 0; j < (25 - tamañoExtra); j++){
                    guiones += '. ';
                }
                //arrayExtras[i][1]
                // obtenieno unidad y decima del precio
                //var unidadExtra = Math.floor(arrayExtras[i][1]);
                //var decimaExtra = Math.floor((arrayExtras[i][1] - unidadExtra) * 100);
                //var decimaExtra = ((arrayExtras[i][1] - Math.floor(arrayExtras[i][1])) * 100).toFixed(0);
                //imprimiendo puntos
                ctx.fillText(guiones, 400+(tamañoExtra * 11),340+ (i * 30));
                //imprimiendo tipo moneda
                ctx.font = 'bold 10px arial';
                ctx.fillText("S/.", 678,340+ (i * 30));
                //imprimiendo precio unidad
                ctx.font = 'bold 20px arial';
                ctx.fillText(extraerUnidadDecima(arrayExtras[i][1])[0] + ".", 690,340+ (i * 30));
                ctx.font = 'bold 10px arial';
                //validando decima en 0
                /*if (decimaExtra == 0){
                    decimaExtra = "00";
                }*/
                //validando tamaño de la unidad
                if(extraerUnidadDecima(arrayExtras[i][1])[0].toString().length == 1){
                    //imprimiendo precio decimal
                    ctx.fillText(extraerUnidadDecima(arrayExtras[i][1])[1], 706,332+ (i * 30));//706
                }
                else{
                    //imprimiendo precio decimal
                    ctx.fillText(extraerUnidadDecima(arrayExtras[i][1])[1], 714,332+ (i * 30));
                }
                
            }
            //escribiendo seccion de la carta bebidas
            ctx.font = '800 30px BerlinSansFBDemiBold';
            ctx.fillStyle = 'black';
            ctx.fillText('BEBIDAS', 880, 50);
            //dibujando linea de separacion de seccion de la carta bebidas
            ctx.beginPath();
            ctx.lineCap="round";
            ctx.lineWidth = 1;
            ctx.moveTo(870, 55);
            ctx.lineTo(1005, 55);
            ctx.moveTo(875, 58);
            ctx.lineTo(1000, 58);
            ctx.strokeStyle = 'black';
            ctx.stroke();
            //escribiendo elementos de la carta bebidas
            for(var i = 0; i < arrayBebidas.length; i++){
                //dibujar elipse para el precio de las bebidas
                ctx.beginPath();
                ctx.ellipse(1082, 83 + (i * 30), 28, 13, 0, 0, 2 * Math.PI);
                ctx.fillStyle = '#C1D92E';
                ctx.fill();
                ctx.strokeStyle = 'green';
                ctx.stroke();
                ctx.font = 'bold 20px arial';
                ctx.fillStyle = 'black';
                ctx.fillText(arrayBebidas[i][0], 780,90+ (i * 30));
                var tamañoBebida = arrayBebidas[i][0].length;
                var guiones = '';
                for(var j = 0; j < (25 - tamañoBebida); j++){
                    guiones += '. ';
                }
                //obtenieno unidad y decima del precio
                //var unidadBebida = Math.floor(arrayBebidas[i][1]);
                //var decimaBebida = Math.floor((arrayBebidas[i][1] - unidadBebida) * 100);
                //var decimaBebida = ((arrayBebidas[i][1] - Math.floor(arrayBebidas[i][1])) * 100).toFixed(0);
                //imprimiendo puntos
                ctx.fillText(guiones, 780+(tamañoBebida * 11),90+ (i * 30));
                //imprimiendo tipo moneda
                ctx.font = 'bold 10px arial';
                ctx.fillText("S/.", 1058,90+ (i * 30));
                //imprimiendo precio unidad
                ctx.font = 'bold 20px arial';
                ctx.fillText(extraerUnidadDecima(arrayBebidas[i][1])[0] + ".", 1070,90+ (i * 30));
                ctx.font = 'bold 10px arial';
                //validando decima en 0
                /*if (decimaBebida == 0){
                    decimaBebida = "00";
                }*/
                //validando tamaño de la unidad
                if(extraerUnidadDecima(arrayBebidas[i][1])[0].toString().length == 1){
                    //imprimiendo precio decimal
                    ctx.fillText(extraerUnidadDecima(arrayBebidas[i][1])[1], 1086,82+ (i * 30));//1086
                }
                else{
                    //imprimiendo precio decimal
                    ctx.fillText(extraerUnidadDecima(arrayBebidas[i][1])[1], 1094,82+ (i * 30));
                }
            }
            
        } else {
            alert('Your browser does not support the HTML5 canvas tag.');
        }
    });

    

}

//window.onload = draw();
window.addEventListener('load',()=>{
    draw();
    escribirMenuHtml();	
});