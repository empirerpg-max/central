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

// === HALL OF FAME: DIRETÓRIO E PERFIL (FULL) ===

async function loadHOFList() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton"></div>'.repeat(3);
    document.body.className = 'theme-digital'; 
    try {
        const list = await fetch(API + "?action=getHOFList").then(r => r.json());
        let html = `<h2 style="text-align:center; font-family:'Figtree'; font-weight:900; font-size:32px; margin-bottom:30px; color:#fff;">ARTISTS DIRECTORY</h2>
        <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:20px;">`;
        list.forEach(a => {
            html += `<div onclick="loadHOFProfile('${a.name}')" style="background:#111; border:1px solid #333; border-radius:12px; padding:20px; text-align:center; cursor:pointer; transition:0.3s;" onmouseover="this.style.borderColor='#d4af37';" onmouseout="this.style.borderColor='#333';">
                <img src="${a.img}" style="width:110px; height:110px; border-radius:50%; object-fit:cover; margin-bottom:15px; border:2px solid #d4af37;">
                <h3 style="margin:0; font-size:18px; color:#fff;">${a.name}</h3>
                <p style="margin:5px 0 0 0; font-size:11px; color:#888;">${a.country}</p></div>`;
        });
        app.innerHTML = html + `</div>`;
    } catch(e) { console.error(e); }
}

async function loadHOFProfile(artistName) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="skeleton" style="height:400px;"></div>';
    try {
        const a = await fetch(`${API}?action=getHOFProfile&artist=${encodeURIComponent(artistName)}`).then(r => r.json());
        const renderList = (list, color) => {
            if(!list || list.length === 0) return `<p style="color:#444;">Sem dados registrados.</p>`;
            return list.map((i, idx) => `<div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid #1a1a1a;"><div style="display:flex; gap:10px;"><span style="color:#444; font-weight:900;">${idx+1}</span><span style="color:#fff;">${i.t}</span></div><span style="color:${color}; font-weight:900;">${i.v}</span></div>`).join('');
        };
        const renderRuns = (list) => list.map(i => `<div style="background:#161616; padding:12px; border-radius:8px; margin-bottom:10px; border-left:3px solid #d4af37;"><b style="color:#fff;">${i.t}</b><div style="color:#d4af37; font-family:monospace; font-size:12px; overflow-x:auto;">${i.v}</div></div>`).join('');

        app.innerHTML = `<div style="max-width:1000px; margin:0 auto;"><button onclick="loadHOFList()" style="background:transparent; border:none; color:#d4af37; cursor:pointer; font-weight:900; margin-bottom:20px;">← BACK TO DIRECTORY</button>
            <div style="display:flex; align-items:center; gap:35px; background:linear-gradient(135deg, #111 0%, #050505 100%); padding:40px; border-radius:24px; border:1px solid rgba(212,175,55,0.2); margin-bottom:35px;"><img src="${a.img}" style="width:160px; height:160px; border-radius:50%; object-fit:cover; border:5px solid #d4af37;">
            <div><h1 style="font-family:'Figtree'; font-size:50px; font-weight:900; margin:0; color:#fff;">${a.name}</h1><p style="color:#888;">${a.country} • ${a.style}</p></div></div>
            <div style="display:grid; grid-template-columns: repeat(4, 1fr); gap:15px; margin-bottom:40px;">
                <div style="background:#111; padding:20px; border-radius:16px; text-align:center; border:1px solid #222;"><div style="color:#d4af37; font-size:36px; font-weight:900;">${a.n1_hot100}</div><small style="color:#666;">#1 HOT 100</small></div>
                <div style="background:#111; padding:20px; border-radius:16px; text-align:center; border:1px solid #222;"><div style="color:#1DB954; font-size:36px; font-weight:900;">${a.n1_spotify}</div><small style="color:#666;">#1 SPOTIFY</small></div>
                <div style="background:#111; padding:20px; border-radius:16px; text-align:center; border:1px solid #222;"><div style="color:#ff0000; font-size:36px; font-weight:900;">${a.n1_youtube}</div><small style="color:#666;">#1 YOUTUBE</small></div>
                <div style="background:#111; padding:20px; border-radius:16px; text-align:center; border:1px solid #222;"><div style="color:#d4af37; font-size:36px; font-weight:900;">${a.n1_bb200}</div><small style="color:#666;">#1 BB 200</small></div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap:20px; margin-bottom:40px;">
                <div><h2 style="color:#fff; border-bottom:2px solid #ff0000; padding-bottom:8px;">YouTube</h2>${renderList(a.yt, '#ff0000')}</div>
                <div><h2 style="color:#fff; border-bottom:2px solid #1DB954; padding-bottom:8px;">Spotify</h2>${renderList(a.sp, '#1DB954')}</div>
                <div><h2 style="color:#fff; border-bottom:2px solid #FA243C; padding-bottom:8px;">Apple</h2>${renderList(a.am, '#FA243C')}</div>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 2fr; gap:30px;">
                <div><h2 style="color:#fff; border-bottom:2px solid #d4af37; padding-bottom:8px;">Albums</h2>${renderList(a.alb, '#d4af37')}</div>
                <div><h2 style="color:#fff; border-bottom:2px solid #d4af37; padding-bottom:8px;">History</h2>${renderRuns(a.runs)}</div>
            </div></div>`;
    } catch(e) { console.error(e); }
}

// === ARTISTAS MENSAL (VERSÃO CLÁSSICA) ===

async function initMonthly(p) {
    const app = document.getElementById('app');
    applyTheme(p);
    app.innerHTML = '<div class="filters"><select id="yS" onchange="upM(\''+p+'\')"></select><select id="mS" onchange="upA(\''+p+'\')"></select><select id="aS" onchange="renderM(\''+p+'\')"></select></div><div id="profile-area"></div>';
    const years = await fetch(`${API}?action=getMonthlyYears`).then(r => r.json());
    document.getElementById('yS').innerHTML = years.map(y => `<option value="${y}">${y}</option>`).join('');
    upM(p);
}

async function upM(p) {
    const y = document.getElementById('yS').value;
    const months = await fetch(`${API}?action=getMonthlyDates&year=${y}`).then(r => r.json());
    document.getElementById('mS').innerHTML = months.map(m => `<option value="${m}">${m}</option>`).join('');
    upA(p);
}

async function upA(p) {
    const y = document.getElementById('yS').value;
    const m = document.getElementById('mS').value;
    const artists = await fetch(`${API}?action=getArtists&platform=${p}&month=${m}&year=${y}`).then(r => r.json());
    document.getElementById('aS').innerHTML = `<option value="">SELECT ARTIST</option>` + artists.map(a => `<option value="${a}">${a}</option>`).join('');
}

async function renderM(p) {
    const profile = document.getElementById('profile-area');
    const a = document.getElementById('aS').value;
    const y = document.getElementById('yS').value;
    const m = document.getElementById('mS').value;
    if(!a) return;
    profile.innerHTML = '<div class="skeleton"></div>';
    try {
        const data = await fetch(`${API}?action=getMonthlyStats&platform=${p}&month=${m}&year=${y}&artist=${a}`).then(r => r.json());
        const art = data[0];
        if (p.includes('SPOTIFY')) {
            profile.innerHTML = `<div class="sp-banner" style="background-image: url('${art.capa}');"><div class="sp-banner-content"><h1 class="sp-artist-name">${a}</h1><p>${art.ov} ouvintes mensais</p></div></div><div style="display:grid; grid-template-columns:2fr 1fr; gap:40px; padding:20px;"><div><h2>Populares</h2>${art.m.map((mus, idx) => `<div class="chart-row" style="background:transparent; grid-template-columns: 30px 45px 1fr 100px;"><span>${idx+1}</span><img src="${mus.c}"><b>${mus.t}</b><span style="text-align:right;">${mus.s}</span></div>`).join('')}</div><div><h2>Sobre</h2><div class="sp-about-card">${art.bio}</div></div></div>`;
        } else if (p.includes('YOUTUBE')) {
            profile.innerHTML = `<div class="channel-header"><div class="yt-banner" style="background-image: url('${art.capa}');"></div><div class="channel-meta"><img src="${art.capa}" class="avatar"><div><h2>${a}</h2><div>${art.ov} views</div></div></div></div><div style="display:grid; grid-template-columns:2fr 1fr; gap:40px; padding:20px;"><div><h2>Vídeos</h2>${art.m.map(mus => `<div style="display:flex; gap:15px; margin-bottom:20px;"><img src="${mus.c}" style="width:160px; border-radius:8px;"><b>${mus.t}</b></div>`).join('')}</div><div><h2>Bio</h2><p>${art.bio}</p></div></div>`;
        } else if (p.includes('APPLE')) {
            profile.innerHTML = `<div class="am-hero" style="background-image: url('${art.capa}');"><div class="am-hero-content"><h1>${a}</h1></div></div><div style="display:grid; grid-template-columns:1fr 2fr; gap:40px; padding:20px;"><div><h2>Sobre</h2><p>${art.ov} ouvintes</p><p style="color:#888;">${art.bio}</p></div><div><h2>Top Songs</h2>${art.m.map(mus => `<div class="chart-row" style="grid-template-columns:50px 1fr 100px; background:transparent;"><img src="${mus.c}" style="width:45px; border-radius:4px;"><span>${mus.t}</span><span style="text-align:right;">${mus.s}</span></div>`).join('')}</div></div>`;
        }
    } catch(e) { console.error(e); }
}

// === REAL TIME E CHARTS ===

async function loadRealTime() {
    const app = document.getElementById('app');
    document.body.className = 'theme-spotify';
    const d = await fetch(API + "?action=getRealTime").then(r => r.json());
    const row = (l, c) => l.map(i => `<div class="chart-row" style="grid-template-columns:30px 45px 1fr 85px;"><div class="rank" style="color:#666; font-weight:900;">${i.p}</div><img src="${i.c}"><div><b>${i.t}</b></div><div style="color:${c}; text-align:right; font-weight:900;">${i.s}</div></div>`).join('');
    app.innerHTML = `<div class="rt-grid"><div class="rt-col"><div class="rt-head" style="background:#1DB954;">Spotify</div>${row(d.spotify, '#1DB954')}</div><div class="rt-col"><div class="rt-head" style="background:#fff; color:#FA243C;">Apple</div>${row(d.apple, '#FA243C')}</div><div class="rt-col"><div class="rt-head" style="background:#f00;">YouTube</div>${row(d.youtube, '#fff')}</div></div>`;
}

async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    applyTheme(tab);
    const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
    app.innerHTML = `<h2 style="text-align:center;">${tab}</h2><div class="filters"><select id="dateS" onchange="renderChart('${tab}', ${hasStyle})">${f.dates.map(d => `<option value="${d}">${d}</option>`).join('')}</select>${hasStyle ? `<select id="styleS" onchange="renderChart('${tab}', true)"><option value="">TODOS</option>${f.styles.map(s => `<option value="${s}">${s}</option>`).join('')}</select>` : ''}</div><div id="chart-area"></div>`;
    renderChart(tab, hasStyle);
}

async function renderChart(tab, hasStyle) {
    const area = document.getElementById('chart-area');
    const d = document.getElementById('dateS').value;
    const s = hasStyle ? document.getElementById('styleS').value : "";
    const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${d}&style=${s}`).then(r => r.json());
    area.innerHTML = res.map(i => `<div class="chart-row"><div class="rank">${i.pos}</div><div class="status">${i.st || '-'}</div><img src="${i.capa}"><div><b>${i.tit}</b><br><small>${i.art}</small></div><div class="stats-box"><b>${i.val}</b></div></div>`).join('');
}

function applyTheme(tab) { const body = document.body; body.className = ''; if (!tab) return; const t = tab.toUpperCase(); if(t.includes('SPOTIFY')) body.classList.add('theme-spotify'); else if(t.includes('APPLE')) body.classList.add('theme-apple'); else if(t.includes('YOUTUBE')) body.classList.add('theme-youtube'); else if(t.includes('DIGITAL SALES')) body.classList.add('theme-digital'); else if(t.includes('BILLBOARD') || t.includes('ÁLBUNS')) body.classList.add('theme-billboard'); else body.classList.add('theme-spotify'); }
