# Parte 10 — descuentos y beneficios del carrito

10 de septiembre de 2026 · DSY1104 · Forma C

Este bloque continúa la Parte 9 y entrega el proyecto acumulado con beneficios por edad, registro y cumpleaños. Conserva a Johan Codoceo y Gabriel Rogel como integrantes. La sección y el grupo los completará el equipo.

## Resultado

- El resumen muestra subtotal, descuentos y total, junto con el motivo de cada beneficio.
- El 50% se activa desde los 51 años cumplidos y FELICES50 conserva el 10% de registro.
- Cumpleaños Duoc descuenta una unidad TE001; cantidades o mensajes diferentes no multiplican el regalo.
- El porcentaje mayor se aplica sobre el importe restante después de la unidad gratuita.
- El total se recalcula al cambiar el carrito, el inventario, la cuenta, la sesión o el día comercial.
- El código promocional queda fijado al crear la cuenta y se conserva al editarla.
- Las cuentas y el carrito existentes se mantienen; no se guardan descuentos calculados en localStorage.

Los cálculos y la presentación están separados en `beneficios.js` y `beneficios-vista.js`, con cuatro espacios de sangría y comentarios por responsabilidad. El cálculo monetario del carrito utiliza centavos para que cantidades, descuentos y total coincidan.

## Decisiones que completa el prototipo

El caso establece los tres beneficios, pero no su combinación, producto de regalo ni límite. Esta entrega usa el porcentaje mayor, una unidad TE001 por carrito y descuento sobre el resto. Utiliza la fecha de Santiago y celebra el 29 de febrero el 28 en años comunes. Estas decisiones están documentadas en `Guia_beneficios.md` para revisarlas con el docente.

El canje anual definitivo requiere una compra confirmada y control de servidor. Esta versión calcula el beneficio en el carrito sin consumirlo ni generar una orden. El correo institucional es una condición de la demostración; no verifica matrícula real.

## Verificación y documentación

La entrega reúne **88 pruebas aprobadas**: las 70 anteriores y 18 nuevas de beneficios. También se revisan referencias locales y sintaxis de 15 páginas HTML y 29 archivos JavaScript. Se actualizan ERS, README, registro de verificación y pauta manual.

La revisión en navegador continúa pendiente por la incompatibilidad ya documentada de la vista previa con este proyecto estático. No se presenta como aprobada. La guía incluye ejemplos concretos para probar los tres beneficios mediante Live Server.

## Pendientes de EV1

1. Ejecutar la pauta de navegador y corregir lo que se observe.
2. Contrastar con el docente las decisiones de aplicación de beneficios y el arreglo de regiones/comunas.
3. Comprobar el GitHub real del grupo, sus aportes, el video explicativo y las entregas individuales en AVA.
4. Completar sección y grupo a cargo del equipo, como se acordó.

Esta entrega no declara cerrada toda EV1. El ERS permanece como documento progresivo del semestre.

Archivo acumulado: `Mil_Sabores_Parte_10_Beneficios_del_Carrito.zip`. El enlace web anterior conserva la versión publicada previamente.
