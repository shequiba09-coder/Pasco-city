/* ===================================================
   PascoCity | TechStore & Service
   ★ EDITA SOLO ESTA SECCIÓN (CONFIG y PRODUCTOS) ★
   =================================================== */

const CONFIG = {
  // Números de WhatsApp: formato internacional sin "+" ni espacios (51 = Perú)
  whatsapps: [
    { numero: "51969970772", etiqueta: "WhatsApp 969970772" },
    { numero: "51910919138", etiqueta: "WhatsApp 9101919138" }
  ],

  // Ubicación
  direccion: "Cerro de Pasco, Perú",         // texto que se muestra
  mapaBusqueda: "Cerro de Pasco, Perú",      // lo que busca Google Maps (puedes poner la dirección exacta de tu tienda)
  horario: "Atención de Lunes a Sábado 9am a 7pm · Domingo 10am a 3pm",

  // Video: pega un enlace de YouTube (ej. "https://www.youtube.com/watch?v=XXXX")
  // o la ruta de un video tuyo (ej. "video/tienda.mp4"). Déjalo vacío "" para elegir uno desde la página.
  video: "https://www.youtube.com/embed/h0cf2z3lrz4",

  // Horas disponibles para las citas
  horasCita: ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
};

/* Productos: cambia nombre, precio e imagen.
   Guarda tus fotos en la carpeta "img/" y escribe la ruta en "img".
   Si la imagen no existe, se muestra un espacio para que la agregues
   (también puedes hacer clic en la imagen y elegir una foto de tu equipo). */
const PRODUCTOS = {
  celulares: [
    { nombre: "Galaxi S25 ULTRA", marca: "SAMSUMG", precio: 899,  img: "img/celular1.jpeg" },
    { nombre: "Apple 17", marca: "APPLE", precio: 1299, img: "img/celular2.jpeg" },
    { nombre: "POCO F8 ULTRA", marca: "POCO", precio: 1599, img: "img/celular3.jpeg" },
    { nombre: "HONOR Magic8 lite 8GB+512GB", marca: "HONOR", precio: 2199, img: "img/celular4.jpeg" },
    { nombre: "REDMI Note 15 pro", marca: "REDMI", precio: 3499, img: "img/celular5.jpeg" }
  ],
  computadoras: [
    { nombre: "Computadora Intel Core i5", marca: "PC de escritorio", precio: 1899, img: "img/pc1.jpeg" },
    { nombre: "Computadora Intel Core i7", marca: "PC de escritorio", precio: 2499, img: "img/pc2.jpeg" },
    { nombre: "PC Gamer Ryzen 5",          marca: "PC gamer",         precio: 2799, img: "img/pc3.jpeg" },
    { nombre: "PC Ingeniería y Diseño",    marca: "PC de diseño",     precio: 4699, img: "img/pc4.jpeg" },
    { nombre: "Todo en Uno 27\"",          marca: "Todo en uno",      precio: 3499, img: "img/pc5.jpeg" }
  ],
  laptops: [
    { nombre: "Laptop para oficina 15.6\"", marca: "Laptops",       precio: 2399, img: "img/laptop1.jpeg" },
    { nombre: "Laptop para estudios",       marca: "Laptops",       precio: 3399, img: "img/laptop2.jpeg" },
    { nombre: "Laptop Gamer Core i7",       marca: "Laptops gamer", precio: 6199, img: "img/laptop3.jpeg" },
    { nombre: "Laptop Gamer Ryzen 9",       marca: "Laptops gamer", precio: 9999, img: "img/laptop4.jpeg" },
    { nombre: "Laptop de diseño",           marca: "Laptops",       precio: 5499, img: "img/laptop5.jpeg" }
  ],
  audifonos: [
    { nombre: "Auricular Gamer RGB",   marca: "Audífonos", precio: 149, img: "img/audifono1.jpeg" },
    { nombre: "Auricular con micrófono", marca: "Audífonos", precio: 89, img: "img/audifono2.jpeg" },
    { nombre: "Auricular Gamer Dragon", marca: "Audífonos", precio: 59,  img: "img/audifono3.jpeg" },
    { nombre: "Auricular inalámbrico",  marca: "Audífonos", precio: 99,  img: "img/audifono4.jpeg" },
    { nombre: "Auricular Bluetooth",    marca: "Audífonos", precio: 119, img: "img/audifono5.jpeg" }
  ]
};

/* ===================================================
   A PARTIR DE AQUÍ ES LA LÓGICA DE LA PÁGINA
   =================================================== */

const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const soles = n => "S/ " + Number(n).toLocaleString("es-PE");
const waLink = (numero, texto = "") => `https://wa.me/${numero}${texto ? "?text=" + encodeURIComponent(texto) : ""}`;
const mainWa = () => CONFIG.whatsapps[0]?.numero || "";

/* Imagen de reemplazo cuando aún no tienes la foto */
function placeholder(texto = "Tu imagen aquí") {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="#eaf2ff"/>
    <rect x="130" y="110" width="140" height="110" rx="14" fill="none" stroke="#0b4dff" stroke-width="8"/>
    <circle cx="170" cy="150" r="12" fill="#0b4dff"/>
    <path d="M140 210l40-40 30 30 20-20 40 40" fill="none" stroke="#0b4dff" stroke-width="8" stroke-linejoin="round"/>
    <text x="200" y="275" font-family="Arial" font-weight="800" font-size="24" text-anchor="middle" fill="#0b4dff">${texto}</text>
    <text x="200" y="305" font-family="Arial" font-weight="700" font-size="16" text-anchor="middle" fill="#5a668c">Clic para agregar foto</text>
  </svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

/* Prepara una imagen: si falla usa el espacio vacío y permite elegir una foto con clic */
function prepararImagen(slot, texto) {
  const img = $("img", slot);
  const input = $("input[type=file]", slot);
  img.addEventListener("error", () => {
    if (img.dataset.fallback) return;
    img.dataset.fallback = "1";
    img.src = placeholder(texto);
  });
  input.addEventListener("change", () => {
    const file = input.files[0];
    if (file) img.src = URL.createObjectURL(file);
  });
  // si la imagen ya falló antes de enlazar el evento
  if (img.complete && img.naturalWidth === 0) img.dispatchEvent(new Event("error"));
}

/* ---------- Carrito (contador) ---------- */
let carrito = 0;
function agregarAlCarrito() {
  carrito++;
  const count = $("#cartCount");
  count.textContent = carrito;
  const btn = $("#cartBtn");
  btn.classList.remove("bump");
  void btn.offsetWidth;
  btn.classList.add("bump");
}

/* ---------- Tarjeta de producto ---------- */
function crearTarjeta(p) {
  const el = document.createElement("article");
  el.className = "card";
  el.innerHTML = `
    <label class="img-slot" title="Haz clic para cambiar la imagen">
      <img src="${p.img}" alt="${p.nombre}" loading="lazy">
      <span class="img-slot__badge">📷 Cambiar</span>
      <input type="file" accept="image/*" hidden>
    </label>
    <div class="card__body">
      <span class="card__tag">${p.marca}</span>
      <h3 class="card__name">${p.nombre}</h3>
      <div class="card__price">${soles(p.precio)}</div>
      <div class="card__btns">
        <button type="button" class="card__add">Agregar</button>
        <a class="card__ask" target="_blank" rel="noopener" href="${waLink(mainWa(), `Hola PascoCity, quiero información de: ${p.nombre} (${soles(p.precio)})`)}">Consultar</a>
      </div>
    </div>`;
  prepararImagen($(".img-slot", el), p.marca);
  $(".card__add", el).addEventListener("click", agregarAlCarrito);
  return el;
}

/* ---------- Carrusel automático ---------- */
const carruseles = [];

function productosPorPantalla() {
  const w = window.innerWidth;
  if (w > 1000) return 4;
  if (w > 760) return 3;
  if (w > 520) return 2;
  return 1;
}

function crearCarrusel(root, items) {
  root.innerHTML = `
    <button class="car-btn car-btn--prev" type="button" aria-label="Anterior">‹</button>
    <div class="car-viewport"><div class="car-track"></div></div>
    <button class="car-btn car-btn--next" type="button" aria-label="Siguiente">›</button>
    <div class="car-dots"></div>`;

  const track = $(".car-track", root);
  const dots = $(".car-dots", root);

  if (!items.length) {
    root.innerHTML = `<p class="car-empty">No encontramos productos con esa búsqueda.</p>`;
    return;
  }

  items.forEach(p => {
    const item = document.createElement("div");
    item.className = "car-item";
    item.appendChild(crearTarjeta(p));
    track.appendChild(item);
  });

  let pv = productosPorPantalla();
  let index = 0;
  let timer = null;
  const paginas = () => Math.max(1, items.length - pv + 1);

  function pintarPuntos() {
    dots.innerHTML = "";
    for (let i = 0; i < paginas(); i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Ir a la posición " + (i + 1));
      b.addEventListener("click", () => { ir(i); reiniciar(); });
      dots.appendChild(b);
    }
  }

  function ir(i) {
    const total = paginas();
    index = (i + total) % total;
    track.style.transform = `translateX(-${index * (100 / pv)}%)`;
    $$("button", dots).forEach((d, n) => d.classList.toggle("active", n === index));
  }

  function iniciar() {
    detener();
    if (paginas() > 1 && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      timer = setInterval(() => ir(index + 1), 3500);
    }
  }
  function detener() { clearInterval(timer); }
  function reiniciar() { iniciar(); }

  function ajustar() {
    pv = productosPorPantalla();
    root.style.setProperty("--pv", pv);
    pintarPuntos();
    ir(Math.min(index, paginas() - 1));
    iniciar();
  }

  $(".car-btn--prev", root).addEventListener("click", () => { ir(index - 1); reiniciar(); });
  $(".car-btn--next", root).addEventListener("click", () => { ir(index + 1); reiniciar(); });
  root.addEventListener("mouseenter", detener);
  root.addEventListener("mouseleave", iniciar);

  // deslizar con el dedo en el celular
  let startX = null;
  root.addEventListener("touchstart", e => { startX = e.touches[0].clientX; detener(); }, { passive: true });
  root.addEventListener("touchend", e => {
    if (startX !== null) {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 40) ir(index + (dx < 0 ? 1 : -1));
      startX = null;
    }
    iniciar();
  });

  carruseles.push(ajustar);
  ajustar();
}

function pintarCarruseles(filtro = "", categoria = "todas") {
  carruseles.length = 0;
  Object.keys(PRODUCTOS).forEach(cat => {
    const root = $("#car-" + cat);
    const seccion = root.closest("section");
    const okCategoria = categoria === "todas" || categoria === cat;
    const lista = PRODUCTOS[cat].filter(p =>
      okCategoria && (p.nombre + " " + p.marca).toLowerCase().includes(filtro.toLowerCase())
    );
    // al buscar, ocultamos secciones sin resultados
    seccion.hidden = (filtro || categoria !== "todas") && lista.length === 0;
    if (!seccion.hidden) crearCarrusel(root, lista);
  });
}

/* ---------- Búsqueda ---------- */
$("#searchForm").addEventListener("submit", e => {
  e.preventDefault();
  const q = $("#searchInput").value.trim();
  const cat = $("#searchCat").value;
  pintarCarruseles(q, cat);
  const primera = $$(".carousel").map(c => c.closest("section")).find(s => !s.hidden);
  if (primera) primera.scrollIntoView({ behavior: "smooth" });
});
$("#searchInput").addEventListener("input", e => {
  if (!e.target.value) pintarCarruseles("", $("#searchCat").value);
});

let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => carruseles.forEach(fn => fn()), 150);
});

/* ---------- Imagen principal del inicio ---------- */
const heroSlot = $(".hero .img-slot");
prepararImagen(heroSlot, "Imagen principal");
$("#heroInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) $("#heroImg").src = URL.createObjectURL(file);
});

/* ---------- Palabra animada del hero ---------- */
(function escribir() {
  const palabras = ["Celulares", "Laptops", "Computadoras", "Audífonos", "Servicio técnico"];
  const el = $("#typed");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let p = 0, c = 0, borrando = false;
  function paso() {
    const palabra = palabras[p];
    c += borrando ? -1 : 1;
    el.textContent = palabra.slice(0, c);
    let espera = borrando ? 45 : 90;
    if (!borrando && c === palabra.length) { borrando = true; espera = 1400; }
    else if (borrando && c === 0) { borrando = false; p = (p + 1) % palabras.length; espera = 350; }
    setTimeout(paso, espera);
  }
  paso();
})();

/* ---------- Datos de contacto, WhatsApp y mapa ---------- */
function pintarContacto() {
  $("#topDireccion").textContent = "📍 " + CONFIG.direccion;
  $("#topHorario").textContent = "🕘 " + CONFIG.horario.split("·")[0].replace("Atención de ", "").trim();
  const wa = waLink(mainWa(), "Hola PascoCity, quiero más información.");
  $("#topWhatsapp").href = wa;
  $("#topWhatsapp").textContent = "💬 " + (CONFIG.whatsapps[0]?.etiqueta || "WhatsApp");
  $("#fabWa").href = wa;

  $("#contactoDireccion").textContent = CONFIG.direccion;
  $("#contactoHorario").textContent = CONFIG.horario;
  $("#waList").innerHTML = CONFIG.whatsapps.map(w =>
    `<a class="wa-btn" target="_blank" rel="noopener" href="${waLink(w.numero, "Hola PascoCity, quiero más información.")}">📞 ${w.etiqueta}</a>`
  ).join("");

  $("#mapFrame").src = "https://www.google.com/maps?q=" + encodeURIComponent(CONFIG.mapaBusqueda) + "&output=embed";
}

/* ---------- Video ---------- */
function aEmbedYoutube(url) {
  const m = url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/);
  return m ? "https://www.youtube.com/embed/" + m[1] : ""
}

function pintarVideo() {
  const box = $("#videoBox");
  const url = CONFIG.video.trim();
  if (url) {
    const yt = aEmbedYoutube(url);
    box.innerHTML = yt
      ? `<iframe src="${yt}" title="Video de PascoCity" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>`
      : `<video src="${url}" controls playsinline></video>`;
    return;
  }
  box.innerHTML = `
    <label class="video__empty">
      <span>🎬</span>
      <strong>Agrega tu video aquí</strong>
      <small>Haz clic para elegir un video, o pon el enlace en CONFIG.video dentro de script.js</small>
      <input type="file" accept="video/*" hidden>
    </label>`;
  $("input", box).addEventListener("change", e => {
    const file = e.target.files[0];
    if (file) box.innerHTML = `<video src="${URL.createObjectURL(file)}" controls autoplay muted playsinline></video>`;
  });
}

/* ---------- Formulario de citas ---------- */
(function formularioCitas() {
  const form = $("#citaForm");
  const msg = $("#formMsg");
  const fecha = $("#fecha");
  const hora = $("#hora");

  // fecha mínima: hoy
  const hoy = new Date();
  fecha.min = new Date(hoy.getTime() - hoy.getTimezoneOffset() * 60000).toISOString().slice(0, 10);

  hora.innerHTML = `<option value="">Selecciona</option>` + CONFIG.horasCita.map(h => `<option>${h}</option>`).join("");

  // solo números en DNI
  form.dni.addEventListener("input", () => { form.dni.value = form.dni.value.replace(/\D/g, "").slice(0, 8); });

  function marcar(campo, ok) { campo.classList.toggle("invalid", !ok); return ok; }

  form.addEventListener("submit", e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(form));
    const telefono = d.telefono.replace(/\D/g, "");

    const validos = [
      marcar(form.nombre, d.nombre.trim().length >= 3),
      marcar(form.dni, /^\d{8}$/.test(d.dni)),
      marcar(form.telefono, telefono.length >= 9),
      marcar(form.equipo, !!d.equipo),
      marcar(form.modelo, d.modelo.trim().length >= 2),
      marcar(form.servicio, !!d.servicio),
      marcar(form.fecha, !!d.fecha && d.fecha >= fecha.min),
      marcar(form.hora, !!d.hora)
    ];

    if (validos.includes(false)) {
      msg.className = "form__msg error";
      msg.textContent = "Revisa los campos marcados en rojo.";
      return;
    }

    // guardar la cita en este navegador
    try {
      const citas = JSON.parse(localStorage.getItem("pascocity_citas") || "[]");
      citas.push({ ...d, registrada: new Date().toISOString() });
      localStorage.setItem("pascocity_citas", JSON.stringify(citas));
    } catch (err) { /* si el navegador no permite guardar, seguimos igual */ }

   const texto = `Hola PascoCity, quiero agendar una cita de mantenimiento:
• Nombre: ${d.nombre}
• DNI: ${d.dni}
• Teléfono: ${d.telefono}
• Correo: ${d.correo || "-"}
• Equipo: ${d.equipo} - ${d.modelo}
• Servicio: ${d.servicio}
• Fecha: ${d.fecha} a las ${d.hora}
• Detalle: ${d.detalle || "-"}`;

    const mensajeCodificado = encodeURIComponent(texto);
    window.open(`https://wa.me/51910919138?text=${mensajeCodificado}`, '_blank');

    msg.className = "form_msg ok";
    msg.innerHTML = `✅ Cita registrada para el ${d.fecha} a las ${d.hora}!`;
    form.reset();
  });

  form.addEventListener("input", e => e.target.classList.remove("invalid"));
})();

/* ---------- Menú móvil, scroll y animaciones ---------- */
$("#burger").addEventListener("click", () => $("#nav").classList.toggle("open"));
$$("#nav a").forEach(a => a.addEventListener("click", () => $("#nav").classList.remove("open")));

const header = $("#header");
const toTop = $("#toTop");
window.addEventListener("scroll", () => {
  header.classList.toggle("is-scrolled", scrollY > 20);
  toTop.classList.toggle("show", scrollY > 600);
}, { passive: true });
toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));

// resalta en el menú la sección visible
const enlaces = $$("#nav a");
const secciones = enlaces.map(a => $(a.getAttribute("href"))).filter(Boolean);
const espia = new IntersectionObserver(entradas => {
  entradas.forEach(en => {
    if (en.isIntersecting) {
      enlaces.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
    }
  });
}, { rootMargin: "-40% 0px -55% 0px" });
secciones.forEach(s => espia.observe(s));

// aparición suave de las secciones
$$(".section__head, .cats, .carousel, .service > *, .video, .contact > *").forEach(el => el.classList.add("reveal"));
const revelador = new IntersectionObserver(entradas => {
  entradas.forEach(en => { if (en.isIntersecting) { en.target.classList.add("visible"); revelador.unobserve(en.target); } });
}, { threshold: 0.12 });
$$(".reveal").forEach(el => revelador.observe(el));

/* ---------- Inicio ---------- */
$("#year").textContent = new Date().getFullYear();
pintarContacto();
pintarVideo();
pintarCarruseles();