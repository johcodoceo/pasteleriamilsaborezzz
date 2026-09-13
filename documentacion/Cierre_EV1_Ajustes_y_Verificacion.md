# Cierre EV1 — ajustes y verificación técnica

11 de septiembre de 2026 · DSY1104 · Forma C — Pastelería Mil Sabores

## Objetivo

Cerrar la EV1 sin ampliar el alcance funcional ni reestructurar el proyecto. Los cambios de esta versión son deliberadamente pequeños y se concentran en coherencia visual y problemas detectados durante la verificación.

## Ajustes realizados

1. **Logo de cabecera:** se incorporó `frontend/assets/logo-mil-sabores.png`, obtenido del material del caso Forma C, y se reemplazó únicamente el bloque tipográfico de marca de las 15 cabeceras. Los enlaces, menús y estructura de cada página se conservaron.
2. **Tipografía de encabezados:** `h1` y `h2` usan `Pacifico` como primera opción y mantienen Georgia/Times como respaldo. No se cambiaron tamaños ni jerarquías de contenido.
3. **HOME responsive:** se ajustó la posición del sello de aniversario y del número decorativo para evitar que sus cajas transformadas amplíen el ancho del documento.
4. **Tablas de administración en móvil:** `.table-scroll` conserva el scroll horizontal propio de las tablas y ya no produce desbordamiento horizontal de la página en la comprobación móvil.

No se modificaron las reglas de carrito, beneficios, usuarios, productos, órdenes, inventario, personalización ni almacenamiento.

## Verificación ejecutada

- **88/88 pruebas Node aprobadas.**
- **29/29 archivos JavaScript** comprobados con `node --check`.
- **15/15 páginas HTML** revisadas para enlaces HTML locales, hojas CSS, scripts, imágenes y logo de cabecera; no se encontraron referencias locales inexistentes.
- Renderizado de vistas públicas en **1366×768** y **390×844**, sin excepciones JavaScript ni desbordamiento horizontal del documento.
- Renderizado de las **5 vistas administrativas** en ambos tamaños con sesión de Administrador de prueba; tablas móviles con scroll interno.
- **16/16 productos** abren su detalle; también se comprobó la respuesta para un producto inexistente.
- Los dos artículos del blog abren y un ID inexistente muestra el estado correspondiente.
- Catálogo con **16 botones** de agregado; se comprobó agregado repetido de TC001, total y persistencia en almacenamiento.
- Menú móvil comprobado al abrir, cerrar con Escape y devolver el foco.
- Registro, Contacto e Inicio de sesión muestran mensajes personalizados al enviar datos vacíos.
- Administración comprobada con 16 productos, 4 órdenes y el detalle `ORD-1003` con 3 líneas.

## Límite de la verificación

El entorno de pruebas bloquea la navegación directa a `localhost`/`file://`, por lo que el renderizado de Chromium se ejecutó mediante un harness que carga las dependencias locales dentro del documento de prueba. Esto detecta errores de DOM, JavaScript y layout, pero el equipo todavía debe abrir la carpeta real con Live Server antes de entregar.

## Último recorrido manual recomendado

Abrir `frontend/index.html` con Live Server y recorrer HOME → Productos → Detalle → Carrito → Registro → Login → Nosotros → Blog/Artículo → Contacto → Administración. Confirmar visualmente el logo y la tipografía, usar el menú en una ventana angosta, navegar con Tab, reproducir el video de YouTube, revisar que la consola del navegador no muestre errores y volver a cargar el carrito para observar que persiste. Después de ese recorrido solo quedan evidencias externas: GitHub, video de la evaluación y entrega individual en AVA.
