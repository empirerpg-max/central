// ATENÇÃO: COLOQUE A SUA API DO GOOGLE AQUI
const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec"; 

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

// === SISTEMA DE FILTROS EM CASCATA (MONTHLY) - DESIGN CHIQUE ===

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

// === RENDERIZAÇÃO DOS PERFIS MENSAIS (DESIGN MODERNO) ===

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
                    <img src="${art.capa}" class="avatar" onerror="this.src='https://via.placeholder.com/120'">
                    <div><h2 class="c-name">${a}</h2><div class="c-stats">${art.ov} views este mês</div></div>
                </div>
            </div>
            <div class="main-grid">
                <div><div class="section-label">Popular Videos</div>${art.m.map(mus => `<div class="v-item"><img src="${mus.c}" class="v-thumb"><div><div style="font-weight:700; color:#fff;">${mus.t}</div><div style="color:#666; font-size:12px;">${mus.s} views</div></div></div>`).join('')}</div>
                <div><div class="section-label">About</div><div class="about-content">${art.bio}</div></div>
            </div>`;
        } else if (p.toUpperCase().includes('SPOTIFY')) {
            profile.innerHTML = `
            <div class="sp-banner" style="background-image: url('${art.capa}');"><div class="sp-banner-content"><h1 class="sp-artist-name">${a}</h1><p style="font-weight:400; opacity:0.8;">${art.ov} ouvintes mensais</p></div></div>
            <div class="sp-main-grid">
                <div><h2 style="font-size:12px; letter-spacing:2px; color:#444; text-transform:uppercase; margin-bottom:20px;">Top Tracks</h2>${art.m.map((mus, idx) => `<div class="sp-song-row"><span style="color:#333; font-weight:800;">${idx+1}</span><img src="${mus.c}"><div><div style="color:#fff; font-size:14px;">${mus.t}</div></div><div style="color:#666; text-align:right; font-size:12px;">${mus.s}</div></div>`).join('')}</div>
                <div><h2 style="font-size:12px; letter-spacing:2px; color:#444; text-transform:uppercase; margin-bottom:20px;">Biography</h2><div class="sp-about-card">${art.bio}</div></div>
            </div>`;
        } else if (p.toUpperCase().includes('APPLE')) {
            profile.innerHTML = `
            <div class="am-hero" style="background-image: url('${art.capa}');"><div class="am-hero-content"><div class="am-play-icon">▶</div><h1 class="am-artist-name">${a}</h1></div></div>
            <div style="display:grid; grid-template-columns: 1fr 2fr; gap:40px; padding:20px;">
                <div><h2 style="font-size:12px; letter-spacing:2px; color:#444; text-transform:uppercase; margin-bottom:20px;">Artist Info</h2><p style="font-size:20px; font-weight:700;">${art.ov} ouvintes</p><p style="color:#666; font-size:14px; line-height:1.6;">${art.bio}</p></div>
                <div><h2 style="font-size:12px; letter-spacing:2px; color:#444; text-transform:uppercase; margin-bottom:20px;">Top Songs</h2>${art.m.map(mus => `<div style="display:grid; grid-template-columns: 50px 1fr 100px; align-items:center; padding:12px 0; border-bottom:1px solid #1a1a1a;"><img src="${mus.c}" style="width:40px; border-radius:6px;"><span style="font-size:14px; padding-left:15px; font-weight:600;">${mus.t}</span><span style="text-align:right; color:#666; font-size:12px;">${mus.s}</span></div>`).join('')}</div>
            </div>`;
        }
    } catch(e) { profile.innerHTML = "Erro ao carregar perfil."; }
}

// === HALL OF FAME (DIRETÓRIO E PERFIL MODERNO) ===

async function loadHOFList() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    document.body.className = 'theme-digital'; 
    try {
        const list = await fetch(API + "?action=getHOFList").then(r => r.json());
        let html = `<h2 style="text-align:center; font-family:'Plus Jakarta Sans'; font-weight:800; font-size:26px; margin-bottom:40px; color:#fff; letter-spacing:4px;">ARTISTS DIRECTORY</h2><div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:25px;">`;
        list.forEach(a => {
            html += `<div onclick="loadHOFProfile('${a.name}')" style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:24px; padding:25px; text-align:center; cursor:pointer; transition:0.4s;" onmouseover="this.style.borderColor='rgba(255,255,255,0.2)'; this.style.transform='translateY(-5px)';" onmouseout="this.style.borderColor='rgba(255,255,255,0.05)'; this.style.transform='translateY(0)';">
                <img src="${a.img}" style="width:110px; height:110px; border-radius:50%; object-fit:cover; margin-bottom:18px; border:2px solid rgba(255,255,255,0.1);"><h3 style="margin:0; font-size:15px; color:#fff; font-family:'Plus Jakarta Sans'; font-weight:700;">${a.name}</h3><p style="margin:8px 0 0 0; font-size:10px; color:#555; text-transform:uppercase; letter-spacing:1px; font-weight:700;">${a.country} • ${a.style}</p></div>`;
        });
        app.innerHTML = html + `</div>`;
    } catch(e) { app.innerHTML = "Erro ao carregar diretório."; }
}

async function loadHOFProfile(artistName) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton" style="height:400px; border-radius:32px;"></div>';
    try {
        const a = await fetch(`${API}?action=getHOFProfile&artist=${encodeURIComponent(artistName)}`).then(r => r.json());
        const renderL = (l, c) => l.map((i, idx) => `<div class="chart-row" style="grid-template-columns: 30px 1fr 100px; padding: 12px 5px;"><div class="rank" style="color:#222;">${idx+1}</div><div class="info-box"><b style="font-size:13px;">${i.t}</b></div><span style="color:${c}; font-weight:800; font-size:12px; text-align:right;">${i.v}</span></div>`).join('');
        const renderR = (l) => l.map(i => `<div style="background:rgba(255,255,255,0.02); padding:15px; border-radius:12px; margin-bottom:12px; border-left:3px solid #fff;"><b style="color:#fff; font-size:12px; text-transform:uppercase; letter-spacing:1px;">${i.t}</b><div style="color:#666; font-family:monospace; font-size:12px; margin-top:5px; letter-spacing:1px; overflow-x:auto;">${i.v}</div></div>`).join('');
        
        app.innerHTML = `
            <div style="max-width:1000px; margin:0 auto;">
                <button onclick="loadHOFList()" style="background:transparent; border:none; color:#666; cursor:pointer; font-weight:800; margin-bottom:25px; font-size:10px; letter-spacing:2px;">← VOLTAR</button>
                <div class="artist-hero" style="background-image: url('${a.img}');"><div class="hero-overlay"></div><div class="hero-content"><h1>${a.name}</h1><p style="color:#888; margin-top:15px;">${a.country} • ${a.style}</p></div></div>
                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:15px; margin-bottom:50px;">
                    <div style="background:rgba(255,255,255,0.02); padding:25px; border-radius:20px; text-align:center; border:1px solid rgba(255,255,255,0.05);"><div style="color:#fff; font-size:32px; font-weight:800;">${a.n1_hot100}</div><div style="color:#444; font-size:9px; font-weight:800; letter-spacing:1px; margin-top:5px;">#1 HOT 100</div></div>
                    <div style="background:rgba(255,255,255,0.02); padding:25px; border-radius:20px; text-align:center; border:1px solid rgba(255,255,255,0.05);"><div style="color:#1DB954; font-size:32px; font-weight:800;">${a.n1_spotify}</div><div style="color:#444; font-size:9px; font-weight:800; letter-spacing:1px; margin-top:5px;">#1 SPOTIFY</div></div>
                    <div style="background:rgba(255,255,255,0.02); padding:25px; border-radius:20px; text-align:center; border:1px solid rgba(255,255,255,0.05);"><div style="color:#ff0000; font-size:32px; font-weight:800;">${a.n1_youtube}</div><div style="color:#444; font-size:9px; font-weight:800; letter-spacing:1px; margin-top:5px;">#1 YOUTUBE</div></div>
                    <div style="background:rgba(255,255,255,0.02); padding:25px; border-radius:20px; text-align:center; border:1px solid rgba(255,255,255,0.05);"><div style="color:#fff; font-size:32px; font-weight:800;">${a.n1_bb200}</div><div style="color:#444; font-size:9px; font-weight:800; letter-spacing:1px; margin-top:5px;">#1 BB 200</div></div>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:30px; margin-bottom:50px;">
                    <div><h2 style="color:#444; font-size:12px; letter-spacing:2px; text-transform:uppercase; margin-bottom:20px;">YouTube</h2>${renderL(a.yt, '#ff0000')}</div>
                    <div><h2 style="color:#444; font-size:12px; letter-spacing:2px; text-transform:uppercase; margin-bottom:20px;">Spotify</h2>${renderL(a.sp, '#1DB954')}</div>
                    <div><h2 style="color:#444; font-size:12px; letter-spacing:2px; text-transform:uppercase; margin-bottom:20px;">Apple</h2>${renderL(a.am, '#FA243C')}</div>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:40px; margin-bottom:60px;">
                    <div><h2 style="color:#444; font-size:12px; letter-spacing:2px; text-transform:uppercase; margin-bottom:20px;">Albums</h2>${renderL(a.alb, '#fff')}</div>
                    <div><h2 style="color:#444; font-size:12px; letter-spacing:2px; text-transform:uppercase; margin-bottom:20px;">Hot 100 Chart Runs</h2><div style="max-height: 400px; overflow-y: auto;">${renderR(a.runs)}</div></div>
                </div>
            </div>`;
    } catch(e) { app.innerHTML = "Erro ao carregar perfil."; }
}

// === REAL TIME (CHIQUE) ===

async function loadRealTime() {
    const app = document.getElementById('app');
    document.body.className = 'theme-spotify';
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    try {
        const d = await fetch(API + "?action=getRealTime").then(r => r.json());
        const row = (l, c) => l.map(i => `<div class="chart-row" style="grid-template-columns: 30px 45px 1fr 80px; padding: 12px 15px;"><div class="rank" style="color:#333;">${i.p}</div><img src="${i.c}" style="width:35px; height:35px; border-radius:6px;"><div class="info-box"><b style="font-size:13px;">${i.t}</b></div><div style="color:${c}; font-weight:800; font-size:12px; text-align:right;">${i.s}</div></div>`).join('');
        app.innerHTML = `<div class="rt-grid"><div class="rt-col"><div class="rt-head" style="color:#1DB954;">Spotify</div>${row(d.spotify, '#1DB954')}</div><div class="rt-col"><div class="rt-head" style="color:#fa243c;">Apple Music</div>${row(d.apple, '#fa243c')}</div><div class="rt-col"><div class="rt-head" style="color:#fff;">YouTube</div>${row(d.youtube, '#fff')}</div></div>`;
    } catch(e) { app.innerHTML = "Erro de conexão."; }
}

// === FUNÇÕES DE CHARTS ORIGINAIS (INTOCADAS) ===

async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    applyTheme(tab);
    app.innerHTML = '<div class="skeleton"></div>'.repeat(8);
    try {
        const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
        app.innerHTML = `<h2 style="text-align:center; font-family:'Plus Jakarta Sans'; letter-spacing:4px;">${tab}</h2><div class="filter-group"><div class="pill-container">${f.dates.map((d, idx) => `<div class="pill date-pill ${idx===0?'active':''}" onclick="renderChartByPill(this, '${tab}', '${d}', ${hasStyle})">${d}</div>`).join('')}</div>${hasStyle ? `<div class="pill-container">${f.styles.map(s => `<div class="pill style-pill" onclick="renderChartByPill(this, '${tab}', null, true, '${s}')">${s}</div>`).join('')}</div>` : ''}</div><div id="chart-area"></div>`;
        renderChart(tab, hasStyle);
    } catch(e) { app.innerHTML = "Erro ao carregar filtros."; }
}

// Auxiliar para os novos botões pílula nos charts
function renderChartByPill(el, tab, date, hasStyle, style) {
    if(date) {
        document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
    }
    if(style || style === "") {
        document.querySelectorAll('.style-pill').forEach(p => p.classList.remove('active'));
        el.classList.add('active');
    }
    renderChart(tab, hasStyle);
}

async function renderChart(tab, hasStyle) {
    const area = document.getElementById('chart-area');
    const dateEl = document.querySelector('.date-pill.active');
    const styleEl = document.querySelector('.style-pill.active');
    const date = dateEl ? dateEl.innerText : "";
    const style = styleEl ? styleEl.innerText : "";
    
    try {
        const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}&style=${style}`).then(r => r.json());
        area.innerHTML = res.map(i => `
            <div class="chart-row" style="grid-template-columns: 40px 50px 1fr 100px;">
                <div class="rank">${i.pos}</div>
                <div class="status ${i.st && i.st.includes('NEW') ? 'new' : (i.st && i.st.includes('↑') ? 'up' : 'down')}" style="font-size:9px;">${i.st || '-'}</div>
                <img src="${i.capa}"> 
                <div class="info-box"><b>${i.tit}</b><span>${i.art}</span></div>
                <div style="text-align:right;">
                    <b style="font-size:14px; color:#fff;">${i.val}</b>
                    <small style="display:block; font-size:9px; color:#444; margin-top:4px;">TOTAL: ${i.tot}</small>
                </div>
            </div>`).join('');
    } catch(e) { area.innerHTML = "Erro ao carregar lista."; }
}

function applyTheme(tab) { const body = document.body; body.className = ''; if (!tab) return; const t = tab.toUpperCase(); if(t.includes('SPOTIFY')) body.classList.add('theme-spotify'); else if(t.includes('APPLE')) body.classList.add('theme-apple'); else if(t.includes('YOUTUBE')) body.classList.add('theme-youtube'); else if(t.includes('DIGITAL SALES')) body.classList.add('theme-digital'); else if(t.includes('BILLBOARD') || t.includes('ÁLBUNS')) body.classList.add('theme-billboard'); else body.classList.add('theme-spotify'); }
