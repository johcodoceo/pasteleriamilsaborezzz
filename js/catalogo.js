"use strict";

/*
 * CATÁLOGO Y PRODUCTOS DESTACADOS
 * Inventario entrega el catálogo actual; carrito.js atiende la selección.
 */
(function () {
    const codigosDestacados = ["TC001", "TT002", "PI002", "PV001"];

    function crearTarjeta(producto) {
        const nombre = Utilidades.escaparHTML(producto.nombre);
        const categoria = Utilidades.escaparHTML(producto.categoria);
        const descripcion = Utilidades.escaparHTML(producto.descripcion);
        const codigo = Utilidades.escaparHTML(producto.codigo);
        const enlace = `producto.html?id=${encodeURIComponent(producto.codigo)}`;
        const rutaImagen = Inventario.obtenerImagen(producto);
        const imagen = rutaImagen ? `
            <a class="catalog-image-link" href="${enlace}" tabindex="-1" aria-hidden="true">
                <img
                    class="catalog-image"
                    src="${Utilidades.escaparHTML(rutaImagen)}"
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width="480"
                    height="320"
                >
            </a>
        ` : "";

        return `
            <article class="product-card">
                ${imagen}
                <span class="product-category">${categoria}</span>
                <h3>
                    <a href="${enlace}">${nombre}</a>
                </h3>
                <p>${descripcion}</p>
                <div class="product-bottom">
                    <span class="price">
                        ${Utilidades.formatearPrecio(producto.precio)}
                    </span>
                    <a href="${enlace}" aria-label="${producto.personalizable ? "Personalizar" : "Ver"} ${nombre}">
                        ${producto.personalizable ? "Personalizar" : "Ver detalle"} ↗
                    </a>
                </div>
                <button
                    class="button product-add"
                    type="button"
                    data-agregar="${codigo}"
                    aria-label="Agregar ${nombre} al carrito"
                    ${producto.stock === 0 ? "disabled" : ""}
                >
                    ${producto.stock === 0 ? "Agotado" : "Agregar al carrito"}
                </button>
            </article>
        `;
    }

    document.querySelectorAll("[data-products]").forEach(function (grilla) {
        function actualizar() {
            const productos = Inventario.listar();
            const seleccion = grilla.dataset.products === "featured"
                ? productos.filter(function (producto) {
                    return codigosDestacados.includes(producto.codigo);
                })
                : productos;

            grilla.innerHTML = seleccion.length ? seleccion.map(crearTarjeta).join("") :
                '<p class="quiet-note">No hay productos disponibles en esta selección.</p>';

            grilla.querySelectorAll("img").forEach(function (imagen) {
                imagen.addEventListener("error", function () {
                    imagen.hidden = true;
                });
            });
            document.querySelectorAll("[data-total-productos]").forEach(function (contador) {
                contador.textContent = productos.length;
            });
        }

        window.addEventListener("productos:actualizados", actualizar);
        actualizar();

        // Un solo listener atiende todos los botones de esta grilla.
        grilla.addEventListener("click", function (evento) {
            const boton = evento.target.closest("[data-agregar]");

            if (!boton) {
                return;
            }

            const resultado = Carrito.agregar(boton.dataset.agregar);
            Interfaz.mostrarResultado(resultado);
        });
    });
})();
