# Pastelería Mil Sabores — Parte 1: análisis y ERS inicial

Documento histórico de la Parte 1. La versión vigente para EV1 se encuentra en **ERS_V1_Mil_Sabores.md** y **ERS_V1_Mil_Sabores.docx**. Los estados que siguen corresponden al inicio del proyecto.

Versión 0.1 · 7 de septiembre de 2026 · DSY1104 — Desarrollo Full Stack II

Estado: base de requisitos y planificación. No se ha implementado ni probado todavía el sitio web. Este documento inicia el ERS; no equivale a una EV1 terminada.

## 1. Propósito y continuidad

Desarrollar una tienda online de repostería para el caso Forma C, conservando el mismo proyecto durante el semestre. Permitirá explorar productos, personalizar tortas y gestionar un carrito, incorporando progresivamente cuentas, pedidos y persistencia real.

| Etapa | Tecnologías y alcance | Resultado |
| --- | --- | --- |
| EV1 | HTML, CSS externo, JavaScript, localStorage, GitHub | Tienda y administración funcionales en el navegador; ERS iniciado |
| EV2 | React, componentes, props, estado, navegación, Bootstrap, CRUD simulado y testing | Evolución del frontend existente |
| EV3 | React, Spring Boot, MySQL, API REST, Swagger, JWT y roles | Integración con backend y datos persistentes |
| Examen transversal | Correcciones, integración y funcionalidades pendientes | Sistema completo y ERS final |

El caso indica que sus requerimientos deben validarse con el docente para determinar el alcance. Las funciones avanzadas no se asumen obligatorias en EV1 por aparecer en el caso semestral.

## 2. Fuentes revisadas

- 00_Instrucciones_Generales_Proyecto_Semestral_DSY1104.docx: continuidad, tecnologías, equipos, repositorio y evolución del ERS.
- DSY1104 - Forma C tienda PASTELERIA MIL SABORES.pdf: reglas comerciales, diseño y catálogo; especialmente páginas 2–7.
- ZIP EV1_DSY1104_2026_Documentos_completos_estudiante.zip, con sus seis documentos:
  - 00_Instrucciones_Evaluacion_1_DSY1104_2026.docx.
  - 01_DUOC_Instrucciones_Oficiales_Evaluacion_1.pdf: vistas, diagrama de navegación, validaciones y entrega; páginas 2–17.
  - 02_DUOC_Rubrica_Oficial_Evaluacion_1.pdf: indicadores técnicos, colaboración y comprensión individual.
  - 03_Instrucciones_Video_Explicativo_EV1.docx.
  - 05_Instrucciones_Entrega_Individual_AVA_EV1.docx.
  - 06_Checklist_PreEntrega_EV1.docx.

## 3. Entrega y diferencias entre documentos

Las instrucciones específicas de 2026 fijan el cierre para el lunes 14/09/2026, antes de las 11:00 AM. Cada estudiante debe registrar personalmente grupo, caso, enlace GitHub y enlace del video en Google Drive. El video debe permitir visualización y descarga; no se sube al repositorio. Duración sugerida: 5–8 minutos, con participación de todos los integrantes.

La interrogación escrita individual será en la primera sesión de la semana 06. Se podrá consultar el repositorio para localizar y explicar el código.

El PDF oficial menciona frontend comprimido, ERS versión 1 y presentación de 15 minutos más 5 de preguntas. Los documentos 2026 describen video e interrogación escrita. Criterio de trabajo: seguir las instrucciones 2026 para calendario y mecanismo de entrega, conservando los requisitos técnicos del PDF. Preparar también ZIP y ERS, y consultar al docente si requieren adjuntarse en AVA. No se considera que esos entregables hayan sido cancelados expresamente.

La rúbrica suministrada asigna 30% a EV1 dentro de la asignatura y distribuye su evaluación en 40% encargo y 60% presentación/desempeño individual. Confirmar en AVA cualquier actualización de estas ponderaciones para la modalidad 2026.

## 4. Alcance funcional de EV1

Todos los siguientes requisitos están pendientes de implementación.

| ID | Requisito | Evidencia de aceptación |
| --- | --- | --- |
| RF01 | HOME con logo, menú, imagen principal, productos y footer | Navegar a todas las vistas principales sin enlaces rotos |
| RF02 | Catálogo renderizado desde un arreglo JavaScript | Mostrar imagen, nombre, precio y botón de agregar; abrir el detalle correcto |
| RF03 | Detalle del producto y personalización de tortas | Mostrar producto seleccionado y conservar su mensaje al agregarlo |
| RF04 | Carrito con altas, modificación y eliminación | Cambiar cantidades y recalcular subtotales y total |
| RF05 | Persistencia del carrito en localStorage | Recargar y conservar productos, cantidades y personalizaciones |
| RF06 | Registro con validaciones JavaScript | Bloquear datos inválidos y mostrar errores junto a cada campo |
| RF07 | Vista de inicio de sesión | Validar correo y contraseña; simular acceso sin afirmar autenticación real |
| RF08 | Nosotros | Presentar historia, misión, visión y datos del equipo por completar |
| RF09 | Blog y dos artículos | Abrir dos detalles con imagen, título y contenido extendido |
| RF10 | Contacto | Validar datos y mostrar confirmación local, sin afirmar que se envió un correo |
| RF11 | HOME administrativa con menú visible | Acceder a gestión de productos y usuarios |
| RF12 | Gestión de productos | Listar, crear, editar y mostrar productos con formulario validado |
| RF13 | Gestión de usuarios | Listar, crear, editar y mostrar usuarios con formulario validado |
| RF14 | Perfiles de demostración | Distinguir Administrador, Cliente y Vendedor en la interfaz |
| RF15 | Reglas comerciales del caso | Explicar y demostrar cálculos conforme a una política documentada |

El diagrama oficial incluye mostrar y editar tanto productos como usuarios: no basta con crear sus formularios. La eliminación administrativa se propone como mejora del mantenedor; no se presenta como un requisito mínimo explícito del diagrama. Eliminar productos del carrito sí forma parte de EV1.

El PDF menciona que el Vendedor puede consultar productos y órdenes. Se propone una lista y detalle de órdenes simuladas si ese perfil se demuestra en EV1; confirmar con el docente si exige ese flujo en esta etapa. Ocultar opciones en el navegador es una simulación de interfaz, no una barrera de seguridad.

## 5. Validaciones exigidas

### Usuario y registro

- RUN obligatorio, sin puntos ni guion, entre 7 y 9 caracteres. Comprobar dígito verificador; no basta con revisar longitud. Admitir K como verificador.
- Nombre obligatorio, máximo 50 caracteres.
- Apellidos obligatorios, máximo 100 caracteres.
- Correo obligatorio, máximo 100 caracteres. Dominios exactos permitidos: duoc.cl, profesor.duoc.cl y gmail.com.
- Fecha de nacimiento opcional. Si se omite, no se puede acreditar un beneficio de edad o cumpleaños. Rechazar fechas futuras cuando se ingrese una fecha.
- Región y comuna dependientes: cambiar región actualiza las comunas y borra una selección incompatible.
- Dirección obligatoria, máximo 300 caracteres.
- Tipo de usuario solo en administración: Administrador, Cliente y Vendedor. El registro público no permite asignarse Administrador.
- El PDF no define expresamente la contraseña del registro. Propuesta: contraseña y confirmación consistentes con el login, de 4–10 caracteres, dejando esta decisión documentada.

### Inicio de sesión

- Correo obligatorio, máximo 100 caracteres, con los tres dominios exactos indicados.
- Contraseña obligatoria, entre 4 y 10 caracteres según la pauta EV1.
- No usar datos personales reales ni presentar la simulación local como una cuenta segura de producción.

### Contacto

- Nombre obligatorio, máximo 100 caracteres.
- Correo máximo 100 caracteres y dominios permitidos. La pauta no lo marca como requerido: se propone opcional, validándolo si se completa.
- Comentario obligatorio, máximo 500 caracteres.

### Producto administrativo

- Código obligatorio, texto de al menos 3 caracteres, sin máximo indicado. Propuesta adicional: código único.
- Nombre obligatorio, máximo 100 caracteres.
- Descripción opcional, máximo 500 caracteres.
- Precio obligatorio, numérico, mayor o igual que 0; admite decimales. No rechazar cero, porque la pauta contempla productos gratuitos.
- Stock obligatorio, entero mayor o igual que 0.
- Stock crítico opcional, entero mayor o igual que 0. Si se informa, alertar cuando stock sea menor o igual al umbral.
- Categoría obligatoria mediante selector.
- Imagen opcional; proponer imagen de reemplazo cuando falte.

Las validaciones se ejecutarán en JavaScript al interactuar con los campos y al enviar. Cada error debe explicar cómo corregirlo. El HTML incluirá etiquetas asociadas y atributos apropiados, pero required y type no reemplazan la lógica JavaScript solicitada.

## 6. Reglas comerciales y decisiones abiertas

| Regla del caso | Interpretación fiel | Pendiente |
| --- | --- | --- |
| 50% para mayores de 50 años | Edad cumplida superior a 50; alguien de exactamente 50 no entra por el texto literal | Confirmar si el docente pretende 50 o más |
| Código FELICES50 | 10% de por vida para quien se registre con ese código | Definir acumulación con otros beneficios |
| Torta gratis por cumpleaños para estudiantes Duoc | Requiere registro con correo institucional y cumpleaños | Correo estudiantil exacto, producto elegible, cantidad y límite de canjes |
| Personalizar tortas | Permitir mensajes especiales | Longitud máxima, tamaños y eventuales recargos |

Propuesta provisional para desarrollar y probar, todavía no aprobada por el docente: aplicar el mayor descuento porcentual disponible sin sumar 50% y 10%; manejar el regalo de cumpleaños como una unidad elegible separada. No implementar silenciosamente esta propuesta como si fuera el enunciado.

Tener correo profesor.duoc.cl no acredita ser estudiante. El login acepta ese dominio por la pauta, pero eso no basta para recibir el beneficio estudiantil.

Propuestas adicionales para el carrito: cantidades enteras positivas, no superar stock, distinguir líneas con mensajes diferentes, recalcular desde datos de producto y recuperar un carrito vacío si el contenido guardado está corrupto. El formato monetario será CLP; deberá documentarse cómo se muestran y redondean precios decimales permitidos por la pauta.

## 7. Catálogo inicial del caso

Se propone usar los 16 ejemplos entregados como datos iniciales, conservando sus códigos y precios. Stock, stock crítico, tamaños e imágenes no fueron suministrados como datos estructurados: serán datos demostrativos identificados como tales.

| Código | Producto | Precio CLP |
| --- | --- | ---: |
| TC001 | Torta Cuadrada de Chocolate | 45000 |
| TC002 | Torta Cuadrada de Frutas | 50000 |
| TT001 | Torta Circular de Vainilla | 40000 |
| TT002 | Torta Circular de Manjar | 42000 |
| PI001 | Mousse de Chocolate | 5000 |
| PI002 | Tiramisú Clásico | 5500 |
| PSA001 | Torta Sin Azúcar de Naranja | 48000 |
| PSA002 | Cheesecake Sin Azúcar | 47000 |
| PT001 | Empanada de Manzana | 3000 |
| PT002 | Tarta de Santiago | 6000 |
| PG001 | Brownie Sin Gluten | 4000 |
| PG002 | Pan Sin Gluten | 3500 |
| PV001 | Torta Vegana de Chocolate | 50000 |
| PV002 | Galletas Veganas de Avena | 4500 |
| TE001 | Torta Especial de Cumpleaños | 55000 |
| TE002 | Torta Especial de Boda | 60000 |

Categorías: Tortas Cuadradas, Tortas Circulares, Postres Individuales, Productos Sin Azúcar, Pastelería Tradicional, Productos Sin Gluten, Productos Veganos y Tortas Especiales. Se normaliza únicamente la redacción de «Productos Vegana» del original.

## 8. Diseño y requisitos no funcionales

- Fondo crema #FFF5E1; acentos rosa #FFC0CB y chocolate #8B4513.
- Texto principal marrón #5D4037. El gris #B0BEC5 propuesto en el caso se reservará para usos con contraste suficiente; evitar texto pequeño poco legible sobre crema.
- Lato para texto y Pacifico para títulos de marca; fuentes de respaldo si no cargan.
- Apariencia cálida y tradicional, con fotografías de productos y jerarquía clara.
- Diseño adaptable a móvil y escritorio, navegación por teclado, foco visible, imágenes con texto alternativo y formularios etiquetados.
- HTML semántico y CSS externo compartido. Incluir contenido multimedia pertinente, pues la rúbrica menciona videos embebidos; distinto del video de entrega del grupo.
- Separar datos, renderizado, validaciones, carrito y almacenamiento para facilitar la migración posterior.
- Datos ficticios de demostración. No guardar contraseñas reales, tarjetas ni afirmar pagos, correos, boletas o envíos efectivos.

## 9. Organización técnica propuesta

| Ubicación futura | Responsabilidad |
| --- | --- |
| frontend/ | Vistas HTML de EV1 |
| frontend/admin/ | Panel y formularios administrativos |
| frontend/css/ | Estilos generales, formularios y administración |
| frontend/js/data/ | Productos, categorías y regiones/comunas |
| frontend/js/ | Navegación, catálogo, validaciones, carrito y persistencia |
| frontend/assets/ | Imágenes y recursos locales |
| documentacion/ | ERS progresivo, decisiones, pruebas y guía de ejecución |
| backend/ | Se incorporará con Spring Boot en EV3 |
| database/ | Se incorporará con MySQL en EV3 |

Entidades iniciales propuestas: Producto, Categoría, Usuario, ÍtemCarrito y Beneficio. Pedido y DetallePedido evolucionarán cuando se desarrolle ese flujo. Este es un modelo conceptual inicial, no un esquema de base de datos aprobado.

Herramientas previstas: editor de código, navegador con herramientas de desarrollo, Git y GitHub; un servidor local sencillo para ejecutar el frontend. React, Spring Boot y MySQL se incorporarán en sus evaluaciones correspondientes.

## 10. Construcción por partes

1. **Parte 1 — Base del proyecto (este documento):** alcance, validaciones, ERS inicial y preguntas abiertas.
2. **Parte 2 — Estructura y diseño:** carpetas, páginas conectadas, cabecera, footer, CSS adaptable y HOME con productos destacados.
3. **Parte 3 — Catálogo y carrito:** 16 productos, detalles, personalización, cálculos, edición y persistencia.
4. **Parte 4 — Formularios y administración:** registro, login simulado, contacto, RUN, regiones/comunas y mantenedores.
5. **Parte 5 — Cierre EV1:** revisar requisitos, completar contenidos, actualizar ERS, preparar ZIP y guion del video; comprobar enlaces de entrega.

Estas partes organizan el trabajo de EV1; todas las funciones exigidas deben estar completas antes de entregar esa evaluación. No se distribuyen las funciones mínimas de EV1 entre evaluaciones posteriores.

Cada parte tendrá cambios pequeños y explicables. Realizar commits reales conforme avance el trabajo; cada integrante debe hacer sus propios aportes identificables. No fabricar historial ni atribuir contribuciones a otras personas.

## 11. Comprobaciones previstas

- Navegar por tienda y administración; revisar enlaces y recursos desde una copia nueva.
- Abrir los dos artículos y detalles de productos distintos.
- Validar RUN correcto e incorrecto, correo con dominio no permitido, longitudes límite y comuna incompatible.
- Probar precio cero, stock fraccionario rechazado y alerta al alcanzar el stock crítico.
- Agregar dos productos, editar cantidad, eliminar uno y recargar; comprobar importes y persistencia.
- Agregar el mismo producto con dos mensajes diferentes y comprobar su separación.
- Probar las reglas de edad alrededor del cumpleaños y el código promocional, después de acordar la política.
- Revisar móvil, escritorio, teclado y errores visibles en formularios.
- Preparar explicación individual de HTML semántico, CSS externo, arreglo de productos, JSON.stringify, JSON.parse, localStorage y commits propios.

Estas comprobaciones están planificadas, no ejecutadas.

## 12. Datos y acuerdos pendientes

- Integrantes, sección, número de grupo y repositorio existente o nuevo.
- Archivo JavaScript complementario de regiones y comunas: se menciona en el PDF, pero no está entre los seis archivos del ZIP. Solicitarlo; se puede avanzar mientras tanto con datos de prueba claramente señalados.
- Confirmación docente sobre acumulación de beneficios, cumpleaños, edades, tamaños y alcance del perfil Vendedor/órdenes.
- Confirmar si ZIP y ERS se adjuntan en AVA además de los enlaces de la instrucción 2026.
- Fotografías, logo y contenido multimedia definitivo, con procedencia documentada.

Las funciones semestrales de pago, boleta, seguimiento en tiempo real, notificaciones y recomendaciones se registran como pendientes de alcance futuro. No se presentan como implementadas ni como obligatorias en EV1 sin validación docente.
