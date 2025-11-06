// Estado del carrito
const estado = { items: [] };

// Atajos
const A = (sel, root = document) => root.querySelector(sel);
const AA = (sel, root = document) => [...root.querySelectorAll(sel)];
const formatoPrecio = (n) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

// Elementos
const productos = A("#productos");
const contadorCarrito = A("#contadorCarrito");
const panelCarrito = A("#panelCarrito");
const fondo = A("#fondo");
const itemsCarrito = A("#itemsCarrito");
const totalCarrito = A("#totalCarrito");
const mensaje = A("#mensaje");

// Agregar al carrito
productos.addEventListener("click", (e) => {
  const boton = e.target.closest(".btn-agregar");
  if (!boton) return;

  const tarjeta = e.target.closest(".tarjeta-producto");
  const id = tarjeta.dataset.id;
  const nombre = tarjeta.dataset.nombre;
  const precio = Number(tarjeta.dataset.precio);

  const existente = estado.items.find(i => i.id === id);
  if (existente) existente.cantidad += 1;
  else estado.items.push({ id, nombre, precio, cantidad: 1 });

  mostrarCarrito();
  mostrarMensaje(`🛒 Agregado: <b>A{nombre}</b>`);
  animarContador();
});

// Render del carrito
function mostrarCarrito() {
  const totalItems = estado.items.reduce((a, i) => a + i.cantidad, 0);
  contadorCarrito.textContent = totalItems;

  if (estado.items.length === 0) {
    itemsCarrito.innerHTML = `<p class="vacio">Tu carrito está vacío.</p>`;
    totalCarrito.textContent = formatoPrecio(0);
    return;
  }

  itemsCarrito.innerHTML = estado.items.map(item => `
    <div class="fila-carrito" data-id="A{item.id}">
      <div class="info">
        <strong>A{item.nombre}</strong>
        <span>A{formatoPrecio(item.precio)} x A{item.cantidad}</span>
      </div>
      <div class="acciones">
        <button class="boton-cantidad" data-accion="menos">−</button>
        <span>A{item.cantidad}</span>
        <button class="boton-cantidad" data-accion="mas">+</button>
        <button class="boton-eliminar" data-accion="eliminar">×</button>
      </div>
    </div>
  `).join("");

  const total = estado.items.reduce((a, i) => a + i.precio * i.cantidad, 0);
  totalCarrito.textContent = formatoPrecio(total);
}

// Acciones dentro del carrito
itemsCarrito.addEventListener("click", (e) => {
  const fila = e.target.closest(".fila-carrito");
  if (!fila) return;
  const id = fila.dataset.id;
  const accion = e.target.dataset.accion;

  const item = estado.items.find(i => i.id === id);
  if (!item) return;

  if (accion === "mas") item.cantidad += 1;
  if (accion === "menos") item.cantidad = Math.max(1, item.cantidad - 1);
  if (accion === "eliminar") {
    estado.items = estado.items.filter(i => i.id !== id);
    mostrarMensaje("🗑️ Producto eliminado");
  }

  mostrarCarrito();
});

/* Abrir / cerrar carrito
//A("#cerrarCarrito").addEventListener("click", cerrarCarrito);
fondo.addEventListener("click", cerrarCarrito);
function cerrarCarrito() {
  panelCarrito.setAttribute("aria-hidden", "true");
  fondo.classList.remove("mostrar");
}*/

// Mensaje flotante
let tiempoMensaje;
function mostrarMensaje(texto) {
  mensaje.innerHTML = texto;
  mensaje.classList.add("mostrar");
  clearTimeout(tiempoMensaje);
  tiempoMensaje = setTimeout(() => mensaje.classList.remove("mostrar"), 2200);
}

// Animar contador
function animarContador() {
  contadorCarrito.classList.remove("pop");
  void contadorCarrito.offsetWidth;
  contadorCarrito.classList.add("pop");
}

// Filtrado de categorías
const listaCategorias = A("#listaCategorias");
listaCategorias.addEventListener("click", (e) => {
  const boton = e.target.closest(".boton-categoria");
  if (!boton) return;
  AA(".boton-categoria", listaCategorias).forEach(b => b.classList.remove("activo"));
  boton.classList.add("activo");
  const cat = boton.dataset.categoria;

  AA(".tarjeta-producto", productos).forEach(card => {
    const visible = cat === "todas" || card.dataset.categoria.split(" ").includes(cat);
    card.style.display = visible ? "" : "none";
  });
});

// Filtros
const buscarTexto = A("#buscarTexto");
const precioMax = A("#precioMax");
const limpiarFiltros = A("#limpiarFiltros");

function aplicarFiltros() {
  const texto = (buscarTexto.value || "").toLowerCase();
  const max = Number(precioMax.value) || Infinity;
  const activa = A(".boton-categoria.activo", listaCategorias)?.dataset.categoria || "todas";

  AA(".tarjeta-producto", productos).forEach(card => {
    const nombre = card.dataset.nombre.toLowerCase();
    const precio = Number(card.dataset.precio);
    const coincide = nombre.includes(texto) && precio <= max;
    const coincideCat = activa === "todas" || card.dataset.categoria === activa;
    card.style.display = coincide && coincideCat ? "" : "none";
  });
}
[buscarTexto, precioMax].forEach(el => el.addEventListener("input", aplicarFiltros));
limpiarFiltros.addEventListener("click", () => {
  buscarTexto.value = "";
  precioMax.value = "";
  A("#listaCategorias .boton-categoria[data-categoria='todas']").click();
  aplicarFiltros();
});

// Finalizar compra
A("#botonComprar").addEventListener("click", () => {
  if (!estado.items.length) return mostrarMensaje("⚠️ Carrito vacío");
  mostrarMensaje("✅ Compra realizada (demo)");
  estado.items = [];
  mostrarCarrito();
  //cerrarCarrito();
});

// Inicial
mostrarCarrito();
