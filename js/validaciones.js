"use strict";

/*
 * REGLAS COMPARTIDAS DE FORMULARIOS
 * Son funciones puras: reciben datos y devuelven mensajes, sin tocar el HTML.
 * Un mensaje vacío significa que el campo es válido.
 */
window.Validaciones = (function () {
    const DOMINIOS_PERMITIDOS = ["duoc.cl", "profesor.duoc.cl", "gmail.com"];
    const TIPOS_USUARIO = ["Administrador", "Cliente", "Vendedor"];

    function texto(valor) {
        return typeof valor === "string" ? valor.trim() : "";
    }

    function validarTexto(valor, nombre, maximo, obligatorio = true) {
        const contenido = texto(valor);

        if (obligatorio && contenido === "") {
            return `Ingresa ${nombre}.`;
        }

        if (contenido.length > maximo) {
            return `Usa como máximo ${maximo} caracteres para ${nombre}.`;
        }

        return "";
    }

    // 1. RUN CHILENO: CUERPO NUMÉRICO Y DÍGITO VERIFICADOR (MÓDULO 11)

    function validarRun(valor) {
        const run = texto(valor).toUpperCase();

        if (!run) {
            return "Ingresa tu RUN.";
        }

        if (!/^\d{6,8}[0-9K]$/.test(run)) {
            return "Escribe un RUN de 7 a 9 caracteres, sin puntos ni guion.";
        }

        const cuerpo = run.slice(0, -1);
        const verificador = run.slice(-1);

        if (Number(cuerpo) === 0) {
            return "El RUN no puede contener un cuerpo formado solo por ceros.";
        }

        let suma = 0;
        let multiplicador = 2;

        for (let posicion = cuerpo.length - 1; posicion >= 0; posicion -= 1) {
            suma += Number(cuerpo[posicion]) * multiplicador;
            multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
        }

        const resultado = 11 - (suma % 11);
        let esperado = String(resultado);

        if (resultado === 11) {
            esperado = "0";
        } else if (resultado === 10) {
            esperado = "K";
        }

        return verificador === esperado ? "" : "Revisa el dígito verificador de tu RUN.";
    }

    // 2. CORREO Y CONTRASEÑA SEGÚN LA PAUTA EV1

    function validarCorreo(valor, obligatorio = true) {
        const correo = texto(valor).toLowerCase();
        const errorTexto = validarTexto(correo, "el correo", 100, obligatorio);

        if (errorTexto || correo === "") {
            return errorTexto;
        }

        const partes = correo.split("@");
        const parteLocal = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*$/i;

        if (partes.length !== 2 || !parteLocal.test(partes[0])) {
            return "Escribe un correo válido, por ejemplo nombre@gmail.com.";
        }

        if (!DOMINIOS_PERMITIDOS.includes(partes[1])) {
            return "Usa un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";
        }

        return "";
    }

    function validarContrasena(valor) {
        if (typeof valor !== "string" || valor.trim() === "") {
            return "Ingresa una contraseña.";
        }

        // No se recortan los espacios: la contraseña se compara exactamente.
        if (valor.length < 4 || valor.length > 10) {
            return "La contraseña debe tener entre 4 y 10 caracteres.";
        }

        return "";
    }

    // 3. FECHA Y UBICACIÓN

    function fechaHoy(fecha = new Date()) {
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const dia = String(fecha.getDate()).padStart(2, "0");
        return `${anio}-${mes}-${dia}`;
    }

    function validarNacimiento(valor, hoy = fechaHoy()) {
        const nacimiento = texto(valor);

        if (nacimiento === "") {
            return "";
        }

        if (!/^\d{4}-\d{2}-\d{2}$/.test(nacimiento)) {
            return "Selecciona una fecha de nacimiento válida.";
        }

        const [anio, mes, dia] = nacimiento.split("-").map(Number);
        const fecha = new Date(0);
        fecha.setFullYear(anio, mes - 1, dia);
        fecha.setHours(0, 0, 0, 0);

        if (
            anio < 1 ||
            fecha.getFullYear() !== anio ||
            fecha.getMonth() !== mes - 1 ||
            fecha.getDate() !== dia
        ) {
            return "Esa fecha no existe. Revisa el día, mes y año.";
        }

        if (nacimiento > hoy) {
            return "La fecha de nacimiento no puede estar en el futuro.";
        }

        return "";
    }

    function validarUbicacion(region, comuna, regiones) {
        const seleccionada = regiones.find(function (item) {
            return item.codigo === region;
        });

        if (!seleccionada) {
            return {
                region: "Selecciona una región de la lista.",
                comuna: "Primero selecciona una región.",
            };
        }

        const existeComuna = seleccionada.comunas.some(function (item) {
            return item.codigo === comuna;
        });

        return {
            region: "",
            comuna: existeComuna ? "" : "Selecciona una comuna de la región elegida.",
        };
    }

    // 4. VALIDACIONES COMPLETAS REUTILIZABLES

    function soloErrores(resultados) {
        const errores = {};

        for (const [campo, mensaje] of Object.entries(resultados)) {
            if (mensaje) {
                errores[campo] = mensaje;
            }
        }

        return errores;
    }

    function validarUsuario(datos, opciones = {}) {
        const regiones = opciones.regiones || [];
        const resultados = {
            run: validarRun(datos.run),
            nombre: validarTexto(datos.nombre, "tu nombre", 50),
            apellidos: validarTexto(datos.apellidos, "tus apellidos", 100),
            correo: validarCorreo(datos.correo),
            nacimiento: validarNacimiento(datos.nacimiento),
            ...validarUbicacion(datos.region, datos.comuna, regiones),
            direccion: validarTexto(datos.direccion, "tu dirección", 300),
        };

        // El registro público siempre crea Clientes. Este campo se reutilizará
        // únicamente en el formulario administrativo de la siguiente parte.
        if (opciones.esAdministracion) {
            resultados.tipoUsuario = TIPOS_USUARIO.includes(datos.tipoUsuario)
                ? ""
                : "Selecciona un tipo de usuario válido.";
        }

        return soloErrores(resultados);
    }

    function validarRegistro(datos, regiones) {
        const resultados = {
            ...validarUsuario(datos, { regiones }),
            contrasena: validarContrasena(datos.contrasena),
        };

        if (!datos.confirmacion) {
            resultados.confirmacion = "Repite la contraseña.";
        } else if (datos.confirmacion !== datos.contrasena) {
            resultados.confirmacion = "Las contraseñas deben coincidir.";
        }

        const codigo = texto(datos.codigoPromocional).toUpperCase();

        if (codigo && codigo !== "FELICES50") {
            resultados.codigoPromocional =
                "El código disponible es FELICES50. Puedes dejar este campo vacío.";
        }

        return soloErrores(resultados);
    }

    function validarLogin(datos) {
        return soloErrores({
            correo: validarCorreo(datos.correo),
            contrasena: validarContrasena(datos.contrasena),
        });
    }

    function validarContacto(datos) {
        return soloErrores({
            nombre: validarTexto(datos.nombre, "tu nombre", 100),
            // La pauta no declara obligatorio el correo de contacto.
            correo: validarCorreo(datos.correo, false),
            comentario: validarTexto(datos.comentario, "tu comentario", 500),
        });
    }

    return {
        DOMINIOS_PERMITIDOS,
        TIPOS_USUARIO,
        texto,
        validarTexto,
        validarRun,
        validarCorreo,
        validarContrasena,
        fechaHoy,
        validarNacimiento,
        validarUbicacion,
        validarUsuario,
        validarRegistro,
        validarLogin,
        validarContacto,
    };
})();
