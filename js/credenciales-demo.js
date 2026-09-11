"use strict";

/*
 * COMPARACIÓN LOCAL DE CONTRASEÑAS PARA EV1
 * Se almacena una derivación PBKDF2 con sal aleatoria, nunca el texto escrito.
 * Esto NO convierte el prototipo en autenticación real: todo sigue en el cliente.
 * La autenticación y autorización reales se implementarán en el backend.
 */
window.CredencialesDemo = (function () {
    const ITERACIONES = 100000;

    function aHexadecimal(bytes) {
        return Array.from(bytes, function (byte) {
            return byte.toString(16).padStart(2, "0");
        }).join("");
    }

    function desdeHexadecimal(texto) {
        return new Uint8Array(texto.match(/.{2}/g).map(function (par) {
            return Number.parseInt(par, 16);
        }));
    }

    async function derivar(contrasena, sal) {
        if (!window.crypto || !window.crypto.subtle) {
            throw new Error(
                "Abre el proyecto con Live Server en localhost o mediante HTTPS " +
                "para habilitar el registro de demostración.",
            );
        }

        const clave = await window.crypto.subtle.importKey(
            "raw",
            new TextEncoder().encode(contrasena),
            "PBKDF2",
            false,
            ["deriveBits"],
        );

        const resultado = await window.crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                hash: "SHA-256",
                salt: sal,
                iterations: ITERACIONES,
            },
            clave,
            256,
        );

        return aHexadecimal(new Uint8Array(resultado));
    }

    function esCredencialValida(credencial) {
        return Boolean(
            credencial &&
            credencial.metodo === "PBKDF2-SHA256" &&
            credencial.iteraciones === ITERACIONES &&
            /^[0-9a-f]{32}$/.test(credencial.sal) &&
            /^[0-9a-f]{64}$/.test(credencial.resumen),
        );
    }

    async function crear(contrasena) {
        if (!window.crypto) {
            throw new Error("No está disponible el registro en este navegador.");
        }

        const sal = window.crypto.getRandomValues(new Uint8Array(16));
        const resumen = await derivar(contrasena, sal);

        return {
            metodo: "PBKDF2-SHA256",
            iteraciones: ITERACIONES,
            sal: aHexadecimal(sal),
            resumen,
        };
    }

    async function verificar(contrasena, credencial) {
        if (!esCredencialValida(credencial)) {
            throw new Error("La cuenta guardada tiene una credencial inválida.");
        }

        const calculado = await derivar(contrasena, desdeHexadecimal(credencial.sal));
        return calculado === credencial.resumen;
    }

    return { crear, verificar, esCredencialValida };
})();
