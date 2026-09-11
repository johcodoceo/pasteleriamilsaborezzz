"use strict";

/*
 * VISTA DEL CARRITO
 * Crea filas a partir del <template> de carrito.html y atiende sus controles.
 * Los cálculos y la persistencia pertenecen a carrito.js.
 */
(function () {
    const lista = document.querySelector("#lista-carrito");

    if (!lista) {
        return;
    }

    const plantilla = document.querySelector("#plantilla-item-carrito");
    const contenido = document.querySelector("#carrito-con-productos");
    const estadoVacio = document.querySelector("#carrito-vacio");
    const tituloVacio = document.querySelector("#titulo-carrito-vacio");
    const botonVaciar = document.querySelector("#vaciar-carrito");

    // 1. CONSTRUCCIÓN Y ACTUALIZACIÓN DE FILAS

    function actualizarFila(fila, item) {
        fila.dataset.codigo = item.codigo;

        const enlace = fila.querySelector("[data-nombre]");
        enlace.textContent = item.nombre;
        enlace.href = `producto.html?id=${encodeURIComponent(item.codigo)}`;

        fila.querySelector("[data-categoria]").textContent = item.categoria;
        fila.querySelector("[data-precio]").textContent =
            Utilidades.formatearPrecio(item.precio);
        fila.querySelector("[data-subtotal]").textContent =
            Utilidades.formatearPrecio(item.subtotal);

        const campo = fila.querySelector("[data-cantidad]");
        const identificador = encodeURIComponent(item.codigo);
        campo.id = `cantidad-${identificador}`;
        campo.value = item.cantidad;
        campo.max = item.limite;
        campo.setAttribute("aria-describedby", `error-${identificador}`);
        campo.removeAttribute("aria-invalid");

        const etiqueta = fila.querySelector("label");
        etiqueta.htmlFor = campo.id;
        etiqueta.textContent = `Cantidad de ${item.nombre}`;

        const error = fila.querySelector("[data-error]");
        error.id = `error-${identificador}`;
        error.textContent = "";

        const botonRestar = fila.querySelector('[data-accion="restar"]');
        const botonSumar = fila.querySelector('[data-accion="sumar"]');
        const botonEliminar = fila.querySelector('[data-accion="eliminar"]');

        botonRestar.disabled = item.cantidad === 1;
        botonSumar.disabled = item.cantidad >= item.limite;
        botonRestar.setAttribute("aria-label", `Quitar una unidad de ${item.nombre}`);
        botonSumar.setAttribute("aria-label", `Sumar una unidad de ${item.nombre}`);
        botonEliminar.setAttribute("aria-label", `Eliminar ${item.nombre} del carrito`);
    }

    function renderizarCarrito() {
        const resumen = Carrito.obtenerResumen();
        const estaVacio = resumen.detalle.length === 0;
        const focoAnterior = document.activeElement;
        const filas = Array.from(lista.children);
        const indiceFoco = filas.findIndex(function (fila) {
            return fila.contains(focoAnterior);
        });

        // Se conservan las filas existentes para no perder el foco al escribir.
        for (const fila of filas) {
            const sigueEnCarrito = resumen.detalle.some(function (item) {
                return item.codigo === fila.dataset.codigo;
            });

            if (!sigueEnCarrito) {
                fila.remove();
            }
        }

        for (const item of resumen.detalle) {
            let fila = Array.from(lista.children).find(function (actual) {
                return actual.dataset.codigo === item.codigo;
            });

            if (!fila) {
                fila = plantilla.content.firstElementChild.cloneNode(true);
                lista.append(fila);
            }

            actualizarFila(fila, item);
        }

        contenido.hidden = estaVacio;
        estadoVacio.hidden = !estaVacio;

        document.querySelector("#resumen-unidades").textContent = resumen.unidades;
        document.querySelector("#resumen-total").textContent =
            Utilidades.formatearPrecio(resumen.total);

        // Al eliminar una fila con el teclado, el foco pasa a otra acción útil.
        if (indiceFoco !== -1 && !focoAnterior.isConnected) {
            if (estaVacio) {
                tituloVacio.focus();
            } else {
                const indiceSiguiente = Math.min(indiceFoco, lista.children.length - 1);
                lista.children[indiceSiguiente]
                    .querySelector('[data-accion="eliminar"]')
                    .focus();
            }
        }
    }

    // 2. VALIDACIÓN DE LA CANTIDAD ESCRITA

    function aplicarCantidad(campo) {
        const fila = campo.closest("[data-item-carrito]");
        const cantidad = Number(campo.value);
        const resultado = Carrito.cambiarCantidad(fila.dataset.codigo, cantidad);

        if (!resultado.exito) {
            fila.querySelector("[data-error]").textContent = resultado.mensaje;
            campo.setAttribute("aria-invalid", "true");
        }

        Interfaz.mostrarResultado(resultado);
    }

    lista.addEventListener("change", function (evento) {
        if (evento.target.matches("[data-cantidad]")) {
            aplicarCantidad(evento.target);
        }
    });

    lista.addEventListener("keydown", function (evento) {
        if (evento.key === "Enter" && evento.target.matches("[data-cantidad]")) {
            evento.preventDefault();
            aplicarCantidad(evento.target);
        }
    });

    lista.addEventListener("input", function (evento) {
        if (evento.target.matches("[data-cantidad]")) {
            evento.target.removeAttribute("aria-invalid");
            evento.target.closest("[data-item-carrito]")
                .querySelector("[data-error]").textContent = "";
        }
    });

    // 3. BOTONES SUMAR, RESTAR, ELIMINAR Y VACIAR

    lista.addEventListener("click", function (evento) {
        const boton = evento.target.closest("[data-accion]");

        if (!boton) {
            return;
        }

        const fila = boton.closest("[data-item-carrito]");
        const codigo = fila.dataset.codigo;
        const item = Carrito.obtenerItems().find(function (actual) {
            return actual.codigo === codigo;
        });

        if (!item) {
            return;
        }

        let resultado;

        switch (boton.dataset.accion) {
            case "sumar":
                resultado = Carrito.cambiarCantidad(codigo, item.cantidad + 1);
                break;
            case "restar":
                resultado = Carrito.cambiarCantidad(codigo, item.cantidad - 1);
                break;
            case "eliminar":
                resultado = Carrito.eliminar(codigo);
                break;
            default:
                return;
        }

        Interfaz.mostrarResultado(resultado);
    });

    botonVaciar.addEventListener("click", function () {
        const confirmado = window.confirm("¿Quieres quitar todos los productos del carrito?");

        if (confirmado) {
            const resultado = Carrito.vaciar();
            Interfaz.mostrarResultado(resultado);
            tituloVacio.focus();
        }
    });

    window.addEventListener("carrito:actualizado", renderizarCarrito);
    renderizarCarrito();
})();
