// A SUA API CONTINUA INTACTA. COLOQUE A URL AQUI:
const API = "https://script.google.com/macros/s/AKfycbyDQK3x0fU5V6qnFgtRyf8IPTNPDm2eeQsvZRwmHnCb_sCKLyc8wuwhuNZxEWjGEiYe/exec"; 

function buildMenu() {
    const nav = document.getElementById('menu-nav');
    if(!nav) return;
    nav.innerHTML = `
    <a href="index.html" class="menu-item">Início / Real Time</a>
    <div class="menu-item">Billboard Hot 100 Charts
        <div class="submenu">
            <a href="charts.html?tab=BILLBOARD HOT 100" class="sub-btn">Billboard Hot 100</a>
            <a href="charts.html?tab=BILLBOARD HOT 100&style=true" class="sub-btn">Hot 100 by Music Style</a>
        </div>
    </div>
    <div class="menu-item">Spotify Charts
        <div class="submenu">
            <a href="charts.html?tab=SPOTIFY" class="sub-btn">Spotify Global</a>
            <a href="countries.html?tab=SPOTIFY COUNTRIES" class="sub-btn">Spotify by Country</a>
            <a href="charts.html?tab=SPOTIFY&style=true" class="sub-btn">Spotify by Style</a>
            <a href="monthly.html?p=SPOTIFY" class="sub-btn">Spotify Artists</a>
        </div>
    </div>
    <div class="menu-item">Apple Music Charts
        <div class="submenu">
            <a href="charts.html?tab=APPLE MUSIC" class="sub-btn">Apple Music Global</a>
            <a href="countries.html?tab=APPLE MUSIC COUNTRIES" class="sub-btn">Apple Music by Country</a>
            <a href="charts.html?tab=APPLE MUSIC&style=true" class="sub-btn">Apple Music by Style</a>
            <a href="monthly.html?p=APPLE MUSIC" class="sub-btn">Apple Music Artists</a>
        </div>
    </div>
    <div class="menu-item">YouTube Charts
        <div class="submenu">
            <a href="charts.html?tab=YOUTUBE" class="sub-btn">YouTube Global</a>
            <a href="countries.html?tab=YOUTUBE COUNTRIES" class="sub-btn">YouTube by Country</a>
            <a href="charts.html?tab=YOUTUBE&style=true" class="sub-btn">YouTube by Style</a>
            <a href="monthly.html?p=YOUTUBE" class="sub-btn">YouTube Artists</a>
        </div>
    </div>
    <a href="charts.html?tab=DIGITAL SALES" class="menu-item">Digital Sales</a>
    <div class="menu-item">Billboard 200 Charts
        <div class="submenu">
            <a href="charts.html?tab=DADOS ÁLBUNS" class="sub-btn">Billboard 200</a>
            <a href="charts.html?tab=DADOS ÁLBUNS&style=true" class="sub-btn">Billboard 200 by Music Style</a>
        </div>
    </div>`;
}

// === A MÁGICA DOS TEMAS ACONTECE AQUI ===
function applyTheme(tab) {
    const body = document.body;
    body.className = ''; // Limpa temas anteriores
    if (!tab) return;
    
    const t = tab.toUpperCase();
    if(t.includes('SPOTIFY')) body.classList.add('theme-spotify');
    else if(t.includes('APPLE')) body.classList.add('theme-apple');
    else if(t.includes('YOUTUBE')) body.classList.add('theme-youtube');
    else if(t.includes('DIGITAL SALES')) body.classList.add('theme-digital');
    else if(t.includes('BILLBOARD') || t.includes('ÁLBUNS')) body.classList.add('theme-billboard');
    else body.classList.add('theme-spotify'); // Padrão
}

// Retorna os textos de status de acordo com o docx
function getStatsText(val, total, tab) {
    const t = tab.toUpperCase();
    if(t.includes('BILLBOARD HOT 100')) return `<b>${val} PTS</b><small></small>`;
    if(t.includes('ÁLBUNS')) return `<b>${val} UNIDADES</b><small>Total: ${total || 0}</small>`;
    if(t.includes('YOUTUBE')) return `<b>${val} VIEWS</b><small>Acumulado: ${total || 0}</small>`;
    if(t.includes('APPLE') || t.includes('SPOTIFY')) return `<b>${val}</b><small>Total: ${total || 0}</small>`;
    if(t.includes('DIGITAL SALES')) return `<b>${val}</b><small>Total: ${total || 0}</small>`;
    return `<b>${val}</b><small>Total: ${total || 0}</small>`;
}

async function loadRealTime() {
    const app = document.getElementById('app');
    if(!app) return;
    document.body.classList.add('theme-spotify'); // Fundo escuro pro Real Time
    app.innerHTML = '<div class="skeleton"></div>'.repeat(6);
    
    try {
        const d = await fetch(API + "?action=getRealTime").then(r => r.json());
        const row = (l, color) => l.map(i => `
            <div class="chart-row" style="grid-template-columns:30px 50px 1fr 90px; background:transparent; border-bottom:1px solid #222;">
                <div class="rank" style="font-size:16px; color:#aaa;">${i.p}</div>
                <img src="${i.c}" onerror="this.src='https://via.placeholder.com/150'">
                <div class="info-box"><b style="font-size:13px; color:#fff;">${i.t}</b></div>
                <div style="text-align:right; color:${color}; font-weight:900;">${i.s}</div>
            </div>`).join('');
        
        app.innerHTML = `<div class="rt-grid">
            <div class="rt-col"><div class="rt-head" style="background:#1DB954; color:#000;">Spotify</div>${row(d.spotify, '#1DB954')}</div>
            <div class="rt-col"><div class="rt-head" style="background:#fff; color:#FA243C;">Apple</div>${row(d.apple, '#FA243C')}</div>
            <div class="rt-col"><div class="rt-head" style="background:#FF0000; color:#fff;">YouTube</div>${row(d.youtube, '#fff')}</div>
        </div>`;
    } catch (e) { app.innerHTML = `<p style="text-align:center; color:red;">Erro de conexão. Tente atualizar a página.</p>`; }
}

async function initChart(tab, hasStyle) {
    const app = document.getElementById('app');
    if(!app) return;
    applyTheme(tab);
    app.innerHTML = '<div class="skeleton"></div>'.repeat(8);
    
    try {
        const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
        app.innerHTML = `
            <h2 style="text-align:center; font-weight:900; text-transform:uppercase; margin-bottom:20px;">${tab}</h2>
            <div class="filters">
                <select id="dateS" onchange="renderChart('${tab}', ${hasStyle})">${f.dates.map(d => `<option value="${d}">${d}</option>`).join('')}</select>
                ${hasStyle ? `<select id="styleS" onchange="renderChart('${tab}', true)"><option value="">TODOS OS ESTILOS</option>${f.styles.map(s => `<option value="${s}">${s}</option>`).join('')}</select>` : ''}
            </div><div id="chart-area"></div>`;
        renderChart(tab, hasStyle);
    } catch(e) { app.innerHTML = `<p style="text-align:center;">Erro ao carregar os filtros.</p>`; }
}

async function renderChart(tab, hasStyle) {
    const area = document.getElementById('chart-area');
    if(!area) return;
    area.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    
    const date = document.getElementById('dateS').value;
    const style = hasStyle ? document.getElementById('styleS').value : "";
    
    try {
        const res = await fetch(`${API}?action=getChart&tab=${tab}&date=${date}&style=${style}`).then(r => r.json());
        area.innerHTML = res.map(i => {
            let stClass = "neutral"; let stIcon = "-";
            if(i.st && i.st.toUpperCase().includes("NEW")) { stClass = "new"; stIcon = "NEW"; }
            else if(i.st && (i.st.includes("↑") || i.st.toLowerCase().includes("subiu"))) { stClass = "up"; stIcon = `▲<br><span style="font-size:10px;">${i.q || ''}</span>`; }
            else if(i.st && (i.st.includes("↓") || i.st.toLowerCase().includes("desceu"))) { stClass = "down"; stIcon = `▼<br><span style="font-size:10px;">${i.q || ''}</span>`; }

            return `
            <div class="chart-row">
                <div class="rank">${i.pos}</div>
                <div class="status ${stClass}">${stIcon}</div>
                <img src="${i.capa}" onerror="this.src='https://via.placeholder.com/150'">
                <div class="info-box"><b>${i.tit}</b><span>${i.art}</span></div>
                <div class="stats-box">${getStatsText(i.val, i.tot, tab)}</div>
            </div>`;
        }).join('');
    } catch(e) { area.innerHTML = `<p style="text-align:center;">Erro ao carregar a lista.</p>`; }
}

async function initCountry(tab) {
    const app = document.getElementById('app');
    if(!app) return;
    applyTheme(tab);
    app.innerHTML = '<div class="skeleton"></div>'.repeat(5);
    
    try {
        const f = await fetch(`${API}?action=getFilters&tab=${tab}`).then(r => r.json());
        app.innerHTML = `
            <h2 style="text-align:center; font-weight:900; text-transform:uppercase; margin-bottom:20px;">${tab}</h2>
            <div class="filters">
                <select id="countryS" onchange="renderCountry('${tab}')">${f.countries.map(c => `<option value="${c}">${c}</option>`).join('')}</select>
                <select id="dateS" onchange="renderCountry('${tab}')">${f.dates.map(d => `<option value="${d}">${d}</option>`).join('')}</select>
            </div><div id="chart-area"></div>`;
        renderCountry(tab);
    } catch(e) { app.innerHTML = `<p style="text-align:center;">Erro ao carregar países.</p>`; }
}

async function renderCountry(tab) {
    const area = document.getElementById('chart-area');
    if(!area) return;
    const c = document.getElementById('countryS').value;
    const d = document.getElementById('dateS').value;
    
    try {
        const res = await fetch(`${API}?action=getChart&tab=${tab}&country=${c}&date=${d}`).then(r => r.json());
        area.innerHTML = res.map(i => `
            <div class="chart-row" style="grid-template-columns: 50px 70px 1fr 130px;">
                <div class="rank">${i.pos}</div>
                <img src="${i.capa}" onerror="this.src='https://via.placeholder.com/150'">
                <div class="info-box"><b>${i.tit}</b><span>${i.art}</span></div>
                <div class="stats-box"><b>${i.val}</b><small>STREAMS/VIEWS</small></div>
            </div>`).join('');
    } catch(e) { area.innerHTML = `<p style="text-align:center;">Erro ao carregar dados do país.</p>`; }
}

async function initMonthly(p) {
    const app = document.getElementById('app');
    if(!app) return;
    applyTheme(p);
    app.innerHTML = '<div id="monthly-filters" class="filters"></div><div id="profile-area"></div>';
    
    try {
        const years = await fetch(`${API}?action=getMonthlyYears`).then(r => r.json());
        document.getElementById('monthly-filters').innerHTML = `
            <select id="yS" onchange="upM('${p}')">${years.map(y => `<option value="${y}">${y}</option>`).join('')}</select>
            <select id="mS" onchange="upA('${p}')"></select>
            <select id="aS" onchange="renderM('${p}')"></select>`;
        upM(p);
    } catch(e) { app.innerHTML = `<p style="text-align:center;">Erro ao iniciar painel mensal.</p>`; }
}

async function upM(p) {
    const y = document.getElementById('yS').value;
    const m = await fetch(`${API}?action=getMonthlyDates&year=${y}`).then(r => r.json());
    document.getElementById('mS').innerHTML = m.map(x => `<option value="${x}">${x}</option>`).join('');
    upA(p);
}

async function upA(p) {
    const y = document.getElementById('yS').value;
    const m = document.getElementById('mS').value;
    const a = await fetch(`${API}?action=getArtists&platform=${p}&month=${m}&year=${y}`).then(r => r.json());
    document.getElementById('aS').innerHTML = a.map(x => `<option value="${x}">${x}</option>`).join('');
    renderM(p);
}

async function renderM(p) {
    const profile = document.getElementById('profile-area');
    if(!profile) return;
    profile.innerHTML = '<div class="skeleton" style="height:300px;"></div>';
    
    const y = document.getElementById('yS').value;
    const m = document.getElementById('mS').value;
    const a = document.getElementById('aS').value;
    
    try {
        const data = await fetch(`${API}?action=getMonthlyStats&platform=${p}&month=${m}&year=${y}&artist=${a}`).then(r => r.json());
        const art = data[0];

        profile.innerHTML = `
            <div style="text-align:center; padding: 40px; margin-bottom:30px; border-bottom:1px solid var(--border-dark);">
                <img src="${art.capa}" style="width:200px; height:200px; border-radius:50%; object-fit:cover; margin-bottom:20px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
                <h2 style="font-size:45px; margin:0; font-weight:900;">${a}</h2>
                <p style="font-size:20px; font-weight:700;">${art.ov} OUVINTES MENSAIS</p>
                ${art.rank !== '-' ? `<span class="status new" style="padding:6px 12px; font-size:12px;">TOP ${art.rank} MENSAL</span>` : ''}
            </div>
            <div style="display:grid; grid-template-columns: 1.5fr 1fr; gap:40px;">
                <div>
                    <h3 style="padding-bottom:10px;">Top Músicas</h3>
                    ${art.m.map((mus, idx) => `
                        <div class="chart-row" style="grid-template-columns:30px 50px 1fr 100px; padding:10px 0;">
                            <div class="rank" style="font-size:16px;">${idx+1}</div>
                            <img src="${mus.c}">
                            <div class="info-box"><b>${mus.t}</b></div>
                            <div class="stats-box"><b style="font-size:14px;">${mus.s}</b></div>
                        </div>`).join('')}
                </div>
                <div>
                    <h3 style="padding-bottom:10px;">Sobre o Artista</h3>
                    <p style="line-height:1.6; font-size:14px;">${art.bio}</p>
                </div>
            </div>`;
    } catch(e) { profile.innerHTML = `<p style="text-align:center;">Erro ao carregar o artista.</p>`; }
}
