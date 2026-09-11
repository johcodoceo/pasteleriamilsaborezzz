"use strict";

/*
 * CATÁLOGO PERSISTENTE
 * productos.js aporta los datos iniciales. Este módulo consulta y guarda cambios.
 * La tienda, el carrito y la administración utilizan el mismo catálogo.
 */
window.Inventario = (function () {
    const CLAVE_ALMACENAMIENTO = "milSabores.productos.v1";
    const categorias = [...new Set(window.PRODUCTOS.map(function (producto) {
        return producto.categoria;
    }))];
    let aviso = "";
    let productos = window.PRODUCTOS.map(function (producto) {
        return { ...producto };
    });

    // 1. LECTURA E INTEGRIDAD DE LOS DATOS

    function normalizarProducto(datos) {
        const codigo = window.Validaciones.texto(datos.codigo).toUpperCase();
        const inicial = window.PRODUCTOS.find(function (producto) {
            return producto.codigo === codigo;
        });

        return {
            codigo,
            nombre: window.Validaciones.texto(datos.nombre),
            descripcion: window.Validaciones.texto(datos.descripcion),
            precio: Number(datos.precio),
            stock: Number(datos.stock),
            stockCritico: datos.stockCritico === null || datos.stockCritico === undefined ||
                String(datos.stockCritico).trim() === "" ? null : Number(datos.stockCritico),
            categoria: datos.categoria,
            imagen: window.Validaciones.texto(datos.imagen),
            // Los catálogos de la Parte 5 aún no tienen esta propiedad.
            personalizable: datos.personalizable === undefined
                ? Boolean(inicial?.personalizable) : datos.personalizable,
        };
    }

    function leerGuardados() {
        let texto;

        try {
            texto = window.localStorage.getItem(CLAVE_ALMACENAMIENTO);
        } catch (error) {
            throw new Error("Este navegador no permite leer el catálogo guardado.");
        }

        if (texto === null) {
            return window.PRODUCTOS.map(normalizarProducto);
        }

        try {
            const datos = JSON.parse(texto);

            if (!Array.isArray(datos)) {
                throw new Error("Formato inválido.");
            }

            const codigos = new Set();

            return datos.map(function (dato) {
                if (!dato || Object.keys(window.Validaciones.validarProducto(dato, categorias)).length) {
                    throw new Error("Producto inválido.");
                }

                const producto = normalizarProducto(dato);

                if (codigos.has(producto.codigo)) {
                    throw new Error("Código repetido.");
                }

                codigos.add(producto.codigo);
                return producto;
            });
        } catch (error) {
            throw new Error(
                "No se puede leer el catálogo guardado. Se conserva la última copia disponible. " +
                "Revisa la recuperación de datos de prueba en la guía.",
            );
        }
    }

    function avisarCambio() {
        window.dispatchEvent(new CustomEvent("productos:actualizados"));
    }

    function recargar(notificar = true) {
        try {
            productos = leerGuardados();
            aviso = "";
        } catch (error) {
            aviso = error.message;
        }

        if (notificar) {
            avisarCambio();
        }
    }

    function persistir(nuevosProductos) {
        try {
            window.localStorage.setItem(CLAVE_ALMACENAMIENTO, JSON.stringify(nuevosProductos));
        } catch (error) {
            throw new Error("No se pudo guardar el catálogo. Los cambios no se aplicaron.");
        }

        productos = nuevosProductos;
        aviso = "";
        avisarCambio();
    }

    // 2. CONSULTAS: SIEMPRE SE ENTREGAN COPIAS

    function listar() {
        return productos.map(function (producto) {
            return { ...producto };
        });
    }

    function buscar(codigo) {
        const producto = productos.find(function (actual) {
            return actual.codigo === codigo;
        });

        return producto ? { ...producto } : null;
    }

    function esStockCritico(producto) {
        return producto.stockCritico !== null && producto.stock <= producto.stockCritico;
    }

    function obtenerImagen(producto) {
        if (!producto) {
            return "";
        }

        const inicial = window.PRODUCTOS.find(function (actual) {
            return actual.codigo === producto.codigo;
        });
        const imagenAnterior = producto.codigo === "TC001" &&
            producto.imagen === "assets/torta-chocolate.jpg";

        // Las imágenes propias tienen prioridad. Un campo vacío usa la imagen inicial.
        // TC001 tenía una foto circular compartida con la portada; ahora usa la cuadrada.
        if (producto.imagen && !imagenAnterior) {
            return producto.imagen;
        }

        return inicial ? inicial.imagen : "";
    }

    // 3. MUTACIONES DE DEMOSTRACIÓN: VUELVEN A COMPROBAR EL PERFIL

    function exigirAdministrador() {
        if (!window.CuentasDemo) {
            throw new Error("Inicia sesión como Administrador para modificar productos.");
        }

        window.CuentasDemo.exigirAdministrador();
    }

    function guardar(datos, codigoOriginal = null) {
        exigirAdministrador();
        const errores = window.Validaciones.validarProducto(datos, categorias);

        if (Object.keys(errores).length) {
            return { exito: false, mensaje: "Revisa los datos del producto.", errores };
        }

        const producto = normalizarProducto(datos);
        const actuales = leerGuardados();
        const indice = actuales.findIndex(function (actual) {
            return actual.codigo === producto.codigo;
        });

        if (codigoOriginal && codigoOriginal !== producto.codigo) {
            return {
                exito: false,
                mensaje: "El código identifica al producto y no se cambia al editar.",
                errores: { codigo: "Conserva el código original." },
            };
        }

        if (!codigoOriginal && indice !== -1) {
            return {
                exito: false,
                mensaje: "El código ya existe.",
                errores: { codigo: "Usa un código que no esté registrado." },
            };
        }

        if (codigoOriginal && indice === -1) {
            return { exito: false, mensaje: "El producto fue eliminado. Actualiza el listado." };
        }

        if (codigoOriginal) {
            actuales[indice] = producto;
        } else {
            actuales.push(producto);
        }

        persistir(actuales);
        return {
            exito: true,
            mensaje: codigoOriginal ? "Producto actualizado." : "Producto creado.",
            producto: { ...producto },
        };
    }

    function eliminar(codigo) {
        exigirAdministrador();
        const actuales = leerGuardados();

        const existe = actuales.some(function (producto) {
            return producto.codigo === codigo;
        });

        if (!existe) {
            return { exito: false, mensaje: "El producto ya no existe." };
        }

        const restantes = actuales.filter(function (producto) {
            return producto.codigo !== codigo;
        });
        persistir(restantes);
        return { exito: true, mensaje: "Producto eliminado del catálogo." };
    }

    // 4. CAMBIOS EN OTRAS PESTAÑAS Y NAVEGACIÓN HACIA ATRÁS

    window.addEventListener("storage", function (evento) {
        if (evento.key === CLAVE_ALMACENAMIENTO || evento.key === null) {
            recargar();
        }
    });

    window.addEventListener("pageshow", function (evento) {
        if (evento.persisted) {
            recargar();
        }
    });

    recargar(false);

    return {
        CLAVE_ALMACENAMIENTO,
        listar,
        buscar,
        guardar,
        eliminar,
        esStockCritico,
        obtenerImagen,
        obtenerCategorias: () => [...categorias],
        obtenerAviso: () => aviso,
    };
})();
