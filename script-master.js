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

// === RENDERIZAÇÃO DOS PERFIS MENSAIS (COM RANKING RESTAURADO) ===
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

        if (p.toUpperCase().includes('YOUTUBE')) {
            profile.innerHTML = `
            <div class="channel-header">
                <div class="yt-banner" style="background-image: url('${art.capa}');"></div>
                <div class="channel-meta">
                    <img src="${art.capa}" class="avatar" onerror="this.src='https://via.placeholder.com/150'">
                    <div>
                        <h2 class="c-name">${a}</h2>
                        <div style="color:#aaa;">${art.ov} views este mês</div>
                        ${art.rank !== '-' ? `<span style="background:var(--youtube); color:#fff; padding:3px 8px; border-radius:4px; font-size:11px; font-weight:900; margin-top:8px; display:inline-block;">TOP ${art.rank} GLOBAL</span>` : ''}
                    </div>
                </div>
            </div>
            <div style="display:grid; grid-template-columns: 2fr 1fr; gap:40px; padding:20px;">
                <div><h3 style="border-left:4px solid var(--youtube); padding-left:10px; font-size:12px;">VÍDEOS POPULARES</h3>
                ${art.m.map(mus => `<div style="display:flex; gap:15px; margin-bottom:20px;"><img src="${mus.c}" class="v-thumb"><div><b style="color:#fff;">${mus.t}</b><div style="color:#666; font-size:12px;">${mus.s} views</div></div></div>`).join('')}</div>
                <div><h3 style="border-left:4px solid var(--youtube); padding-left:10px; font-size:12px;">SOBRE</h3><div style="color:#aaa; line-height:1.6; font-size:14px;">${art.bio}</div></div>
            </div>`;
        } 
        else if (p.toUpperCase().includes('SPOTIFY')) {
            profile.innerHTML = `
            <div class="sp-banner" style="background-image: url('${art.capa}');">
                <div class="sp-banner-content">
                    ${art.rank !== '-' ? `<div style="color:var(--spotify); font-weight:900; letter-spacing:1px; margin-bottom:10px;">#${art.rank} NO MUNDO</div>` : ''}
                    <h1 class="sp-artist-name">${a}</h1>
                    <p style="font-size:18px;">${art.ov} ouvintes mensais</p>
                </div>
            </div>
            <div class="sp-main-grid">
                <div><h2 style="color:#fff; font-size:14px; letter-spacing:1px;">POPULARES</h2>
                ${art.m.map((mus, idx) => `<div class="sp-song-row"><span style="color:#444; font-weight:800;">${idx+1}</span><img src="${mus.c}" style="width:40px; border-radius:4px;"><b>${mus.t}</b><span style="text-align:right; color:#888;">${mus.s}</span></div>`).join('')}</div>
                <div><h2 style="color:#fff; font-size:14px; letter-spacing:1px;">SOBRE</h2><div style="background:#181818; padding:25px; border-radius:12px; font-size:14px; line-height:1.6; color:#bbb;">${art.bio}</div></div>
            </div>`;
        } 
        else if (p.toUpperCase().includes('APPLE')) {
            profile.innerHTML = `
            <div class="am-hero" style="background-image: url('${art.capa}');"><div class="am-hero-content"><div style="background:var(--apple); width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center;">▶</div><h1 style="font-size:45px; margin:0;">${a}</h1></div></div>
            <div style="display:grid; grid-template-columns: 1fr 2fr; gap:40px; padding:20px;">
                <div>
                    <h2 style="border-bottom:1px solid #222; padding-bottom:10px; font-size:14px;">SOBRE</h2>
                    <p style="font-size:20px; font-weight:700; margin:15px 0 5px 0;">${art.ov} ouvintes</p>
                    ${art.rank !== '-' ? `<span style="color:var(--apple); font-weight:800; font-size:12px; display:block; margin-bottom:15px;">TOP ${art.rank} MENSAL</span>` : ''}
                    <p style="color:#777; font-size:14px; line-height:1.6;">${art.bio}</p>
                </div>
                <div><h2 style="border-bottom:1px solid #222; padding-bottom:10px; font-size:14px;">TOP SONGS</h2>
                ${art.m.map(mus => `<div style="display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid #111;"><img src="${mus.c}" style="width:45px; border-radius:6px;"><b>${mus.t}</b><span style="color:#666;">${mus.s}</span></div>`).join('')}</div>
            </div>`;
        }
    } catch(e) { console.error(e); }
}

// === FILTROS EM CASCATA ===
async function initMonthly(p) {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="filter-group"><div id="year-pills" class="pill-container"></div><div id="month-pills" class="pill-container"></div><div id="artist-select-wrap" class="artist-select-container" style="display:none;"><select id="aS" onchange="renderM('${p}')"></select></div></div><div id="profile-area"></div>`;
    const years = await fetch(`${API}?action=getMonthlyYears`).then(r => r.json());
    document.getElementById('year-pills').innerHTML = years.map(y => `<div class="pill year-pill" onclick="handleYearClick(this, '${y}', '${p}')">${y}</div>`).join('');
}

async function handleYearClick(el, year, p) {
    document.querySelectorAll('.year-pill').forEach(b => b.classList.remove('active')); el.classList.add('active');
    document.getElementById('month-pills').innerHTML = '<div class="pill">Carregando meses...</div>';
    document.getElementById('artist-select-wrap').style.display = 'none';
    const months = await fetch(`${API}?action=getMonthlyDates&year=${year}`).then(r => r.json());
    document.getElementById('month-pills').innerHTML = months.map(m => `<div class="pill month-pill" onclick="handleMonthClick(this, '${m}', '${year}', '${p}')">${m}</div>`).join('');
}

async function handleMonthClick(el, month, year, p) {
    document.querySelectorAll('.month-pill').forEach(b => b.classList.remove('active')); el.classList.add('active');
    document.getElementById('artist-select-wrap').style.display = 'block';
    const artists = await fetch(`${API}?action=getArtists&platform=${p}&month=${month}&year=${year}`).then(r => r.json());
    document.getElementById('aS').innerHTML = `<option value="">SELECIONE O ARTISTA</option>` + artists.map(a => `<option value="${a}">${a}</option>`).join('');
}

// === REAL TIME (RESTAURADO 3 COLUNAS) ===
async function loadRealTime() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    try {
        const d = await fetch(API + "?action=getRealTime").then(r => r.json());
        const row = (l, c) => l.map(i => `<div class="chart-row" style="grid-template-columns: 30px 45px 1fr 80px; padding: 12px 15px;"><div class="rank" style="color:#333;">${i.p}</div><img src="${i.c}" style="width:35px; height:35px; border-radius:6px;"><div class="info-box"><b>${i.t}</b></div><div style="color:${c}; font-weight:800; font-size:11px; text-align:right;">${i.s}</div></div>`).join('');
        app.innerHTML = `<div class="rt-grid">
            <div class="rt-col"><div class="rt-head" style="color:var(--spotify);">Spotify</div>${row(d.spotify, 'var(--spotify)')}</div>
            <div class="rt-col"><div class="rt-head" style="color:var(--apple);">Apple Music</div>${row(d.apple, 'var(--apple)')}</div>
            <div class="rt-col"><div class="rt-head" style="color:#fff;">YouTube</div>${row(d.youtube, '#fff')}</div>
        </div>`;
    } catch(e) { app.innerHTML = "Erro de conexão."; }
}

// === DIRETÓRIO DE ARTISTAS E PERFIL HOF (ESTÁVEIS) ===
async function loadHOFList() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    try {
        const list = await fetch(API + "?action=getHOFList").then(r => r.json());
        let html = `<h2 style="text-align:center; font-family:'Plus Jakarta Sans'; font-weight:800; font-size:24px; letter-spacing:5px; margin-bottom:40px;">DIRECTORY</h2><div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:25px;">`;
        list.forEach(a => { html += `<div class="hof-card" onclick="loadHOFProfile('${a.name}')"><img src="${a.img}" onerror="this.src='https://via.placeholder.com/150'"><h3 style="font-size:15px; color:#fff; margin:0;">${a.name}</h3><p style="font-size:10px; color:#555; margin-top:5px; text-transform:uppercase;">${a.country}</p></div>`; });
        app.innerHTML = html + `</div>`;
    } catch(e) { console.error(e); }
}

async function loadHOFProfile(artistName) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton" style="height:400px; border-radius:30px;"></div>';
    try {
        const a = await fetch(`${API}?action=getHOFProfile&artist=${encodeURIComponent(artistName)}`).then(r => r.json());
        const renderL = (l, c) => l.map((i, idx) => `<div class="chart-row" style="grid-template-columns: 30px 1fr 100px;"><div class="rank" style="color:#222;">${idx+1}</div><div class="info-box"><b>${i.t}</b></div><span style="color:${c}; font-weight:800; font-size:12px; text-align:right;">${i.v}</span></div>`).join('');
        app.innerHTML = `
            <button onclick="loadHOFList()" style="background:transparent; border:none; color:#444; cursor:pointer; font-weight:800; margin-bottom:20px;">← BACK</button>
            <div class="artist-hero" style="background-image: url('${a.img}');"><div class="hero-overlay"></div><div class="hero-content"><h1>${a.name}</h1><p style="color:#888;">${a.country} • ${a.style}</p></div></div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:15px; margin-bottom:40px;">
                <div style="background:#111; padding:20px; border-radius:15px; text-align:center; border:1px solid #222;"><div style="font-size:24px; color:var(--gold); font-weight:800;">${a.n1_hot100}</div><small style="color:#444;">HOT 100</small></div>
                <div style="background:#111; padding:20px; border-radius:15px; text-align:center; border:1px solid #222;"><div style="font-size:24px; color:var(--spotify); font-weight:800;">${a.n1_spotify}</div><small style="color:#444;">SPOTIFY</small></div>
                <div style="background:#111; padding:20px; border-radius:15px; text-align:center; border:1px solid #222;"><div style="font-size:24px; color:var(--youtube); font-weight:800;">${a.n1_youtube}</div><small style="color:#444;">YOUTUBE</small></div>
                <div style="background:#111; padding:20px; border-radius:15px; text-align:center; border:1px solid #222;"><div style="font-size:24px; color:var(--gold); font-weight:800;">${a.n1_bb200}</div><small style="color:#444;">BB 200</small></div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:25px; margin-bottom:40px;">
                <div><h4 style="color:var(--youtube); border-bottom:1px solid #222; padding-bottom:10px; font-size:11px;">YOUTUBE</h4>${renderL(a.yt, 'var(--youtube)')}</div>
                <div><h4 style="color:var(--spotify); border-bottom:1px solid #222; padding-bottom:10px; font-size:11px;">SPOTIFY</h4>${renderL(a.sp, 'var(--spotify)')}</div>
                <div><h4 style="color:var(--apple); border-bottom:1px solid #222; padding-bottom:10px; font-size:11px;">APPLE</h4>${renderL(a.am, 'var(--apple)')}</div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 2fr; gap:40px;">
                <div><h4 style="color:var(--gold); border-bottom:1px solid #222; padding-bottom:10px; font-size:11px;">TOP ALBUMS</h4>${renderL(a.alb, '#fff')}</div>
                <div><h4 style="color:#444; border-bottom:1px solid #222; padding-bottom:10px; font-size:11px;">HISTORY</h4>
                    <div style="max-height: 400px; overflow-y: auto;">
                        ${a.runs.map(i => `<div style="background:#111; padding:12px; border-radius:10px; margin-bottom:10px; border-left:3px solid #fff;"><b style="font-size:12px;">${i.t}</b><div style="color:#666; font-size:11px; font-family:monospace;">${i.v}</div></div>`).join('')}
                    </div>
                </div>
            </div>`;
    } catch(e) { console.error(e); }
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
    area.innerHTML = res.map(i => `<div class="chart-row" style="grid-template-columns: 40px 50px 1fr 100px;"><span style="font-weight:800; color:#222;">${i.pos}</span><span style="font-size:9px; color:#444;">${i.st || '-'}</span><img src="${i.capa}" style="width:40px; border-radius:4px;"><div style="padding-left:15px;"><b style="display:block; font-size:13px;">${i.tit}</b><span style="font-size:11px; color:#666;">${i.art}</span></div><div style="text-align:right; font-weight:800;">${i.val}</div></div>`).join('');
}
