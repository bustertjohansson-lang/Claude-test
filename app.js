// Exempeldata – ersätts senare med riktiga annonser.
const vehicles = [
  { id: 1, typ: "bil", namn: "Volvo V70 D5", ar: 2008, mil: 21500, stad: "Göteborg", pris: 64900, sale: true, farg: "#2e6fb7", likes: 42, user: "Anna", text: "Nyservad och redo för sommaren. Dragkrok ingår!", hours: 3 },
  { id: 2, typ: "a-traktor", namn: "Volvo Amazon A-traktor", ar: 1969, mil: 4200, stad: "Borås", pris: 89000, sale: true, farg: "#c8372d", likes: 118, user: "Kalle", text: "Min egen bygge. 30 km/h och noll stress. Kom och provåk!", hours: 5 },
  { id: 3, typ: "bil", namn: "Saab 900 Turbo", ar: 1991, mil: 24300, stad: "Trollhättan", pris: 119000, sale: true, farg: "#d9a441", likes: 203, user: "Sofia", text: "Det är inte ofta man hittar en så ren 900:a. Förstahandsägare.", hours: 9 },
  { id: 4, typ: "a-traktor", namn: "Ford Escort A-traktor", ar: 1996, mil: 7800, stad: "Skövde", pris: 54000, sale: false, farg: "#3a9d7a", likes: 76, user: "Jonas", text: "Veckans bygge är klart! Inte till salu – bara stolt.", hours: 12 },
  { id: 5, typ: "bil", namn: "Tesla Model 3", ar: 2020, mil: 6200, stad: "Stockholm", pris: 259000, sale: true, farg: "#e8e8ee", likes: 61, user: "Maja", text: "Tar över leasing eller säljer. Fråga mig vad du vill.", hours: 20 },
  { id: 6, typ: "bil", namn: "Mazda MX-5", ar: 2004, mil: 17800, stad: "Malmö", pris: 74500, sale: false, farg: "#8b3fd0", likes: 154, user: "Elin", text: "Första kvällskörningen för säsongen. Tak nere, musik på.", hours: 26 },
  { id: 7, typ: "a-traktor", namn: "Volvo 240 A-traktor", ar: 1988, mil: 11400, stad: "Umeå", pris: 38000, sale: true, farg: "#5a6270", likes: 33, user: "Erik", text: "Klassiker som går att fixa själv. Bra första bygge!", hours: 31 },
  { id: 8, typ: "bil", namn: "Volkswagen Golf GTI", ar: 2012, mil: 14200, stad: "Uppsala", pris: 109000, sale: true, farg: "#b8232a", likes: 89, user: "Hugo", text: "Stage 1, nya däck och bromsar. Servicehistorik finns.", hours: 40 },
];

const kr = (n) => n.toLocaleString("sv-SE") + " kr";
const ago = (h) => (h < 24 ? `${h} h sedan` : `${Math.floor(h / 24)} d sedan`);
const typLabel = { "bil": "Bil", "a-traktor": "A-traktor" };

// Enkel fordonsillustration som SVG, så vi slipper externa bilder.
function vehicleSvg(v) {
  const body = v.farg;
  const wheels = v.typ === "a-traktor";
  const car = `
    <path d="M70 150 L100 105 Q110 95 130 95 H230 Q250 95 262 110 L290 150 Z" fill="${body}"/>
    <path d="M112 108 H168 V144 H92 Z M178 108 H236 L262 144 H178 Z" fill="#0b0d12" opacity=".55"/>
    <rect x="50" y="140" width="260" height="34" rx="12" fill="${body}"/>
    <circle cx="105" cy="176" r="24" fill="#10131a"/><circle cx="105" cy="176" r="11" fill="#9aa4b8"/>
    <circle cx="255" cy="176" r="24" fill="#10131a"/><circle cx="255" cy="176" r="11" fill="#9aa4b8"/>`;
  const tractor = `
    <rect x="185" y="70" width="86" height="76" rx="8" fill="${body}"/>
    <rect x="195" y="80" width="64" height="38" rx="4" fill="#0b0d12" opacity=".55"/>
    <rect x="70" y="112" width="130" height="50" rx="10" fill="${body}"/>
    <rect x="96" y="92" width="14" height="24" fill="#6b7385"/>
    <circle cx="228" cy="162" r="40" fill="#10131a"/><circle cx="228" cy="162" r="18" fill="#9aa4b8"/>
    <circle cx="108" cy="178" r="22" fill="#10131a"/><circle cx="108" cy="178" r="9" fill="#9aa4b8"/>`;
  return `<svg class="img" viewBox="0 0 360 225" role="img" aria-label="Illustration av ${v.namn}" xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="g${v.id}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#232b3f"/><stop offset="1" stop-color="#0f121a"/></linearGradient></defs>
    <rect width="360" height="225" fill="url(#g${v.id})"/>
    <rect y="196" width="360" height="29" fill="#0b0d12"/>
    ${wheels ? tractor : car}
  </svg>`;
}

const state = { view: "feed", type: "alla", sale: false, maxPrice: 300000, search: "", sort: "nyast", liked: new Set() };
const $ = (s) => document.querySelector(s);

function filtered() {
  const q = state.search.trim().toLowerCase();
  let list = vehicles.filter((v) =>
    (state.type === "alla" || v.typ === state.type) &&
    (!state.sale || v.sale) &&
    (state.maxPrice >= 300000 || v.pris <= state.maxPrice) &&
    (!q || `${v.namn} ${v.stad} ${v.user}`.toLowerCase().includes(q))
  );
  const sorts = {
    "nyast": (a, b) => a.hours - b.hours,
    "pris-lag": (a, b) => a.pris - b.pris,
    "pris-hog": (a, b) => b.pris - a.pris,
    "gillningar": (a, b) => b.likes - a.likes,
  };
  return list.sort(sorts[state.sort]);
}

const avatarColor = (name) => `hsl(${(name.charCodeAt(0) * 47) % 360} 70% 65%)`;

function postHtml(v) {
  const liked = state.liked.has(v.id);
  return `<article class="post" data-id="${v.id}">
    <div class="post-head">
      <div class="avatar" style="background:${avatarColor(v.user)}">${v.user[0]}</div>
      <div class="who"><strong>${v.user}</strong><span>${v.stad} · ${ago(v.hours)}</span></div>
    </div>
    <p class="post-text">${v.text}</p>
    <div class="media">${vehicleSvg(v)}
      <span class="pill ${v.sale ? "sale" : ""}">${v.sale ? "Till salu" : typLabel[v.typ]}</span>
      ${v.sale ? `<span class="price">${kr(v.pris)}</span>` : ""}
    </div>
    <div class="post-actions">
      <button class="act like ${liked ? "is-on" : ""}" type="button" aria-pressed="${liked}">${liked ? "♥" : "♡"} <span class="n">${v.likes + (liked ? 1 : 0)}</span></button>
      <button class="act share" type="button">Dela</button>
      ${v.sale ? `<button class="act contact" type="button">Kontakta säljare</button>` : ""}
    </div>
  </article>`;
}

function cardHtml(v) {
  return `<article class="card" data-id="${v.id}">
    <div class="media">${vehicleSvg(v)}<span class="pill sale">Till salu</span></div>
    <div class="card-body">
      <h3>${v.namn}</h3>
      <ul class="specs"><li>${typLabel[v.typ]}</li><li>${v.ar}</li><li>${v.mil.toLocaleString("sv-SE")} mil</li><li>${v.stad}</li></ul>
      <div class="card-foot"><strong>${kr(v.pris)}</strong><button class="act contact" type="button">Kontakta</button></div>
    </div>
  </article>`;
}

function render() {
  const list = filtered();
  const forSale = list.filter((v) => v.sale);
  $("#sale-count").textContent = vehicles.filter((v) => v.sale).length;
  $("#feed").innerHTML = list.map(postHtml).join("");
  $("#grid").innerHTML = forSale.map(cardHtml).join("");
  const shown = state.view === "feed" ? list.length : forSale.length;
  $("#result-info").textContent = `${shown} ${shown === 1 ? "fordon" : "fordon"} visas`;
  $("#empty").hidden = shown > 0;
  $("#view-feed").hidden = state.view !== "feed";
  $("#view-market").hidden = state.view !== "market";
  document.querySelectorAll(".tab").forEach((t) => t.classList.toggle("is-active", t.dataset.view === state.view));
  document.querySelectorAll("#f-type .chip").forEach((c) => c.classList.toggle("is-active", c.dataset.value === state.type));
}

let toastTimer;
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 2200);
}

document.addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (tab) { state.view = tab.dataset.view; render(); return; }
  const chip = e.target.closest("#f-type .chip");
  if (chip) { state.type = chip.dataset.value; render(); return; }
  const item = e.target.closest("[data-id]");
  if (!item) return;
  const id = Number(item.dataset.id);
  if (e.target.closest(".like")) {
    state.liked.has(id) ? state.liked.delete(id) : state.liked.add(id);
    render();
  } else if (e.target.closest(".share")) {
    toast("Länk kopierad (låtsas – det här är en prototyp)");
  } else if (e.target.closest(".contact")) {
    toast("Meddelandefunktionen kommer snart");
  }
});

$("#f-search").addEventListener("input", (e) => { state.search = e.target.value; render(); });
$("#f-sale").addEventListener("change", (e) => { state.sale = e.target.checked; render(); });
$("#f-sort").addEventListener("change", (e) => { state.sort = e.target.value; render(); });
$("#f-price").addEventListener("input", (e) => {
  state.maxPrice = Number(e.target.value);
  $("#f-price-out").textContent = state.maxPrice >= 300000 ? "Obegränsat" : kr(state.maxPrice);
  render();
});
$("#f-reset").addEventListener("click", () => {
  Object.assign(state, { type: "alla", sale: false, maxPrice: 300000, search: "", sort: "nyast" });
  $("#f-search").value = ""; $("#f-sale").checked = false; $("#f-sort").value = "nyast"; $("#f-price").value = 300000;
  $("#f-price-out").textContent = "Obegränsat";
  render();
});

// Filtren är öppna på dator och hopfällda på mobil.
$("#filters").open = window.matchMedia("(min-width: 860px)").matches;

render();
