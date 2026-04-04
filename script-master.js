// ATENÇÃO: COLOQUE A SUA API DO GOOGLE AQUI
const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec"; 

function buildMenu() {
    // Cria botão mobile se não existir
    if(!document.getElementById('mobile-bt')) {
        const btn = document.createElement('div');
        btn.id = 'mobile-bt';
        btn.className = 'menu-toggle';
        btn.onclick = toggleMenu;
        btn.innerHTML = '<div></div><div></div><div></div>';
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
            <a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn" onclick="toggleMenu()">Spotify by Country</a>
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

function toggleMenu() {
    const nav = document.getElementById('menu-nav');
    if(window.innerWidth <= 768) {
        nav.classList.toggle('active');
    }
}

// === FILTROS EM CASCATA (MONTHLY) ===
async function initMonthly(p) {
    const app = document.getElementById('app');
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
        document.getElementById('year-pills').innerHTML = years.map(y => `<div class="pill year-pill" onclick="handleYearClick(this, '${y}', '${p}')">${y}</div>`).join('');
    } catch(e) { console.error(e); }
}

async function handleYearClick(el, year, p) {
    document.querySelectorAll('.year-pill').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('month-pills').innerHTML = '<div class="skeleton" style="width:80px;height:30px;"></div>';
    try {
        const months = await fetch(`${API}?action=getMonthlyDates&year=${year}`).then(r => r.json());
        document.getElementById('month-pills').innerHTML = months.map(m => `<div class="pill month-pill" onclick="handleMonthClick(this, '${m}', '${year}', '${p}')">${m}</div>`).join('');
    } catch(e) { console.error(e); }
}

async function handleMonthClick(el, month, year, p) {
    document.querySelectorAll('.month-pill').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    const selectWrap = document.getElementById('artist-select-wrap');
    selectWrap.style.display = 'block';
    try {
        const artists = await fetch(`${API}?action=getArtists&platform=${p}&month=${month}&year=${year}`).then(r => r.json());
        document.getElementById('aS').innerHTML = `<option value="">SELECIONE O ARTISTA</option>` + artists.map(a => `<option value="${a}">${a}</option>`).join('');
    } catch(e) { console.error(e); }
}

// === RENDERIZAÇÃO DOS PERFIS MENSAL ===
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
        if (p.toUpperCase().includes('SPOTIFY')) {
            profile.innerHTML = `<div class="sp-banner" style="background-image: url('${art.capa}');"><div class="sp-banner-content"><h1 class="sp-artist-name">${a}</h1><p>${art.ov} ouvintes mensais</p></div></div><div class="sp-main-grid"><div><h2>Populares</h2>${art.m.map((mus, idx) => `<div class="sp-song-row"><span>${idx+1}</span><img src="${mus.c}"><div>${mus.t}</div><div style="text-align:right;">${mus.s}</div></div>`).join('')}</div><div><h2>Sobre</h2><div class="sp-about-card">${art.bio}</div></div></div>`;
        } else if (p.toUpperCase().includes('YOUTUBE')) {
            profile.innerHTML = `<div class="channel-header"><div class="yt-banner" style="background-image: url('${art.capa}');"></div><div class="channel-meta"><img src="${art.capa}" class="avatar"><div><h2 class="c-name">${a}</h2><div class="c-stats">${art.ov} views mensais</div></div></div></div><div class="main-grid"><div><h2>Vídeos</h2>${art.m.map(mus => `<div class="v-item"><img src="${mus.c}" class="v-thumb"><div><b>${mus.t}</b><div>${mus.s} views</div></div></div>`).join('')}</div><div><h2>Bio</h2><div class="about-content">${art.bio}</div></div></div>`;
        } else if (p.toUpperCase().includes('APPLE')) {
            profile.innerHTML = `<div class="am-hero" style="background-image: url('${art.capa}');"><div class="am-hero-content"><h1>${a}</h1></div></div><div style="display:grid; grid-template-columns:1fr 2fr; gap:30px; padding:20px;"><div><h2>Sobre</h2><p>${art.ov} ouvintes</p><p>${art.bio}</p></div><div><h2>Músicas</h2>${art.m.map(mus => `<div style="display:flex; align-items:center; gap:15px; padding:10px 0; border-bottom:1px solid #222;"><img src="${mus.c}" style="width:40px; border-radius:4px;"><span>${mus.t}</span></div>`).join('')}</div></div>`;
        }
    } catch(e) { profile.innerHTML = "Erro ao carregar."; }
}

// === HALL OF FAME ===
async function loadHOFList() {
    const app = document.getElementById('app');
    document.body.className = 'theme-digital'; 
    try {
        const list = await fetch(API + "?action=getHOFList").then(r => r.json());
        let html = `<h2 style="text-align:center; color:#fff;">ARTISTS DIRECTORY</h2><div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap:20px;">`;
        list.forEach(a => {
            html += `<div onclick="loadHOFProfile('${a.name}')" style="background:#111; border:1px solid #333; border-radius:12px; padding:20px; text-align:center; cursor:pointer;"><img src="${a.img}" style="width:110px; height:110px; border-radius:50%; border:2px solid #d4af37;"><h3 style="color:#fff;">${a.name}</h3><p style="color:#888;">${a.country}</p></div>`;
        });
        app.innerHTML = html + `</div>`;
    } catch(e) { console.error(e); }
}

async function loadHOFProfile(artistName) {
    const app = document.getElementById('app');
    try {
        const a = await fetch(`${API}?action=getHOFProfile&artist=${encodeURIComponent(artistName)}`).then(r => r.json());
        const renderL = (l, c) => l.map((i, idx) => `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #1a1a1a;"><span style="color:#fff;">${i.t}</span><span style="color:${c};">${i.v}</span></div>`).join('');
        app.innerHTML = `<div style="max-width:1000px; margin:0 auto;"><button onclick="loadHOFList()" style="background:none; border:none; color:#d4af37; cursor:pointer;">← BACK</button><div style="display:flex; align-items:center; gap:35px; background:#111; padding:40px; border-radius:24px; border:1px solid #222; margin-bottom:30px;"><img src="${a.img}" style="width:150px; border-radius:50%; border:4px solid #d4af37;"><div><h1 style="color:#fff; font-size:45px;">${a.name}</h1><p style="color:#888;">${a.country} • ${a.style}</p></div></div><div style="display:grid; grid-template-columns:repeat(4,1fr); gap:15px; margin-bottom:30px;">${['HOT100','SPOTIFY','YOUTUBE','BB200'].map((n, idx) => `<div style="background:#111; padding:20px; border-radius:12px; text-align:center;"><div style="font-size:32px; color:#d4af37;">${[a.n1_hot100, a.n1_spotify, a.n1_youtube, a.n1_bb200][idx]}</div><small style="color:#666;">#1 ${n}</small></div>`).join('')}</div><div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:20px;"><div><h3 style="color:#fff;">YouTube</h3>${renderL(a.yt, '#ff0000')}</div><div><h3 style="color:#fff;">Spotify</h3>${renderL(a.sp, '#1DB954')}</div><div><h3 style="color:#fff;">Apple</h3>${renderL(a.am, '#FA243C')}</div></div></div>`;
    } catch(e) { console.error(e); }
}

// === REAL TIME ===
async function loadRealTime() {
    const app = document.getElementById('app');
    document.body.className = 'theme-spotify';
    try {
        const d = await fetch(API + "?action=getRealTime").then(r => r.json());
        const row = (l, c) => l.map(i => `<div class="chart-row" style="grid-template-columns:30px 45px 1fr 85px;"><div class="rank" style="color:#888;">${i.p}</div><img src="${i.c}"><div><b>${i.t}</b></div><div style="color:${c}; text-align:right;">${i.s}</div></div>`).join('');
        app.innerHTML = `<div class="rt-grid"><div class="rt-col"><div class="rt-head" style="background:#1DB954;">Spotify</div>${row(d.spotify, '#1DB954')}</div><div class="rt-col"><div class="rt-head" style="background:#fff; color:#FA243C;">Apple</div>${row(d.apple, '#FA243C')}</div><div class="rt-col"><div class="rt-head" style="background:#f00;">YouTube</div>${row(d.youtube, '#fff')}</div></div>`;
    } catch(e) { console.error(e); }
}

async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    applyTheme(tab);
    try {
        const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
        app.innerHTML = `<h2 style="text-align:center;">${tab}</h2><div class="filters"><select id="dateS" onchange="renderChart('${tab}', ${hasStyle})">${f.dates.map(d => `<option value="${d}">${d}</option>`).join('')}</select>${hasStyle ? `<select id="styleS" onchange="renderChart('${tab}', true)"><option value="">TODOS</option>${f.styles.map(s => `<option value="${s}">${s}</option>`).join('')}</select>` : ''}</div><div id="chart-area"></div>`;
        renderChart(tab, hasStyle);
    } catch(e) { console.error(e); }
}

async function renderChart(tab, hasStyle) {
    const area = document.getElementById('chart-area');
    const d = document.getElementById('dateS').value;
    const s = hasStyle ? document.getElementById('styleS').value : "";
    try {
        const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${d}&style=${s}`).then(r => r.json());
        area.innerHTML = res.map(i => `<div class="chart-row"><div class="rank">${i.pos}</div><div class="status">${i.st || '-'}</div><img src="${i.capa}"><div><b>${i.tit}</b><br><small>${i.art}</small></div><div class="stats-box"><b>${i.val}</b></div></div>`).join('');
    } catch(e) { console.error(e); }
}

function applyTheme(tab) { const body = document.body; body.className = ''; if (!tab) return; const t = tab.toUpperCase(); if(t.includes('SPOTIFY')) body.classList.add('theme-spotify'); else if(t.includes('APPLE')) body.classList.add('theme-apple'); else if(t.includes('YOUTUBE')) body.classList.add('theme-youtube'); else if(t.includes('DIGITAL SALES')) body.classList.add('theme-digital'); else if(t.includes('BILLBOARD') || t.includes('ÁLBUNS')) body.classList.add('theme-billboard'); else body.classList.add('theme-spotify'); }
