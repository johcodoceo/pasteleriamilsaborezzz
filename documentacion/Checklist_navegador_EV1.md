# Pauta de revisión en navegador

DSY1104 · Forma C · Mil Sabores · cierre EV1

**Estado manual: pendiente de recorrido final con Live Server.** Se realizó una verificación técnica asistida en Chromium sobre navegación/renderizado, detalles de producto, menú móvil, validaciones vacías, carrito y vistas administrativas. Esos resultados están en `Cierre_EV1_Ajustes_y_Verificacion.md`; esta pauta se conserva para registrar la comprobación manual del equipo antes de entregar.

## Preparación

1. Descomprime la Parte 10 y abre `Mil_Sabores` en Visual Studio Code.
2. Ejecuta `frontend/index.html` con Live Server. Mantén el mismo host y puerto durante toda la revisión para conservar los datos.
3. Utiliza un perfil de navegador destinado a pruebas o conserva tus datos actuales. No borres todo el almacenamiento del navegador para iniciar esta pauta.
4. En Administración, abre las cuentas de ejemplo y pulsa **Preparar cuentas de demostración**, si aún no existen.
5. Usa las credenciales iniciales del README, o las que hayas definido al modificarlas. Crea un Cliente ficticio mediante Registro para comprobar ese perfil.
6. Abre las herramientas de desarrollo para registrar errores de consola y recursos fallidos. Un error de un proveedor externo debe anotarse junto con su efecto visible.

| Dato de la revisión | Completar |
| --- | --- |
| Persona que revisa | |
| Fecha y hora | |
| Versión o commit del GitHub del grupo | |
| Navegador y versión | |
| Sistema operativo | |
| Dirección local utilizada | |
| Tamaños de pantalla | Sugeridos: 1366 × 768 y 390 × 844; anotar los utilizados |

## Tienda y multimedia

| ID | Pasos | Resultado esperado | Estado |
| --- | --- | --- | --- |
| NAV-01 | Desde Inicio, recorrer Productos, Nosotros, Blog, Contacto, Registro, Acceso y Carrito; usar también el footer | Todas las rutas abren la vista correspondiente; los enlaces para volver funcionan | Pendiente |
| NAV-02 | Abrir las ocho categorías y los detalles de los 16 productos iniciales | Códigos, nombres, precios e imágenes corresponden al catálogo del ERS; no aparecen imágenes rotas | Pendiente |
| NAV-03 | Abrir cada uno de los dos artículos del blog y volver al listado | Se muestran título, imagen y texto completo del artículo elegido | Pendiente |
| NAV-04 | Reproducir el video del blog con internet; comprobar también el enlace a YouTube | El reproductor reproduce la receta; anotar cualquier bloqueo del proveedor aunque el enlace externo funcione | Pendiente |
| NAV-05 | Abrir un detalle de producto con un código inexistente y un artículo con identificador inexistente, conservando el nombre del parámetro de la URL | Se muestra un aviso comprensible y una opción para volver; no queda una vista vacía sin explicación | Pendiente |

## Carrito y personalización

Para los importes siguientes, utiliza el catálogo inicial sin cambios: TC001 vale $45.000 y PG001 vale $4.000. Comprueba primero estos casos sin sesión para observar los importes sin beneficios; después realiza los casos BEN. Si ya modificaste los productos, registra sus precios actuales y calcula el resultado esperado antes de probar. El total puede incluir selecciones previas; identifica las líneas que crees durante la revisión.

| ID | Pasos | Resultado esperado | Estado |
| --- | --- | --- | --- |
| CAR-01 | Agregar una TC001 sin mensaje y dos PG001; abrir Carrito | Aparecen cantidades 1 y 2, subtotales $45.000 y $8.000; esas selecciones suman $53.000 con datos iniciales | Pendiente |
| CAR-02 | Aumentar y disminuir cantidades; intentar cero, fracción y una cantidad superior al stock; eliminar una selección con su botón | Solo se conservan cantidades enteras válidas; los importes se actualizan y la eliminación afecta la selección elegida | Pendiente |
| CAR-03 | Agregar una torta con `¡Feliz cumpleaños, Ana!`; recargar y volver a abrir Carrito | Se conservan producto, cantidad y mensaje bajo el mismo origen; el contador del menú coincide | Pendiente |
| CAR-04 | Agregar TC001 con `Para Ana` y luego con `Para Luis`; repetir `Para Ana` | Hay líneas separadas por mensaje; la selección con el mismo mensaje aumenta su cantidad | Pendiente |
| CAR-05 | Editar `Para Luis` para que quede `Para Ana`; después guardar un mensaje vacío y probar Cancelar en otra edición | Los mensajes iguales agrupan cantidades; el vacío quita el mensaje; Cancelar conserva el valor anterior | Pendiente |
| CAR-06 | Probar un mensaje de 60 caracteres y otro mayor; intentar pegar un salto de línea | El máximo se controla sin guardar texto inválido; el campo de una línea y sus mensajes resultan comprensibles | Pendiente |

## Formularios y sesión

Los RUN de ejemplo solo sirven para la demostración. Utiliza correos y direcciones ficticios; el registro no envía mensajes de confirmación. Si `123456785` ya está registrado, úsalo para comprobar la detección de duplicados y emplea otro RUN válido de prueba para el alta nueva.

| ID | Pasos | Resultado esperado | Estado |
| --- | --- | --- | --- |
| FOR-01 | Enviar Registro vacío; después probar RUN `123456789`, correo `prueba@example.com` y contraseña de tres caracteres | No se crea una cuenta; aparecen errores específicos junto a los campos correspondientes | Pendiente |
| FOR-02 | Completar Registro con RUN válido, nombre, apellidos, correo permitido, región, comuna, dirección y contraseña coincidente de 4 a 10 caracteres | Se registra un Cliente; los campos inválidos anteriores dejan de mostrar su error al corregirse según el comportamiento del formulario | Pendiente |
| FOR-03 | Introducir una fecha de nacimiento futura; cambiar de región después de elegir comuna | Se rechaza la fecha futura; cambian las comunas y se retira una selección incompatible | Pendiente |
| FOR-04 | Repetir RUN o correo registrado; probar un código promocional distinto de FELICES50 y luego FELICES50 | Se impiden duplicados y códigos inválidos; el código del alta se conserva y permite obtener el 10% después de iniciar sesión, salvo que corresponda el 50% | Pendiente |
| FOR-05 | Iniciar sesión con contraseña incorrecta y después correcta; recargar; cerrar sesión | El acceso incorrecto falla con mensaje; el correcto mantiene sesión en la pestaña; cerrar sesión retira el acceso | Pendiente |
| FOR-06 | En Contacto, enviar nombre o comentario vacío; probar correo inválido; corregir y enviar con correo permitido o sin correo | Los errores impiden la confirmación; los datos válidos muestran la confirmación local e indican que no se envía un mensaje | Pendiente |

## Administración y órdenes

Crea registros destinados a estas pruebas. Por ejemplo, un producto con código `QAP001`, nombre `Producto de prueba EV1`, precio 1000 y stock 3. No lo uses si ese código ya pertenece a un registro que quieras conservar. Elimina únicamente los registros de prueba que hayas identificado.

| ID | Pasos | Resultado esperado | Estado |
| --- | --- | --- | --- |
| ADM-01 | Como Administrador, abrir Resumen, Productos, Usuarios y Órdenes; buscar y consultar un registro | Se muestran las vistas y datos correspondientes; los indicadores coinciden con el inventario actual | Pendiente |
| ADM-02 | Crear el producto de prueba; editarlo con precio 0 y luego 1000,50; probar stock fraccionario o negativo; poner stock crítico igual al stock | Se aceptan precios no negativos y decimales; se rechaza stock inválido; aparece alerta al alcanzar el umbral; el código permanece igual | Pendiente |
| ADM-03 | Cambiar la imagen del producto de prueba por una ruta local existente; probar una URL inválida; recargar | La imagen válida se muestra y persiste; el formulario rechaza una dirección inválida | Pendiente |
| ADM-04 | Agregar el producto de prueba al carrito; reducir su stock, cambiar su precio y finalmente eliminarlo desde Administración | El carrito ajusta cantidades y precio; tras la eliminación retira ese producto; otros productos se conservan | Pendiente |
| ADM-05 | Crear un usuario ficticio, editar nombre y perfil, dejar contraseña vacía; luego cambiarla con confirmación y eliminar esa cuenta de prueba | Los cambios persisten; contraseña vacía conserva la anterior; la nueva exige coincidencia; la cuenta eliminada ya no accede | Pendiente |
| ADM-06 | Revisar las opciones para editar el perfil de tu Administrador y eliminar tu propia cuenta | La aplicación impide quitarse el perfil Administrador y eliminar la cuenta de la sesión | Pendiente |
| ORD-01 | Como Vendedor, abrir el panel y entrar a Productos y Órdenes; intentar abrir directamente Usuarios y Resumen | Solo puede consultar Productos y Órdenes; las vistas reservadas requieren perfil Administrador | Pendiente |
| ORD-02 | Abrir la lista de órdenes y luego `ORD-1003`; volver a la lista | Lista desde ORD-1004 a ORD-1001; ORD-1003 contiene dos TC001 con mensajes distintos y tres PG001; total histórico $102.000 | Pendiente |
| ORD-03 | En la URL del detalle usar `id=ORD-9999`; luego cerrar sesión e intentar abrir una orden válida; repetir con Cliente | El identificador desconocido muestra aviso y retorno; sin sesión y con Cliente no se muestran los datos de gestión | Pendiente |

## Beneficios del carrito

Preparar cuentas y selecciones de prueba según `Guia_beneficios.md`. Los importes siguientes suponen precios iniciales y ausencia de otras selecciones.

| ID | Pasos | Resultado esperado | Estado |
| --- | --- | --- | --- |
| BEN-01 | Registrar una cuenta con FELICES50, iniciar sesión y agregar una TC001; recargar | Subtotal $45.000, descuentos $4.500 y total $40.500; la recarga conserva productos y beneficio | Pendiente |
| BEN-02 | Probar una cuenta al cumplir 50 y otra al cumplir 51, ambas con FELICES50, con una TC001 | A los 50 se aplica 10%; desde 51 se aplica 50% y el total es $22.500; los porcentajes no se suman | Pendiente |
| BEN-03 | Usar una cuenta @duoc.cl con cumpleaños de hoy y FELICES50; agregar dos TE001 con mensajes diferentes y tres PG001 | Se identifica una unidad gratuita; subtotal $122.000, descuentos $61.700 y total $60.300 | Pendiente |
| BEN-04 | Cambiar cantidades y mensajes, quitar la línea gratuita, cerrar sesión y volver al carrito | Se mantiene una sola unidad gratuita si queda TE001; al salir de la cuenta desaparecen sus beneficios y se conservan las selecciones | Pendiente |
| BEN-05 | Probar cumpleaños con correo @profesor.duoc.cl o con otro día de nacimiento; probar correo @duoc.cl válido sin TE001 en el carrito | Los primeros casos no obtienen regalo; en el último se ofrece elegir TE001 si hay stock, sin agregarla automáticamente | Pendiente |
| BEN-06 | Editar nombre o dirección de una cuenta con FELICES50 desde Administración y volver a su carrito; revisar el campo promocional al editar | El código queda de solo lectura, se conserva y el beneficio sigue disponible; el detalle de condiciones explica la combinación | Pendiente |

## Presentación, teclado y consola

| ID | Pasos | Resultado esperado | Estado |
| --- | --- | --- | --- |
| VIS-01 | Recorrer Inicio, catálogo, detalle, carrito, Registro y gestión en los dos tamaños de pantalla registrados | Texto, imágenes y controles permanecen legibles; no hay desbordamiento horizontal general; las tablas permiten desplazamiento dentro de su contenedor cuando lo necesitan | Pendiente |
| VIS-02 | Recorrer menús, formularios, carrito, editor de mensajes y órdenes con Tab, Shift+Tab, Enter y Espacio | El foco se ve, el orden permite completar las tareas y los controles se activan con el teclado correspondiente | Pendiente |
| VIS-03 | Durante los casos anteriores, revisar consola y solicitudes de imágenes, CSS y JavaScript | No hay excepciones de la aplicación ni archivos locales que fallen; registrar por separado cualquier fallo externo y su efecto | Pendiente |

## Registrar los resultados

Actualiza Estado con **Aprobado**, **Falló** o **Bloqueado** únicamente después de ejecutar el caso. Conserva Pendiente si aún no se probó. Registra el comportamiento observado, incluso si coincide con el esperado.

| ID revisado | Resultado observado | Evidencia o captura | Persona y fecha | Corrección y nueva comprobación, si aplica |
| --- | --- | --- | --- | --- |
| | | | | |

Al terminar, retira únicamente los registros y selecciones creados para las pruebas. Anota cualquier cambio que deba conservarse en la versión entregada y actualiza `Registro_verificacion_EV1.md` con los resultados reales.
