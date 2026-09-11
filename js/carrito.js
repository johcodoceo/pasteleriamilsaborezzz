"use strict";

/*
 * CARRITO CON PERSONALIZACIÓN
 * Cada línea se identifica por código de producto y mensaje.
 * El stock y el límite de 99 se comparten entre todas las líneas del mismo código.
 * Este módulo administra datos; carrito-vista.js dibuja los controles.
 */
window.Carrito = (function () {
    const CANTIDAD_MAXIMA = 99;
    const CLAVE_ALMACENAMIENTO = "milSabores.carrito.v2";
    const CLAVE_ANTERIOR = "milSabores.carrito.v1";

    let avisoAlmacenamiento = "";
    let avisoCatalogo = "";
    let items = cargarCarrito();

    // 1. IDENTIFICACIÓN, CANTIDADES Y CONSULTAS

    function buscarProducto(codigo) {
        return window.Inventario.buscar(codigo);
    }

    function obtenerLimite(codigo) {
        const producto = buscarProducto(codigo);
        return producto ? Math.min(producto.stock, CANTIDAD_MAXIMA) : 0;
    }

    function crearClaveLinea(codigo, mensaje) {
        // El par JSON evita colisiones entre códigos y mensajes con separadores.
        // Se calcula para la vista; no hace falta guardarlo en localStorage.
        return JSON.stringify([codigo, mensaje]);
    }

    function contarUnidades(codigo, lista = items) {
        return lista.reduce(function (total, item) {
            return total + (item.codigo === codigo ? item.cantidad : 0);
        }, 0);
    }

    function buscarItem(codigo, mensaje) {
        if (typeof mensaje !== "string") {
            return undefined;
        }

        const normalizado = window.Validaciones.normalizarMensajeTorta(mensaje);
        return items.find(function (item) {
            return item.codigo === codigo && item.mensaje === normalizado;
        });
    }

    function esCantidadValida(cantidad) {
        return Number.isInteger(cantidad) && cantidad >= 1 && cantidad <= CANTIDAD_MAXIMA;
    }

    function errorCantidad() {
        return {
            exito: false,
            mensaje: `Ingresa una cantidad entera entre 1 y ${CANTIDAD_MAXIMA}.`,
        };
    }

    function errorStock(codigo) {
        const limite = obtenerLimite(codigo);
        return {
            exito: false,
            mensaje: limite === 0 ? "El producto está agotado." :
                `Puedes tener hasta ${limite} unidades de este producto, sumando todos sus mensajes.`,
        };
    }

    function obtenerItems() {
        return items.map(function (item) {
            return { ...item };
        });
    }

    function obtenerResumen() {
        let unidades = 0;
        let total = 0;

        const detalle = items.map(function (item) {
            const producto = buscarProducto(item.codigo);
            const subtotal = producto.precio * item.cantidad;
            const otrasUnidades = contarUnidades(item.codigo) - item.cantidad;

            unidades += item.cantidad;
            total += subtotal;

            return {
                claveLinea: crearClaveLinea(item.codigo, item.mensaje),
                codigo: item.codigo,
                nombre: producto.nombre,
                categoria: producto.categoria,
                precio: producto.precio,
                cantidad: item.cantidad,
                mensaje: item.mensaje,
                personalizable: producto.personalizable,
                subtotal,
                limite: obtenerLimite(item.codigo) - otrasUnidades,
            };
        });

        return { detalle, unidades, total };
    }

    // 2. RECUPERACIÓN: MENSAJES VÁLIDOS Y STOCK COMPARTIDO

    function normalizarItems(datos) {
        if (!Array.isArray(datos)) {
            throw new Error("El carrito guardado no es un arreglo.");
        }

        const validos = [];

        for (const item of datos) {
            if (!item || typeof item !== "object" || !esCantidadValida(item.cantidad)) {
                continue;
            }

            const producto = buscarProducto(item.codigo);
            const mensajeRecibido = item.mensaje === undefined ? "" : item.mensaje;

            if (!producto || window.Validaciones.validarMensajeTorta(producto, mensajeRecibido)) {
                // No se cambia un mensaje inválido por una compra sin mensaje.
                continue;
            }

            const mensaje = window.Validaciones.normalizarMensajeTorta(mensajeRecibido);
            const disponible = obtenerLimite(item.codigo) - contarUnidades(item.codigo, validos);
            const cantidad = Math.min(item.cantidad, disponible);

            if (cantidad <= 0) {
                continue;
            }

            const repetido = validos.find(function (actual) {
                return actual.codigo === item.codigo && actual.mensaje === mensaje;
            });

            if (repetido) {
                repetido.cantidad += cantidad;
            } else {
                validos.push({ codigo: item.codigo, cantidad, mensaje });
            }
        }

        // Ante menor stock se conserva el orden de las líneas guardadas.
        // Nombres, precios y permisos de personalización provienen del catálogo.
        return validos;
    }

    function guardarDatos(datos) {
        try {
            window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(datos));
            avisoAlmacenamiento = "";
            return true;
        } catch (error) {
            avisoAlmacenamiento =
                "No se pudo guardar el carrito en este navegador. " +
                "Si recargas o cambias de página, podrías perder los cambios.";
            return false;
        }
    }

    function cargarCarrito() {
        let textoGuardado;
        let vieneDeVersionAnterior = false;

        try {
            textoGuardado = window.localStorage.getItem(CLAVE_ALMACENAMIENTO);

            if (textoGuardado === null) {
                textoGuardado = window.localStorage.getItem(CLAVE_ANTERIOR);
                vieneDeVersionAnterior = textoGuardado !== null;
            }
        } catch (error) {
            avisoAlmacenamiento =
                "Este navegador no permite leer el carrito guardado. " +
                "Los cambios podrían perderse al recargar o cambiar de página.";
            return [];
        }

        avisoAlmacenamiento = "";

        if (textoGuardado === null) {
            return [];
        }

        try {
            const datos = JSON.parse(textoGuardado);
            const validos = normalizarItems(datos);

            if (vieneDeVersionAnterior) {
                // Solo se migra cuando v2 no existe. v1 queda intacta como respaldo.
                // Si falla la escritura, el respaldo sigue disponible al recargar.
                if (guardarDatos(validos)) {
                    avisoAlmacenamiento = "Se recuperó el carrito anterior. Revisa sus productos y cantidades.";
                }
            } else if (JSON.stringify(datos) !== JSON.stringify(validos)) {
                avisoAlmacenamiento =
                    "Se ajustó el carrito al catálogo, mensajes y stock disponibles. " +
                    "Revisa su contenido antes de continuar.";
            }

            return validos;
        } catch (error) {
            // Una v2 inválida no recupera automáticamente una v1 antigua.
            avisoAlmacenamiento =
                "No pudimos recuperar el carrito anterior. " +
                "Puedes comenzar una nueva selección.";
            return [];
        }
    }

    function avisarCambio() {
        window.dispatchEvent(new CustomEvent("carrito:actualizado"));
    }

    function confirmarCambio(mensaje) {
        const guardado = guardarDatos(items);
        avisarCambio();
        return { exito: true, guardado, mensaje };
    }

    // 3. AGREGAR, CAMBIAR CANTIDAD Y ELIMINAR UNA LÍNEA

    function agregar(codigo, cantidad = 1, mensaje = "") {
        const producto = buscarProducto(codigo);

        if (!producto) {
            return { exito: false, mensaje: "El producto no está disponible." };
        }

        if (!esCantidadValida(cantidad)) {
            return errorCantidad();
        }

        const errorMensaje = window.Validaciones.validarMensajeTorta(producto, mensaje);

        if (errorMensaje) {
            return { exito: false, mensaje: errorMensaje, errores: { mensaje: errorMensaje } };
        }

        if (contarUnidades(codigo) + cantidad > obtenerLimite(codigo)) {
            return errorStock(codigo);
        }

        const normalizado = window.Validaciones.normalizarMensajeTorta(mensaje);
        const existente = buscarItem(codigo, normalizado);

        if (existente) {
            existente.cantidad += cantidad;
        } else {
            items.push({ codigo, cantidad, mensaje: normalizado });
        }

        return confirmarCambio(`${producto.nombre}: agregado al carrito.`);
    }

    function cambiarCantidad(codigo, cantidad, mensaje = "") {
        if (!esCantidadValida(cantidad)) {
            return errorCantidad();
        }

        const item = buscarItem(codigo, mensaje);

        if (!item) {
            return { exito: false, mensaje: "Esta selección ya no está en el carrito." };
        }

        const nuevaCantidadTotal = contarUnidades(codigo) - item.cantidad + cantidad;

        if (nuevaCantidadTotal > obtenerLimite(codigo)) {
            return errorStock(codigo);
        }

        item.cantidad = cantidad;
        return confirmarCambio("Cantidad actualizada.");
    }

    function eliminar(codigo, mensaje = "") {
        const item = buscarItem(codigo, mensaje);

        if (!item) {
            return { exito: false, mensaje: "Esta selección ya no está en el carrito." };
        }

        items = items.filter(function (actual) {
            return actual !== item;
        });
        return confirmarCambio("Selección eliminada del carrito.");
    }

    // 4. EDITAR UN MENSAJE Y AGRUPAR LÍNEAS EQUIVALENTES

    function cambiarMensaje(codigo, mensajeActual, mensajeNuevo) {
        const item = buscarItem(codigo, mensajeActual);

        if (!item) {
            return { exito: false, mensaje: "Esta selección ya no está en el carrito." };
        }

        const error = window.Validaciones.validarMensajeTorta(buscarProducto(codigo), mensajeNuevo);

        if (error) {
            return { exito: false, mensaje: error, errores: { mensaje: error } };
        }

        const nuevo = window.Validaciones.normalizarMensajeTorta(mensajeNuevo);
        const destino = buscarItem(codigo, nuevo);
        let aviso = "Mensaje actualizado.";

        if (destino && destino !== item) {
            destino.cantidad += item.cantidad;
            items = items.filter(function (actual) {
                return actual !== item;
            });
            aviso = "Las selecciones con el mismo mensaje se agruparon en una línea.";
        } else {
            item.mensaje = nuevo;
        }

        // Cambiar el mensaje no añade unidades ni modifica el precio.
        return {
            ...confirmarCambio(aviso),
            claveLinea: crearClaveLinea(codigo, nuevo),
        };
    }

    function vaciar() {
        items = [];
        // Guardar [] en v2 evita que el carrito de respaldo vuelva a importarse.
        // No se borran cuentas, inventario ni otras preferencias del navegador.
        return confirmarCambio("Carrito vaciado.");
    }

    // 5. SINCRONIZACIÓN Y CAMBIOS DEL CATÁLOGO

    window.addEventListener("productos:actualizados", function () {
        const nuevosItems = normalizarItems(items);

        if (JSON.stringify(nuevosItems) !== JSON.stringify(items)) {
            items = nuevosItems;
            guardarDatos(items);
            avisoCatalogo =
                "El catálogo cambió: se ajustaron cantidades o se retiraron selecciones " +
                "que ya no están disponibles con ese mensaje.";
        }

        avisarCambio();
    });

    window.addEventListener("storage", function (evento) {
        if (evento.key === CLAVE_ALMACENAMIENTO || evento.key === null) {
            items = cargarCarrito();
            avisarCambio();
        }
    });

    window.addEventListener("pageshow", function (evento) {
        if (evento.persisted) {
            items = cargarCarrito();
            avisarCambio();
        }
    });

    return {
        CANTIDAD_MAXIMA,
        CLAVE_ALMACENAMIENTO,
        CLAVE_ANTERIOR,
        buscarProducto,
        obtenerLimite,
        obtenerItems,
        obtenerResumen,
        agregar,
        cambiarCantidad,
        cambiarMensaje,
        eliminar,
        vaciar,
        obtenerAviso: function () {
            return [avisoAlmacenamiento, avisoCatalogo].filter(Boolean).join(" ");
        },
    };
})();
