# Guía de código — personalización de tortas

Parte 6 · Pastelería Mil Sabores · DSY1104, Forma C

## 1. Resultado que puedes utilizar

El detalle de las tortas habilitadas permite escribir un mensaje antes de agregarlas al carrito. Desde el carrito puedes editarlo, agregar uno a una torta que no lo tenía o quitarlo guardando el campo vacío. **Guardar mensaje** confirma la edición; **Cancelar** descarta únicamente ese borrador.

La misma torta puede aparecer varias veces si los mensajes son distintos. Cada línea tiene su cantidad y subtotal, mientras que todas comparten el stock del producto. El contador de la cabecera sigue mostrando unidades, no cantidad de mensajes.

Este bloque conserva el catálogo, registro, acceso, contacto y administración de la Parte 5. Es un prototipo local: no confirma pedidos, no reserva stock ni procesa pagos.

## 2. Reglas y decisiones del prototipo

| Regla | Comportamiento |
| --- | --- |
| Mensaje opcional | Vacío significa sin mensaje personalizado |
| Longitud | Hasta 60; el máximo es una decisión del prototipo, no una cifra del enunciado |
| Una línea | Se rechazan saltos, tabulaciones y caracteres de control |
| Escritura | Se conservan mayúsculas, signos, tildes, emojis y espacios internos |
| Normalización | Se eliminan espacios al inicio y al final y se normalizan tildes equivalentes con NFC |
| Igualdad | Se agrupan únicamente código y mensaje normalizado iguales |
| Precio | El mensaje no tiene recargo en esta entrega |
| Cantidad | Entera entre 1 y el menor valor entre stock y 99, sumando líneas del mismo código |
| Productos admitidos | Depende del booleano `personalizable`, editable en administración |

El contador usa `String.length`, igual que el límite nativo del campo HTML: algunos emojis ocupan más de una unidad UTF-16. Los espacios exteriores desaparecen al guardar. No se transforma el texto en mayúsculas ni se eliminan los espacios internos.

Los mensajes se muestran con `textContent`. Por ejemplo, `<b>Feliz</b>` se muestra como texto, sin convertirse en una etiqueta HTML.

## 3. Organización de los archivos

| Archivo | Responsabilidad |
| --- | --- |
| `frontend/js/productos.js` | Productos iniciales y su opción `personalizable` |
| `frontend/js/inventario.js` | Catálogo persistente y compatibilidad con productos de la Parte 5 |
| `frontend/js/validaciones.js` | Límite, normalización y validación del mensaje |
| `frontend/js/personalizacion.js` | Campo compartido: contador, errores y lectura del texto |
| `frontend/js/detalle-producto.js` | Presentación del detalle y agregar con cantidad y mensaje |
| `frontend/js/carrito.js` | Identidad de las líneas, operaciones, stock y persistencia |
| `frontend/js/carrito-vista.js` | Controles y editor de cada línea del carrito |
| `frontend/carrito.html` | Plantilla HTML que se clona para cada línea |
| `frontend/js/formularios.js` | Lectura de casillas como booleanos, incluyendo las desmarcadas |
| `frontend/admin/productos.html` y `frontend/js/admin-productos.js` | Configuración de personalización por producto |
| `frontend/css/estilos.css`, sección 13 | Estilos del mensaje, editor y casilla administrativa |
| `pruebas/personalizacion.test.cjs` | Casos de lógica e integración específicos de este bloque |

El HTML y el CSS presentan los controles; `carrito.js` trabaja con los datos. Por eso un cambio de estilo no requiere modificar los cálculos ni el almacenamiento.

## 4. Formato del carrito

Antes se guardaban solo código y cantidad. Ahora cada línea incorpora `mensaje`:

```json
[
    {
        "codigo": "TC001",
        "cantidad": 1,
        "mensaje": "¡Feliz cumpleaños, Ana!"
    },
    {
        "codigo": "TC001",
        "cantidad": 2,
        "mensaje": "¡Felicidades, Luis!"
    }
]
```

Esta selección representa tres unidades del mismo producto. Los nombres, precios y permisos se consultan en el inventario actual; no se aceptan precios escritos dentro del carrito guardado.

`crearClaveLinea()` representa la identidad mediante `JSON.stringify([codigo, mensaje])`. La vista usa esa clave para reconocer una línea incluso cuando otra tiene el mismo código. La clave se calcula; no hace falta duplicarla en localStorage. Los identificadores de campos HTML se generan por separado para evitar repeticiones.

## 5. Funciones que puedes reutilizar

```javascript
// Agregar una unidad personalizada.
Carrito.agregar("TC001", 1, "¡Feliz cumpleaños, Ana!");

// Cambiar solo la cantidad de la línea que tiene ese mensaje.
Carrito.cambiarCantidad("TC001", 2, "¡Feliz cumpleaños, Ana!");

// Cambiar el mensaje de esa línea.
Carrito.cambiarMensaje("TC001", "¡Feliz cumpleaños, Ana!", "¡Felicidades, Ana!");

// Eliminar únicamente esa selección.
Carrito.eliminar("TC001", "¡Felicidades, Ana!");

// Agregar sin mensaje sigue funcionando como en las partes anteriores.
Carrito.agregar("TC001", 1);
```

Cada operación devuelve un resultado con `exito` y `mensaje`. Una operación que intenta guardar incluye además `guardado`: si vale `false`, el cambio está disponible en memoria pero podría perderse al recargar. La interfaz muestra el aviso correspondiente.

Si cambias un mensaje por otro que ya existe en el mismo producto, se suman las cantidades en una única línea. Cambiar el mensaje no modifica el total de unidades ni el precio.

## 6. Habilitar tortas y cambiar el límite

Inicialmente permiten mensajes `TC001`, `TC002`, `TT001`, `TT002`, `PSA001`, `PV001`, `TE001` y `TE002`: las ocho tortas del catálogo. Los otros productos empiezan deshabilitados para esta función. Es una configuración inicial ajustable; no se decide buscando palabras en el nombre del producto.

Para cambiarlo, ingresa como Administrador, abre **Productos**, edita el registro y marca o desmarca **Permitir un mensaje personalizado en este producto**. La configuración se guarda junto al producto. Si lo desactivas, se retiran las selecciones que tenían mensaje y se avisa; las selecciones sin mensaje se conservan.

Para modificar la longitud máxima, cambia una sola constante en `frontend/js/validaciones.js`:

```javascript
const MAX_MENSAJE_TORTA = 60;
```

El campo, su ayuda y el contador utilizan esa constante. Si reduces el máximo, los mensajes guardados que ya no cumplan la regla se retirarán al recuperar el carrito; revisa esa decisión antes de cambiarla y ajusta las pruebas de límites.

## 7. Continuar desde la Parte 5

1. Descomprime esta entrega y ábrela con Live Server, como indica el README.
2. Conserva el mismo navegador, host y puerto si quieres recuperar los datos previos.
3. El carrito busca primero `milSabores.carrito.v2`.
4. Si no existe, lee `milSabores.carrito.v1`, valida sus productos y cantidades, asigna el mensaje vacío y guarda el nuevo formato.
5. La clave anterior queda intacta como respaldo. Vaciar el carrito escribe `[]` en v2 para impedir que ese respaldo se importe otra vez.

Si v2 ya existe, tiene prioridad aunque esté vacía o dañada. Los datos inválidos generan un aviso y no se recupera automáticamente una selección antigua. Si el navegador bloquea la escritura durante la migración, la copia anterior se mantiene y aparece un aviso.

Los productos guardados antes de esta parte no tenían la opción `personalizable`. Los códigos originales reciben la configuración inicial indicada arriba; los productos adicionales empiezan en `false` y puedes activarlos desde administración. Una desactivación explícita se respeta al recargar.

Continúa usando esta entrega: la Parte 5 no conoce los mensajes ni la clave v2. Para reiniciar únicamente el carrito de prueba desde las herramientas del navegador, elimina ambas claves de carrito y recarga. No uses `localStorage.clear()`, porque también borraría tus productos y cuentas locales.

## 8. Qué ocurre con el stock

Con stock 20, una selección de 12 tortas con mensaje para Ana deja 8 unidades para cualquier otro mensaje del mismo producto. El máximo del campo de cantidad de cada línea descuenta las unidades que ya están en las otras líneas.

Si el Administrador reduce el stock, se conservan las primeras líneas hasta ocupar la disponibilidad. Por ejemplo, dos líneas de 3 unidades se convierten en 3 y 1 cuando el stock baja a 4. Un producto eliminado o agotado sale del carrito. Cambiar nombre o precio mantiene los mensajes y recalcula sus importes.

El stock no se reserva ni se descuenta al agregar: esa operación corresponderá a una futura confirmación de pedido.

## 9. Comprobación realizada y recorrido manual

Se aprobaron 60 pruebas de lógica e integración, 16 de ellas nuevas. Cubren mensajes iguales y diferentes, límites, edición, agrupación, persistencia, migración, errores de almacenamiento, stock compartido y cambios del catálogo. Se revisaron además sintaxis, rutas locales, orden de scripts y asociaciones HTML mediante análisis estático. No se ejecutaron pruebas en un navegador.

Para revisar la interacción y preparar tu explicación, usa un carrito de prueba vacío:

1. Agrega una Torta Cuadrada de Chocolate con mensaje para Ana y otra para Luis. Deben aparecer dos líneas y dos unidades.
2. Agrega otra con el mismo mensaje para Ana. Deben quedar dos líneas y tres unidades.
3. Edita el mensaje de Luis para que sea exactamente el de Ana. Debe quedar una línea de tres unidades.
4. Abre el editor, escribe un borrador y pulsa **Cancelar**. Debe mantenerse el mensaje anterior.
5. Guarda el mensaje vacío. Debe mostrarse **Sin mensaje personalizado**.
6. Recarga y comprueba la cantidad y el texto guardados.
7. Repite con mensajes diferentes y verifica que su suma no exceda el stock.
8. Desde Administración, cambia stock o desactiva mensajes. Revisa el ajuste del carrito y su aviso.

El contador permite ver el límite mientras escribes. Para probar un texto de más de 60 mediante la lógica, ejecuta las pruebas incluidas; el campo HTML impide normalmente escribir más de su máximo.
