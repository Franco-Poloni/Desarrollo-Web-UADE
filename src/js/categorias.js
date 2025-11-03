// Estado del carrito
const estado = { items: [] };

// Atajos
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const formatoPrecio = (n) => n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

// Elementos
const productos = $("#productos");
const contadorCarrito = $("#contadorCarrito");
const panelCarrito = $("#panelCarrito");
const fondo = $("#fondo");
const itemsCarrito = $("#itemsCarrito");
const totalCarrito = $("#totalCarrito");
const mensaje = $("#mensaje");

// Agregar al carrito
productos.addEventListener("click", (e) => {
  const boton = e.target.closest(".boton-agregar");
  if (!boton) return;

  const tarjeta = e.target.closest(".tarjeta-producto");
  const id = tarjeta.dataset.id;
  const nombre = tarjeta.dataset.nombre;
  const precio = Number(tarjeta.dataset.precio);

  const existente = estado.items.find(i => i.id === id);
  if (existente) existente.cantidad += 1;
  else estado.items.push({ id, nombre, precio, cantidad: 1 });

  mostrarCarrito();
  mostrarMensaje(`🛒 Agregado: <b>${nombre}</b>`);
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
    <div class="fila-carrito" data-id="${item.id}">
      <div class="info">
        <strong>${item.nombre}</strong>
        <span>${formatoPrecio(item.precio)} x ${item.cantidad}</span>
      </div>
      <div class="acciones">
        <button class="boton-cantidad" data-accion="menos">−</button>
        <span>${item.cantidad}</span>
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

// Abrir / cerrar carrito
$("#abrirCarrito").addEventListener("click", () => {
  panelCarrito.setAttribute("aria-hidden", "false");
  fondo.classList.add("mostrar");
});
$("#cerrarCarrito").addEventListener("click", cerrarCarrito);
fondo.addEventListener("click", cerrarCarrito);
function cerrarCarrito() {
  panelCarrito.setAttribute("aria-hidden", "true");
  fondo.classList.remove("mostrar");
}

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
const listaCategorias = $("#listaCategorias");
listaCategorias.addEventListener("click", (e) => {
  const boton = e.target.closest(".boton-categoria");
  if (!boton) return;
  $$(".boton-categoria", listaCategorias).forEach(b => b.classList.remove("activo"));
  boton.classList.add("activo");
  const cat = boton.dataset.categoria;

  $$(".tarjeta-producto", productos).forEach(card => {
    const visible = cat === "todas" || card.dataset.categoria === cat;
    card.style.display = visible ? "" : "none";
  });
});

// Filtros
const buscarTexto = $("#buscarTexto");
const precioMax = $("#precioMax");
const limpiarFiltros = $("#limpiarFiltros");

function aplicarFiltros() {
  const texto = (buscarTexto.value || "").toLowerCase();
  const max = Number(precioMax.value) || Infinity;
  const activa = $(".boton-categoria.activo", listaCategorias)?.dataset.categoria || "todas";

  $$(".tarjeta-producto", productos).forEach(card => {
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
  $("#listaCategorias .boton-categoria[data-categoria='todas']").click();
  aplicarFiltros();
});

// Finalizar compra
$("#botonComprar").addEventListener("click", () => {
  if (!estado.items.length) return mostrarMensaje("⚠️ Carrito vacío");
  mostrarMensaje("✅ Compra realizada (demo)");
  estado.items = [];
  mostrarCarrito();
  cerrarCarrito();
});

// Inicial
mostrarCarrito();
