"use strict";

/*
 * Funciones compartidas por las vistas.
 * No guardan datos ni modifican el carrito.
 */
window.Utilidades = (function () {
    const formatoCLP = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
    const formatoFecha = new Intl.DateTimeFormat("es-CL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        timeZone: "UTC",
    });

    function formatearPrecio(valor) {
        return formatoCLP.format(valor);
    }

    function formatearFecha(valor) {
        // Una fecha sin hora debe mostrar el mismo día en cualquier zona horaria.
        const fecha = new Date(`${valor}T00:00:00Z`);
        return Number.isNaN(fecha.getTime()) ? "Sin fecha" : formatoFecha.format(fecha);
    }

    function rutaImagen(ruta, prefijo = "") {
        return ruta.startsWith("assets/") ? prefijo + ruta : ruta;
    }

    // Evita interpretar nombres o descripciones como etiquetas HTML.
    function escaparHTML(texto) {
        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;",
        };

        return String(texto).replace(/[&<>"']/g, function (caracter) {
            return caracteres[caracter];
        });
    }

    return {
        formatearPrecio,
        formatearFecha,
        rutaImagen,
        escaparHTML,
    };
})();
