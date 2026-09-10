"use strict";

/*
 * CATÁLOGO Y PRODUCTOS DESTACADOS
 * Los datos están en productos.js; las operaciones están en carrito.js.
 */
(function () {
    const codigosDestacados = ["TC001", "TT002", "PI002", "PV001"];

    function crearTarjeta(producto) {
        const nombre = Utilidades.escaparHTML(producto.nombre);
        const categoria = Utilidades.escaparHTML(producto.categoria);
        const descripcion = Utilidades.escaparHTML(producto.descripcion);
        const codigo = Utilidades.escaparHTML(producto.codigo);
        const enlace = `producto.html?id=${encodeURIComponent(producto.codigo)}`;

        return `
            <article class="product-card">
                <span class="product-category">${categoria}</span>
                <h3>
                    <a href="${enlace}">${nombre}</a>
                </h3>
                <p>${descripcion}</p>
                <div class="product-bottom">
                    <span class="price">
                        ${Utilidades.formatearPrecio(producto.precio)}
                    </span>
                    <a href="${enlace}" aria-label="Ver ${nombre}">
                        Ver detalle ↗
                    </a>
                </div>
                <button
                    class="button product-add"
                    type="button"
                    data-agregar="${codigo}"
                    aria-label="Agregar ${nombre} al carrito"
                >
                    Agregar al carrito
                </button>
            </article>
        `;
    }

    document.querySelectorAll("[data-products]").forEach(function (grilla) {
        const seleccion = grilla.dataset.products === "featured"
            ? PRODUCTOS.filter(function (producto) {
                return codigosDestacados.includes(producto.codigo);
            })
            : PRODUCTOS;

        grilla.innerHTML = seleccion.map(crearTarjeta).join("");

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
