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

// === REAL TIME (VIDRO & COLUNAS) ===
async function loadRealTime() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    try {
        const d = await fetch(API + "?action=getRealTime").then(r => r.json());
        const row = (l, c) => l.map(i => `
            <div class="chart-row" style="grid-template-columns: 30px 45px 1fr 80px;">
                <div class="rank">${i.p}</div>
                <img src="${i.c}" style="border-radius:4px; width:35px; height:35px;">
                <div style="padding-left:12px;"><b style="font-size:12px; display:block; color:#fff;">${i.t}</b></div>
                <div style="color:${c}; font-weight:800; font-size:11px; text-align:right; font-family:'Plus Jakarta Sans';">${i.s}</div>
            </div>`).join('');
        
        app.innerHTML = `
            <div class="rt-grid">
                <div class="rt-col"><div class="rt-head" style="color:var(--spotify);">Spotify Global</div>${row(d.spotify, 'var(--spotify)')}</div>
                <div class="rt-col"><div class="rt-head" style="color:var(--apple);">Apple Music Global</div>${row(d.apple, 'var(--apple)')}</div>
                <div class="rt-col"><div class="rt-head" style="color:#fff; opacity:0.6;">YouTube Global</div>${row(d.youtube, '#fff')}</div>
            </div>`;
    } catch(e) { app.innerHTML = "Erro de conexão."; }
}

// === PERFIS MENSAIS (CHIQUE & CLEAN COM RANKING) ===
async function renderM(p) {
    const profile = document.getElementById('profile-area');
    const a = document.getElementById('aS').value;
    const y = document.querySelector('.year-pill.active').innerText;
    const m = document.querySelector('.month-pill.active').innerText;
    if(!a) return;
    profile.innerHTML = '<div class="skeleton" style="height:450px; border-radius:40px;"></div>';
    
    try {
        const data = await fetch(`${API}?action=getMonthlyStats&platform=${p}&month=${m}&year=${y}&artist=${a}`).then(r => r.json());
        const art = data[0];

        if (p.toUpperCase().includes('YOUTUBE')) {
            profile.innerHTML = `
            <div class="channel-header" style="margin-bottom:40px;">
                <div class="yt-banner" style="background-image: url('${art.capa}');"></div>
                <div class="channel-meta" style="background:transparent;">
                    <img src="${art.capa}" class="avatar">
                    <div>
                        <h2 style="font-family:'Plus Jakarta Sans'; font-size:32px; font-weight:800; margin:0;">${a}</h2>
                        <div style="color:#666; font-size:13px; margin-top:5px; font-weight:500;">
                            ${art.ov} views este mês • ${art.rank !== '-' ? `<span style="color:var(--youtube); font-weight:800;">TOP ${art.rank}</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
            <div style="display:grid; grid-template-columns: 2fr 1.2fr; gap:50px;">
                <div><h4 style="font-size:10px; color:#444; letter-spacing:3px; margin-bottom:25px; border-left:3px solid var(--youtube); padding-left:15px;">VÍDEOS EM ALTA</h4>
                ${art.m.map(mus => `<div style="display:flex; gap:20px; margin-bottom:25px; align-items:center;"><img src="${mus.c}" style="width:140px; border-radius:12px; aspect-ratio:16/9; object-fit:cover;"><div><b style="font-size:14px; display:block; margin-bottom:5px;">${mus.t}</b><span style="color:#555; font-size:12px;">${mus.s} views</span></div></div>`).join('')}</div>
                <div><h4 style="font-size:10px; color:#444; letter-spacing:3px; margin-bottom:25px; border-left:3px solid var(--youtube); padding-left:15px;">SOBRE</h4><div style="color:#777; line-height:1.8; font-size:14px;">${art.bio}</div></div>
            </div>`;
        } 
        else if (p.toUpperCase().includes('SPOTIFY')) {
            profile.innerHTML = `
            <div class="sp-banner" style="background-image: url('${art.capa}'); border-radius:40px;">
                <div class="sp-banner-content">
                    ${art.rank !== '-' ? `<div style="color:var(--spotify); font-weight:800; font-size:11px; margin-bottom:15px; letter-spacing:3px;">RANKING GLOBAL #${art.rank}</div>` : ''}
                    <h1 class="sp-artist-name" style="font-size:85px;">${a}</h1>
                    <p style="font-size:16px; opacity:0.7; margin-top:10px; font-weight:500;">${art.ov} ouvintes mensais</p>
                </div>
            </div>
            <div class="sp-main-grid" style="margin-top:40px;">
                <div><h4 style="font-size:10px; color:#444; letter-spacing:3px; margin-bottom:20px;">POPULARES</h4>
                ${art.m.map((mus, idx) => `<div class="sp-song-row" style="grid-template-columns: 30px 45px 1fr 100px; padding:12px;"><span style="color:#222; font-weight:800;">${idx+1}</span><img src="${mus.c}"><b>${mus.t}</b><span style="text-align:right; color:#555; font-size:13px;">${mus.s}</span></div>`).join('')}</div>
                <div><h4 style="font-size:10px; color:#444; letter-spacing:3px; margin-bottom:20px;">SOBRE O ARTISTA</h4><div style="background:var(--glass); border:1px solid var(--glass-border); padding:30px; border-radius:20px; font-size:14px; line-height:1.8; color:#888;">${art.bio}</div></div>
            </div>`;
        } 
        else if (p.toUpperCase().includes('APPLE')) {
            profile.innerHTML = `
            <div class="am-hero" style="background-image: url('${art.capa}');">
                <div class="am-hero-content">
                    <div style="background:var(--apple); width:45px; height:45px; border-radius:50%; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 20px rgba(250,36,60,0.3);">▶</div>
                    <h1 style="font-size:45px; margin:0; font-family:'Plus Jakarta Sans'; font-weight:800;">${a}</h1>
                </div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 2fr; gap:50px; padding:30px 10px;">
                <div>
                    <h4 style="font-size:10px; color:#444; letter-spacing:3px; margin-bottom:20px;">ARTISTA</h4>
                    <p style="font-size:26px; font-weight:800; margin-bottom:10px;">${art.ov} ouvintes</p>
                    ${art.rank !== '-' ? `<span style="color:var(--apple); font-weight:800; font-size:13px; letter-spacing:1px;">TOP ${art.rank} MENSAL</span>` : ''}
                    <p style="color:#666; font-size:14px; line-height:1.8; margin-top:25px;">${art.bio}</p>
                </div>
                <div><h4 style="font-size:10px; color:#444; letter-spacing:3px; margin-bottom:20px;">TOP SONGS</h4>
                ${art.m.map(mus => `<div style="display:flex; align-items:center; justify-content:space-between; padding:15px 0; border-bottom:1px solid rgba(255,255,255,0.05);"><div style="display:flex; align-items:center; gap:15px;"><img src="${mus.c}" style="width:45px; border-radius:8px;"><b style="font-size:15px;">${mus.t}</b></div><span style="color:#555; font-size:13px;">${mus.s}</span></div>`).join('')}</div>
            </div>`;
        }
    } catch(e) { console.error(e); }
}

// === CASCATA DE FILTROS (CENTRALIZADA) ===
async function initMonthly(p) {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="filter-group"><div id="year-pills" class="pill-container"></div><div id="month-pills" class="pill-container"></div><div id="artist-select-wrap" class="artist-select-container" style="display:none;"><select id="aS" onchange="renderM('${p}')"></select></div></div><div id="profile-area"></div>`;
    const years = await fetch(`${API}?action=getMonthlyYears`).then(r => r.json());
    document.getElementById('year-pills').innerHTML = years.map(y => `<div class="pill year-pill" onclick="handleYearClick(this, '${y}', '${p}')">${y}</div>`).join('');
}

async function handleYearClick(el, year, p) {
    document.querySelectorAll('.year-pill').forEach(b => b.classList.remove('active')); el.classList.add('active');
    const months = await fetch(`${API}?action=getMonthlyDates&year=${year}`).then(r => r.json());
    document.getElementById('month-pills').innerHTML = months.map(m => `<div class="pill month-pill" onclick="handleMonthClick(this, '${m}', '${year}', '${p}')">${m}</div>`).join('');
}

async function handleMonthClick(el, month, year, p) {
    document.querySelectorAll('.month-pill').forEach(b => b.classList.remove('active')); el.classList.add('active');
    document.getElementById('artist-select-wrap').style.display = 'block';
    const artists = await fetch(`${API}?action=getArtists&platform=${p}&month=${month}&year=${year}`).then(r => r.json());
    document.getElementById('aS').innerHTML = `<option value="">SELECT ARTIST</option>` + artists.map(a => `<option value="${a}">${a}</option>`).join('');
}

// === DIRETÓRIO HOF (ESTÁVEL) ===
async function loadHOFList() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    try {
        const list = await fetch(API + "?action=getHOFList").then(r => r.json());
        let html = `<h2 style="text-align:center; font-family:'Plus Jakarta Sans'; font-weight:800; font-size:22px; letter-spacing:6px; margin-bottom:40px; color:#fff; opacity:0.8;">DIRECTORY</h2><div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:25px;">`;
        list.forEach(a => { html += `<div class="hof-card" onclick="loadHOFProfile('${a.name}')"><img src="${a.img}" onerror="this.src='https://via.placeholder.com/150'"><h3 style="font-size:14px; color:#fff; margin:0; font-weight:700;">${a.name}</h3><p style="font-size:9px; color:#555; margin-top:8px; text-transform:uppercase; letter-spacing:2px; font-weight:800;">${a.country}</p></div>`; });
        app.innerHTML = html + `</div>`;
    } catch(e) { console.error(e); }
}

async function loadHOFProfile(artistName) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton" style="height:450px; border-radius:40px;"></div>';
    try {
        const a = await fetch(`${API}?action=getHOFProfile&artist=${encodeURIComponent(artistName)}`).then(r => r.json());
        const renderL = (l, c) => l.map((i, idx) => `<div class="chart-row" style="grid-template-columns: 30px 1fr 100px; padding:12px 5px;"><div class="rank">${idx+1}</div><div style="padding-left:10px;"><b style="font-size:13px; color:#fff;">${i.t}</b></div><span style="color:${c}; font-weight:800; font-size:12px; text-align:right;">${i.v}</span></div>`).join('');
        app.innerHTML = `
            <button onclick="loadHOFList()" style="background:transparent; border:none; color:#444; cursor:pointer; font-weight:800; margin-bottom:25px; font-size:10px; letter-spacing:2px;">← BACK</button>
            <div class="artist-hero" style="background-image: url('${a.img}');"><div class="hero-overlay"></div><div class="hero-content"><h1>${a.name}</h1><p style="color:#777; margin-top:15px; font-weight:500;">${a.country} • ${a.style}</p></div></div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:20px; margin-bottom:50px;">
                <div style="background:var(--glass); padding:25px; border-radius:24px; text-align:center; border:1px solid var(--glass-border);"><div style="font-size:28px; color:var(--gold); font-weight:800;">${a.n1_hot100}</div><small style="color:#444; font-weight:800; font-size:9px; letter-spacing:2px;">HOT 100</small></div>
                <div style="background:var(--glass); padding:25px; border-radius:24px; text-align:center; border:1px solid var(--glass-border);"><div style="font-size:28px; color:var(--spotify); font-weight:800;">${a.n1_spotify}</div><small style="color:#444; font-weight:800; font-size:9px; letter-spacing:2px;">SPOTIFY</small></div>
                <div style="background:var(--glass); padding:25px; border-radius:24px; text-align:center; border:1px solid var(--glass-border);"><div style="font-size:28px; color:var(--youtube); font-weight:800;">${a.n1_youtube}</div><small style="color:#444; font-weight:800; font-size:9px; letter-spacing:2px;">YOUTUBE</small></div>
                <div style="background:var(--glass); padding:25px; border-radius:24px; text-align:center; border:1px solid var(--glass-border);"><div style="font-size:28px; color:var(--gold); font-weight:800;">${a.n1_bb200}</div><small style="color:#444; font-weight:800; font-size:9px; letter-spacing:2px;">BB 200</small></div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:30px; margin-bottom:50px;">
                <div><h4 style="color:var(--youtube); border-bottom:1px solid #222; padding-bottom:12px; font-size:10px; letter-spacing:3px;">YOUTUBE</h4>${renderL(a.yt, 'var(--youtube)')}</div>
                <div><h4 style="color:var(--spotify); border-bottom:1px solid #222; padding-bottom:12px; font-size:10px; letter-spacing:3px;">SPOTIFY</h4>${renderL(a.sp, 'var(--spotify)')}</div>
                <div><h4 style="color:var(--apple); border-bottom:1px solid #222; padding-bottom:12px; font-size:10px; letter-spacing:3px;">APPLE MUSIC</h4>${renderL(a.am, 'var(--apple)')}</div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 2fr; gap:50px;">
                <div><h4 style="color:var(--gold); border-bottom:1px solid #222; padding-bottom:12px; font-size:10px; letter-spacing:3px;">TOP ALBUMS</h4>${renderL(a.alb, '#fff')}</div>
                <div><h4 style="color:#444; border-bottom:1px solid #222; padding-bottom:12px; font-size:10px; letter-spacing:3px;">CHART RUN HISTORY</h4>
                <div style="max-height: 450px; overflow-y: auto;">${a.runs.map(i => `<div style="background:var(--glass); padding:15px; border-radius:15px; margin-bottom:12px; border-left:3px solid #fff;"><b style="font-size:12px; color:#fff;">${i.t}</b><div style="color:#555; font-size:11px; font-family:monospace; margin-top:8px; letter-spacing:1px;">${i.v}</div></div>`).join('')}</div></div>
            </div>`;
    } catch(e) { console.error(e); }
}
