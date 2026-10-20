/**
 * ==========================================================================
 * INTEGRAÇÃO COM A API REST DE FERIADOS NACIONAIS (.NET 10)
 * ==========================================================================
 * Endpoints oficiais (validados via Collection Bruno/Postman):
 * - GET    /api/feriados      -> Listar todos os feriados
 * - POST   /api/feriados      -> Criar novo feriado
 * - PUT    /api/feriados/{id} -> Atualizar feriado existente
 * - DELETE /api/feriados/{id} -> Remover feriado por ID
 *
 * Propriedades JSON:
 * - id: number
 * - nome: string
 * - data: string ("DD/MM/AAAA")
 * - tipo: string ("Nacional" | "Estadual" | "Municipal" | "Facultativo")
 * ==========================================================================
 */

// Resolução de URL da API: relativo se servido via HTTP, fallback para localhost:5050 se arquivo local
const API_URL = window.location.protocol.startsWith("http")
  ? "/api/feriados"
  : "http://localhost:5050/api/feriados";

// Estado local sincronizado exclusivamente a partir da API
let feriadosApiState = [];
let editingFeriadoId = null;

// Elementos do DOM
const apiStatusBadge = document.getElementById("api-status-badge");
const holidayForm = document.getElementById("holiday-form");
const holidayIdInput = document.getElementById("holiday-id");
const holidayNameInput = document.getElementById("holiday-name");
const holidayDateInput = document.getElementById("holiday-date");
const holidayTypeSelect = document.getElementById("holiday-type");
const btnSubmit = document.getElementById("btn-submit");
const btnCancelEdit = document.getElementById("btn-cancel-edit");
const btnReset = document.getElementById("btn-reset");
const formHeading = document.getElementById("form-heading");
const formDescription = document.getElementById("form-description");
const editBadge = document.getElementById("edit-badge");
const formCard = document.querySelector(".form-section");

const feedbackMessage = document.getElementById("feedback-message");
const holidaysTableBody = document.getElementById("holidays-tbody");
const filterTypeSelect = document.getElementById("filter-type");
const statsSummary = document.getElementById("stats-summary");
const btnReload = document.getElementById("btn-reload");
const btnRetry = document.getElementById("btn-retry");

const loadingState = document.getElementById("loading-state");
const emptyState = document.getElementById("empty-state");
const errorState = document.getElementById("error-state");
const errorStateMessage = document.getElementById("error-state-message");
const tableContainer = document.getElementById("table-container");

// ==========================================================================
// Funções Utilitárias de Data e Formatação
// ==========================================================================

/**
 * Converte data do formato HTML YYYY-MM-DD para DD/MM/AAAA (padrão da API/Collection Bruno)
 */
function toApiDate(isoDate) {
  if (!isoDate) return "";
  if (isoDate.includes("/")) return isoDate;
  const parts = isoDate.split("-");
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoDate;
}

/**
 * Converte data da API DD/MM/AAAA para YYYY-MM-DD para preencher o input type="date"
 */
function toInputDate(apiDate) {
  if (!apiDate) return "";
  if (apiDate.includes("-")) return apiDate;
  const parts = apiDate.split("/");
  if (parts.length === 3) {
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  return apiDate;
}

/**
 * Retorna classe CSS para o badge de classificação
 */
function getTypeBadgeClass(tipo) {
  switch ((tipo || "").toLowerCase()) {
    case "nacional":
      return "badge-tag nacional";
    case "estadual":
      return "badge-tag estadual";
    case "municipal":
      return "badge-tag municipal";
    case "facultativo":
      return "badge-tag facultativo";
    default:
      return "badge-tag";
  }
}

// ==========================================================================
// Mensagens de Feedback Acessíveis
// ==========================================================================

function showFeedback(message, type = "success") {
  feedbackMessage.textContent = message;
  feedbackMessage.className = `feedback-box ${type}`;
  feedbackMessage.hidden = false;
  feedbackMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });

  if (type === "success") {
    setTimeout(() => {
      feedbackMessage.hidden = true;
    }, 5000);
  }
}

function clearFeedback() {
  feedbackMessage.hidden = true;
  feedbackMessage.textContent = "";
}

function updateApiStatus(isOnline, detail = "") {
  if (isOnline) {
    apiStatusBadge.className = "api-status-badge online";
    apiStatusBadge.textContent = "API Conectada";
  } else {
    apiStatusBadge.className = "api-status-badge offline";
    apiStatusBadge.textContent = detail ? `API Indisponível (${detail})` : "API Desconectada";
  }
}

// ==========================================================================
// Modo de Edição do Formulário
// ==========================================================================

function setEditMode(feriado) {
  editingFeriadoId = feriado.id;
  holidayIdInput.value = feriado.id;
  holidayNameInput.value = feriado.nome;
  holidayDateInput.value = toInputDate(feriado.data);
  holidayTypeSelect.value = feriado.tipo;

  formHeading.textContent = "Editar Feriado";
  formDescription.textContent = `Atualizando registro de ID #${feriado.id} na API.`;
  btnSubmit.textContent = "Salvar Alterações";
  btnCancelEdit.hidden = false;
  editBadge.hidden = false;
  formCard.classList.add("is-editing");

  clearFeedback();
  formCard.scrollIntoView({ behavior: "smooth", block: "start" });
  holidayNameInput.focus();

  renderTabela();
}

function cancelEditMode() {
  editingFeriadoId = null;
  holidayForm.reset();
  holidayIdInput.value = "";

  formHeading.textContent = "Cadastrar Novo Feriado";
  formDescription.textContent = "Preencha os campos para salvar um feriado diretamente na API.";
  btnSubmit.textContent = "Cadastrar Feriado";
  btnCancelEdit.hidden = true;
  editBadge.hidden = true;
  formCard.classList.remove("is-editing");

  renderTabela();
}

// ==========================================================================
// Renderização da Tabela (com textContent estrito contra XSS)
// ==========================================================================

function updateStats(total, nacionais) {
  statsSummary.innerHTML = "";

  const chipTotal = document.createElement("span");
  chipTotal.className = "stat-chip";
  chipTotal.textContent = `Total: ${total}`;

  const chipNacionais = document.createElement("span");
  chipNacionais.className = "stat-chip";
  chipNacionais.textContent = `Nacionais: ${nacionais}`;

  const chipOutros = document.createElement("span");
  chipOutros.className = "stat-chip";
  chipOutros.textContent = `Outros: ${total - nacionais}`;

  statsSummary.appendChild(chipTotal);
  statsSummary.appendChild(chipNacionais);
  statsSummary.appendChild(chipOutros);
}

function renderTabela() {
  const currentFilter = filterTypeSelect.value;
  const filtered = currentFilter === "todos"
    ? feriadosApiState
    : feriadosApiState.filter(f => (f.tipo || "").toLowerCase() === currentFilter.toLowerCase());

  holidaysTableBody.innerHTML = "";

  const total = feriadosApiState.length;
  const nacionais = feriadosApiState.filter(f => (f.tipo || "").toLowerCase() === "nacional").length;
  updateStats(total, nacionais);

  if (filtered.length === 0) {
    tableContainer.hidden = true;
    emptyState.hidden = false;
    return;
  }

  tableContainer.hidden = false;
  emptyState.hidden = true;

  filtered.forEach(feriado => {
    const row = document.createElement("tr");
    if (editingFeriadoId === feriado.id) {
      row.className = "is-editing-row";
    }

    // Coluna ID
    const cellId = document.createElement("td");
    const badgeId = document.createElement("span");
    badgeId.className = "holiday-id-badge";
    badgeId.textContent = `#${feriado.id}`;
    cellId.appendChild(badgeId);

    // Coluna Data
    const cellData = document.createElement("td");
    const badgeData = document.createElement("span");
    badgeData.className = "holiday-date-badge";
    badgeData.textContent = feriado.data;
    cellData.appendChild(badgeData);

    // Coluna Nome (Segurança: textContent)
    const cellNome = document.createElement("td");
    cellNome.textContent = feriado.nome;

    // Coluna Tipo
    const cellTipo = document.createElement("td");
    const badgeTipo = document.createElement("span");
    badgeTipo.className = getTypeBadgeClass(feriado.tipo);
    badgeTipo.textContent = feriado.tipo;
    cellTipo.appendChild(badgeTipo);

    // Coluna Ações (Editar e Excluir)
    const cellActions = document.createElement("td");
    cellActions.className = "td-actions";

    const actionsContainer = document.createElement("div");
    actionsContainer.className = "action-buttons";

    const btnEdit = document.createElement("button");
    btnEdit.type = "button";
    btnEdit.className = "btn-action btn-action-edit";
    btnEdit.textContent = "Editar";
    btnEdit.setAttribute("aria-label", `Editar feriado ${feriado.nome}`);
    btnEdit.addEventListener("click", () => setEditMode(feriado));

    const btnDelete = document.createElement("button");
    btnDelete.type = "button";
    btnDelete.className = "btn-action btn-action-delete";
    btnDelete.textContent = "Excluir";
    btnDelete.setAttribute("aria-label", `Excluir feriado ${feriado.nome}`);
    btnDelete.addEventListener("click", () => excluirFeriado(feriado.id, feriado.nome));

    actionsContainer.appendChild(btnEdit);
    actionsContainer.appendChild(btnDelete);
    cellActions.appendChild(actionsContainer);

    row.appendChild(cellId);
    row.appendChild(cellData);
    row.appendChild(cellNome);
    row.appendChild(cellTipo);
    row.appendChild(cellActions);

    holidaysTableBody.appendChild(row);
  });
}

// ==========================================================================
// Operações da API (GET, POST, PUT, DELETE)
// ==========================================================================

/**
 * 1. LISTAR: GET /api/feriados
 */
async function carregarFeriados() {
  loadingState.hidden = false;
  errorState.hidden = true;
  emptyState.hidden = true;
  tableContainer.hidden = true;

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Status ${response.status} (${response.statusText || "Erro ao consultar"})`);
    }

    const data = await response.json();
    feriadosApiState = Array.isArray(data) ? data : [];

    updateApiStatus(true);
    loadingState.hidden = true;

    if (feriadosApiState.length === 0) {
      emptyState.hidden = false;
      tableContainer.hidden = true;
      updateStats(0, 0);
    } else {
      emptyState.hidden = true;
      tableContainer.hidden = false;
      renderTabela();
    }
  } catch (error) {
    loadingState.hidden = true;
    tableContainer.hidden = true;
    errorState.hidden = false;
    errorStateMessage.textContent = `Falha ao carregar feriados da API: ${error.message}`;
    updateApiStatus(false, error.message);
  }
}

/**
 * 2. CRIAR: POST /api/feriados
 */
async function criarFeriado(payload) {
  btnSubmit.disabled = true;
  btnSubmit.textContent = "Salvando...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let detalhe = "";
      try {
        const errJson = await response.json();
        detalhe = errJson.mensagem || errJson.title || JSON.stringify(errJson);
      } catch {
        detalhe = await response.text();
      }
      throw new Error(`Erro ${response.status}: ${detalhe || response.statusText}`);
    }

    showFeedback(`Feriado "${payload.nome}" cadastrado com sucesso na API!`, "success");
    holidayForm.reset();
    await carregarFeriados();
  } catch (error) {
    showFeedback(`Não foi possível cadastrar o feriado: ${error.message}`, "error");
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Cadastrar Feriado";
  }
}

/**
 * 3. EDITAR: PUT /api/feriados/{id}
 */
async function atualizarFeriado(id, payload) {
  btnSubmit.disabled = true;
  btnSubmit.textContent = "Atualizando...";

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ id: Number(id), ...payload })
    });

    if (!response.ok) {
      let detalhe = "";
      try {
        const errJson = await response.json();
        detalhe = errJson.mensagem || errJson.title || JSON.stringify(errJson);
      } catch {
        detalhe = await response.text();
      }
      throw new Error(`Erro ${response.status}: ${detalhe || response.statusText}`);
    }

    showFeedback(`Feriado #${id} atualizado com sucesso na API!`, "success");
    cancelEditMode();
    await carregarFeriados();
  } catch (error) {
    showFeedback(`Não foi possível atualizar o feriado #${id}: ${error.message}`, "error");
  } finally {
    btnSubmit.disabled = false;
    if (editingFeriadoId) {
      btnSubmit.textContent = "Salvar Alterações";
    }
  }
}

/**
 * 4. EXCLUIR: DELETE /api/feriados/{id}
 */
async function excluirFeriado(id, nome) {
  const confirmacao = window.confirm(`Deseja realmente excluir o feriado "${nome}" (ID #${id}) da API?`);
  if (!confirmacao) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json"
      }
    });

    if (!response.ok) {
      let detalhe = "";
      try {
        const errJson = await response.json();
        detalhe = errJson.mensagem || errJson.title || JSON.stringify(errJson);
      } catch {
        detalhe = await response.text();
      }
      throw new Error(`Erro ${response.status}: ${detalhe || response.statusText}`);
    }

    showFeedback(`Feriado "${nome}" (ID #${id}) removido com sucesso da API!`, "success");

    // Se estava em edição do mesmo item excluído, reseta formulário
    if (editingFeriadoId === id) {
      cancelEditMode();
    }

    await carregarFeriados();
  } catch (error) {
    showFeedback(`Não foi possível excluir o feriado #${id}: ${error.message}`, "error");
  }
}

// ==========================================================================
// Event Listeners
// ==========================================================================

holidayForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = holidayIdInput.value;
  const nome = holidayNameInput.value.trim();
  const rawDate = holidayDateInput.value;
  const tipo = holidayTypeSelect.value;

  if (!nome) {
    showFeedback("Por favor, preencha o nome do feriado.", "error");
    holidayNameInput.focus();
    return;
  }

  if (!rawDate) {
    showFeedback("Por favor, selecione uma data válida.", "error");
    holidayDateInput.focus();
    return;
  }

  if (!tipo) {
    showFeedback("Por favor, selecione o tipo do feriado.", "error");
    holidayTypeSelect.focus();
    return;
  }

  const payload = {
    nome: nome,
    data: toApiDate(rawDate),
    tipo: tipo
  };

  if (id) {
    await atualizarFeriado(id, payload);
  } else {
    await criarFeriado(payload);
  }
});

btnCancelEdit.addEventListener("click", cancelEditMode);

btnReset.addEventListener("click", () => {
  if (editingFeriadoId) {
    cancelEditMode();
  } else {
    clearFeedback();
  }
});

filterTypeSelect.addEventListener("change", renderTabela);
btnReload.addEventListener("click", carregarFeriados);
btnRetry.addEventListener("click", carregarFeriados);

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
  carregarFeriados();
});
