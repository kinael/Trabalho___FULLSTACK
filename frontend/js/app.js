
const appWrap  = document.getElementById("app");

const userName = document.getElementById("userName");
const userRole = document.getElementById("userRole");
const btnLogout = document.getElementById("btnLogout");

const views = {
  resMesa:   document.getElementById("view-resMesa"),
  resSala:   document.getElementById("view-resSala"),
  minhas:    document.getElementById("view-minhas"),
  relatorio: document.getElementById("view-relatorio"),
  recursos:  document.getElementById("view-recursos"),
};
const menuButtons = document.querySelectorAll(".menu-btn");

const roleLabel = (r) => r === "adm" ? "ADM" : r === "gestor" ? "Gestor" : "Funcionário";
function applyRoleVisibility(user) {
  const isGestor = user.role === "gestor" || user.role === "adm";
  const isADM    = user.role === "adm";
  document.querySelectorAll(".only-gestor").forEach(el => el.classList.toggle("hidden", !isGestor));
  document.querySelectorAll(".only-adm").forEach(el => el.classList.toggle("hidden", !isADM));
}
function showView(key) {
  Object.entries(views).forEach(([k, el]) => el.classList.toggle("hidden", k !== key));
  if (key === "minhas")    renderMinhasReservas();
  if (key === "relatorio") renderRelatorio();
  if (key === "recursos")  renderRecursosADM();
}

btnLogout.addEventListener("click", () => { clearSession(); window.location.href = "./auth.html"; });
menuButtons.forEach(btn => btn.addEventListener("click", () => showView(btn.dataset.view)));

const mesaData   = document.getElementById("mesaData");
const mesaTurno  = document.getElementById("mesaTurno");
const buscarMesas= document.getElementById("buscarMesas");
const listaMesas = document.getElementById("listaMesas");

const salaData   = document.getElementById("salaData");
const salaTurno  = document.getElementById("salaTurno");
const buscarSalas= document.getElementById("buscarSalas");
const listaSalas = document.getElementById("listaSalas");

const minhasReservas = document.getElementById("minhasReservas");

const kpiTotal = document.getElementById("kpiTotal");
const kpiMesas = document.getElementById("kpiMesas");
const kpiSalas = document.getElementById("kpiSalas");
const tblFreq  = document.querySelector("#tblFreq tbody");
const tblAll   = document.querySelector("#tblAll tbody");

const novaMesa = document.getElementById("novaMesa");
const addMesa  = document.getElementById("addMesa");
const listMesasADM = document.getElementById("listMesasADM");
const novaSala = document.getElementById("novaSala");
const addSala  = document.getElementById("addSala");
const listSalasADM = document.getElementById("listSalasADM");

async function fetchAvailability(type, date, turno) {
  if (!date) return [];
  const q = new URLSearchParams({ type, date, turno }).toString();
  return api(`/availability?${q}`);
}

async function reservar(type, resourceId, date, turno) {
  const user = loadSession();
  if (!user) return alert("Sessão expirada. Faça login novamente.");
  if (!date)  return alert("Selecione a data.");
  try {
    await api("/reservations", {
      method: "POST",
      body: JSON.stringify({ type, resourceId, date, turno, userEmail: user.email })
    });
    alert("Reservado com sucesso!");
  } catch (e) {
    alert("Erro ao reservar: " + e.message);
  }
}

function renderAvailList(items, type, container, date, turno) {
  container.innerHTML = "";
  if (!date) {
    container.innerHTML = `<div class="muted">Selecione uma data e turno.</div>`;
    return;
  }
  if (!items || items.length === 0) {
    container.innerHTML = `<div class="muted">Nenhum recurso disponível para ${date} • ${turno}.</div>`;
    return;
  }
  items.forEach(r => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div>
        <strong>${r.name}</strong>
        <div class="muted">Ativo • ${type === "mesa" ? "Mesa" : "Sala"}</div>
      </div>
      <button class="primary">Reservar</button>
    `;
    div.querySelector("button").addEventListener("click", async () => {
      await reservar(type, r.id, date, turno);
      const updated = await fetchAvailability(type, date, turno);
      renderAvailList(updated, type, container, date, turno);
    });
    container.appendChild(div);
  });
}

buscarMesas.addEventListener("click", async () => {
  const date = mesaData.value;
  const turno = mesaTurno.value;
  const disp = await fetchAvailability("mesa", date, turno);
  renderAvailList(disp, "mesa", listaMesas, date, turno);
});
buscarSalas.addEventListener("click", async () => {
  const date = salaData.value;
  const turno = salaTurno.value;
  const disp = await fetchAvailability("sala", date, turno);
  renderAvailList(disp, "sala", listaSalas, date, turno);
});

async function renderMinhasReservas() {
  const user = loadSession();
  if (!user) return;
  try {
    const list = await api(`/reservations/my?userEmail=${encodeURIComponent(user.email)}`);
    minhasReservas.innerHTML = "";

    if (!list.length) {
      minhasReservas.innerHTML = `<div class="muted">Você ainda não possui reservas.</div>`;
      return;
    }

    const res = await api("/resources"); 
    const nameFor = (type, id) => {
      const list = type === "mesa" ? res.mesas : res.salas;
      return (list.find(x => x.id === id) || {}).name || "—";
    };

    list
      .sort((a, b) => a.date.localeCompare(b.date) || a.turno.localeCompare(b.turno))
      .forEach(r => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
          <div>
            <strong>${r.type === "mesa" ? "Mesa" : "Sala"} • ${nameFor(r.type, r.resourceId)}</strong>
            <div class="muted">${r.date} • ${r.turno}</div>
          </div>
          <button class="danger outline">Cancelar</button>
        `;
        div.querySelector("button").addEventListener("click", async () => {
          try {
            await api(`/reservations/${r.id}`, { method: "DELETE" });
            renderMinhasReservas();
          } catch (err) { alert("Falha ao cancelar: " + err.message); }
        });
        minhasReservas.appendChild(div);
      });
  } catch (e) {
    minhasReservas.innerHTML = `<div class="muted">Erro: ${e.message}</div>`;
  }
}

async function renderRelatorio() {
  try {
    const data = await api("/reports/summary");
    kpiTotal.textContent = data.total ?? 0;
    kpiMesas.textContent = data.mesas ?? 0;
    kpiSalas.textContent = data.salas ?? 0;

    const rows = Object.entries(data.freq || {})
      .sort((a, b) => b[1] - a[1])
      .map(([email, qtd]) => `<tr><td>${email}</td><td>${qtd}</td></tr>`)
      .join("");
    tblFreq.innerHTML = rows || `<tr><td colspan="2">Sem dados.</td></tr>`;

    const res = await api("/resources");
    const nameFor = (type, id) => {
      const list = type === "mesa" ? res.mesas : res.salas;
      return (list.find(x => x.id === id) || {}).name || "—";
    };

    tblAll.innerHTML =
      (data.reservations || [])
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
        .map(r => `
          <tr>
            <td>${r.type === "mesa" ? "Mesa" : "Sala"}</td>
            <td>${nameFor(r.type, r.resourceId)}</td>
            <td>${r.date}</td>
            <td>${r.turno}</td>
            <td>${r.userEmail}</td>
            <td>${new Date(r.createdAt).toLocaleString()}</td>
          </tr>
        `)
        .join("") || `<tr><td colspan="6">Sem reservas.</td></tr>`;
  } catch (e) {
    kpiTotal.textContent = "0";
    kpiMesas.textContent = "0";
    kpiSalas.textContent = "0";
    tblFreq.innerHTML = `<tr><td colspan="2">Erro: ${e.message}</td></tr>`;
    tblAll.innerHTML  = `<tr><td colspan="6">Erro: ${e.message}</td></tr>`;
  }
}

async function renderRecursosADM() {
  try {
    const resources = await api("/resources"); 

    listMesasADM.innerHTML = "";
    (resources.mesas || []).forEach(m => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div>
          <strong>${m.name}</strong>
          <span class="badge ${m.active ? "ok" : "off"}">${m.active ? "Ativo" : "Inativo"}</span>
        </div>
        <div class="row">
          <button data-act="toggle">${m.active ? "Desativar" : "Ativar"}</button>
          <button class="danger outline" data-act="rem">Remover</button>
        </div>
      `;
      div.querySelector('[data-act="toggle"]').addEventListener("click", async () => {
        try { await api(`/resources/mesa/${m.id}/toggle`, { method: "PATCH" }); renderRecursosADM(); }
        catch (e) { alert("Erro: " + e.message); }
      });
      div.querySelector('[data-act="rem"]').addEventListener("click", async () => {
        if (!confirm("Remover este item? Reservas existentes permanecem no histórico.")) return;
        try { await api(`/resources/mesa/${m.id}`, { method: "DELETE" }); renderRecursosADM(); }
        catch (e) { alert("Falha ao remover: " + e.message); }
      });
      listMesasADM.appendChild(div);
    });

    listSalasADM.innerHTML = "";
    (resources.salas || []).forEach(s => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div>
          <strong>${s.name}</strong>
          <span class="badge ${s.active ? "ok" : "off"}">${s.active ? "Ativo" : "Inativo"}</span>
        </div>
        <div class="row">
          <button data-act="toggle">${s.active ? "Desativar" : "Ativar"}</button>
          <button class="danger outline" data-act="rem">Remover</button>
        </div>
      `;
      div.querySelector('[data-act="toggle"]').addEventListener("click", async () => {
        try { await api(`/resources/sala/${s.id}/toggle`, { method: "PATCH" }); renderRecursosADM(); }
        catch (e) { alert("Erro: " + e.message); }
      });
      div.querySelector('[data-act="rem"]').addEventListener("click", async () => {
        if (!confirm("Remover este item? Reservas existentes permanecem no histórico.")) return;
        try { await api(`/resources/sala/${s.id}`, { method: "DELETE" }); renderRecursosADM(); }
        catch (e) { alert("Falha ao remover: " + e.message); }
      });
      listSalasADM.appendChild(div);
    });

  } catch (e) {
    listMesasADM.innerHTML = `<div class="muted">Erro: ${e.message}</div>`;
    listSalasADM.innerHTML = `<div class="muted">Erro: ${e.message}</div>`;
  }
}

addMesa.addEventListener("click", async () => {
  const name = novaMesa.value.trim();
  if (!name) return alert("Informe o nome da mesa.");
  try {
    const created = await api("/resources/mesas", {
      method: "POST",
      body: JSON.stringify({ name })
    });
    alert(`Mesa criada: ${created.name}`);
    novaMesa.value = "";
    await renderRecursosADM();
  } catch (e) {
    alert("Erro: " + e.message);
  }
});

addSala.addEventListener("click", async () => {
  const name = novaSala.value.trim();
  if (!name) return alert("Informe o nome da sala.");
  try {
    const created = await api("/resources/salas", {
      method: "POST",
      body: JSON.stringify({ name })
    });
    alert(`Sala criada: ${created.name}`);
    novaSala.value = "";
    await renderRecursosADM();
  } catch (e) {
    alert("Erro: " + e.message);
  }
});

function initApp() {
  const user = loadSession();
  if (!user) { window.location.href = "./auth.html"; return; }
  userName.textContent = `${user.name} (${user.email})`;
  userRole.textContent = roleLabel(user.role);
  applyRoleVisibility(user);
  showView("resMesa");
}
(function boot(){ initApp(); })();
