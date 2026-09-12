"use strict";

/*
 * BENEFICIOS DEL CARRITO
 * Calcula importes desde el catálogo y la cuenta vigente, sin guardar descuentos.
 * Las decisiones de acumulación y cumpleaños se explican en Guia_beneficios.md.
 */
window.Beneficios = (function () {
    const REGLAS = Object.freeze({
        edadMinima: 51,
        porcentajeEdad: 50,
        porcentajeRegistro: 10,
        codigoRegistro: "FELICES50",
        dominioEstudiantil: "duoc.cl",
        codigoTortaCumpleanos: "TE001",
        zonaHoraria: "America/Santiago",
    });
    const formatoDia = new Intl.DateTimeFormat("en-CA", {
        timeZone: REGLAS.zonaHoraria,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    // 1. FECHAS: EL MISMO DÍA COMERCIAL PARA TODAS LAS VISTAS DEL CARRITO

    function fechaHoy(fecha = new Date()) {
        const partes = formatoDia.formatToParts(fecha);
        const obtener = function (tipo) {
            return partes.find(function (parte) {
                return parte.type === tipo;
            }).value;
        };

        return `${obtener("year")}-${obtener("month")}-${obtener("day")}`;
    }

    function esBisiesto(anio) {
        return anio % 4 === 0 && (anio % 100 !== 0 || anio % 400 === 0);
    }

    function aniversario(nacimiento, anio) {
        const mesDia = nacimiento.slice(5);
        // Regla del prototipo: el 29 de febrero se celebra el 28 en años comunes.
        return `${anio}-${mesDia === "02-29" && !esBisiesto(anio) ? "02-28" : mesDia}`;
    }

    function obtenerCondiciones(usuario, hoy = fechaHoy()) {
        let edad = null;
        let cumpleanos = false;
        const nacimiento = usuario && usuario.nacimiento;

        if (nacimiento && !Validaciones.validarNacimiento(nacimiento, hoy)) {
            const anioActual = Number(hoy.slice(0, 4));
            const cumpleanosActual = aniversario(nacimiento, anioActual);
            edad = anioActual - Number(nacimiento.slice(0, 4));

            if (hoy < cumpleanosActual) {
                edad -= 1;
            }

            cumpleanos = hoy === cumpleanosActual;
        }

        const correo = usuario ? Validaciones.texto(usuario.correo).toLowerCase() : "";
        const esEstudiante = correo.endsWith(`@${REGLAS.dominioEstudiantil}`) &&
            !Validaciones.validarCorreo(correo);
        const tieneCodigo = Boolean(usuario) &&
            Validaciones.texto(usuario.codigoPromocional).toUpperCase() === REGLAS.codigoRegistro;

        return {
            edad,
            porEdad: edad !== null && edad >= REGLAS.edadMinima,
            porRegistro: tieneCodigo,
            porCumpleanos: Boolean(usuario) && esEstudiante && cumpleanos,
        };
    }

    // 2. CÁLCULO PURO: EL REGALO SE RESTA ANTES DEL MAYOR PORCENTAJE

    function calcular(resumen, usuario = null, hoy = fechaHoy()) {
        const condiciones = obtenerCondiciones(usuario, hoy);
        const subtotalCentavos = Math.round(resumen.total * 100);
        const torta = condiciones.porCumpleanos ? resumen.detalle.find(function (item) {
            return item.codigo === REGLAS.codigoTortaCumpleanos && item.cantidad > 0;
        }) : null;
        const regaloCentavos = torta ? Math.round(torta.precio * 100) : 0;
        const porcentaje = condiciones.porEdad ? REGLAS.porcentajeEdad :
            (condiciones.porRegistro ? REGLAS.porcentajeRegistro : 0);
        const baseCentavos = Math.max(0, subtotalCentavos - regaloCentavos);
        const porcentajeCentavos = Math.round(baseCentavos * porcentaje / 100);
        const descuentoCentavos = regaloCentavos + porcentajeCentavos;

        return {
            condiciones,
            subtotal: subtotalCentavos / 100,
            descuentoCumpleanos: regaloCentavos / 100,
            descuentoPorcentaje: porcentajeCentavos / 100,
            descuentoTotal: descuentoCentavos / 100,
            total: (subtotalCentavos - descuentoCentavos) / 100,
            porcentaje,
            motivoPorcentaje: condiciones.porEdad ? "Mayores de 50 años" :
                (condiciones.porRegistro ? REGLAS.codigoRegistro : ""),
            claveRegalo: torta ? torta.claveLinea : null,
            nombreRegalo: torta ? torta.nombre : "",
            mensajeRegalo: torta ? torta.mensaje : "",
        };
    }

    // 3. CONSULTA ACTUAL: NO SE CONFÍA EN IMPORTES NI EN USUARIOS GUARDADOS EN EL CARRITO

    function obtenerResumen(hoy = fechaHoy()) {
        let usuario = null;
        let aviso = "";

        try {
            usuario = CuentasDemo.obtenerSesion();
        } catch (error) {
            aviso = "No pudimos comprobar tu cuenta. El total se muestra sin beneficios. " +
                "Revisa tu acceso e inténtalo nuevamente.";
        }

        return {
            ...calcular(Carrito.obtenerResumen(), usuario, hoy),
            usuario,
            aviso,
        };
    }

    return { REGLAS, fechaHoy, obtenerCondiciones, calcular, obtenerResumen };
})();
