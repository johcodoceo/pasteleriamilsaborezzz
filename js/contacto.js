"use strict";

/*
 * CONTACTO: valida el mensaje, pero no lo envía ni almacena información personal.
 * Un envío real se incorporará cuando exista un backend.
 */
(function () {
    const formulario = document.querySelector("#formulario-contacto");

    if (!formulario) {
        return;
    }

    Formularios.conectar({
        formulario,
        validar: Validaciones.validarContacto,
        alValidar: function () {
            return {
                exito: true,
                mensaje:
                    "Tu mensaje es válido. " +
                    "En esta demostración no se envía a la pastelería.",
            };
        },
    });
})();
