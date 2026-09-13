# Guía para entender y modificar el carrito

Parte 3 · DSY1104 · Mil Sabores · 9 de septiembre de 2026

## 1. Por dónde empezar

Abre primero `frontend/js/productos.js`: cada objeto representa un producto y tiene código, nombre, precio, categoría y descripción. Los precios son números, por ejemplo `45000`, sin símbolo de moneda.

Después lee `frontend/js/carrito.js`. Allí están las operaciones que trabajan con el arreglo del carrito. Finalmente revisa `frontend/js/carrito-vista.js` junto con `frontend/carrito.html`: estos archivos convierten los datos en contenido visible.

En el repositorio alojado se usa `dist/` en lugar de `frontend/`. Esta guía emplea los nombres del ZIP que trabajarás en tu computador.

## 2. Qué archivo modificar

| Si quieres cambiar… | Busca… |
| --- | --- |
| Nombre, descripción o precio de un producto | Su objeto en `productos.js` |
| Los productos destacados en el inicio | `codigosDestacados` en `catalogo.js` |
| El límite de unidades permitido | `CANTIDAD_MAXIMA` en `carrito.js` |
| La forma de agregar o acumular cantidades | `agregar()` en `carrito.js` |
| El cálculo del subtotal y total | `obtenerResumen()` en `carrito.js` |
| Cómo se guarda o recupera el carrito | `guardarCarrito()` y `cargarCarrito()` en `carrito.js` |
| El contenido de una fila del carrito | `<template id="plantilla-item-carrito">` en `carrito.html` |
| Los valores que se muestran en cada fila | `actualizarFila()` en `carrito-vista.js` |
| Los botones del carrito | Sección 3 de `carrito-vista.js` |
| Los colores, tamaños o espacios | Variables y secciones de `estilos.css` |
| El contador de la cabecera | `actualizarCabecera()` en `principal.js` |

## 3. Qué sucede al agregar un producto

1. El usuario pulsa **Agregar al carrito**.
2. `catalogo.js` obtiene el código desde el atributo `data-agregar` del botón.
3. Llama a `Carrito.agregar(codigo)`. Si no se entrega otra cantidad, agrega una unidad.
4. `agregar()` comprueba que el producto exista y que la cantidad sea válida.
5. Si el código ya está en el carrito, suma sus unidades; si no, incorpora un objeto nuevo.
6. `guardarCarrito()` convierte el arreglo a texto y lo guarda.
7. El evento `carrito:actualizado` avisa a las vistas para actualizar el contador y el resumen.

El detalle del producto usa el mismo método `Carrito.agregar()`, pero le entrega la cantidad ingresada en su formulario. Así no duplicamos las reglas en distintas páginas.

## 4. Qué se guarda en localStorage

Clave utilizada: `milSabores.carrito.v1`.

Ejemplo del contenido guardado:

```json
[
    {
        "codigo": "TC001",
        "cantidad": 2
    },
    {
        "codigo": "PI002",
        "cantidad": 3
    }
]
```

Solo se guardan códigos y cantidades. Al calcular, se consulta el nombre y precio actual del catálogo. Si alguien agrega un precio distinto dentro del JSON guardado, ese campo no se utiliza. Esto evita confiar en un precio almacenado en el carrito; la seguridad real de una futura venta deberá implementarse también en el backend.

Estas son las instrucciones centrales que puedes localizar en `carrito.js`:

```javascript
// Convierte el arreglo de JavaScript a texto.
const texto = JSON.stringify(items);

// Guarda el texto con una clave propia del proyecto.
window.localStorage.setItem(CLAVE_ALMACENAMIENTO, texto);
```

Al volver a cargar:

```javascript
// Recupera el texto, o null si todavía no existe un carrito.
const textoGuardado = window.localStorage.getItem(CLAVE_ALMACENAMIENTO);

// Convierte un JSON válido nuevamente en datos de JavaScript.
const datos = JSON.parse(textoGuardado);
```

En el código completo se comprueba primero si existe información y se utilizan bloques `try/catch`, porque la lectura, la conversión o el guardado pueden fallar.

## 5. Reglas actuales

- Una fila por código de producto. Agregar otra vez el mismo código aumenta su cantidad.
- Cantidades enteras de 1 a 99. El límite es una decisión del prototipo y está centralizado en una constante; no representa stock real.
- El botón de disminuir se desactiva en 1 y el de aumentar en 99.
- Para quitar el producto se usa **Eliminar**, no cantidad cero.
- Un cambio inválido conserva el último valor válido y muestra un error.
- Subtotal = precio del catálogo × cantidad. Total = suma de subtotales.
- El contador representa unidades totales, no el número de productos distintos.
- Los precios del catálogo actual son enteros en CLP. Se muestra moneda sin decimales. Si en administración se incorporan precios decimales, habrá que acordar el redondeo monetario y actualizar estas reglas.
- Los descuentos del caso, el despacho y la personalización siguen pendientes. No se han inventado reglas para combinarlos.

Ejemplo: 2 tortas de $45.000 y 3 tiramisús de $5.500 producen 5 unidades, dos filas y un total de $106.500.

## 6. Qué ocurre si falla el guardado

Si el navegador bloquea el almacenamiento o se llena su cuota, el carrito sigue funcionando en la página abierta, pero se muestra un aviso: los cambios podrían perderse al recargar o navegar.

Si el JSON anterior está roto, la página no se interrumpe: informa el problema y permite comenzar otra selección. Cuando parte de los datos es válida, conserva esos registros, descarta los inválidos y avisa para revisar cantidades. Las entradas duplicadas se combinan sin superar el límite.

El carrito solo modifica su propia clave. No utiliza `localStorage.clear()`, porque esa instrucción borraría también datos de otras funciones del sitio.

Dos pestañas del mismo origen se actualizan mediante el evento `storage`. Volver a una página conservada por el navegador se maneja con `pageshow`. Esto es sincronización local básica, no una base de datos multiusuario ni un sistema transaccional para ediciones simultáneas.

## 7. Por qué debes usar Live Server

localStorage está asociado al origen de la página. Abrir HTML mediante `file:` no ofrece un comportamiento uniforme entre navegadores. Por eso esta versión debe probarse con Live Server u otro servidor HTTP estático y manteniendo el mismo origen.

Cambiar el host, protocolo o puerto puede mostrar otro almacenamiento. Los datos tampoco se sincronizan automáticamente entre dispositivos ni navegadores. La navegación privada puede borrar el contenido al cerrar la sesión privada. Referencia: [Window.localStorage — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage).

## 8. Convenciones de lectura

- **Sangría de cuatro espacios:** un bloque dentro de otro se desplaza cuatro espacios a la derecha.
- **Funciones con nombres en español:** describen acciones concretas, como `cambiarCantidad()` o `renderizarCarrito()`.
- **Comentarios por sección:** explican el propósito y las decisiones, sin repetir cada línea de código.
- **Una responsabilidad por archivo:** productos, almacenamiento, vistas y menú permanecen separados.
- **const y let:** `const` para referencias que no se reasignan; `let` cuando sí es necesario reasignar.
- **Sin JavaScript dentro del HTML:** las acciones usan `addEventListener`, no atributos `onclick`.
- **defer:** los scripts esperan al HTML y se ejecutan en el orden declarado.
- **textContent:** se utiliza al colocar nombres y valores en las filas. En las plantillas de catálogo se escapa el texto antes de interpolarlo.

La forma `(function () { ... })()` define una función y la ejecuta una vez. Permite mantener variables internas fuera del alcance de los otros archivos. `window.Carrito` recibe solo el objeto con los métodos públicos listados al final. No hace falta modificar esta envoltura para cambiar precios, límites o estilos.

## 9. Orden de los scripts

Todas las páginas cargan los archivos comunes en este orden:

1. `productos.js`: datos.
2. `utilidades.js`: herramientas compartidas.
3. `carrito.js`: estado, reglas y persistencia.
4. `principal.js`: menú, contador y mensajes.
5. El archivo de la vista, cuando corresponde: `catalogo.js`, `detalle-producto.js`, `carrito-vista.js` o `blog.js`.

No cambies este orden sin revisar las dependencias. Por ejemplo, `carrito.js` necesita que el arreglo `PRODUCTOS` ya exista.

## 10. Ejercicio pequeño para practicar

1. Localiza el producto `PI002` en `productos.js` y observa su precio de `5500`.
2. Agrégalo al carrito y revisa el subtotal.
3. Cambia temporalmente el precio a `6000`, guarda y recarga desde Live Server.
4. Comprueba que el total se calcula con el precio del catálogo y no con uno guardado en localStorage.
5. Restaura el precio de `5500` para conservar el valor del enunciado.

Antes de entregar, recorre la comprobación rápida del README y asegúrate de poder explicar las funciones que modificaste.
