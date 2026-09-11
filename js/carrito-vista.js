"use strict";

/*
 * VISTA DEL CARRITO
 * Una fila representa un producto y su mensaje, con controles independientes.
 * carrito.js calcula y guarda; personalizacion.js presenta la validación del texto.
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
    const controlesPorFila = new WeakMap();
    let siguienteIdentificador = 0;

    // 1. CONSTRUCCIÓN DE FILAS CON IDENTIFICADORES ÚNICOS

    function buscarFila(claveLinea) {
        return Array.from(lista.children).find(function (fila) {
            return fila.dataset.claveLinea === claveLinea;
        });
    }

    function crearFila() {
        const fila = plantilla.content.firstElementChild.cloneNode(true);
        const identificador = `linea-carrito-${++siguienteIdentificador}`;
        const formulario = fila.querySelector("[data-formulario-mensaje]");
        const campoCantidad = fila.querySelector("[data-cantidad]");
        const campoMensaje = fila.querySelector("[data-mensaje-input]");

        // Los identificadores del HTML no dependen de textos escritos por usuarios.
        campoCantidad.id = `${identificador}-cantidad`;
        campoCantidad.setAttribute("aria-describedby", `${identificador}-error-cantidad`);
        fila.querySelector("[data-etiqueta-cantidad]").htmlFor = campoCantidad.id;
        fila.querySelector("[data-error]").id = `${identificador}-error-cantidad`;

        formulario.id = `${identificador}-editor`;
        campoMensaje.id = `${identificador}-mensaje`;
        fila.querySelector("[data-etiqueta-mensaje]").htmlFor = campoMensaje.id;
        fila.querySelector("[data-ayuda-mensaje]").id = `${identificador}-ayuda`;
        fila.querySelector("[data-contador-mensaje]").id = `${identificador}-contador`;
        fila.querySelector("[data-error-mensaje]").id = `${identificador}-error-mensaje`;
        campoMensaje.setAttribute(
            "aria-describedby",
            `${identificador}-ayuda ${identificador}-contador ${identificador}-error-mensaje`,
        );
        fila.querySelector('[data-accion="editar-mensaje"]')
            .setAttribute("aria-controls", formulario.id);

        controlesPorFila.set(fila, Personalizacion.conectar(formulario, function () {
            return Carrito.buscarProducto(fila.dataset.codigo);
        }));

        return fila;
    }

    // 2. ACTUALIZAR DATOS SIN REEMPLAZAR CAMPOS EN EDICIÓN

    function actualizarFila(fila, item) {
        fila.dataset.codigo = item.codigo;
        fila.dataset.mensaje = item.mensaje;
        fila.dataset.claveLinea = item.claveLinea;

        const enlace = fila.querySelector("[data-nombre]");
        enlace.textContent = item.nombre;
        enlace.href = `producto.html?id=${encodeURIComponent(item.codigo)}`;

        fila.querySelector("[data-categoria]").textContent = item.categoria;
        fila.querySelector("[data-precio]").textContent = Utilidades.formatearPrecio(item.precio);
        fila.querySelector("[data-subtotal]").textContent = Utilidades.formatearPrecio(item.subtotal);

        const campo = fila.querySelector("[data-cantidad]");
        campo.value = item.cantidad;
        campo.max = item.limite;
        campo.removeAttribute("aria-invalid");
        fila.querySelector("[data-error]").textContent = "";

        const seleccion = item.mensaje ? `${item.nombre}, con mensaje: ${item.mensaje}` :
            `${item.nombre}, sin mensaje`;
        fila.querySelector("[data-etiqueta-cantidad]").textContent = `Cantidad de ${seleccion}`;

        const botonRestar = fila.querySelector('[data-accion="restar"]');
        const botonSumar = fila.querySelector('[data-accion="sumar"]');
        const botonEliminar = fila.querySelector('[data-accion="eliminar"]');
        botonRestar.disabled = item.cantidad === 1;
        botonSumar.disabled = item.cantidad >= item.limite;
        botonRestar.setAttribute("aria-label", `Quitar una unidad de ${seleccion}`);
        botonSumar.setAttribute("aria-label", `Sumar una unidad de ${seleccion}`);
        botonEliminar.setAttribute("aria-label", `Eliminar ${seleccion} del carrito`);

        fila.querySelector("[data-personalizacion]").hidden = !item.personalizable;
        fila.querySelector("[data-mensaje]").textContent = item.mensaje ?
            `Mensaje: ${item.mensaje}` : "Sin mensaje personalizado.";

        const botonMensaje = fila.querySelector('[data-accion="editar-mensaje"]');
        botonMensaje.textContent = item.mensaje ? "Editar mensaje" : "Agregar mensaje";
        botonMensaje.setAttribute("aria-label", `${botonMensaje.textContent}: ${seleccion}`);

        // Una modificación de cantidades no debe borrar un mensaje aún sin guardar.
        if (fila.querySelector("[data-formulario-mensaje]").hidden) {
            controlesPorFila.get(fila).restablecer(item.mensaje);
        }
    }

    function renderizarCarrito() {
        const resumen = Carrito.obtenerResumen();
        const estaVacio = resumen.detalle.length === 0;
        const focoAnterior = document.activeElement;
        const filas = Array.from(lista.children);
        const indiceFoco = filas.findIndex(function (fila) {
            return fila.contains(focoAnterior);
        });

        for (const fila of filas) {
            const sigueEnCarrito = resumen.detalle.some(function (item) {
                return item.claveLinea === fila.dataset.claveLinea;
            });

            if (!sigueEnCarrito) {
                fila.remove();
            }
        }

        for (const item of resumen.detalle) {
            let fila = buscarFila(item.claveLinea);

            if (!fila) {
                fila = crearFila();
                lista.append(fila);
            }

            actualizarFila(fila, item);
        }

        contenido.hidden = estaVacio;
        estadoVacio.hidden = !estaVacio;
        document.querySelector("#resumen-unidades").textContent = resumen.unidades;
        document.querySelector("#resumen-total").textContent = Utilidades.formatearPrecio(resumen.total);

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

    // 3. CANTIDADES: SIEMPRE SE IDENTIFICA TAMBIÉN EL MENSAJE

    function aplicarCantidad(campo) {
        const fila = campo.closest("[data-item-carrito]");
        const resultado = Carrito.cambiarCantidad(
            fila.dataset.codigo,
            Number(campo.value),
            fila.dataset.mensaje,
        );

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

    // 4. EDICIÓN DEL MENSAJE: GUARDAR, CANCELAR Y AGRUPAR

    function cerrarMensaje(fila) {
        fila.querySelector("[data-formulario-mensaje]").hidden = true;
        controlesPorFila.get(fila).restablecer(fila.dataset.mensaje);
        const boton = fila.querySelector('[data-accion="editar-mensaje"]');
        boton.setAttribute("aria-expanded", "false");
        boton.focus();
    }

    lista.addEventListener("submit", function (evento) {
        const formulario = evento.target;

        if (!formulario.matches("[data-formulario-mensaje]")) {
            return;
        }

        evento.preventDefault();
        const fila = formulario.closest("[data-item-carrito]");
        const controles = controlesPorFila.get(fila);

        if (controles.validar()) {
            controles.campo.focus();
            return;
        }

        const resultado = Carrito.cambiarMensaje(
            fila.dataset.codigo,
            fila.dataset.mensaje,
            controles.leer(),
        );

        if (resultado.exito) {
            // El cambio puede crear otra fila o combinarla con una existente.
            const destino = buscarFila(resultado.claveLinea);

            if (destino) {
                cerrarMensaje(destino);
            }
        }

        Interfaz.mostrarResultado(resultado);
    });

    // 5. BOTONES DE CADA LÍNEA Y VACIADO COMPLETO

    lista.addEventListener("click", function (evento) {
        const boton = evento.target.closest("[data-accion]");

        if (!boton) {
            return;
        }

        const fila = boton.closest("[data-item-carrito]");
        const codigo = fila.dataset.codigo;
        const mensaje = fila.dataset.mensaje;
        const item = Carrito.obtenerItems().find(function (actual) {
            return actual.codigo === codigo && actual.mensaje === mensaje;
        });

        if (!item) {
            return;
        }

        let resultado;

        switch (boton.dataset.accion) {
            case "editar-mensaje":
                fila.querySelector("[data-formulario-mensaje]").hidden = false;
                boton.setAttribute("aria-expanded", "true");
                controlesPorFila.get(fila).campo.focus();
                return;
            case "cancelar-mensaje":
                cerrarMensaje(fila);
                return;
            case "sumar":
                resultado = Carrito.cambiarCantidad(codigo, item.cantidad + 1, mensaje);
                break;
            case "restar":
                resultado = Carrito.cambiarCantidad(codigo, item.cantidad - 1, mensaje);
                break;
            case "eliminar":
                resultado = Carrito.eliminar(codigo, mensaje);
                break;
            default:
                return;
        }

        Interfaz.mostrarResultado(resultado);
    });

    botonVaciar.addEventListener("click", function () {
        if (window.confirm("¿Quieres quitar todos los productos y sus mensajes del carrito?")) {
            Interfaz.mostrarResultado(Carrito.vaciar());
            tituloVacio.focus();
        }
    });

    window.addEventListener("carrito:actualizado", renderizarCarrito);
    renderizarCarrito();
})();
