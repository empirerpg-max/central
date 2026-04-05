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

// === DIRETÓRIO DE ARTISTAS ===
async function loadHOFList() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    try {
        const response = await fetch(API + "?action=getHOFList");
        const list = await response.json();
        let html = `<h2 style="text-align:center; font-family:'Plus Jakarta Sans'; letter-spacing:5px; margin-bottom:40px;">DIRECTORY</h2>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:25px;">`;
        list.forEach(a => {
            html += `<div class="hof-card" onclick="loadHOFProfile('${a.name}')">
                <img src="${a.img}" onerror="this.src='https://via.placeholder.com/150'">
                <h3 style="font-size:15px; color:#fff; margin:0;">${a.name}</h3>
                <p style="font-size:10px; color:#555; margin-top:5px; text-transform:uppercase;">${a.country}</p>
            </div>`;
        });
        app.innerHTML = html + `</div>`;
    } catch(e) { app.innerHTML = "Erro ao carregar artistas."; }
}

// === PERFIL DO ARTISTA ===
async function loadHOFProfile(artistName) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton" style="height:400px;"></div>';
    try {
        const response = await fetch(`${API}?action=getHOFProfile&artist=${encodeURIComponent(artistName)}`);
        const a = await response.json();
        
        const renderL = (l, c) => l.map((i, idx) => `
            <div style="display:grid; grid-template-columns: 30px 1fr 80px; align-items:center; padding:10px 0; border-bottom:1px solid #111;">
                <span style="color:#222; font-weight:800;">${idx+1}</span>
                <b style="font-size:13px; color:#fff;">${i.t}</b>
                <span style="color:${c}; font-weight:800; font-size:12px; text-align:right;">${i.v}</span>
            </div>`).join('');
        
        app.innerHTML = `
            <button onclick="loadHOFList()" style="background:transparent; border:none; color:#444; cursor:pointer; font-weight:800; margin-bottom:20px;">← BACK</button>
            <div class="artist-hero" style="background-image: url('${a.img}');">
                <div class="hero-overlay"></div>
                <div class="hero-content"><h1>${a.name}</h1><p style="color:#888;">${a.country} • ${a.style}</p></div>
            </div>
            
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:15px; margin-bottom:40px;">
                <div style="background:#111; padding:20px; border-radius:15px; text-align:center; border:1px solid #222;"><div style="font-size:24px; color:var(--gold); font-weight:800;">${a.n1_hot100}</div><small style="color:#444;">HOT 100</small></div>
                <div style="background:#111; padding:20px; border-radius:15px; text-align:center; border:1px solid #222;"><div style="font-size:24px; color:var(--spotify); font-weight:800;">${a.n1_spotify}</div><small style="color:#444;">SPOTIFY</small></div>
                <div style="background:#111; padding:20px; border-radius:15px; text-align:center; border:1px solid #222;"><div style="font-size:24px; color:var(--youtube); font-weight:800;">${a.n1_youtube}</div><small style="color:#444;">YOUTUBE</small></div>
                <div style="background:#111; padding:20px; border-radius:15px; text-align:center; border:1px solid #222;"><div style="font-size:24px; color:var(--gold); font-weight:800;">${a.n1_bb200}</div><small style="color:#444;">BB 200</small></div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:25px; margin-bottom:40px;">
                <div><h4 style="color:var(--youtube); border-bottom:1px solid #222; padding-bottom:10px; font-size:11px;">YOUTUBE</h4>${renderL(a.yt, '#ff0000')}</div>
                <div><h4 style="color:var(--spotify); border-bottom:1px solid #222; padding-bottom:10px; font-size:11px;">SPOTIFY</h4>${renderL(a.sp, '#1DB954')}</div>
                <div><h4 style="color:var(--apple); border-bottom:1px solid #222; padding-bottom:10px; font-size:11px;">APPLE</h4>${renderL(a.am, '#FA243C')}</div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 2fr; gap:40px;">
                <div><h4 style="color:var(--gold); border-bottom:1px solid #222; padding-bottom:10px; font-size:11px;">TOP ALBUMS</h4>${renderL(a.alb, '#fff')}</div>
                <div><h4 style="color:#444; border-bottom:1px solid #222; padding-bottom:10px; font-size:11px;">HISTORY</h4>
                    <div style="max-height: 400px; overflow-y: auto;">
                        ${a.runs.map(i => `<div style="background:#111; padding:12px; border-radius:10px; margin-bottom:10px; border-left:3px solid #fff;"><b style="font-size:12px;">${i.t}</b><div style="color:#666; font-size:11px; margin-top:5px; font-family:monospace;">${i.v}</div></div>`).join('')}
                    </div>
                </div>
            </div>`;
    } catch(e) { app.innerHTML = "Erro ao carregar perfil."; }
}

// === ARTISTAS MENSAIS (CASCATA) ===
async function initMonthly(p) {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="filter-group"><div id="year-pills" class="pill-container"></div><div id="month-pills" class="pill-container"></div><div id="artist-select-wrap" style="display:none;"><select id="aS" onchange="renderM('${p}')" style="width:300px; background:#111; color:#fff; border:1px solid #222; padding:12px; border-radius:10px;"></select></div></div><div id="profile-area"></div>`;
    try {
        const years = await fetch(`${API}?action=getMonthlyYears`).then(r => r.json());
        document.getElementById('year-pills').innerHTML = years.map(y => `<div class="pill year-pill" onclick="handleYearClick(this, '${y}', '${p}')">${y}</div>`).join('');
    } catch(e) {}
}

async function handleYearClick(el, year, p) {
    document.querySelectorAll('.year-pill').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    const months = await fetch(`${API}?action=getMonthlyDates&year=${year}`).then(r => r.json());
    document.getElementById('month-pills').innerHTML = months.map(m => `<div class="pill month-pill" onclick="handleMonthClick(this, '${m}', '${year}', '${p}')">${m}</div>`).join('');
}

async function handleMonthClick(el, month, year, p) {
    document.querySelectorAll('.month-pill').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('artist-select-wrap').style.display = 'block';
    const artists = await fetch(`${API}?action=getArtists&platform=${p}&month=${month}&year=${year}`).then(r => r.json());
    document.getElementById('aS').innerHTML = `<option value="">SELECT ARTIST</option>` + artists.map(a => `<option value="${a}">${a}</option>`).join('');
}

// === OUTRAS FUNÇÕES (REAL TIME E CHARTS) ===
async function loadRealTime() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    try {
        const d = await fetch(API + "?action=getRealTime").then(r => r.json());
        const row = (l, c) => l.map(i => `<div style="display:grid; grid-template-columns: 30px 45px 1fr 80px; align-items:center; padding:10px; border-bottom:1px solid #222;"><span style="color:#222; font-weight:800;">${i.p}</span><img src="${i.c}" style="width:35px; border-radius:4px;"><b style="font-size:12px; padding-left:10px;">${i.t}</b><span style="color:${c}; font-weight:800; text-align:right; font-size:11px;">${i.s}</span></div>`).join('');
        app.innerHTML = `<div class="rt-grid"><div class="rt-col"><div class="rt-head" style="color:var(--spotify);">Spotify</div>${row(d.spotify, 'var(--spotify)')}</div><div class="rt-col"><div class="rt-head" style="color:var(--apple);">Apple Music</div>${row(d.apple, 'var(--apple)')}</div><div class="rt-col"><div class="rt-head" style="color:var(--youtube);">YouTube</div>${row(d.youtube, '#fff')}</div></div>`;
    } catch(e) {}
}

async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
    app.innerHTML = `<h2 style="text-align:center; font-family:'Plus Jakarta Sans'; letter-spacing:5px;">${tab}</h2><div class="pill-container">${f.dates.map((d, idx) => `<div class="pill date-pill ${idx===0?'active':''}" onclick="renderC(this, '${tab}', '${d}')">${d}</div>`).join('')}</div><div id="chart-area"></div>`;
    renderC(null, tab, f.dates[0]);
}

async function renderC(el, tab, date) {
    if(el) { document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active')); el.classList.add('active'); }
    const area = document.getElementById('chart-area');
    area.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}`).then(r => r.json());
    area.innerHTML = res.map(i => `<div style="display:grid; grid-template-columns: 40px 50px 1fr 100px; align-items:center; padding:15px; border-bottom:1px solid #111;"><span style="font-weight:800; color:#222;">${i.pos}</span><span style="font-size:9px; color:#444;">${i.st || '-'}</span><img src="${i.capa}" style="width:40px; border-radius:4px;"><div style="padding-left:15px;"><b style="display:block; font-size:13px;">${i.tit}</b><span style="font-size:11px; color:#666;">${i.art}</span></div><div style="text-align:right; font-weight:800;">${i.val}</div></div>`).join('');
}
