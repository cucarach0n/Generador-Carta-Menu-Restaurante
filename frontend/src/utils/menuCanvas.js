/**
 * Utilidad para renderizar menús en canvas
 * Basado en preview.js del sistema original
 */

/**
 * Función para dividir texto largo en múltiples líneas
 * @param {CanvasRenderingContext2D} ctx - Contexto del canvas
 * @param {string} text - Texto a dividir
 * @param {number} maxWidth - Ancho máximo en pixels
 * @returns {string[]} Array de líneas
 */
export function wrapText(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
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

/**
 * Extraer parte entera y decimal de un número (precio)
 * @param {number} numero - Número a procesar
 * @returns {[string, string]} [parte entera + ".", parte decimal]
 */
export function extractPriceDigits(numero) {
    const unidadPrecio = Math.floor(numero);
    let decimaPrecio = ((numero - Math.floor(numero)) * 100).toFixed(0);
    if (decimaPrecio === "0") {
        decimaPrecio = "00";
    }
    return [unidadPrecio.toString() + ".", decimaPrecio];
}

/**
 * Renderiza el menú completo en un canvas
 * @param {string} canvasId - ID del elemento canvas
 * @param {Object} menuData - Datos del menú
 * @param {HTMLImageElement} backgroundImage - Imagen de fondo cargada
 * @param {number} scale - Escala de renderizado (default: 1 para canvas completo, 0.6 para preview)
 * @param {Object} titulos - Títulos personalizados de secciones (opcional)
 * @param {Object} visibilidad - Objeto de visibilidad { mostrar_entradas, mostrar_segundos, mostrar_extras, mostrar_bebidas } (opcional)
 * @param {Object} posiciones - Coordenadas personalizadas para cada elemento { precio: {x,y}, entradas: {x,y}, ... } (opcional)
 */
export function drawMenuCanvas(canvasId, menuData, backgroundImage, scale = 1, titulos = null, visibilidad = null, posiciones = null) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas con id "${canvasId}" no encontrado`);
        return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error('Contexto 2d no disponible');
        return;
    }

    // Títulos por defecto si no se proporcionan
    const titulosFinales = {
        entradas: titulos?.entradas || 'ENTRADAS',
        segundos: titulos?.segundos || 'SEGUNDOS',
        extras: titulos?.extras || 'EXTRAS',
        bebidas: titulos?.bebidas || 'BEBIDAS'
    };

    // Visibilidad por defecto (todo visible)
    const mostrar = {
        entradas: visibilidad?.mostrar_entradas !== false,
        segundos: visibilidad?.mostrar_segundos !== false,
        extras: visibilidad?.mostrar_extras !== false,
        bebidas: visibilidad?.mostrar_bebidas !== false
    };

    // Posiciones por defecto si no se proporcionan
    const pos = posiciones || {
        precio: { x: 282, y: 95 },
        entradas: { x: 41, y: 263 },
        segundos: { x: 38, y: 448 },
        extras: { x: 419, y: 265 },
        bebidas: { x: 789, y: 52 }
    };

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar imagen de fondo si está disponible
    if (backgroundImage && backgroundImage.complete) {
        ctx.save();
        ctx.scale(scale, scale);
        ctx.drawImage(backgroundImage, -160, -100, 1430, 900);
        ctx.restore();
    }

    // Organizar items por categoría
    const entradas = menuData.items?.filter(item => item.categoria === 'entrada') || [];
    const segundos = menuData.items?.filter(item => item.categoria === 'segundo') || [];
    const extras = menuData.items?.filter(item => item.categoria === 'extra') || [];
    const bebidas = menuData.items?.filter(item => item.categoria === 'bebida') || [];

    // Aplicar escala
    ctx.save();
    ctx.scale(scale, scale);

    // ---- DIBUJAR PRECIO ----
    // NUEVO: pos.precio.y ahora es el TOP del círculo, no el centro
    const [textoEntero, textoDecimal] = extractPriceDigits(menuData.precio || 0);

    ctx.font = "bold 40px Arial";
    const anchoTextoEntero = ctx.measureText(textoEntero).width;
    ctx.font = "bold 20px Arial";
    const anchoTextoDecimal = ctx.measureText(textoDecimal).width;

    const inicioX = pos.precio.x - 50;
    const posicionEntero = pos.precio.x - 5;
    const finX = posicionEntero + anchoTextoEntero + anchoTextoDecimal;
    const anchoTotalBloque = finX - inicioX;
    const centroXCirculo = inicioX + (anchoTotalBloque / 2);
    const radioDinamico = Math.max(45, (anchoTotalBloque / 2) + 5);

    // Calcular centro Y desde el top: centerY = top + radius
    const centroYCirculo = pos.precio.y + radioDinamico;

    // Círculo amarillo del precio
    ctx.beginPath();
    ctx.arc(centroXCirculo, centroYCirculo, radioDinamico, 0, 2 * Math.PI);
    ctx.fillStyle = "#bcd424";
    ctx.fill();

    // Texto del precio (centrado verticalmente en el círculo)
    ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial";
    ctx.fillText("s/.", inicioX, centroYCirculo + 10);
    ctx.font = "bold 40px Arial";
    ctx.fillText(textoEntero, posicionEntero, centroYCirculo + 10);
    ctx.font = "bold 20px Arial";
    ctx.fillText(textoDecimal, posicionEntero + anchoTextoEntero, centroYCirculo - 5);

    // ---- ENTRADAS (izquierda) ----
    // NUEVO: pos.entradas.y es el TOP del título, no el baseline
    let alturaText = pos.entradas.y;
    if (mostrar.entradas) {
        ctx.font = '800 30px Arial';
        ctx.fillStyle = 'black';

        const startX = pos.entradas.x;
        const itemWidth = 300;  // Ancho de los items
        const titleText = titulosFinales.entradas;
        const textWidth = ctx.measureText(titleText).width;
        const centerX = startX + itemWidth / 2;  // Centro sobre el ancho de items

        // Dibujar título: baseline = top + 30 (altura del font)
        const titleBaseline = alturaText + 30;
        ctx.textAlign = 'center';
        ctx.fillText(titleText, centerX, titleBaseline);

        // Línea separadora centrada sobre el texto
        ctx.beginPath();
        ctx.lineWidth = 1;
        const linePadding = 5;
        ctx.moveTo(centerX - (textWidth / 2) - linePadding, titleBaseline + 5);
        ctx.lineTo(centerX + (textWidth / 2) + linePadding, titleBaseline + 5);
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.textAlign = 'left'; // Restaurar alineación

        alturaText = titleBaseline + 40;  // Items empiezan después del título
        ctx.font = 'bold 16px arial';
        const itemX = pos.entradas.x; // Items start at left edge
        for (let i = 0; i < Math.min(entradas.length, 5); i++) {
            const lines = wrapText(ctx, entradas[i].nombre, itemWidth);
            for (let j = 0; j < lines.length; j++) {
                ctx.fillText(lines[j], itemX, alturaText);
                alturaText += 22;
            }
            alturaText += 8; // Espacio extra entre items
        }
    }

    // ---- SEGUNDOS ----
    // NUEVO: pos.segundos.y es el TOP del título, SIEMPRE
    if (mostrar.segundos) {
        ctx.font = '800 30px Arial';
        const startX = pos.segundos.x;
        const itemWidth = 300;
        const titleText = titulosFinales.segundos;
        const textWidth = ctx.measureText(titleText).width;
        const centerX = startX + itemWidth / 2;

        // Dibujar título: baseline = top + 30
        const titleBaseline = pos.segundos.y + 30;
        ctx.textAlign = 'center';
        ctx.fillText(titleText, centerX, titleBaseline);

        ctx.beginPath();
        const linePadding = 5;
        ctx.moveTo(centerX - (textWidth / 2) - linePadding, titleBaseline + 5);
        ctx.lineTo(centerX + (textWidth / 2) + linePadding, titleBaseline + 5);
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.textAlign = 'left';

        let alturaItemsSegundos = titleBaseline + 40;
        ctx.font = 'bold 16px arial';
        const itemX = pos.segundos.x; // Items start at left edge
        for (let i = 0; i < Math.min(segundos.length, 4); i++) {
            const lines = wrapText(ctx, segundos[i].nombre, itemWidth);
            for (let j = 0; j < lines.length; j++) {
                ctx.fillText(lines[j], itemX, alturaItemsSegundos);
                alturaItemsSegundos += 22;
            }
            alturaItemsSegundos += 8;
        }
    }

    // ---- EXTRAS (centro derecha) ----
    // NUEVO: pos.extras.y es el TOP del título
    if (mostrar.extras) {
        ctx.font = '800 30px Arial';
        ctx.fillStyle = 'black';
        const startX = pos.extras.x;
        const itemWidth = 250;
        const titleText = titulosFinales.extras;
        const textWidth = ctx.measureText(titleText).width;
        const centerX = startX + itemWidth / 2;

        // Dibujar título: baseline = top + 30
        const titleBaseline = pos.extras.y + 30;
        ctx.textAlign = 'center';
        ctx.fillText(titleText, centerX, titleBaseline);

        ctx.beginPath();
        const linePadding = 5;
        ctx.moveTo(centerX - (textWidth / 2) - linePadding, titleBaseline + 5);
        ctx.lineTo(centerX + (textWidth / 2) + linePadding, titleBaseline + 5);
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.textAlign = 'left';

        let posY = titleBaseline + 40;
        ctx.font = 'bold 16px arial';
        const itemX = pos.extras.x;

        for (let i = 0; i < Math.min(extras.length, 3); i++) {
            const item = extras[i];
            const nombre = item.nombre || 'Sin nombre';
            const precio = item.precio ? `s/.${parseFloat(item.precio).toFixed(2)}` : '';

            const lines = wrapText(ctx, nombre, itemWidth);
            const startItemY = posY;  // Guardar Y inicial para alinear precio

            // Dibujar texto del item
            for (let j = 0; j < lines.length; j++) {
                ctx.fillText(lines[j], itemX, posY);
                posY += 22;
            }

            // Dibujar círculo de precio alineado con primera línea de texto
            if (precio) {
                ctx.fillStyle = 'black';
                ctx.font = 'bold 14px arial';
                const radioPrecio = 18;
                const precioX = itemX + itemWidth - radioPrecio * 2;
                const precioY = startItemY - 4;  // Alineado con primera línea

                ctx.beginPath();
                ctx.arc(precioX + radioPrecio, precioY, radioPrecio, 0, 2 * Math.PI);
                ctx.fillStyle = '#bcd424';
                ctx.fill();

                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.fillText(precio, precioX + radioPrecio, precioY + 5);
                ctx.textAlign = 'left';
            }

            posY += 10;  // Espacio entre items
        }
    }

    // ---- BEBIDAS (arriba a la derecha) ----
    // NUEVO: pos.bebidas.y es el TOP del título
    if (mostrar.bebidas) {
        ctx.font = '800 30px Arial';
        ctx.fillStyle = 'black';
        const startX = pos.bebidas.x;
        const itemWidth = 250;
        const titleText = titulosFinales.bebidas;
        const textWidth = ctx.measureText(titleText).width;
        const centerBebidasX = startX + itemWidth / 2;

        // Dibujar título: baseline = top + 30
        const titleBaseline = pos.bebidas.y + 30;
        ctx.textAlign = 'center';
        ctx.fillText(titleText, centerBebidasX, titleBaseline);

        ctx.beginPath();
        const linePadding = 5;
        ctx.moveTo(centerBebidasX - (textWidth / 2) - linePadding, titleBaseline + 5);
        ctx.lineTo(centerBebidasX + (textWidth / 2) + linePadding, titleBaseline + 5);
        ctx.strokeStyle = '#000000';
        ctx.stroke();
        ctx.textAlign = 'left';

        let posY = titleBaseline + 40;
        ctx.font = 'bold 16px arial';
        const itemX = pos.bebidas.x;

        for (let i = 0; i < Math.min(bebidas.length, 2); i++) {
            const item = bebidas[i];
            const nombre = item.nombre || 'Sin nombre';
            const precio = item.precio ? `s/.${parseFloat(item.precio).toFixed(2)}` : '';

            const lines = wrapText(ctx, nombre, itemWidth);
            const startItemY = posY;  // Guardar Y inicial para alinear precio

            // Dibujar texto del item
            for (let j = 0; j < lines.length; j++) {
                ctx.fillText(lines[j], itemX, posY);
                posY += 22;
            }

            // Dibujar círculo de precio alineado con primera línea de texto
            if (precio) {
                ctx.fillStyle = 'black';
                ctx.font = 'bold 14px arial';
                const radioPrecio = 18;
                const precioX = itemX + itemWidth - radioPrecio * 2;
                const precioY = startItemY - 4;  // Alineado con primera línea

                ctx.beginPath();
                ctx.arc(precioX + radioPrecio, precioY, radioPrecio, 0, 2 * Math.PI);
                ctx.fillStyle = '#bcd424';
                ctx.fill();

                ctx.fillStyle = 'black';
                ctx.textAlign = 'center';
                ctx.fillText(precio, precioX + radioPrecio, precioY + 5);
                ctx.textAlign = 'left';
            }

            posY += 10;  // Espacio entre items
        }
    }

    ctx.restore();
}

/**
 * Cargar imagen de fondo desde URL
 * @param {string} imageUrl - URL de la imagen
 * @returns {Promise<HTMLImageElement>} Promesa con la imagen cargada
 */
export function loadBackgroundImage(imageUrl) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Error cargando imagen: ${imageUrl}`));
        img.src = imageUrl;
    });
}
