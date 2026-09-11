"use strict";

/*
 * PRESENTACIÓN COMPARTIDA DE FORMULARIOS
 * Aquí viven los eventos, mensajes, contadores y estados de envío.
 * Las reglas de negocio permanecen en validaciones.js.
 */
window.Formularios = (function () {
    function leerDatos(formulario) {
        return Object.fromEntries(new FormData(formulario).entries());
    }

    function conectar(opciones) {
        const formulario = opciones.formulario;
        const resultado = formulario.querySelector("[data-resultado]");
        const campos = Array.from(formulario.querySelectorAll("[data-validar]"));
        const visitados = new Set();
        let intentoEnvio = false;
        let procesando = false;

        function mostrarCampo(nombre, mensaje) {
            const campo = formulario.elements.namedItem(nombre);
            const aviso = formulario.querySelector(`[data-error-para="${nombre}"]`);

            if (campo && aviso) {
                aviso.textContent = mensaje || "";
                aviso.hidden = !mensaje;
                campo.setAttribute("aria-invalid", String(Boolean(mensaje)));
            }
        }

        function pintarErrores(errores, todos = false) {
            for (const campo of campos) {
                if (todos || intentoEnvio || visitados.has(campo.name)) {
                    mostrarCampo(campo.name, errores[campo.name]);
                }
            }
        }

        function mostrarResultado(mensaje, exito = false) {
            resultado.textContent = mensaje;
            resultado.hidden = !mensaje;
            resultado.classList.toggle("is-success", exito === true);
            resultado.classList.toggle("is-error", exito === false);
        }

        function enfocarError(errores) {
            const primero = campos.find(function (campo) {
                return errores[campo.name] && !campo.disabled;
            });

            if (primero) {
                primero.focus();
            }
        }

        function actualizarContadores() {
            formulario.querySelectorAll("[data-contador]").forEach(function (contador) {
                const campo = formulario.elements.namedItem(contador.dataset.contador);
                contador.textContent = `${campo.value.length} / ${campo.maxLength}`;
            });
        }

        function limpiar() {
            visitados.clear();
            intentoEnvio = false;
            pintarErrores({}, true);
            mostrarResultado("");
            formulario.querySelectorAll("[data-mostrar-clave]").forEach(function (boton) {
                document.getElementById(boton.dataset.mostrarClave).type = "password";
                boton.textContent = "Mostrar";
                boton.setAttribute("aria-pressed", "false");
            });
            actualizarContadores();
        }

        // Se valida al salir de un campo y al corregirlo. No se llena la pantalla
        // de errores de campos que el usuario todavía no ha intentado completar.
        for (const campo of campos) {
            campo.addEventListener("blur", function () {
                visitados.add(campo.name);
                pintarErrores(opciones.validar(leerDatos(formulario)));
            });
        }

        function validarCambios(evento) {
            if (!evento.target.matches("[data-validar]")) {
                return;
            }

            mostrarResultado("");
            actualizarContadores();
            pintarErrores(opciones.validar(leerDatos(formulario)));
        }

        formulario.addEventListener("input", validarCambios);
        formulario.addEventListener("change", validarCambios);

        formulario.addEventListener("submit", async function (evento) {
            evento.preventDefault();

            if (procesando) {
                return;
            }

            intentoEnvio = true;
            const datos = leerDatos(formulario);
            const errores = opciones.validar(datos);
            pintarErrores(errores, true);

            if (Object.keys(errores).length > 0) {
                mostrarResultado("Revisa los campos señalados antes de continuar.");
                enfocarError(errores);
                return;
            }

            procesando = true;
            formulario.setAttribute("aria-busy", "true");
            const controles = Array.from(formulario.elements);
            const estados = controles.map(function (control) {
                return control.disabled;
            });
            controles.forEach(function (control) {
                control.disabled = true;
            });
            mostrarResultado("Validando tus datos…", null);
            let respuesta;

            try {
                respuesta = await opciones.alValidar(datos);
            } catch (error) {
                respuesta = {
                    exito: false,
                    mensaje: error.message || "No se pudo completar la operación. Inténtalo otra vez.",
                };
            } finally {
                controles.forEach(function (control, indice) {
                    control.disabled = estados[indice];
                });
                procesando = false;
                formulario.removeAttribute("aria-busy");
            }

            pintarErrores(respuesta.errores || {}, true);
            mostrarResultado(respuesta.mensaje, respuesta.exito);

            if (respuesta.exito && opciones.alExito) {
                opciones.alExito(respuesta);
            } else if (respuesta.errores) {
                enfocarError(respuesta.errores);
            } else {
                resultado.focus();
            }
        });

        formulario.querySelectorAll("[data-mostrar-clave]").forEach(function (boton) {
            boton.addEventListener("click", function () {
                const campo = document.getElementById(boton.dataset.mostrarClave);
                const mostrar = campo.type === "password";
                campo.type = mostrar ? "text" : "password";
                boton.textContent = mostrar ? "Ocultar" : "Mostrar";
                boton.setAttribute("aria-pressed", String(mostrar));
            });
        });

        actualizarContadores();
        return { leerDatos: () => leerDatos(formulario), mostrarResultado, limpiar };
    }

    return { leerDatos, conectar };
})();
