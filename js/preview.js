// Función para dividir texto largo en múltiples líneas
function wrapTextPreview(ctx, text, maxWidth) {
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

// Función para dibujar vista previa en miniatura del menú
function drawPreview() {
    console.log('drawPreview iniciado');
    const canvasPreview = document.getElementById('canvasPreview');
    if (!canvasPreview) {
        console.error('Canvas preview no encontrado!');
        return;
    }

    const ctx = canvasPreview.getContext('2d');
    if (!ctx) {
        console.error('Contexto 2d no disponible!');
        return;
    }

    // Limpiar el canvas
    ctx.clearRect(0, 0, canvasPreview.width, canvasPreview.height);

    // Escala: el canvas principal es 1123x794, el preview es 450x318
    // Factor de escala aproximado: 0.4
    const escala = 0.4;

    // Dibujar la imagen de fondo escalada
    if (imagenFondo && imagenFondo.complete) {
        ctx.save();
        ctx.scale(escala, escala);
        ctx.drawImage(imagenFondo, -160, -100, 1430, 900);
        ctx.restore();
    }

    // Dibujar elementos del menú de forma simplificada
    ctx.save();
    ctx.scale(escala, escala);

    // Dibujar círculo del precio
    const textoEntero = extraerUnidadDecima(precioMenu)[0] + ".";
    const textoDecimal = extraerUnidadDecima(precioMenu)[1];

    ctx.font = "bold 40px Arial";
    const anchoTextoEntero = ctx.measureText(textoEntero).width;
    ctx.font = "bold 20px Arial";
    const anchoTextoDecimal = ctx.measureText(textoDecimal).width;

    const inicioX = 230;
    const posicionEntero = 275;
    const finX = posicionEntero + anchoTextoEntero + anchoTextoDecimal;
    const anchoTotalBloque = finX - inicioX;
    const centroXCirculo = inicioX + (anchoTotalBloque / 2);
    const radioDinamico = Math.max(45, (anchoTotalBloque / 2) + 5);

    // Círculo amarillo del precio
    ctx.beginPath();
    ctx.arc(centroXCirculo, 180, radioDinamico, 0, 2 * Math.PI);
    ctx.fillStyle = "#bcd424";
    ctx.fill();

    // Precio
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial";
    ctx.fillText("s/.", inicioX, 190);
    ctx.font = "bold 40px Arial";
    ctx.fillText(textoEntero, posicionEntero, 190);
    ctx.font = "bold 20px Arial";
    ctx.fillText(textoDecimal, posicionEntero + anchoTextoEntero, 175);

    // Dibujar secciones (simplificado)
    let alturaText = 270;

    // ENTRADAS
    ctx.font = '800 30px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('ENTRADAS', 110, alturaText);

    // Línea separadora
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.moveTo(105, alturaText + 5);
    ctx.lineTo(265, alturaText + 5);
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    alturaText += 40;
    ctx.font = 'bold 16px arial';
    for (let i = 0; i < Math.min(arrayEntradas.length, 5); i++) {
        ctx.fillText(arrayEntradas[i].substring(0, 20), 50, alturaText);
        alturaText += 25;
    }

    // SEGUNDOS
    alturaText += 15;
    ctx.font = '800 30px Arial';
    ctx.fillText('SEGUNDOS', 110, alturaText);

    ctx.beginPath();
    ctx.moveTo(105, alturaText + 5);
    ctx.lineTo(265, alturaText + 5);
    ctx.stroke();

    alturaText += 35;
    ctx.font = 'bold 16px arial';
    for (let i = 0; i < Math.min(arraySegundos.length, 4); i++) {
        ctx.fillText(arraySegundos[i][0].substring(0, 20), 50, alturaText);
        alturaText += 25;
    }

    // EXTRAS
    ctx.font = '800 30px Arial';
    ctx.fillText('EXTRAS', 510, 300);

    ctx.beginPath();
    ctx.moveTo(505, 305);
    ctx.lineTo(620, 305);
    ctx.stroke();

    let alturaExtra = 340;
    ctx.font = 'bold 16px arial';
    for (let i = 0; i < Math.min(arrayExtras.length, 5); i++) {
        var nombreExtra = arrayExtras[i][0];
        var lines = wrapTextPreview(ctx, nombreExtra, 180); // max 180px
        var baseY = alturaExtra + (i * 30);

        // Dibujar nombre (max 2 líneas)
        for (var lineIdx = 0; lineIdx < Math.min(lines.length, 2); lineIdx++) {
            ctx.fillText(lines[lineIdx], 400, baseY + (lineIdx * 14));
        }

        // Precio alineado con primera línea
        ctx.fillText('S/. ' + arrayExtras[i][1], 600, baseY);
    }
    alturaExtra = 340 + (Math.min(arrayExtras.length, 5) * 30);

    // BEBIDAS (arriba a la derecha)
    ctx.font = '800 30px Arial';
    ctx.fillText('BEBIDAS', 880, 50);

    ctx.beginPath();
    ctx.moveTo(870, 55);
    ctx.lineTo(1005, 55);
    ctx.stroke();

    let alturaBebidas = 90;
    ctx.font = 'bold 16px arial';
    for (let i = 0; i < Math.min(arrayBebidas.length, 5); i++) {
        var nombreBebida = arrayBebidas[i][0];
        var lines = wrapTextPreview(ctx, nombreBebida, 180); // max 180px
        var baseY = alturaBebidas + (i * 30);

        // Dibujar nombre (max 2 líneas)
        for (var lineIdx = 0; lineIdx < Math.min(lines.length, 2); lineIdx++) {
            ctx.fillText(lines[lineIdx], 780, baseY + (lineIdx * 14));
        }

        // Precio alineado con primera línea
        ctx.fillText('S/. ' + arrayBebidas[i][1], 970, baseY);
    }
    alturaBebidas = 90 + (Math.min(arrayBebidas.length, 5) * 30);

    ctx.restore();
}

// Llamar a drawPreview cuando se carga la página
window.addEventListener('load', function () {
    // Esperar a que la imagen de fondo esté cargada
    if (imagenFondo && imagenFondo.complete) {
        drawPreview();
    } else if (imagenFondo) {
        imagenFondo.addEventListener('load', drawPreview);
    }
});
