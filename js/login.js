"use strict";

/* INICIO DE SESIÓN LOCAL DE DEMOSTRACIÓN, SIN PERMISOS REALES. */
(function () {
    const formulario = document.querySelector("#formulario-login");

    if (!formulario) {
        return;
    }

    const panel = document.querySelector("#sesion-activa");
    const controles = Formularios.conectar({
        formulario,
        validar: Validaciones.validarLogin,
        alValidar: CuentasDemo.iniciarSesion,
        alExito: function () {
            formulario.reset();
            controles.limpiar();
            mostrarSesion(true);
        },
    });

    function mostrarSesion(enfocar = false) {
        try {
            const usuario = CuentasDemo.obtenerSesion();
            formulario.hidden = Boolean(usuario);
            panel.hidden = !usuario;

            if (usuario) {
                panel.querySelector("[data-nombre-sesion]").textContent = usuario.nombre;
                panel.querySelector("[data-correo-sesion]").textContent = usuario.correo;

                if (enfocar) {
                    panel.querySelector("h2").focus();
                }
            }
        } catch (error) {
            formulario.hidden = false;
            panel.hidden = true;
            controles.mostrarResultado(error.message);
        }
    }

    document.querySelector("#cerrar-sesion").addEventListener("click", function () {
        try {
            const resultado = CuentasDemo.cerrarSesion();
            formulario.reset();
            controles.limpiar();
            mostrarSesion();
            controles.mostrarResultado(resultado.mensaje, true);
            formulario.elements.correo.focus();
        } catch (error) {
            Interfaz.notificar(error.message, true);
        }
    });

    window.addEventListener("pageshow", function (evento) {
        if (evento.persisted) {
            mostrarSesion();
        }
    });

    window.addEventListener("storage", function (evento) {
        if (evento.key === CuentasDemo.CLAVE_USUARIOS || evento.key === null) {
            mostrarSesion();
        }
    });

    mostrarSesion();
})();
