const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec"; // Use a sua URL de implantação

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
    app.innerHTML = '<div class="skeleton"></div>'.repeat(10);
    document.body.className = '';
    try {
        const list = await fetch(API + "?action=getHOFList").then(r => r.json());
        let h = `<h2 style="text-align:center; font-family:'Plus Jakarta Sans'; font-weight:800; letter-spacing:6px; margin-bottom:40px;">DIRECTORY</h2><div class="hof-grid">`;
        list.forEach(a => {
            const meta = a.country ? `${a.country} • ${a.style}` : a.style;
            h += `<div class="hof-card" onclick="loadHOFProfile('${a.name}')">
                <img src="${a.img}" onerror="this.src='https://via.placeholder.com/150'">
                <h3>${a.name}</h3>
                <p class="hof-meta">${meta}</p>
            </div>`;
        });
        app.innerHTML = h + `</div>`;
    } catch(e) { console.error(e); }
}

// === CHARTS GERAIS (IDENTIDADE VISUAL DOCX) ===
async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    applyChartTheme(tab);
    app.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    try {
        const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
        let h = `<h2 style="text-align:center; margin-bottom:30px; text-transform:uppercase; letter-spacing:3px;">${tab}</h2>`;
        h += `<div class="filter-group">
            <div class="pill-container" id="date-pills">${f.dates.map((d, i) => `<div class="pill date-pill ${i===0?'active':''}" onclick="updateChartData(this, '${tab}', '${d}', ${hasStyle})">${d}</div>`).join('')}</div>`;
        if(hasStyle) {
            h += `<div class="pill-container" id="style-pills"><div class="pill style-pill active" onclick="filterByGenre(this, 'ALL')">TODOS OS ESTILOS</div></div>`;
        }
        h += `</div><div id="chart-area"></div>`;
        app.innerHTML = h;
        updateChartData(null, tab, f.dates[0], hasStyle);
    } catch(e) { console.error(e); }
}

let chartCache = [];
async function updateChartData(el, tab, date, hasStyle) {
    if(el) { document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active')); el.classList.add('active'); }
    const area = document.getElementById('chart-area');
    area.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}`).then(r => r.json());
    chartCache = res;
    if(hasStyle) updateGenrePills(res);
    renderChartRows(res, tab);
}

function updateGenrePills(data) {
    const styles = [...new Set(data.map(i => i.estilo))].filter(s => s).sort();
    const container = document.getElementById('style-pills');
    container.innerHTML = `<div class="pill style-pill active" onclick="filterByGenre(this, 'ALL')">TODOS OS ESTILOS</div>` + 
        styles.map(s => `<div class="pill style-pill" onclick="filterByGenre(this, '${s}')">${s}</div>`).join('');
}

function filterByGenre(el, genre) {
    document.querySelectorAll('.style-pill').forEach(p => p.classList.remove('active')); el.classList.add('active');
    const filtered = genre === 'ALL' ? chartCache : chartCache.filter(i => i.estilo === genre);
    renderChartRows(filtered, document.querySelector('h2').innerText);
}

function renderChartRows(data, tab) {
    const area = document.getElementById('chart-area');
    const isBillboard = tab.includes('BILLBOARD');
    const isSpotify = tab.includes('SPOTIFY');
    const isApple = tab.includes('APPLE');
    const isYoutube = tab.includes('YOUTUBE');

    area.innerHTML = data.map((i, idx) => {
        let stClass = i.status == '↑' ? 'up' : (i.status == '↓' ? 'down' : (i.status == 'NEW' ? 'new' : ''));
        let stIcon = i.status == '↑' ? '▲' : (i.status == '↓' ? '▼' : (i.status == 'NEW' ? 'NEW' : '='));
        
        return `<div class="chart-row">
            <div class="rank-box" style="text-align:center;">
                <span class="rank">${i.posicao}</span>
                <div style="font-size:9px; font-weight:800;" class="${stClass}">${stIcon} ${i.variacao || ''}</div>
            </div>
            <img src="${i.capa}" style="border-radius:${isSpotify || isApple ? '6px' : '2px'};">
            <div style="padding-left:15px; overflow:hidden;">
                <b style="font-size:14px; display:block; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${i.musica}</b>
                <span style="font-size:12px; color:#666;">${i.artista}</span>
            </div>
            <div style="text-align:right;">
                <b class="val-week" style="font-size:14px;">${i.semana} ${isYoutube ? 'VIEWS' : (isBillboard ? 'PTS' : (tab.includes('ÁLBUNS') ? 'UNIDADES' : ''))}</b>
                <small style="display:block; font-size:10px; color:#444; margin-top:4px;">TOTAL: ${i.total}</small>
            </div>
        </div>`;
    }).join('');
}

function applyChartTheme(tab) {
    const b = document.body; b.className = '';
    if(tab.includes('BILLBOARD')) b.classList.add('theme-billboard');
    else if(tab.includes('SPOTIFY')) b.classList.add('theme-spotify');
    else if(tab.includes('APPLE')) b.classList.add('theme-apple');
    else if(tab.includes('YOUTUBE')) b.classList.add('theme-youtube');
}

// === REAL TIME (MANTIDO INTACTO) ===
async function loadRealTime() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    document.body.className = '';
    try {
        const d = await fetch(API + "?action=getRealTime").then(r => r.json());
        const row = (l, c) => l.map(i => `<div class="chart-row" style="grid-template-columns: 30px 45px 1fr 80px; padding: 12px 15px;"><div class="rank" style="color:#333;">${i.p}</div><img src="${i.c}" style="width:35px; height:35px; border-radius:6px;"><div style="padding-left:10px;"><b style="font-size:12px;">${i.t}</b></div><div style="color:${c}; font-weight:800; font-size:11px; text-align:right;">${i.s}</div></div>`).join('');
        app.innerHTML = `<div class="rt-grid">
            <div class="rt-col"><div class="rt-head" style="color:var(--spotify);">Spotify</div>${row(d.spotify, 'var(--spotify)')}</div>
            <div class="rt-col"><div class="rt-head" style="color:var(--apple);">Apple Music</div>${row(d.apple, 'var(--apple)')}</div>
            <div class="rt-col"><div class="rt-head" style="color:#fff; opacity:0.6;">YouTube</div>${row(d.youtube, '#fff')}</div>
        </div>`;
    } catch(e) { console.error(e); }
}

// === MONTHLY (IDENTIDADE VISUAL DOCX) ===
async function initMonthly(p) {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="filter-group"><div id="year-pills" class="pill-container"></div><div id="month-pills" class="pill-container"></div><div id="artist-select-wrap" class="artist-select-container" style="display:none;"><select id="aS" onchange="renderM('${p}')"></select></div></div><div id="profile-area"></div>`;
    const years = await fetch(`${API}?action=getMonthlyYears`).then(r => r.json());
    document.getElementById('year-pills').innerHTML = years.map(y => `<div class="pill year-pill" onclick="handleYearClick(this, '${y}', '${p}')">${y}</div>`).join('');
    applyChartTheme(p);
}

async function renderM(p) {
    const profile = document.getElementById('profile-area');
    const a = document.getElementById('aS').value;
    const y = document.querySelector('.year-pill.active').innerText;
    const m = document.querySelector('.month-pill.active').innerText;
    if(!a) return;
    profile.innerHTML = '<div class="skeleton" style="height:450px;"></div>';
    
    try {
        const data = await fetch(`${API}?action=getMonthlyStats&platform=${p}&month=${m}&year=${y}&artist=${a}`).then(r => r.json());
        const art = data[0];

        if (p.includes('SPOTIFY')) {
            profile.innerHTML = `<div class="sp-banner" style="background-image: url('${art.capaArtista}')"><div class="sp-banner-content">
                ${art.rank !== '-' ? `<div style="color:var(--spotify); font-weight:900; font-size:12px; margin-bottom:10px;">#${art.rank} GLOBAL</div>` : ''}
                <h1 style="font-size:80px; font-weight:900; margin:0; letter-spacing:-4px; text-transform:uppercase;">${art.nome}</h1>
                <p style="font-weight:700;">${art.totalOuvintes} ouvintes mensais</p></div></div>
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:40px; padding:30px;">
                <div><h3>Populares</h3>${art.musicas.map((mus,i) => `<div class="chart-row"><span style="color:#555; font-weight:700;">${i+1}</span><img src="${mus.capaMusica}"><b>${mus.titulo}</b><span style="text-align:right; color:var(--spotify);">${mus.streams}</span></div>`).join('')}</div>
                <div><h3>Sobre</h3><div style="background:#242424; padding:25px; border-radius:8px; color:#aaa; line-height:1.6;">${art.sobre}</div></div></div>`;
        } else if (p.includes('APPLE')) {
            profile.innerHTML = `<div class="am-profile-header"><img src="${art.capaArtista}" class="am-artist-img"><div style="padding-left:45px;">
                <h1 style="font-size:56px; font-weight:900; margin:0;">${art.nome}</h1>
                <div style="color:var(--apple); font-weight:700; font-size:20px; margin-top:8px;">${art.totalOuvintes} ouvintes mensais</div>
                ${art.rank !== '-' ? `<div style="color:#8e8e93; font-weight:700; font-size:14px; margin-top:5px;">TOP ${art.rank} MENSAL</div>` : ''}</div></div>
                <div style="display:grid; grid-template-columns: 1fr 300px; gap:50px;">
                <div><h3>As mais ouvidas</h3>${art.musicas.slice(0,5).map(m => `<div class="chart-row"><img src="${m.capaMusica}" style="border-radius:8px;"><b>${m.titulo}</b><span style="text-align:right; color:#8e8e93;">${m.streams}</span></div>`).join('')}</div>
                <div><h3>Sobre</h3><div style="color:#444; line-height:1.6;">${art.sobre}</div></div></div>`;
        } else if (p.includes('YOUTUBE')) {
            profile.innerHTML = `<div class="yt-banner" style="background-image: url('${art.capaArtista}')"></div>
                <div style="display:flex; align-items:center; padding:20px 50px;"><img src="${art.capaArtista}" class="yt-avatar">
                <div style="padding-left:30px;"><h2 style="font-size:36px; margin:0;">${art.nome}</h2><div style="color:#aaa;">${art.totalOuvintes} visualizações mensais</div>
                ${art.rank !== '-' ? `<div style="color:var(--youtube); font-weight:700; margin-top:5px;">TOP ${art.rank} GLOBAL</div>` : ''}</div></div>
                <div style="display:grid; grid-template-columns: 2fr 1fr; gap:40px; padding:0 50px 50px;">
                <div><h4 style="border-left:3px solid var(--youtube); padding-left:10px;">VÍDEOS POPULARES</h4>${art.musicas.slice(0,5).map(m => `<div style="display:flex; gap:15px; margin-bottom:20px;"><img src="${m.capaMusica}" style="width:180px; border-radius:12px;"><div><b style="display:block;">${m.titulo}</b><span style="color:#aaa; font-size:13px;">${m.streams} views</span></div></div>`).join('')}</div>
                <div><h4 style="border-left:3px solid var(--youtube); padding-left:10px;">INFORMAÇÕES</h4><div style="background:#0f0f0f; padding:20px; border-radius:12px; color:#aaa; line-height:1.6;">${art.sobre}</div></div></div>`;
        }
    } catch(e) { console.error(e); }
}

// Funções de cascata Year -> Month -> Artist mantidas iguais à anterior para funcionalidade.
