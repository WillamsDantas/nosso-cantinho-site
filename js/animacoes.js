/* Nosso Cantinho Comedoria · animações
   Respeita "reduzir movimento": se a pessoa pediu, nada se mexe. */
(() => {
  const html = document.documentElement;

  /* Ao abrir ou atualizar, o site sempre recomeça do topo */
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  if (location.hash) history.replaceState(null, "", location.pathname + location.search);
  const topo = () => window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  topo();
  addEventListener("load", topo);
  addEventListener("pageshow", e => { if (e.persisted) topo(); });

  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  html.classList.add("anim");

  const NS = "http://www.w3.org/2000/svg";

  /* Quais elementos entram ao rolar (os da mesma fila entram um depois do outro) */
  const GRUPOS = [
    ".hero__txt > *", ".hero__foto .foto--hero",
    ".titulo", ".sec__topo > .btn", ".sec__topo > .vapor-ico",
    ".pilar", ".combo > .foto", ".combo__txt > *:not(.titulo)",
    ".abas", ".nota", ".passos li", "#delivery .acoes",
    ".historia__foto", ".historia > div > *:not(.titulo)",
    ".depo", ".ig img", ".onde > div > *:not(.titulo)", ".mapa", ".rodape__in > *"
  ];

  function marcar() {
    const vistos = new Set();
    GRUPOS.forEach(sel => document.querySelectorAll(sel).forEach(el => {
      if (vistos.has(el)) return;
      vistos.add(el);
      el.classList.add("rv");
    }));
    // atraso em cascata entre irmãos
    const porPai = new Map();
    vistos.forEach(el => {
      const p = el.parentElement;
      porPai.set(p, (porPai.get(p) || 0) + 1);
      const i = porPai.get(p) - 1;
      el.style.setProperty("--d", Math.min(i * 0.09, 0.6).toFixed(2) + "s");
    });
    const card = document.querySelector(".cartao-combo");
    if (card) { card.classList.add("rv", "rv--esq"); card.style.setProperty("--d", ".45s"); }
  }

  /* Traço à mão embaixo dos títulos */
  function riscos() {
    document.querySelectorAll(".titulo, .hero__titulo").forEach((t, k) => {
      const svg = document.createElementNS(NS, "svg");
      svg.setAttribute("class", "risco");
      svg.setAttribute("viewBox", "0 0 400 20");
      svg.setAttribute("preserveAspectRatio", "none");
      svg.setAttribute("aria-hidden", "true");
      const p = document.createElementNS(NS, "path");
      const v = k % 2 ? "M3 13 C 80 5, 150 17, 240 9 S 360 7, 397 11" : "M3 11 C 70 16, 160 4, 250 10 S 365 14, 397 8";
      p.setAttribute("d", v);
      p.setAttribute("pathLength", "1");
      svg.appendChild(p);
      t.appendChild(svg);
    });
    document.querySelector(".hero__titulo")?.classList.add("rv");
  }

  /* Preço contando até o valor */
  function contar(el) {
    const m = el.textContent.match(/(\D*)(\d+)/);
    if (!m || el.dataset.contou) return;
    el.dataset.contou = "1";
    const prefixo = m[1], alvo = +m[2], ini = Math.round(alvo * 0.45), dur = 1100, t0 = performance.now();
    const passo = agora => {
      const x = Math.min((agora - t0) / dur, 1), e = 1 - Math.pow(1 - x, 3);
      el.textContent = prefixo + Math.round(ini + (alvo - ini) * e);
      if (x < 1) requestAnimationFrame(passo);
    };
    requestAnimationFrame(passo);
  }

  function observar() {
    const io = new IntersectionObserver(entradas => entradas.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("visivel");
      io.unobserve(e.target);
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    document.querySelectorAll(".rv").forEach(el => io.observe(el));

    const ioPreco = new IntersectionObserver(entradas => entradas.forEach(e => {
      if (!e.isIntersecting) return;
      setTimeout(() => contar(e.target), e.target.closest(".cartao-combo") ? 700 : 250);
      ioPreco.unobserve(e.target);
    }), { threshold: 0.6 });
    document.querySelectorAll(".cartao-combo strong, .preco span").forEach(el => ioPreco.observe(el));
  }

  /* Cardápio: a cada troca de aba os pratos entram deslizando */
  function cardapio() {
    const lista = document.getElementById("pratos");
    if (!lista) return;
    const animar = () => lista.querySelectorAll(".prato:not(.entra)").forEach((p, i) => { p.style.setProperty("--i", i); p.classList.add("entra"); });
    new MutationObserver(animar).observe(lista, { childList: true });
    animar();
  }

  /* Abertura: a logo se desenha e a cortina sobe. Toda vez que o site abre ou é atualizado. */
  function abertura(fim) {
    const D = window.LOGO_TRACO;
    if (!D) return fim();

    const cx = getComputedStyle(html);
    const MAC = cx.getPropertyValue("--macaxeira").trim() || "#F6EAD3";
    const CUS = cx.getPropertyValue("--cuscuz").trim() || "#E8B93C";
    const tela = document.createElement("div");
    tela.className = "abertura";
    tela.setAttribute("aria-hidden", "true");
    const svg = document.createElementNS(NS, "svg");
    svg.setAttribute("viewBox", "0 0 930 842");
    const defs = document.createElementNS(NS, "defs"), g = document.createElementNS(NS, "g");
    svg.append(defs, g); tela.appendChild(svg);
    document.body.appendChild(tela);
    html.classList.add("travado");

    const itens = D.p.map(([d, bb, cls], k) => ({ d, bb, cor: MAC, t: cls === "V" ? 0.72 + (k - 11) * 0.1 : 0.05 + k * 0.045, dur: cls === "V" ? 0.6 : 0.62 }));
    itens.push({ d: D.c[0], bb: D.c[1], cor: CUS, t: 1.0, dur: 0.6, fino: true });
    const desenho = "cubic-bezier(.65,0,.35,1)", saida = "cubic-bezier(.22,1,.36,1)";
    itens.forEach((it, k) => {
      const [x, y, w, h] = it.bb;
      const m = document.createElementNS(NS, "mask"); m.id = "nc-m" + k; m.setAttribute("maskUnits", "userSpaceOnUse");
      const r = document.createElementNS(NS, "rect");
      r.setAttribute("x", x - 4); r.setAttribute("y", y - 4); r.setAttribute("width", w + 8); r.setAttribute("height", h + 8); r.setAttribute("fill", "#fff");
      r.style.transformBox = "fill-box"; r.style.transformOrigin = "50% 100%";
      m.appendChild(r); defs.appendChild(m);
      const f = document.createElementNS(NS, "path");
      f.setAttribute("d", it.d); f.setAttribute("fill", it.cor); f.setAttribute("fill-rule", "evenodd"); f.setAttribute("mask", `url(#nc-m${k})`);
      const s = document.createElementNS(NS, "path");
      s.setAttribute("d", it.d); s.setAttribute("fill", "none"); s.setAttribute("stroke", it.cor); s.setAttribute("stroke-width", it.fino ? 1.6 : 2.4); s.setAttribute("stroke-linejoin", "round");
      g.append(f, s);
      const L = s.getTotalLength();
      s.style.strokeDasharray = L;
      s.animate([{ strokeDashoffset: L }, { strokeDashoffset: 0 }], { duration: it.dur * 1000, delay: it.t * 1000, easing: desenho, fill: "both" });
      s.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: (it.t + it.dur + 0.25) * 1000, fill: "both" });
      r.animate([{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { duration: 520, delay: (it.t + it.dur * 0.6) * 1000, easing: saida, fill: "both" });
    });
    g.style.transformBox = "view-box"; g.style.transformOrigin = "50% 50%";
    g.animate([{ transform: "scale(1.04)" }, { transform: "scale(1)" }], { duration: 2200, easing: "cubic-bezier(.16,1,.3,1)", fill: "both" });

    let saiu = false;
    const sair = () => {
      if (saiu) return; saiu = true;
      tela.classList.add("sai");
      html.classList.remove("travado");
      setTimeout(fim, 180);
      setTimeout(() => tela.remove(), 800);
    };
    tela.addEventListener("click", sair);
    setTimeout(sair, 2050);
  }

  document.addEventListener("DOMContentLoaded", () => {
    marcar();
    riscos();
    cardapio();
    abertura(observar);
  });
})();
