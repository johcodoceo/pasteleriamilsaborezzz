# Parte 8 — lista y detalle de órdenes del Vendedor

10 de septiembre de 2026 · DSY1104 · Forma C

Este bloque continúa la Parte 7 y entrega el proyecto acumulado. Implementa el acceso de consulta de órdenes mencionado en las instrucciones oficiales de EV1.

## Relación con los requisitos

En el apartado **Roles asociados al sistema**, la pauta indica que el Vendedor puede visualizar la lista y el detalle de productos y de órdenes, y que los demás accesos no deben aparecer en su vista. El Administrador tiene acceso total y el Cliente solo accede a la tienda.

La Parte 5 incorporó la consulta de productos; esta parte completa las dos vistas de órdenes y amplía la demostración de perfiles registrada como RF14 en el ERS inicial.

| Área | Resultado |
| --- | --- |
| Lista de órdenes | Cuatro ejemplos con número, fecha, cliente, estado, total y enlace al detalle |
| Detalle | Cliente, productos, mensajes, cantidades, precios unitarios, subtotales y total |
| Vendedor | Acceso a Productos y Órdenes dentro de gestión |
| Administrador | Acceso a las órdenes además de sus módulos anteriores |
| Cliente y visitante | La aplicación bloquea la lista y el detalle |
| Integridad | Los ítems conservan precios y mensajes históricos aunque cambie el catálogo |
| Navegación | Enlaces entre lista y detalle y tratamiento de número desconocido |
| Mantenimiento | Datos, consultas y presentación en archivos separados y documentados |

## Decisiones del prototipo

- Las órdenes son ficticias y están definidas en un arreglo JavaScript. Sus clientes no se vinculan con las cuentas registradas.
- La consulta no escribe localStorage ni modifica carrito o existencias.
- Los estados y fechas son ejemplos para la presentación; no se agregan operaciones para editarlos.
- Se conserva una copia del nombre, precio y mensaje de cada ítem, independiente del inventario actual.
- Los subtotales y el total se calculan desde los ítems, con importes redondeados a centavos.
- El Vendedor y el Administrador utilizan las mismas vistas de consulta.
- Se mantiene el control de sesión de demostración; no se presenta como autorización real de servidor.

Este bloque se centra en la lista y el detalle de consulta. La confirmación de compras, los pagos, las boletas y el seguimiento de entregas requieren etapas posteriores y un alcance acordado con el docente.

## Verificación

**70 pruebas aprobadas:** 60 de las partes anteriores y 10 de órdenes. Las nuevas verifican accesos por perfil, cierre de sesión, eliminación y cambio de perfil, fallos de lectura, cálculos con decimales, mensajes distintos, identificadores desconocidos y conservación de datos.

Se comprobó que consultar órdenes no modifica el almacenamiento, el carrito o el catálogo, y que editar o eliminar un producto no cambia la información histórica de sus órdenes. También se revisaron las 15 páginas HTML y los 27 archivos JavaScript: rutas, etiquetas, asociaciones de accesibilidad, orden de carga y sangría de cuatro espacios.

Las pruebas se incluyen en el ZIP. No se ejecutaron pruebas visuales ni de interacción en navegador; la guía contiene el recorrido manual para validar las vistas, el teclado y las pantallas estrechas.

## Pendiente para cerrar EV1

1. Completar los datos reales del equipo en Nosotros y en los documentos.
2. Consolidar el ERS versión 1 con lo implementado y revisar la pauta contra el resultado final.
3. Realizar la revisión en navegador: navegación, móvil, teclado, formularios, carrito, administración, órdenes y reproducción del video del blog.
4. Completar el GitHub del grupo con aportes reales, preparar el video explicativo y registrar la entrega individual en AVA.
5. Acordar con el docente el alcance de los beneficios comerciales del caso y sus reglas de aplicación y acumulación.

La fecha indicada en los documentos específicos de 2026 es el lunes 14 de septiembre de 2026, antes de las 11:00 AM. Conserva las instrucciones originales para confirmar los enlaces y la forma de entrega.

La entrega acumulada es `Mil_Sabores_Parte_8_Ordenes_del_Vendedor.zip`. El enlace web anterior conserva la publicación previa.
