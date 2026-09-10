"use strict";

/*
 * Funciones compartidas por las vistas.
 * No guardan datos ni modifican el carrito.
 */
window.Utilidades = (function () {
    const formatoCLP = new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0,
    });

    function formatearPrecio(valor) {
        return formatoCLP.format(valor);
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
        escaparHTML,
    };
})();
