"use strict";

/* REGISTRO PÚBLICO: siempre crea un perfil Cliente de demostración. */
(function () {
    const formulario = document.querySelector("#formulario-registro");

    if (!formulario) {
        return;
    }

    const ubicacion = UbicacionFormulario.conectar(
        formulario.elements.region,
        formulario.elements.comuna,
    );
    formulario.elements.nacimiento.max = Validaciones.fechaHoy();

    Formularios.conectar({
        formulario,
        validar: function (datos) {
            return Validaciones.validarRegistro(datos, window.REGIONES);
        },
        alValidar: function (datos) {
            return CuentasDemo.registrar(datos);
        },
        alExito: function (respuesta) {
            formulario.reset();
            ubicacion.actualizarComunas();
            formulario.hidden = true;

            const confirmacion = document.querySelector("#registro-completado");
            confirmacion.hidden = false;
            confirmacion.querySelector("[data-nombre-registrado]").textContent =
                respuesta.usuario.nombre;
            confirmacion.querySelector("h2").focus();
        },
    });
})();
