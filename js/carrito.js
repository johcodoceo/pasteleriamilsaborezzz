"use strict";

/*
 * LÓGICA DEL CARRITO
 *
 * Este objeto administra los datos y localStorage. No dibuja HTML.
 * Las vistas utilizan sus funciones públicas, definidas al final del archivo.
 */
window.Carrito = (function () {
    // Cambia esta constante si acuerdas otro límite para el prototipo.
    // No representa stock: el caso todavía no entrega existencias.
    const CANTIDAD_MAXIMA = 99;
    const CLAVE_ALMACENAMIENTO = "milSabores.carrito.v1";

    let avisoAlmacenamiento = "";
    let items = cargarCarrito();

    // 1. VALIDACIÓN Y CONSULTAS

    function buscarProducto(codigo) {
        return window.PRODUCTOS.find(function (producto) {
            return producto.codigo === codigo;
        });
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
                !esCantidadValida(item.cantidad)
            ) {
                continue;
            }

            const repetido = validos.find(function (actual) {
                return actual.codigo === item.codigo;
            });

            if (repetido) {
                repetido.cantidad = Math.min(
                    repetido.cantidad + item.cantidad,
                    CANTIDAD_MAXIMA,
                );
            } else {
                // Los precios y nombres se consultan en productos.js.
                // No se confía en precios manipulados dentro de localStorage.
                validos.push({
                    codigo: item.codigo,
                    cantidad: item.cantidad,
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
                    "Se recuperaron los productos válidos del carrito. " +
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

        if (nuevaCantidad > CANTIDAD_MAXIMA) {
            return {
                exito: false,
                mensaje: `Puedes agregar hasta ${CANTIDAD_MAXIMA} unidades de cada producto.`,
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
        obtenerItems,
        obtenerResumen,
        agregar,
        cambiarCantidad,
        eliminar,
        vaciar,
        obtenerAviso: function () {
            return avisoAlmacenamiento;
        },
    };
})();
