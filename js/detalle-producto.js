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
    const tieneFoto = producto.codigo === "TC001";

    const fotografia = tieneFoto ? `
        <div>
            <img
                src="assets/torta-chocolate.jpg"
                alt="Imagen ilustrativa de una torta de chocolate con frutillas"
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
                    <label for="cantidad-producto">Cantidad</label>
                    <p class="field-help" id="ayuda-cantidad">
                        Entre 1 y ${Carrito.CANTIDAD_MAXIMA} unidades por producto.
                    </p>
                    <div class="purchase-actions">
                        <input
                            id="cantidad-producto"
                            name="cantidad"
                            type="number"
                            min="1"
                            max="${Carrito.CANTIDAD_MAXIMA}"
                            step="1"
                            value="1"
                            required
                            aria-describedby="ayuda-cantidad error-cantidad"
                        >
                        <button class="button" type="submit">
                            Agregar al carrito
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

    document.title = `${producto.nombre} | Mil Sabores`;

    const formulario = document.querySelector("#formulario-agregar");
    const campoCantidad = document.querySelector("#cantidad-producto");
    const errorCantidad = document.querySelector("#error-cantidad");

    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const cantidad = Number(campoCantidad.value);
        const resultado = Carrito.agregar(producto.codigo, cantidad);

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
})();
