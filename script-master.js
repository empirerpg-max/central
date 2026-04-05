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
            <a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn">Spotify Countries</a>
            <a href="monthly.html?p=SPOTIFY" class="sub-btn">Spotify Artists</a>
        </div>
    </div>
    <div class="menu-item">Apple Music
        <div class="submenu">
            <a href="charts.html?tab=APPLE MUSIC" class="sub-btn">Apple Global</a>
            <a href="monthly.html?p=APPLE MUSIC" class="sub-btn">Apple Artists</a>
        </div>
    </div>
    <div class="menu-item">YouTube
        <div class="submenu">
            <a href="charts.html?tab=YOUTUBE" class="sub-btn">YouTube Global</a>
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

// === HALL OF FAME: DIRETÓRIO E PERFIL ===

async function loadHOFList() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    document.body.className = 'theme-digital'; 
    try {
        const list = await fetch(API + "?action=getHOFList").then(r => r.json());
        let html = `<h2 style="text-align:center; font-family:'Figtree'; font-weight:900; font-size:32px; margin-bottom:30px; color:#fff; letter-spacing:2px;">ARTISTS DIRECTORY</h2>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:20px;">`;
        list.forEach(a => {
            html += `<div onclick="loadHOFProfile('${a.name}')" style="background:#111; border:1px solid #333; border-radius:12px; padding:20px; text-align:center; cursor:pointer; transition:0.3s;" onmouseover="this.style.borderColor='#d4af37';" onmouseout="this.style.borderColor='#333';">
                <img src="${a.img}" onerror="this.src='https://via.placeholder.com/150'" style="width:110px; height:110px; border-radius:50%; object-fit:cover; margin-bottom:15px; border:2px solid #d4af37;">
                <h3 style="margin:0; font-size:18px; color:#fff; font-family:'Figtree'; font-weight:900;">${a.name}</h3>
                <p style="margin:5px 0 0 0; font-size:11px; color:#d4af37; font-weight:800; text-transform:uppercase; letter-spacing:1px;">${a.style}</p>
            </div>`;
        });
        app.innerHTML = html + `</div>`;
    } catch(e) { app.innerHTML = `<p style="text-align:center;">Erro ao carregar artistas.</p>`; }
}

async function loadHOFProfile(artistName) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton" style="height:400px;"></div>';
    try {
        const a = await fetch(`${API}?action=getHOFProfile&artist=${encodeURIComponent(artistName)}`).then(r => r.json());
        const renderList = (list, color) => {
            if(!list || list.length === 0) return `<p style="color:#444; font-size:12px; padding:10px;">Sem dados.</p>`;
            return list.map((i, idx) => `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 5px; border-bottom:1px solid #1a1a1a; font-size:13px;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="color:#444; font-weight:900;">${idx+1}</span>
                        <span style="color:#fff; font-weight:600;">${i.t}</span>
                    </div>
                    <span style="color:${color}; font-weight:900;">${i.v}</span>
                </div>`).join('');
        };

        app.innerHTML = `
            <div style="max-width:1000px; margin:0 auto; font-family:'Inter', sans-serif;">
                <button onclick="loadHOFList()" style="background:transparent; border:none; color:#d4af37; cursor:pointer; font-weight:900; margin-bottom:20px; font-size:11px; letter-spacing:1px;">← VOLTAR AO DIRETÓRIO</button>

                <div style="display:flex; align-items:center; gap:35px; background:linear-gradient(135deg, #111 0%, #050505 100%); padding:40px; border-radius:24px; border:1px solid rgba(212,175,55,0.2); margin-bottom:35px;">
                    <img src="${a.img}" style="width:160px; height:160px; border-radius:50%; object-fit:cover; border:5px solid #d4af37;">
                    <div>
                        <h1 style="font-family:'Figtree'; font-size:50px; font-weight:900; margin:0; text-transform:uppercase; color:#fff;">${a.name}</h1>
                        <p style="color:#888; font-size:14px; font-weight:700;">🌎 ${a.country} • 🎵 ${a.style}</p>
                    </div>
                </div>

                <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:15px; margin-bottom:40px;">
                    <div class="info-card" style="text-align:center;"><div style="color:#d4af37; font-size:36px; font-weight:900;">${a.n1_hot100}</div><small>#1 HOT 100</small></div>
                    <div class="info-card" style="text-align:center;"><div style="color:#1DB954; font-size:36px; font-weight:900;">${a.n1_spotify}</div><small>#1 SPOTIFY</small></div>
                    <div class="info-card" style="text-align:center;"><div style="color:#ff0000; font-size:36px; font-weight:900;">${a.n1_youtube}</div><small>#1 YOUTUBE</small></div>
                    <div class="info-card" style="text-align:center;"><div style="color:#d4af37; font-size:36px; font-weight:900;">${a.n1_bb200}</div><small>#1 BB 200</small></div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:20px; margin-bottom:40px;">
                    <div><h2 style="font-size:16px; font-weight:900; border-bottom:2px solid #ff0000; padding-bottom:8px; color:#fff;">YOUTUBE</h2>${renderList(a.yt, '#ff0000')}</div>
                    <div><h2 style="font-size:16px; font-weight:900; border-bottom:2px solid #1DB954; padding-bottom:8px; color:#fff;">SPOTIFY</h2>${renderList(a.sp, '#1DB954')}</div>
                    <div><h2 style="font-size:16px; font-weight:900; border-bottom:2px solid #FA243C; padding-bottom:8px; color:#fff;">APPLE</h2>${renderList(a.am, '#FA243C')}</div>
                </div>

                <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:30px; margin-bottom:50px;">
                    <div><h2 style="font-size:16px; font-weight:900; border-bottom:2px solid #d4af37; padding-bottom:8px; color:#fff;">TOP ÁLBUNS</h2>${renderList(a.alb, '#d4af37')}</div>
                    <div><h2 style="font-size:16px; font-weight:900; border-bottom:2px solid #d4af37; padding-bottom:8px; color:#fff;">HISTORY</h2>
                        <div style="max-height: 400px; overflow-y: auto;">
                            ${a.runs.map(i => `<div style="background:rgba(255,255,255,0.03); padding:12px; border-radius:8px; margin-bottom:10px; border-left:4px solid #d4af37;"><b style="color:#fff; font-size:12px; display:block;">${i.t}</b><div style="color:#d4af37; font-family:monospace; font-size:12px;">${i.v}</div></div>`).join('')}
                        </div>
                    </div>
                </div>
            </div>`;
    } catch(e) { console.error(e); }
}

// === FILTROS FLUIDOS E MENSAL ===

async function initMonthly(p) {
    const app = document.getElementById('app');
    applyTheme(p);
    app.innerHTML = `<div class="filter-group">
        <div id="year-pills" class="pill-container"></div>
        <div id="month-pills" class="pill-container"></div>
        <div id="artist-select-wrap" style="display:none; width:100%; max-width:400px;"><select id="aS" onchange="renderM('${p}')"></select></div>
    </div><div id="profile-area"></div>`;
    
    const years = await fetch(`${API}?action=getMonthlyYears`).then(r => r.json());
    document.getElementById('year-pills').innerHTML = years.map(y => `<div class="pill year-pill" onclick="handleYearClick(this, '${y}', '${p}')">${y}</div>`).join('');
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
    document.getElementById('aS').innerHTML = `<option value="">SELECIONE O ARTISTA</option>` + artists.map(a => `<option value="${a}">${a}</option>`).join('');
}

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

        if (p.includes('SPOTIFY')) {
            profile.innerHTML = `<div class="sp-banner" style="background-image: url('${art.capa}');"><div class="sp-banner-content"><h1 class="sp-artist-name">${a}</h1><p style="color:#fff; font-weight:700;">${art.ov} ouvintes mensais • <span style="color:#1DB954;">#${art.rank} no mundo</span></p></div></div>
            <div class="sp-action-bar"><button class="sp-play-btn">▶</button><button class="sp-follow-btn">Seguindo</button></div>
            <div class="sp-main-grid">
                <div><h2>Populares</h2>${art.m.map((mus, idx) => `<div class="chart-row" style="background:transparent; grid-template-columns: 30px 45px 1fr 100px; border-bottom:1px solid #222;"><span>${idx+1}</span><img src="${mus.c}"><div><b>${mus.t}</b></div><div style="text-align:right; color:#1DB954; font-weight:900;">${mus.s}</div></div>`).join('')}</div>
                <div><h2>Sobre</h2><div class="sp-about-card">${art.bio}</div></div>
            </div>`;
        } else if (p.includes('YOUTUBE')) {
            profile.innerHTML = `<div class="channel-header"><div class="yt-banner" style="background-image: url('${art.capa}');"></div>
            <div class="channel-meta"><img src="${art.capa}" class="avatar"><div><h2 class="c-name">${a}</h2><div class="c-stats">${art.ov} views mensais • TOP ${art.rank}</div></div></div></div>
            <div class="main-grid"><div><div class="section-label">Vídeos</div>${art.m.map(mus => `<div style="display:flex; gap:15px; margin-bottom:20px;"><img src="${mus.c}" style="width:160px; border-radius:8px;"><div><b>${mus.t}</b><br>${mus.s} views</div></div>`).join('')}</div><div><div class="section-label">Bio</div><p>${art.bio}</p></div></div>`;
        }
    } catch(e) { profile.innerHTML = "Erro ao carregar perfil."; }
}

// === REAL TIME E CHARTS ===

async function loadRealTime() {
    const app = document.getElementById('app');
    document.body.className = 'theme-spotify';
    app.innerHTML = '<div class="skeleton"></div>'.repeat(6);
    try {
        const d = await fetch(API + "?action=getRealTime").then(r => r.json());
        const row = (l, c) => l.map(i => `<div class="rt-row"><span style="color:#666; font-weight:900;">${i.p}</span><img src="${i.c}"><div><b>${i.t}</b></div><div style="color:${c}; font-weight:900; text-align:right;">${i.s}</div></div>`).join('');
        app.innerHTML = `<div class="rt-grid"><div class="rt-col"><div class="rt-head" style="background:#1DB954; color:#000;">Spotify</div>${row(d.spotify, '#1DB954')}</div><div class="rt-col"><div class="rt-head" style="background:#fff; color:#FA243C;">Apple</div>${row(d.apple, '#FA243C')}</div><div class="rt-col"><div class="rt-head" style="background:#f00; color:#fff;">YouTube</div>${row(d.youtube, '#fff')}</div></div>`;
    } catch(e) { app.innerHTML = "Erro de conexão."; }
}

async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    applyTheme(tab);
    app.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
    app.innerHTML = `<h2 style="text-align:center; text-transform:uppercase;">${tab}</h2>
    <div class="filter-group">
        <div class="pill-container">${f.dates.map(d => `<div class="pill date-pill" onclick="this.parentElement.querySelectorAll('.pill').forEach(p=>p.classList.remove('active')); this.classList.add('active'); renderChart('${tab}', ${hasStyle})">${d}</div>`).join('')}</div>
        ${hasStyle ? `<div class="pill-container" style="margin-top:10px;">${f.styles.map(s => `<div class="pill style-pill" onclick="this.parentElement.querySelectorAll('.pill').forEach(p=>p.classList.remove('active')); this.classList.add('active'); renderChart('${tab}', true)">${s}</div>`).join('')}</div>` : ''}
    </div><div id="chart-area"></div>`;
    const firstPill = document.querySelector('.date-pill'); if(firstPill) firstPill.click();
}

async function renderChart(tab, hasStyle) {
    const area = document.getElementById('chart-area');
    const date = document.querySelector('.date-pill.active')?.innerText;
    const style = hasStyle ? document.querySelector('.style-pill.active')?.innerText : "";
    if(!date) return;
    area.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}&style=${style || ""}`).then(r => r.json());
    area.innerHTML = res.map(i => `<div class="chart-row"><div class="rank">${i.pos}</div><div class="status ${i.st.includes('↑')?'up':i.st.includes('↓')?'down':'new'}">${i.st||'-'}</div><img src="${i.capa}" onerror="this.src='https://via.placeholder.com/150'"><div><b>${i.tit}</b><br><small>${i.art}</small></div><div class="stats-box"><b>${i.val}</b></div></div>`).join('');
}

function applyTheme(tab) {
    const body = document.body; body.className = '';
    if(tab.includes('SPOTIFY')) body.classList.add('theme-spotify');
    else if(tab.includes('APPLE')) body.classList.add('theme-apple');
    else if(tab.includes('YOUTUBE')) body.classList.add('theme-youtube');
    else if(tab.includes('BILLBOARD') || tab.includes('ÁLBUNS')) body.classList.add('theme-billboard');
}
