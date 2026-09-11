"use strict";

/*
 * CAMPO DE MENSAJE COMPARTIDO
 * Detalle y carrito reutilizan el contador y los errores del mismo campo.
 * Las reglas de negocio están en validaciones.js; aquí solo se presenta su resultado.
 */
window.Personalizacion = (function () {
    function conectar(contenedor, obtenerProducto) {
        const campo = contenedor.querySelector("[data-mensaje-input]");
        const contador = contenedor.querySelector("[data-contador-mensaje]");
        const error = contenedor.querySelector("[data-error-mensaje]");
        const ayuda = contenedor.querySelector("[data-ayuda-mensaje]");
        const maximo = Validaciones.MAX_MENSAJE_TORTA;

        campo.maxLength = maximo;
        ayuda.textContent = `Hasta ${maximo} caracteres, en una sola línea. Sin costo adicional.`;

        function actualizarContador() {
            contador.textContent = `${campo.value.length}/${maximo}`;
        }

        function validar() {
            const mensajeError = Validaciones.validarMensajeTorta(obtenerProducto(), campo.value);
            error.textContent = mensajeError;
            campo.setAttribute("aria-invalid", String(Boolean(mensajeError)));
            return mensajeError;
        }

        function restablecer(mensaje = "") {
            campo.value = mensaje;
            error.textContent = "";
            campo.removeAttribute("aria-invalid");
            actualizarContador();
        }

        campo.addEventListener("input", function () {
            actualizarContador();
            validar();
        });
        campo.addEventListener("blur", validar);
        restablecer(campo.value);

        return {
            campo,
            validar,
            restablecer,
            leer: function () {
                return campo.value;
            },
        };
    }

    return { conectar };
})();
