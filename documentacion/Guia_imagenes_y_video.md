# Guía de imágenes y video — Parte 7

Esta guía explica los archivos nuevos y cómo modificarlos. Las rutas corresponden al ZIP, donde el sitio se encuentra en `frontend/`. En el repositorio esa carpeta se llama `dist/`.

## 1. Qué se agregó

Los 16 productos iniciales tienen una imagen local. Se incorporaron 15 PNG y se reutilizó la imagen de chocolate de la portada para PV001. Los dos artículos del blog usan imágenes tanto en el listado como en su página completa. El blog también incluye un video de una receta de torta tres leches.

Se conservan los códigos, precios, existencias de demostración, usuarios y funcionamiento del carrito de la Parte 6.

| Archivo o carpeta | Responsabilidad |
| --- | --- |
| `frontend/assets/productos/` | Quince imágenes nuevas, identificadas por código |
| `frontend/assets/torta-chocolate.jpg` | Imagen anterior: portada, PV001 y artículo de tradición |
| `frontend/js/productos.js` | Ruta inicial de imagen de cada producto |
| `frontend/js/inventario.js` | Selección de la imagen inicial o la guardada por el Administrador |
| `frontend/js/catalogo.js` | Imagen y enlace de cada tarjeta del catálogo |
| `frontend/js/detalle-producto.js` | Fotografía y nota ilustrativa en el detalle |
| `frontend/js/admin-productos.js` | Vista previa y detalle en administración |
| `frontend/blog.html` | Imágenes del listado y video incrustado |
| `frontend/js/blog.js` | Imagen y texto alternativo de cada artículo completo |
| `frontend/css/estilos.css` | Presentación compartida; sección 14 para imágenes y video |

## 2. Cambiar una imagen desde el panel

1. Copia tu imagen en `frontend/assets/productos/`, por ejemplo `mi-torta.jpg`.
2. Inicia sesión como Administrador y abre **Productos**.
3. Pulsa **Editar** en el producto correspondiente.
4. En **Imagen**, escribe `assets/productos/mi-torta.jpg`.
5. Sal del campo para actualizar la vista previa y pulsa **Guardar producto**.

La ruta se escribe desde la raíz de `frontend/`, sin anteponer `frontend/` ni `../`. La página administrativa agrega internamente `../` porque está dentro de `admin/`. También puedes usar una URL `https://` que apunte directamente a una imagen.

El campo configura una ruta; no sube archivos al proyecto. Debes copiar primero el archivo local. Se mantienen las validaciones de la Parte 5: una ruta inválida no se acepta. Una URL válida puede fallar si su servidor deja de servir la imagen.

En un producto inicial, dejar la imagen vacía utiliza la foto configurada en `productos.js`. En un producto nuevo cuyo código no existe en los datos iniciales, un campo vacío deja el producto sin fotografía. El Administrador debe darle una ruta para mostrarla.

## 3. Cambiar la imagen inicial desde el código

Busca el código del producto en `frontend/js/productos.js` y modifica su propiedad `imagen`:

```javascript
    "imagen": "assets/productos/mi-torta.jpg",
```

Usa nombres de archivo en minúsculas, sin espacios y con la extensión correcta. Las rutas distinguen mayúsculas y minúsculas en muchos servidores.

`productos.js` contiene los valores iniciales. Si ya guardaste una imagen diferente desde administración, esa configuración tiene prioridad. Para recuperar la imagen inicial, deja vacío el campo del panel y guarda. No necesitas borrar todo localStorage.

## 4. Cómo se conservan los datos anteriores

La función `Inventario.obtenerImagen(producto)` solo consulta información y devuelve una ruta:

1. Si el producto tiene una ruta propia, devuelve esa ruta.
2. Si el campo está vacío, busca la imagen inicial del mismo código.
3. Para TC001, reconoce la antigua ruta compartida `assets/torta-chocolate.jpg` y devuelve la nueva foto cuadrada.
4. Si no existe producto o imagen disponible, devuelve una cadena vacía.

La excepción de TC001 corrige la imagen circular usada en las partes anteriores. Si eliges esa misma ruta antigua expresamente para TC001, también se mostrará la nueva imagen cuadrada; utiliza otro nombre de archivo para una imagen propia.

Esta función no guarda, elimina ni modifica registros. Se sigue usando `milSabores.productos.v1`; no hay migración del catálogo. Las imágenes nuevas no restauran productos eliminados ni cambian precios, stock o mensajes del carrito. Las fotos elegidas mediante otras rutas o URL se conservan.

Para recuperar tus datos al abrir el ZIP nuevo, utiliza el mismo navegador, host y puerto de antes. Cada origen tiene su propio almacenamiento.

## 5. Cambiar las imágenes del blog

El listado está escrito en `frontend/blog.html`. El contenido completo de los artículos está en el objeto `articulos` de `frontend/js/blog.js`.

Al cambiar una foto, actualiza ambos archivos para mantener la coherencia. En `blog.js`, modifica `imagen` y `textoAlternativo`; en el listado, modifica `src` y `alt` del elemento `img` correspondiente. El texto alternativo debe describir la imagen con una frase breve.

Las tarjetas del catálogo usan una imagen decorativa junto al enlace con el nombre del producto; por eso su `alt` está vacío. El nombre enlazado sigue disponible para lectores de pantalla y teclado. El detalle sí describe el producto en el atributo `alt`.

## 6. Video y procedencia

Se incrustó [Torta tres leches, de Recetas Nestlé CL](https://www.youtube.com/watch?v=l_NfpUOWJY0), dentro de `frontend/blog.html`. La [receta en el sitio del autor](https://www.recetasnestle.cl/recetas/torta-tres-leches) sirve como referencia adicional. Consulta de la fuente: 10 de septiembre de 2026.

El reproductor usa `https://www.youtube.com/embed/l_NfpUOWJY0`, tiene título accesible, carga diferida y no reproduce automáticamente. Se comprobó la identificación del video mediante sus metadatos públicos. La reproducción dentro del sitio todavía debe comprobarse en navegador.

Para reemplazarlo:

1. Elige un video pertinente cuyo autor permita insertarlo.
2. En YouTube, utiliza **Compartir → Insertar** para obtener su dirección de reproducción.
3. Reemplaza el `src` del `iframe` en `blog.html`.
4. Actualiza el título del reproductor, el texto de presentación, el crédito y el enlace **Ver la receta en YouTube**.
5. Registra la nueva fuente en esta guía y comprueba la reproducción desde Live Server.

El video requiere conexión a internet y disponibilidad en YouTube. El enlace al video permanece visible si el reproductor no funciona. No se distribuye una copia del video dentro del ZIP.

Este recurso forma parte del contenido de la tienda. **El equipo todavía debe grabar su propio video explicativo de la EV1**, con la participación y forma de entrega indicadas por el docente.

## 7. Procedencia de las imágenes

Las quince imágenes nuevas se generaron con ImageGen para esta parte del prototipo. Se conservaron sus PNG originales, de 1536 × 1024 píxeles, sin retoques. Los prompts completos están en `Prompts_imagenes_Parte_7.md`; cada encabezado corresponde al código de un producto y a su archivo en minúsculas.

La imagen `torta-chocolate.jpg` se generó para la Parte 2, el 8 de septiembre de 2026, según su registro de avance. Se reutiliza como ilustración de PV001 y del artículo de tradición. Las imágenes ilustran la presentación; los nombres y las características de los productos proceden del caso académico.

| Código | Imagen dentro de frontend/assets/ |
| --- | --- |
| TC001 | `productos/tc001.png` |
| TC002 | `productos/tc002.png` |
| TT001 | `productos/tt001.png` |
| TT002 | `productos/tt002.png` |
| PI001 | `productos/pi001.png` |
| PI002 | `productos/pi002.png` |
| PSA001 | `productos/psa001.png` |
| PSA002 | `productos/psa002.png` |
| PT001 | `productos/pt001.png` |
| PT002 | `productos/pt002.png` |
| PG001 | `productos/pg001.png` |
| PG002 | `productos/pg002.png` |
| PV001 | `torta-chocolate.jpg` |
| PV002 | `productos/pv002.png` |
| TE001 | `productos/te001.png` |
| TE002 | `productos/te002.png` |

La imagen de PT001 representa una empanada abierta con relleno de manzana; la forma exterior de sus dos piezas es una interpretación ilustrativa. No se usaron fotografías de pastelerías ajenas.

## 8. Recorrido manual antes de la evaluación

Estas comprobaciones quedan para ejecutar en navegador; no se declaran realizadas:

1. Abre el catálogo y revisa las fotos de las ocho categorías.
2. Entra a una torta cuadrada, una circular y un postre individual: comprueba que el detalle corresponde a la tarjeta.
3. Personaliza una torta, agrégala al carrito y recarga. Revisa el mensaje y la cantidad.
4. Desde administración, cambia una imagen y vuelve al catálogo. Luego vacía el campo y comprueba la imagen inicial.
5. Abre ambos artículos del blog y reproduce el video, con conexión a internet.
6. Reduce el ancho de la ventana: comprueba que las fotos y el reproductor no provoquen desplazamiento horizontal.
7. Recorre enlaces y controles con Tab; activa el enlace del video y comprueba el foco visible.

Los estilos conservan las proporciones de las imágenes y del video. Las tarjetas cargan las imágenes de forma diferida, y la sección del video pasa a una columna en pantallas estrechas. La revisión anterior permite comprobar estos comportamientos en el navegador que usarás en la presentación.
