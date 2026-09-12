"use strict";

/* MANTENEDOR DE PRODUCTOS: presentación; Inventario valida y guarda. */
(function () {
    const filas = document.querySelector("#filas-productos");
    const busqueda = document.querySelector("#busqueda-admin");
    const panelEditor = document.querySelector("#panel-editor");
    const formulario = document.querySelector("#formulario-admin");
    let codigoEdicion = null;
    let usuarioActual = null;

    Administracion.llenarOpciones(
        formulario.elements.categoria,
        Inventario.obtenerCategorias(),
        "Selecciona una categoría",
    );

    // 1. LISTADO Y ALERTAS

    function listar() {
        if (!usuarioActual) {
            return;
        }

        const consulta = Administracion.textoBusqueda(busqueda.value.trim());
        const productos = Inventario.listar();
        const seleccion = productos.filter(function (producto) {
            return Administracion.textoBusqueda(
                `${producto.codigo} ${producto.nombre} ${producto.categoria}`,
            ).includes(consulta);
        });
        const esAdministrador = usuarioActual.tipoUsuario === "Administrador";

        filas.innerHTML = seleccion.map(function (producto) {
            const codigo = Utilidades.escaparHTML(producto.codigo);
            const nombre = Utilidades.escaparHTML(producto.nombre);
            const critico = Inventario.esStockCritico(producto);
            const estado = producto.stock === 0 ? "Agotado" : critico ? "Stock crítico" : "Disponible";
            const botonesEdicion = esAdministrador ? `
                <button type="button" data-accion="editar" data-codigo="${codigo}">Editar</button>
                <button type="button" class="danger-link" data-accion="eliminar" data-codigo="${codigo}">
                    Eliminar
                </button>
            ` : "";

            return `
                <tr>
                    <th scope="row"><span class="record-code">${codigo}</span>${nombre}</th>
                    <td>${Utilidades.escaparHTML(producto.categoria)}</td>
                    <td class="numeric-cell">${Utilidades.formatearPrecio(producto.precio)}</td>
                    <td class="numeric-cell">${producto.stock}</td>
                    <td><span class="stock-badge ${critico || producto.stock === 0 ? "is-low" : ""}">
                        ${estado}
                    </span></td>
                    <td><div class="row-actions">
                        <button type="button" data-accion="ver" data-codigo="${codigo}">Ver</button>
                        ${botonesEdicion}
                    </div></td>
                </tr>
            `;
        }).join("");

        document.querySelector("#cantidad-registros").textContent =
            `${seleccion.length} de ${productos.length} productos`;
        document.querySelector("#lista-vacia").hidden = seleccion.length !== 0;
        const alertas = productos.filter(Inventario.esStockCritico);
        const avisoStock = document.querySelector("#alerta-stock");
        avisoStock.hidden = alertas.length === 0;
        avisoStock.textContent =
            `${alertas.length} producto(s) con stock igual o inferior al umbral. Revisa su reposición.`;

        const aviso = Inventario.obtenerAviso();

        if (aviso) {
            Administracion.mostrarMensaje(aviso);
        }
    }

    // 2. FORMULARIO DE CREACIÓN Y EDICIÓN

    function cerrarEditor(enfocar = false) {
        panelEditor.hidden = true;
        codigoEdicion = null;
        formulario.reset();
        controles.limpiar();

        if (enfocar) {
            busqueda.focus();
        }
    }

    function actualizarImagen() {
        const contenedor = document.querySelector("#vista-imagen");
        const rutaIngresada = formulario.elements.imagen.value.trim();
        contenedor.replaceChildren();

        if (Validaciones.validarImagen(rutaIngresada)) {
            return;
        }

        const ruta = Inventario.obtenerImagen({
            codigo: formulario.elements.codigo.value.trim().toUpperCase(),
            imagen: rutaIngresada,
        });

        if (!ruta) {
            return;
        }

        const foto = document.createElement("img");
        foto.src = Utilidades.rutaImagen(ruta, "../");
        foto.alt = "Vista previa de la imagen del producto";
        foto.addEventListener("error", function () {
            contenedor.textContent = "No se pudo cargar la imagen. Revisa su dirección.";
        });
        contenedor.append(foto);
    }

    function abrirEditor(producto = null) {
        CuentasDemo.exigirAdministrador();
        formulario.reset();
        controles.limpiar();
        codigoEdicion = producto ? producto.codigo : null;

        if (producto) {
            for (const [nombre, valor] of Object.entries(producto)) {
                const campo = formulario.elements.namedItem(nombre);

                if (campo?.type === "checkbox") {
                    campo.checked = Boolean(valor);
                } else if (campo) {
                    campo.value = valor === null ? "" : valor;
                }
            }
        }

        formulario.elements.codigo.readOnly = Boolean(producto);
        document.querySelector("#titulo-editor").textContent = producto ? "Editar producto" : "Nuevo producto";
        Administracion.cerrarDetalle();
        panelEditor.hidden = false;
        controles.limpiar();
        actualizarImagen();
        (producto ? formulario.elements.nombre : formulario.elements.codigo).focus();
    }

    const controles = Formularios.conectar({
        formulario,
        validar: function (datos) {
            return Validaciones.validarProducto(datos, Inventario.obtenerCategorias());
        },
        alValidar: function (datos) {
            return Inventario.guardar(datos, codigoEdicion);
        },
        alExito: function (respuesta) {
            cerrarEditor(true);
            listar();
            Administracion.mostrarMensaje(respuesta.mensaje, true);
        },
    });

    // 3. ACCIONES DEL LISTADO

    filas.addEventListener("click", function (evento) {
        const boton = evento.target.closest("[data-accion]");

        if (!boton) {
            return;
        }

        try {
            const producto = Inventario.buscar(boton.dataset.codigo);

            if (!producto) {
                throw new Error("El producto ya no está disponible. Actualiza la lista.");
            }

            if (boton.dataset.accion === "ver") {
                cerrarEditor();
                Administracion.mostrarDetalle(producto.nombre, [
                    ["Código", producto.codigo],
                    ["Categoría", producto.categoria],
                    ["Descripción", producto.descripcion],
                    ["Precio", Utilidades.formatearPrecio(producto.precio)],
                    ["Stock", producto.stock],
                    ["Stock crítico", producto.stockCritico === null ? "Sin umbral" : producto.stockCritico],
                    ["Permite mensaje personalizado", producto.personalizable ? "Sí" : "No"],
                ], Inventario.obtenerImagen(producto));
            } else if (boton.dataset.accion === "editar") {
                abrirEditor(producto);
            } else if (boton.dataset.accion === "eliminar") {
                CuentasDemo.exigirAdministrador();
                const confirmado = window.confirm(
                    `¿Eliminar ${producto.nombre}? También se quitará de los carritos de este navegador.`,
                );

                if (confirmado) {
                    const respuesta = Inventario.eliminar(producto.codigo);
                    cerrarEditor(true);
                    Administracion.cerrarDetalle();
                    Administracion.mostrarMensaje(respuesta.mensaje, respuesta.exito);
                }
            }
        } catch (error) {
            Administracion.mostrarMensaje(error.message);
        }
    });

    document.querySelector("#nuevo-registro").addEventListener("click", function () {
        try {
            abrirEditor();
        } catch (error) {
            Administracion.mostrarMensaje(error.message);
        }
    });
    document.querySelector("#cancelar-edicion").addEventListener("click", () => cerrarEditor(true));
    formulario.elements.imagen.addEventListener("change", actualizarImagen);
    busqueda.addEventListener("input", listar);
    window.addEventListener("productos:actualizados", listar);

    Administracion.conectar({
        perfiles: ["Administrador", "Vendedor"],
        alAutorizar: function (usuario) {
            usuarioActual = usuario;
            listar();
        },
        alRevocar: function () {
            usuarioActual = null;
            filas.replaceChildren();
            cerrarEditor();
        },
    });
})();
