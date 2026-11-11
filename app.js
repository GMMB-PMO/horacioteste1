
const ALLOCATION_ACTIVITIES = [
  {
    name: "Atividade Global",
    description: "Atividades globais e internas.",
    tasks: [
      // Indisponível
      { name: "Atestado", allocation: "Indisponível" },
      { name: "Ausência", allocation: "Indisponível" },
      { name: "Compromisso pessoal", allocation: "Indisponível" },
      { name: "Consulta médica", allocation: "Indisponível" },
      { name: "Dentista", allocation: "Indisponível" },
      { name: "Exames médicos", allocation: "Indisponível" },
      { name: "Férias", allocation: "Indisponível" },
      { name: "Feriado", allocation: "Indisponível" },
      { name: "Folga", allocation: "Indisponível" },
      { name: "Sábado compensado", allocation: "Indisponível" },

      // Disponibilidade / Sem Alocação
      { name: "Disponibilidade", allocation: "Disponibilidade / Sem Alocação" },
      { name: "Ociosidade", allocation: "Disponibilidade / Sem Alocação" },
      { name: "Sem Alocação", allocation: "Disponibilidade / Sem Alocação" },

      // Gestão e Planejamento Interno
      { name: "Reunião da gerência", allocation: "Gestão e Planejamento Interno" },
      { name: "Reunião de equipe", allocation: "Gestão e Planejamento Interno" },
      { name: "Reunião interna", allocation: "Gestão e Planejamento Interno" },

      // Propostas e Orçamentos
      { name: "Cotação", allocation: "Propostas e Orçamentos" },
      { name: "Elaboração de proposta", allocation: "Propostas e Orçamentos" },
      { name: "Orçamento", allocation: "Propostas e Orçamentos" },
      { name: "Precificação", allocation: "Propostas e Orçamentos" },
      { name: "Proposta comercial", allocation: "Propostas e Orçamentos" },

      // SSO / SSMA Interno
      { name: "Café dos Aniversariantes", allocation: "SSO / SSMA Interno" },
      { name: "Reunião: Paradão de Segurança", allocation: "SSO / SSMA Interno" },
      { name: "Treinamento de segurança", allocation: "SSO / SSMA Interno" },

      // Treinamento e Desenvolvimento
      { name: "Capacitação", allocation: "Treinamento e Desenvolvimento" },
      { name: "Curso", allocation: "Treinamento e Desenvolvimento" },
      { name: "Palestra", allocation: "Treinamento e Desenvolvimento" },
      { name: "Treinamento", allocation: "Treinamento e Desenvolvimento" },
      { name: "Workshop interno", allocation: "Treinamento e Desenvolvimento" }
    ]
  },
  {
    name: "Gestão / Coordenação do Projeto",
    description: "Atividades de gestão e coordenação do projeto.",
    tasks: [
      { name: "Reunião com cliente", allocation: "Reuniões Externas" }
    ]
  }
];

function normalizeAllocation(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[–—-]/g, " ")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const allocationCollator = new Intl.Collator("pt-BR", {
  sensitivity: "base"
});

function showAllocationDetail(match, button, list, detail) {
  list.querySelectorAll(".allocation-activity-button").forEach(item => {
    item.classList.remove("selected");
    item.setAttribute("aria-expanded", "false");
  });

  if (button) {
    button.classList.add("selected");
    button.setAttribute("aria-expanded", "true");
  }

  detail.replaceChildren();

  const label = document.createElement("div");
  label.className = "allocation-detail-label";
  label.textContent = "ALOCAÇÃO CORRETA";

  const title = document.createElement("h3");
  title.textContent = match.task.name;

  const path = document.createElement("div");
  path.className = "allocation-path";

  const category = document.createElement("span");
  category.textContent = match.activity.name;

  const arrow = document.createElement("span");
  arrow.className = "allocation-path-arrow";
  arrow.textContent = "→";

  const destination = document.createElement("strong");
  destination.textContent = match.task.allocation;

  path.append(category, arrow, destination);

  const description = document.createElement("p");
  description.textContent = match.activity.description;

  detail.append(label, title, path, description);
  detail.hidden = false;

  detail.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

function renderAllocation() {
  const input = $("allocation-search");
  const resultsRoot = $("allocation-results");
  const status = $("allocation-status");

  if (!input || !resultsRoot || !status) return;

  const query = normalizeAllocation(input.value);

  resultsRoot.replaceChildren();

  let entries = [];

  ALLOCATION_ACTIVITIES.forEach(activity => {
    activity.tasks.forEach(task => {
      const searchable = normalizeAllocation(task.name);

      if (!query || searchable.includes(query)) {
        entries.push({ activity, task });
      }
    });
  });

  // Ordenação alfabética de todos os termos.
  entries.sort((a, b) =>
    allocationCollator.compare(a.task.name, b.task.name)
  );

  status.textContent = query
    ? `${entries.length} termo(s) encontrado(s)`
    : `${entries.length} termos disponíveis · Clique para consultar a alocação`;

  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "allocation-empty";
    empty.textContent =
      "Nenhum termo encontrado. Tente outra palavra-chave.";

    resultsRoot.appendChild(empty);
    return;
  }

  const list = document.createElement("div");
  list.className = "allocation-activity-list";

  const detail = document.createElement("section");
  detail.className = "allocation-detail";
  detail.setAttribute("aria-live", "polite");
  detail.hidden = true;

  const buttons = [];

  entries.forEach(match => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "allocation-activity-button";
    button.setAttribute("aria-expanded", "false");

    const name = document.createElement("span");
    name.className = "allocation-activity-name";
    name.textContent = match.task.name;

    const hint = document.createElement("span");
    hint.className = "allocation-activity-hint";
    hint.textContent = "Ver alocação →";

    button.append(name, hint);

    button.addEventListener("click", () => {
      showAllocationDetail(match, button, list, detail);
    });

    buttons.push(button);
    list.appendChild(button);
  });

  resultsRoot.append(list, detail);

  // Se houver somente um resultado, mostrar a alocação automaticamente.
  if (query && entries.length === 1) {
    showAllocationDetail(
      entries[0],
      buttons[0],
      list,
      detail
    );
  }
}
