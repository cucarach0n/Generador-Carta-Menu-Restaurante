/**
 * Utilidad para exportar canvas a PDF
 * Usa jsPDF para generar archivos PDF del menú
 */

import { jsPDF } from 'jspdf';

/**
 * Exporta un canvas a PDF
 * @param {string} canvasId - ID del elemento canvas a exportar
 * @param {string} fileName - Nombre del archivo PDF (sin extensión)
 * @returns {Promise<void>}
 */
export async function exportMenuToPDF(canvasId, fileName = 'menu') {
    try {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            throw new Error(`Canvas con id "${canvasId}" no encontrado`);
        }

        // Convertir canvas a imagen
        const imgData = canvas.toDataURL('image/png', 1.0);

        // Crear PDF en orientación horizontal (landscape)
        // Tamaño A4 landscape: 297mm x 210mm
        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        // Obtener dimensiones del PDF
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        // Agregar imagen al PDF (ajustada al tamaño de la página)
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

        // Descargar PDF
        pdf.save(`${fileName}.pdf`);

        return Promise.resolve();
    } catch (error) {
        console.error('Error al exportar PDF:', error);
        return Promise.reject(error);
    }
}

/**
 * Exporta canvas a imagen PNG
 * @param {string} canvasId - ID del elemento canvas
 * @param {string} fileName - Nombre del archivo (sin extensión)
 */
export function exportMenuToPNG(canvasId, fileName = 'menu') {
    try {
        const canvas = document.getElementById(canvasId);
        if (!canvas) {
            throw new Error(`Canvas con id "${canvasId}" no encontrado`);
        }

        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `${fileName}.png`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    } catch (error) {
        console.error('Error al exportar PNG:', error);
        throw error;
    }
}
