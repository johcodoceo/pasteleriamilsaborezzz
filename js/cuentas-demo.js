"use strict";

/*
 * CUENTAS LOCALES DE DEMOSTRACIÓN
 * Registro persistente en este navegador y sesión limitada a esta pestaña.
 * No protege rutas ni concede permisos administrativos.
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
    }

    function datosPublicos(usuario) {
        // La interfaz no necesita conocer ni la sal ni la derivación de la clave.
        const { credencial, ...datos } = usuario;
        return datos;
    }

    function buscarDuplicados(usuarios, run, correo) {
        const errores = {};

        const runExiste = usuarios.some(function (usuario) {
            return usuario.run === run;
        });
        const correoExiste = usuarios.some(function (usuario) {
            return usuario.correo === correo;
        });

        if (runExiste) {
            errores.run = "Este RUN ya está registrado en este navegador.";
        }

        if (correoExiste) {
            errores.correo = "Este correo ya está registrado. Puedes iniciar sesión.";
        }

        return errores;
    }

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
        return { exito: true, mensaje: "Sesión de demostración cerrada." };
    }

    return {
        CLAVE_USUARIOS,
        CLAVE_SESION,
        registrar,
        iniciarSesion,
        obtenerSesion,
        cerrarSesion,
    };
})();
