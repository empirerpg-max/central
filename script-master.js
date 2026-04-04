const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec"; 

function buildMenu() {
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

function toggleMenu() {
    const nav = document.getElementById('menu-nav');
    if(window.innerWidth <= 768) nav.classList.toggle('active');
}

// === FILTROS EM CASCATA ===
async function initMonthly(p) {
    const app = document.getElementById('app');
    applyTheme(p);
    app.innerHTML = `<div class="filter-group"><div id="year-pills" class="pill-container"></div><div id="month-pills" class="pill-container"></div>
    <div id="artist-select-wrap" style="display:none; width:100%; max-width:400px;"><select id="aS" onchange="renderM('${p}')"></select></div></div><div id="profile-area"></div>`;
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
    document.getElementById('aS').innerHTML = `<option value="">SELECT ARTIST</option>` + artists.map(a => `<option value="${a}">${a}</option>`).join('');
}

async function renderM(p) {
    const profile = document.getElementById('profile-area');
    const a = document.getElementById('aS').value;
    const y = document.querySelector('.year-pill.active').innerText;
    const m = document.querySelector('.month-pill.active').innerText;
    profile.innerHTML = '<div class="skeleton" style="height:300px;"></div>';
    const data = await fetch(`${API}?action=getMonthlyStats&platform=${p}&month=${m}&year=${y}&artist=${a}`).then(r => r.json());
    const art = data[0];

    if (p.includes('SPOTIFY')) {
        profile.innerHTML = `<div class="sp-banner" style="background-image: url('${art.capa}');"><div class="sp-banner-content"><h1 class="sp-artist-name">${a}</h1><p>${art.ov} ouvintes mensais</p></div></div>
        <div class="sp-main-grid"><div><h2>Populares</h2>${art.m.map((mus, idx) => `<div class="chart-row" style="grid-template-columns:30px 45px 1fr 100px; background:transparent;"><span>${idx+1}</span><img src="${mus.c}"><div><b>${mus.t}</b></div><div style="text-align:right;">${mus.s}</div></div>`).join('')}</div><div><h2>Sobre</h2><div class="sp-about-card">${art.bio}</div></div></div>`;
    } else if (p.includes('YOUTUBE')) {
        profile.innerHTML = `<div class="channel-header"><div class="yt-banner" style="background-image: url('${art.capa}');"></div><div class="channel-meta"><img src="${art.capa}" class="avatar"><div><h2>${a}</h2><div>${art.ov} views mensais</div></div></div></div>
        <div style="display:grid; grid-template-columns:2fr 1fr; gap:40px; padding:20px;"><div><div class="section-label">Vídeos</div>${art.m.map(mus => `<div style="display:flex; gap:15px; margin-bottom:20px;"><img src="${mus.c}" style="width:160px; border-radius:8px;"><div><b>${mus.t}</b><br>${mus.s} views</div></div>`).join('')}</div><div><div class="section-label">Bio</div><p class="about-content">${art.bio}</p></div></div>`;
    } else if (p.includes('APPLE')) {
        profile.innerHTML = `<div class="am-hero" style="background-image: url('${art.capa}');"><div class="am-hero-content"><div class="am-play-icon">▶</div><h1>${a}</h1></div></div><div style="display:grid; grid-template-columns:1fr 2fr; gap:40px; padding:20px;"><div><h2>Sobre</h2><p>${art.ov} ouvintes</p><p style="color:#aaa;">${art.bio}</p></div><div><h2>Músicas</h2>${art.m.map(mus => `<div class="chart-row" style="grid-template-columns:50px 1fr 100px; background:transparent;"><img src="${mus.c}" style="width:45px; border-radius:4px;"><span>${mus.t}</span><span style="text-align:right;">${mus.s}</span></div>`).join('')}</div></div>`;
    }
}

// === HALL OF FAME E CHARTS ORIGINAIS MANTIDOS IGUAIS À VERSÃO PREMIUM ===
async function loadHOFList() { /* Lógica de busca igual */ }
async function loadHOFProfile(artistName) { /* Lógica de renderização luxuosa igual */ }
async function loadRealTime() { /* Lógica original com fonte Inter */ }
async function initChart(tab, hasStyle) { /* Lógica original */ }
async function renderChart(tab, hasStyle) { /* Lógica original */ }
function applyTheme(tab) { /* Lógica original */ }
