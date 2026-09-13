# Parte 5 — administración de productos y usuarios

9 de septiembre de 2026 · DSY1104 · Forma C

Este avance complementa el ERS inicial y las partes anteriores. La numeración identifica entregas incrementales del proyecto; esta parte no representa el cierre completo de EV1.

## Resultado y requisitos

| Requisito del ERS inicial | Resultado actual |
| --- | --- |
| RF11 — Home administrativa | Menú visible, sesión de demostración e indicadores calculados |
| RF12 — Gestión de productos | Listar, buscar, consultar, crear, editar y eliminar con validaciones |
| RF13 — Gestión de usuarios | Listar, buscar, consultar, crear, editar y eliminar con validaciones compartidas |
| RF14 — Perfiles de demostración | Administrador, Vendedor con consulta de productos y Cliente; órdenes todavía pendientes |
| RF02/RF03 — Catálogo y detalle | Consultan los cambios persistentes; muestran imagen cuando está configurada |
| RF04/RF05 — Carrito | Respeta stock, recalcula precios y retira productos agotados o eliminados |
| RF06/RF07/RF10 — Formularios anteriores | Conservados; el acceso muestra un enlace de panel según el perfil |

La pauta revisada es `01_DUOC_Instrucciones_Oficiales_Evaluacion_1.pdf`, páginas 10–16, junto con las instrucciones específicas de 2026. Estas aclaran que EV1 no exige autenticación real, JWT, backend ni base de datos.

## Decisiones de implementación

- Se mantienen HTML, CSS y JavaScript, con código separado por responsabilidades y cuatro espacios de sangría.
- La gestión permite crear, consultar y editar; la eliminación con confirmación completa las operaciones del mantenedor.
- Código de producto y RUN se conservan al editar para mantener la identidad utilizada por carrito y sesiones. Son únicos; el correo también es único.
- Stock y stock crítico iniciales son `20` y `5` como ejemplos para los 16 productos. Códigos y precios conservan los del caso.
- Umbral vacío significa sin alerta; cero sigue siendo válido. Se alerta con igualdad o inferioridad al umbral.
- Precio admite cero y decimales. Los importes visibles se presentan con hasta dos decimales; no se añade un máximo comercial al precio o stock.
- Imagen opcional mediante ruta local o HTTPS, sin carga de archivos a un servidor.
- Cuenta pública siempre Cliente; los perfiles se asignan desde el mantenedor. La preparación de cuentas ficticias es una acción explícita para iniciar la práctica.
- Al editar, contraseña vacía conserva la credencial; cambiarla exige confirmación. No se almacenan contraseñas escritas en los registros.
- No se permite eliminar la cuenta de la sesión actual ni quitarse su perfil Administrador.
- Catálogo y usuarios se guardan en localStorage, y la sesión en sessionStorage. Las claves anteriores se conservan.
- El carrito ajusta cantidades a stock y elimina líneas no disponibles. No se reserva ni descuenta stock al agregar.
- Se mantienen errores de almacenamiento visibles y comprobaciones de perfil antes de modificar datos. Son controles del prototipo, no seguridad de servidor.

## Verificación realizada

44 pruebas de lógica aprobadas: 12 de carrito, 14 de formularios/cuentas y 18 nuevas de administración e integración. Se verificaron además las 13 páginas, referencias locales, orden de carga, asociaciones de etiquetas y errores en 36 campos validados, sintaxis de JavaScript y sangría.

No se realizaron pruebas de interacción ni revisión visual en navegador. El README y la guía incluyen pasos para demostrarlas. Los textos del código y los listados se insertan escapados o como texto; las imágenes admiten únicamente direcciones previstas por su validación.

## Pendiente para completar EV1

- Personalización de tortas y conservación de sus mensajes en el carrito.
- Beneficios de edad, código FELICES50 y cumpleaños, conforme a la política comercial acordada con el docente.
- Lista y detalle de órdenes del Vendedor según el alcance que se defina para esta etapa.
- Imágenes específicas de productos y artículos del blog, y multimedia pendiente.
- Completar datos del equipo, consolidar el ERS, revisar navegador/teclado/móvil y preparar la demostración.
- Repositorio GitHub del grupo con aportes reales de los integrantes, video explicativo y entrega individual en AVA.

Las capacidades semestrales de pago, seguimiento, boleta y backend no se consideran implementadas en esta parte.

La entrega actual es `Mil_Sabores_Parte_5_Administracion.zip`. La publicación web previa se conserva.
