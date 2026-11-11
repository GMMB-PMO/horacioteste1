
'use strict';

const ICONS = {
  'Sistemas – Horácio': '▣',
  'Ponto e jornada': '◷',
  'Banco de horas': '▤',
  'Processos internos': '☷',
  'Projetos': '◇',
  'Dúvidas gerais': '?'
};

const DEFAULT_CATS = Object.keys(ICONS);

let records = [];
let category = 'Todas';
let term = '';

const $ = id => document.getElementById(id);

const norm = s =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();


// =============================================
// CONSULTA DE ALOCAÇÃO - BASE DE ATIVIDADES
// =============================================

const ALLOCATION_ACTIVITIES = [

  {
    name: "Atividade de Campo / Visita Técnica",
    description: "Atividades destinadas ao planejamento, mobilização, execução e gestão das atividades de campo, incluindo logística, materiais, equipamentos, serviços, equipes e recursos, com acompanhamento do cronograma, da qualidade, das ocorrências e dos ajustes necessários.",
    tasks: [
      {
        name: "Execução dos campos",
        aliases: ["trabalho de campo", "execução de campo", "visita técnica"]
      },
      {
        name: "Gestão das atividades de Campo",
        aliases: ["gestão de campo", "acompanhamento de campo"]
      },
      {
        name: "Preparação – Logística, Compras e Auxiliares de Campo",
        aliases: ["logística de campo", "compras para campo", "auxiliares de campo", "preparação de campo", "mobilização de campo"]
      }
    ]
  },

  {
    name: "Atividade Global",
    description: "Atividades de caráter corporativo e interno, não vinculadas diretamente à execução de projetos específicos, incluindo rotinas administrativas, desenvolvimento de negócios e sistemas, propostas e orçamentos, gestão de pessoas, planejamento interno, inovação, qualidade, ações de SSO/SSMA e treinamentos.",
    tasks: [
      { name: "Administrativo Interno", aliases: ["administrativo", "rotinas administrativas"] },
      { name: "Desenvolvimento de Negócios / Comercial", aliases: ["comercial", "desenvolvimento comercial", "novos negócios"] },
      { name: "Desenvolvimento de Sistemas", aliases: ["sistemas", "desenvolvimento de sistema"] },
      { name: "Disponibilidade / Sem Alocação", aliases: ["disponibilidade", "sem alocação"] },
      { name: "Gestão de Pessoas", aliases: ["recursos humanos", "rh", "gestão de equipe"] },
      { name: "Gestão e Planejamento Interno", aliases: ["planejamento interno", "gestão interna"] },
      {
        name: "Indisponível",
        aliases: [
          "feriado",
          "sábado com horas compensadas",
          "sabado com horas compensadas",
          "sábado compensado",
          "sabado compensado"
        ]
      },
      { name: "Inovação e Desenvolvimento Técnico", aliases: ["inovação", "inovacao", "desenvolvimento técnico interno"] },
      { name: "Propostas e Orçamentos", aliases: ["proposta", "orçamento", "orcamento", "elaboração de orçamento"] },
      { name: "Qualidade, Processos e Melhoria Contínua", aliases: ["qualidade interna", "processos", "melhoria contínua", "melhoria continua"] },
      { name: "SSO / SSMA Interno", aliases: ["sso interno", "ssma interno", "segurança do trabalho interno"] },
      {
        name: "Treinamento e Desenvolvimento",
        aliases: [
          "treinamento",
          "desenvolvimento de pessoas",
          "pitstop técnico",
          "pitstop tecnico",
          "pit stop técnico",
          "pit stop tecnico",
          "pitstop",
          "pit stop"
        ]
      }
    ]
  },

  {
    name: "Entrega – Embalar o Produto",
    description: "Atividades destinadas à preparação e finalização dos produtos para entrega, incluindo formatação e padronização de documentos, produção de elementos gráficos e atendimento aos comentários, com revisão, correção e atualização dos arquivos.",
    tasks: [
      {
        name: "Atendimento de Comentários – Retrabalho",
        aliases: ["atendimento de comentários", "atendimento de comentarios", "retrabalho", "ajustes solicitados", "correção de comentários"]
      },
      {
        name: "Computação Gráfica",
        aliases: ["computação gráfica", "computacao grafica", "artes gráficas", "artes graficas", "elementos gráficos"]
      },
      {
        name: "Editoração",
        aliases: ["diagramação", "diagramacao", "formatação de documentos", "formatacao de documentos"]
      }
    ]
  },

  {
    name: "Gestão / Coordenação do Projeto",
    description: "Atividades destinadas ao planejamento, coordenação e controle do projeto, abrangendo estratégias e responsabilidades, contratações e gestão de terceiros, acompanhamento de prazos, custos e riscos, requisitos de SSMA, alinhamento com as partes interessadas e realização de reuniões e workshops.",
    tasks: [
      { name: "Contratações de Terceiros", aliases: ["contratação de terceiros", "contratacao de terceiros", "fornecedores"] },
      { name: "Gerenciamento e Planejamento do Projeto", aliases: ["gerenciamento do projeto", "planejamento do projeto", "gestão do projeto"] },
      { name: "Planejamento & Controle", aliases: ["planejamento e controle", "controle do projeto", "controle de prazos", "controle de custos"] },
      { name: "Reuniões Externas", aliases: ["reunião externa", "reuniao externa", "reunião com cliente", "reuniao com cliente"] },
      { name: "Reuniões Internas", aliases: ["reunião interna", "reuniao interna", "alinhamento interno"] },
      { name: "SSMA / SSO", aliases: ["ssma", "sso"] },
      { name: "Workshop", aliases: ["oficina de trabalho"] }
    ]
  },

  {
    name: "Produção Técnica",
    description: "Atividades destinadas à execução e controle de qualidade das atividades técnicas do projeto, incluindo pesquisa, tratamento e análise de dados, estudos, modelagens, desenvolvimento de soluções e produtos, elaboração e revisão de documentos e produção de informações geoespaciais.",
    tasks: [
      {
        name: "Elaboração de Relatórios / Produtos / Análise / Desenvolvimento Técnico",
        aliases: ["relatório", "relatorio", "relatório técnico", "relatorio tecnico", "elaboração de relatório", "elaboracao de relatorio", "análise técnica", "analise tecnica", "desenvolvimento técnico", "estudos"]
      },
      {
        name: "Geoprocessamento",
        aliases: ["mapas", "mapeamento", "informações geoespaciais", "informacoes geoespaciais", "dados geográficos", "dados geograficos"]
      },
      {
        name: "Revisão / Controle de Qualidade",
        aliases: ["revisão", "revisao", "revisão de documento", "revisao de documento", "controle de qualidade", "revisão técnica"]
      }
    ]
  }

];


// =============================================
// FUNÇÕES DA CONSULTA DE ALOCAÇÃO
// =============================================

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

function renderAllocation() {

  const input = $("allocation-search");
  const resultsRoot = $("allocation-results");
  const status = $("allocation-status");

  if (!input || !resultsRoot || !status) return;

  const query = normalizeAllocation(input.value);

  resultsRoot.replaceChildren();

  function createCard(activity, tasks, showAll) {

    const article = document.createElement("article");
    article.className = "allocation-card";

    const kicker = document.createElement("div");
    kicker.className = "allocation-kicker";
    kicker.textContent = "ATIVIDADE PRINCIPAL";

    const title = document.createElement("h3");
    title.textContent = activity.name;

    const description = document.createElement("p");
    description.className = "allocation-description";
    description.textContent = activity.description;

    const heading = document.createElement("div");
    heading.className = "allocation-task-heading";
    heading.textContent = showAll
      ? "TAREFAS DISPONÍVEIS"
      : "TAREFA PARA ALOCAÇÃO";

    const list = document.createElement("div");
    list.className = "allocation-task-list";

    tasks.forEach(task => {

      const row = document.createElement("div");

      row.className = "allocation-task" +
        (showAll ? "" : " is-match");

      const check = document.createElement("span");
      check.className = "allocation-check";
      check.textContent = "✓";

      const text = document.createElement("span");
      text.textContent = task.name;

      row.append(check, text);
      list.appendChild(row);

    });

    article.append(
      kicker,
      title,
      description,
      heading,
      list
    );

    return article;
  }

  // Exibir todas as categorias quando a busca estiver vazia

  if (!query) {

    status.textContent =
      "Todas as categorias · Ordem alfabética";

    ALLOCATION_ACTIVITIES.forEach(activity => {

      resultsRoot.appendChild(
        createCard(activity, activity.tasks, true)
      );

    });

    return;
  }

  const found = [];

  ALLOCATION_ACTIVITIES.forEach(activity => {

    const categoryMatch =
      normalizeAllocation(activity.name).includes(query);

    const descriptionMatch =
      normalizeAllocation(activity.description).includes(query);

    const matchedTasks = activity.tasks.filter(task => {

      const nameMatch =
        normalizeAllocation(task.name).includes(query);

      const aliasMatch = task.aliases.some(alias =>
        normalizeAllocation(alias).includes(query)
      );

      return nameMatch || aliasMatch;

    });

    if (categoryMatch || descriptionMatch) {

      found.push({
        activity,
        tasks: activity.tasks
      });

    } else if (matchedTasks.length) {

      found.push({
        activity,
        tasks: matchedTasks
      });

    }

  });

  if (!found.length) {

    status.textContent =
      "Nenhuma correspondência encontrada";

    const empty = document.createElement("div");

    empty.className = "allocation-empty";

    empty.textContent =
      "Não encontramos essa atividade. Tente outra palavra-chave ou valide com o responsável pelo projeto.";

    resultsRoot.appendChild(empty);

    return;
  }

  status.textContent =
    found.length +
    (found.length === 1
      ? " categoria encontrada"
      : " categorias encontradas");

  found.forEach(item => {

    resultsRoot.appendChild(
      createCard(item.activity, item.tasks, false)
    );

  });

}


// =============================================
// FUNÇÕES ORIGINAIS DA CENTRAL
// =============================================

function clean(raw, i) {
  return {
    id: String(raw.id || i + 1).trim(),
    pergunta: String(raw.pergunta || '').trim(),
    resposta: String(raw.resposta || ''),
    categoria: String(raw.categoria || 'Dúvidas gerais').trim(),
    palavras: String(raw['palavras-chave'] || raw.palavras || ''),
    atualizacao: String(raw['ultima atualizacao'] || raw.atualizacao || ''),
    materiais: String(raw.materiais || '')
  };
}


// Remove Recursos Humanos somente da navegação.
// As perguntas continuam preservadas na base.

function cats() {
  return [
    ...new Set([
      ...DEFAULT_CATS,
      ...records.map(r => r.categoria)
    ])
  ].filter(c => norm(c) !== norm('Recursos Humanos'));
}

function count(c) {
  return records.filter(r => r.categoria === c).length;
}

function renderCats() {

  const root = $('categories');
  root.replaceChildren();

  cats().forEach(c => {

    const b = document.createElement('button');
    b.className = 'category';

    const icon = document.createElement('span');
    icon.className = 'cat-icon';
    icon.textContent = ICONS[c] || '▦';

    const name = document.createElement('strong');
    name.textContent = c;

    const n = document.createElement('small');
    n.textContent = `${count(c)} orientações`;

    b.append(icon, name, n);
    b.onclick = () => select(c);

    root.append(b);

  });

}

function renderFilters() {

  const root = $('filters');
  root.replaceChildren();

  ['Todas', ...cats()].forEach(c => {

    const b = document.createElement('button');

    b.className = 'filter' +
      (category === c ? ' active' : '');

    b.textContent = c === 'Todas'
      ? `Todas as categorias (${records.length})`
      : `${c} (${count(c)})`;

    b.onclick = () => select(c);

    root.append(b);

  });

}

function select(c) {

  category = c;
  render();

  if (location.hash !== '#perguntas') {
    location.hash = 'perguntas';
  }

  $('listtitle').scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

}

function render() {

  renderFilters();

  const filtered = records.filter(r =>
    (category === 'Todas' || r.categoria === category) &&
    norm([
      r.pergunta,
      r.resposta,
      r.categoria,
      r.palavras
    ].join(' ')).includes(norm(term))
  );

  $('listtitle').textContent = term
    ? 'Resultados da pesquisa'
    : category === 'Todas'
      ? 'Perguntas frequentes'
      : category;

  $('resultcount').textContent =
    `${filtered.length} resultado(s)`;

  $('count').textContent =
    `${records.length} orientações disponíveis`;

  const root = $('questions');
  root.replaceChildren();

  if (!filtered.length) {

    const e = document.createElement('div');
    e.className = 'empty';

    e.textContent =
      'Nenhuma dúvida encontrada. Experimente outro termo ou categoria.';

    root.append(e);

    return;
  }

  filtered.forEach(r => {

    const b = document.createElement('button');
    b.className = 'question';
    b.type = 'button';

    const top = document.createElement('div');
    top.className = 'qtop';

    const title = document.createElement('strong');
    title.textContent = r.pergunta;

    const arrow = document.createElement('span');
    arrow.className = 'arrow';
    arrow.textContent = '→';

    top.append(title, arrow);

    const meta = document.createElement('div');
    meta.className = 'qmeta';

    meta.textContent = r.categoria +
      (r.atualizacao
        ? ' · Atualizado em ' + r.atualizacao
        : '');

    b.append(top, meta);

    b.addEventListener('click', () => {
      location.hash =
        'duvida/' + encodeURIComponent(r.id);
    });

    root.append(b);

  });

}

function safeUrl(value) {

  try {

    const u = new URL(value, location.href);

    return ['https:', 'http:'].includes(u.protocol)
      ? u.href
      : null;

  } catch {
    return null;
  }

}

function answerNodes(text) {

  const root = $('detailbody');
  root.replaceChildren();

  let list = null;

  String(text || '').split(/\r?\n/).forEach(line => {

    const t = line.trim();

    if (!t) {
      list = null;
      return;
    }

    const match = t.match(/^\d+[.)]\s+(.+)/);

    if (match) {

      if (!list) {
        list = document.createElement('ol');
        root.append(list);
      }

      const li = document.createElement('li');
      li.textContent = match[1];

      list.append(li);

    } else if (/^https?:\/\/\S+$/i.test(t)) {

      list = null;

      const a = document.createElement('a');
      a.href = safeUrl(t) || '#';
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = t;

      root.append(a);

    } else {

      list = null;

      const p = document.createElement('p');
      p.textContent = t;

      root.append(p);

    }

  });

}


// =============================================
// ABERTURA DAS PERGUNTAS
// =============================================

function openQuestion(id) {

  const r = records.find(
    x => String(x.id) === String(id)
  );

  if (!r) {

    console.error('Pergunta não encontrada:', id);

    showHome();

    $('notice').hidden = false;

    $('notice').textContent =
      'Não foi possível localizar essa pergunta. Verifique se a base de dados está atualizada.';

    return;
  }

  $('notice').hidden = true;
  $('home').hidden = true;
  $('gmmb-guide').hidden = true;
  $('allocation-guide').hidden = true;
  $('detail').hidden = false;

  setActiveTab('faq');

  $('detailmeta').textContent = r.categoria;
  $('detailtitle').textContent = r.pergunta;

  answerNodes(r.resposta);

  const resources = $('resources');
  resources.replaceChildren();

  const items = r.materiais
    .split(/\s*\|\s*/)
    .map(s => s.trim())
    .filter(Boolean);

  if (items.length) {

    const box = document.createElement('div');
    box.className = 'resources';

    const h = document.createElement('h3');
    h.textContent = 'Materiais complementares';

    box.append(h);

    items.forEach(item => {

      const [label, ...rest] = item.split('::');

      const url = safeUrl(
        rest.length ? rest.join('::') : label
      );

      if (!url) return;

      const a = document.createElement('a');

      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';

      a.textContent = rest.length ? label : url;

      box.append(a);

    });

    resources.append(box);

  }

  $('detailfooter').textContent =
    'Última atualização: ' +
    (r.atualizacao || 'não informada');

  window.scrollTo(0, 0);

}


// =============================================
// NAVEGAÇÃO ENTRE AS TRÊS SEÇÕES
// =============================================

function setActiveTab(tab) {

  $('tab-faq').classList.toggle(
    'active',
    tab === 'faq'
  );

  $('tab-gmmb').classList.toggle(
    'active',
    tab === 'gmmb'
  );

  $('tab-alocacao').classList.toggle(
    'active',
    tab === 'alocacao'
  );

  document.body.classList.toggle(
    'gmmb-active',
    tab === 'gmmb'
  );

}

function showHome() {

  $('home').hidden = false;
  $('detail').hidden = true;
  $('gmmb-guide').hidden = true;
  $('allocation-guide').hidden = true;

  setActiveTab('faq');

}

function showGmmbGuide() {

  $('home').hidden = true;
  $('detail').hidden = true;
  $('gmmb-guide').hidden = false;
  $('allocation-guide').hidden = true;

  setActiveTab('gmmb');

  window.scrollTo(0, 0);

}

function showAllocationGuide() {

  $('home').hidden = true;
  $('detail').hidden = true;
  $('gmmb-guide').hidden = true;
  $('allocation-guide').hidden = false;

  setActiveTab('alocacao');

  renderAllocation();

  window.scrollTo(0, 0);

}

function route() {

  const hash = location.hash || '#inicio';

  if (hash === '#gmmb') {
    showGmmbGuide();
    return;
  }

  if (hash === '#alocacao') {
    showAllocationGuide();
    return;
  }

  if (hash.startsWith('#duvida/')) {

    const id = decodeURIComponent(
      hash.substring('#duvida/'.length)
    );

    openQuestion(id);

    return;
  }

  showHome();

  if (hash === '#perguntas') {

    setTimeout(() => {

      $('listtitle').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

    }, 50);

  }

}


// =============================================
// LEITURA DE CSV
// =============================================

function csvParse(csv) {

  const rows = [];
  let row = [];
  let field = '';
  let quote = false;

  csv = csv.replace(/^\uFEFF/, '');

  for (let i = 0; i < csv.length; i++) {

    const c = csv[i];

    if (c === '"') {

      if (quote && csv[i + 1] === '"') {
        field += '"';
        i++;
      } else {
        quote = !quote;
      }

    } else if (c === ',' && !quote) {

      row.push(field);
      field = '';

    } else if (
      (c === '\n' || c === '\r') &&
      !quote
    ) {

      if (c === '\r' && csv[i + 1] === '\n') i++;

      row.push(field);

      if (row.some(x => x.trim())) {
        rows.push(row);
      }

      row = [];
      field = '';

    } else {

      field += c;

    }

  }

  row.push(field);

  if (row.some(x => x.trim())) {
    rows.push(row);
  }

  const heads = (rows.shift() || [])
    .map(x => norm(x.trim()));

  return rows.map(r =>
    Object.fromEntries(
      heads.map((h, i) => [h, r[i] || ''])
    )
  );

}


// =============================================
// CARREGAMENTO DA BASE ORIGINAL
// =============================================

async function init() {

  try {

    const url = window.CENTRAL_CONFIG?.csvUrl?.trim();

    const dataUrl = url || new URL(
      './dados.json',
      document.baseURI
    ).href;

    const response = await fetch(
      dataUrl,
      { cache: 'no-store' }
    );

    if (!response.ok) {

      throw new Error(
        'Erro ao acessar a base: HTTP ' +
        response.status +
        ' — ' + dataUrl
      );

    }

    let raw;

    if (url) {

      const csv = await response.text();
      raw = csvParse(csv);

    } else {

      const content = (await response.text())
        .replace(/^\uFEFF/, '')
        .trim();

      try {

        raw = JSON.parse(content);

      } catch (parseError) {

        console.error(
          'Conteúdo recebido de dados.json:',
          content.slice(0, 300)
        );

        throw new Error(
          'O dados.json não contém JSON válido. ' +
          'Verifique o arquivo publicado no GitHub. ' +
          parseError.message
        );

      }

    }

    if (!Array.isArray(raw)) {

      throw new Error(
        'A base precisa ser uma lista de perguntas entre colchetes [ ].'
      );

    }

    records = raw
      .map(clean)
      .filter(r => r.pergunta);

    if (!records.length) {
      throw new Error('Base de perguntas vazia.');
    }

    renderCats();
    render();

    route();

    $('notice').hidden = true;

  } catch (error) {

    console.error('Erro ao carregar a Central:', error);

    $('notice').hidden = false;

    $('notice').textContent =
      'Não foi possível carregar as perguntas. Detalhe: ' +
      error.message;

  }

}


// =============================================
// SUGESTÕES AUTOMÁTICAS DA PESQUISA ORIGINAL
// =============================================

const searchInput = $('search');
const searchBox = searchInput.closest('.search');

const suggestionBox = document.createElement('div');

suggestionBox.id = 'suggestions';
suggestionBox.className = 'suggestions';
suggestionBox.setAttribute('role', 'listbox');
suggestionBox.hidden = true;

searchBox.appendChild(suggestionBox);

function renderSuggestions(value) {

  suggestionBox.replaceChildren();

  const query = norm(value);

  if (query.length < 2) {
    suggestionBox.hidden = true;
    return;
  }

  const words = query.split(/\s+/).filter(Boolean);

  const matches = records
    .filter(r => {

      const searchable = norm([
        r.pergunta,
        r.palavras,
        r.resposta,
        r.categoria
      ].join(' '));

      return words.every(word =>
        searchable.includes(word)
      );

    })
    .slice(0, 6);

  if (!matches.length) {
    suggestionBox.hidden = true;
    return;
  }

  matches.forEach(r => {

    const button = document.createElement('button');

    button.type = 'button';
    button.className = 'suggestion-item';
    button.setAttribute('role', 'option');

    const title = document.createElement('strong');
    title.textContent = r.pergunta;

    const meta = document.createElement('small');
    meta.textContent = r.categoria;

    button.append(title, meta);

    button.addEventListener('click', () => {

      suggestionBox.hidden = true;

      searchInput.value = r.pergunta;

      term = r.pergunta;
      category = 'Todas';

      location.hash =
        'duvida/' + encodeURIComponent(r.id);

    });

    suggestionBox.append(button);

  });

  suggestionBox.hidden = false;

}


// =============================================
// EVENTOS DA PESQUISA ORIGINAL
// =============================================

searchInput.addEventListener('input', e => {

  term = e.target.value;
  category = 'Todas';

  if (!$('gmmb-guide').hidden) {
    location.hash = 'perguntas';
  }

  render();
  renderSuggestions(term);

  if (!$('detail').hidden) {
    location.hash = 'perguntas';
  }

});

searchInput.addEventListener('keydown', e => {

  if (e.key === 'Escape') {
    suggestionBox.hidden = true;
  }

});

document.addEventListener('click', e => {

  if (!searchBox.contains(e.target)) {
    suggestionBox.hidden = true;
  }

});


// =============================================
// EVENTOS DE NAVEGAÇÃO
// =============================================

$('all').onclick = () => select('Todas');

$('back').onclick = () => {
  location.hash = 'perguntas';
};


// Pesquisa da nova seção de alocação

const allocationSearchInput = $('allocation-search');

if (allocationSearchInput) {

  allocationSearchInput.addEventListener(
    'input',
    renderAllocation
  );

}


// Navegação por hash

window.addEventListener('hashchange', route);


// Atalho de teclado para a busca original

window.addEventListener('keydown', e => {

  if (
    e.key === '/' &&
    !['INPUT', 'TEXTAREA'].includes(
      document.activeElement.tagName
    )
  ) {

    e.preventDefault();

    $('search').focus();

  }

});


// Inicialização da Central

init();
