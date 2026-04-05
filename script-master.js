// ============================================================
// EMPIRE CHARTS — script-master.js
// ============================================================

const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec";

// ============================================================
// PERFORMANCE: Cache local em memória (evita refetch repetido)
// ============================================================
const _cache = {};
async function fetchCached(url) {
  if (_cache[url]) return _cache[url];
  const data = await fetch(url).then(r => r.json());
  _cache[url] = data;
  return data;
}

// ============================================================
// MENU
// ============================================================
function buildMenu() {
  const navMenu = document.getElementById('menu-nav');
  if (!navMenu) return;
  navMenu.innerHTML = `
    <a href="index.html" class="menu-item">Início</a>
    <div class="menu-item" onclick="window.location.href='artists.html'">🌟 Artists</div>
    <div class="menu-item">Hot 100
      <div class="submenu">
        <a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn">Billboard Hot 100</a>
        <a href="charts.html?tab=BILLBOARD HOT 100&style=true" class="sub-btn">Hot 100 by Style</a>
      </div>
    </div>
    <div class="menu-item" style="color:var(--spotify)">Spotify
      <div class="submenu">
        <a href="charts.html?tab=SPOTIFY" class="sub-btn">Global Charts</a>
        <a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn">By Country</a>
        <a href="monthly.html?p=SPOTIFY" class="sub-btn">Monthly Artists</a>
      </div>
    </div>
    <div class="menu-item" style="color:var(--apple)">Apple Music
      <div class="submenu">
        <a href="charts.html?tab=APPLE MUSIC" class="sub-btn">Global Charts</a>
        <a href="countries.html?tab=APPLE MUSIC COUNTRIES" class="sub-btn">By Country</a>
        <a href="monthly.html?p=APPLE MUSIC" class="sub-btn">Monthly Artists</a>
      </div>
    </div>
    <div class="menu-item" style="color:var(--youtube)">YouTube
      <div class="submenu">
        <a href="charts.html?tab=YOUTUBE" class="sub-btn">Global Charts</a>
        <a href="countries.html?tab=YOUTUBE COUNTRIES" class="sub-btn">By Country</a>
        <a href="monthly.html?p=YOUTUBE" class="sub-btn">Monthly Artists</a>
      </div>
    </div>
    <div class="menu-item">Albums
      <div class="submenu">
        <a href="charts.html?tab=DADOS ÁLBUNS" class="sub-btn">Billboard 200</a>
        <a href="charts.html?tab=DADOS ÁLBUNS&style=true" class="sub-btn">Albums by Style</a>
      </div>
    </div>
    <a href="charts.html?tab=DIGITAL SALES" class="menu-item">Sales</a>`;
}

// ============================================================
// DIRETÓRIO DE ARTISTAS
// ============================================================
async function loadHOFList() {
  const app = document.getElementById('app');
  document.body.className = '';
  app.innerHTML = '<div class="skeleton"></div>'.repeat(5);

  const list = await fetchCached(API + "?action=getHOFList");

  // Coleta países e estilos únicos para os filtros
  const countries = [...new Set(list.map(a => a.country).filter(Boolean))].sort();
  const styles = [...new Set(list.map(a => a.style).filter(Boolean))].sort();

  let h = `
    <h2 style="text-align:center;font-family:'Plus Jakarta Sans';font-weight:800;letter-spacing:6px;margin-bottom:24px;">DIRECTORY</h2>
    <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:30px;align-items:center;">
      <input id="hof-search" type="text" placeholder="🔍  Buscar artista..." oninput="filterHOF()"
        style="padding:10px 18px;border-radius:50px;border:1px solid #333;background:#111;color:#fff;font-size:13px;outline:none;min-width:220px;">
      <select id="hof-country" onchange="filterHOF()"
        style="padding:10px 18px;border-radius:50px;border:1px solid #333;background:#111;color:#aaa;font-size:12px;outline:none;cursor:pointer;">
        <option value="">🌍 Todos os países</option>
        ${countries.map(c => `<option value="${c}">${c}</option>`).join('')}
      </select>
      <select id="hof-style" onchange="filterHOF()"
        style="padding:10px 18px;border-radius:50px;border:1px solid #333;background:#111;color:#aaa;font-size:12px;outline:none;cursor:pointer;">
        <option value="">🎵 Todos os estilos</option>
        ${styles.map(s => `<option value="${s}">${s}</option>`).join('')}
      </select>
    </div>
    <div id="hof-count" style="text-align:center;font-size:11px;color:#555;letter-spacing:2px;margin-bottom:20px;">${list.length} ARTISTAS</div>
    <div id="hof-grid" class="hof-grid">`;

  list.forEach(a => {
    const meta = a.country ? `${a.country} • ${a.style}` : a.style;
    h += `<div class="hof-card" onclick="loadHOFProfile('${a.name}')"
      data-name="${a.name.toLowerCase()}"
      data-country="${(a.country || '').toLowerCase()}"
      data-style="${(a.style || '').toLowerCase()}">
      <img src="${a.img}" onerror="this.src='https://via.placeholder.com/150'">
      <h3>${a.name}</h3><p class="hof-meta">${meta}</p>
    </div>`;
  });

  app.innerHTML = h + '</div>';
}

function filterHOF() {
  const q = document.getElementById('hof-search').value.toLowerCase().trim();
  const country = document.getElementById('hof-country').value.toLowerCase();
  const style = document.getElementById('hof-style').value.toLowerCase();
  const cards = document.querySelectorAll('.hof-card');
  let visible = 0;
  cards.forEach(card => {
    const matchName = !q || card.dataset.name.includes(q);
    const matchCountry = !country || card.dataset.country === country;
    const matchStyle = !style || card.dataset.style === style;
    const show = matchName && matchCountry && matchStyle;
    card.style.display = show ? '' : 'none';
    if (show) visible++;
  });
  const countEl = document.getElementById('hof-count');
  if (countEl) countEl.textContent = `${visible} ARTISTAS`;
}

// ============================================================
// PERFIL DO ARTISTA (HOF)
// ============================================================
async function loadHOFProfile(name) {
  const app = document.getElementById('app');
  app.innerHTML = '<div class="skeleton" style="height:300px;margin-bottom:10px;"></div><div class="skeleton"></div><div class="skeleton"></div>';

  const d = await fetchCached(`${API}?action=getHOFProfile&artist=${encodeURIComponent(name)}`);
  if (!d || !d.name) { app.innerHTML = '<p style="text-align:center;color:#555;">Perfil não encontrado.</p>'; return; }

  // Tabela de runs: música | plataforma | semanas no topo
  const runs = d.runs || [];

  let runsTable = '';
  if (runs.length) {
    // Ordena por semanas (decrescente)
    const sorted = [...runs].sort((a, b) => (Number(b.v) || 0) - (Number(a.v) || 0));
    const maxV = Number(sorted[0]?.v) || 1;

    runsTable = `
    <div style="margin-top:40px;max-width:700px;">
      <h3 style="font-size:12px;letter-spacing:3px;color:#555;margin-bottom:20px;text-transform:uppercase;">Semanas no Topo</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="border-bottom:1px solid #222;">
            <th style="text-align:left;font-size:10px;letter-spacing:2px;color:#444;padding:0 0 10px;font-weight:600;">MÚSICA / PERÍODO</th>
            <th style="text-align:center;font-size:10px;letter-spacing:2px;color:#444;padding:0 12px 10px;font-weight:600;">SEMANAS</th>
            <th style="text-align:left;font-size:10px;letter-spacing:2px;color:#444;padding:0 0 10px;font-weight:600;width:40%;"></th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(r => {
            const weeks = Number(r.v) || 0;
            const barW = Math.round((weeks / maxV) * 100);
            return `<tr style="border-bottom:1px solid #111;">
              <td style="padding:12px 0;font-size:14px;color:#ccc;max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${r.t}">${r.t}</td>
              <td style="padding:12px;text-align:center;font-size:16px;font-weight:900;color:var(--empire);">${weeks}</td>
              <td style="padding:12px 0;">
                <div style="background:#111;border-radius:3px;height:6px;width:100%;">
                  <div style="background:var(--empire);height:6px;border-radius:3px;width:${barW}%;opacity:0.7;"></div>
                </div>
              </td>
            </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
  }

  // Números #1
  const n1s = [
    { label: 'Hot 100', val: d.n1_hot100, color: '#fff' },
    { label: 'Spotify', val: d.n1_spotify, color: 'var(--spotify)' },
    { label: 'YouTube', val: d.n1_youtube, color: 'var(--youtube)' },
    { label: 'BB 200', val: d.n1_bb200, color: 'var(--gold)' },
  ].filter(x => x.val && x.val !== '-' && x.val !== '0' && x.val !== '');

  // Top músicas por plataforma
  const platformSection = (title, color, items) => {
    if (!items || !items.length) return '';
    return `<div>
      <h4 style="font-size:11px;letter-spacing:2px;color:${color};margin-bottom:12px;text-transform:uppercase;">${title}</h4>
      ${items.slice(0, 5).map((m, i) => `
        <div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">
          <span style="font-size:13px;color:#444;width:16px;text-align:right;">${i + 1}</span>
          <span style="font-size:13px;flex:1;color:#ccc;">${m.t}</span>
          <span style="font-size:12px;color:${color};font-weight:700;">${m.v}</span>
        </div>`).join('')}
    </div>`;
  };

  app.innerHTML = `
    <button onclick="loadHOFList()" style="background:none;border:1px solid #333;color:#888;padding:8px 18px;border-radius:50px;cursor:pointer;font-size:11px;letter-spacing:1px;margin-bottom:30px;">← VOLTAR</button>

    <!-- Cabeçalho do perfil -->
    <div style="display:flex;align-items:center;gap:30px;margin-bottom:40px;flex-wrap:wrap;">
      <img src="${d.img}" onerror="this.src='https://via.placeholder.com/150'"
        style="width:140px;height:140px;border-radius:50%;object-fit:cover;border:3px solid var(--gold);flex-shrink:0;">
      <div style="flex:1;min-width:200px;">
        <p style="font-size:11px;letter-spacing:3px;color:#555;margin:0 0 6px;text-transform:uppercase;">${d.country || ''} ${d.country && d.style ? '•' : ''} ${d.style || ''}</p>
        <h1 style="font-size:clamp(28px,5vw,52px);font-weight:900;margin:0 0 16px;letter-spacing:-1px;text-transform:uppercase;">${d.name}</h1>
        ${n1s.length ? `<div style="display:flex;gap:12px;flex-wrap:wrap;">
          ${n1s.map(x => `<div style="background:#111;border:1px solid #222;border-radius:12px;padding:10px 18px;text-align:center;">
            <div style="font-size:20px;font-weight:900;color:${x.color};">${x.val}</div>
            <div style="font-size:9px;color:#555;letter-spacing:2px;margin-top:2px;text-transform:uppercase;">${x.label} #1s</div>
          </div>`).join('')}
        </div>` : ''}
      </div>
    </div>

    <!-- Tabela de runs -->
    ${runsTable}

    <!-- Top músicas e álbuns -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:30px;margin-top:40px;">
      ${platformSection('Spotify', 'var(--spotify)', d.sp)}
      ${platformSection('Apple Music', 'var(--apple)', d.am)}
      ${platformSection('YouTube', 'var(--youtube)', d.yt)}
      ${platformSection('Álbuns', 'var(--gold)', d.alb)}
    </div>`;
}

// ============================================================
// REAL TIME
// ============================================================
async function loadRealTime() {
  const app = document.getElementById('app');
  app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
  document.body.className = '';
  const d = await fetchCached(API + "?action=getRealTime");

  const row = (l, c) => l.map(i => {
    const pos = i.posicao || i.pos || i.p || '-';
    const cover = i.capa || i.c || 'https://via.placeholder.com/45';
    const title = i.titulo || i.musica || i.tit || i.t || '-';
    const val = i.streams || i.semana || i.val || i.s || '-';
    return `<div class="chart-row" style="grid-template-columns:35px 45px 1fr 90px;padding:10px;border-bottom:1px solid #1a1a1a;">
      <div class="rank" style="font-size:14px;">${pos}</div>
      <img src="${cover}">
      <div style="padding-left:10px;"><b style="font-size:12px;">${title}</b></div>
      <div style="color:${c};font-weight:800;font-size:12px;text-align:right;">${val}</div>
    </div>`;
  }).join('');

  app.innerHTML = `
    <h2 style="text-align:center;font-family:'Plus Jakarta Sans';margin-bottom:30px;">LIVE PREVIEWS</h2>
    <div class="rt-grid">
      <div class="rt-col"><div class="rt-head" style="color:var(--spotify);">Spotify</div>${row(d.spotify, 'var(--spotify)')}</div>
      <div class="rt-col"><div class="rt-head" style="color:var(--apple);">Apple Music</div>${row(d.apple, 'var(--apple)')}</div>
      <div class="rt-col"><div class="rt-head" style="color:#fff;">YouTube</div>${row(d.youtube, '#fff')}</div>
    </div>`;
}

// ============================================================
// CHARTS GERAIS — com filtro de busca por artista/música
// ============================================================
let chartCache = [];

async function initChart(tab, hasStyle) {
  const app = document.getElementById('app');
  applyChartTheme(tab);
  app.innerHTML = '<div class="skeleton"></div>'.repeat(5);

  const f = await fetchCached(`${API}?action=getFilters&tab=${tab}`);

  let h = `<h2 style="text-align:center;text-transform:uppercase;margin-bottom:30px;letter-spacing:2px;font-weight:900;">${tab}</h2>
    <div class="filter-group">
      <div class="pill-container" id="date-pills">
        ${f.dates.map((d, i) => `<div class="pill date-pill ${i === 0 ? 'active' : ''}" onclick="updateChart(this,'${tab}','${d}',${hasStyle})">${d}</div>`).join('')}
      </div>
      ${hasStyle ? `<div class="pill-container" id="style-pills"><div class="pill style-pill active" onclick="applyGenre('ALL')">TODOS OS ESTILOS</div></div>` : ''}
      <div style="display:flex;gap:10px;align-items:center;max-width:600px;width:100%;">
        <input id="chart-search" type="text" placeholder="🔍  Filtrar por artista ou música..."
          oninput="applyChartSearch()"
          style="flex:1;padding:10px 18px;border-radius:50px;border:1px solid #333;background:#111;color:#fff;font-size:12px;outline:none;">
        <button onclick="document.getElementById('chart-search').value='';applyChartSearch()"
          style="padding:10px 16px;border-radius:50px;border:1px solid #333;background:none;color:#666;font-size:11px;cursor:pointer;white-space:nowrap;">Limpar</button>
      </div>
    </div>
    <div id="chart-area"></div>`;

  app.innerHTML = h;
  updateChart(null, tab, f.dates[0], hasStyle);
}

async function updateChart(el, tab, date, hasStyle) {
  if (el) {
    document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
  }
  const area = document.getElementById('chart-area');
  area.innerHTML = '<div class="skeleton"></div>'.repeat(5);

  const res = await fetchCached(`${API}?action=getChart&tab=${tab}&date=${date}`);
  chartCache = res;

  if (hasStyle) {
    const styles = [...new Set(res.map(i => i.estilo || i.style))].filter(s => s).sort();
    const sContainer = document.getElementById('style-pills');
    if (sContainer) {
      sContainer.innerHTML = `<div class="pill style-pill active" onclick="applyGenre('ALL')">TODOS OS ESTILOS</div>` +
        styles.map(s => `<div class="pill style-pill" onclick="applyGenre('${s}')">${s}</div>`).join('');
    }
  }

  // Limpa o campo de busca ao trocar de data
  const searchEl = document.getElementById('chart-search');
  if (searchEl) searchEl.value = '';

  renderRows(res, tab);
}

function applyGenre(genre) {
  document.querySelectorAll('.style-pill').forEach(p => p.classList.remove('active'));
  event.target.classList.add('active');
  const q = (document.getElementById('chart-search')?.value || '').toLowerCase().trim();
  let filtered = genre === 'ALL' ? chartCache : chartCache.filter(i => (i.estilo || i.style) === genre);
  if (q) filtered = filtered.filter(i => _matchSearch(i, q));
  renderRows(filtered, document.querySelector('h2')?.innerText || '');
}

function applyChartSearch() {
  const q = (document.getElementById('chart-search')?.value || '').toLowerCase().trim();
  const activeStyle = document.querySelector('.style-pill.active')?.innerText;
  let filtered = chartCache;
  if (activeStyle && activeStyle !== 'TODOS OS ESTILOS') {
    filtered = filtered.filter(i => (i.estilo || i.style) === activeStyle);
  }
  if (q) filtered = filtered.filter(i => _matchSearch(i, q));
  renderRows(filtered, document.querySelector('h2')?.innerText || '');
}

function _matchSearch(i, q) {
  const title = (i.musica || i.titulo || i.album || i.tit || i.t || '').toLowerCase();
  const artist = (i.artista || i.art || i.a || '').toLowerCase();
  return title.includes(q) || artist.includes(q);
}

function renderRows(data, tab) {
  const area = document.getElementById('chart-area');
  const isBB = tab.includes('BILLBOARD');
  const isYT = tab.includes('YOUTUBE');

  if (!data.length) {
    area.innerHTML = '<p style="text-align:center;color:#555;padding:40px;">Nenhum resultado encontrado.</p>';
    return;
  }

  area.innerHTML = data.map(i => {
    const pos = i.posicao || i.pos || i.p || '-';
    const cover = i.capa || i.c || 'https://via.placeholder.com/45';
    const title = i.musica || i.titulo || i.album || i.tit || i.t || '-';
    const artist = i.artista || i.art || i.a || '';
    const val = i.semana || i.streams || i.pontos || i.vendas || i.val || i.s || '0';
    const st = i.status || i.st || '=';
    const stClass = st == '↑' ? 'up' : (st == '↓' ? 'down' : (st == 'NEW' ? 'new' : ''));
    const stIcon = st == '↑' ? '▲' : (st == '↓' ? '▼' : (st == 'NEW' ? 'NEW' : '='));
    const label = isYT ? 'VIEWS' : (isBB ? 'PTS' : (tab.includes('ÁLBUNS') ? 'UNIDADES' : ''));
    return `<div class="chart-row">
      <div><div class="rank">${pos}</div><div class="st-tag ${stClass}">${stIcon}</div></div>
      <img src="${cover}">
      <div style="padding-left:15px;overflow:hidden;">
        <b style="font-size:16px;white-space:nowrap;text-transform:${isBB ? 'uppercase' : 'none'};">${title}</b>
        <br><span style="color:#888;font-size:13px;">${artist}</span>
      </div>
      <div style="text-align:right;"><b style="font-size:16px;">${val} ${label}</b></div>
    </div>`;
  }).join('');
}

// ============================================================
// COUNTRIES — implementação completa
// ============================================================
let countryCache = [];

async function initCountry(tab) {
  const app = document.getElementById('app');
  applyChartTheme(tab);
  app.innerHTML = '<div class="skeleton"></div>'.repeat(5);

  const f = await fetchCached(`${API}?action=getFilters&tab=${tab}`);

  const h = `
    <h2 style="text-align:center;text-transform:uppercase;margin-bottom:30px;letter-spacing:2px;font-weight:900;">${tab.replace(' COUNTRIES','')}: Por País</h2>
    <div class="filter-group">
      <div class="pill-container" id="date-pills">
        ${f.dates.map((d, i) => `<div class="pill date-pill ${i === 0 ? 'active' : ''}" onclick="updateCountry(this,'${tab}','${d}')">${d}</div>`).join('')}
      </div>
      <div style="display:flex;gap:10px;align-items:center;max-width:600px;width:100%;">
        <input id="country-filter" type="text" placeholder="🔍  Filtrar por país, artista ou música..."
          oninput="applyCountrySearch()"
          style="flex:1;padding:10px 18px;border-radius:50px;border:1px solid #333;background:#111;color:#fff;font-size:12px;outline:none;">
        <select id="country-select" onchange="applyCountrySearch()"
          style="padding:10px 18px;border-radius:50px;border:1px solid #333;background:#111;color:#aaa;font-size:12px;outline:none;cursor:pointer;">
          <option value="">🌍 Todos os países</option>
        </select>
      </div>
    </div>
    <div id="chart-area"></div>`;

  app.innerHTML = h;
  updateCountry(null, tab, f.dates[0]);
}

async function updateCountry(el, tab, date) {
  if (el) {
    document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
  }
  const area = document.getElementById('chart-area');
  area.innerHTML = '<div class="skeleton"></div>'.repeat(5);

  const res = await fetchCached(`${API}?action=getChart&tab=${tab}&date=${date}`);
  countryCache = res;

  // Popula o select de países
  const countrySel = document.getElementById('country-select');
  if (countrySel) {
    const countries = [...new Set(res.map(i => i.country || i.pais || i.p2 || '').filter(Boolean))].sort();
    countrySel.innerHTML = `<option value="">🌍 Todos os países</option>` +
      countries.map(c => `<option value="${c}">${c}</option>`).join('');
  }

  const searchEl = document.getElementById('country-filter');
  if (searchEl) searchEl.value = '';

  renderCountryRows(res);
}

function applyCountrySearch() {
  const q = (document.getElementById('country-filter')?.value || '').toLowerCase().trim();
  const country = (document.getElementById('country-select')?.value || '').toLowerCase();
  let filtered = countryCache;
  if (country) filtered = filtered.filter(i => (i.country || i.pais || i.p2 || '').toLowerCase() === country);
  if (q) {
    filtered = filtered.filter(i => {
      const title = (i.musica || i.titulo || i.tit || i.t || '').toLowerCase();
      const artist = (i.artista || i.art || i.a || '').toLowerCase();
      const c = (i.country || i.pais || i.p2 || '').toLowerCase();
      return title.includes(q) || artist.includes(q) || c.includes(q);
    });
  }
  renderCountryRows(filtered);
}

function renderCountryRows(data) {
  const area = document.getElementById('chart-area');
  if (!data.length) {
    area.innerHTML = '<p style="text-align:center;color:#555;padding:40px;">Nenhum resultado encontrado.</p>';
    return;
  }
  area.innerHTML = data.map(i => {
    const pos = i.posicao || i.pos || i.p || '-';
    const cover = i.capa || i.c || 'https://via.placeholder.com/45';
    const title = i.musica || i.titulo || i.tit || i.t || '-';
    const artist = i.artista || i.art || i.a || '';
    const country = i.country || i.pais || i.p2 || '';
    const val = i.semana || i.streams || i.val || i.s || '0';
    const st = i.status || i.st || '=';
    const stClass = st == '↑' ? 'up' : (st == '↓' ? 'down' : (st == 'NEW' ? 'new' : ''));
    const stIcon = st == '↑' ? '▲' : (st == '↓' ? '▼' : (st == 'NEW' ? 'NEW' : '='));
    return `<div class="chart-row" style="grid-template-columns:50px 60px 1fr 120px 100px;">
      <div><div class="rank">${pos}</div><div class="st-tag ${stClass}">${stIcon}</div></div>
      <img src="${cover}">
      <div style="padding-left:15px;overflow:hidden;">
        <b style="font-size:15px;white-space:nowrap;">${title}</b>
        <br><span style="color:#888;font-size:13px;">${artist}</span>
      </div>
      <div style="text-align:right;"><b style="font-size:15px;">${val}</b></div>
      <div style="text-align:right;font-size:11px;color:#555;letter-spacing:1px;">${country}</div>
    </div>`;
  }).join('');
}

// ============================================================
// MONTHLY
// ============================================================
async function initMonthly(p) {
  const app = document.getElementById('app');
  app.innerHTML = `<div class="filter-group">
    <div id="year-pills" class="pill-container"></div>
    <div id="month-pills" class="pill-container"></div>
    <div style="text-align:center;">
      <select id="aS" onchange="renderM('${p}')"
        style="padding:10px;border-radius:10px;background:#111;color:#fff;border:1px solid #333;display:none;outline:none;"></select>
    </div>
  </div>
  <div id="profile-area"></div>`;

  const years = await fetchCached(`${API}?action=getMonthlyYears`);
  document.getElementById('year-pills').innerHTML =
    years.map(y => `<div class="pill year-pill" onclick="handleYearClick(this,'${y}','${p}')">${y}</div>`).join('');

  applyChartTheme(p);
}

async function handleYearClick(el, year, p) {
  document.querySelectorAll('.year-pill').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  const months = await fetchCached(`${API}?action=getMonthlyDates&year=${year}`);
  document.getElementById('month-pills').innerHTML =
    months.map(m => `<div class="pill month-pill" onclick="handleMonthClick(this,'${m}','${year}','${p}')">${m}</div>`).join('');
}

async function handleMonthClick(el, month, year, p) {
  document.querySelectorAll('.month-pill').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('aS').style.display = 'inline-block';
  const artists = await fetchCached(`${API}?action=getArtists&platform=${p}&month=${month}&year=${year}`);
  document.getElementById('aS').innerHTML =
    `<option value="">SELECT ARTIST</option>` +
    artists.map(a => `<option value="${a}">${a}</option>`).join('');
}

async function renderM(p) {
  const profile = document.getElementById('profile-area');
  const a = document.getElementById('aS').value;
  const y = document.querySelector('.year-pill.active')?.innerText;
  const m = document.querySelector('.month-pill.active')?.innerText;
  if (!a) return;

  profile.innerHTML = '<div class="skeleton" style="height:400px;"></div>';
  const data = await fetchCached(`${API}?action=getMonthlyStats&platform=${p}&month=${m}&year=${y}&artist=${a}`);
  const art = data[0];

  if (p.includes('SPOTIFY')) {
    profile.innerHTML = `<div class="sp-banner" style="background-image:url('${art.capaArtista || art.capa}')"><div style="position:relative;z-index:2;">
      <h1 style="font-size:80px;font-weight:900;margin:0;letter-spacing:-4px;text-transform:uppercase;">${a}</h1>
      <p style="font-weight:700;font-size:18px;margin-top:5px;">${art.totalOuvintes || art.ov} ouvintes mensais</p>
    </div></div>
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:40px;max-width:1100px;margin:0 auto;">
      <div><h3 style="font-size:20px;margin-bottom:20px;">Populares</h3>
        ${(art.musicas || art.m).map((mus, i) => `<div class="chart-row" style="grid-template-columns:30px 60px 1fr 100px;">
          <span style="color:#b3b3b3;font-weight:700;">${i + 1}</span><img src="${mus.capaMusica || mus.c}">
          <b>${mus.titulo || mus.t}</b>
          <span style="text-align:right;color:#b3b3b3;">${mus.streams || mus.s}</span>
        </div>`).join('')}
      </div>
      <div><h3 style="font-size:20px;margin-bottom:20px;">Sobre</h3>
        <div style="background:#181818;padding:25px;border-radius:8px;color:#aaa;line-height:1.6;">${art.sobre || art.bio}</div>
      </div>
    </div>`;
  } else if (p.includes('APPLE')) {
    profile.innerHTML = `<div class="am-profile-header"><img src="${art.capaArtista || art.capa}" class="am-artist-img">
      <div style="padding-left:45px;">
        <h1 style="font-size:56px;font-weight:900;margin:0;">${a}</h1>
        <div style="color:var(--apple);font-weight:700;font-size:20px;margin-top:8px;">${art.totalOuvintes || art.ov} ouvintes mensais</div>
      </div></div>
    <div style="display:grid;grid-template-columns:1fr 300px;gap:50px;">
      <div><h3 style="border-bottom:1px solid #eee;padding-bottom:10px;">Top Songs</h3>
        ${(art.musicas || art.m).slice(0, 5).map(mus => `<div class="chart-row" style="grid-template-columns:60px 1fr 100px;padding:15px 0;">
          <img src="${mus.capaMusica || mus.c}"><b>${mus.titulo || mus.t}</b>
          <span style="text-align:right;color:#8e8e93;">${mus.streams || mus.s}</span>
        </div>`).join('')}
      </div>
      <div><h3 style="border-bottom:1px solid #eee;padding-bottom:10px;">Sobre</h3>
        <div style="color:#444;line-height:1.6;">${art.sobre || art.bio}</div>
      </div>
    </div>`;
  } else if (p.includes('YOUTUBE')) {
    profile.innerHTML = `<div class="yt-banner" style="background-image:url('${art.capaArtista || art.capa}')"></div>
    <div style="display:flex;align-items:center;padding:20px 0 40px 0;">
      <img src="${art.capaArtista || art.capa}" class="yt-avatar">
      <div style="padding-left:30px;">
        <h2 style="font-size:36px;margin:0;">${a}</h2>
        <div style="color:#aaa;">${art.totalOuvintes || art.ov} visualizações mensais</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:2fr 1fr;gap:40px;">
      <div><h4 style="border-left:3px solid var(--youtube);padding-left:10px;">VÍDEOS POPULARES</h4>
        ${(art.musicas || art.m).slice(0, 5).map(mus => `<div style="display:flex;gap:15px;margin-bottom:20px;">
          <img src="${mus.capaMusica || mus.c}" style="width:180px;height:101px;object-fit:cover;border-radius:12px;">
          <div><b style="display:block;font-size:16px;">${mus.titulo || mus.t}</b>
          <span style="color:#aaa;font-size:13px;">${mus.streams || mus.s} views</span></div>
        </div>`).join('')}
      </div>
      <div><h4 style="border-left:3px solid var(--youtube);padding-left:10px;">INFORMAÇÕES</h4>
        <div style="background:#0f0f0f;padding:20px;border-radius:12px;color:#aaa;line-height:1.6;">${art.sobre || art.bio}</div>
      </div>
    </div>`;
  }
}

// ============================================================
// TEMA
// ============================================================
function applyChartTheme(tab) {
  const b = document.body;
  b.className = '';
  if (tab.includes('BILLBOARD')) b.classList.add('theme-billboard');
  else if (tab.includes('SPOTIFY')) b.classList.add('theme-spotify');
  else if (tab.includes('APPLE')) b.classList.add('theme-apple');
  else if (tab.includes('YOUTUBE')) b.classList.add('theme-youtube');
}
