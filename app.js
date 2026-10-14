/* =========================================================
   Barbearia Navalha de Ouro — app.js
   Dados, renderização e lógica de agendamento
   ========================================================= */

const CONFIG = {
  whatsapp: "5511999999999",              // 55 + DDD + número
  endereco: "Rua das Palmeiras, 245 — Centro",
  contato:  "(11) 4002-8922 · contato@navalhadeouro.com.br",
  storageKey: "navalha_agendamentos"
};

/* ---------- DADOS ---------- */

const SERVICOS = [
  { nome: "Corte Clássico",  desc: "Tesoura, máquina e navalha. Finalização com pomada ou cera.", preco: "R$ 60",  tempo: "45 min" },
  { nome: "Barba Terapia",   desc: "Toalha quente, óleo pré-shave, navalha e bálsamo calmante.",  preco: "R$ 45",  tempo: "30 min" },
  { nome: "Combo Completo",  desc: "Corte + barba + sobrancelha. O pacote da casa.",              preco: "R$ 95",  tempo: "75 min" },
  { nome: "Platinado / Cor", desc: "Descoloração, matização e tratamento reconstrutor.",          preco: "A partir de R$ 180", tempo: "" },
  { nome: "Corte Infantil",  desc: "Para os pequenos, com paciência e penteado de herói.",        preco: "R$ 45",  tempo: "30 min" },
  { nome: "Limpeza de Pele", desc: "Esfoliação, extração e hidratação facial masculina.",         preco: "R$ 80",  tempo: "40 min" }
];

const EQUIPE = [
  { nome: "Rafael Souza",  cargo: "Fundador · Clássicos",    foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80" },
  { nome: "Diego Martins", cargo: "Fades · Navalhado",       foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80" },
  { nome: "Lucas Ferreira",cargo: "Coloração · Barba",       foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=80" },
  { nome: "Bruno Alves",   cargo: "Infantil · Freestyle",    foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=500&q=80" }
];

const HORARIOS = [
  { dia: "Segunda — Sexta", hora: "09h — 20h" },
  { dia: "Sábado",          hora: "08h — 18h" },
  { dia: "Domingo",         hora: "Fechado"   }
];

/* ---------- RENDERIZAÇÃO ---------- */

function renderServicos() {
  const grid = document.getElementById("services-grid");
  grid.innerHTML = SERVICOS.map(s => `
    <div class="service">
      <h3>${s.nome}</h3>
      <p>${s.desc}</p>
      <p class="price">${s.preco}${s.tempo ? ` <small>/ ${s.tempo}</small>` : ""}</p>
    </div>
  `).join("");
}

function renderEquipe() {
  const grid = document.getElementById("team-grid");
  grid.innerHTML = EQUIPE.map(b => `
    <div class="barber">
      <img class="barber-photo" src="${b.foto}" alt="${b.nome}" loading="lazy">
      <h3>${b.nome}</h3>
      <span>${b.cargo}</span>
    </div>
  `).join("");
}

function renderHorarios() {
  const ul = document.getElementById("hours-list");
  ul.innerHTML = HORARIOS.map(h => `
    <li><span>${h.dia}</span><span>${h.hora}</span></li>
  `).join("");
}

function preencherSelects() {
  const sServico = document.getElementById("servico");
  SERVICOS.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.nome;
    opt.textContent = s.nome;
    sServico.appendChild(opt);
  });

  const sBarbeiro = document.getElementById("barbeiro");
  EQUIPE.forEach(b => {
    const opt = document.createElement("option");
    opt.value = b.nome;
    opt.textContent = b.nome;
    sBarbeiro.appendChild(opt);
  });
}

function preencherFooter() {
  document.getElementById("footer-endereco").textContent = CONFIG.endereco;
  document.getElementById("footer-contato").textContent  = CONFIG.contato;
  document.getElementById("ano").textContent = new Date().getFullYear();
}

/* ---------- MÁSCARA DE TELEFONE ---------- */

function mascaraTelefone(e) {
  let v = e.target.value.replace(/\D/g, "").slice(0, 11);
  if (v.length > 10) {
    v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  } else if (v.length > 6) {
    v = v.replace(/^(\d{2})(\d{4})(\d{0,4})$/, "($1) $2-$3");
  } else if (v.length > 2) {
    v = v.replace(/^(\d{2})(\d{0,5})$/, "($1) $2");
  } else if (v.length > 0) {
    v = v.replace(/^(\d{0,2})$/, "($1");
  }
  e.target.value = v;
}

/* ---------- VALIDAÇÃO ---------- */

function limparErros(form) {
  form.querySelectorAll(".err").forEach(el => el.textContent = "");
  form.querySelectorAll("input, select").forEach(el => el.classList.remove("invalid"));
}

function mostrarErro(campo, msg) {
  const el = document.querySelector(`[data-err="${campo}"]`);
  if (el) el.textContent = msg;
  const input = document.getElementById(campo);
  if (input) input.classList.add("invalid");
}

function validar(form) {
  limparErros(form);
  let ok = true;

  const nome = form.nome.value.trim();
  if (nome.length < 3) { mostrarErro("nome", "Informe pelo menos 3 caracteres."); ok = false; }

  const tel = form.telefone.value.replace(/\D/g, "");
  if (tel.length < 10) { mostrarErro("telefone", "Telefone incompleto."); ok = false; }

  if (!form.servico.value) { mostrarErro("servico", "Escolha um serviço."); ok = false; }

  if (!form.data.value) { mostrarErro("data", "Escolha uma data."); ok = false; }
  else {
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const d = new Date(form.data.value + "T00:00:00");
    if (d < hoje) { mostrarErro("data", "Data no passado."); ok = false; }
    if (d.getDay() === 0) { mostrarErro("data", "Fechado aos domingos."); ok = false; }
  }

  if (!form.horario.value) { mostrarErro("horario", "Escolha um horário."); ok = false; }
  else {
    const [h, m] = form.horario.value.split(":").map(Number);
    const minutos = h * 60 + m;
    const d = new Date(form.data.value + "T00:00:00");
    const isSab = d.getDay() === 6;
    const abre  = isSab ? 8 * 60 : 9 * 60;
    const fecha = isSab ? 18 * 60 : 20 * 60;
    if (minutos < abre || minutos >= fecha) {
      mostrarErro("horario", `Fora do horário (${isSab ? "08h–18h" : "09h–20h"}).`);
      ok = false;
    }
  }

  return ok;
}

/* ---------- AGENDAMENTO ---------- */

function montarMensagem(dados) {
  const linhas = [
    "*Novo agendamento — Navalha de Ouro*",
    "",
    `*Nome:* ${dados.nome}`,
    `*Telefone:* ${dados.telefone}`,
    `*Serviço:* ${dados.servico}`,
    `*Barbeiro:* ${dados.barbeiro || "Sem preferência"}`,
    `*Data:* ${formatarData(dados.data)}`,
    `*Horário:* ${dados.horario}`,
    `*Obs:* ${dados.obs || "—"}`
  ];
  return encodeURIComponent(linhas.join("\n"));
}

function formatarData(iso) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

function salvarLocal(dados) {
  try {
    const lista = JSON.parse(localStorage.getItem(CONFIG.storageKey) || "[]");
    lista.push({ ...dados, criadoEm: new Date().toISOString() });
    localStorage.setItem(CONFIG.storageKey, JSON.stringify(lista));
  } catch (e) {
    console.warn("Não foi possível salvar localmente:", e);
  }
}

function enviarAgendamento(e) {
  e.preventDefault();
  const form = e.target;

  if (!validar(form)) return;

  const dados = {
    nome:     form.nome.value.trim(),
    telefone: form.telefone.value.trim(),
    servico:  form.servico.value,
    barbeiro: form.barbeiro.value,
    data:     form.data.value,
    horario:  form.horario.value,
    obs:      form.obs.value.trim()
  };

  salvarLocal(dados);

  const url = `https://wa.me/${CONFIG.whatsapp}?text=${montarMensagem(dados)}`;
  window.open(url, "_blank");

  form.reset();
  limparErros(form);
}

/* ---------- MENU MOBILE ---------- */

function setupMenu() {
  const toggle = document.getElementById("menu-toggle");
  const menu   = document.getElementById("menu");
  toggle.addEventListener("click", () => menu.classList.toggle("open"));
  menu.querySelectorAll("a").forEach(a =>
    a.addEventListener("click", () => menu.classList.remove("open"))
  );
}

/* ---------- DATA MÍNIMA ---------- */

function setupDataMin() {
  const input = document.getElementById("data");
  const hoje = new Date().toISOString().split("T")[0];
  input.setAttribute("min", hoje);
}

/* ---------- INIT ---------- */

document.addEventListener("DOMContentLoaded", () => {
  renderServicos();
  renderEquipe();
  renderHorarios();
  preencherSelects();
  preencherFooter();
  setupMenu();
  setupDataMin();

  document.getElementById("telefone").addEventListener("input", mascaraTelefone);
  document.getElementById("booking-form").addEventListener("submit", enviarAgendamento);
});
