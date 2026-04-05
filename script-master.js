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

// === DIRETÓRIO DE ARTISTAS (CARDS RESTAURADOS) ===
async function loadHOFList() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    try {
        const list = await fetch(API + "?action=getHOFList").then(r => r.json());
        let html = `<h2 style="text-align:center; font-family:'Plus Jakarta Sans'; font-weight:800; font-size:24px; letter-spacing:5px; margin-bottom:40px;">DIRECTORY</h2>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:25px;">`;
        list.forEach(a => {
            html += `<div class="hof-card" onclick="loadHOFProfile('${a.name}')">
                <img src="${a.img}" onerror="this.src='https://via.placeholder.com/150'">
                <h3 style="font-size:15px; color:#fff; margin:0;">${a.name}</h3>
                <p style="font-size:10px; color:#555; margin-top:5px; text-transform:uppercase;">${a.country}</p>
            </div>`;
        });
        app.innerHTML = html + `</div>`;
    } catch(e) { console.error(e); }
}

// === PERFIL DO ARTISTA (ÁLBUNS E CORES VOLTARAM) ===
async function loadHOFProfile(artistName) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton" style="height:400px; border-radius:30px;"></div>';
    try {
        const a = await fetch(`${API}?action=getHOFProfile&artist=${encodeURIComponent(artistName)}`).then(r => r.json());
        const renderL = (l, c) => l.map((i, idx) => `<div class="chart-row"><div class="rank">${idx+1}</div><img src="${a.img}" style="width:35px; height:35px; border-radius:4px;"><div class="info-box"><b>${i.t}</b></div><span style="color:${c}; font-weight:800; font-size:12px; text-align:right;">${i.v}</span></div>`).join('');
        
        app.innerHTML = `
            <button onclick="loadHOFList()" style="background:transparent; border:none; color:#444; cursor:pointer; font-weight:800; margin-bottom:20px;">← BACK</button>
            <div class="artist-hero" style="background-image: url('${a.img}');"><div class="hero-overlay"></div><div class="hero-content"><h1>${a.name}</h1><p style="color:#888;">${a.country} • ${a.style}</p></div></div>
            
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:15px; margin-bottom:40px;">
                <div style="background:#111; padding:20px; border-radius:15px; text-align:center; border:1px solid #222;"><div style="font-size:24px; font-weight:800; color:var(--gold);">${a.n1_hot100}</div><div style="font-size:9px; color:#444;">HOT 100</div></div>
                <div style="background:#111; padding:20px; border-radius:15px; text-align:center; border:1px solid #222;"><div style="font-size:24px; font-weight:800; color:#1DB954;">${a.n1_spotify}</div><div style="font-size:9px; color:#444;">SPOTIFY</div></div>
                <div style="background:#111; padding:20px; border-radius:15px; text-align:center; border:1px solid #222;"><div style="font-size:24px; font-weight:800; color:#ff0000;">${a.n1_youtube}</div><div style="font-size:9px; color:#444;">YOUTUBE</div></div>
                <div style="background:#111; padding:20px; border-radius:15px; text-align:center; border:1px solid #222;"><div style="font-size:24px; font-weight:800; color:var(--gold);">${a.n1_bb200}</div><div style="font-size:9px; color:#444;">BB 200</div></div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:25px; margin-bottom:40px;">
                <div><h4 style="font-size:11px; color:var(--youtube); letter-spacing:2px; border-bottom:1px solid #222; padding-bottom:10px;">YOUTUBE</h4>${renderL(a.yt, '#ff0000')}</div>
                <div><h4 style="font-size:11px; color:var(--spotify); letter-spacing:2px; border-bottom:1px solid #222; padding-bottom:10px;">SPOTIFY</h4>${renderL(a.sp, '#1DB954')}</div>
                <div><h4 style="font-size:11px; color:var(--apple); letter-spacing:2px; border-bottom:1px solid #222; padding-bottom:10px;">APPLE</h4>${renderL(a.am, '#FA243C')}</div>
            </div>

            <div style="display:grid; grid-template-columns: 1fr 2fr; gap:40px;">
                <div><h4 style="font-size:11px; color:var(--gold); letter-spacing:2px; border-bottom:1px solid #222; padding-bottom:10px;">TOP ALBUMS</h4>${renderL(a.alb, '#fff')}</div>
                <div><h4 style="font-size:11px; color:#444; letter-spacing:2px; border-bottom:1px solid #222; padding-bottom:10px;">HOT 100 HISTORY</h4>
                    <div style="max-height: 400px; overflow-y: auto;">
                        ${a.runs.map(i => `<div style="background:#111; padding:12px; border-radius:10px; margin-bottom:10px; border-left:3px solid #fff;"><b style="font-size:12px;">${i.t}</b><div style="color:#666; font-size:11px; margin-top:5px; font-family:monospace;">${i.v}</div></div>`).join('')}
                    </div>
                </div>
            </div>`;
    } catch(e) { console.error(e); }
}

// Funções de Inicialização (Cascata de Filtros)
async function initMonthly(p) {
    const app = document.getElementById('app');
    app.innerHTML = `<div class="filter-group"><div id="year-pills" class="pill-container"></div><div id="month-pills" class="pill-container"></div><div id="artist-select-wrap" style="display:none; width:100%; max-width:400px; margin: 0 auto;"><select id="aS" onchange="renderM('${p}')" style="width:100%; background:#111; color:#fff; border:1px solid #222; padding:12px; border-radius:12px;"></select></div></div><div id="profile-area"></div>`;
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

// O restante das funções (loadRealTime, initChart, renderChart) segue a mesma lógica original de design chique.
