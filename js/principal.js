/* Parte 2: navegación, catálogo de lectura y páginas de detalle.
   El carrito, las validaciones y los mantenedores se incorporarán por etapas. */
'use strict';
document.documentElement.classList.add('js-ready');
const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#menu-principal');
function closeMenu() {
  menu.classList.remove('is-open');
  menuButton.setAttribute('aria-expanded', 'false');
}
menuButton.addEventListener('click', () => {
  const isOpen = menu.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.classList.contains('is-open')) {
    closeMenu();
    menuButton.focus();
  }
});
const clp = new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 });
// Solo se interpolan datos locales controlados. Los parámetros de URL se buscan
// en el arreglo; nunca se insertan directamente como HTML.
for (const grid of document.querySelectorAll('[data-products]')) {
  const selected = grid.dataset.products === 'featured'
    ? PRODUCTOS.filter(product => ['TC001', 'TT002', 'PI002', 'PV001'].includes(product.codigo))
    : PRODUCTOS;
  grid.innerHTML = selected.map(product => `
    <article class="product-card">
      <span class="product-category">${product.categoria}</span>
      <h3><a href="producto.html?id=${product.codigo}">${product.nombre}</a></h3>
      <p>${product.descripcion}</p>
      <div class="product-bottom"><span class="price">${clp.format(product.precio)}</span>
      <a href="producto.html?id=${product.codigo}" aria-label="Ver ${product.nombre}">Ver detalle ↗</a></div>
    </article>`).join('');
}
const details = document.querySelector('#detalle-producto');
if (details) {
  const id = new URLSearchParams(window.location.search).get('id');
  const product = PRODUCTOS.find(item => item.codigo === id);
  if (!product) {
    details.innerHTML = '<div class="page-heading"><h1>Producto no encontrado.</h1><p>Selecciona un producto desde el catálogo.</p><a class="button" href="productos.html">Volver al catálogo</a></div>';
  } else {
    const hasPhoto = product.codigo === 'TC001';
    details.innerHTML = `<article class="detail-product ${hasPhoto ? '' : 'text-only'}">
      ${hasPhoto ? '<div><img src="assets/torta-chocolate.jpg" alt="Imagen ilustrativa de una torta de chocolate con frutillas" width="1536" height="1024"><p class="quiet-note">Imagen ilustrativa. La presentación del producto puede variar.</p></div>' : ''}
      <div><p class="eyebrow">${product.categoria} · ${product.codigo}</p><h1>${product.nombre}</h1><p class="lede">${product.descripcion}</p><p class="detail-price">${clp.format(product.precio)}</p><p class="quiet-note">Pronto podrás personalizar tu selección y agregarla al carrito.</p><a class="text-link" href="productos.html">Seguir explorando ↗</a></div></article>`;
    document.title = `${product.nombre} | Mil Sabores`;
  }
}
const article = document.querySelector('#articulo');
if (article) {
  const articles = {
    tradicion: { category: 'TRADICIÓN', title: 'La tradición de compartir una torta', content: '<p>Hay celebraciones grandes y otras que caben en una mesa pequeña. En ambas, cortar una torta es una manera de hacer una pausa y compartir algo con quienes queremos.</p><h2>Un sabor que trae recuerdos</h2><p>La vainilla, el chocolate o el manjar pueden recordarnos una tarde en familia. A veces elegimos una torta por su decoración; otras, porque queremos volver a ese sabor conocido.</p><h2>Una historia que continúa</h2><p>Mil Sabores celebra la repostería chilena y las recetas que acompañan distintos momentos de la vida. La tradición también deja espacio para nuevas ideas y para quienes están aprendiendo a crear sus propios sabores.</p><p>La próxima vez que tengas algo que celebrar, empieza por la pregunta más sencilla: ¿con quién te gustaría compartirlo?</p>' },
    celebrar: { category: 'INSPIRACIÓN', title: 'Pequeños detalles para una gran celebración', content: '<p>Una celebración puede sentirse especial sin ser complicada. Elegir una mesa acogedora, un sabor que te guste y un momento para reunirse ya es un buen comienzo.</p><h2>Piensa en tus invitados</h2><p>Antes de elegir, conversa sobre sus preferencias y necesidades alimentarias. Si hay alergias, consulta los ingredientes y la preparación con quien elabore el producto; el nombre de una categoría no reemplaza esa información.</p><h2>Haz espacio para un mensaje</h2><p>Unas pocas palabras pueden convertir una torta en un recuerdo: una felicitación, un agradecimiento o una frase que solo ustedes entienden.</p><h2>Disfruta el momento</h2><p>Prepara lo necesario con tiempo y deja espacio para conversar. La torta acompaña la celebración; lo que la hace memorable son las personas que se reúnen.</p>' }
  };
  const item = articles[new URLSearchParams(window.location.search).get('id')];
  article.innerHTML = item ? `<p class="eyebrow">${item.category}</p><h1>${item.title}</h1>${item.content}` : '<h1>Artículo no encontrado.</h1><p>Vuelve al blog para elegir una historia.</p>';
  if (item) document.title = `${item.title} | Mil Sabores`;
}
