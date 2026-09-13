# Guía de administración de productos y usuarios

Parte 5 · Mil Sabores · DSY1104 · 9 de septiembre de 2026

## 1. Organización del código

Los HTML de `frontend/admin/` contienen los campos, etiquetas, botones y contenedores. Puedes modificar su texto directamente. No se generan los formularios completos desde JavaScript.

Los archivos `admin-productos.js` y `admin-usuarios.js` dibujan sus listados y conectan los botones. `inventario.js` y `cuentas-demo.js` administran los datos. `validaciones.js` reúne las reglas de negocio y `formularios.js` muestra sus errores. Esta separación evita copiar la regla del RUN o del correo en cada vista.

| Quiero cambiar… | Archivo principal |
| --- | --- |
| Una etiqueta o campo del producto | `frontend/admin/productos.html` |
| Una etiqueta o campo del usuario | `frontend/admin/usuarios.html` |
| Una regla de validación | `frontend/js/validaciones.js` |
| Qué se guarda de un producto | `normalizarProducto()` en `inventario.js` |
| Qué se guarda de una cuenta | `construirUsuario()` en `cuentas-demo.js` |
| Columnas o acciones de una tabla | `admin-productos.js` o `admin-usuarios.js` |
| El menú según el perfil | `administracion.js` y atributos `data-solo-admin` del HTML |
| Apariencia, espacios o tablas | Sección 12 de `frontend/css/estilos.css` |

Los límites del formulario deben coincidir con la pauta. Al cambiar un máximo autorizado, modifica tanto su validación JavaScript como `maxlength` y la ayuda del HTML.

## 2. Cómo probar el acceso

Abre el proyecto con Live Server, entra a Administración y despliega las cuentas de ejemplo. El botón de preparación agrega un Administrador y un Vendedor, conservando los clientes ya registrados. No modifica ni recupera contraseñas de cuentas existentes.

| Perfil | RUN de ejemplo | Correo | Clave inicial |
| --- | --- | --- | --- |
| Administrador | `1000005K` | `demo.admin@duoc.cl` | `Admin123` |
| Vendedor | `10000068` | `demo.vendedor@duoc.cl` | `Vende123` |

Los datos son ficticios. Si un RUN o correo de ejemplo ya está ocupado, se informa el conflicto sin reemplazar cuentas. Los valores de preparación están en `prepararDemostracion()` de `cuentas-demo.js`; si necesitas ajustarlos para otro ejercicio, utiliza datos ficticios y un RUN válido.

El inicio de sesión sigue estando en `frontend/login.html`. Una cuenta con perfil Administrador o Vendedor muestra el enlace para abrir su panel. El registro público continúa creando únicamente Clientes.

## 3. Perfiles de esta parte

| Acción | Administrador | Vendedor | Cliente/sin sesión |
| --- | --- | --- | --- |
| Usar la tienda | Sí | Sí | Sí |
| Consultar productos en el panel | Sí | Sí | No |
| Crear, editar o eliminar productos | Sí | No | No |
| Consultar o modificar usuarios | Sí | No | No |
| Ver el resumen administrativo | Sí | No | No |

Las opciones de modificación y Usuarios se ocultan al Vendedor. Abrir directamente una página no permitida muestra el acceso denegado de la demostración. Además, las funciones de escritura vuelven a comprobar el perfil; no dependen solo de ocultar botones.

Esto sigue siendo una simulación de frontend. El navegador controla estos datos y el código; no existe autorización de servidor. La seguridad real se incorporará con el backend.

La lista y detalle de órdenes del Vendedor siguen pendientes del bloque de pedidos. No hay enlaces que aparenten implementar ese flujo.

## 4. Productos: reglas y operaciones

| Campo | Regla |
| --- | --- |
| Código | Obligatorio, mínimo 3 caracteres, único sin distinguir mayúsculas; sin máximo de longitud añadido |
| Nombre | Obligatorio, máximo 100 caracteres |
| Descripción | Opcional, máximo 500 caracteres |
| Precio | Obligatorio, numérico y mayor o igual que 0; admite decimales |
| Stock | Obligatorio, entero mayor o igual que 0 |
| Stock crítico | Opcional, entero mayor o igual que 0 |
| Categoría | Obligatoria; una de las ocho categorías iniciales del caso |
| Imagen | Opcional; URL HTTPS o ruta de archivo admitida dentro de assets/ |

No se añadió un máximo comercial al precio o stock. Se rechazan valores infinitos y enteros que JavaScript no puede representar exactamente. Los campos numéricos aceptan cero; no se comprueban con una condición que confunda cero con vacío.

El código se guarda en mayúsculas, con espacios exteriores eliminados. Se conserva al editar porque el carrito lo usa para identificar el producto. Los campos restantes se pueden modificar. Si necesitas otro código, crea otro registro y elimina el anterior cuando corresponda.

### Métodos del inventario

```javascript
// Consultas: devuelven copias, sin permitir modificar el original accidentalmente.
const productos = Inventario.listar();
const producto = Inventario.buscar("TC001");

// Creación: no se entrega código original.
const respuesta = Inventario.guardar(datosDelFormulario);

// Edición: se entrega el código del registro que estamos modificando.
const cambio = Inventario.guardar(datosDelFormulario, "TC001");

// La vista pide confirmación antes de llamar a esta operación.
const eliminacion = Inventario.eliminar("TC001");
```

Las operaciones de modificación exigen la sesión de demostración de un Administrador y vuelven a validar los datos. Si hay errores de campo, devuelven un objeto `errores`; un fallo del almacenamiento produce un error que el controlador muestra sin confirmar un guardado inexistente.

### Stock crítico e imágenes

Un umbral vacío se guarda como `null`: significa que no se configuró una alerta. Un umbral de `0` es válido y produce alerta cuando el stock llega a cero. La condición es `stock <= stockCritico`, comprobando primero que el umbral no sea `null`.

Para una imagen local, agrega el archivo a `frontend/assets/` y escribe una ruta como `assets/mi-torta.jpg`. Usa nombres sin espacios: letras, números, guiones o guiones bajos. Se admiten PNG, JPG, JPEG, WEBP y GIF. Puedes usar subcarpetas. También se admite una URL HTTPS de imagen; su disponibilidad depende del sitio que la sirve.

El campo guarda una dirección, no sube archivos. La vista previa informa si no logra cargarla. Si dejas el campo vacío, se conserva una presentación sin fotografía. Las imágenes específicas de todos los productos siguen siendo contenido pendiente; no se sustituyeron por fotos inventadas.

## 5. Usuarios: reutilización y edición

El mantenedor reutiliza `Validaciones.validarUsuario()` para RUN, nombre, apellidos, correo, nacimiento, región/comuna, dirección y perfil. `validarUsuarioAdministrativo()` agrega las reglas de contraseña y código promocional necesarias para crear o editar una cuenta.

```javascript
const errores = Validaciones.validarUsuarioAdministrativo(
    datosDelFormulario,
    window.REGIONES,
    true, // true al editar; false al crear.
);
```

La creación exige una contraseña y confirmación. Al editar, dejar ambas vacías conserva la derivación anterior; escribir una nueva exige coincidencia y longitud de 4 a 10 caracteres. La contraseña anterior no se precarga ni se muestra en los listados o detalles.

El RUN se conserva como identificador. Cambiar el correo comprueba que otra cuenta no lo esté usando. Se conserva la fecha de creación. Los perfiles admitidos son Administrador, Cliente y Vendedor.

```javascript
const usuarios = CuentasDemo.listarUsuarios();
const usuario = CuentasDemo.obtenerUsuario("123456785");
const alta = await CuentasDemo.guardarUsuario(datosDelFormulario);
const edicion = await CuentasDemo.guardarUsuario(datosDelFormulario, "123456785");
```

El Administrador no puede borrar su propia cuenta ni quitarse su perfil desde esa sesión. Se comprueba también la conservación de al menos un Administrador. Estas decisiones evitan dejar el ejercicio sin una cuenta de gestión.

Las contraseñas continúan utilizando la derivación local de la Parte 4. El módulo vuelve a leer usuarios y comprobar el perfil después de esa operación asíncrona, porque otra pestaña podría haber cambiado los registros mientras se ejecutaba.

## 6. Cómo se conecta con el carrito

`productos.js` conserva los 16 productos iniciales. `inventario.js` lee la copia guardada si existe y, en caso contrario, utiliza esos datos iniciales. La tienda y el carrito consultan Inventario, por lo que no hay dos catálogos independientes.

Los valores iniciales de stock `20` y umbral `5` son ejemplos documentados, no datos comerciales del enunciado.

Al guardar un producto se emite `productos:actualizados`. El catálogo y el detalle vuelven a mostrar los datos; el carrito recalcula y ajusta su contenido cuando corresponde:

- Precio o nombre cambiado: el resumen utiliza el valor actual.
- Menor stock: la cantidad se reduce hasta el máximo disponible.
- Stock cero o producto eliminado: la línea se retira.
- Producto eliminado y creado otra vez: la línea anterior ya retirada no reaparece.
- Agregar productos al carrito: no disminuye ni reserva stock.

El carrito conserva su límite de 99 por producto, combinado con el stock. También escucha cambios de otras pestañas y la navegación hacia atrás. Las cantidades ajustadas por un cambio del catálogo se guardan; si falla esa escritura, se mantiene el aviso de que pueden perderse al recargar.

Los importes visibles usan hasta dos decimales en CLP. Los precios numéricos guardados no se redondean por esa presentación. No hay pagos, pedidos confirmados, reservas de stock ni descuentos comerciales en esta parte.

## 7. Datos guardados y recuperación de pruebas

| Clave | Almacenamiento | Contenido |
| --- | --- | --- |
| `milSabores.productos.v1` | localStorage | Catálogo editado completo |
| `milSabores.usuarios.v1` | localStorage | Perfiles y derivaciones de credenciales |
| `milSabores.carrito.v1` | localStorage | Códigos y cantidades del carrito |
| `milSabores.sesion.v1` | sessionStorage | RUN de la sesión de la pestaña |

No hay una migración destructiva: las cuentas y el carrito de la Parte 4 siguen usando las mismas claves. El stock nuevo puede ajustar cantidades antiguas mayores a las existencias de ejemplo; el carrito muestra el aviso correspondiente.

Un catálogo vacío guardado como `[]` se conserva vacío. No se vuelve a llenar automáticamente. La escritura se confirma solo después de que localStorage haya aceptado el cambio. Si un catálogo guardado está corrupto, se informa el problema y no se sobrescribe al intentar editarlo.

Mientras exista la copia guardada, editar `productos.js` no reemplaza esos cambios. Para reiniciar únicamente el catálogo de prueba, primero conserva lo que quieras recuperar y elimina solo `milSabores.productos.v1` desde las herramientas del navegador. Al recargar volverán los 16 datos iniciales. Esta operación descarta las modificaciones locales del catálogo.

Para descartar cuentas de prueba, las claves son `milSabores.usuarios.v1` y `milSabores.sesion.v1`. No uses una limpieza de todo el almacenamiento si quieres conservar otras partes. El cierre de sesión normal elimina únicamente su clave.

El almacenamiento local no ofrece transacciones entre pestañas ni persistencia compartida entre dispositivos. Estas restricciones se resolverán en la etapa de backend.

## 8. Recorrido manual para demostrar el bloque

1. Prepara las cuentas de ejemplo y accede como Administrador.
2. Abre Productos y pulsa Nuevo producto. Envía vacío para comprobar los errores.
3. Prueba stock `1.5`, precio negativo y categoría vacía: deben rechazarse.
4. Crea `PRU001`, nombre `Torta de prueba`, precio `1000.5`, stock `3`, umbral `3` y categoría Tortas Especiales. Deja la imagen vacía o usa la imagen local existente.
5. Comprueba la alerta, busca por código y abre Ver. Edita su nombre.
6. Busca ese producto en la tienda, agrega dos unidades y revisa el total del carrito.
7. Desde el panel reduce su stock a `1`: el carrito debe ajustar la cantidad. Elimina el producto con confirmación: debe retirarse del catálogo y carrito.
8. Abre Usuarios, crea un Cliente y comprueba las validaciones de RUN, correo y comuna.
9. Edita esa cuenta dejando ambas contraseñas vacías; cierra sesión e ingresa con su contraseña anterior.
10. Vuelve como Administrador, cambia su contraseña y prueba la nueva. Intenta duplicar el correo de otra cuenta.
11. Prueba eliminar o cambiar tu propio perfil Administrador: la operación debe bloquearse.
12. Cierra sesión e ingresa como Vendedor. Comprueba lista y detalle de productos, ausencia de acciones de edición y bloqueo de `admin/usuarios.html`.
13. Revisa estos recorridos en móvil, escritorio y con teclado; confirma también el funcionamiento del registro, contacto y carrito anteriores.

Este recorrido es una guía de comprobación, no un registro de pruebas visuales ejecutadas.

## 9. Pruebas automatizadas

Se aprobaron 44 pruebas de lógica: 12 de carrito, 14 de formularios/cuentas y 18 de administración e integración. Incluyen duplicados, precio cero, decimales, stock, persistencia, perfiles, conservación y cambio de contraseña, eliminación de cuentas, cambios entre pestañas y fallos de almacenamiento.

Se ejecutan los módulos reales en Node con almacenamiento y eventos simulados. La derivación de contraseña usa Web Crypto real. No se ejecutó un navegador ni se realizaron capturas de pantalla. También se verificaron rutas, campos, etiquetas, orden de scripts y sintaxis.
