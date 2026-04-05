// ATENÇÃO: COLOQUE A SUA API DO GOOGLE AQUI
const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec"; 

function buildMenu() {
    if(!document.getElementById('mobile-bt')) {
        const btn = document.createElement('div');
        btn.id = 'mobile-bt'; btn.className = 'menu-toggle';
        btn.onclick = toggleMenu; btn.innerHTML = '<div></div><div></div><div></div>';
        document.body.appendChild(btn);
    }
    const navMenu = document.getElementById('menu-nav');
    if(!navMenu) return;
    navMenu.innerHTML = `
    <a href="index.html" class="menu-item" onclick="toggleMenu()">Início / Real Time</a>
    <a href="artists.html" class="menu-item" style="color: #d4af37;" onclick="toggleMenu()">🌟 ARTISTS</a>
    <div class="menu-item">Billboard Hot 100
        <div class="submenu">
            <a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn" onclick="toggleMenu()">Billboard Hot 100</a>
            <a href="charts.html?tab=BILLBOARD HOT 100&style=true" class="sub-btn" onclick="toggleMenu()">Hot 100 by Style</a>
        </div>
    </div>
    <div class="menu-item">Spotify Charts
        <div class="submenu">
            <a href="charts.html?tab=SPOTIFY" class="sub-btn" onclick="toggleMenu()">Spotify Global</a>
            <a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn" onclick="toggleMenu()">Spotify Countries</a>
            <a href="monthly.html?p=SPOTIFY" class="sub-btn" onclick="toggleMenu()">Spotify Artists</a>
        </div>
    </div>
    <div class="menu-item">Apple Music
        <div class="submenu">
            <a href="charts.html?tab=APPLE MUSIC" class="sub-btn" onclick="toggleMenu()">Apple Global</a>
            <a href="monthly.html?p=APPLE MUSIC" class="sub-btn" onclick="toggleMenu()">Apple Artists</a>
        </div>
    </div>
    <div class="menu-item">YouTube
        <div class="submenu">
            <a href="charts.html?tab=YOUTUBE" class="sub-btn" onclick="toggleMenu()">YouTube Global</a>
            <a href="monthly.html?p=YOUTUBE" class="sub-btn" onclick="toggleMenu()">YouTube Artists</a>
        </div>
    </div>
    <a href="charts.html?tab=DIGITAL SALES" class="menu-item" onclick="toggleMenu()">Digital Sales</a>
    <div class="menu-item">Billboard 200
        <div class="submenu">
            <a href="charts.html?tab=DADOS ÁLBUNS" class="sub-btn" onclick="toggleMenu()">Billboard 200</a>
            <a href="charts.html?tab=DADOS ÁLBUNS&style=true" class="sub-btn" onclick="toggleMenu()">Billboard 200 by Style</a>
        </div>
    </div>`;
}

function toggleMenu() { if(window.innerWidth <= 768) document.getElementById('menu-nav').classList.toggle('active'); }

// === FILTROS FLUIDOS (YEAR -> MONTH -> ARTIST) ===

async function initMonthly(p) {
    const app = document.getElementById('app'); applyTheme(p);
    app.innerHTML = `<div class="filter-group"><div id="year-pills" class="pill-container"></div><div id="month-pills" class="pill-container"></div>
    <div id="artist-select-wrap" style="display:none; width:100%; max-width:400px;"><select id="aS" onchange="renderM('${p}')"></select></div></div><div id="profile-area"></div>`;
    const years = await fetch(`${API}?action=getMonthlyYears`).then(r => r.json());
    document.getElementById('year-pills').innerHTML = years.map(y => `<div class="pill year-pill" onclick="handleYearClick(this, '${y}', '${p}')">${y}</div>`).join('');
}

async function handleYearClick(el, year, p) {
    document.querySelectorAll('.year-pill').forEach(b => b.classList.remove('active')); el.classList.add('active');
    document.getElementById('month-pills').innerHTML = '<div class="skeleton" style="width:100px; height:30px;"></div>';
    const months = await fetch(`${API}?action=getMonthlyDates&year=${year}`).then(r => r.json());
    document.getElementById('month-pills').innerHTML = months.map(m => `<div class="pill month-pill" onclick="handleMonthClick(this, '${m}', '${year}', '${p}')">${m}</div>`).join('');
}

async function handleMonthClick(el, month, year, p) {
    document.querySelectorAll('.month-pill').forEach(b => b.classList.remove('active')); el.classList.add('active');
    document.getElementById('artist-select-wrap').style.display = 'block';
    const artists = await fetch(`${API}?action=getArtists&platform=${p}&month=${month}&year=${year}`).then(r => r.json());
    document.getElementById('aS').innerHTML = `<option value="">SELECT ARTIST</option>` + artists.map(a => `<option value="${a}">${a}</option>`).join('');
}

// === PERFIS MENSAL (SPOTIFY / YT / APPLE) ===

async function renderM(p) {
    const profile = document.getElementById('profile-area');
    const a = document.getElementById('aS').value;
    const y = document.querySelector('.year-pill.active').innerText;
    const m = document.querySelector('.month-pill.active').innerText;
    if(!a) return; profile.innerHTML = '<div class="skeleton" style="height:400px;"></div>';
    const data = await fetch(`${API}?action=getMonthlyStats&platform=${p}&month=${m}&year=${y}&artist=${a}`).then(r => r.json());
    const art = data[0];

    if (p.toUpperCase().includes('SPOTIFY')) {
        profile.innerHTML = `
        <div class="sp-banner" style="background-image: url('${art.capa}');"><div class="sp-banner-content"><h1 class="sp-artist-name">${a}</h1><p style="color:#fff; font-weight:700;">${art.ov} ouvintes mensais • ${art.rank !== '-' ? `<span style="color:#1DB954;">#${art.rank} no mundo</span>` : ''}</p></div></div>
        <div class="sp-action-bar"><button class="sp-play-btn">▶</button><button class="sp-follow-btn">Seguindo</button></div>
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:40px;">
            <div><h2>Populares</h2>${art.m.map((mus, idx) => `<div class="rt-row" style="background:transparent; border-bottom:1px solid #222;"><span>${idx+1}</span><img src="${mus.c}"><b>${mus.t}</b><span style="text-align:right; color:#1DB954; font-weight:900;">${mus.s}</span></div>`).join('')}</div>
            <div><h2>Sobre</h2><div class="sp-about-card">${art.bio}</div></div>
        </div>`;
    } else if (p.toUpperCase().includes('YOUTUBE')) {
        profile.innerHTML = `
        <div class="channel-header"><div class="yt-banner" style="background-image: url('${art.capa}');"></div>
            <div class="channel-meta"><img src="${art.capa}" class="avatar"><div><h2 style="font-size:40px;">${a}</h2><p style="color:#aaa;">${art.ov} visualizações • ${art.rank !== '-' ? `TOP ${art.rank}` : ''}</p></div></div>
        </div>
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:40px; padding:20px;"><div><h2 style="border-left:4px solid #f00; padding-left:15px;">VÍDEOS POPULARES</h2>${art.m.map(mus => `<div style="display:flex; gap:15px; margin-bottom:20px;"><img src="${mus.c}" style="width:160px; border-radius:8px;"><div><b>${mus.t}</b><br><small style="color:#888;">${mus.s} views</small></div></div>`).join('')}</div>
        <div><h2>BIO</h2><p style="color:#aaa; line-height:1.6;">${art.bio}</p></div></div>`;
    }
}

// === HALL OF FAME: DIRETÓRIO E PERFIL DELUXE ===

async function loadHOFList() {
    const app = document.getElementById('app'); document.body.className = 'theme-digital'; 
    const list = await fetch(API + "?action=getHOFList").then(r => r.json());
    let html = `<h2 style="text-align:center; font-family:'Figtree'; font-weight:900; font-size:32px; margin-bottom:30px; letter-spacing:2px;">ARTISTS DIRECTORY</h2><div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:20px;">`;
    list.forEach(a => {
        html += `<div onclick="loadHOFProfile('${a.name}')" style="background:#111; border:1px solid #333; border-radius:12px; padding:20px; text-align:center; cursor:pointer; transition:0.3s;" onmouseover="this.style.borderColor='var(--gold)';" onmouseout="this.style.borderColor='#333';">
            <img src="${a.img}" style="width:110px; height:110px; border-radius:50%; object-fit:cover; margin-bottom:15px; border:2px solid var(--gold);">
            <h3 style="margin:0; font-size:18px; color:#fff;">${a.name}</h3><p style="margin:5px 0 0 0; font-size:11px; color:var(--gold); font-weight:900; text-transform:uppercase;">${a.style}</p></div>`;
    });
    app.innerHTML = html + `</div>`;
}

async function loadHOFProfile(artistName) {
    const app = document.getElementById('app');
    const a = await fetch(`${API}?action=getHOFProfile&artist=${encodeURIComponent(artistName)}`).then(r => r.json());
    const renderList = (list, color) => list.map((i, idx) => `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #1a1a1a;"><div style="display:flex; gap:10px;"><span style="color:#444;">${idx+1}</span><span style="color:#fff;">${i.t}</span></div><span style="color:${color}; font-weight:900;">${i.v}</span></div>`).join('');
    
    app.innerHTML = `
        <div style="max-width:1000px; margin:0 auto;"><button onclick="loadHOFList()" style="background:transparent; border:none; color:var(--gold); cursor:pointer; font-weight:900; margin-bottom:20px;">← VOLTAR</button>
            <div style="display:flex; align-items:center; gap:35px; background:linear-gradient(135deg, #111 0%, #050505 100%); padding:40px; border-radius:24px; border:1px solid rgba(212,175,55,0.2); margin-bottom:35px;"><img src="${a.img}" style="width:160px; height:160px; border-radius:50%; object-fit:cover; border:5px solid var(--gold);">
            <div><h1 style="font-family:'Figtree'; font-size:50px; font-weight:900; margin:0; color:#fff;">${a.name}</h1><p style="color:#888;">${a.country} • ${a.style}</p></div></div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:15px; margin-bottom:40px;">
                <div class="info-card" style="text-align:center;"><div style="color:var(--gold); font-size:32px; font-weight:900;">${a.n1_hot100}</div><small>#1 HOT 100</small></div>
                <div class="info-card" style="text-align:center;"><div style="color:#1DB954; font-size:32px; font-weight:900;">${a.n1_spotify}</div><small>#1 SPOTIFY</small></div>
                <div class="info-card" style="text-align:center;"><div style="color:#ff0000; font-size:32px; font-weight:900;">${a.n1_youtube}</div><small>#1 YOUTUBE</small></div>
                <div class="info-card" style="text-align:center;"><div style="color:var(--gold); font-size:32px; font-weight:900;">${a.n1_bb200}</div><small>#1 BB 200</small></div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:25px; margin-bottom:40px;">
                <div><h2 style="color:#fff; font-size:16px; border-bottom:2px solid #ff0000; padding-bottom:8px;">YOUTUBE</h2>${renderList(a.yt, '#ff0000')}</div>
                <div><h2 style="color:#fff; font-size:16px; border-bottom:2px solid #1DB954; padding-bottom:8px;">SPOTIFY</h2>${renderList(a.sp, '#1DB954')}</div>
                <div><h2 style="color:#fff; font-size:16px; border-bottom:2px solid #FA243C; padding-bottom:8px;">APPLE</h2>${renderList(a.am, '#FA243C')}</div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:30px;">
                <div><h2 style="color:#fff; font-size:16px; border-bottom:2px solid var(--gold); padding-bottom:8px;">TOP ÁLBUNS</h2>${renderList(a.alb, var(--gold))}</div>
                <div><h2 style="color:#fff; font-size:16px; border-bottom:2px solid var(--gold); padding-bottom:8px;">HISTORY</h2>
                    <div style="max-height: 400px; overflow-y: auto;">
                        ${a.runs.map(i => `<div style="background:rgba(255,255,255,0.03); padding:10px; border-radius:8px; margin-bottom:8px; border-left:3px solid var(--gold);"><b style="font-size:13px;">${i.t}</b><div style="color:var(--gold); font-family:monospace; font-size:12px; overflow-x:auto;">${i.v}</div></div>`).join('')}
                    </div>
                </div>
            </div></div>`;
}

// === CHARTS & REAL TIME (ORIGINAIS) ===

async function loadRealTime() {
    const app = document.getElementById('app'); applyTheme('SPOTIFY');
    const d = await fetch(API + "?action=getRealTime").then(r => r.json());
    const row = (l, c) => l.map(i => `<div class="rt-row"><span style="color:#666; font-weight:900;">${i.p}</span><img src="${i.c}"><div><b>${i.t}</b></div><div style="color:${c}; font-weight:900; text-align:right;">${i.s}</div></div>`).join('');
    app.innerHTML = `<div class="rt-grid"><div class="rt-col"><div class="rt-head" style="background:#1DB954; color:#000;">Spotify</div>${row(d.spotify, '#1DB954')}</div><div class="rt-col"><div class="rt-head" style="background:#fff; color:#FA243C;">Apple</div>${row(d.apple, '#FA243C')}</div><div class="rt-col"><div class="rt-head" style="background:#f00;">YouTube</div>${row(d.youtube, '#fff')}</div></div>`;
}

async function initChart(tab, hasStyle) {
    const app = document.getElementById('app'); applyTheme(tab);
    const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
    app.innerHTML = `<h2 style="text-align:center;">${tab}</h2><div class="filter-group"><div class="pill-container">${f.dates.map(d => `<div class="pill date-pill" onclick="this.parentElement.querySelectorAll('.pill').forEach(p=>p.classList.remove('active')); this.classList.add('active'); renderChart('${tab}', ${hasStyle})">${d}</div>`).join('')}</div></div><div id="chart-area"></div>`;
    // Forçar a primeira data a ficar ativa
    const firstPill = document.querySelector('.date-pill'); if(firstPill) firstPill.click();
}

async function renderChart(tab, hasStyle) {
    const area = document.getElementById('chart-area');
    const date = document.querySelector('.date-pill.active')?.innerText;
    if(!date) return;
    const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}`).then(r => r.json());
    area.innerHTML = res.map(i => `<div class="chart-row"><div class="rank">${i.pos}</div><div class="status ${i.st.includes('↑')?'up':i.st.includes('↓')?'down':'new'}">${i.st||'-'}</div><img src="${i.capa}"><div><b>${i.tit}</b><br><small>${i.art}</small></div><div class="stats-box"><b>${i.val}</b></div></div>`).join('');
}

function applyTheme(t) { document.body.className = ''; if(t.includes('SPOTIFY')) document.body.classList.add('theme-spotify'); else if(t.includes('APPLE')) document.body.classList.add('theme-apple'); else if(t.includes('YOUTUBE')) document.body.classList.add('theme-youtube'); else if(t.includes('BILLBOARD')) document.body.classList.add('theme-billboard'); }
