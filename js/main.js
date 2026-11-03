/* Nosso Cantinho Comedoria · comportamento do site
   Edite o bloco CONFIG com os dados reais do restaurante. */

const CONFIG = {
  whatsapp: "5582900000000",            // DDI + DDD + número, só dígitos
  telefone: "+5582900000000",
  instagram: "nossocantinho.comedoria", // sem o @
  ifood: "",                            // link da loja no iFood (deixe vazio para esconder o botão)
  endereco: "Rua do Exemplo, 123 · Bairro · Maceió, AL",
  mapaBusca: "Maceió, AL",              // o que o Google Maps deve procurar
  // Horários: dias 0 = domingo ... 6 = sábado
  horarios: [
    { nome: "almoço", dias: [0, 1, 2, 3, 4, 5, 6], abre: 11, fecha: 16 },
    { nome: "jantar", dias: [4, 5, 6], abre: 18, fecha: 23 }
  ],
  fuso: "America/Maceio"
};

/* Cardápio (preços de exemplo) */
const CARDAPIO = [
  { id: "caseiros", nome: "Pratos caseiros", itens: [
    ["Galinha caipira ao molho", "Com feijão de corda, farofa de manteiga e salada", "R$ 32"],
    ["Carne de sol na nata", "Com macaxeira cozida, arroz e vinagrete", "R$ 42"],
    ["Escondidinho de charque", "Purê de macaxeira gratinado com queijo coalho", "R$ 34"],
    ["Feijoada nordestina", "Aos sábados, com couve, farofa e laranja", "R$ 38"],
    ["Prato do dia", "O que saiu da panela hoje. Pergunte no WhatsApp", "R$ 25"]
  ]},
  { id: "mar", nome: "Frutos do mar", itens: [
    ["Moqueca de peixe", "Peixe do dia no leite de coco e dendê, com pirão e arroz. Serve 2", "R$ 89"],
    ["Moqueca de camarão", "Camarão no leite de coco, pimentões e coentro. Serve 2", "R$ 109"],
    ["Sururu ao coco", "Clássico alagoano, com arroz e farofa", "R$ 39"],
    ["Peixe frito inteiro", "Com arroz, pirão e salada", "R$ 58"],
    ["Camarão ao alho e óleo", "Com arroz branco e batata frita", "R$ 64"]
  ]},
  { id: "porcoes", nome: "Porções", itens: [
    ["Agulhinha frita", "Com limão e molho da casa", "R$ 32"],
    ["Camarão empanado", "Com molho tártaro", "R$ 48"],
    ["Macaxeira frita", "Crocante por fora, macia por dentro", "R$ 22"],
    ["Queijo coalho na brasa", "Com melaço de cana", "R$ 28"],
    ["Caldinho de sururu", "Servido na cumbuca", "R$ 12"]
  ]},
  { id: "caipiroscas", nome: "Caipiroscas", itens: [
    ["Limão", "Vodka, limão e gelo", "R$ 18"],
    ["Caju", "Fruta fresca da estação", "R$ 20"],
    ["Maracujá", "Doce na medida", "R$ 20"],
    ["Mangaba", "Fruta típica de Alagoas", "R$ 22"],
    ["Morango", "Com açúcar na borda, se quiser", "R$ 22"],
    ["Caipirinha de cachaça", "Limão e cachaça de alambique", "R$ 16"]
  ]},
  { id: "bebidas", nome: "Bebidas", itens: [
    ["Suco da fruta", "Caju, acerola, maracujá ou mangaba", "R$ 9"],
    ["Refrigerante lata", "", "R$ 7"],
    ["Cerveja 600 ml", "", "R$ 14"],
    ["Água mineral", "", "R$ 4"]
  ]},
  { id: "sobremesas", nome: "Sobremesas", itens: [
    ["Cartola", "Banana, queijo coalho, açúcar e canela", "R$ 18"],
    ["Pudim de leite", "Da receita da casa", "R$ 10"],
    ["Cocada de forno", "Quentinha", "R$ 9"]
  ]}
];

const PASTA_FOTOS = "assets/img/fotos/";
const slug = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/* Carrega a foto só se o arquivo existir; senão mantém o espaço reservado */
function tentarFoto(el, arquivo) {
  const img = new Image();
  img.onload = () => { el.style.backgroundImage = `url("${img.src}")`; el.classList.add("tem-foto"); };
  img.src = PASTA_FOTOS + arquivo;
}

/* Links de contato */
function aplicarContatos() {
  document.querySelectorAll(".js-whats").forEach(a => {
    const msg = encodeURIComponent(a.dataset.msg || "Oi! Vim pelo site.");
    a.href = `https://wa.me/${CONFIG.whatsapp}?text=${msg}`;
    a.target = "_blank"; a.rel = "noopener";
  });
  document.querySelectorAll(".js-ig").forEach(a => a.href = `https://instagram.com/${CONFIG.instagram}`);
  document.querySelectorAll(".js-ig-handle").forEach(el => el.textContent = "@" + CONFIG.instagram);
  document.querySelectorAll(".js-tel").forEach(a => a.href = `tel:${CONFIG.telefone}`);
  document.querySelectorAll(".js-endereco").forEach(el => el.textContent = CONFIG.endereco);
  document.querySelectorAll(".js-mapa").forEach(a => a.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.mapaBusca)}`);
  document.querySelectorAll(".js-mapa-embed").forEach(f => f.src = `https://www.google.com/maps?q=${encodeURIComponent(CONFIG.mapaBusca)}&output=embed`);
  document.querySelectorAll(".js-ifood").forEach(a => { if (CONFIG.ifood) a.href = CONFIG.ifood; else a.remove(); });
  const n = CONFIG.whatsapp.replace(/^55/, "");
  const tel = n.length === 11 ? `(${n.slice(0, 2)}) ${n[2]} ${n.slice(3, 7)}-${n.slice(7)}` : n;
  document.querySelectorAll(".js-contato").forEach(el => el.textContent = `WhatsApp ${tel} · @${CONFIG.instagram}`);
}

/* Selo de aberto/fechado pelo horário de Maceió */
function atualizarStatus() {
  const el = document.getElementById("status"), txt = document.getElementById("statusTxt");
  if (!el) return;
  const agora = new Date(new Date().toLocaleString("en-US", { timeZone: CONFIG.fuso }));
  const dia = agora.getDay(), h = agora.getHours() + agora.getMinutes() / 60;
  const aberto = CONFIG.horarios.find(t => t.dias.includes(dia) && h >= t.abre && h < t.fecha);
  if (aberto) {
    el.classList.remove("fechado");
    txt.textContent = `Aberto agora · ${aberto.nome} até ${aberto.fecha}h`;
    return;
  }
  el.classList.add("fechado");
  const hoje = CONFIG.horarios.filter(t => t.dias.includes(dia) && t.abre > h).sort((a, b) => a.abre - b.abre)[0];
  if (hoje) { txt.textContent = `Fechado agora · abre hoje às ${hoje.abre}h`; return; }
  const amanha = (dia + 1) % 7;
  const prox = CONFIG.horarios.filter(t => t.dias.includes(amanha)).sort((a, b) => a.abre - b.abre)[0];
  txt.textContent = prox ? `Fechado agora · abre amanhã às ${prox.abre}h` : "Fechado agora";
}

/* Cardápio com abas */
function montarCardapio() {
  const abas = document.getElementById("abas"), lista = document.getElementById("pratos");
  if (!abas || !lista) return;
  const mostrar = id => {
    const cat = CARDAPIO.find(c => c.id === id) || CARDAPIO[0];
    abas.querySelectorAll(".aba").forEach(b => b.setAttribute("aria-selected", b.dataset.id === cat.id));
    lista.innerHTML = cat.itens.map(([nome, desc, preco]) => `
      <article class="prato">
        <div class="prato__foto" data-foto="prato-${slug(nome)}.jpg"><span class="vapor-ico" aria-hidden="true"></span></div>
        <div class="prato__info">
          <h3 class="am prato__nome">${nome}</h3>
          ${desc ? `<p class="prato__desc">${desc}</p>` : ""}
        </div>
        <span class="am prato__preco">${preco}</span>
      </article>`).join("");
    lista.querySelectorAll(".prato__foto").forEach(f => tentarFoto(f, f.dataset.foto));
  };
  abas.innerHTML = CARDAPIO.map(c => `<button class="aba" role="tab" data-id="${c.id}" aria-selected="false">${c.nome}</button>`).join("");
  abas.addEventListener("click", e => { const b = e.target.closest(".aba"); if (b) mostrar(b.dataset.id); });
  document.querySelectorAll("[data-aba]").forEach(a => a.addEventListener("click", () => mostrar(a.dataset.aba)));
  mostrar(CARDAPIO[0].id);
}

/* Menu do celular */
function menuCelular() {
  const btn = document.getElementById("menuBtn"), menu = document.getElementById("menu");
  if (!btn || !menu) return;
  const fechar = () => { menu.classList.remove("aberto"); btn.setAttribute("aria-expanded", "false"); };
  btn.addEventListener("click", () => {
    const abre = !menu.classList.contains("aberto");
    menu.classList.toggle("aberto", abre); btn.setAttribute("aria-expanded", String(abre));
  });
  menu.querySelectorAll("a").forEach(a => a.addEventListener("click", fechar));
}

/* Botão fixo do celular: some enquanto outro botão de pedido ou o rodapé está na tela */
function botaoFixo() {
  const fixo = document.querySelector(".whats-fixo");
  if (!fixo || !("IntersectionObserver" in window)) return;
  const alvos = [".hero .acoes", "#delivery .acoes", "#onde-fica .acoes", ".rodape"].map(s => document.querySelector(s)).filter(Boolean);
  const vis = new Set();
  const io = new IntersectionObserver(es => {
    es.forEach(e => e.isIntersecting ? vis.add(e.target) : vis.delete(e.target));
    fixo.classList.toggle("some", vis.size > 0);
  });
  alvos.forEach(a => io.observe(a));
}

document.addEventListener("DOMContentLoaded", () => {
  botaoFixo();
  aplicarContatos();
  atualizarStatus();
  setInterval(atualizarStatus, 60000);
  montarCardapio();
  menuCelular();
  document.querySelectorAll(".foto[data-foto]").forEach(f => tentarFoto(f, f.dataset.foto));
  const ano = document.getElementById("ano"); if (ano) ano.textContent = new Date().getFullYear();
});
