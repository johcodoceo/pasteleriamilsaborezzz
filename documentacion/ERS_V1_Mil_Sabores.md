# Especificación de requisitos de software

**Pastelería Mil Sabores**

DSY1104 Desarrollo Fullstack II · Forma C · Evaluación 1

Versión 1.1 · 10 de septiembre de 2026 · Avance acumulado hasta la Parte 10

Integrantes: Johan Codoceo y Gabriel Rogel

Sección: ____________________    Grupo: ____________________

Este documento describe los requisitos, herramientas y decisiones de la primera etapa del proyecto Mil Sabores. La implementación comprende la tienda, el carrito persistente, los formularios, la administración y las órdenes de demostración. Las pruebas de lógica están aprobadas; la revisión completa en navegador, la sección, el grupo y las evidencias de entrega permanecen pendientes.

## 1 Propósito y alcance

El proyecto desarrolla una tienda online de pastelería basada en el caso Forma C. Su finalidad es permitir que los visitantes exploren productos, personalicen tortas y mantengan un carrito, mientras los perfiles de gestión consultan o administran información según su función.

EV1 utiliza HTML, CSS externo y JavaScript. El almacenamiento del navegador conserva productos, usuarios y carrito para la demostración. La sesión se mantiene por pestaña. La implementación es la base que continuará evolucionando durante el semestre.

Las cuentas y órdenes son una simulación frontend. Esta versión no realiza ventas, envía correos ni procesa pagos. La confirmación de compras, las boletas, el seguimiento de entregas y la autorización de servidor se incorporarán en etapas posteriores según el alcance acordado con el docente.

## 2 Actores y accesos

| Actor | Acceso de la versión 1 |
| --- | --- |
| Visitante | Tienda pública, catálogo, detalle, blog, contacto, registro y carrito |
| Cliente | Tienda y carrito con sesión de demostración; sin acceso a los módulos de gestión |
| Vendedor | Lista y detalle de productos y de órdenes; sin opciones de edición o gestión de usuarios |
| Administrador | Resumen, gestión de productos y usuarios, y consulta de órdenes |

La interfaz comprueba el perfil al abrir cada módulo y vuelve a comprobarlo en las operaciones de datos que lo requieren. Ocultar opciones y comprobar una sesión local no sustituye la autorización de un servidor. Las cuentas de ejemplo se preparan mediante un botón explícito; no reemplazan las cuentas existentes.

## 3 Requisitos funcionales

La identificación RF01 a RF15 conserva la del ERS inicial. RF16 explicita la consulta de órdenes incorporada en la Parte 8. El estado Implementado indica presencia en el código; la aceptación visual y de interacción debe completarse con el registro de revisión en navegador.

| ID | Requisito y estado | Criterio de aceptación |
| --- | --- | --- |
| RF01 | Inicio y navegación · Implementado | Mostrar marca, menú, portada, destacados y pie de página; enlazar las vistas públicas |
| RF02 | Catálogo JavaScript · Implementado | Mostrar los 16 productos iniciales con imagen, nombre y precio, y permitir abrir el detalle y agregar al carrito |
| RF03 | Detalle y personalización · Implementado | Mostrar el producto seleccionado y conservar un mensaje opcional en las tortas habilitadas |
| RF04 | Gestión del carrito · Implementado | Agregar, modificar cantidades y mensajes, eliminar selecciones y recalcular importes |
| RF05 | Persistencia del carrito · Implementado | Recuperar cantidades y mensajes después de recargar, mediante localStorage |
| RF06 | Registro de usuario · Implementado | Validar los datos con JavaScript, mostrar errores específicos y registrar un perfil Cliente |
| RF07 | Inicio y cierre de sesión · Implementado | Comprobar credenciales de demostración, mantener la sesión por pestaña y permitir cerrarla |
| RF08 | Nosotros · Implementado | Mostrar historia, misión y visión, e identificar a Johan Codoceo y Gabriel Rogel como integrantes del equipo |
| RF09 | Blog y multimedia · Implementado | Abrir dos artículos completos con imagen; incluir un video de pastelería con atribución y enlace a su fuente |
| RF10 | Contacto · Implementado | Validar campos y mostrar confirmación local, indicando que no se envía un mensaje |
| RF11 | Inicio administrativo · Implementado | Mostrar resumen de productos, usuarios y alertas de stock; enlazar los módulos de gestión |
| RF12 | Gestión de productos · Implementado | Listar, buscar, consultar, crear, editar y eliminar productos con validación y persistencia |
| RF13 | Gestión de usuarios · Implementado | Listar, buscar, consultar, crear, editar y eliminar usuarios, conservando la integridad de sus perfiles |
| RF14 | Perfiles · Implementado | Diferenciar Administrador, Vendedor y Cliente y limitar las opciones de gestión correspondientes |
| RF15 | Beneficios comerciales · Implementado | Aplicar edad, FELICES50 y cumpleaños según las reglas documentadas; mostrar subtotal, descuentos y total |
| RF16 | Consulta de órdenes · Implementado | Permitir a Vendedor y Administrador abrir lista y detalle, con cliente, ítems, mensajes, cantidades e importes |

La eliminación administrativa de productos y usuarios complementa los mantenedores. La eliminación de productos del carrito sí forma parte del flujo mínimo de la tienda. La consulta de órdenes utiliza cuatro ejemplos ficticios y no crea órdenes desde el carrito.

## 4 Validaciones de los formularios

### Registro y administración de usuarios

El RUN es obligatorio, se ingresa sin puntos ni guion, tiene entre 7 y 9 caracteres y debe cumplir el dígito verificador. Nombre y apellidos son obligatorios, con máximos de 50 y 100 caracteres respectivamente. El correo es obligatorio, admite hasta 100 caracteres y se limita a los dominios exactos duoc.cl, profesor.duoc.cl y gmail.com.

La fecha de nacimiento es opcional y, cuando se informa, debe ser válida y no futura. Región y comuna son obligatorias y dependientes: cambiar la región actualiza las comunas y elimina una selección incompatible. La dirección es obligatoria y admite hasta 300 caracteres.

El registro público crea un Cliente. Solo la administración asigna tipos de usuario. Se rechazan RUN y correos duplicados; el RUN se conserva al editar. El Administrador no puede eliminar su propia cuenta ni quitarse su perfil desde el mantenedor. Al editar una cuenta, dejar la contraseña vacía conserva la anterior; una contraseña nueva exige confirmación.

### Acceso y código promocional

Las contraseñas de demostración tienen entre 4 y 10 caracteres, de acuerdo con la pauta del acceso. Registro y cambio de contraseña utilizan el mismo rango y exigen confirmación coincidente. Las credenciales incorrectas no abren una sesión.

El campo promocional es opcional; acepta FELICES50 y normaliza sus letras a mayúsculas. Se conserva el código elegido al crear la cuenta y queda de solo lectura al editar. Una cuenta con FELICES50 mantiene el beneficio mientras exista, sin fecha de vencimiento; editar otros datos no lo quita ni concede el código a una cuenta creada sin él.

### Contacto

El nombre es obligatorio y admite hasta 100 caracteres. El correo es opcional; si se informa, debe cumplir los dominios y el máximo de 100 caracteres. El comentario es obligatorio y admite hasta 500 caracteres. La confirmación corresponde únicamente a la validación local del formulario.

### Administración de productos

El código es obligatorio, único y tiene al menos tres caracteres. Se conserva al editar. El nombre es obligatorio y admite hasta 100 caracteres; la descripción es opcional, con un máximo de 500.

El precio es numérico, mayor o igual que cero, y admite decimales. El stock es un entero no negativo. El stock crítico es opcional y, si se informa, debe ser un entero no negativo. Se genera una alerta cuando el stock es igual o inferior a ese umbral.

La categoría es obligatoria. La imagen es opcional y admite una ruta local de recursos o una URL HTTPS válida. Si se deja vacía en un producto inicial, se utiliza su imagen de origen. En un producto nuevo sin imagen inicial, el campo vacío deja el registro sin fotografía.

### Mensajes de personalización

El mensaje es opcional, de una sola línea y admite hasta 60 caracteres según el contador implementado. Se normaliza el texto y se rechazan saltos, tabulaciones y caracteres de control. El Administrador puede habilitar o deshabilitar esta opción por producto. El límite de 60 y la ausencia de recargo son decisiones del prototipo, porque el caso no define esos valores.

Los formularios muestran mensajes de error junto a los campos. Las etiquetas, sugerencias y atributos HTML complementan la validación JavaScript; no la reemplazan.

## 5 Reglas del carrito y de las órdenes

El carrito identifica una selección por código de producto y mensaje normalizado. Selecciones iguales se agrupan; mensajes diferentes conservan líneas distintas. Editar un mensaje puede agrupar cantidades, y guardar un mensaje vacío lo elimina.

Las cantidades deben ser enteras positivas. El máximo por producto es el menor valor entre sus existencias y 99 unidades, sumando todas sus personalizaciones. Agregar al carrito no reserva ni descuenta stock. Reducir el stock ajusta las cantidades; agotar o eliminar un producto lo retira del carrito.

Los precios del carrito se consultan desde el inventario vigente. Cambiar un precio recalcula los importes. Al desactivar la personalización de un producto, se retiran sus líneas con mensaje y se muestra un aviso; se conservan las selecciones sin mensaje.

Las órdenes ficticias guardan una copia del nombre, precio unitario, cantidad y mensaje de cada ítem. Cambiar o eliminar un producto del catálogo no altera esos datos históricos. Sus subtotales son precio unitario por cantidad; el total suma los subtotales. El módulo de órdenes redondea los precios unitarios a centavos antes de calcular.

El formato monetario es CLP. El carrito también redondea el precio unitario a centavos antes de multiplicar y sumar, sin reescribir el precio original del catálogo. Los descuentos se redondean a centavos y se restan del subtotal. Las órdenes se muestran desde la fecha más reciente. Un identificador inexistente produce un mensaje y permite volver al listado.

### Beneficios del caso implementados

| Regla | Aplicación en esta versión |
| --- | --- |
| 50 por ciento para mayores de 50 años | Desde 51 años cumplidos, según la fecha de nacimiento de la cuenta iniciada |
| FELICES50 con 10 por ciento de por vida | Código conservado desde la creación de la cuenta; se aplica el mayor entre este porcentaje y el de edad |
| Torta de cumpleaños para estudiantes Duoc | Una unidad TE001 gratis en el carrito durante el cumpleaños con correo del dominio exacto duoc.cl |

Primero se resta la unidad gratuita y después se aplica el porcentaje al resto. El regalo se asigna a la primera línea TE001, sin multiplicarse por cantidades ni mensajes. No se agrega un producto automáticamente. Se usa la fecha de Santiago de Chile y, para nacidos el 29 de febrero, el 28 en años no bisiestos. La cuenta sin fecha de nacimiento no obtiene edad ni cumpleaños; puede obtener FELICES50.

Estas decisiones de combinación, producto y fecha completan el prototipo y deben contrastarse con el docente. El correo profesor.duoc.cl no obtiene el regalo. La simulación no verifica matrícula ni consume canjes anuales: ese control requiere una compra confirmada y servidor. Los descuentos se recalculan desde la cuenta vigente; no se almacenan como importes del carrito.

## 6 Datos y organización técnica

El catálogo contiene los 16 productos del caso, con sus códigos y precios. Cada uno tiene stock inicial 20 y stock crítico 5 como datos de demostración. Se incorporan 16 imágenes locales ilustrativas; su procedencia se documenta en la guía de imágenes y video.

Las regiones y comunas se encuentran en un arreglo local con 16 regiones y 346 comunas. Se utilizó el reemplazo documentado a partir de la Mapoteca de la Biblioteca del Congreso Nacional, mientras se obtiene el archivo complementario del docente.

| Información | Ubicación y conservación |
| --- | --- |
| Productos iniciales | productos.js; las modificaciones se guardan en localStorage con milSabores.productos.v1 |
| Carrito | localStorage con milSabores.carrito.v2; se conserva milSabores.carrito.v1 como respaldo de la migración |
| Usuarios | localStorage con milSabores.usuarios.v1 |
| Sesión | sessionStorage con milSabores.sesion.v1 |
| Beneficios | beneficios.js calcula desde la cuenta, el catálogo y la fecha; no añade claves de almacenamiento |
| Órdenes ficticias | datos-ordenes.js; consulta en memoria, sin persistencia adicional |
| Imágenes | Archivos locales dentro de assets y assets/productos |
| Video del blog | Reproductor de YouTube; requiere conexión a internet |

Los datos del navegador pertenecen al origen de ejecución. Cambiar host, puerto o navegador utiliza un almacenamiento diferente. La recuperación de datos y los fallos de escritura se tratan con avisos; las operaciones no deben confirmar un guardado que haya fallado.

Las credenciales de demostración se almacenan como una derivación PBKDF2 con sal aleatoria, mediante Web Crypto. Esto evita guardar el texto de la contraseña, pero no convierte la simulación local en un sistema de autenticación de producción.

| Ubicación del ZIP | Responsabilidad |
| --- | --- |
| frontend | Vistas públicas HTML y entrada index.html |
| frontend/admin | Resumen, productos, usuarios, lista de órdenes y detalle de orden |
| frontend/css/estilos.css | Estilos externos compartidos |
| frontend/js | Datos, validaciones, consultas, almacenamiento y presentación en módulos separados |
| frontend/assets | Imágenes y recursos locales |
| pruebas | Pruebas de lógica e integración ejecutables con Node |
| documentacion | ERS, decisiones, guías y registros de verificación |

En el repositorio de trabajo, frontend se denomina dist. El ZIP conserva la organización académica. Las entidades representadas son Producto, Categoría, Usuario, Selección de carrito, Orden e Ítem de orden; no constituyen todavía un esquema de base de datos.

Las herramientas de esta etapa son un editor de código, navegador, servidor local como Live Server, Git y GitHub. Node permite ejecutar las pruebas incluidas. El sitio mantiene HTML, CSS y JavaScript y no necesita React ni backend para esta evaluación.

## 7 Requisitos no funcionales

- Mantener estructura HTML semántica, navegación entre páginas y CSS externo consistente.
- Conservar una presentación de pastelería con colores crema, rosa y chocolate, y fuentes de respaldo cuando no carguen las tipografías externas.
- Adaptar el contenido a escritorio y pantallas estrechas; permitir desplazamiento dentro de las tablas cuando sea necesario.
- Proporcionar etiquetas, textos alternativos pertinentes, foco visible y navegación por teclado.
- Separar responsabilidades del código, utilizar cuatro espacios de sangría y comentarios que expliquen las decisiones relevantes.
- Presentar mensajes claros ante datos inválidos, registros inexistentes o almacenamiento no disponible.
- Mantener los recursos de imagen dentro del proyecto y documentar el origen del video externo.

La conformidad visual y de interacción con estos requisitos debe registrarse en navegador. Las pruebas de lógica y la inspección de archivos no sustituyen esa comprobación.

## 8 Verificación y entrega de EV1

La base acumulada cuenta con 88 pruebas de lógica e integración aprobadas: 12 de carrito, 14 de formularios y cuentas, 18 de administración, 16 de personalización, 10 de órdenes y 18 de beneficios. También se revisaron la sintaxis, las rutas y asociaciones HTML de 15 páginas y 29 archivos JavaScript.

El registro de verificación distingue las comprobaciones ejecutadas de las pendientes. La navegación real, la presentación en móvil, el recorrido con teclado y la reproducción del video del blog requieren completar la revisión en navegador. Su estado no se considera aprobado por la existencia de pruebas de lógica.

La rúbrica suministrada distribuye 40 por ciento al encargo y 60 por ciento a la explicación individual de HTML, CSS, JavaScript y colaboración. Las instrucciones específicas de 2026 establecen un video grupal y una interrogación escrita individual en la primera sesión de la semana 06.

El video debe mostrar el proyecto ejecutándose, una validación incorrecta y otra correcta, el carrito y su persistencia, una vista administrativa y el historial de GitHub. Su duración sugerida es de 5 a 8 minutos y todos los integrantes participan. La versión grabada debe corresponder a la disponible en GitHub.

Cada estudiante registra individualmente en AVA el grupo, el caso, el enlace de GitHub y el enlace del video en Google Drive. El repositorio debe poder revisarse y descargarse; el video debe poder visualizarse y descargarse y se mantiene fuera del repositorio. La fecha indicada es el lunes 14 de septiembre de 2026, antes de las 11:00 AM.

El PDF oficial también enumera el frontend comprimido y el ERS versión 1. Estos documentos se preparan junto con los enlaces, comprobando en AVA dónde deben adjuntarse. El ERS continúa evolucionando durante el semestre y no se presenta como versión final del sistema completo.

## 9 Acuerdos y continuidad

Johan Codoceo y Gabriel Rogel están identificados en este documento y en Nosotros. El equipo completará sección y grupo. Antes de cerrar la entrega deben completarse la revisión en navegador, la actualización del GitHub grupal con aportes identificables y los enlaces de entrega. El historial debe reflejar contribuciones reales de cada integrante.

Los beneficios ya están implementados con las decisiones de esta versión; permanece abierta su validación de alcance con el docente. Se incluyen mensajes opcionales en tortas y consulta de órdenes ficticias. La creación de órdenes, sus transiciones y el control definitivo de canjes se incorporarán en etapas posteriores.

En EV2 se evolucionará hacia React y componentes. En EV3 se incorporarán backend, base de datos y autenticación de servidor según las instrucciones del semestre. Estas etapas conservarán los requisitos y decisiones válidos de EV1, revisando los que necesiten adaptarse.

## 10 Fuentes y documentos de apoyo

- Instrucciones generales del proyecto semestral DSY1104, entregadas para la asignatura.
- Caso Forma C tienda Pastelería Mil Sabores, especialmente alcance, reglas comerciales, diseño y catálogo.
- Instrucciones oficiales de Evaluación 1 y rúbrica oficial incluidas en el ZIP del curso.
- Instrucciones de Evaluación 1 DSY1104 2026, video explicativo, entrega individual en AVA y checklist de preentrega.
- Guías de carrito, formularios, administración, personalización, imágenes, órdenes y beneficios incluidas en documentacion.
- Registro_verificacion_EV1.md y Checklist_navegador_EV1.md para el cierre de las comprobaciones.

Esta versión actualiza el ERS inicial y conserva sus identificadores para facilitar el seguimiento de requisitos.

## Anexo Catálogo inicial

Los precios corresponden al caso. Las existencias e imágenes son datos de demostración.

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
