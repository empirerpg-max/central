const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec"; 

window.onload = () => {
    buildMenu();
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const p = params.get('p');
    
    if (window.location.pathname.includes('index') || document.getElementById('sp-list')) {
        loadRealTime();
    } else if (tab) {
        initChart(tab, params.get('style'));
    } else if (p) {
        initMonthly(p);
    } else {
        loadHOFList();
    }
};

function buildMenu() {
    const navMenu = document.getElementById('menu-nav');
    if(!navMenu) return;
    navMenu.innerHTML = `
    <a href="index.html" class="menu-item">Início</a>
    <div class="menu-item" onclick="window.location.href='artists.html'">🌟 Artists</div>
    <div class="menu-item">Hot 100
        <div class="submenu"><a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn">Billboard Hot 100</a><a href="charts.html?tab=BILLBOARD HOT 100&style=true" class="sub-btn">Hot 100 by Style</a></div>
    </div>
    <div class="menu-item" style="color:var(--spotify)">Spotify
        <div class="submenu"><a href="charts.html?tab=SPOTIFY" class="sub-btn">Global Charts</a><a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn">By Country</a><a href="monthly.html?p=SPOTIFY" class="sub-btn">Monthly Artists</a></div>
    </div>
    <div class="menu-item" style="color:var(--apple)">Apple Music
        <div class="submenu"><a href="charts.html?tab=APPLE MUSIC" class="sub-btn">Global Charts</a><a href="countries.html?tab=APPLE MUSIC COUNTRIES" class="sub-btn">By Country</a><a href="monthly.html?p=APPLE MUSIC" class="sub-btn">Monthly Artists</a></div>
    </div>
    <div class="menu-item" style="color:var(--youtube)">YouTube
        <div class="submenu"><a href="charts.html?tab=YOUTUBE" class="sub-btn">Global Charts</a><a href="countries.html?tab=YOUTUBE COUNTRIES" class="sub-btn">By Country</a><a href="monthly.html?p=YOUTUBE" class="sub-btn">Monthly Artists</a></div>
    </div>
    <div class="menu-item">Albums
        <div class="submenu"><a href="charts.html?tab=DADOS ÁLBUNS" class="sub-btn">Billboard 200</a><a href="charts.html?tab=DADOS ÁLBUNS&style=true" class="sub-btn">Albums by Style</a></div>
    </div>
    <a href="charts.html?tab=DIGITAL SALES" class="menu-item">Sales</a>`;
}

// === REAL TIME (RESTAURADO) ===
async function loadRealTime() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    const d = await fetch(API + "?action=getRealTime").then(r => r.json());
    const row = (l, c) => l.map(i => `
        <div class="chart-row" style="grid-template-columns: 30px 45px 1fr 80px;">
            <div class="rank" style="color:#222;">${i.posicao}</div>
            <img src="${i.capa}">
            <div style="padding-left:10px;"><b style="font-size:12px; color:#fff;">${i.titulo}</b></div>
            <div style="color:${c}; font-weight:800; font-size:11px; text-align:right;">${i.streams}</div>
        </div>`).join('');
    app.innerHTML = `<div class="rt-grid">
        <div class="rt-col"><div class="rt-head" style="color:var(--spotify);">Spotify</div>${row(d.spotify, 'var(--spotify)')}</div>
        <div class="rt-col"><div class="rt-head" style="color:var(--apple);">Apple Music</div>${row(d.apple, 'var(--apple)')}</div>
        <div class="rt-col"><div class="rt-head" style="color:#fff; opacity:0.6;">YouTube</div>${row(d.youtube, '#fff')}</div>
    </div>`;
}

// === DIRETÓRIO (5 POR LINHA + PAÍS/ESTILO) ===
async function loadHOFList() {
    const app = document.getElementById('app');
    const list = await fetch(API + "?action=getHOFList").then(r => r.json());
    let h = `<h2 style="text-align:center; font-family:'Plus Jakarta Sans'; font-weight:800; letter-spacing:6px; margin-bottom:40px;">ARTISTS DIRECTORY</h2><div class="hof-grid">`;
    list.forEach(a => {
        const meta = a.country ? `${a.country} • ${a.style}` : a.style;
        h += `<div class="hof-card" onclick="loadHOFProfile('${a.name}')">
            <img src="${a.img}" onerror="this.src='https://via.placeholder.com/150'">
            <h3 style="font-size:13px; color:#fff; margin:0; font-weight:700;">${a.name}</h3>
            <p class="hof-meta">${meta}</p>
        </div>`;
    });
    app.innerHTML = h + `</div>`;
}

// === CHARTS GERAIS (VARIÁVEIS DO DOCX) ===
async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
    app.innerHTML = `<h2 style="text-align:center; margin-bottom:30px;">${tab}</h2>
        <div class="pill-container">${f.dates.map((d, i) => `<div class="pill date-pill ${i===0?'active':''}" onclick="updateChart(this, '${tab}', '${d}')">${d}</div>`).join('')}</div>
        <div id="chart-area"></div>`;
    updateChart(null, tab, f.dates[0]);
}

async function updateChart(el, tab, date) {
    if(el) { document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active')); el.classList.add('active'); }
    const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}`).then(r => r.json());
    const area = document.getElementById('chart-area');
    area.innerHTML = res.map(i => {
        let label = tab.includes('YOUTUBE') ? 'VIEWS' : (tab.includes('BILLBOARD') ? 'PTS' : (tab.includes('ÁLBUNS') ? 'UNIDADES' : 'STREAMS'));
        return `<div class="chart-row">
            <div class="rank" style="font-size:24px;">${i.posicao}</div>
            <img src="${i.capa}">
            <div style="padding-left:15px;"><b>${i.musica || i.album}</b><br><span style="color:#666; font-size:12px;">${i.artista}</span></div>
            <div style="text-align:right;"><b style="color:#fff;">${i.semana} ${label}</b><br><small style="color:#444; font-size:10px;">TOTAL: ${i.total || '-'}</small></div>
        </div>`;
    }).join('');
}
