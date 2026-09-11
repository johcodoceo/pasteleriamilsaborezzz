"use strict";

/*
 * ÓRDENES FICTICIAS PARA LA DEMOSTRACIÓN DE EV1
 * No corresponden a ventas ni a usuarios registrados en el navegador.
 * Cada ítem conserva el nombre, precio y mensaje al registrar la orden.
 * El total se calcula en ordenes.js; no se escribe manualmente aquí.
 */
window.DATOS_ORDENES = [
    {
        numero: "ORD-1001",
        fecha: "2026-09-07",
        estado: "Entregada",
        cliente: {
            nombre: "Sofía Ejemplo",
            correo: "sofia@example.com",
        },
        items: [
            {
                codigo: "TE001",
                nombre: "Torta Especial de Cumpleaños",
                precioUnitario: 55000,
                cantidad: 1,
                mensaje: "¡Feliz cumpleaños, Sofía!",
            },
            {
                codigo: "PT001",
                nombre: "Empanada de Manzana",
                precioUnitario: 3000,
                cantidad: 4,
                mensaje: "",
            },
        ],
    },
    {
        numero: "ORD-1002",
        fecha: "2026-09-08",
        estado: "Lista para retiro",
        cliente: {
            nombre: "Mateo Ejemplo",
            correo: "mateo@example.com",
        },
        items: [
            {
                codigo: "TT002",
                nombre: "Torta Circular de Manjar",
                precioUnitario: 42000,
                cantidad: 1,
                mensaje: "Gracias por compartir este día",
            },
            {
                codigo: "PV002",
                nombre: "Galletas Veganas de Avena",
                precioUnitario: 4500,
                cantidad: 2,
                mensaje: "",
            },
        ],
    },
    {
        numero: "ORD-1003",
        fecha: "2026-09-09",
        estado: "En preparación",
        cliente: {
            nombre: "Diego Ejemplo",
            correo: "diego@example.com",
        },
        items: [
            {
                codigo: "TC001",
                nombre: "Torta Cuadrada de Chocolate",
                precioUnitario: 45000,
                cantidad: 1,
                mensaje: "¡Feliz cumpleaños, Emilia!",
            },
            {
                codigo: "TC001",
                nombre: "Torta Cuadrada de Chocolate",
                precioUnitario: 45000,
                cantidad: 1,
                mensaje: "Gracias, equipo",
            },
            {
                codigo: "PG001",
                nombre: "Brownie Sin Gluten",
                precioUnitario: 4000,
                cantidad: 3,
                mensaje: "",
            },
        ],
    },
    {
        numero: "ORD-1004",
        fecha: "2026-09-10",
        estado: "Pendiente",
        cliente: {
            nombre: "Camila Ejemplo",
            correo: "camila@example.com",
        },
        items: [
            {
                codigo: "TC001",
                nombre: "Torta Cuadrada de Chocolate",
                precioUnitario: 45000,
                cantidad: 1,
                mensaje: "¡Felicidades, Camila!",
            },
            {
                codigo: "PI001",
                nombre: "Mousse de Chocolate",
                precioUnitario: 5000,
                cantidad: 2,
                mensaje: "",
            },
        ],
    },
];
