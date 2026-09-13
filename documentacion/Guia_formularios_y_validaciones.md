# Guía de formularios y validaciones reutilizables

Parte 4 · Mil Sabores · DSY1104 · 9 de septiembre de 2026

## 1. Las tres responsabilidades

`validaciones.js` decide si un dato es correcto. `formularios.js` muestra el resultado y atiende los eventos. `cuentas-demo.js` guarda la cuenta o abre la sesión local. Cada vista tiene un archivo pequeño que conecta esas piezas.

Esta separación permite que el próximo formulario administrativo reutilice la regla del RUN o del correo sin copiarla. Si cambia una regla común, se modifica una vez.

## 2. Reglas aplicadas

| Campo o formulario | Regla |
| --- | --- |
| RUN | Obligatorio, 7–9 caracteres, sin puntos ni guion; módulo 11; admite k/K |
| Nombre de usuario | Obligatorio, máximo 50 |
| Apellidos | Obligatorios, máximo 100 |
| Correo de usuario/login | Obligatorio, máximo 100; duoc.cl, profesor.duoc.cl o gmail.com |
| Nacimiento | Opcional; fecha existente y no futura |
| Región/comuna | Selección de la lista y correspondencia entre ambas |
| Dirección | Obligatoria, máximo 300 |
| Contraseña | Obligatoria, 4–10 caracteres según la pauta |
| Confirmación | Igual a la contraseña; decisión para completar el registro |
| Código promocional | Opcional; admite FELICES50, sin aplicar el beneficio todavía |
| Nombre de contacto | Obligatorio, máximo 100 |
| Correo de contacto | Opcional; si se escribe, mismas reglas de formato y dominio |
| Comentario | Obligatorio, máximo 500 |
| Tipo de usuario | Se valida solo al reutilizar las reglas en administración |

Se eliminan espacios exteriores de los textos comunes. El RUN se guarda en mayúsculas y el correo en minúsculas. Las contraseñas se comparan exactamente, sin recortar espacios. No se permite una contraseña formada únicamente por espacios.

El registro público crea siempre un Cliente; no contiene un selector para autoasignarse Administrador. La función reutilizable permite validar Administrador, Cliente o Vendedor cuando se construya el formulario administrativo, pero todavía no concede permisos.

## 3. Cómo leer una validación

Las reglas de un campo devuelven un mensaje de error o una cadena vacía:

```javascript
const mensaje = Validaciones.validarRun("123456785");

if (mensaje === "") {
    // El RUN tiene un formato y dígito verificador válidos.
}
```

Las reglas de un formulario devuelven un objeto con las claves de los campos incorrectos:

```javascript
const errores = Validaciones.validarContacto({
    nombre: "Camila",
    correo: "",
    comentario: "Quisiera consultar por una torta.",
});

// Si no hay errores, Object.keys(errores).length es 0.
```

Los errores se asocian al atributo `name` de los controles. Por ejemplo, un error `correo` se coloca en el elemento `data-error-para="correo"` y activa `aria-invalid` en el campo.

## 4. Qué hace el controlador compartido

`Formularios.conectar()` recibe:

- `formulario`: el elemento HTML.
- `validar`: función que comprueba sus datos.
- `alValidar`: operación que se ejecuta si los campos son válidos.
- `alExito`: acción opcional después de completar la operación.

```javascript
Formularios.conectar({
    formulario: document.querySelector("#formulario-contacto"),
    validar: Validaciones.validarContacto,
    alValidar: function () {
        return {
            exito: true,
            mensaje: "Datos válidos; esta demostración no envía el mensaje.",
        };
    },
});
```

El helper evita recargar la página al enviar, valida al salir de campos, vuelve a validar al corregirlos, enfoca el primer error y evita envíos repetidos durante una operación. Los controles se bloquean brevemente mientras se registra o comprueba la contraseña.

`novalidate` permite presentar los mensajes JavaScript personalizados. Se mantienen `required`, `maxlength`, tipos de campo y etiquetas como información semántica; las funciones siguen comprobando sus reglas aunque alguien modifique esos atributos.

## 5. Cómo se reutilizará en administración

Para validar un usuario administrativo:

```javascript
const errores = Validaciones.validarUsuario(datos, {
    regiones: window.REGIONES,
    esAdministracion: true,
});
```

Esta función valida RUN, nombres, correo, fecha, ubicación, dirección y tipo de usuario. No obliga a cambiar una contraseña al editar un perfil. El siguiente mantenedor deberá definir por separado sus operaciones de creación, edición y control de acceso.

Los selectores se reutilizan de la misma manera:

```javascript
UbicacionFormulario.conectar(
    formulario.elements.region,
    formulario.elements.comuna,
);
```

Al cambiar de región, se eliminan las opciones previas y la comuna seleccionada. La validación comprueba además la correspondencia, por lo que cambiar manualmente el HTML no basta para enviar una pareja inválida.

## 6. Datos territoriales

El ZIP del curso no contenía el archivo JavaScript complementario de regiones/comunas. Se construyó un reemplazo local a partir de la [Mapoteca de la Biblioteca del Congreso Nacional](https://www.bcn.cl/siit/mapoteca/comunas), consultada el 09/09/2026: 16 regiones y 346 comunas, con códigos únicos.

La extracción normaliza los códigos a cinco dígitos para conservar ceros iniciales. Los nombres y relaciones provienen del listado; no son una selección parcial inventada. El sitio no consulta BCN al usar el formulario: los datos ya están en `regiones.js`.

Si el docente entrega su archivo, se puede adaptar a los campos `codigo`, `nombre` y `comunas` utilizados aquí. La validación y el controlador de selección pueden conservarse.

## 7. Registro y sesión de demostración

`cuentas-demo.js` usa dos claves diferentes:

| Clave | Lugar | Contenido |
| --- | --- | --- |
| `milSabores.usuarios.v1` | localStorage | Perfiles locales y derivaciones de credenciales |
| `milSabores.sesion.v1` | sessionStorage | RUN de la sesión de esta pestaña |

La cuenta se conserva al recargar o volver a abrir el mismo origen. La sesión utiliza el almacenamiento de la pestaña. Cerrar sesión elimina solo su clave; no borra productos del carrito ni perfiles.

Antes de registrar, se vuelven a ejecutar las validaciones y se comprueba que no exista el RUN ni el correo. Después de la operación asíncrona de derivación, se vuelve a leer el arreglo para reducir problemas de datos antiguos. Esto no es una transacción ni sustituye las restricciones únicas de una base de datos futura.

Si falla la escritura, no se muestra que la cuenta se creó correctamente. Si el JSON anterior está corrupto, se informa el problema y no se sobrescribe.

## 8. Qué ocurre con la contraseña

La contraseña escrita no se guarda en texto plano. `credenciales-demo.js` utiliza Web Crypto para derivar un valor PBKDF2-SHA256 con sal aleatoria y compararlo durante el login. La API se documenta en [MDN: deriveBits](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/deriveBits).

El algoritmo está aislado para que puedas estudiar primero los formularios. No necesitas modificarlo para cambiar etiquetas, límites de texto o mensajes de error. Requiere un navegador moderno y un origen apropiado, como localhost o HTTPS.

Esta técnica evita guardar directamente la clave, pero todo sigue bajo el control del navegador: no prueba identidad, no verifica la propiedad del correo, no protege rutas y no debe tratarse como seguridad de producción. La implementación real corresponderá al backend. Usa únicamente datos y claves de prueba.

## 9. Qué sucede en Contacto

El nombre y comentario son obligatorios. El correo se valida solo si se completa, de acuerdo con la pauta que no lo marca como requerido. El contador muestra el uso de los 500 caracteres.

Si los datos son válidos, se muestra una confirmación que aclara que el mensaje no se envía. No se realiza ninguna petición de red ni se guardan comentarios. El envío real queda para una etapa con backend.

## 10. Cómo practicar modificaciones

- Cambiar un texto visible: edita su `<label>`, ayuda o botón en el HTML correspondiente.
- Cambiar una longitud: ajusta tanto `validaciones.js` como `maxlength` y el texto de ayuda del HTML.
- Cambiar un dominio admitido: modifica `DOMINIOS_PERMITIDOS` y la ayuda visible, solo si el docente lo autoriza.
- Añadir un campo: agrega su control, `name`, etiqueta, ayuda, `data-validar` y contenedor de error; luego incorpora su regla.
- Cambiar la disposición: revisa la sección 11 de `estilos.css`.

No cambies los límites de la pauta solo para pasar una prueba. Los tests incluidos muestran los casos esperados y ayudan a detectar errores al modificar el código.

## 11. Recuperación de datos de prueba

Si aparece un error de cuentas guardadas, revisa en las herramientas del navegador las claves `milSabores.usuarios.v1` y `milSabores.sesion.v1`. No uses la opción de borrar todo el almacenamiento del sitio si quieres conservar el carrito.

Solo si decides descartar esas cuentas de prueba, elimina esas dos claves y registra una cuenta nueva. Esa acción pierde los perfiles locales; no es una recuperación de contraseña y no existe un servicio externo que pueda restaurarlos.

## 12. Comprobación y límites

Se ejecutaron 14 pruebas de este bloque y las 12 anteriores del carrito. Cubren validación, fechas, ubicación, duplicados, contraseña derivada, sesiones, fallos de almacenamiento y conservación del carrito. Utilizan el código real en Node con almacenamiento simulado; la derivación usa Web Crypto real.

No se realizó una revisión visual en navegador. El README incluye el recorrido para demostrar los tres formularios y el carrito antes de la entrega. Los mantenedores, los permisos, los beneficios comerciales y otras funciones pendientes de EV1 siguen en el plan.
