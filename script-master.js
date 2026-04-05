// LINK REAL DA TUA API RESTAURADO - NADA DE PLACEHOLDERS
const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec"; 

window.onload = () => {
    buildMenu();
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const p = params.get('p');
    
    // Roteador corrigido
    if (window.location.pathname.includes('artists.html')) {
        loadHOFList();
    } else if (tab) {
        initChart(tab, params.get('style'));
    } else if (p) {
        initMonthly(p);
    } else {
        loadRealTime();
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

// === DIRETÓRIO (5 POR LINHA + PAÍS E ESTILO) ===
async function loadHOFList() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    document.body.className = '';
    const list = await fetch(API + "?action=getHOFList").then(r => r.json());
    let h = `<h2 style="text-align:center; font-family:'Plus Jakarta Sans'; font-weight:800; letter-spacing:6px; margin-bottom:40px;">DIRECTORY</h2><div class="hof-grid">`;
    list.forEach(a => {
        const meta = a.country ? `${a.country} • ${a.style}` : a.style;
        h += `<div class="hof-card" onclick="loadHOFProfile('${a.name}')">
            <img src="${a.img}" onerror="this.src='https://via.placeholder.com/150'">
            <h3>${a.name}</h3><p class="hof-meta">${meta}</p>
        </div>`;
    });
    app.innerHTML = h + `</div>`;
}

// === REAL TIME (BLINDADO CONTRA UNDEFINED) ===
async function loadRealTime() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    document.body.className = '';
    const d = await fetch(API + "?action=getRealTime").then(r => r.json());
    
    const row = (l, c) => l.map(i => {
        const pos = i.posicao || i.pos || i.p || "-";
        const cover = i.capa || i.c || "https://via.placeholder.com/45";
        const title = i.titulo || i.musica || i.tit || i.t || "-";
        const val = i.streams || i.semana || i.val || i.s || "-";
        return `<div class="chart-row" style="grid-template-columns: 35px 45px 1fr 90px; padding:10px; border-bottom:1px solid #1a1a1a;">
            <div class="rank" style="font-size:14px;">${pos}</div><img src="${cover}">
            <div style="padding-left:10px;"><b style="font-size:12px;">${title}</b></div>
            <div style="color:${c}; font-weight:800; font-size:12px; text-align:right;">${val}</div>
        </div>`;
    }).join('');

    app.innerHTML = `
        <h2 style="text-align:center; font-family:'Plus Jakarta Sans'; margin-bottom:30px;">LIVE PREVIEWS</h2>
        <div class="rt-grid">
            <div class="rt-col"><div class="rt-head" style="color:var(--spotify);">Spotify</div>${row(d.spotify, 'var(--spotify)')}</div>
            <div class="rt-col"><div class="rt-head" style="color:var(--apple);">Apple Music</div>${row(d.apple, 'var(--apple)')}</div>
            <div class="rt-col"><div class="rt-head" style="color:#fff;">YouTube</div>${row(d.youtube, '#fff')}</div>
        </div>`;
}

// === CHARTS GERAIS (BLINDADO CONTRA UNDEFINED) ===
let chartCache = [];
async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    applyChartTheme(tab);
    app.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
    
    let h = `<h2 style="text-align:center; text-transform:uppercase; margin-bottom:30px; letter-spacing:2px; font-weight:900;">${tab}</h2>
        <div class="filter-group">
            <div class="pill-container" id="date-pills">${f.dates.map((d, i) => `<div class="pill date-pill ${i===0?'active':''}" onclick="updateChart(this, '${tab}', '${d}', ${hasStyle})">${d}</div>`).join('')}</div>`;
    if(hasStyle) {
        h += `<div class="pill-container" id="style-pills"><div class="pill style-pill active" onclick="applyGenre('ALL')">TODOS OS ESTILOS</div></div>`;
    }
    h += `</div><div id="chart-area"></div>`;
    app.innerHTML = h;
    updateChart(null, tab, f.dates[0], hasStyle);
}

async function updateChart(el, tab, date, hasStyle) {
    if(el) { document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active')); el.classList.add('active'); }
    const area = document.getElementById('chart-area');
    area.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}`).then(r => r.json());
    chartCache = res;

    if(hasStyle) {
        const styles = [...new Set(res.map(i => i.estilo || i.style))].filter(s => s).sort();
        const sContainer = document.getElementById('style-pills');
        sContainer.innerHTML = `<div class="pill style-pill active" onclick="applyGenre('ALL')">TODOS OS ESTILOS</div>` + 
            styles.map(s => `<div class="pill style-pill" onclick="applyGenre('${s}')">${s}</div>`).join('');
    }
    renderRows(res, tab);
}

function applyGenre(genre) {
    document.querySelectorAll('.style-pill').forEach(p => p.classList.remove('active'));
    event.target.classList.add('active');
    const filtered = genre === 'ALL' ? chartCache : chartCache.filter(i => (i.estilo || i.style) === genre);
    renderRows(filtered, document.querySelector('h2').innerText);
}

function renderRows(data, tab) {
    const area = document.getElementById('chart-area');
    const isBB = tab.includes('BILLBOARD');
    const isYT = tab.includes('YOUTUBE');
    
    area.innerHTML = data.map(i => {
        // LEITURA À PROVA DE FALHAS
        const pos = i.posicao || i.pos || i.p || "-";
        const cover = i.capa || i.c || "https://via.placeholder.com/45";
        const title = i.musica || i.titulo || i.album || i.tit || i.t || "-";
        const artist = i.artista || i.art || i.a || "";
        const val = i.semana || i.streams || i.pontos || i.vendas || i.val || i.s || "0";
        const st = i.status || i.st || "=";

        let stClass = st == '↑' ? 'up' : (st == '↓' ? 'down' : (st == 'NEW' ? 'new' : ''));
        let stIcon = st == '↑' ? '▲' : (st == '↓' ? '▼' : (st == 'NEW' ? 'NEW' : '='));
        let label = isYT ? 'VIEWS' : (isBB ? 'PTS' : (tab.includes('ÁLBUNS') ? 'UNIDADES' : ''));
        
        return `<div class="chart-row">
            <div><div class="rank">${pos}</div><div class="st-tag ${stClass}">${stIcon}</div></div>
            <img src="${cover}">
            <div style="padding-left:15px; overflow:hidden;">
                <b style="font-size:16px; white-space:nowrap; text-transform:${isBB ? 'uppercase' : 'none'};">${title}</b>
                <br><span style="color:#888; font-size:13px;">${artist}</span>
            </div>
            <div style="text-align:right;"><b style="font-size:16px;">${val} ${label}</b></div>
        </div>`;
    }).join('');
}

// === MONTHLY (MANTIDO O EDITORIAL LIMPO E BLINDADO) ===
async function initMonthly(p) {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="filter-group"><div id="year-pills" class="pill-container"></div><div id="month-pills" class="pill-container"></div><div style="text-align:center;"><select id="aS" onchange="renderM('${p}')" style="padding:10px; border-radius:10px; background:#111; color:#fff; border:1px solid #333; display:none; outline:none;"></select></div></div><div id="profile-area"></div>`;
    const years = await fetch(`${API}?action=getMonthlyYears`).then(r => r.json());
    document.getElementById('year-pills').innerHTML = years.map(y => `<div class="pill year-pill" onclick="handleYearClick(this, '${y}', '${p}')">${y}</div>`).join('');
    applyChartTheme(p);
}

async function handleYearClick(el, year, p) {
    document.querySelectorAll('.year-pill').forEach(b => b.classList.remove('active')); el.classList.add('active');
    const months = await fetch(`${API}?action=getMonthlyDates&year=${year}`).then(r => r.json());
    document.getElementById('month-pills').innerHTML = months.map(m => `<div class="pill month-pill" onclick="handleMonthClick(this, '${m}', '${year}', '${p}')">${m}</div>`).join('');
}

async function handleMonthClick(el, month, year, p) {
    document.querySelectorAll('.month-pill').forEach(b => b.classList.remove('active')); el.classList.add('active');
    document.getElementById('aS').style.display = 'inline-block';
    const artists = await fetch(`${API}?action=getArtists&platform=${p}&month=${month}&year=${year}`).then(r => r.json());
    document.getElementById('aS').innerHTML = `<option value="">SELECT ARTIST</option>` + artists.map(a => `<option value="${a}">${a}</option>`).join('');
}

async function renderM(p) {
    const profile = document.getElementById('profile-area');
    const a = document.getElementById('aS').value;
    const y = document.querySelector('.year-pill.active').innerText;
    const m = document.querySelector('.month-pill.active').innerText;
    if(!a) return;
    profile.innerHTML = '<div class="skeleton" style="height:400px;"></div>';
    const data = await fetch(`${API}?action=getMonthlyStats&platform=${p}&month=${m}&year=${y}&artist=${a}`).then(r => r.json());
    const art = data[0];

    // Identidade Visual Exigida
    if (p.includes('SPOTIFY')) {
        profile.innerHTML = `<div class="sp-banner" style="background-image: url('${art.capaArtista || art.capa}')"><div style="position:relative; z-index:2;">
            <h1 style="font-size:80px; font-weight:900; margin:0; letter-spacing:-4px; text-transform:uppercase;">${a}</h1>
            <p style="font-weight:700; font-size:18px; margin-top:5px;">${art.totalOuvintes || art.ov} ouvintes mensais</p></div></div>
            <div style="display:grid; grid-template-columns: 2fr 1fr; gap:40px; max-width:1100px; margin:0 auto;">
            <div><h3 style="font-size:20px; margin-bottom:20px;">Populares</h3>${(art.musicas || art.m).map((mus,i) => `<div class="chart-row" style="grid-template-columns: 30px 60px 1fr 100px;"><span style="color:#b3b3b3; font-weight:700;">${i+1}</span><img src="${mus.capaMusica || mus.c}"><b>${mus.titulo || mus.t}</b><span style="text-align:right; color:#b3b3b3;">${mus.streams || mus.s}</span></div>`).join('')}</div>
            <div><h3 style="font-size:20px; margin-bottom:20px;">Sobre</h3><div style="background:#181818; padding:25px; border-radius:8px; color:#aaa; line-height:1.6;">${art.sobre || art.bio}</div></div></div>`;
    } else if (p.includes('APPLE')) {
        profile.innerHTML = `<div class="am-profile-header"><img src="${art.capaArtista || art.capa}" class="am-artist-img"><div style="padding-left:45px;">
            <h1 style="font-size:56px; font-weight:900; margin:0;">${a}</h1>
            <div style="color:var(--apple); font-weight:700; font-size:20px; margin-top:8px;">${art.totalOuvintes || art.ov} ouvintes mensais</div></div></div>
            <div style="display:grid; grid-template-columns: 1fr 300px; gap:50px;">
            <div><h3 style="border-bottom:1px solid #eee; padding-bottom:10px;">Top Songs</h3>${(art.musicas || art.m).slice(0,5).map(mus => `<div class="chart-row" style="grid-template-columns: 60px 1fr 100px; padding:15px 0;"><img src="${mus.capaMusica || mus.c}"><b>${mus.titulo || mus.t}</b><span style="text-align:right; color:#8e8e93;">${mus.streams || mus.s}</span></div>`).join('')}</div>
            <div><h3 style="border-bottom:1px solid #eee; padding-bottom:10px;">Sobre</h3><div style="color:#444; line-height:1.6;">${art.sobre || art.bio}</div></div></div>`;
    } else if (p.includes('YOUTUBE')) {
        profile.innerHTML = `<div class="yt-banner" style="background-image: url('${art.capaArtista || art.capa}')"></div>
            <div style="display:flex; align-items:center; padding:20px 0 40px 0;"><img src="${art.capaArtista || art.capa}" class="yt-avatar">
            <div style="padding-left:30px;"><h2 style="font-size:36px; margin:0;">${a}</h2><div style="color:#aaa;">${art.totalOuvintes || art.ov} visualizações mensais</div></div></div>
            <div style="display:grid; grid-template-columns: 2fr 1fr; gap:40px;">
            <div><h4 style="border-left:3px solid var(--youtube); padding-left:10px;">VÍDEOS POPULARES</h4>${(art.musicas || art.m).slice(0,5).map(mus => `<div style="display:flex; gap:15px; margin-bottom:20px;"><img src="${mus.capaMusica || mus.c}" style="width:180px; height:101px; object-fit:cover; border-radius:12px;"><div><b style="display:block; font-size:16px;">${mus.titulo || mus.t}</b><span style="color:#aaa; font-size:13px;">${mus.streams || mus.s} views</span></div></div>`).join('')}</div>
            <div><h4 style="border-left:3px solid var(--youtube); padding-left:10px;">INFORMAÇÕES</h4><div style="background:#0f0f0f; padding:20px; border-radius:12px; color:#aaa; line-height:1.6;">${art.sobre || art.bio}</div></div></div>`;
    }
}

function applyChartTheme(tab) {
    const b = document.body; b.className = '';
    if(tab.includes('BILLBOARD')) b.classList.add('theme-billboard');
    else if(tab.includes('SPOTIFY')) b.classList.add('theme-spotify');
    else if(tab.includes('APPLE')) b.classList.add('theme-apple');
    else if(tab.includes('YOUTUBE')) b.classList.add('theme-youtube');
}
