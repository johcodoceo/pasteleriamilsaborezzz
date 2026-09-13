# Parte 3 — carrito y código estructurado

Fecha: 9 de septiembre de 2026. Este registro complementa el ERS inicial y conserva el avance de la Parte 2 como antecedente histórico.

## Implementado

| Requisito | Resultado |
| --- | --- |
| Agregar desde catálogo y detalle | Implementado; también desde destacados |
| Modificar cantidades y eliminar | Implementado con validación JavaScript |
| Resumen de compra | Precio unitario, subtotal, unidades y total base |
| Guardar/restaurar | JSON.stringify, setItem, getItem y JSON.parse |
| Estado vacío y errores | Mensajes de cantidad, recuperación y almacenamiento |
| Código comprensible | HTML, CSS y JS formateados; funciones separadas y guía |

Se mantiene una fila por código, cantidades entre 1 y 99 y precios calculados desde el arreglo de productos. El límite de 99 es configurable y no representa stock. No se utilizan descuentos, despacho ni pago.

La parte de personalización del requisito RF03 permanece pendiente. RF04 y RF05 del ERS inicial cuentan ahora con implementación y pruebas de lógica; su demostración visual en navegador queda en la comprobación manual del README. Los restantes requisitos del ERS siguen su planificación previa.

## Validación realizada

Se ejecutaron 12 pruebas de lógica con Node y almacenamiento simulado: altas y agrupación, cálculos, modificación/eliminación, cantidades inválidas, límite acumulado, restauración en una nueva carga del código, vaciado sin borrar otras claves, JSON corrupto, recuperación parcial, precios manipulados, fallos de lectura/escritura, eventos de otras pestañas y copias de solo lectura del estado.

Además se verificaron los archivos HTML, destinos locales, recursos, orden de los scripts y sintaxis JavaScript. No se ejecutó una inspección visual ni pruebas de interacción en un navegador. Se incluyen pasos concretos para probar navegación y persistencia con Live Server antes de entregar.

## Próximo bloque

Formularios y administración: registro, login de demostración, contacto, RUN, regiones/comunas, gestión de productos y usuarios. También faltan personalización de tortas, inventario, imágenes individuales y los acuerdos sobre beneficios del caso. El carrito actual puede reutilizarse al incorporar estas funciones.
