const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec"; 

function buildMenu() {
    const navMenu = document.getElementById('menu-nav');
    if(!navMenu) return;

    navMenu.innerHTML = `
    <a href="index.html" class="menu-item">Início</a>
    <div class="menu-item" onclick="loadHOFList()">🌟 Artists</div>
    <div class="menu-item">Hot 100
        <div class="submenu">
            <a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn">Billboard Hot 100</a>
            <a href="charts.html?tab=BILLBOARD HOT 100&style=true" class="sub-btn">Hot 100 by Style</a>
        </div>
    </div>
    <div class="menu-item">Spotify
        <div class="submenu">
            <a href="charts.html?tab=SPOTIFY" class="sub-btn">Global Charts</a>
            <a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=SPOTIFY" class="sub-btn">Monthly Artists</a>
        </div>
    </div>
    <div class="menu-item">Apple Music
        <div class="submenu">
            <a href="charts.html?tab=APPLE MUSIC" class="sub-btn">Global Charts</a>
            <a href="countries.html?tab=APPLE MUSIC COUNTRIES" class="sub-btn">By Country</a>
            <a href="monthly.html?p=APPLE MUSIC" class="sub-btn">Monthly Artists</a>
        </div>
    </div>
    <div class="menu-item">YouTube
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

// === FILTROS EM CASCATA ===
async function initMonthly(p) {
    const app = document.getElementById('app');
    if(!app) return;
    app.innerHTML = `
        <div class="filter-group">
            <div id="year-pills" class="pill-container"></div>
            <div id="month-pills" class="pill-container"></div>
            <div id="artist-select-wrap" class="artist-select-container" style="display:none;">
                <select id="aS" onchange="renderM('${p}')"></select>
            </div>
        </div>
        <div id="profile-area"></div>`;
    
    try {
        const years = await fetch(`${API}?action=getMonthlyYears`).then(r => r.json());
        document.getElementById('year-pills').innerHTML = years.map(y => `<div class="pill year-pill" onclick="handleYearClick(this, '${y}', '${p}')">${y}</div>`).join('');
    } catch(e) { console.error(e); }
}

async function handleYearClick(el, year, p) {
    document.querySelectorAll('.year-pill').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('month-pills').innerHTML = '<div class="pill">Carregando...</div>';
    try {
        const months = await fetch(`${API}?action=getMonthlyDates&year=${year}`).then(r => r.json());
        document.getElementById('month-pills').innerHTML = months.map(m => `<div class="pill month-pill" onclick="handleMonthClick(this, '${m}', '${year}', '${p}')">${m}</div>`).join('');
    } catch(e) { console.error(e); }
}

async function handleMonthClick(el, month, year, p) {
    document.querySelectorAll('.month-pill').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    const wrap = document.getElementById('artist-select-wrap');
    wrap.style.display = 'block';
    try {
        const artists = await fetch(`${API}?action=getArtists&platform=${p}&month=${month}&year=${year}`).then(r => r.json());
        document.getElementById('aS').innerHTML = `<option value="">SELECIONE O ARTISTA</option>` + artists.map(a => `<option value="${a}">${a}</option>`).join('');
    } catch(e) { console.error(e); }
}

async function renderM(p) {
    const profile = document.getElementById('profile-area');
    const a = document.getElementById('aS').value;
    const y = document.querySelector('.year-pill.active').innerText;
    const m = document.querySelector('.month-pill.active').innerText;
    if(!a) return;
    profile.innerHTML = '<div class="skeleton" style="height:400px; border-radius:32px;"></div>';
    
    try {
        const data = await fetch(`${API}?action=getMonthlyStats&platform=${p}&month=${m}&year=${y}&artist=${a}`).then(r => r.json());
        const art = data[0];
        profile.innerHTML = `
            <div class="artist-hero" style="background-image: url('${art.capa}');">
                <div class="hero-overlay"></div>
                <div class="hero-content"><h1>${a}</h1><p style="color:#888;">${art.ov} ouvintes mensais</p></div>
            </div>
            <div style="display:grid; grid-template-columns: 2fr 1fr; gap:40px;">
                <div><h3 style="font-size:11px; color:#444; text-transform:uppercase; letter-spacing:2px;">Popular</h3>
                ${art.m.map((mus, idx) => `<div class="chart-row"><div class="rank">${idx+1}</div><img src="${mus.c}"><div class="info-box"><b>${mus.t}</b></div><div style="text-align:right; font-size:12px; color:#666;">${mus.s}</div></div>`).join('')}</div>
                <div><h3 style="font-size:11px; color:#444; text-transform:uppercase; letter-spacing:2px;">About</h3><div style="color:#aaa; font-size:14px; line-height:1.7;">${art.bio}</div></div>
            </div>`;
    } catch(e) { console.error(e); }
}

// === REAL TIME ===
async function loadRealTime() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    try {
        const d = await fetch(API + "?action=getRealTime").then(r => r.json());
        const row = (l, c) => l.map(i => `<div class="chart-row" style="grid-template-columns: 30px 45px 1fr 80px;"><div class="rank">${i.p}</div><img src="${i.c}" style="border-radius:4px;"><div class="info-box"><b>${i.t}</b></div><div style="color:${c}; font-weight:800; font-size:11px; text-align:right;">${i.s}</div></div>`).join('');
        app.innerHTML = `<div class="rt-grid"><div class="rt-col"><div class="rt-head" style="color:#1DB954;">Spotify</div>${row(d.spotify, '#1DB954')}</div><div class="rt-col"><div class="rt-head" style="color:#fa243c;">Apple Music</div>${row(d.apple, '#fa243c')}</div><div class="rt-col"><div class="rt-head" style="color:#fff;">YouTube</div>${row(d.youtube, '#fff')}</div></div>`;
    } catch(e) { console.error(e); }
}

// === HALL OF FAME ===
async function loadHOFList() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    try {
        const list = await fetch(API + "?action=getHOFList").then(r => r.json());
        let html = `<h2 style="text-align:center; font-family:'Plus Jakarta Sans'; font-weight:800; font-size:24px; letter-spacing:5px; margin-bottom:40px;">DIRECTORY</h2><div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:25px;">`;
        list.forEach(a => {
            html += `<div onclick="loadHOFProfile('${a.name}')" style="background:var(--glass); border:1px solid var(--glass-border); border-radius:24px; padding:25px; text-align:center; cursor:pointer;"><img src="${a.img}" style="width:100px; height:100px; border-radius:50%; object-fit:cover; margin-bottom:15px; border:1px solid var(--glass-border);"><h3 style="font-size:14px; margin:0;">${a.name}</h3></div>`;
        });
        app.innerHTML = html + `</div>`;
    } catch(e) { console.error(e); }
}

async function loadHOFProfile(artistName) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton" style="height:400px; border-radius:32px;"></div>';
    try {
        const a = await fetch(`${API}?action=getHOFProfile&artist=${encodeURIComponent(artistName)}`).then(r => r.json());
        const renderL = (l, c) => l.map((i, idx) => `<div class="chart-row" style="grid-template-columns: 30px 1fr 80px;"><div class="rank">${idx+1}</div><div class="info-box"><b>${i.t}</b></div><span style="color:${c}; font-weight:800; font-size:11px; text-align:right;">${i.v}</span></div>`).join('');
        app.innerHTML = `
            <button onclick="loadHOFList()" style="background:transparent; border:none; color:#444; cursor:pointer; font-weight:800; margin-bottom:20px; font-size:10px;">← BACK</button>
            <div class="artist-hero" style="background-image: url('${a.img}');"><div class="hero-overlay"></div><div class="hero-content"><h1>${a.name}</h1><p style="color:#666; font-size:12px;">${a.country} • ${a.style}</p></div></div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:15px; margin-bottom:40px;">
                <div style="background:var(--glass); padding:20px; border-radius:15px; text-align:center; border:1px solid var(--glass-border);"><div style="font-size:24px; font-weight:800; color:var(--gold);">${a.n1_hot100}</div><div style="font-size:9px; color:#444;">HOT 100</div></div>
                <div style="background:var(--glass); padding:20px; border-radius:15px; text-align:center; border:1px solid var(--glass-border);"><div style="font-size:24px; font-weight:800; color:#1DB954;">${a.n1_spotify}</div><div style="font-size:9px; color:#444;">SPOTIFY</div></div>
                <div style="background:var(--glass); padding:20px; border-radius:15px; text-align:center; border:1px solid var(--glass-border);"><div style="font-size:24px; font-weight:800; color:#ff0000;">${a.n1_youtube}</div><div style="font-size:9px; color:#444;">YOUTUBE</div></div>
                <div style="background:var(--glass); padding:20px; border-radius:15px; text-align:center; border:1px solid var(--glass-border);"><div style="font-size:24px; font-weight:800; color:var(--gold);">${a.n1_bb200}</div><div style="font-size:9px; color:#444;">BB 200</div></div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:25px;">
                <div><h4 style="font-size:10px; color:#333; letter-spacing:2px;">YOUTUBE</h4>${renderL(a.yt, '#ff0000')}</div>
                <div><h4 style="font-size:10px; color:#333; letter-spacing:2px;">SPOTIFY</h4>${renderL(a.sp, '#1DB954')}</div>
                <div><h4 style="font-size:10px; color:#333; letter-spacing:2px;">APPLE</h4>${renderL(a.am, '#FA243C')}</div>
            </div>`;
    } catch(e) { console.error(e); }
}

async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    try {
        const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
        app.innerHTML = `<h2 style="text-align:center; font-family:'Plus Jakarta Sans'; letter-spacing:5px;">${tab}</h2><div class="filter-group"><div class="pill-container">${f.dates.map((d, idx) => `<div class="pill date-pill ${idx===0?'active':''}" onclick="renderChartByPill(this, '${tab}', '${d}', ${hasStyle})">${d}</div>`).join('')}</div></div><div id="chart-area"></div>`;
        renderChart(tab, hasStyle);
    } catch(e) { console.error(e); }
}

function renderChartByPill(el, tab, date, hasStyle) {
    document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    renderChart(tab, hasStyle);
}

async function renderChart(tab, hasStyle) {
    const area = document.getElementById('chart-area');
    const date = document.querySelector('.date-pill.active').innerText;
    const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}`).then(r => r.json());
    area.innerHTML = res.map(i => `<div class="chart-row"><div class="rank">${i.pos}</div><div class="status" style="font-size:9px; color:#444;">${i.st || '-'}</div><img src="${i.capa}"> <div class="info-box"><b>${i.tit}</b><span>${i.art}</span></div><div style="text-align:right; font-size:13px;">${i.val}</div></div>`).join('');
}
