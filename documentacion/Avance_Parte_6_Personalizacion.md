# Parte 6 — personalización de tortas

9 de septiembre de 2026 · DSY1104 · Forma C

Este avance continúa la Parte 5 y complementa el ERS inicial. Las partes identifican entregas incrementales; no son evaluaciones distintas ni representan el cierre de toda la EV1.

## Resultado

| Área del proyecto | Funcionalidad incorporada |
| --- | --- |
| Catálogo | Enlace Personalizar en los productos habilitados |
| Detalle | Mensaje opcional con contador, validación y agregado al carrito |
| Carrito | Líneas por código y mensaje, edición, agrupación, cantidades y eliminación independientes |
| Persistencia | Formato v2 y recuperación del carrito de la Parte 5 |
| Inventario | Stock compartido entre todas las personalizaciones del mismo producto |
| Administración | Opción para permitir mensajes al crear o editar un producto |
| Código | Campo de mensaje reutilizable, responsabilidades separadas y cuatro espacios de sangría |

El caso Mil Sabores contempla mensajes especiales en tortas. No entrega una longitud máxima ni un recargo: se adoptan 60 caracteres y ausencia de costo adicional como decisiones del prototipo. No se incorporan tamaños, sabores alternativos, tarifas ni reglas comerciales nuevas.

## Decisiones que deben conocerse

- El mensaje es opcional y de una sola línea. No se admiten controles, saltos ni tabulaciones.
- La identidad combina código y mensaje normalizado; se conservan mayúsculas y espacios internos.
- Las ocho tortas originales se habilitan inicialmente. El Administrador puede modificar esa configuración y habilitar productos nuevos.
- Cambiar un mensaje puede agrupar líneas; conserva unidades y precio.
- Las cantidades se limitan por stock y máximo 99 sumando las líneas del mismo producto.
- Reducir stock ajusta en orden; eliminar o agotar retira líneas. Desactivar mensajes retira solo las selecciones personalizadas y muestra un aviso.
- Los datos anteriores se recuperan cuando aún no existe v2. La copia v1 se conserva intacta.
- Las casillas administrativas se leen como booleanos, incluyendo `false` cuando se desmarcan.
- Los borradores sin guardar se conservan durante cambios de cantidad en el carrito, pero no se guardan al recargar.
- No se descuentan existencias ni se confirma una orden al personalizar o agregar.

## Verificación

60 pruebas de lógica e integración aprobadas: 44 anteriores y 16 de personalización. Se comprobó la conservación de mensajes al recuperar datos, la migración, los límites compartidos y los cambios del catálogo. También se revisaron las 13 páginas y 23 archivos JavaScript: rutas, sintaxis, orden de carga, asociaciones HTML y sangría.

El ZIP contiene el código y las pruebas. El README explica cómo abrirlo y la guía detalla qué modificar. La revisión de navegador, teclado y presentación móvil debe completarse con el recorrido manual; no se declara realizada en esta entrega.

## Pendiente para completar EV1

- Beneficios por edad, código FELICES50 y cumpleaños, definiendo las reglas de aplicación y acumulación con el docente.
- Lista y detalle de órdenes para el perfil Vendedor dentro del alcance de esta etapa.
- Imágenes específicas de productos y artículos del blog, y multimedia pendiente.
- Consolidar el ERS, completar datos del equipo y revisar la pauta contra el resultado final.
- Revisión en navegador y preparación de la demostración.
- GitHub del grupo con aportes reales, video explicativo y entrega individual en AVA.

La entrega es `Mil_Sabores_Parte_6_Personalizacion.zip`, con el proyecto acumulado. La publicación web anterior conserva su contenido previo.
