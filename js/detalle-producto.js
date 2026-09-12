"use strict";

/*
 * DETALLE DE UN PRODUCTO
 * El código de la URL se busca en el catálogo; no se inserta como HTML.
 */
(function () {
    const contenedor = document.querySelector("#detalle-producto");

    if (!contenedor) {
        return;
    }

    const parametros = new URLSearchParams(window.location.search);

    function renderizar() {
        // Un cambio del catálogo conserva lo que la persona estaba escribiendo.
        const borradorMensaje = contenedor.querySelector("[data-mensaje-input]")?.value || "";
        const borradorCantidad = contenedor.querySelector("#cantidad-producto")?.value || "1";
        const producto = Carrito.buscarProducto(parametros.get("id"));

        if (!producto) {
            contenedor.innerHTML = `
                <div class="page-heading">
                    <h1>Producto no encontrado.</h1>
                    <p>Selecciona un producto desde el catálogo.</p>
                    <a class="button" href="productos.html">Volver al catálogo</a>
                </div>
            `;
            return;
        }

        const nombre = Utilidades.escaparHTML(producto.nombre);
        const categoria = Utilidades.escaparHTML(producto.categoria);
        const descripcion = Utilidades.escaparHTML(producto.descripcion);
        const codigo = Utilidades.escaparHTML(producto.codigo);
        const rutaImagen = Inventario.obtenerImagen(producto);
        const tieneFoto = Boolean(rutaImagen);
        const limite = Carrito.obtenerLimite(producto.codigo);
        const personalizacion = producto.personalizable ? `
            <div class="form-field cake-message-field" data-personalizacion>
                <label for="mensaje-torta">
                    Mensaje para tu torta <span class="optional-label">(opcional)</span>
                </label>
                <p id="ayuda-mensaje-torta" class="field-help" data-ayuda-mensaje></p>
                <input
                    id="mensaje-torta"
                    name="mensaje"
                    type="text"
                    placeholder="Ejemplo: ¡Feliz cumpleaños, Camila!"
                    aria-describedby="ayuda-mensaje-torta contador-mensaje-torta error-mensaje-torta"
                    data-mensaje-input
                >
                <p id="contador-mensaje-torta" class="message-counter" data-contador-mensaje></p>
                <p id="error-mensaje-torta" class="field-error" data-error-mensaje aria-live="polite"></p>
            </div>
        ` : "";

        const fotografia = tieneFoto ? `
            <div>
                <img
                    src="${Utilidades.escaparHTML(rutaImagen)}"
                    alt="${nombre}"
                    width="1536"
                    height="1024"
                >
                <p class="quiet-note">
                    Imagen ilustrativa. La presentación del producto puede variar.
                </p>
            </div>
        ` : "";

        contenedor.innerHTML = `
            <article class="detail-product ${tieneFoto ? "" : "text-only"}">
                ${fotografia}
                <div>
                    <p class="eyebrow">${categoria} · ${codigo}</p>
                    <h1>${nombre}</h1>
                    <p class="lede">${descripcion}</p>
                    <p class="detail-price">
                        ${Utilidades.formatearPrecio(producto.precio)}
                    </p>
                    <form id="formulario-agregar" class="purchase-form" novalidate>
                        ${personalizacion}
                        <label for="cantidad-producto">Cantidad</label>
                        <p class="field-help" id="ayuda-cantidad">
                            ${limite ? `Entre 1 y ${limite} unidades según el stock disponible.` : "Producto agotado."}
                        </p>
                        <div class="purchase-actions">
                            <input
                                id="cantidad-producto"
                                name="cantidad"
                                type="number"
                                min="1"
                                max="${Math.max(1, limite)}"
                                ${limite === 0 ? "disabled" : ""}
                                step="1"
                                value="1"
                                required
                                aria-describedby="ayuda-cantidad error-cantidad"
                            >
                            <button class="button" type="submit" ${limite === 0 ? "disabled" : ""}>
                                ${limite === 0 ? "Agotado" : "Agregar al carrito"}
                            </button>
                        </div>
                        <p id="error-cantidad" class="field-error" aria-live="polite"></p>
                    </form>
                    <div class="detail-links">
                        <a class="text-link" href="carrito.html">Ver carrito ↗</a>
                        <a class="text-link" href="productos.html">Seguir explorando</a>
                    </div>
                </div>
            </article>
        `;

        contenedor.querySelector("img")?.addEventListener("error", function (evento) {
            evento.target.hidden = true;
        });

        document.title = `${producto.nombre} | Mil Sabores`;

        const formulario = document.querySelector("#formulario-agregar");
        const campoCantidad = document.querySelector("#cantidad-producto");
        const errorCantidad = document.querySelector("#error-cantidad");
        const controlesMensaje = producto.personalizable
            ? Personalizacion.conectar(formulario, function () {
                return Carrito.buscarProducto(producto.codigo);
            })
            : null;

        campoCantidad.value = borradorCantidad;
        controlesMensaje?.restablecer(borradorMensaje);

        formulario.addEventListener("submit", function (evento) {
            evento.preventDefault();

            if (controlesMensaje?.validar()) {
                controlesMensaje.campo.focus();
                return;
            }

            const cantidad = Number(campoCantidad.value);
            const mensaje = controlesMensaje ? controlesMensaje.leer() : "";
            const resultado = Carrito.agregar(producto.codigo, cantidad, mensaje);

            errorCantidad.textContent = resultado.exito ? "" : resultado.mensaje;
            campoCantidad.setAttribute("aria-invalid", String(!resultado.exito));

            if (!resultado.exito) {
                campoCantidad.focus();
            }

            Interfaz.mostrarResultado(resultado);
        });

        campoCantidad.addEventListener("input", function () {
            errorCantidad.textContent = "";
            campoCantidad.removeAttribute("aria-invalid");
        });
    }

    window.addEventListener("productos:actualizados", renderizar);
    renderizar();
})();
