# Beneficios del carrito — Parte 10

Esta parte aplica las promociones del caso Forma C con los datos de la cuenta iniciada. Mantiene el carrito y las cuentas guardados en el mismo navegador. El resultado es una simulación frontend para EV1; todavía no confirma compras ni registra canjes reales.

## Reglas implementadas

| Beneficio | Condición | Aplicación |
| --- | --- | --- |
| Edad | Fecha de nacimiento válida y al menos 51 años cumplidos | 50% sobre los productos que se cobran |
| Registro | Cuenta creada con FELICES50 | 10% sin fecha de vencimiento mientras se conserve esa cuenta |
| Cumpleaños Duoc | Sesión iniciada, correo con dominio exacto `duoc.cl` y fecha de cumpleaños | Una unidad del producto TE001 gratis si está en el carrito |

La condición de edad interpreta literalmente «mayores de 50»: cumplir 50 todavía no activa el beneficio. La fecha de nacimiento continúa siendo opcional; omitirla impide comprobar edad y cumpleaños, pero no impide utilizar FELICES50.

Las siguientes decisiones completan lo que el caso no especifica y deben contrastarse con el docente:

- El 50% y el 10% no se suman: se utiliza el porcentaje mayor.
- La unidad gratuita se resta primero; el porcentaje se calcula sobre el resto.
- El producto de cumpleaños es TE001. No se agrega automáticamente ni se sustituye por otra torta.
- Solo se descuenta una unidad, aunque haya varias cantidades o mensajes. Se elige la primera línea TE001 del carrito y se identifica en la vista.
- Se usa el día de `America/Santiago`. Para quien nació el 29 de febrero, el aniversario se considera el 28 en años no bisiestos.
- El correo `@duoc.cl` actúa como condición de la demostración; `@profesor.duoc.cl` no obtiene el regalo. No existe una verificación real de matrícula ni de correo.

El límite actual es **una unidad por carrito**. Abrir el carrito no consume un canje: todavía no hay compra confirmada ni historial de canjes anuales. Ese control deberá incorporarse junto con los pedidos reales y el backend. La interfaz no promete que el regalo haya sido reservado o entregado.

## Subtotal, descuento y total

El carrito redondea cada precio unitario a centavos antes de multiplicar por la cantidad. Los importes se calculan con enteros en centavos y se convierten a CLP para mostrarlos; el precio original del inventario no se reescribe. El porcentaje también se redondea al centavo.

Ejemplo con precios iniciales, cumpleaños válido y FELICES50:

| Concepto | Cálculo | Importe CLP |
| --- | --- | ---: |
| Dos tortas TE001 | 2 × 55.000 | 110.000 |
| Tres brownies PG001 | 3 × 4.000 | 12.000 |
| Subtotal | 110.000 + 12.000 | 122.000 |
| Regalo de cumpleaños | Una TE001 | 55.000 |
| Base del porcentaje | 122.000 − 55.000 | 67.000 |
| FELICES50 | 10% de 67.000 | 6.700 |
| Descuentos | 55.000 + 6.700 | 61.700 |
| **Total** | **122.000 − 61.700** | **60.300** |

Con el 50% por edad en el mismo ejemplo, el descuento porcentual sería 33.500 y el total 33.500. Un carrito compuesto solo por la unidad gratuita termina en cero, sin volver a descontar esa unidad.

## Cómo probarlo desde la interfaz

Utiliza cuentas ficticias y una selección destinada a pruebas. Estos ejemplos presuponen el catálogo inicial y un carrito sin otras selecciones. Si ya registraste alguno de los RUN, utiliza esa cuenta o un RUN válido distinto, sin reemplazar los datos que quieras conservar.

| Caso | Datos sugeridos para Registro | Selección | Resultado esperado |
| --- | --- | --- | --- |
| FELICES50 | RUN 123456785; `ejemplo.felices@gmail.com`; nacimiento vacío; código FELICES50 | Una TC001 | Subtotal $45.000, descuentos $4.500, total $40.500 |
| Mayor de 50 | RUN 111111111; `ejemplo.edad@gmail.com`; nacimiento 1960-01-01; código FELICES50 | Una TC001 | Se aplica 50%; descuentos $22.500, total $22.500 |
| Cumpleaños Duoc | RUN 222222222; `ejemplo.cumple@duoc.cl`; año 2000 con el día y mes de hoy en Santiago; código FELICES50 | Dos TE001 y tres PG001 | Subtotal $122.000, descuentos $61.700, total $60.300 |

1. Completa los demás campos del registro e inicia sesión con la cuenta del caso elegido.
2. Agrega la selección indicada y abre Carrito.
3. Revisa subtotal, descuentos, total y el detalle de los beneficios.
4. En cumpleaños, comprueba que solo una línea identifique una unidad gratuita.
5. Modifica cantidades o mensajes y recarga: los importes se recalculan y los productos se conservan.
6. Abre Mi cuenta, cierra la sesión y vuelve al carrito: se conservan las selecciones y desaparecen los beneficios personales.

Para comprobar el límite de edad, el Administrador puede cambiar la fecha de nacimiento de una cuenta de prueba. El código promocional se elige al crear la cuenta y queda de solo lectura al editar. Preparar las cuentas Administrador y Vendedor se explica en el README.

## Persistencia y cambios de cuenta

- `milSabores.carrito.v2` mantiene únicamente código, cantidad y mensaje por línea.
- Los descuentos y el total final se vuelven a calcular; no se aceptan valores guardados dentro de las líneas como fuente de precios o beneficios.
- `milSabores.usuarios.v1` conserva el código promocional de creación. Editar nombre, dirección, fecha, correo o contraseña no quita FELICES50 ni concede un código a una cuenta que se creó sin él.
- Las cuentas anteriores que ya conservaban FELICES50 reciben el beneficio al iniciar sesión. No se requiere borrar ni migrar sus datos.
- La cuenta se consulta nuevamente al cambiar la sesión o sus datos. Si se elimina, deja de obtener beneficios.
- Un fallo al leer la cuenta muestra un aviso y el total sin beneficios. No borra el carrito ni la cuenta.
- La vista se actualiza al modificar el carrito, volver a la pestaña, recibir cambios de cuentas y cambiar el día comercial. El intervalo de comprobación del día es de un minuto mientras la pestaña está visible.

## Dónde modificar el código

| Archivo | Responsabilidad |
| --- | --- |
| `frontend/js/beneficios.js` | Reglas, fecha comercial, elegibilidad y cálculo. `calcular` permite probar una fecha fija sin cambiar el reloj del equipo |
| `frontend/js/beneficios-vista.js` | Presenta importes, mensajes, invitación de cumpleaños y etiqueta de la línea gratuita |
| `frontend/js/carrito.js` | Mantiene selecciones, stock y subtotales antes de descuentos |
| `frontend/js/carrito-vista.js` | Construye las filas y sus controles; la vista de beneficios se ejecuta después |
| `frontend/js/cuentas-demo.js` | Registro, sesión vigente y conservación del código de alta |
| `frontend/js/admin-usuarios.js` | Deja el código promocional de solo lectura al editar |
| `frontend/carrito.html` | Resumen, condiciones y estructura accesible |
| `frontend/css/estilos.css` | Sección 16, estilos de los beneficios |
| `pruebas/beneficios.test.cjs` | Casos de fechas, acumulación, cantidades, persistencia y cambios de cuenta |

El objeto `REGLAS` reúne los valores principales del cálculo. Si modificas la política, actualiza también las condiciones visibles en Carrito, las ayudas del Registro y los resultados esperados de las pruebas. Mantén separadas las reglas, el almacenamiento y la presentación.

`Carrito.obtenerResumen().total` sigue representando el importe **antes** de beneficios, para conservar su responsabilidad y las consultas existentes. `Beneficios.obtenerResumen().total` representa el importe **después** de los descuentos de la cuenta vigente. Las órdenes históricas de demostración conservan sus importes originales.

## Verificación

Se incorporan 18 pruebas de beneficios. La entrega acumulada reúne 88 pruebas de lógica e integración. Se ejecutan con el comando del README, sin instalar paquetes adicionales. Las pruebas en Node no certifican la apariencia ni los clics del navegador; la pauta manual incorpora los casos BEN-01 a BEN-06 para completar esa revisión.
