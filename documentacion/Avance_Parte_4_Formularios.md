# Parte 4 — registro, inicio de sesión y contacto

Fecha: 9 de septiembre de 2026. Complementa el ERS inicial y conserva los avances anteriores como historial.

## Requisitos implementados

| Requisito del ERS inicial | Resultado de esta parte |
| --- | --- |
| RF06 — Registro | Formulario, validaciones, alta local y rechazo de duplicados |
| RF07 — Inicio de sesión | Comprobación de credenciales locales y cierre de sesión de demostración |
| RF10 — Contacto | Formulario validado y confirmación local sin envío |
| Validaciones compartidas | RUN, correo, nombres, fecha, ubicación y tipo de usuario reutilizables |
| Continuidad del carrito | Se conserva y sus 12 pruebas siguen pasando |

Se incorporó el campo de código promocional opcional. Se admite FELICES50 y se guarda la elección, pero aún no se calcula el descuento. Las fechas de nacimiento no son obligatorias y no se han aplicado todavía los beneficios de edad o cumpleaños.

## Decisiones documentadas

- Registro público siempre como Cliente; no se implementan permisos administrativos en este bloque.
- Contraseña y confirmación en registro consistentes con el login de 4–10 caracteres solicitado por la pauta.
- Correo opcional en Contacto, pues la pauta no lo marca como requerido.
- Selección obligatoria de región/comuna válida para completar la dirección; se usa un catálogo local de reemplazo basado en BCN mientras se obtiene el archivo del docente.
- Solo datos ficticios; derivación de contraseña en lugar del texto escrito; sesión de pestaña en sessionStorage.
- Errores de almacenamiento no producen confirmaciones de éxito ni borran datos previos.
- No hay correo enviado, verificación institucional, base de datos ni autenticación real.

## Validación

26 pruebas de lógica aprobadas: 14 de este bloque y 12 del carrito. Se revisaron también referencias locales, orden de carga, etiquetas y asociaciones de errores, además de la sintaxis JavaScript. La revisión visual y de interacción en navegador permanece en el recorrido manual del README.

## Pendiente para EV1

Mantenedores de productos y usuarios, perfiles administrativos de demostración y alcance de órdenes del Vendedor, stock/alertas, beneficios según acuerdo docente, personalización, imágenes de productos y blog, video embebido y cierre documental. También se deben completar GitHub del grupo, video demostrativo, comprobación en navegador y entrega individual en AVA.

La versión actual está guardada y se entrega en un ZIP actualizado. No se ha sustituido la publicación web de la Parte 2.
