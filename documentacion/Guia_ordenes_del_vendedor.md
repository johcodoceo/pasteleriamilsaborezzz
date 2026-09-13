# Guía de órdenes del Vendedor — Parte 8

Esta parte incorpora la consulta de órdenes definida en el apartado **Roles asociados al sistema** de las instrucciones oficiales de EV1. El Vendedor consulta productos y órdenes; el Administrador también puede acceder a estas vistas. El Cliente utiliza la tienda.

Las rutas de esta guía corresponden al ZIP, donde el sitio se encuentra en `frontend/`. En el repositorio esa carpeta se llama `dist/`.

## 1. Abrir la lista y el detalle

1. Abre `frontend/index.html` mediante Live Server, como explica el README.
2. Abre **Administración**, despliega las cuentas de ejemplo y prepáralas si aún no existen.
3. Inicia sesión con `demo.vendedor@duoc.cl` y `Vende123`.
4. Pulsa **Abrir panel de gestión** y selecciona **Órdenes**.
5. Abre **Ver detalle** junto a una orden.
6. Usa **Volver al listado de órdenes** para regresar.

Son credenciales iniciales de demostración. Si las modificaste en una parte anterior, usa tus valores actuales. Conserva el mismo navegador, host y puerto para recuperar esas cuentas.

| Perfil | Gestión disponible |
| --- | --- |
| Vendedor | Lista y detalle de productos; lista y detalle de órdenes |
| Administrador | Resumen, gestión de productos y usuarios, consulta de órdenes |
| Cliente | Tienda; sin acceso a la consulta de órdenes de gestión |
| Sin sesión | Mensaje de acceso; sin lista ni detalle visibles |

El menú de gestión del Vendedor presenta Productos y Órdenes. Las opciones Resumen, Usuarios y edición de productos se reservan al Administrador. Ambos perfiles conservan el enlace para volver a la tienda.

## 2. Qué muestran los ejemplos

Se incluyen cuatro órdenes ficticias para comprobar el funcionamiento sin introducir una confirmación de compra. Los clientes de estas órdenes son datos de ejemplo, independientes de los usuarios registrados en localStorage.

| Número | Fecha | Estado | Total |
| --- | --- | --- | ---: |
| ORD-1004 | 10-09-2026 | Pendiente | $55.000 |
| ORD-1003 | 09-09-2026 | En preparación | $102.000 |
| ORD-1002 | 08-09-2026 | Lista para retiro | $51.000 |
| ORD-1001 | 07-09-2026 | Entregada | $67.000 |

El listado ordena primero la fecha más reciente; ante fechas iguales, ordena el número de forma descendente. Cada detalle muestra fecha, estado, nombre y correo del cliente, además de los productos, mensajes, cantidades, precios unitarios, subtotales y total.

`ORD-1003` permite revisar la personalización: contiene dos tortas TC001, cada una con un mensaje diferente, y tres brownies. Las líneas de la orden conservan ambas selecciones.

## 3. Organización del código

| Archivo | Responsabilidad |
| --- | --- |
| `frontend/js/datos-ordenes.js` | Arreglo con las órdenes ficticias y sus ítems |
| `frontend/js/ordenes.js` | Consultas por perfil, copias de los datos y cálculos |
| `frontend/js/admin-ordenes.js` | Renderizado de la lista y del estado vacío |
| `frontend/js/admin-orden.js` | Lectura del número en la URL y renderizado del detalle |
| `frontend/js/administracion.js` | Control de acceso y actualización de la vista al cambiar la sesión |
| `frontend/js/utilidades.js` | Formato de precios, fechas y escape de texto |
| `frontend/admin/ordenes.html` | Estructura HTML de la lista |
| `frontend/admin/orden.html` | Estructura HTML del detalle |
| `frontend/css/estilos.css` | Sección 15: presentación de las órdenes |
| `pruebas/ordenes.test.cjs` | Diez pruebas de acceso, cálculos e integración |

Los archivos de datos y de consulta se cargan antes de la vista mediante `defer`. Se mantienen cuatro espacios de sangría y funciones pequeñas con una responsabilidad.

## 4. Cómo funciona la consulta

`Ordenes.listar()` comprueba la sesión actual y devuelve copias de las órdenes, con sus totales calculados. `Ordenes.buscar(numero)` vuelve a comprobar el perfil y devuelve la copia de la orden seleccionada, o `null` si no existe.

La lista forma un enlace como `orden.html?id=ORD-1003`. El detalle usa `URLSearchParams` para leer `id`. Un número ausente o desconocido produce un mensaje y deja disponible el enlace para volver al listado; no muestra otra orden como reemplazo.

La vista reutiliza `Administracion.conectar()`. Al cerrar la sesión, perder el perfil autorizado o producirse un error de acceso, oculta y limpia las filas o el detalle. El módulo de consulta también comprueba el perfil en cada llamada. El control compartido atiende cambios de cuentas, sesión, almacenamiento de otra pestaña y retorno desde la caché de navegación.

Este control corresponde a la simulación frontend de EV1. Los archivos JavaScript y sus ejemplos son públicos dentro del proyecto; todavía no existe autorización de servidor ni una base de datos de órdenes reales.

## 5. Precios históricos y totales

Cada ítem guarda su código, nombre, precio unitario, cantidad y mensaje. No vuelve a buscar el precio en el inventario al mostrar la orden. Esto permite conservar la información de una venta histórica aunque el catálogo cambie después.

Los cálculos son:

- **Subtotal:** precio unitario × cantidad.
- **Total:** suma de los subtotales de los ítems.

Internamente se convierten los precios a centavos para evitar acumular errores al sumar decimales. El resultado se presenta en pesos chilenos, con hasta dos decimales. El precio unitario se redondea a dos decimales antes de calcular cada subtotal. No se guarda un total manual en los ejemplos.

La consulta no agrupa mensajes distintos, no reserva ni descuenta stock y no altera el carrito. Los ejemplos no incorporan tarifas de envío, descuentos ni cobros nuevos.

## 6. Modificar o agregar un ejemplo

Edita `frontend/js/datos-ordenes.js`. Puedes copiar un objeto existente dentro del arreglo `window.DATOS_ORDENES` y asignarle un número distinto:

```javascript
    {
        numero: "ORD-1005",
        fecha: "2026-09-10",
        estado: "Pendiente",
        cliente: {
            nombre: "Cliente de ejemplo",
            correo: "cliente@example.com",
        },
        items: [
            {
                codigo: "PI002",
                nombre: "Tiramisú Clásico",
                precioUnitario: 5500,
                cantidad: 2,
                mensaje: "",
            },
        ],
    },
```

Ese ejemplo produce un total de $11.000. Mantén el número de orden único, una fecha válida en formato `AAAA-MM-DD`, cantidades enteras positivas, precios numéricos no negativos con hasta dos decimales y un arreglo de ítems. El mensaje puede quedar vacío; para las tortas se conserva el criterio de hasta 60 caracteres de la personalización anterior.

Los estados iniciales son ejemplos de presentación. No existe un formulario de edición ni una transición automática de estados; si cambias los ejemplos a mano, revisa que sus datos sean coherentes. Los correos `example.com` identifican datos ficticios y no son cuentas registradas en el formulario de la tienda.

Guarda el archivo y recarga el sitio. No necesitas limpiar localStorage, ya que estas órdenes se leen del archivo JavaScript. Para comprobar el estado vacío durante el desarrollo, utiliza temporalmente `window.DATOS_ORDENES = [];` y luego restaura los ejemplos.

## 7. Alcance de esta parte

Se implementan **lista y detalle de consulta** para Vendedor y Administrador. La confirmación de compras desde el carrito, la creación de órdenes reales, la edición de estados, los pagos, las boletas y el seguimiento de entregas requieren un bloque posterior con el alcance acordado con el docente.

Los datos actuales permiten demostrar las dos vistas sin simular ventas como si ya se hubieran realizado. Las cuentas y el carrito conservan la persistencia implementada en las partes anteriores.

## 8. Verificación y recorrido manual

Las diez pruebas nuevas comprueban accesos por perfil, identificadores desconocidos, mensajes independientes, cálculos, copias de los datos, conservación del historial y ausencia de cambios en carrito o almacenamiento. Se ejecutan junto con las sesenta pruebas anteriores mediante el comando del README.

La revisión de interacción en navegador queda pendiente. Antes de presentar:

1. Inicia sesión como Vendedor: comprueba que en gestión aparecen Productos y Órdenes, y que los productos solo se pueden consultar.
2. Abre las cuatro órdenes y compara sus datos y totales con el listado.
3. Revisa los dos mensajes de `ORD-1003` y su total de $102.000.
4. Cambia el parámetro de su URL a `id=ORD-9999`: comprueba el mensaje y el enlace para volver.
5. Cierra la sesión desde un detalle: comprueba que desaparece la información; vuelve atrás y verifica que se solicita acceso.
6. Inicia sesión como Cliente e intenta abrir la lista mediante su ruta directa.
7. Inicia sesión como Administrador y verifica que también puede consultar las órdenes.
8. Cambia el precio de TC001 en administración y comprueba que sus órdenes conservan el precio registrado. Restaura el precio al terminar.
9. Usa Tab para recorrer enlaces y controles. En una pantalla estrecha, verifica que la tabla pueda desplazarse horizontalmente dentro de su contenedor.

Estas acciones completan la comprobación de las vistas en el navegador que utilizarás para la evaluación; no se declaran realizadas automáticamente.
