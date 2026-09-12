"use strict";

/*
 * DATOS INICIALES DEL CASO FORMA C
 * Códigos y precios corresponden al enunciado.
 * Stock 20 y umbral 5 son ejemplos para practicar, no existencias reales.
 * Las imágenes son ilustrativas; su procedencia se explica en la guía de la Parte 7.
 * Las modificaciones del panel se guardan aparte y tienen prioridad.
 */
window.PRODUCTOS = [
    {
        "codigo": "TC001",
        "nombre": "Torta Cuadrada de Chocolate",
        "precio": 45000,
        "categoria": "Tortas Cuadradas",
        "descripcion": "Capas de chocolate, ganache y un toque de avellanas.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/tc001.png",
        "personalizable": true
    },
    {
        "codigo": "TC002",
        "nombre": "Torta Cuadrada de Frutas",
        "precio": 50000,
        "categoria": "Tortas Cuadradas",
        "descripcion": "Frutas frescas, crema chantilly y bizcocho de vainilla.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/tc002.png",
        "personalizable": true
    },
    {
        "codigo": "TT001",
        "nombre": "Torta Circular de Vainilla",
        "precio": 40000,
        "categoria": "Tortas Circulares",
        "descripcion": "Bizcocho de vainilla, crema pastelera y glaseado dulce.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/tt001.png",
        "personalizable": true
    },
    {
        "codigo": "TT002",
        "nombre": "Torta Circular de Manjar",
        "precio": 42000,
        "categoria": "Tortas Circulares",
        "descripcion": "La combinación tradicional de manjar y nueces.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/tt002.png",
        "personalizable": true
    },
    {
        "codigo": "PI001",
        "nombre": "Mousse de Chocolate",
        "precio": 5000,
        "categoria": "Postres Individuales",
        "descripcion": "Un postre de chocolate suave y cremoso.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/pi001.png",
        "personalizable": false
    },
    {
        "codigo": "PI002",
        "nombre": "Tiramisú Clásico",
        "precio": 5500,
        "categoria": "Postres Individuales",
        "descripcion": "Capas de café, mascarpone y cacao.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/pi002.png",
        "personalizable": false
    },
    {
        "codigo": "PSA001",
        "nombre": "Torta Sin Azúcar de Naranja",
        "precio": 48000,
        "categoria": "Productos Sin Azúcar",
        "descripcion": "Una alternativa de naranja para compartir.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/psa001.png",
        "personalizable": true
    },
    {
        "codigo": "PSA002",
        "nombre": "Cheesecake Sin Azúcar",
        "precio": 47000,
        "categoria": "Productos Sin Azúcar",
        "descripcion": "Textura suave y cremosa.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/psa002.png",
        "personalizable": false
    },
    {
        "codigo": "PT001",
        "nombre": "Empanada de Manzana",
        "precio": 3000,
        "categoria": "Pastelería Tradicional",
        "descripcion": "Manzanas especiadas dentro de una masa tradicional.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/pt001.png",
        "personalizable": false
    },
    {
        "codigo": "PT002",
        "nombre": "Tarta de Santiago",
        "precio": 6000,
        "categoria": "Pastelería Tradicional",
        "descripcion": "Tarta tradicional de almendras.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/pt002.png",
        "personalizable": false
    },
    {
        "codigo": "PG001",
        "nombre": "Brownie Sin Gluten",
        "precio": 4000,
        "categoria": "Productos Sin Gluten",
        "descripcion": "Chocolate intenso en una porción individual.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/pg001.png",
        "personalizable": false
    },
    {
        "codigo": "PG002",
        "nombre": "Pan Sin Gluten",
        "precio": 3500,
        "categoria": "Productos Sin Gluten",
        "descripcion": "Una alternativa para acompañar tu mesa.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/pg002.png",
        "personalizable": false
    },
    {
        "codigo": "PV001",
        "nombre": "Torta Vegana de Chocolate",
        "precio": 50000,
        "categoria": "Productos Veganos",
        "descripcion": "Torta de chocolate sin ingredientes de origen animal.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/torta-chocolate.jpg",
        "personalizable": true
    },
    {
        "codigo": "PV002",
        "nombre": "Galletas Veganas de Avena",
        "precio": 4500,
        "categoria": "Productos Veganos",
        "descripcion": "Galletas de avena crujientes.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/pv002.png",
        "personalizable": false
    },
    {
        "codigo": "TE001",
        "nombre": "Torta Especial de Cumpleaños",
        "precio": 55000,
        "categoria": "Tortas Especiales",
        "descripcion": "Una torta pensada para celebrar.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/te001.png",
        "personalizable": true
    },
    {
        "codigo": "TE002",
        "nombre": "Torta Especial de Boda",
        "precio": 60000,
        "categoria": "Tortas Especiales",
        "descripcion": "Un detalle especial para un día inolvidable.",
        "stock": 20,
        "stockCritico": 5,
        "imagen": "assets/productos/te002.png",
        "personalizable": true
    }
];
