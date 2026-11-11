
// Base de consulta de alocação do Horácio.
const ALLOCATION_ACTIVITIES = [
  {
    name: "Atividade de Campo / Visita Técnica",
    description: "Atividades destinadas ao planejamento, mobilização, execução e gestão das atividades de campo.",
    tasks: [
      { name: "Execução dos campos", aliases: ["trabalho de campo", "execução de campo", "visita técnica"] },
      { name: "Gestão das atividades de Campo", aliases: ["gestão de campo", "acompanhamento de campo"] },
      { name: "Preparação – Logística, Compras e Auxiliares de Campo", aliases: ["logística de campo", "compras para campo", "auxiliares de campo", "preparação de campo", "mobilização de campo"] }
    ]
  },
  {
    name: "Atividade Global",
    description: "Atividades de caráter corporativo e interno, não vinculadas diretamente à execução de projetos específicos.",
    tasks: [
      { name: "Administrativo Interno", aliases: ["administrativo", "rotinas administrativas"] },

      {
        name: "Café dos Aniversariantes",
        allocation: "SSO / SSMA Interno",
        aliases: ["café aniversariantes"]
      },

      { name: "Desenvolvimento de Negócios / Comercial", aliases: ["comercial", "desenvolvimento comercial", "novos negócios"] },
      { name: "Desenvolvimento de Sistemas", aliases: ["sistemas", "desenvolvimento de sistema"] },

      {
        name: "Disponibilidade / Sem Alocação",
        aliases: ["ociosidade", "disponibilidade", "sem alocação"]
      },

      { name: "Gestão de Pessoas", aliases: ["recursos humanos", "rh"] },

      {
        name: "Gestão e Planejamento Interno",
        aliases: [
          "reunião interna",
          "reunião de equipe",
          "reunião da gerência"
        ]
      },

      {
        name: "Indisponível",
        aliases: [
          "consulta médica",
          "dentista",
          "exames médicos",
          "atestado",
          "férias",
          "folga",
          "feriado",
          "sábado compensado",
          "compromisso pessoal",
          "ausência"
        ]
      },

      { name: "Inovação e Desenvolvimento Técnico", aliases: ["inovação", "desenvolvimento técnico interno"] },

      {
        name: "Propostas e Orçamentos",
        aliases: [
          "proposta comercial",
          "orçamento",
          "cotação",
          "elaboração de proposta",
          "precificação"
        ]
      },

      { name: "Qualidade, Processos e Melhoria Contínua", aliases: ["qualidade interna", "processos", "melhoria contínua"] },

      {
        name: "SSO / SSMA Interno",
        aliases: [
          "sso interno",
          "ssma interno",
          "segurança do trabalho interno",
          "treinamento de segurança",
          "reunião paradão de segurança",
          "paradão de segurança"
        ]
      },

      {
        name: "Treinamento e Desenvolvimento",
        aliases: [
          "treinamento",
          "curso",
          "capacitação",
          "palestra",
          "workshop interno"
        ]
      }
    ]
  },
  {
    name: "Entrega – Embalar o Produto",
    description: "Atividades destinadas à preparação e finalização dos produtos para entrega.",
    tasks: [
      { name: "Atendimento de Comentários – Retrabalho", aliases: [] },
      { name: "Computação Gráfica", aliases: ["computação gráfica", "artes gráficas", "elementos gráficos"] },
      { name: "Editoração", aliases: ["diagramação", "formatação de documentos"] }
    ]
  },
  {
    name: "Gestão / Coordenação do Projeto",
    description: "Atividades destinadas ao planejamento, coordenação e controle do projeto.",
    tasks: [
      { name: "Contratações de Terceiros", aliases: ["contratação de terceiros", "fornecedores"] },
      { name: "Gerenciamento e Planejamento do Projeto", aliases: ["gerenciamento do projeto", "planejamento do projeto", "gestão do projeto"] },
      { name: "Planejamento & Controle", aliases: ["planejamento e controle", "controle do projeto", "controle de prazos", "controle de custos"] },
      {
        name: "Reuniões Externas",
        aliases: ["reunião com cliente"]
      },
      { name: "Reuniões Internas", aliases: ["reunião interna", "alinhamento interno"] },
      { name: "SSMA / SSO", aliases: ["ssma", "sso"] },
      { name: "Workshop", aliases: ["oficina de trabalho"] }
    ]
  },
  {
    name: "Produção Técnica",
    description: "Atividades destinadas à execução e controle de qualidade das atividades técnicas do projeto.",
    tasks: [
      { name: "Elaboração de Relatórios / Produtos / Análise / Desenvolvimento Técnico", aliases: ["relatório", "relatório técnico", "elaboração de relatório", "análise técnica", "desenvolvimento técnico", "estudos"] },
      { name: "Geoprocessamento", aliases: ["mapas", "mapeamento", "informações geoespaciais", "dados geográficos"] },
      { name: "Revisão / Controle de Qualidade", aliases: ["revisão", "revisão de documento", "controle de qualidade", "revisão técnica"] }
    ]
  }
];

// Normaliza os termos para ignorar acentos, pontuação e diferenças de maiúsculas.
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

// Verifica se todos os termos digitados estão presentes no conteúdo.
function allocationMatches(value, query) {
  const content = normalizeAllocation(value);
  const words = normalizeAllocation(query).split(/\s+/).filter(Boolean);

  return words.every(word => content.includes(word));
}

// Exibe a alocação selecionada.
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
  title.textContent = match.displayName;

  const path = document.createElement("div");
  path.className = "allocation-path";

  const category = document.createElement("span");
  category.textContent = match.activity.name;

  const arrow = document.createElement("span");
  arrow.className = "allocation-path-arrow";
  arrow.textContent = "→";

  const destination = document.createElement("strong");
  destination.textContent = match.task.allocation || match.task.name;

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

// Pesquisa e apresenta as atividades em ordem alfabética.
function renderAllocation() {
  const input = $("allocation-search");
  const resultsRoot = $("allocation-results");
  const status = $("allocation-status");

  if (!input || !resultsRoot || !status) return;

  const query = normalizeAllocation(input.value);

  resultsRoot.replaceChildren();

  const entries = [];

  ALLOCATION_ACTIVITIES.forEach(activity => {
    activity.tasks.forEach(task => {
      const aliases = task.aliases || [];

      let displayName = task.name;

      if (query) {
        const matchingAlias = aliases.find(alias =>
          allocationMatches(alias, query)
        );

        if (matchingAlias) {
          displayName = matchingAlias;
        }
      }

      const searchable = [
        task.name,
        ...aliases,
        activity.name
      ].join(" ");

      if (!query || allocationMatches(searchable, query)) {
        entries.push({
          activity,
          task,
          displayName
        });
      }
    });
  });

  // Ordem alfabética dos resultados.
  entries.sort((a, b) =>
    allocationCollator.compare(a.displayName, b.displayName)
  );

  status.textContent = query
    ? `${entries.length} atividade(s) encontrada(s)`
    : `${entries.length} atividades disponíveis · Clique para consultar a alocação`;

  if (!entries.length) {
    const empty = document.createElement("div");
    empty.className = "allocation-empty";
    empty.textContent = "Nenhuma atividade encontrada. Tente outra palavra-chave.";
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
    name.textContent = match.displayName;

    const hint = document.createElement("span");
    hint.className = "allocation-activity-hint";
    hint.textContent = "Ver alocação →";

    button.append(name, hint);

    button.addEventListener("click", () => {
      showAllocationDetail(match, button, list, detail);
    });

    buttons.push({ button, match });
    list.appendChild(button);
  });

  resultsRoot.append(list, detail);

  // Se a pesquisa encontrar somente uma atividade,
  // a alocação será exibida automaticamente.
  if (query && entries.length === 1) {
    showAllocationDetail(
      entries[0],
      buttons[0].button,
      list,
      detail
    );
  }
}
