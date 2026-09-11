"use strict";

/*
 * COMPORTAMIENTO COMPARTIDO
 * Menú móvil, contador del carrito y mensajes para el usuario.
 */
window.Interfaz = (function () {
    const botonMenu = document.querySelector(".menu-toggle");
    const menu = document.querySelector("#menu-principal");
    const notificacion = document.querySelector("#notificacion");
    let temporizadorNotificacion;

    // 1. MENÚ MÓVIL

    function cerrarMenu() {
        menu.classList.remove("is-open");
        botonMenu.setAttribute("aria-expanded", "false");
    }

    if (botonMenu && menu) {
        document.documentElement.classList.add("js-ready");

        botonMenu.addEventListener("click", function () {
            const abierto = menu.classList.toggle("is-open");
            botonMenu.setAttribute("aria-expanded", String(abierto));
        });

        document.addEventListener("keydown", function (evento) {
            if (evento.key === "Escape" && menu.classList.contains("is-open")) {
                cerrarMenu();
                botonMenu.focus();
            }
        });
    }

    // 2. CONTADOR Y AVISOS DE PERSISTENCIA

    function actualizarCabecera() {
        const resumen = Carrito.obtenerResumen();
        const etiqueta = resumen.unidades === 1 ? "unidad" : "unidades";

        document.querySelectorAll("[data-contador-carrito]").forEach(function (contador) {
            contador.textContent = resumen.unidades;
        });

        document.querySelectorAll(".bag-link").forEach(function (enlace) {
            enlace.setAttribute(
                "aria-label",
                `Ver carrito: ${resumen.unidades} ${etiqueta}`,
            );
        });

        const aviso = document.querySelector("#aviso-almacenamiento");
        let mensaje = Carrito.obtenerAviso();

        if (window.location.protocol === "file:") {
            mensaje =
                "Para conservar los datos entre páginas, abre este proyecto " +
                "con Live Server. Revisa las instrucciones del archivo README.";
        }

        if (aviso) {
            aviso.textContent = mensaje;
            aviso.hidden = mensaje === "";
        }
    }

    // 3. MENSAJES DE LAS OPERACIONES

    function notificar(mensaje, esError = false) {
        if (!notificacion) {
            return;
        }

        window.clearTimeout(temporizadorNotificacion);
        notificacion.textContent = mensaje;
        notificacion.classList.toggle("is-error", esError);
        notificacion.classList.add("is-visible");

        temporizadorNotificacion = window.setTimeout(function () {
            notificacion.classList.remove("is-visible");
            notificacion.textContent = "";
        }, 6000);
    }

    function mostrarResultado(resultado) {
        notificar(resultado.mensaje, !resultado.exito);
        actualizarCabecera();
    }

    window.addEventListener("carrito:actualizado", actualizarCabecera);
    actualizarCabecera();

    return { notificar, mostrarResultado };
})();
