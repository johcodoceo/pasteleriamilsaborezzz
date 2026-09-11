"use strict";

/*
 * LÓGICA DEL CARRITO
 *
 * Este objeto administra los datos y localStorage. No dibuja HTML.
 * Las vistas utilizan sus funciones públicas, definidas al final del archivo.
 */
window.Carrito = (function () {
    // Límite por carrito del prototipo; también se respeta el stock del catálogo.
    const CANTIDAD_MAXIMA = 99;
    const CLAVE_ALMACENAMIENTO = "milSabores.carrito.v1";

    let avisoAlmacenamiento = "";
    let avisoCatalogo = "";
    let items = cargarCarrito();

    // 1. VALIDACIÓN Y CONSULTAS

    function buscarProducto(codigo) {
        return window.Inventario.buscar(codigo);
    }

    function obtenerLimite(codigo) {
        const producto = buscarProducto(codigo);
        return producto ? Math.min(producto.stock, CANTIDAD_MAXIMA) : 0;
    }

    function esCantidadValida(cantidad) {
        return (
            Number.isInteger(cantidad) &&
            cantidad >= 1 &&
            cantidad <= CANTIDAD_MAXIMA
        );
    }

    function errorCantidad() {
        return {
            exito: false,
            mensaje: `Ingresa una cantidad entera entre 1 y ${CANTIDAD_MAXIMA}.`,
        };
    }

    function obtenerItems() {
        // Se entregan copias para impedir cambios externos sin validación.
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

            unidades += item.cantidad;
            total += subtotal;

            return {
                codigo: producto.codigo,
                nombre: producto.nombre,
                categoria: producto.categoria,
                precio: producto.precio,
                cantidad: item.cantidad,
                subtotal,
                limite: obtenerLimite(producto.codigo),
            };
        });

        return { detalle, unidades, total };
    }

    // 2. LECTURA Y ESCRITURA DE localStorage

    function normalizarItems(datos) {
        if (!Array.isArray(datos)) {
            throw new Error("El carrito guardado no es un arreglo.");
        }

        const validos = [];

        for (const item of datos) {
            if (
                !item ||
                typeof item !== "object" ||
                !buscarProducto(item.codigo) ||
                obtenerLimite(item.codigo) === 0 ||
                !esCantidadValida(item.cantidad)
            ) {
                continue;
            }

            const repetido = validos.find(function (actual) {
                return actual.codigo === item.codigo;
            });
            const limite = obtenerLimite(item.codigo);

            if (repetido) {
                repetido.cantidad = Math.min(
                    repetido.cantidad + item.cantidad,
                    limite,
                );
            } else {
                // Los precios y nombres se consultan en el catálogo actual.
                // No se confía en precios manipulados dentro de localStorage.
                validos.push({
                    codigo: item.codigo,
                    cantidad: Math.min(item.cantidad, limite),
                });
            }
        }

        return validos;
    }

    function cargarCarrito() {
        let textoGuardado;

        try {
            textoGuardado = window.localStorage.getItem(CLAVE_ALMACENAMIENTO);
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
            // JSON.parse convierte el texto guardado en datos de JavaScript.
            const datos = JSON.parse(textoGuardado);
            const validos = normalizarItems(datos);

            if (JSON.stringify(datos) !== JSON.stringify(validos)) {
                avisoAlmacenamiento =
                    "Se ajustó el carrito al catálogo y stock disponibles. " +
                    "Revisa las cantidades antes de continuar.";
            }

            return validos;
        } catch (error) {
            avisoAlmacenamiento =
                "No pudimos recuperar el carrito anterior. " +
                "Puedes comenzar una nueva selección.";
            return [];
        }
    }

    function guardarCarrito() {
        try {
            // localStorage guarda texto: JSON.stringify convierte el arreglo.
            const texto = JSON.stringify(items);
            window.localStorage.setItem(CLAVE_ALMACENAMIENTO, texto);
            avisoAlmacenamiento = "";
            return true;
        } catch (error) {
            avisoAlmacenamiento =
                "No se pudo guardar el carrito en este navegador. " +
                "Si recargas o cambias de página, podrías perder los cambios.";
            return false;
        }
    }

    function avisarCambio() {
        // La cabecera y la página del carrito escuchan el mismo evento.
        window.dispatchEvent(new CustomEvent("carrito:actualizado"));
    }

    function confirmarCambio(mensaje) {
        const guardado = guardarCarrito();
        avisarCambio();

        // Si falla el almacenamiento, el carrito sigue funcionando en esta página.
        return { exito: true, guardado, mensaje };
    }

    // 3. OPERACIONES PÚBLICAS

    function agregar(codigo, cantidad = 1) {
        const producto = buscarProducto(codigo);

        if (!producto) {
            return { exito: false, mensaje: "El producto no está disponible." };
        }

        if (!esCantidadValida(cantidad)) {
            return errorCantidad();
        }

        const existente = items.find(function (item) {
            return item.codigo === codigo;
        });
        const nuevaCantidad = (existente ? existente.cantidad : 0) + cantidad;

        const limite = obtenerLimite(codigo);

        if (nuevaCantidad > limite) {
            return {
                exito: false,
                mensaje: limite === 0 ? "El producto está agotado." :
                    `Puedes tener hasta ${limite} unidades de este producto según el stock disponible.`,
            };
        }

        if (existente) {
            existente.cantidad = nuevaCantidad;
        } else {
            items.push({ codigo, cantidad });
        }

        return confirmarCambio(`${producto.nombre}: agregado al carrito.`);
    }

    function cambiarCantidad(codigo, cantidad) {
        if (!esCantidadValida(cantidad)) {
            return errorCantidad();
        }

        const item = items.find(function (actual) {
            return actual.codigo === codigo;
        });

        if (!item) {
            return { exito: false, mensaje: "El producto ya no está en el carrito." };
        }

        const limite = obtenerLimite(codigo);

        if (cantidad > limite) {
            return {
                exito: false,
                mensaje: `La cantidad supera el stock disponible: máximo ${limite} unidades.`,
            };
        }

        item.cantidad = cantidad;
        return confirmarCambio("Cantidad actualizada.");
    }

    function eliminar(codigo) {
        const existe = items.some(function (item) {
            return item.codigo === codigo;
        });

        if (!existe) {
            return { exito: false, mensaje: "El producto ya no está en el carrito." };
        }

        items = items.filter(function (item) {
            return item.codigo !== codigo;
        });

        return confirmarCambio("Producto eliminado del carrito.");
    }

    function vaciar() {
        items = [];

        // Se guarda solamente nuestra clave. No usar localStorage.clear(),
        // porque borraría también los datos de otras funciones del proyecto.
        return confirmarCambio("Carrito vaciado.");
    }

    // 4. SINCRONIZACIÓN ENTRE PESTAÑAS Y NAVEGACIÓN HACIA ATRÁS

    window.addEventListener("productos:actualizados", function () {
        const nuevosItems = normalizarItems(items);

        if (JSON.stringify(nuevosItems) !== JSON.stringify(items)) {
            items = nuevosItems;
            guardarCarrito();
            avisoCatalogo = "El catálogo cambió: se ajustaron las cantidades o se retiraron productos del carrito.";
        }

        // También recalcula totales si cambian el nombre o el precio del producto.
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

    // La función se ejecuta una vez y deja disponibles estos métodos.
    return {
        CANTIDAD_MAXIMA,
        CLAVE_ALMACENAMIENTO,
        buscarProducto,
        obtenerLimite,
        obtenerItems,
        obtenerResumen,
        agregar,
        cambiarCantidad,
        eliminar,
        vaciar,
        obtenerAviso: function () {
            return [avisoAlmacenamiento, avisoCatalogo].filter(Boolean).join(" ");
        },
    };
})();
