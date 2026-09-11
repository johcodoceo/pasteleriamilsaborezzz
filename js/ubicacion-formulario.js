"use strict";

/*
 * SELECTORES DEPENDIENTES DE REGIÓN Y COMUNA
 * Reutilizable en registro y en el próximo formulario administrativo.
 */
window.UbicacionFormulario = (function () {
    function crearOpcion(valor, nombre) {
        const opcion = document.createElement("option");
        opcion.value = valor;
        opcion.textContent = nombre;
        return opcion;
    }

    function conectar(campoRegion, campoComuna) {
        campoRegion.replaceChildren(crearOpcion("", "Selecciona tu región"));

        for (const region of window.REGIONES) {
            campoRegion.append(crearOpcion(region.codigo, region.nombre));
        }

        function actualizarComunas() {
            const region = window.REGIONES.find(function (item) {
                return item.codigo === campoRegion.value;
            });

            const mensaje = region ? "Selecciona tu comuna" : "Primero selecciona una región";
            campoComuna.replaceChildren(crearOpcion("", mensaje));
            campoComuna.disabled = !region;

            if (region) {
                const comunas = [...region.comunas].sort(function (a, b) {
                    return a.nombre.localeCompare(b.nombre, "es");
                });

                for (const comuna of comunas) {
                    campoComuna.append(crearOpcion(comuna.codigo, comuna.nombre));
                }
            }
        }

        // Cambiar de región siempre borra la comuna anterior.
        campoRegion.addEventListener("change", actualizarComunas);
        actualizarComunas();

        return { actualizarComunas };
    }

    return { conectar };
})();
