"use strict";

/* MANTENEDOR DE USUARIOS: reutiliza reglas, cuentas y selectores de la Parte 4. */
(function () {
    const filas = document.querySelector("#filas-usuarios");
    const busqueda = document.querySelector("#busqueda-admin");
    const panelEditor = document.querySelector("#panel-editor");
    const formulario = document.querySelector("#formulario-admin");
    let runEdicion = null;

    const ubicacion = UbicacionFormulario.conectar(
        formulario.elements.region,
        formulario.elements.comuna,
    );
    Administracion.llenarOpciones(
        formulario.elements.tipoUsuario,
        Validaciones.TIPOS_USUARIO,
        "Selecciona un perfil",
    );
    formulario.elements.nacimiento.max = Validaciones.fechaHoy();

    // 1. LISTADO Y CONSULTA

    function listar() {
        const consulta = Administracion.textoBusqueda(busqueda.value.trim());
        const usuarios = CuentasDemo.listarUsuarios();
        const seleccion = usuarios.filter(function (usuario) {
            return Administracion.textoBusqueda(
                `${usuario.run} ${usuario.nombre} ${usuario.apellidos} ${usuario.correo} ${usuario.tipoUsuario}`,
            ).includes(consulta);
        });

        filas.innerHTML = seleccion.map(function (usuario) {
            const run = Utilidades.escaparHTML(usuario.run);

            return `
                <tr>
                    <th scope="row">
                        <span class="record-code">${run}</span>
                        ${Utilidades.escaparHTML(usuario.nombre + " " + usuario.apellidos)}
                    </th>
                    <td>${Utilidades.escaparHTML(usuario.correo)}</td>
                    <td>${Utilidades.escaparHTML(usuario.tipoUsuario)}</td>
                    <td><div class="row-actions">
                        <button type="button" data-accion="ver" data-run="${run}">Ver</button>
                        <button type="button" data-accion="editar" data-run="${run}">Editar</button>
                        <button type="button" class="danger-link" data-accion="eliminar" data-run="${run}">
                            Eliminar
                        </button>
                    </div></td>
                </tr>
            `;
        }).join("");

        document.querySelector("#cantidad-registros").textContent =
            `${seleccion.length} de ${usuarios.length} usuarios`;
        document.querySelector("#lista-vacia").hidden = seleccion.length !== 0;
    }

    function mostrarUsuario(usuario) {
        const region = window.REGIONES.find(function (actual) {
            return actual.codigo === usuario.region;
        });
        const comuna = region.comunas.find(function (actual) {
            return actual.codigo === usuario.comuna;
        });

        Administracion.mostrarDetalle(`${usuario.nombre} ${usuario.apellidos}`, [
            ["RUN", usuario.run],
            ["Correo", usuario.correo],
            ["Perfil", usuario.tipoUsuario],
            ["Nacimiento", usuario.nacimiento ? usuario.nacimiento.split("-").reverse().join("/") : ""],
            ["Región", region.nombre],
            ["Comuna", comuna.nombre],
            ["Dirección", usuario.direccion],
            ["Código promocional", usuario.codigoPromocional],
        ]);
    }

    // 2. FORMULARIO: EL RUN SE CONSERVA Y LA CONTRASEÑA NUNCA SE PRECARGA

    function cerrarEditor(enfocar = false) {
        panelEditor.hidden = true;
        runEdicion = null;
        formulario.reset();
        ubicacion.actualizarComunas();
        controles.limpiar();

        if (enfocar) {
            busqueda.focus();
        }
    }

    function abrirEditor(usuario = null) {
        CuentasDemo.exigirAdministrador();
        formulario.reset();
        controles.limpiar();
        runEdicion = usuario ? usuario.run : null;
        ubicacion.actualizarComunas();

        if (usuario) {
            for (const nombre of [
                "run", "nombre", "apellidos", "correo", "nacimiento", "direccion",
                "tipoUsuario", "codigoPromocional", "region",
            ]) {
                formulario.elements.namedItem(nombre).value = usuario[nombre] || "";
            }

            ubicacion.actualizarComunas();
            formulario.elements.comuna.value = usuario.comuna;
        }

        formulario.elements.run.readOnly = Boolean(usuario);
        formulario.elements.codigoPromocional.readOnly = Boolean(usuario);
        formulario.elements.contrasena.required = !usuario;
        formulario.elements.confirmacion.required = !usuario;
        document.querySelector("#ayuda-contrasena").textContent = usuario
            ? "Opcional: deja ambas contraseñas vacías para conservar la actual. Si la cambias, usa 4 a 10 caracteres."
            : "Entre 4 y 10 caracteres. Repite la misma clave en la confirmación.";
        document.querySelector("#titulo-editor").textContent = usuario ? "Editar usuario" : "Nuevo usuario";
        Administracion.cerrarDetalle();
        panelEditor.hidden = false;
        (usuario ? formulario.elements.nombre : formulario.elements.run).focus();
    }

    const controles = Formularios.conectar({
        formulario,
        validar: function (datos) {
            return Validaciones.validarUsuarioAdministrativo(datos, window.REGIONES, Boolean(runEdicion));
        },
        alValidar: function (datos) {
            return CuentasDemo.guardarUsuario(datos, runEdicion);
        },
        alExito: function (respuesta) {
            cerrarEditor(true);
            listar();
            Administracion.mostrarMensaje(respuesta.mensaje, true);
        },
    });

    // 3. ACCIONES Y CAMBIOS DE SESIÓN

    filas.addEventListener("click", function (evento) {
        const boton = evento.target.closest("[data-accion]");

        if (!boton) {
            return;
        }

        try {
            const usuario = CuentasDemo.obtenerUsuario(boton.dataset.run);

            if (!usuario) {
                throw new Error("La cuenta ya no existe. Actualiza el listado.");
            }

            if (boton.dataset.accion === "ver") {
                cerrarEditor();
                mostrarUsuario(usuario);
            } else if (boton.dataset.accion === "editar") {
                abrirEditor(usuario);
            } else if (boton.dataset.accion === "eliminar") {
                const confirmado = window.confirm(
                    `¿Eliminar la cuenta de ${usuario.nombre} ${usuario.apellidos}? No se puede deshacer.`,
                );

                if (confirmado) {
                    const respuesta = CuentasDemo.eliminarUsuario(usuario.run);

                    if (respuesta.exito) {
                        cerrarEditor(true);
                        Administracion.cerrarDetalle();
                        listar();
                    }

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
    busqueda.addEventListener("input", function () {
        try {
            listar();
        } catch (error) {
            Administracion.mostrarMensaje(error.message);
        }
    });

    Administracion.conectar({
        perfiles: ["Administrador"],
        alAutorizar: listar,
        alRevocar: function () {
            filas.replaceChildren();
            cerrarEditor();
        },
    });
})();
