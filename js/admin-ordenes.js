"use strict";

/* LISTA DE ÓRDENES: muestra las consultas del módulo Ordenes. */
(function () {
    const filas = document.querySelector("#filas-ordenes");
    const tabla = document.querySelector("#tabla-ordenes");
    const vacio = document.querySelector("#lista-vacia");
    const cantidad = document.querySelector("#cantidad-ordenes");

    function limpiar() {
        filas.replaceChildren();
        cantidad.textContent = "";
        tabla.hidden = true;
        vacio.hidden = true;
    }

    function mostrarLista() {
        limpiar();
        const ordenes = Ordenes.listar();

        filas.innerHTML = ordenes.map(function (orden) {
            const numero = Utilidades.escaparHTML(orden.numero);
            const enlace = `orden.html?id=${encodeURIComponent(orden.numero)}`;

            return `
                <tr>
                    <th scope="row" class="order-number">${numero}</th>
                    <td>
                        <time datetime="${Utilidades.escaparHTML(orden.fecha)}">
                            ${Utilidades.formatearFecha(orden.fecha)}
                        </time>
                    </td>
                    <td>${Utilidades.escaparHTML(orden.cliente.nombre)}</td>
                    <td><span class="order-status">${Utilidades.escaparHTML(orden.estado)}</span></td>
                    <td class="numeric-cell">${Utilidades.formatearPrecio(orden.total)}</td>
                    <td>
                        <a class="text-link order-detail-link" href="${enlace}">
                            Ver detalle<span class="sr-only"> de ${numero}</span>
                        </a>
                    </td>
                </tr>
            `;
        }).join("");

        cantidad.textContent = `${ordenes.length} órdenes de demostración · Más recientes primero`;
        tabla.hidden = ordenes.length === 0;
        vacio.hidden = ordenes.length !== 0;
        Administracion.mostrarMensaje("");
    }

    Administracion.conectar({
        perfiles: ["Administrador", "Vendedor"],
        alAutorizar: mostrarLista,
        alRevocar: limpiar,
    });
})();
