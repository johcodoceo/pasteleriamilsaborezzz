"use strict";

/*
 * RESUMEN DE BENEFICIOS
 * Presenta los descuentos sin cambiar productos, mensajes ni cantidades.
 * Se actualiza al cambiar el carrito, la cuenta, la sesión o el día comercial.
 */
(function () {
    const panel = document.querySelector("#resumen-beneficios");

    if (!panel) {
        return;
    }

    const identidad = document.querySelector("#beneficios-cuenta");
    const aviso = document.querySelector("#aviso-beneficios");
    const invitacion = document.querySelector("#invitacion-cumpleanos");
    let diaMostrado = "";

    function actualizarBeneficios() {
        diaMostrado = Beneficios.fechaHoy();
        const resumen = Beneficios.obtenerResumen(diaMostrado);

        document.querySelector("#resumen-subtotal").textContent =
            Utilidades.formatearPrecio(resumen.subtotal);
        document.querySelector("#resumen-descuento").textContent =
            Utilidades.formatearPrecio(resumen.descuentoTotal);
        document.querySelector("#resumen-total").textContent =
            Utilidades.formatearPrecio(resumen.total);

        identidad.textContent = resumen.usuario
            ? `Beneficios de ${resumen.usuario.nombre}.`
            : "Inicia sesión con tu cuenta para aplicar tus beneficios.";
        aviso.textContent = resumen.aviso;
        aviso.hidden = !resumen.aviso;

        const regalo = document.querySelector("#beneficio-cumpleanos");
        regalo.hidden = resumen.claveRegalo === null;
        regalo.textContent = resumen.claveRegalo === null ? "" :
            `Cumpleaños Duoc: una unidad de ${resumen.nombreRegalo} gratis ` +
            `(${Utilidades.formatearPrecio(resumen.descuentoCumpleanos)}).`;

        const promocion = document.querySelector("#beneficio-porcentaje");
        promocion.hidden = resumen.porcentaje === 0;
        promocion.textContent = resumen.porcentaje === 0 ? "" :
            `${resumen.motivoPorcentaje}: ${resumen.porcentaje}% de descuento ` +
            `(${Utilidades.formatearPrecio(resumen.descuentoPorcentaje)}).`;

        document.querySelector("#beneficios-aplicados").hidden =
            resumen.porcentaje === 0 && resumen.claveRegalo === null;
        document.querySelector("#sin-beneficios").hidden =
            !resumen.usuario || resumen.porcentaje > 0 || resumen.claveRegalo !== null || Boolean(resumen.aviso);

        const producto = Carrito.buscarProducto(Beneficios.REGLAS.codigoTortaCumpleanos);
        const puedeElegir = resumen.condiciones.porCumpleanos && resumen.claveRegalo === null;
        invitacion.hidden = !puedeElegir;
        document.querySelector("#estado-torta-cumpleanos").textContent = producto && producto.stock > 0
            ? "Hoy puedes agregar una torta TE001 y recibir una unidad gratis."
            : "Tu torta de cumpleaños TE001 no está disponible en este momento.";
        document.querySelector("#elegir-torta-cumpleanos").hidden = !producto || producto.stock === 0;

        for (const fila of document.querySelectorAll("[data-item-carrito]")) {
            const etiqueta = fila.querySelector("[data-regalo-cumpleanos]");
            etiqueta.hidden = fila.dataset.claveLinea !== resumen.claveRegalo;
        }
    }

    // La vista del carrito registra primero su evento y construye las filas antes de marcar el regalo.
    for (const evento of ["carrito:actualizado", "sesion:actualizada", "cuentas:actualizadas", "focus", "pageshow"]) {
        window.addEventListener(evento, actualizarBeneficios);
    }

    window.addEventListener("storage", function (evento) {
        if (evento.key === CuentasDemo.CLAVE_USUARIOS || evento.key === CuentasDemo.CLAVE_SESION || evento.key === null) {
            actualizarBeneficios();
        }
    });

    document.addEventListener("visibilitychange", function () {
        if (!document.hidden) {
            actualizarBeneficios();
        }
    });

    // Recalcular al pasar medianoche sin recargar; la consulta no escribe almacenamiento.
    window.setInterval(function () {
        if (!document.hidden && diaMostrado !== Beneficios.fechaHoy()) {
            actualizarBeneficios();
        }
    }, 60000);

    actualizarBeneficios();
})();
