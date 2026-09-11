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

    function formatearPrecio(valor) {
        return formatoCLP.format(valor);
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
        rutaImagen,
        escaparHTML,
    };
})();
