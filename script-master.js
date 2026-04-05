const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec"; 

function buildMenu() {
    const navMenu = document.getElementById('menu-nav');
    if(!navMenu) return;
    navMenu.innerHTML = `
    <a href="index.html" class="menu-item">Início</a>
    <div class="menu-item" onclick="loadHOFList()">🌟 Artists</div>
    <div class="menu-item">Hot 100
        <div class="submenu"><a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn">Billboard Hot 100</a><a href="charts.html?tab=BILLBOARD HOT 100&style=true" class="sub-btn">Hot 100 by Style</a></div>
    </div>
    <div class="menu-item">Spotify
        <div class="submenu"><a href="charts.html?tab=SPOTIFY" class="sub-btn">Global Charts</a><a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn">By Country</a><a href="monthly.html?p=SPOTIFY" class="sub-btn">Monthly Artists</a></div>
    </div>
    <div class="menu-item">Apple Music
        <div class="submenu"><a href="charts.html?tab=APPLE MUSIC" class="sub-btn">Global Charts</a><a href="countries.html?tab=APPLE MUSIC COUNTRIES" class="sub-btn">By Country</a><a href="monthly.html?p=APPLE MUSIC" class="sub-btn">Monthly Artists</a></div>
    </div>
    <div class="menu-item">YouTube
        <div class="submenu"><a href="charts.html?tab=YOUTUBE" class="sub-btn">Global Charts</a><a href="countries.html?tab=YOUTUBE COUNTRIES" class="sub-btn">By Country</a><a href="monthly.html?p=YOUTUBE" class="sub-btn">Monthly Artists</a></div>
    </div>
    <div class="menu-item">Albums
        <div class="submenu"><a href="charts.html?tab=DADOS ÁLBUNS" class="sub-btn">Billboard 200</a><a href="charts.html?tab=DADOS ÁLBUNS&style=true" class="sub-btn">Albums by Style</a></div>
    </div>
    <a href="charts.html?tab=DIGITAL SALES" class="menu-item">Sales</a>`;
}

// === LISTAGEM ARTISTAS (5 POR LINHA + META PAÍS/ESTILO) ===
async function loadHOFList() {
    const app = document.getElementById('app');
    app.innerHTML = '<p style="text-align:center;">Carregando Diretório...</p>';
    document.body.className = '';
    try {
        const list = await fetch(API + "?action=getHOFList").then(r => r.json());
        let h = `<h2 style="text-align:center; font-family:'Plus Jakarta Sans'; letter-spacing:6px; margin-bottom:40px;">ARTISTS DIRECTORY</h2><div class="hof-grid">`;
        list.forEach(a => {
            // Se houver país, exibe "Brasil • R&B", senão exibe apenas "R&B"
            const meta = a.country ? `${a.country} • ${a.style}` : a.style;
            h += `<div class="hof-card" onclick="loadHOFProfile('${a.name}')">
                <img src="${a.img}" onerror="this.src='https://via.placeholder.com/150'">
                <h3>${a.name}</h3>
                <p class="hof-meta">${meta}</p>
            </div>`;
        });
        app.innerHTML = h + `</div>`;
    } catch(e) { app.innerHTML = "Erro ao carregar artistas."; }
}

// === CHARTS GERAIS (LÓGICA DOCX) ===
async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    applyChartTheme(tab);
    app.innerHTML = '<p style="text-align:center;">Sincronizando...</p>';
    try {
        const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
        let h = `<div class="controls"><select id="dateSelect" onchange="updateChartData(this.value, '${tab}', ${hasStyle})">${f.dates.map(d => `<option value="${d}">${d}</option>`).join('')}</select>`;
        if(hasStyle) h += `<select id="styleSelect" onchange="applyGenreFilter()"><option value="ALL">TODOS OS ESTILOS</option></select>`; [cite: 325]
        h += `</div><div id="chart-area"></div>`;
        app.innerHTML = h;
        updateChartData(f.dates[0], tab, hasStyle);
    } catch(e) { console.error(e); }
}

let chartCache = [];
async function updateChartData(date, tab, hasStyle) {
    const area = document.getElementById('chart-area');
    area.innerHTML = '<p style="text-align:center;">Buscando dados...</p>';
    const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}`).then(r => r.json());
    chartCache = res; [cite: 349]
    if(hasStyle) {
        const styles = [...new Set(res.map(i => i.estilo))].filter(s => s).sort(); [cite: 358]
        const sSel = document.getElementById('styleSelect');
        sSel.innerHTML = '<option value="ALL">TODOS OS ESTILOS</option>' + styles.map(s => `<option value="${s}">${s}</option>`).join('');
    }
    renderRows(res, tab);
}

function applyGenreFilter() {
    const genre = document.getElementById('styleSelect').value;
    const filtered = genre === "ALL" ? chartCache : chartCache.filter(i => i.estilo === genre); [cite: 372]
    renderRows(filtered, "Gênero");
}

function renderRows(data, tab) {
    const area = document.getElementById('chart-area');
    area.innerHTML = data.map((i, idx) => {
        // Mapeamento correto de variáveis conforme DOCX [cite: 41, 146, 260, 910]
        let val = i.semana || i.streams || "0"; 
        let label = tab.includes('YOUTUBE') ? 'VIEWS' : (tab.includes('BILLBOARD') ? 'PTS' : (tab.includes('ÁLBUNS') ? 'UNIDADES' : ''));
        return `<div class="row">
            <div class="rank-box"><span class="rank">${i.posicao}</span></div>
            <img src="${i.capa}" class="cover">
            <div class="info"><span class="title">${i.musica}</span><span class="artist">${i.artista}</span></div>
            <div class="stats"><span class="title" style="font-size:14px;">${val} ${label}</span><span class="artist">Total: ${i.total || '-'}</span></div>
        </div>`;
    }).join('');
}

// === REAL TIME (NÃO MEXER!) === [cite: 1252-1299]
async function loadRealTime() {
    const app = document.getElementById('app');
    app.innerHTML = '<p style="text-align:center;">Live Previews...</p>';
    document.body.className = '';
    try {
        const d = await fetch(API + "?action=getRealTime").then(r => r.json());
        const row = (l, colorClass) => l.map(i => `
            <div class="rt-item"><div class="rank">${i.posicao}</div><img src="${i.capa}"><div class="info"><span class="title">${i.titulo}</span></div><div class="stats ${colorClass}" style="font-weight:700;">${i.streams}</div></div>`).join('');
        app.innerHTML = `<div class="rt-grid">
            <div class="rt-col"><div class="rt-head" style="background:var(--spotify); color:black;">Spotify</div>${row(d.spotify, 'text-spotify')}</div>
            <div class="rt-col"><div class="rt-head" style="background:#fff; color:var(--apple);">Apple Music</div>${row(d.apple, 'text-apple')}</div>
            <div class="rt-col"><div class="rt-head" style="background:var(--youtube);">YouTube</div>${row(d.youtube, '')}</div>
        </div>`;
    } catch(e) { app.innerHTML = "Erro RealTime."; }
}

function applyChartTheme(tab) {
    const b = document.body; b.className = '';
    if(tab.includes('BILLBOARD')) b.classList.add('theme-billboard');
    else if(tab.includes('SPOTIFY')) b.classList.add('theme-spotify');
    else if(tab.includes('APPLE')) b.classList.add('theme-apple');
    else if(tab.includes('YOUTUBE')) b.classList.add('theme-youtube');
}
