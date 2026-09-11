"use strict";

/* RESUMEN: los indicadores se calculan desde los registros actuales. */
(function () {
    function actualizar() {
        CuentasDemo.exigirAdministrador();
        const productos = Inventario.listar();
        const alertas = productos.filter(Inventario.esStockCritico);

        document.querySelector("#total-productos").textContent = productos.length;
        document.querySelector("#total-usuarios").textContent = CuentasDemo.listarUsuarios().length;
        document.querySelector("#total-alertas").textContent = alertas.length;
        Administracion.mostrarMensaje(Inventario.obtenerAviso());
    }

    Administracion.conectar({
        perfiles: ["Administrador"],
        alAutorizar: actualizar,
    });

    window.addEventListener("productos:actualizados", function () {
        try {
            actualizar();
        } catch (error) {
            Administracion.mostrarMensaje(error.message);
        }
    });
})();
