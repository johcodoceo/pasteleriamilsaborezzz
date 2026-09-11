"use strict";

/*
 * INTERFAZ ADMINISTRATIVA COMPARTIDA
 * Simula el acceso por perfil y reúne mensajes, detalles y listas de opciones.
 * Las operaciones vuelven a comprobar el perfil en los módulos de datos.
 */
window.Administracion = (function () {
    function mostrarMensaje(mensaje, exito = false) {
        const aviso = document.querySelector("#mensaje-administracion");
        aviso.textContent = mensaje;
        aviso.hidden = !mensaje;
        aviso.classList.toggle("is-success", exito);
        aviso.classList.toggle("is-error", !exito);
    }

    function textoBusqueda(valor) {
        return String(valor).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    function llenarOpciones(campo, opciones, mensaje) {
        campo.replaceChildren(new Option(mensaje, ""));

        for (const opcion of opciones) {
            campo.append(new Option(opcion, opcion));
        }
    }

    function cerrarDetalle() {
        const panel = document.querySelector("#panel-detalle");

        if (panel) {
            panel.hidden = true;
        }
    }

    function mostrarDetalle(titulo, campos, imagen = "") {
        const panel = document.querySelector("#panel-detalle");
        const encabezado = panel.querySelector("h2");
        encabezado.textContent = titulo;
        panel.querySelector("dl").innerHTML = campos.map(function ([nombre, valor]) {
            return `
                <div>
                    <dt>${Utilidades.escaparHTML(nombre)}</dt>
                    <dd>${Utilidades.escaparHTML(valor === "" ? "Sin informar" : valor)}</dd>
                </div>
            `;
        }).join("");

        const contenedorImagen = panel.querySelector("[data-imagen-detalle]");
        contenedorImagen.replaceChildren();

        if (imagen) {
            const foto = document.createElement("img");
            foto.src = Utilidades.rutaImagen(imagen, "../");
            foto.alt = titulo;
            foto.addEventListener("error", function () {
                contenedorImagen.textContent = "No se pudo cargar la imagen indicada.";
            });
            contenedorImagen.append(foto);
        }

        panel.hidden = false;
        encabezado.focus();
    }

    function conectar(opciones) {
        const area = document.querySelector("#area-administrativa");
        const acceso = document.querySelector("#acceso-administracion");
        const mensajeAcceso = document.querySelector("#mensaje-acceso");
        const botonPreparar = document.querySelector("#preparar-demostracion");
        let usuarioAnterior = null;

        function actualizarAcceso() {
            try {
                const usuario = CuentasDemo.obtenerSesion();
                const autorizado = usuario && opciones.perfiles.includes(usuario.tipoUsuario);

                if (!autorizado || usuarioAnterior?.tipoUsuario !== usuario.tipoUsuario ||
                    usuarioAnterior?.run !== usuario.run) {
                    opciones.alRevocar?.();
                    cerrarDetalle();
                }

                usuarioAnterior = usuario;
                area.hidden = !autorizado;
                acceso.hidden = Boolean(autorizado);
                botonPreparar.hidden = CuentasDemo.hayAdministrador();
                document.querySelector("#ir-productos-panel").hidden = usuario?.tipoUsuario !== "Vendedor";

                if (!autorizado) {
                    mensajeAcceso.textContent = usuario
                        ? `Tu perfil ${usuario.tipoUsuario} no puede abrir esta sección.`
                        : "Inicia sesión para abrir esta sección.";
                    return;
                }

                document.querySelector("#nombre-administrador").textContent =
                    `${usuario.nombre} · ${usuario.tipoUsuario}`;
                document.querySelectorAll("[data-solo-admin]").forEach(function (elemento) {
                    elemento.hidden = usuario.tipoUsuario !== "Administrador";
                });
                opciones.alAutorizar(usuario);
            } catch (error) {
                area.hidden = true;
                acceso.hidden = false;
                botonPreparar.hidden = true;
                mensajeAcceso.textContent = error.message;
                opciones.alRevocar?.();
            }
        }

        botonPreparar.addEventListener("click", async function () {
            botonPreparar.disabled = true;
            const resultado = document.querySelector("#resultado-preparacion");
            resultado.hidden = false;
            resultado.textContent = "Preparando las cuentas de ejemplo…";

            try {
                const respuesta = await CuentasDemo.prepararDemostracion();
                resultado.textContent = respuesta.mensaje;
                actualizarAcceso();
            } catch (error) {
                resultado.textContent = error.message;
            } finally {
                botonPreparar.disabled = false;
                resultado.focus();
            }
        });

        document.querySelector("#salir-administracion").addEventListener("click", function () {
            try {
                CuentasDemo.cerrarSesion();
                actualizarAcceso();
                mensajeAcceso.focus();
            } catch (error) {
                mostrarMensaje(error.message);
            }
        });

        document.querySelector("#cerrar-detalle")?.addEventListener("click", function () {
            cerrarDetalle();
            document.querySelector("#busqueda-admin")?.focus();
        });

        window.addEventListener("cuentas:actualizadas", actualizarAcceso);
        window.addEventListener("sesion:actualizada", actualizarAcceso);
        window.addEventListener("storage", function (evento) {
            if (evento.key === CuentasDemo.CLAVE_USUARIOS || evento.key === null) {
                actualizarAcceso();
            }
        });
        window.addEventListener("pageshow", function (evento) {
            if (evento.persisted) {
                actualizarAcceso();
            }
        });

        actualizarAcceso();
        return { actualizarAcceso };
    }

    return {
        conectar,
        mostrarMensaje,
        textoBusqueda,
        llenarOpciones,
        mostrarDetalle,
        cerrarDetalle,
    };
})();
