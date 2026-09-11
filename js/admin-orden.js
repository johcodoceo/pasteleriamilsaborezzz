"use strict";

/* DETALLE DE ORDEN: identifica la selección por su número en la URL. */
(function () {
    const detalle = document.querySelector("#detalle-orden");
    const encabezado = document.querySelector("#numero-orden");
    const datos = document.querySelector("#datos-orden");
    const filas = document.querySelector("#items-orden");
    const total = document.querySelector("#total-orden");
    const numero = new URLSearchParams(window.location.search).get("id");

    function limpiar() {
        detalle.hidden = true;
        encabezado.textContent = "";
        datos.replaceChildren();
        filas.replaceChildren();
        total.textContent = "";
        document.title = "Detalle de orden | Gestión Mil Sabores";
    }

    function mostrarDetalle() {
        limpiar();
        const orden = Ordenes.buscar(numero);

        if (!orden) {
            Administracion.mostrarMensaje(
                "No se encontró la orden. Vuelve al listado y selecciona una orden disponible.",
            );
            return;
        }

        encabezado.textContent = `Orden ${orden.numero}`;
        const campos = [
            ["Fecha", Utilidades.formatearFecha(orden.fecha)],
            ["Estado", orden.estado],
            ["Cliente", orden.cliente.nombre],
            ["Correo", orden.cliente.correo],
        ];

        datos.innerHTML = campos.map(function ([nombre, valor]) {
            return `
                <div>
                    <dt>${Utilidades.escaparHTML(nombre)}</dt>
                    <dd>${Utilidades.escaparHTML(valor)}</dd>
                </div>
            `;
        }).join("");

        filas.innerHTML = orden.items.map(function (item) {
            const mensaje = item.mensaje ? `
                <p class="order-message">
                    <strong>Mensaje:</strong> ${Utilidades.escaparHTML(item.mensaje)}
                </p>
            ` : "";

            return `
                <tr>
                    <th scope="row">
                        <span class="record-code">${Utilidades.escaparHTML(item.codigo)}</span>
                        ${Utilidades.escaparHTML(item.nombre)}
                        ${mensaje}
                    </th>
                    <td class="numeric-cell">${item.cantidad}</td>
                    <td class="numeric-cell">${Utilidades.formatearPrecio(item.precioUnitario)}</td>
                    <td class="numeric-cell">${Utilidades.formatearPrecio(item.subtotal)}</td>
                </tr>
            `;
        }).join("");

        total.textContent = Utilidades.formatearPrecio(orden.total);
        detalle.hidden = false;
        Administracion.mostrarMensaje("");
        document.title = `Orden ${orden.numero} | Gestión Mil Sabores`;
    }

    Administracion.conectar({
        perfiles: ["Administrador", "Vendedor"],
        alAutorizar: mostrarDetalle,
        alRevocar: limpiar,
    });
})();
