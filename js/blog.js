"use strict";

/*
 * ARTÍCULOS DEL BLOG
 * Se separan del menú y del catálogo para que cada archivo tenga un propósito.
 */
(function () {
    const contenedor = document.querySelector("#articulo");

    if (!contenedor) {
        return;
    }

    const articulos = {
        tradicion: {
            categoria: "TRADICIÓN",
            titulo: "La tradición de compartir una torta",
            contenido: `
                <p>
                    Hay celebraciones grandes y otras que caben en una mesa pequeña.
                    En ambas, cortar una torta es una manera de hacer una pausa y
                    compartir algo con quienes queremos.
                </p>
                <h2>Un sabor que trae recuerdos</h2>
                <p>
                    La vainilla, el chocolate o el manjar pueden recordarnos una
                    tarde en familia. A veces elegimos una torta por su decoración;
                    otras, porque queremos volver a ese sabor conocido.
                </p>
                <h2>Una historia que continúa</h2>
                <p>
                    Mil Sabores celebra la repostería chilena y las recetas que
                    acompañan distintos momentos de la vida. La tradición también
                    deja espacio para nuevas ideas y para quienes están aprendiendo
                    a crear sus propios sabores.
                </p>
                <p>
                    La próxima vez que tengas algo que celebrar, empieza por la
                    pregunta más sencilla: ¿con quién te gustaría compartirlo?
                </p>
            `,
        },
        celebrar: {
            categoria: "INSPIRACIÓN",
            titulo: "Pequeños detalles para una gran celebración",
            contenido: `
                <p>
                    Una celebración puede sentirse especial sin ser complicada.
                    Elegir una mesa acogedora, un sabor que te guste y un momento
                    para reunirse ya es un buen comienzo.
                </p>
                <h2>Piensa en tus invitados</h2>
                <p>
                    Antes de elegir, conversa sobre sus preferencias y necesidades
                    alimentarias. Si hay alergias, consulta los ingredientes y la
                    preparación con quien elabore el producto; el nombre de una
                    categoría no reemplaza esa información.
                </p>
                <h2>Haz espacio para un mensaje</h2>
                <p>
                    Unas pocas palabras pueden convertir una torta en un recuerdo:
                    una felicitación, un agradecimiento o una frase que solo
                    ustedes entienden.
                </p>
                <h2>Disfruta el momento</h2>
                <p>
                    Prepara lo necesario con tiempo y deja espacio para conversar.
                    La torta acompaña la celebración; lo que la hace memorable son
                    las personas que se reúnen.
                </p>
            `,
        },
    };

    const parametros = new URLSearchParams(window.location.search);
    const id = parametros.get("id");
    const articulo = Object.prototype.hasOwnProperty.call(articulos, id)
        ? articulos[id]
        : null;

    if (!articulo) {
        contenedor.innerHTML = `
            <h1>Artículo no encontrado.</h1>
            <p>Vuelve al blog para elegir una historia.</p>
        `;
        return;
    }

    // El contenido es editorial local, no proviene de un formulario.
    contenedor.innerHTML = `
        <p class="eyebrow">${articulo.categoria}</p>
        <h1>${articulo.titulo}</h1>
        ${articulo.contenido}
    `;
    document.title = `${articulo.titulo} | Mil Sabores`;
})();
