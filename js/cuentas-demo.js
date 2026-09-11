"use strict";

/*
 * CUENTAS LOCALES DE DEMOSTRACIÓN
 * Registro persistente en este navegador y sesión limitada a esta pestaña.
<<<<<<< HEAD
 * Los perfiles simulan permisos de interfaz para EV1; no son seguridad de servidor.
=======
 * No protege rutas ni concede permisos administrativos.
>>>>>>> 709361959d35919bd602e5a089910d094d32dc5e
 */
window.CuentasDemo = (function () {
    const CLAVE_USUARIOS = "milSabores.usuarios.v1";
    const CLAVE_SESION = "milSabores.sesion.v1";

    // 1. ALMACENAMIENTO Y PROYECCIÓN SIN CREDENCIAL

    function leerUsuarios() {
        let texto;

        try {
            texto = window.localStorage.getItem(CLAVE_USUARIOS);
        } catch (error) {
            throw new Error("Este navegador no permite acceder a las cuentas locales.");
        }

        if (texto === null) {
            return [];
        }

        try {
            const usuarios = JSON.parse(texto);

            if (!Array.isArray(usuarios)) {
                throw new Error("Formato inválido.");
            }

            for (const usuario of usuarios) {
                if (
                    !usuario ||
                    Object.keys(Validaciones.validarUsuario(usuario, {
                        regiones: window.REGIONES,
                        esAdministracion: true,
                    })).length > 0 ||
                    !CredencialesDemo.esCredencialValida(usuario.credencial)
                ) {
                    throw new Error("Registro inválido.");
                }
            }

            return usuarios;
        } catch (error) {
            // No se sobrescriben datos anteriores si no se pueden interpretar.
            throw new Error(
                "No se pueden leer las cuentas guardadas. " +
                "Revisa la recuperación de datos de prueba en la guía del proyecto.",
            );
        }
    }

    function guardarUsuarios(usuarios) {
        try {
            window.localStorage.setItem(CLAVE_USUARIOS, JSON.stringify(usuarios));
        } catch (error) {
            throw new Error(
                "No se pudo guardar la cuenta. " +
                "Revisa los permisos de almacenamiento del navegador e inténtalo otra vez.",
            );
        }
<<<<<<< HEAD

        avisar("cuentas:actualizadas");
    }

    function avisar(tipo) {
        if (typeof window.dispatchEvent === "function") {
            window.dispatchEvent(new CustomEvent(tipo));
        }
=======
>>>>>>> 709361959d35919bd602e5a089910d094d32dc5e
    }

    function datosPublicos(usuario) {
        // La interfaz no necesita conocer ni la sal ni la derivación de la clave.
        const { credencial, ...datos } = usuario;
        return datos;
    }

<<<<<<< HEAD
    function buscarDuplicados(usuarios, run, correo, runExcluido = null) {
        const errores = {};

        const runExiste = usuarios.some(function (usuario) {
            return usuario.run !== runExcluido && usuario.run === run;
        });
        const correoExiste = usuarios.some(function (usuario) {
            return usuario.run !== runExcluido && usuario.correo === correo;
=======
    function buscarDuplicados(usuarios, run, correo) {
        const errores = {};

        const runExiste = usuarios.some(function (usuario) {
            return usuario.run === run;
        });
        const correoExiste = usuarios.some(function (usuario) {
            return usuario.correo === correo;
>>>>>>> 709361959d35919bd602e5a089910d094d32dc5e
        });

        if (runExiste) {
            errores.run = "Este RUN ya está registrado en este navegador.";
        }

        if (correoExiste) {
            errores.correo = "Este correo ya está registrado. Puedes iniciar sesión.";
        }

        return errores;
    }

<<<<<<< HEAD
    function construirUsuario(datos, credencial, anterior = null) {
        return {
            run: Validaciones.texto(datos.run).toUpperCase(),
            nombre: Validaciones.texto(datos.nombre),
            apellidos: Validaciones.texto(datos.apellidos),
            correo: Validaciones.texto(datos.correo).toLowerCase(),
            nacimiento: Validaciones.texto(datos.nacimiento),
            region: datos.region,
            comuna: datos.comuna,
            direccion: Validaciones.texto(datos.direccion),
            codigoPromocional: Validaciones.texto(datos.codigoPromocional).toUpperCase(),
            tipoUsuario: datos.tipoUsuario,
            creadoEn: anterior ? anterior.creadoEn : new Date().toISOString(),
            credencial,
        };
    }

=======
>>>>>>> 709361959d35919bd602e5a089910d094d32dc5e
    // 2. REGISTRO: REUTILIZA LAS MISMAS REGLAS QUE EL FORMULARIO

    async function registrar(datos) {
        const errores = Validaciones.validarRegistro(datos, window.REGIONES);

        if (Object.keys(errores).length > 0) {
            return { exito: false, mensaje: "Revisa los campos indicados.", errores };
        }

        const run = Validaciones.texto(datos.run).toUpperCase();
        const correo = Validaciones.texto(datos.correo).toLowerCase();
        let usuarios = leerUsuarios();
        let duplicados = buscarDuplicados(usuarios, run, correo);

        if (Object.keys(duplicados).length > 0) {
            return { exito: false, mensaje: "La cuenta ya existe.", errores: duplicados };
        }

        const credencial = await CredencialesDemo.crear(datos.contrasena);

        // Releer después de la operación asíncrona evita usar un arreglo antiguo.
        usuarios = leerUsuarios();
        duplicados = buscarDuplicados(usuarios, run, correo);

        if (Object.keys(duplicados).length > 0) {
            return { exito: false, mensaje: "La cuenta ya existe.", errores: duplicados };
        }

<<<<<<< HEAD
        // Se ignora cualquier perfil añadido manualmente al registro público.
        const usuario = construirUsuario({ ...datos, tipoUsuario: "Cliente" }, credencial);
=======
        const usuario = {
            run,
            nombre: Validaciones.texto(datos.nombre),
            apellidos: Validaciones.texto(datos.apellidos),
            correo,
            nacimiento: Validaciones.texto(datos.nacimiento),
            region: datos.region,
            comuna: datos.comuna,
            direccion: Validaciones.texto(datos.direccion),
            codigoPromocional: Validaciones.texto(datos.codigoPromocional).toUpperCase(),
            // Se ignora cualquier perfil añadido manualmente al registro público.
            tipoUsuario: "Cliente",
            creadoEn: new Date().toISOString(),
            credencial,
        };
>>>>>>> 709361959d35919bd602e5a089910d094d32dc5e

        usuarios.push(usuario);
        guardarUsuarios(usuarios);

        return {
            exito: true,
            mensaje: "Cuenta de demostración creada. Ya puedes iniciar sesión.",
            usuario: datosPublicos(usuario),
        };
    }

    // 3. INICIAR Y CERRAR LA SESIÓN DE ESTA PESTAÑA

    async function iniciarSesion(datos) {
        const errores = Validaciones.validarLogin(datos);

        if (Object.keys(errores).length > 0) {
            return { exito: false, mensaje: "Revisa tus datos de acceso.", errores };
        }

        const correo = Validaciones.texto(datos.correo).toLowerCase();
        const usuario = leerUsuarios().find(function (actual) {
            return actual.correo === correo;
        });

        if (!usuario || !await CredencialesDemo.verificar(datos.contrasena, usuario.credencial)) {
            return { exito: false, mensaje: "Correo o contraseña incorrectos." };
        }

        try {
            window.sessionStorage.setItem(CLAVE_SESION, JSON.stringify({ run: usuario.run }));
        } catch (error) {
            throw new Error("No se pudo iniciar la sesión en esta pestaña.");
        }

<<<<<<< HEAD
        avisar("sesion:actualizada");

=======
>>>>>>> 709361959d35919bd602e5a089910d094d32dc5e
        return {
            exito: true,
            mensaje: "Sesión de demostración iniciada.",
            usuario: datosPublicos(usuario),
        };
    }

    function obtenerSesion() {
        let texto;

        try {
            texto = window.sessionStorage.getItem(CLAVE_SESION);
        } catch (error) {
            throw new Error("Este navegador no permite leer la sesión de esta pestaña.");
        }

        if (!texto) {
            return null;
        }

        let sesion;

        try {
            sesion = JSON.parse(texto);
        } catch (error) {
            return null;
        }

        if (!sesion || Validaciones.validarRun(sesion.run)) {
            return null;
        }

        const usuario = leerUsuarios().find(function (actual) {
            return actual.run === sesion.run;
        });

        return usuario ? datosPublicos(usuario) : null;
    }

    function cerrarSesion() {
        try {
            window.sessionStorage.removeItem(CLAVE_SESION);
        } catch (error) {
            throw new Error("No se pudo cerrar la sesión. Revisa el almacenamiento del navegador.");
        }

        // No se borran las cuentas, el carrito ni otras preferencias.
<<<<<<< HEAD
        avisar("sesion:actualizada");
        return { exito: true, mensaje: "Sesión de demostración cerrada." };
    }

    // 4. CONSULTA Y EDICIÓN ADMINISTRATIVA

    function exigirAdministrador() {
        const usuario = obtenerSesion();

        if (!usuario || usuario.tipoUsuario !== "Administrador") {
            throw new Error("Esta operación requiere una sesión de Administrador.");
        }

        return usuario;
    }

    function listarUsuarios() {
        exigirAdministrador();
        return leerUsuarios().map(datosPublicos);
    }

    function obtenerUsuario(run) {
        return listarUsuarios().find(function (usuario) {
            return usuario.run === run;
        }) || null;
    }

    function comprobarCambioPerfil(actuales, anterior, nuevoPerfil, actor) {
        if (!anterior || anterior.tipoUsuario !== "Administrador" || nuevoPerfil === "Administrador") {
            return "";
        }

        if (anterior.run === actor.run) {
            return "No puedes quitarte el perfil Administrador desde tu propia sesión.";
        }

        const administradores = actuales.filter(function (usuario) {
            return usuario.tipoUsuario === "Administrador";
        });

        return administradores.length === 1 ? "Debe conservarse al menos un Administrador." : "";
    }

    async function guardarUsuario(datos, runOriginal = null) {
        let actor = exigirAdministrador();
        const errores = Validaciones.validarUsuarioAdministrativo(
            datos,
            window.REGIONES,
            Boolean(runOriginal),
        );

        if (Object.keys(errores).length) {
            return { exito: false, mensaje: "Revisa los datos del usuario.", errores };
        }

        const run = Validaciones.texto(datos.run).toUpperCase();
        const correo = Validaciones.texto(datos.correo).toLowerCase();

        if (runOriginal && runOriginal !== run) {
            return {
                exito: false,
                mensaje: "El RUN identifica la cuenta y se conserva al editar.",
                errores: { run: "Conserva el RUN original." },
            };
        }

        let actuales = leerUsuarios();
        let duplicados = buscarDuplicados(actuales, run, correo, runOriginal);

        if (Object.keys(duplicados).length) {
            return { exito: false, mensaje: "El RUN o correo ya existe.", errores: duplicados };
        }

        const nuevaCredencial = datos.contrasena ? await CredencialesDemo.crear(datos.contrasena) : null;

        // El perfil y los registros pueden cambiar durante la derivación asíncrona.
        actor = exigirAdministrador();
        actuales = leerUsuarios();
        duplicados = buscarDuplicados(actuales, run, correo, runOriginal);

        if (Object.keys(duplicados).length) {
            return { exito: false, mensaje: "El RUN o correo ya existe.", errores: duplicados };
        }

        const indice = actuales.findIndex(function (usuario) {
            return usuario.run === runOriginal;
        });

        if (runOriginal && indice === -1) {
            return { exito: false, mensaje: "La cuenta fue eliminada. Actualiza el listado." };
        }

        const anterior = indice === -1 ? null : actuales[indice];
        const errorPerfil = comprobarCambioPerfil(actuales, anterior, datos.tipoUsuario, actor);

        if (errorPerfil) {
            return { exito: false, mensaje: errorPerfil, errores: { tipoUsuario: errorPerfil } };
        }

        const credencial = nuevaCredencial || (anterior && anterior.credencial);
        const usuario = construirUsuario(datos, credencial, anterior);

        if (anterior) {
            actuales[indice] = usuario;
        } else {
            actuales.push(usuario);
        }

        guardarUsuarios(actuales);
        return {
            exito: true,
            mensaje: anterior ? "Usuario actualizado." : "Usuario creado.",
            usuario: datosPublicos(usuario),
        };
    }

    function eliminarUsuario(run) {
        const actor = exigirAdministrador();

        if (run === actor.run) {
            return { exito: false, mensaje: "No puedes eliminar la cuenta de tu sesión actual." };
        }

        const actuales = leerUsuarios();
        const anterior = actuales.find(function (usuario) {
            return usuario.run === run;
        });

        if (!anterior) {
            return { exito: false, mensaje: "La cuenta ya no existe." };
        }

        const errorPerfil = comprobarCambioPerfil(actuales, anterior, null, actor);

        if (errorPerfil) {
            return { exito: false, mensaje: errorPerfil };
        }

        guardarUsuarios(actuales.filter(function (usuario) {
            return usuario.run !== run;
        }));
        return { exito: true, mensaje: "Usuario eliminado." };
    }

    // 5. PREPARACIÓN EXPLÍCITA DEL EJERCICIO, SIN REEMPLAZAR CUENTAS EXISTENTES

    function hayAdministrador() {
        return leerUsuarios().some(function (usuario) {
            return usuario.tipoUsuario === "Administrador";
        });
    }

    async function prepararDemostracion() {
        if (hayAdministrador()) {
            return { exito: false, mensaje: "Ya existe un Administrador. Inicia sesión con esa cuenta." };
        }

        const ejemplos = [
            {
                run: "1000005K",
                nombre: "Administración",
                correo: "demo.admin@duoc.cl",
                tipoUsuario: "Administrador",
                contrasena: "Admin123",
            },
            {
                run: "10000068",
                nombre: "Ventas",
                correo: "demo.vendedor@duoc.cl",
                tipoUsuario: "Vendedor",
                contrasena: "Vende123",
            },
        ];
        const nuevos = [];

        for (const ejemplo of ejemplos) {
            const credencial = await CredencialesDemo.crear(ejemplo.contrasena);
            nuevos.push(construirUsuario({
                ...ejemplo,
                apellidos: "Demostración",
                nacimiento: "",
                region: "13",
                comuna: "13101",
                direccion: "Calle de Prueba 123",
                codigoPromocional: "",
            }, credencial));
        }

        // Releer impide sobrescribir una preparación terminada en otra pestaña.
        const actuales = leerUsuarios();
        const yaPreparado = actuales.some(function (usuario) {
            return usuario.tipoUsuario === "Administrador";
        });

        if (yaPreparado) {
            return { exito: false, mensaje: "El Administrador ya fue preparado. Puedes iniciar sesión." };
        }

        for (const nuevo of nuevos) {
            if (Object.keys(buscarDuplicados(actuales, nuevo.run, nuevo.correo)).length) {
                return {
                    exito: false,
                    mensaje: "Un RUN o correo de ejemplo ya está ocupado. No se reemplazaron cuentas.",
                };
            }
        }

        guardarUsuarios([...actuales, ...nuevos]);
        return { exito: true, mensaje: "Cuentas preparadas. Inicia sesión con las credenciales de ejemplo." };
    }

=======
        return { exito: true, mensaje: "Sesión de demostración cerrada." };
    }

>>>>>>> 709361959d35919bd602e5a089910d094d32dc5e
    return {
        CLAVE_USUARIOS,
        CLAVE_SESION,
        registrar,
        iniciarSesion,
        obtenerSesion,
        cerrarSesion,
<<<<<<< HEAD
        exigirAdministrador,
        listarUsuarios,
        obtenerUsuario,
        guardarUsuario,
        eliminarUsuario,
        hayAdministrador,
        prepararDemostracion,
=======
>>>>>>> 709361959d35919bd602e5a089910d094d32dc5e
    };
})();
