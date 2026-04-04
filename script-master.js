// ATENÇÃO: COLOQUE A SUA API DO GOOGLE AQUI
const API = "URL_DA_TUA_API_DO_GOOGLE_SCRIPT"; 

function buildMenu() {
    const navMenu = document.getElementById('menu-nav');
    if(!navMenu) return;

    navMenu.innerHTML = `
    <a href="index.html" class="menu-item">Início / Real Time</a>
    <a href="artists.html" class="menu-item" style="color: #d4af37;">🌟 ARTISTS</a>
    <div class="menu-item">Billboard Hot 100
        <div class="submenu">
            <a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn">Billboard Hot 100</a>
            <a href="charts.html?tab=BILLBOARD HOT 100&style=true" class="sub-btn">Hot 100 by Style</a>
        </div>
    </div>
    <div class="menu-item">Spotify Charts
        <div class="submenu">
            <a href="charts.html?tab=SPOTIFY" class="sub-btn">Spotify Global</a>
            <a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn">Spotify by Country</a>
            <a href="monthly.html?p=SPOTIFY" class="sub-btn">Spotify Artists</a>
        </div>
    </div>
    <div class="menu-item">Apple Music
        <div class="submenu">
            <a href="charts.html?tab=APPLE MUSIC" class="sub-btn">Apple Music Global</a>
            <a href="countries.html?tab=APPLE MUSIC COUNTRIES" class="sub-btn">Apple Music by Country</a>
            <a href="monthly.html?p=APPLE MUSIC" class="sub-btn">Apple Music Artists</a>
        </div>
    </div>
    <div class="menu-item">YouTube
        <div class="submenu">
            <a href="charts.html?tab=YOUTUBE" class="sub-btn">YouTube Global</a>
            <a href="countries.html?tab=YOUTUBE COUNTRIES" class="sub-btn">YouTube by Country</a>
            <a href="monthly.html?p=YOUTUBE" class="sub-btn">YouTube Artists</a>
        </div>
    </div>
    <a href="charts.html?tab=DIGITAL SALES" class="menu-item">Digital Sales</a>
    <div class="menu-item">Billboard 200
        <div class="submenu">
            <a href="charts.html?tab=DADOS ÁLBUNS" class="sub-btn">Billboard 200</a>
            <a href="charts.html?tab=DADOS ÁLBUNS&style=true" class="sub-btn">Billboard 200 by Style</a>
        </div>
    </div>`;
}

// === SISTEMA DE FILTROS EM CASCATA (MONTHLY) ===

async function initMonthly(p) {
    const app = document.getElementById('app');
    if(!app) return;
    applyTheme(p);
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
        const yearCont = document.getElementById('year-pills');
        yearCont.innerHTML = years.map(y => `<div class="pill year-pill" onclick="handleYearClick(this, '${y}', '${p}')">${y}</div>`).join('');
    } catch(e) { console.error("Erro ao carregar anos."); }
}

async function handleYearClick(el, year, p) {
    document.querySelectorAll('.year-pill').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('month-pills').innerHTML = '<div class="skeleton" style="width:100px; height:30px; border-radius:20px;"></div>';
    document.getElementById('artist-select-wrap').style.display = 'none';
    document.getElementById('profile-area').innerHTML = '';

    try {
        const months = await fetch(`${API}?action=getMonthlyDates&year=${year}`).then(r => r.json());
        document.getElementById('month-pills').innerHTML = months.map(m => `
            <div class="pill month-pill" onclick="handleMonthClick(this, '${m}', '${year}', '${p}')">${m}</div>
        `).join('');
    } catch(e) { console.error("Erro ao carregar meses."); }
}

async function handleMonthClick(el, month, year, p) {
    document.querySelectorAll('.month-pill').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    const selectWrap = document.getElementById('artist-select-wrap');
    const aSelect = document.getElementById('aS');
    selectWrap.style.display = 'block';
    aSelect.innerHTML = '<option>Carregando artistas...</option>';

    try {
        const artists = await fetch(`${API}?action=getArtists&platform=${p}&month=${month}&year=${year}`).then(r => r.json());
        aSelect.innerHTML = `<option value="">SELECIONE O ARTISTA</option>` + artists.map(a => `<option value="${a}">${a}</option>`).join('');
    } catch(e) { console.error("Erro ao carregar artistas."); }
}

// === RENDERIZAÇÃO DOS PERFIS MENSAIS ===

async function renderM(p) {
    const profile = document.getElementById('profile-area');
    const a = document.getElementById('aS').value;
    const y = document.querySelector('.year-pill.active').innerText;
    const m = document.querySelector('.month-pill.active').innerText;
    if(!a) return;
    profile.innerHTML = '<div class="skeleton" style="height:300px;"></div>';
    
    try {
        const data = await fetch(`${API}?action=getMonthlyStats&platform=${p}&month=${m}&year=${y}&artist=${a}`).then(r => r.json());
        const art = data[0];

        if (p.toUpperCase().includes('YOUTUBE')) {
            profile.innerHTML = `
            <div class="channel-header">
                <div class="yt-banner" style="background-image: url('${art.capa}');"></div>
                <div class="channel-meta">
                    <img src="${art.capa}" class="avatar" onerror="this.src='https://via.placeholder.com/120'">
                    <div><h2 class="c-name">${a}</h2><div class="c-stats">${art.ov} visualizações mensais</div></div>
                </div>
            </div>
            <div class="main-grid">
                <div><div class="section-label">Vídeos Populares</div>${art.m.map(mus => `<div class="v-item"><img src="${mus.c}" class="v-thumb"><div><div style="font-weight:700; color:#fff;">${mus.t}</div><div style="color:#aaa; font-size:13px;">${mus.s} views</div></div></div>`).join('')}</div>
                <div><div class="section-label">Informações</div><div class="about-content">${art.bio}</div></div>
            </div>`;
        } else if (p.toUpperCase().includes('SPOTIFY')) {
            profile.innerHTML = `
            <div class="sp-banner" style="background-image: url('${art.capa}');"><div class="sp-banner-content"><h1 class="sp-artist-name">${a}</h1><p>${art.ov} ouvintes mensais</p></div></div>
            <div class="sp-main-grid">
                <div><h2 style="color:#fff;">Populares</h2>${art.m.map((mus, idx) => `<div class="sp-song-row"><span style="color:#888;">${idx+1}</span><img src="${mus.c}"><div><div style="color:#fff;">${mus.t}</div></div><div style="color:#888; text-align:right;">${mus.s}</div></div>`).join('')}</div>
                <div><h2 style="color:#fff;">Sobre</h2><div class="sp-about-card">${art.bio}</div></div>
            </div>`;
        } else if (p.toUpperCase().includes('APPLE')) {
            profile.innerHTML = `
            <div class="am-hero" style="background-image: url('${art.capa}');"><div class="am-hero-content"><div class="am-play-icon">▶</div><h1 class="am-artist-name">${a}</h1></div></div>
            <div style="display:grid; grid-template-columns: 1fr 2fr; gap:40px; padding:20px; color:#fff;">
                <div><h2 style="border-bottom:1px solid #333; padding-bottom:10px;">Sobre</h2><p>${art.ov} ouvintes mensais</p><p style="color:#888;">${art.bio}</p></div>
                <div><h2 style="border-bottom:1px solid #333; padding-bottom:10px;">Top Songs</h2>${art.m.map(mus => `<div style="display:grid; grid-template-columns: 50px 1fr 100px; align-items:center; padding:10px 0; border-bottom:1px solid #222;"><img src="${mus.c}" style="width:40px; border-radius:4px;"><span>${mus.t}</span><span style="text-align:right; color:#888;">${mus.s}</span></div>`).join('')}</div>
            </div>`;
        }
    } catch(e) { profile.innerHTML = "Erro ao carregar perfil."; }
}

// === HALL OF FAME (MANTIDO) ===

async function loadHOFList() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    document.body.className = 'theme-digital'; 
    try {
        const list = await fetch(API + "?action=getHOFList").then(r => r.json());
        let html = `<h2 style="text-align:center; font-family:'Figtree'; font-weight:900; font-size:32px; margin-bottom:30px; color:#fff;">ARTISTS DIRECTORY</h2><div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:20px;">`;
        list.forEach(a => {
            html += `<div onclick="loadHOFProfile('${a.name}')" style="background:#111; border:1px solid #333; border-radius:12px; padding:20px; text-align:center; cursor:pointer; transition:0.3s;" onmouseover="this.style.borderColor='#d4af37'; this.style.transform='translateY(-5px)';" onmouseout="this.style.borderColor='#333'; this.style.transform='translateY(0)';">
                <img src="${a.img}" style="width:110px; height:110px; border-radius:50%; object-fit:cover; margin-bottom:15px; border:2px solid #d4af37;"><h3 style="margin:0; font-size:18px; color:#fff; font-family:'Figtree'; font-weight:900;">${a.name}</h3><p style="margin:5px 0 0 0; font-size:11px; color:#888;">${a.country} • ${a.style}</p></div>`;
        });
        app.innerHTML = html + `</div>`;
    } catch(e) { app.innerHTML = "Erro ao carregar diretório."; }
}

async function loadHOFProfile(artistName) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton" style="height:400px;"></div>';
    try {
        const a = await fetch(`${API}?action=getHOFProfile&artist=${encodeURIComponent(artistName)}`).then(r => r.json());
        const renderL = (l, c) => l.map((i, idx) => `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #1a1a1a;"><div style="display:flex; gap:10px;"><span style="color:#444;">${idx+1}</span><span style="color:#fff;">${i.t}</span></div><span style="color:${c}; font-weight:900;">${i.v}</span></div>`).join('');
        const renderR = (l) => l.map(i => `<div style="background:#161616; padding:12px; border-radius:8px; margin-bottom:10px; border-left:3px solid #d4af37;"><b style="color:#fff; font-size:13px;">${i.t}</b><div style="color:#d4af37; font-family:monospace; font-size:12px; letter-spacing:1px; overflow-x:auto;">${i.v}</div></div>`).join('');
        app.innerHTML = `
            <div style="max-width:1000px; margin:0 auto; font-family:'Inter', sans-serif;">
                <button onclick="loadHOFList()" style="background:transparent; border:none; color:#d4af37; cursor:pointer; font-weight:900; margin-bottom:20px;">← BACK</button>
                <div style="display:flex; align-items:center; gap:35px; background:linear-gradient(135deg, #111 0%, #050505 100%); padding:40px; border-radius:24px; border:1px solid rgba(212,175,55,0.2); margin-bottom:35px;"><img src="${a.img}" style="width:160px; height:160px; border-radius:50%; object-fit:cover; border:5px solid #d4af37;">
                <div><h1 style="font-family:'Figtree'; font-size:50px; font-weight:900; margin:0 0 10px 0; color:#fff;">${a.name}</h1><div style="display:flex; gap:10px;"><span style="background:rgba(212,175,55,0.1); padding:6px 15px; border-radius:30px; color:#d4af37; font-size:11px;">🌎 ${a.country}</span><span style="background:rgba(255,255,255,0.05); padding:6px 15px; border-radius:30px; color:#aaa; font-size:11px;">🎵 ${a.style}</span></div></div></div>
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:15px; margin-bottom:40px;">
                    <div style="background:#111; padding:20px; border-radius:16px; text-align:center;"><div style="color:#d4af37; font-size:36px; font-weight:900;">${a.n1_hot100}</div><div style="color:#666; font-size:9px;">#1 HOT 100</div></div>
                    <div style="background:#111; padding:20px; border-radius:16px; text-align:center;"><div style="color:#1DB954; font-size:36px; font-weight:900;">${a.n1_spotify}</div><div style="color:#666; font-size:9px;">#1 SPOTIFY</div></div>
                    <div style="background:#111; padding:20px; border-radius:16px; text-align:center;"><div style="color:#ff0000; font-size:36px; font-weight:900;">${a.n1_youtube}</div><div style="color:#666; font-size:9px;">#1 YOUTUBE</div></div>
                    <div style="background:#111; padding:20px; border-radius:16px; text-align:center;"><div style="color:#d4af37; font-size:36px; font-weight:900;">${a.n1_bb200}</div><div style="color:#666; font-size:9px;">#1 BB 200</div></div>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:20px; margin-bottom:40px;">
                    <div><h2 style="color:#fff; border-bottom:2px solid #ff0000; padding-bottom:8px;">YouTube</h2><div style="background:#0a0a0a; border-radius:16px; padding:10px;">${renderL(a.yt, '#ff0000')}</div></div>
                    <div><h2 style="color:#fff; border-bottom:2px solid #1DB954; padding-bottom:8px;">Spotify</h2><div style="background:#0a0a0a; border-radius:16px; padding:10px;">${renderL(a.sp, '#1DB954')}</div></div>
                    <div><h2 style="color:#fff; border-bottom:2px solid #FA243C; padding-bottom:8px;">Apple</h2><div style="background:#0a0a0a; border-radius:16px; padding:10px;">${renderL(a.am, '#FA243C')}</div></div>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 2fr; gap:30px; margin-bottom:50px;">
                    <div><h2 style="color:#fff; border-bottom:2px solid #d4af37; padding-bottom:8px;">Albums</h2><div style="background:#0a0a0a; border-radius:16px; padding:10px;">${renderL(a.alb, '#d4af37')}</div></div>
                    <div><h2 style="color:#fff; border-bottom:2px solid #d4af37; padding-bottom:8px;">History</h2><div style="max-height: 450px; overflow-y: auto;">${renderR(a.runs)}</div></div>
                </div>
            </div>`;
    } catch(e) { app.innerHTML = "Erro ao carregar perfil."; }
}

// === FUNÇÕES DE CHARTS (ORIGINAIS) ===

async function loadRealTime() {
    const app = document.getElementById('app');
    document.body.className = 'theme-spotify';
    app.innerHTML = '<div class="skeleton"></div>'.repeat(6);
    try {
        const d = await fetch(API + "?action=getRealTime").then(r => r.json());
        const row = (l, c) => l.map(i => `<div class="chart-row" style="grid-template-columns:30px 45px 1fr 85px;"><div class="rank">${i.p}</div><img src="${i.c}"><div class="info-box"><b>${i.t}</b></div><div style="color:${c}; font-weight:900;">${i.s}</div></div>`).join('');
        app.innerHTML = `<div class="rt-grid"><div class="rt-col"><div class="rt-head" style="background:#1DB954;">Spotify</div>${row(d.spotify, '#1DB954')}</div><div class="rt-col"><div class="rt-head" style="background:#fff; color:#FA243C;">Apple</div>${row(d.apple, '#FA243C')}</div><div class="rt-col"><div class="rt-head" style="background:#ff0000; color:#fff;">YouTube</div>${row(d.youtube, '#fff')}</div></div>`;
    } catch(e) { app.innerHTML = "Erro de conexão."; }
}

async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    applyTheme(tab);
    app.innerHTML = '<div class="skeleton"></div>'.repeat(8);
    try {
        const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
        app.innerHTML = `<h2 style="text-align:center;">${tab}</h2><div class="filters"><select id="dateS" onchange="renderChart('${tab}', ${hasStyle})">${f.dates.map(d => `<option value="${d}">${d}</option>`).join('')}</select>${hasStyle ? `<select id="styleS" onchange="renderChart('${tab}', true)"><option value="">TODOS</option>${f.styles.map(s => `<option value="${s}">${s}</option>`).join('')}</select>` : ''}</div><div id="chart-area"></div>`;
        renderChart(tab, hasStyle);
    } catch(e) { app.innerHTML = "Erro ao carregar filtros."; }
}

async function renderChart(tab, hasStyle) {
    const area = document.getElementById('chart-area');
    const date = document.getElementById('dateS').value;
    const style = hasStyle ? document.getElementById('styleS').value : "";
    try {
        const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}&style=${style}`).then(r => r.json());
        area.innerHTML = res.map(i => `<div class="chart-row"><div class="rank">${i.pos}</div><div class="status ${i.st && i.st.includes('NEW') ? 'new' : (i.st && i.st.includes('↑') ? 'up' : 'down')}">${i.st || '-'}</div><img src="${i.capa}"> <div class="info-box"><b>${i.tit}</b><span>${i.art}</span></div><div class="stats-box"><b>${i.val}</b><small>TOTAL: ${i.tot}</small></div></div>`).join('');
    } catch(e) { area.innerHTML = "Erro ao carregar lista."; }
}

function applyTheme(tab) { const body = document.body; body.className = ''; if (!tab) return; const t = tab.toUpperCase(); if(t.includes('SPOTIFY')) body.classList.add('theme-spotify'); else if(t.includes('APPLE')) body.classList.add('theme-apple'); else if(t.includes('YOUTUBE')) body.classList.add('theme-youtube'); else if(t.includes('DIGITAL SALES')) body.classList.add('theme-digital'); else if(t.includes('BILLBOARD') || t.includes('ÁLBUNS')) body.classList.add('theme-billboard'); else body.classList.add('theme-spotify'); }
