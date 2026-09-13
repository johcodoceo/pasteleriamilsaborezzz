# Registro de verificación de EV1

11 de septiembre de 2026 · DSY1104 · Forma C · cierre EV1

Este registro compara la versión acumulada con los documentos de EV1 entregados para la asignatura. Describe evidencia de código, pruebas de lógica y una verificación de renderizado/interacción en Chromium. No representa una calificación ni una aprobación del docente, y la revisión manual final con Live Server sigue siendo responsabilidad del equipo.

## Versión revisada

- Entrega revisada: versión de cierre EV1 derivada de `Mil_Sabores_Parte_10_Beneficios_del_Carrito.zip`.
- Base funcional: Parte 9, con tienda, carrito, formularios, administración, personalización, imágenes, video del blog, órdenes y ERS.
- Base acumulada: beneficios por edad, FELICES50 y cumpleaños, desglose de importes y conservación del código de registro. Ajustes de cierre: logo oficial en cabeceras, Pacifico como primera opción en `h1/h2` y correcciones responsive de desbordamiento sin alterar la lógica de negocio.
- Organización del ZIP: `Mil_Sabores/frontend`, `Mil_Sabores/documentacion` y `Mil_Sabores/pruebas`.

## Comprobaciones ejecutadas

| Comprobación | Resultado | Límite de la evidencia |
| --- | --- | --- |
| Pruebas incluidas, desde una copia extraída del ZIP | 88 aprobadas, 0 fallidas | Ejecutan lógica en Node; no controlan un navegador |
| Sintaxis JavaScript | 29 archivos sin errores de sintaxis | No demuestra que todos los eventos de interfaz funcionen |
| Inspección de 15 páginas HTML | Rutas locales y asociaciones de identificadores revisadas | No equivale a una certificación de HTML ni a navegación real |
| Referencias locales | 15/15 cabeceras usan el logo local; enlaces HTML, scripts, CSS e imágenes locales apuntan a archivos existentes | Los enlaces externos se comprueban por separado |
| Renderizado Chromium | Vistas públicas principales y 5 vistas administrativas probadas en 1366×768 y 390×844; sin excepciones ni overflow horizontal de documento | El entorno cargó dependencias locales dentro de un harness de prueba; no sustituye abrir el sitio con Live Server |
| Interacciones de cierre | 16 detalles de producto, IDs inválidos, menú móvil/Escape, validación vacía de 3 formularios, carrito y tablas admin comprobados | No cubre todas las combinaciones posibles de entrada |
| Recursos de imagen | 16 archivos locales presentes y legibles | No comprueba recortes, tamaño o disposición en pantalla |
| Compatibilidad | Las pruebas anteriores se conservan y aprueban; carrito, cuentas e imágenes existentes se mantienen | Los cálculos del carrito ahora redondean cada unidad a centavos |
| ERS editable | Documento Word con Johan Codoceo y Gabriel Rogel, revisado página por página | Sección y grupo quedan por completar |

La inspección estática incluye referencias locales de HTML, CSS y datos de imágenes, identificadores duplicados, asociaciones `label/for` y referencias ARIA a identificadores. La sangría de los archivos de código se mantiene en múltiplos de cuatro espacios. Los enlaces externos y la reproducción del video requieren la comprobación en navegador.

Las 18 pruebas nuevas comprueban edad, FELICES50, cumpleaños, acumulación, importes, fechas, persistencia, cambios de cuenta y catálogo y errores de lectura. La consulta de beneficios no guarda descuentos ni cambia las órdenes históricas.

### Pruebas reproducibles

Desde la raíz `Mil_Sabores`, con Node instalado:

```bash
node --test pruebas/carrito.test.cjs pruebas/formularios.test.cjs pruebas/administracion.test.cjs pruebas/personalizacion.test.cjs pruebas/ordenes.test.cjs pruebas/beneficios.test.cjs
```

| Archivo | Casos aprobados | Qué comprueba |
| --- | ---: | --- |
| `carrito.test.cjs` | 12 | Cantidades, importes, recuperación y persistencia |
| `formularios.test.cjs` | 14 | Validaciones compartidas y cuentas de demostración |
| `administracion.test.cjs` | 18 | Productos, usuarios, perfiles e integración con el carrito |
| `personalizacion.test.cjs` | 16 | Mensajes, agrupación, edición, migración y stock compartido |
| `ordenes.test.cjs` | 10 | Accesos, consultas, datos históricos e importes |
| `beneficios.test.cjs` | 18 | Elegibilidad, acumulación, cumpleaños, persistencia y cambios de cuenta |
| **Total** | **88** | **Lógica e integración entre módulos** |

## Verificación en navegador y comprobación manual final

Se realizó un recorrido de cierre con el motor Chromium. Debido a una política del entorno que bloquea la navegación directa a `localhost` y `file://`, la prueba cargó el HTML, CSS y JavaScript local dentro de un documento de prueba. Esto permite comprobar renderizado, eventos, DOM y errores JavaScript, pero **no equivale a abrir el ZIP con Live Server en el computador del equipo**.

Resultados de la verificación:

- vistas públicas principales renderizadas en escritorio (1366×768) y móvil (390×844), sin desbordamiento horizontal del documento ni excepciones JavaScript;
- cinco vistas de administración verificadas con una sesión de demostración válida en ambos tamaños; las tablas conservan scroll horizontal interno en móvil sin ensanchar la página;
- 16/16 detalles de producto abren por código y un código inexistente muestra `Producto no encontrado.`;
- los dos artículos válidos abren y un ID inexistente muestra `Artículo no encontrado.`;
- catálogo: 16 botones de agregado; dos clics sobre TC001 generan 2 unidades, $90.000 y almacenamiento persistente;
- menú móvil abre, actualiza `aria-expanded`, cierra con Escape y devuelve el foco al botón;
- Registro, Contacto e Inicio de sesión muestran errores personalizados al enviar vacíos;
- administración: 16 productos, 1 usuario sembrado para la prueba, 4 órdenes y 3 líneas en `ORD-1003`;
- 88/88 pruebas Node continúan aprobadas y los 29 archivos JavaScript superan `node --check`.

La pauta **Checklist_navegador_EV1.md** sigue siendo útil para el último recorrido manual. Deben comprobarse especialmente el video externo de YouTube con conexión a internet, el recorrido completo de teclado/foco en el navegador que usarán para demostrar y cualquier diferencia visual producida por la carga real de Google Fonts.

## Trazabilidad con la rúbrica

Los porcentajes corresponden a la ponderación de los indicadores en la rúbrica original. No son porcentajes de avance del proyecto.

| Indicador | Peso | Evidencia disponible | Comprobación por cerrar |
| --- | ---: | --- | --- |
| IE1.1.1: HTML, navegación, imágenes, botones, video, formularios y footer | 8% | 15 vistas HTML, recursos locales, formularios, enlaces y reproductor del blog | Renderizado e interacciones base verificados; reproducir el video y hacer recorrido manual final |
| IE1.1.2: estilos CSS externos | 10% | Hoja `frontend/css/estilos.css` enlazada desde las páginas | Escritorio/móvil y desbordamientos verificados; revisar foco completo manualmente |
| IE1.2.1: validación JavaScript de formularios | 10% | Reglas compartidas, mensajes junto a campos y pruebas de lógica | Errores vacíos verificados; completar un caso válido y uno inválido en el recorrido manual |
| IE1.3.1: operaciones y colaboración en repositorio | 12% | Proyecto preparado para versionar y guías de cambios por parte | Revisar el GitHub real del grupo y los aportes identificables de cada integrante |
| IE1.1.3: explicación de HTML y semántica | 10% | Código organizado y ERS actualizado | Cada estudiante debe localizar y explicar sus elementos y su propósito |
| IE1.1.4: explicación de CSS externo | 15% | Estilos compartidos con secciones | Explicar selectores, organización, diseño y adaptación de pantalla |
| IE1.2.2: explicación de validaciones JavaScript | 15% | Validaciones, formularios y pruebas con casos concretos | Explicar eventos, reglas y mensajes; demostrar un error y su corrección |
| IE1.3.2: justificación de cambios y colaboración | 20% | Historial de avances y responsabilidades técnicas documentadas | Explicar aportes reales, mensajes de commit e integración del equipo |

El encargo reúne el 40% y la explicación individual el 60%. Las instrucciones específicas de 2026 incorporan video grupal e interrogación escrita individual en la primera sesión de la semana 06. Un sitio con funciones implementadas no acredita por sí solo los indicadores de explicación y colaboración.

## Pendientes reales

| Pendiente | Situación comprobada | Acción necesaria |
| --- | --- | --- |
| Identificación académica | Johan Codoceo y Gabriel Rogel ya figuran en Nosotros y el ERS | Sección y grupo a cargo del equipo, según lo acordado |
| Navegador | Renderizado/interacción de cierre ejecutados en Chromium mediante harness local | Ejecutar un recorrido manual corto con Live Server, incluyendo video externo y teclado/foco |
| Decisiones de beneficios | Se aplican los tres beneficios con mayor porcentaje, una TE001 y fecha de Santiago | Contrastar con el docente las decisiones documentadas de acumulación, producto y cumpleaños; el canje anual requiere compras confirmadas y servidor |
| Regiones y comunas | Se usa un arreglo local documentado a partir de la BCN | Compararlo con el archivo complementario del docente cuando esté disponible |
| GitHub del grupo | No se ha verificado aquí su URL, acceso ni historial actual | Integrar esta versión y comprobar descarga y aportes reales |
| Video explicativo | No se ha verificado aquí un video ni un enlace de Drive | Grabar o actualizar la evidencia de esta versión y comprobar reproducción y descarga |
| AVA individual | No se ha verificado el registro de entrega de cada estudiante | Registrar grupo, caso, GitHub y Drive y comprobar el envío |

La fecha de los documentos de 2026 es el **lunes 14 de septiembre de 2026, antes de las 11:00 AM**. El PDF oficial también enumera el frontend comprimido y el ERS versión 1; revisar el formulario de AVA para adjuntarlos donde corresponda.

## Criterio para cerrar la revisión

Cerrar la revisión cuando los casos manuales aplicables tengan resultado observado y evidencia, los fallos encontrados estén corregidos o acordados con el docente, los datos del equipo estén completos y se hayan comprobado las evidencias de entrega. Registrar quién revisó y la versión utilizada. Conservar los resultados pendientes como pendientes hasta ejecutarlos.

Fuentes: rúbrica e instrucciones oficiales de EV1; instrucciones DSY1104 2026; caso Forma C; pautas de video, AVA y preentrega suministradas en el ZIP del curso.
