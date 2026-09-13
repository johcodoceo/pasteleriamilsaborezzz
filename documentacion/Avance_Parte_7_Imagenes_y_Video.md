# Parte 7 — imágenes y video

10 de septiembre de 2026 · DSY1104 · Forma C

Este bloque continúa la Parte 6 y entrega el proyecto acumulado. Complementa el ERS inicial y no constituye el cierre de toda la EV1.

## Resultado y relación con los requisitos

| Área | Resultado de esta parte |
| --- | --- |
| RF02 — Catálogo | Los 16 productos iniciales muestran imagen local |
| RF03 — Detalle | Cada producto utiliza la imagen del catálogo y declara su carácter ilustrativo |
| RF09 — Blog | Los dos artículos muestran imagen en el listado y en su contenido completo |
| Multimedia | Video de pastelería incrustado en el blog, con fuente y enlace externo |
| Administración | Vista previa y detalle utilizan la imagen inicial cuando el campo guardado está vacío |
| Compatibilidad | Catálogos anteriores pueden mostrar las imágenes nuevas sin limpiar localStorage |
| Código y documentación | Cuatro espacios de sangría, función compartida para resolver imágenes y guía de modificación |

## Decisiones

- Se agregan quince imágenes PNG y se reutiliza la imagen de chocolate existente para PV001. La imagen nueva de TC001 representa una torta cuadrada.
- El blog reutiliza las imágenes de chocolate y cumpleaños; no duplica los archivos.
- Las imágenes son locales e ilustrativas, generadas para el prototipo. Los prompts y la procedencia quedan documentados.
- Las fotos propias del Administrador conservan prioridad. El campo vacío utiliza la imagen inicial de un código conocido; un producto nuevo sin imagen sigue sin foto.
- La ruta circular antigua de TC001 se reconoce expresamente para mostrar la imagen cuadrada. No se reescribe el catálogo guardado.
- El video es [Torta tres leches, de Recetas Nestlé CL](https://www.youtube.com/watch?v=l_NfpUOWJY0). Requiere internet y mantiene un enlace a su fuente.
- El video de la receta no reemplaza la presentación grabada que debe entregar el grupo.

## Verificación realizada

- Integridad de los 16 archivos de imagen: abren completos y conservan dimensiones de 1536 × 1024 píxeles.
- Inspección individual de las imágenes generadas antes de integrarlas.
- Comprobación de las rutas locales, fragmentos y etiquetas de las 13 páginas HTML.
- Sintaxis válida de los 23 archivos JavaScript.
- Comprobación con los datos iniciales reales de la Parte 6: se recuperan sus imágenes sin escribir en localStorage, manteniendo precios, stock y demás propiedades.
- Conservación de rutas propias, productos eliminados y catálogos vacíos.
- Ejecución de las 60 pruebas existentes desde el proyecto extraído del ZIP: carrito, formularios, administración y personalización.

Se verificaron la fuente y los metadatos del video. No se ejecutaron pruebas visuales o de interacción del sitio en navegador ni se confirmó la reproducción incrustada. La guía incluye el recorrido manual pendiente.

## Pendiente para completar EV1

1. Implementar la lista y el detalle de órdenes del Vendedor como simulación frontend, dentro del alcance de la evaluación.
2. Completar los nombres y la información real del equipo en Nosotros y en los documentos.
3. Consolidar el ERS versión 1 con los avances y contrastarlo con la pauta.
4. Realizar la revisión final en navegador: móvil, teclado, formularios, carrito y video.
5. Preparar el GitHub del grupo con aportes reales de los integrantes, grabar el video explicativo y completar la entrega individual en AVA.
6. Acordar con el docente el alcance en EV1 de los beneficios comerciales del caso y las reglas de aplicación de edad, FELICES50 y cumpleaños.

Los documentos específicos de 2026 indican entrega el lunes 14 de septiembre de 2026, antes de las 11:00 AM. El equipo debe conservar y seguir las instrucciones originales del curso para los enlaces y la entrega.

La entrega de este bloque es `Mil_Sabores_Parte_7_Imagenes_y_Video.zip`. Incluye el frontend acumulado, las guías, los avances y las pruebas. El enlace web anterior conserva la publicación previa.
