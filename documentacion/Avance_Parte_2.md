# Parte 2 — estructura, navegación y diseño

Fecha: 8 de septiembre de 2026.

## Qué se completó

Se construyó el primer frontend ejecutable sin React. Se utilizaron cabeceras, navegación, main, secciones, artículos y footer; CSS externo y JavaScript externo. Se añadieron catálogo de consulta y detalles para dar destinos útiles a los productos destacados. Esto adelanta la lectura de productos de la Parte 3, pero no su carrito.

La portada utiliza una composición editorial con fotografía en arco y sello del aniversario, fondo crema, acento chocolate y rosa. La tipografía de marca es Pacifico, el texto Lato y los títulos largos Georgia para legibilidad. Existen alternativas locales de fuente cuando no hay conexión.

## Estado de las vistas

| Vista | Estado |
| --- | --- |
| Inicio | Portada, imagen local, destacados y enlaces |
| Productos y detalle | Consulta de los 16 productos; sin compra ni personalización |
| Nosotros | Historia del caso, misión, visión y equipo por completar |
| Blog | Dos artículos originales; imágenes de artículos pendientes |
| Registro, login y contacto | Páginas conectadas; formularios pendientes |
| Carrito | Página conectada; lógica y persistencia pendientes |
| Administración | Menú y tres páginas base; mantenedores pendientes |

## Decisiones

- No aplicar aún promociones ambiguas ni inventar existencias.
- No mostrar un contador ficticio del carrito ni una confirmación falsa de compra/contacto.
- Mantener los datos del caso separados de las funciones que generan las vistas.
- Los parámetros desconocidos de productos y artículos muestran un estado de no encontrado. No se insertan parámetros URL como HTML.
- No se incluyen datos reales de estudiantes o clientes.
- El logo es tipográfico. La imagen principal es generada y sirve como ilustración; no acredita un producto real. En el detalle de chocolate se declara ilustrativa, pues el formato visual no reproduce la torta cuadrada del catálogo.

## Recursos

Imagen: `dist/assets/torta-chocolate.jpg`, generada con ImageGen el 8/09/2026 para este proyecto; fotografía ilustrativa de una torta con chocolate y frutos rojos. No se usaron fotografías de terceros. Fuentes: Lato y Pacifico mediante Google Fonts, con respaldo CSS.

## Validación de esta etapa

Se comprobaron archivos de entrada, destinos HTML, imágenes y scripts locales, referencias a productos y sintaxis de JavaScript. La adaptación móvil está implementada mediante CSS; no se realizó inspección visual en navegador en esta etapa. El resto de pruebas de la matriz EV1 permanece pendiente de implementar cada función.

## Próximo bloque

Parte 3: fotografías/representaciones individuales adecuadas, catálogo interactivo, personalización, carrito y persistencia localStorage. Resolver política de beneficios antes de implementar descuentos. Parte 4: formularios, validaciones y administración.
