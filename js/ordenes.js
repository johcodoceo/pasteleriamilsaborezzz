"use strict";

/*
 * CONSULTA DE ÓRDENES DE DEMOSTRACIÓN
 * Entrega copias y comprueba la sesión en cada consulta.
 * No modifica el carrito, el inventario ni los datos de localStorage.
 */
window.Ordenes = (function () {
    // 1. COPIAS Y CÁLCULOS: LOS IMPORTES HISTÓRICOS NO DEPENDEN DEL CATÁLOGO

    function copiarConTotales(orden) {
        let totalCentavos = 0;
        const items = orden.items.map(function (item) {
            // Trabajar con centavos evita sumar errores de decimales binarios.
            const precioCentavos = Math.round((item.precioUnitario + Number.EPSILON) * 100);
            const subtotalCentavos = precioCentavos * item.cantidad;
            totalCentavos += subtotalCentavos;

            return {
                codigo: item.codigo,
                nombre: item.nombre,
                precioUnitario: precioCentavos / 100,
                cantidad: item.cantidad,
                mensaje: item.mensaje,
                subtotal: subtotalCentavos / 100,
            };
        });

        return {
            numero: orden.numero,
            fecha: orden.fecha,
            estado: orden.estado,
            cliente: { ...orden.cliente },
            items,
            total: totalCentavos / 100,
        };
    }

    // Se separan los ejemplos del arreglo público antes de atender consultas.
    const ordenes = window.DATOS_ORDENES.map(copiarConTotales);

    // 2. ACCESO DE DEMOSTRACIÓN: SE REVALIDA AL LISTAR Y AL ABRIR UN DETALLE

    function exigirConsulta() {
        const usuario = window.CuentasDemo.obtenerSesion();
        const permitido = usuario && ["Administrador", "Vendedor"].includes(usuario.tipoUsuario);

        if (!permitido) {
            throw new Error("Inicia sesión como Vendedor o Administrador para consultar órdenes.");
        }
    }

    function listar() {
        exigirConsulta();

        return ordenes.map(copiarConTotales).sort(function (primera, segunda) {
            return segunda.fecha.localeCompare(primera.fecha) ||
                segunda.numero.localeCompare(primera.numero);
        });
    }

    function buscar(numero) {
        exigirConsulta();
        const orden = ordenes.find(function (actual) {
            return actual.numero === numero;
        });

        return orden ? copiarConTotales(orden) : null;
    }

    return {
        listar,
        buscar,
    };
})();
